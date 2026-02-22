
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from datetime import datetime, timedelta
from backend.api import deps
from backend.schemas import schemas
from backend.models import models
from backend.services.calendar import CalendarService
from google.generativeai import GoogleGenAI
import os
import json

router = APIRouter()

@router.get("/", response_model=List[schemas.InterviewOut])
def list_interviews(
    db: Session = Depends(deps.get_db),
    current_user: deps.CurrentUser = Depends(deps.get_current_user)
):
    return db.query(models.Interview).filter(models.Interview.company_id == current_user.company_id).all()

@router.post("/suggest-slots")
async def suggest_slots(
    req: schemas.SlotSuggestionRequest,
    db: Session = Depends(deps.get_db),
    current_user: deps.CurrentUser = Depends(deps.get_current_user)
):
    # 1. Get interviewer's availability (mocked via CalendarService)
    # In production, we'd fetch actual tokens from the User model
    cal = CalendarService(provider="google", token={})
    busy_slots = await cal.get_availability(
        user_email="interviewer@nebula.ai", 
        start=datetime.utcnow(), 
        end=datetime.utcnow() + timedelta(days=7)
    )

    # 2. Use Gemini to suggest optimal slots
    ai = GoogleGenAI({ "apiKey": os.getenv("API_KEY") })
    prompt = f"""
    Suggest 3 optimal 45-minute interview slots.
    Interviewer Busy Slots: {json.dumps(busy_slots)}
    Candidate Preferences: {req.preferences}
    Current Time: {datetime.utcnow().isoformat()}
    
    Return ONLY a JSON array of ISO strings for the START times.
    """
    
    response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt
    })
    
    try:
        slots = json.loads(response.text.strip())
        return {"suggested_slots": slots}
    except:
        # Fallback to simple logic if AI fails
        fallback_time = (datetime.utcnow() + timedelta(days=1)).replace(hour=10, minute=0, second=0, microsecond=0)
        return {"suggested_slots": [fallback_time.isoformat()]}

@router.post("/", response_model=schemas.InterviewOut)
def schedule_interview(
    interview_in: schemas.InterviewCreate,
    db: Session = Depends(deps.get_db),
    current_user: deps.CurrentUser = Depends(deps.get_current_user)
):
    interview = models.Interview(
        **interview_in.dict(),
        company_id=current_user.company_id,
        status="SCHEDULED"
    )
    db.add(interview)
    
    # Track usage for billing
    usage = db.query(models.UsageMetric).filter(
        models.UsageMetric.company_id == current_user.company_id,
        models.UsageMetric.metric_name == "interviews_scheduled"
    ).first()
    if not usage:
        usage = models.UsageMetric(company_id=current_user.company_id, metric_name="interviews_scheduled", count=1)
        db.add(usage)
    else:
        usage.count += 1

    db.commit()
    db.refresh(interview)
    return interview
