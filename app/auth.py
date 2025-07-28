from fastapi import Request, HTTPException, status
from itsdangerous import URLSafeTimedSerializer, BadSignature
import os
from typing import Optional

# Secret key for signing cookies
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
serializer = URLSafeTimedSerializer(SECRET_KEY)

def create_session_token(username: str) -> str:
    """Create signed session token"""
    return serializer.dumps(username)

def verify_session_token(token: str) -> Optional[str]:
    """Verify and decode session token"""
    try:
        # Token expires after 24 hours (86400 seconds)
        username = serializer.loads(token, max_age=86400)
        return username
    except BadSignature:
        return None

def get_current_user(request: Request) -> Optional[str]:
    """Get current user from session cookie"""
    session_token = request.cookies.get("session")
    if not session_token:
        return None
    return verify_session_token(session_token)

def require_auth(request: Request) -> str:
    """Require authentication, raise exception if not authenticated"""
    username = get_current_user(request)
    if not username:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required"
        )
    return username
