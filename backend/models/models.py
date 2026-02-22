
from sqlalchemy import Column, String, Enum, Integer, JSON, Float, ForeignKey, Text, DateTime, Boolean
from sqlalchemy.dialects.postgresql import UUID
from backend.db.base import Base, TenantMixin
import enum
import uuid
from datetime import datetime

class UserRole(str, enum.Enum):
    SUPER_ADMIN = 'SUPER_ADMIN'
    COMPANY_ADMIN = 'COMPANY_ADMIN'
    HR_MANAGER = 'HR_MANAGER'
    RECRUITER = 'RECRUITER'
    VIEWER = 'VIEWER'

class Company(Base):
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    slug = Column(String, unique=True, index=True)
    plan_id = Column(UUID(as_uuid=True), ForeignKey("plans.id"), nullable=True)
    gstin = Column(String, nullable=True)
    billing_address = Column(Text, nullable=True)
    state_code = Column(String, nullable=True)
    lifetime_job_used = Column(Boolean, default=False)
    jobs_created = Column(Integer, default=0)

class Plan(Base):
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False) # FREE_TRIAL, GROWTH, ENTERPRISE
    price_inr = Column(Integer, default=0)
    max_jobs = Column(Integer, default=1)
    max_resumes = Column(Integer, default=10)
    max_hr_users = Column(Integer, default=1)
    features = Column(JSON) # ["AI_SCREENING", "AI_INTERVIEW", "SSO"]
    is_active = Column(Boolean, default=True)

class Subscription(Base, TenantMixin):
    plan_id = Column(UUID(as_uuid=True), ForeignKey("plans.id"))
    status = Column(String) # ACTIVE, CANCELLED, PAST_DUE, EXPIRED
    start_date = Column(DateTime, default=datetime.utcnow)
    end_date = Column(DateTime)
    lifetime_job_used = Column(Boolean, default=False)
    auto_renew = Column(Boolean, default=True)
    renewal_reminder_sent = Column(Boolean, default=False)

class Invoice(Base, TenantMixin):
    invoice_number = Column(String, unique=True, index=True)
    plan_id = Column(UUID(as_uuid=True), ForeignKey("plans.id"))
    amount = Column(Integer) # Base amount
    cgst = Column(Integer)
    sgst = Column(Integer)
    gst_rate = Column(Float, default=18.0)
    total_amount = Column(Integer)
    status = Column(String, default="PAID") # PAID, OPEN, VOID
    issue_date = Column(DateTime, default=datetime.utcnow)
    razorpay_payment_id = Column(String, nullable=True)
    pdf_path = Column(String, nullable=True)

class Payment(Base, TenantMixin):
    plan_id = Column(UUID(as_uuid=True), ForeignKey("plans.id"))
    amount_inr = Column(Integer)
    razorpay_order_id = Column(String, index=True)
    razorpay_payment_id = Column(String, nullable=True)
    status = Column(String, default="PENDING") # PENDING, SUCCESS, FAILED
    created_at = Column(DateTime, default=datetime.utcnow)

class UsageMetric(Base, TenantMixin):
    metric_name = Column(String) # jobs_created, ai_interviews, candidates_total
    count = Column(Integer, default=0)
    last_reset = Column(DateTime, default=datetime.utcnow)

class User(Base, TenantMixin):
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    name = Column(String)
    role = Column(Enum(UserRole), default=UserRole.RECRUITER)
    sso_provider = Column(String)
    calendar_token = Column(JSON)

class Job(Base, TenantMixin):
    title = Column(String, nullable=False)
    description = Column(String)
    department = Column(String)
    status = Column(String, default="OPEN")

class Candidate(Base, TenantMixin):
    job_id = Column(UUID(as_uuid=True), ForeignKey("jobs.id"))
    name = Column(String, nullable=False)
    email = Column(String, index=True)
    status = Column(String, default="NEW")
    ai_score = Column(Float, default=0.0)
    fraud_risk = Column(Float, default=0.0)
    resume_metadata = Column(JSON)
    interview_score = Column(Float, nullable=True)

class Interview(Base, TenantMixin):
    candidate_id = Column(UUID(as_uuid=True), ForeignKey("candidates.id"))
    interviewer_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    scheduled_at = Column(DateTime)
    type = Column(String)
    status = Column(String, default="SCHEDULED")
    feedback = Column(Text)
    transcript = Column(JSON)
    video_url = Column(String)
    ai_metrics = Column(JSON)

class AuditLog(Base, TenantMixin):
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    action = Column(String)
    resource = Column(String)
    payload = Column(JSON)
