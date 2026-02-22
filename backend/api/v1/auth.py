
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from backend.api import deps
from backend.core import security
from backend.models import models
import os

router = APIRouter()

@router.get("/google/login")
def google_login():
    # In production, redirect to Google OAuth URL
    return {"url": "https://accounts.google.com/o/oauth2/v2/auth?..."}

@router.get("/google/callback")
def google_callback(code: str, db: Session = Depends(deps.get_db)):
    """
    Handle Google OAuth callback. 
    1. Exchange code for token.
    2. Get user info.
    3. Match or create user in tenant.
    """
    # Mocked flow
    mock_email = "alex.rivera@nebula.ai"
    user = db.query(models.User).filter(models.User.email == mock_email).first()
    
    if not user:
        # Auto-provision user under a default or detected company
        raise HTTPException(status_code=400, detail="User not invited to any organization")
        
    access_token = security.create_access_token(
        subject=user.id, company_id=user.company_id, role=user.role
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/microsoft/login")
def microsoft_login():
    return {"url": "https://login.microsoftonline.com/common/oauth2/v2.0/authorize?..."}
