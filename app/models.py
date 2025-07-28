from sqlmodel import SQLModel, Field, create_engine, Session
from typing import Optional
from datetime import datetime
import os

class User(SQLModel, table=True):
    """Admin user model"""
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(unique=True, index=True)
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class AccessRequest(SQLModel, table=True):
    """Guest access request model"""
    id: Optional[int] = Field(default=None, primary_key=True)
    first_name: str
    last_name: str
    email: str = Field(index=True)
    instagram: str
    approved: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    approved_at: Optional[datetime] = None

class QRToken(SQLModel, table=True):
    """QR code token model"""
    id: Optional[int] = Field(default=None, primary_key=True)
    token: str = Field(unique=True, index=True)
    request_id: int = Field(foreign_key="accessrequest.id")
    used: bool = Field(default=False)
    used_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Database setup
DATABASE_URL = "sqlite:///./terrace_party.db"
engine = create_engine(DATABASE_URL, echo=False)

def create_db_and_tables():
    """Create database and tables"""
    SQLModel.metadata.create_all(engine)

def get_session():
    """Get database session"""
    with Session(engine) as session:
        yield session
