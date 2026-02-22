
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from backend.api import deps
from backend.models import models
from backend.schemas import schemas
from backend.services.ai_screening import AIScreeningEngine

router = APIRouter()

@router.get("/{company_slug}/jobs", response_model=List[schemas.JobOut])
def list_public_jobs(
    company_slug: str,
    db: Session = Depends(deps.get_db)
):
    """Lists all open jobs for a specific company slug for the public career portal."""
    company = db.query(models.Company).filter(models.Company.slug == company_slug).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    jobs = db.query(models.Job).filter(
        models.Job.company_id == company.id,
        models.Job.status == "OPEN"
    ).all()
    return jobs

@router.get("/{company_slug}/jobs/{job_id}", response_model=schemas.JobOut)
def get_public_job(
    company_slug: str,
    job_id: UUID,
    db: Session = Depends(deps.get_db)
):
    """Gets details for a specific job in a public context."""
    company = db.query(models.Company).filter(models.Company.slug == company_slug).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    job = db.query(models.Job).filter(
        models.Job.id == job_id,
        models.Job.company_id == company.id,
        models.Job.status == "OPEN"
    ).first()
    
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job

@router.post("/{company_slug}/apply/{job_id}")
async def public_apply(
    company_slug: str,
    job_id: UUID,
    background_tasks: BackgroundTasks,
    name: str,
    email: str,
    file: UploadFile = File(...),
    db: Session = Depends(deps.get_db)
):
    """Public candidate application with immediate background AI screening."""
    company = db.query(models.Company).filter(models.Company.slug == company_slug).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    job = db.query(models.Job).filter(models.Job.id == job_id, models.Job.company_id == company.id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    content = await file.read()
    
    new_candidate = models.Candidate(
        job_id=job_id,
        company_id=company.id,
        name=name,
        email=email,
        status="NEW",
        resume_metadata={"filename": file.filename, "source": "public_portal", "status": "PENDING"}
    )
    db.add(new_candidate)
    db.commit()
    db.refresh(new_candidate)

    # Trigger background AI screening immediately
    engine = AIScreeningEngine(db)
    background_tasks.add_task(engine.screen_candidate, new_candidate.id, content, file.filename)

    return {
        "message": "Application received successfully. Thank you for applying!",
        "application_id": str(new_candidate.id)
    }
