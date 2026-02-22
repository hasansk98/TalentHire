
from pydantic import BaseModel, EmailStr
from uuid import UUID
from datetime import datetime
from typing import Optional, List
from backend.models.models import UserRole

class UserBase(BaseModel):
    email: EmailStr
    name: Optional[str] = None
    role: UserRole

class UserCreate(UserBase):
    password: str
    company_id: UUID

class UserOut(UserBase):
    id: UUID
    company_id: UUID
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class JobCreate(BaseModel):
    title: str
    description: str
    department: str

class JobOut(JobCreate):
    id: UUID
    status: str
    created_at: datetime
    class Config:
        from_attributes = True

class CandidateCreate(BaseModel):
    job_id: UUID
    name: str
    email: EmailStr

class CandidateOut(CandidateCreate):
    id: UUID
    status: str
    ai_score: float
    fraud_risk: float
    ml_ranking: float
    class Config:
        from_attributes = True

class InterviewCreate(BaseModel):
    candidate_id: UUID
    interviewer_id: UUID
    scheduled_at: datetime
    type: str # AI_CHAT, VIDEO, LIVE

class InterviewOut(InterviewCreate):
    id: UUID
    status: str
    class Config:
        from_attributes = True

class SlotSuggestionRequest(BaseModel):
    candidate_id: UUID
    interviewer_id: UUID
    preferences: str # e.g. "Next week afternoons"

class CreateOrderRequest(BaseModel):
    plan_id: UUID

class CreateOrderResponse(BaseModel):
    order_id: str
    amount: int
    currency: str
    key_id: str

class VerifyPaymentRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str
