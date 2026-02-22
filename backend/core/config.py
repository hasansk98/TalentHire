
import os
from pydantic_settings import BaseSettings
from typing import List, Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "TalentHire AI Enterprise"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "SUPER_SECRET_KEY_FOR_JWT_ROTATION_2024")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days
    ALGORITHM: str = "HS256"
    
    # Infrastructure
    POSTGRES_SERVER: str = os.getenv("POSTGRES_SERVER", "db")
    POSTGRES_USER: str = os.getenv("POSTGRES_USER", "postgres")
    POSTGRES_PASSWORD: str = os.getenv("POSTGRES_PASSWORD", "postgres")
    POSTGRES_DB: str = os.getenv("POSTGRES_DB", "talenthire")
    SQLALCHEMY_DATABASE_URI: str = f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_SERVER}/{POSTGRES_DB}"
    
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://redis:6379/0")

    # Storage
    STORAGE_BACKEND: str = os.getenv("STORAGE_BACKEND", "local") # local or s3
    S3_BUCKET_NAME: Optional[str] = os.getenv("S3_BUCKET_NAME")
    AWS_ACCESS_KEY_ID: Optional[str] = os.getenv("AWS_ACCESS_KEY_ID")
    AWS_SECRET_ACCESS_KEY: Optional[str] = os.getenv("AWS_SECRET_ACCESS_KEY")
    AWS_REGION: str = os.getenv("AWS_REGION", "us-east-1")

    # AI API Key
    GOOGLE_API_KEY: str = os.getenv("API_KEY", "")

    # Razorpay
    RAZORPAY_KEY_ID: str = os.getenv("RAZORPAY_KEY_ID", "")
    RAZORPAY_KEY_SECRET: str = os.getenv("RAZORPAY_KEY_SECRET", "")
    RAZORPAY_WEBHOOK_SECRET: str = os.getenv("RAZORPAY_WEBHOOK_SECRET", "")

    # Company Legal Info (India GST)
    GSTIN_SELLER: str = os.getenv("GSTIN_SELLER", "27AAACT1234A1Z1")
    COMPANY_LEGAL_NAME: str = os.getenv("COMPANY_LEGAL_NAME", "AI TalentHire Pvt Ltd")
    COMPANY_ADDRESS: str = os.getenv("COMPANY_ADDRESS", "101, Tech Park, Bandra Kurla Complex, Mumbai, Maharashtra 400051")

    # Security
    CORS_ORIGINS: List[str] = ["*"]

settings = Settings()
