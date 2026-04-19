"""
Application configuration — loads from .env file
"""

from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    # App
    APP_ENV: str = "development"
    DEBUG: bool = True
    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000", "http://127.0.0.1:5500"]

    # LLM
    GROQ_API_KEY: str = ""

    # Supabase
    SUPABASE_URL: str = ""
    SUPABASE_KEY: str = ""
    SUPABASE_SERVICE_KEY: str = ""

    # Vector DB
    VECTOR_DB: str = "faiss"
    PINECONE_API_KEY: str = ""
    PINECONE_ENV: str = ""

    # Auth
    SECRET_KEY: str = "changeme_in_production"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    # SMS Gateway (Twilio)
    TWILIO_ACCOUNT_SID: str = ""
    TWILIO_AUTH_TOKEN: str = ""
    TWILIO_PHONE_NUMBER: str = ""

    # SMS Gateway (Indian - Fast2SMS/MSG91)
    FAST2SMS_API_KEY: str = ""

    # Email Gateway (Resend)
    RESEND_API_KEY: str = ""
    MAIL_FROM: str = "noreply@lexisco.com"

    # Email Gateway (Free SMTP/Gmail)
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_EMAIL: str = ""
    SMTP_PASSWORD: str = "" # Gmail App Password
    
    # Kaggle (for ingestion)
    KAGGLE_USERNAME: str = ""
    KAGGLE_KEY: str = ""

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False
        extra = "ignore"


settings = Settings()
