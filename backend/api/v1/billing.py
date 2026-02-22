
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from backend.api import deps
from backend.models import models
from backend.schemas import schemas
from backend.services.razorpay_service import razorpay_service
from backend.services.invoice_service import invoice_service
from backend.core.config import settings
from uuid import UUID
from datetime import datetime, timedelta

router = APIRouter()

@router.get("/status")
def get_subscription_status(
    db: Session = Depends(deps.get_db),
    current_user: deps.CurrentUser = Depends(deps.get_current_user)
):
    sub = db.query(models.Subscription).filter(models.Subscription.company_id == current_user.company_id).first()
    plan = db.query(models.Plan).filter(models.Plan.id == sub.plan_id).first() if sub else None
    
    # Get current usage
    usage = db.query(models.UsageMetric).filter(models.UsageMetric.company_id == current_user.company_id).all()
    usage_map = {m.metric_name: m.count for m in usage}

    return {
        "plan_name": plan.name if plan else "FREE",
        "status": sub.status if sub else "TRIAL",
        "usage": usage_map,
        "limits": {
            "max_jobs": plan.max_jobs if plan else 1,
            "max_candidates": plan.max_candidates if plan else 10,
            "features": plan.features if plan else []
        }
    }

@router.get("/plans", response_model=List[Dict[str, Any]])
def list_available_plans(db: Session = Depends(deps.get_db)):
    return db.query(models.Plan).filter(models.Plan.is_active == True).all()

