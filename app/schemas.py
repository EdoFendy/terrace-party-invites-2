from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class AccessRequestCreate(BaseModel):
    """Schema for creating access request"""
    first_name: str
    last_name: str
    email: EmailStr
    instagram: str

class AccessRequestResponse(BaseModel):
    """Schema for access request response"""
    id: int
    first_name: str
    last_name: str
    email: str
    instagram: str
    approved: bool
    created_at: datetime
    approved_at: Optional[datetime] = None

class UserLogin(BaseModel):
    """Schema for user login"""
    username: str
    password: str

class QRTokenResponse(BaseModel):
    """Schema for QR token response"""
    token: str
    used: bool
    guest_name: str
