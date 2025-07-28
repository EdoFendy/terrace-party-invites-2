from sqlmodel import Session, select
from app.models import User, AccessRequest, QRToken
from app.schemas import AccessRequestCreate
from passlib.context import CryptContext
from datetime import datetime
from typing import Optional, List
import uuid

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against hash"""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Generate password hash"""
    return pwd_context.hash(password)

def get_user_by_username(session: Session, username: str) -> Optional[User]:
    """Get user by username"""
    statement = select(User).where(User.username == username)
    return session.exec(statement).first()

def authenticate_user(session: Session, username: str, password: str) -> Optional[User]:
    """Authenticate user"""
    user = get_user_by_username(session, username)
    if not user or not verify_password(password, user.hashed_password):
        return None
    return user

def create_access_request(session: Session, request: AccessRequestCreate) -> AccessRequest:
    """Create new access request"""
    db_request = AccessRequest(
        first_name=request.first_name,
        last_name=request.last_name,
        email=request.email,
        instagram=request.instagram
    )
    session.add(db_request)
    session.commit()
    session.refresh(db_request)
    return db_request

def get_pending_requests(session: Session) -> List[AccessRequest]:
    """Get all pending access requests"""
    statement = select(AccessRequest).where(AccessRequest.approved == False)
    return list(session.exec(statement).all())

def get_all_requests(session: Session) -> List[AccessRequest]:
    """Get all access requests"""
    statement = select(AccessRequest).order_by(AccessRequest.created_at.desc())
    return list(session.exec(statement).all())

def approve_request(session: Session, request_id: int) -> Optional[AccessRequest]:
    """Approve access request and generate QR token"""
    statement = select(AccessRequest).where(AccessRequest.id == request_id)
    request = session.exec(statement).first()
    
    if not request:
        return None
    
    # Mark as approved
    request.approved = True
    request.approved_at = datetime.utcnow()
    
    # Generate unique QR token
    token = str(uuid.uuid4())
    qr_token = QRToken(token=token, request_id=request.id)
    
    session.add(qr_token)
    session.commit()
    session.refresh(request)
    session.refresh(qr_token)
    
    return request

def get_qr_token(session: Session, token: str) -> Optional[QRToken]:
    """Get QR token by token string"""
    statement = select(QRToken).where(QRToken.token == token)
    return session.exec(statement).first()

def use_qr_token(session: Session, token: str) -> Optional[QRToken]:
    """Mark QR token as used"""
    qr_token = get_qr_token(session, token)
    if not qr_token or qr_token.used:
        return None
    
    qr_token.used = True
    qr_token.used_at = datetime.utcnow()
    session.commit()
    session.refresh(qr_token)
    
    return qr_token

def get_request_by_id(session: Session, request_id: int) -> Optional[AccessRequest]:
    """Get access request by ID"""
    statement = select(AccessRequest).where(AccessRequest.id == request_id)
    return session.exec(statement).first()