@router.post("/create-order", response_model=schemas.CreateOrderResponse)
def create_billing_order(
    order_in: schemas.CreateOrderRequest,
    db: Session = Depends(deps.get_db),
    current_user: deps.CurrentUser = Depends(deps.check_permissions([models.UserRole.COMPANY_ADMIN]))
):
    plan = db.query(models.Plan).filter(models.Plan.id == order_in.plan_id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    
    if plan.price_inr == 0:
        raise HTTPException(status_code=400, detail="Cannot create order for free plan")

    # Create Razorpay Order
    receipt = f"receipt_{current_user.company_id}_{int(datetime.utcnow().timestamp())}"
    try:
        razorpay_order = razorpay_service.create_order(plan.price_inr, receipt)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Razorpay order creation failed: {str(e)}")

    # Save payment record
    payment = models.Payment(
        company_id=current_user.company_id,
        plan_id=plan.id,
        amount_inr=plan.price_inr,
        razorpay_order_id=razorpay_order["id"],
        status="PENDING"
    )
    db.add(payment)
    db.commit()

    return {
        "order_id": razorpay_order["id"],
        "amount": plan.price_inr * 100, # In paise
        "currency": "INR",
        "key_id": settings.RAZORPAY_KEY_ID
    }

@router.post("/verify-payment")
def verify_billing_payment(
    verify_in: schemas.VerifyPaymentRequest,
    db: Session = Depends(deps.get_db),
    current_user: deps.CurrentUser = Depends(deps.check_permissions([models.UserRole.COMPANY_ADMIN]))
):
    # Verify Signature
    is_valid = razorpay_service.verify_signature(
        verify_in.razorpay_order_id,
        verify_in.razorpay_payment_id,
        verify_in.razorpay_signature
    )
    
    if not is_valid:
        raise HTTPException(status_code=400, detail="Invalid payment signature")

    # Update Payment Record
    payment = db.query(models.Payment).filter(
        models.Payment.razorpay_order_id == verify_in.razorpay_order_id
    ).first()
    
    if not payment:
        raise HTTPException(status_code=404, detail="Payment record not found")

    payment.razorpay_payment_id = verify_in.razorpay_payment_id
    payment.status = "SUCCESS"
    
    # Activate Subscription
    company = db.query(models.Company).filter(models.Company.id == current_user.company_id).first()
    sub = db.query(models.Subscription).filter(models.Subscription.company_id == current_user.company_id).first()
    plan = db.query(models.Plan).filter(models.Plan.id == payment.plan_id).first()
    
    # GST Logic & Invoice Generation
    gst_data = invoice_service.calculate_gst(plan.price_inr)
    invoice_num = f"TH-{int(datetime.utcnow().timestamp())}"
    
    invoice = models.Invoice(
        company_id=current_user.company_id,
        invoice_number=invoice_num,
        plan_id=plan.id,
        amount=gst_data['amount'],
        cgst=gst_data['cgst'],
        sgst=gst_data['sgst'],
        total_amount=gst_data['total_amount'],
        razorpay_payment_id=verify_in.razorpay_payment_id,
        issue_date=datetime.utcnow()
    )
    db.add(invoice)
    db.flush() # Get invoice ID

    # Generate PDF
    pdf_path = invoice_service.generate_pdf_invoice(
        {
            "invoice_number": invoice_num,
            "amount": gst_data['amount'],
            "cgst": gst_data['cgst'],
            "sgst": gst_data['sgst'],
            "total_amount": gst_data['total_amount'],
            "issue_date": invoice.issue_date
        },
        {
            "name": company.name,
            "gstin": company.gstin,
            "billing_address": company.billing_address
        },
        plan.name
    )
    invoice.pdf_path = pdf_path

    if not sub:
        sub = models.Subscription(
            company_id=current_user.company_id,
            plan_id=plan.id,
            status="ACTIVE",
            start_date=datetime.utcnow(),
            end_date=datetime.utcnow() + timedelta(days=30),
            auto_renew=True
        )
        db.add(sub)
    else:
        sub.plan_id = plan.id
        sub.status = "ACTIVE"
        sub.start_date = datetime.utcnow()
        sub.end_date = datetime.utcnow() + timedelta(days=30)
        sub.lifetime_job_used = False

    company.plan_id = plan.id
    db.commit()
    return {"status": "success", "plan": plan.name, "invoice_number": invoice_num}

@router.post("/webhook")
async def razorpay_webhook(
    request: Request,
    db: Session = Depends(deps.get_db)
):
    payload = await request.body()
    signature = request.headers.get("X-Razorpay-Signature")
    
    if not razorpay_service.verify_webhook_signature(payload, signature):
        raise HTTPException(status_code=400, detail="Invalid webhook signature")
    
    data = await request.json()
    event = data.get("event")
    
    if event == "payment.captured":
        payment_id = data["payload"]["payment"]["entity"]["id"]
        order_id = data["payload"]["payment"]["entity"]["order_id"]
        
        payment = db.query(models.Payment).filter(models.Payment.razorpay_order_id == order_id).first()
        if payment:
            payment.status = "SUCCESS"
            payment.razorpay_payment_id = payment_id
            db.commit()
            
    elif event == "payment.failed":
        order_id = data["payload"]["payment"]["entity"]["order_id"]
        payment = db.query(models.Payment).filter(models.Payment.razorpay_order_id == order_id).first()
        if payment:
            payment.status = "FAILED"
            db.commit()

    return {"status": "ok"}

@router.post("/upgrade/{plan_id}")
def upgrade_subscription(
    plan_id: UUID,
    db: Session = Depends(deps.get_db),
    current_user: deps.CurrentUser = Depends(deps.check_permissions([models.UserRole.COMPANY_ADMIN]))
):
    plan = db.query(models.Plan).filter(models.Plan.id == plan_id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")

    sub = db.query(models.Subscription).filter(models.Subscription.company_id == current_user.company_id).first()
    if not sub:
        sub = models.Subscription(company_id=current_user.company_id, plan_id=plan_id, status="ACTIVE")
        db.add(sub)
    else:
        sub.plan_id = plan_id
        sub.status = "ACTIVE"
    
    db.commit()
    return {"message": f"Successfully upgraded to {plan.name}"}

@router.post("/toggle-auto-renew")
def toggle_auto_renew(
    db: Session = Depends(deps.get_db),
    current_user: deps.CurrentUser = Depends(deps.get_current_user)
):
    sub = db.query(models.Subscription).filter(models.Subscription.company_id == current_user.company_id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Subscription not found")
    
    sub.auto_renew = not sub.auto_renew
    db.commit()
    return {"auto_renew": sub.auto_renew}

@router.get("/invoices")
def list_invoices(
    db: Session = Depends(deps.get_db),
    current_user: deps.CurrentUser = Depends(deps.get_current_user)
):
    return db.query(models.Invoice).filter(models.Invoice.company_id == current_user.company_id).order_by(models.Invoice.issue_date.desc()).all()

@router.get("/invoice/{invoice_id}/download")
def download_invoice(
    invoice_id: UUID,
    db: Session = Depends(deps.get_db),
    current_user: deps.CurrentUser = Depends(deps.get_current_user)
):
    from fastapi.responses import FileResponse
    invoice = db.query(models.Invoice).filter(
        models.Invoice.id == invoice_id,
        models.Invoice.company_id == current_user.company_id
    ).first()
    
    if not invoice or not invoice.pdf_path:
        raise HTTPException(status_code=404, detail="Invoice not found")
    
    return FileResponse(invoice.pdf_path, filename=f"Invoice-{invoice.invoice_number}.pdf")

@router.post("/renew")
def manual_renew(
    db: Session = Depends(deps.get_db),
    current_user: deps.CurrentUser = Depends(deps.get_current_user)
):
    sub = db.query(models.Subscription).filter(models.Subscription.company_id == current_user.company_id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Subscription not found")
    
    plan = db.query(models.Plan).filter(models.Plan.id == sub.plan_id).first()
    if plan.price_inr == 0:
        raise HTTPException(status_code=400, detail="Free plan cannot be renewed manually")

    # Create Razorpay Order for renewal
    receipt = f"renew_{current_user.company_id}_{int(datetime.utcnow().timestamp())}"
    razorpay_order = razorpay_service.create_order(plan.price_inr, receipt)

    payment = models.Payment(
        company_id=current_user.company_id,
        plan_id=plan.id,
        amount_inr=plan.price_inr,
        razorpay_order_id=razorpay_order["id"],
        status="PENDING"
    )
    db.add(payment)
    db.commit()

    return {
        "order_id": razorpay_order["id"],
        "amount": plan.price_inr * 100,
        "currency": "INR",
        "key_id": settings.RAZORPAY_KEY_ID
    }
