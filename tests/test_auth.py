import pytest
from app.auth import create_session_token, verify_session_token

def test_create_and_verify_session_token():
    """Test creating and verifying session tokens"""
    username = "testuser"
    
    # Create token
    token = create_session_token(username)
    assert token is not None
    assert isinstance(token, str)
    
    # Verify token
    verified_username = verify_session_token(token)
    assert verified_username == username

def test_verify_invalid_token():
    """Test verifying invalid token"""
    invalid_token = "invalid-token"
    result = verify_session_token(invalid_token)
    assert result is None
