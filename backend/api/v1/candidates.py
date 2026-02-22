
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID
from backend.api import deps
from backend.schemas import schemas
from backend.models import models
from backend.workers import tasks

router = APIRouter()

@router.get("/", response_model=List[schemas.CandidateOut])
def list_candidates(
    job_id: Optional[UUID] = None,
    db: Session = Depends(deps.get_db),
    current_user: deps.CurrentUser = Depends(deps.get_current_user)
):
    """Lists candidates filtered by company_id and optionally job_id."""
    query = db.query(models.Candidate).filter(models.Candidate.company_id == current_user.company_id)
    if job_id:
        query = query.filter(models.Candidate.job_id == job_id)
    return query.all()

@router.get("/{candidate_id}", response_model=schemas.CandidateOut)
def get_candidate(
    candidate_id: UUID,
    db: Session = Depends(deps.get_db),
    current_user: deps.CurrentUser = Depends(deps.get_current_user)
):
    candidate = db.query(models.Candidate).filter(
        models.Candidate.id == candidate_id, 
        models.Candidate.company_id == current_user.company_id
    ).first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    return candidate

@router.post("/{candidate_id}/rank")
async def trigger_re_ranking(
    candidate_id: UUID,
    background_tasks: BackgroundTasks,
    db: Session = Depends(deps.get_db),
    current_user: deps.CurrentUser = Depends(deps.get_current_user)
):
    """Manually trigger the ML ranking worker for a specific candidate."""
    candidate = db.query(models.Candidate).filter(
        models.Candidate.id == candidate_id,
        models.Candidate.company_id == current_user.company_id
    ).first()
    
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
        
    background_tasks.add_task(tasks.process_full_candidate_lifecycle, candidate_id)
    return {"message": "Ranking task enqueued."}
