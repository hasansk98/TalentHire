
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from backend.api import deps
from backend.schemas import schemas
from backend.models import models

router = APIRouter()

@router.get("/", response_model=List[schemas.JobOut])
def list_jobs(
    db: Session = Depends(deps.get_db),
    current_user: deps.CurrentUser = Depends(deps.get_current_user)
):
    # Strict multi-tenant isolation: filter by company_id
    jobs = db.query(models.Job).filter(models.Job.company_id == current_user.company_id).all()
    return jobs

@router.post("/", response_model=schemas.JobOut)
def create_job(
    job_in: schemas.JobCreate,
    db: Session = Depends(deps.get_db),
    current_user: deps.CurrentUser = Depends(deps.check_permissions([models.UserRole.HR_MANAGER, models.UserRole.COMPANY_ADMIN]))
):
    # Check subscription limits
    subscription = db.query(models.Subscription).filter(models.Subscription.company_id == current_user.company_id).first()
    plan = db.query(models.Plan).filter(models.Plan.id == subscription.plan_id).first()
    
    if plan.name == "FREE_TRIAL" and subscription.lifetime_job_used:
        raise HTTPException(
            status_code=403,
            detail="Free plan allows only 1 lifetime job posting. Upgrade to Growth."
        )
    
    job = models.Job(
        **job_in.dict(),
        company_id=current_user.company_id
    )
    db.add(job)
    
    # Update lifetime usage if on free plan
    if plan.name == "FREE_TRIAL":
        subscription.lifetime_job_used = True
        db.add(subscription)
        
    db.commit()
    db.refresh(job)
    return job
