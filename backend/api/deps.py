
from typing import Generator, List, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from pydantic import ValidationError
from sqlalchemy.orm import Session
from backend.core.config import settings
from backend.db.session import SessionLocal
from backend.models.models import User, UserRole, Plan, Subscription, UsageMetric

reusable_oauth2 = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")

def get_db() -> Generator:
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()

class CurrentUser:
    def __init__(self, user_id: str, company_id: str, role: UserRole):
        self.id = user_id
        self.company_id = company_id
        self.role = role

def get_current_user(token: str = Depends(reusable_oauth2)) -> CurrentUser:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id = payload.get("sub")
        company_id = payload.get("company_id")
        role = payload.get("role")
        if user_id is None or company_id is None:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Could not validate credentials")
        return CurrentUser(user_id=user_id, company_id=company_id, role=UserRole(role))
    except (JWTError, ValidationError):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Could not validate credentials")

def check_permissions(allowed_roles: List[UserRole]):
    def role_checker(user: CurrentUser = Depends(get_current_user)):
        if user.role not in allowed_roles:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient permissions")
        return user
    return role_checker

def enforce_plan_limit(metric_name: str):
    """
    Middleware dependency to ensure a tenant has not exceeded their plan limits.
    Used for creating jobs, candidates, or using AI features.
    """
    def limit_checker(
        current_user: CurrentUser = Depends(get_current_user),
        db: Session = Depends(get_db)
    ):
        sub = db.query(Subscription).filter(Subscription.company_id == current_user.company_id).first()
        if not sub:
             # Default to strict FREE tier if no subscription found
             max_limit = 1 if metric_name == "jobs_created" else 10
        else:
            plan = db.query(Plan).filter(Plan.id == sub.plan_id).first()
            if metric_name == "jobs_created":
                max_limit = plan.max_jobs
            elif metric_name == "candidates_total":
                max_limit = plan.max_candidates
            else:
                # Feature check (e.g. AI_INTERVIEW)
                if metric_name not in plan.features:
                    raise HTTPException(
                        status_code=status.HTTP_402_PAYMENT_REQUIRED, 
                        detail=f"This feature requires a higher plan."
                    )
                return current_user

        usage = db.query(UsageMetric).filter(
            UsageMetric.company_id == current_user.company_id,
            UsageMetric.metric_name == metric_name
        ).first()
        
        if usage and usage.count >= max_limit:
            raise HTTPException(
                status_code=status.HTTP_402_PAYMENT_REQUIRED, 
                detail=f"Limit reached for {metric_name}. Upgrade your plan."
            )
        return current_user
    return limit_checker
