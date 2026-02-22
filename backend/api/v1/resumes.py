
from fastapi import APIRouter, Depends, UploadFile, File, BackgroundTasks, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from backend.api import deps
from backend.services.ai_screening import AIScreeningEngine
from backend.models.models import Candidate, Job

router = APIRouter()

@router.post("/upload/{job_id}")
async def upload_resume(
    job_id: UUID,
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    db: Session = Depends(deps.get_db),
    current_user: deps.CurrentUser = Depends(deps.get_current_user)
):
    """
    Handles resume upload, creates candidate record, and triggers async AI screening.
    """
    # 1. Verify Job belongs to tenant
    job = db.query(Job).filter(Job.id == job_id, Job.company_id == current_user.company_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found in your organization")

    # 2. Read content
    content = await file.read()
    
    # 3. Create Candidate placeholder
    # In a real app, we'd extract name/email here or from the form data
    new_candidate = Candidate(
        job_id=job_id,
        company_id=current_user.company_id,
        name=file.filename.split('.')[0], # Fallback
        email=f"candidate_{new_id()}@example.com", # Mocking email extraction
        status="NEW",
        resume_metadata={"filename": file.filename, "status": "PENDING"}
    )
    db.add(new_candidate)
    db.commit()
    db.refresh(new_candidate)

    # 4. Enqueue background AI screening
    engine = AIScreeningEngine(db)
    background_tasks.add_task(engine.screen_candidate, new_candidate.id, content, file.filename)

    return {
        "candidate_id": new_candidate.id,
        "message": "Resume uploaded successfully. AI screening is running in the background.",
        "status": "PROCESSING"
    }

def new_id():
    import uuid
    return str(uuid.uuid4())[:8]
