import pytest
from sqlmodel import Session, create_engine
from app.models import User, AccessRequest, QRToken, SQLModel
from app.crud import get_password_hash
from datetime import datetime

@pytest.fixture
def session():
    """Create test database session"""
    engine = create_engine("sqlite:///:memory:")
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session

def test_create_user(session):
    """Test creating a user"""
    user = User(
        username="testuser",
        hashed_password=get_password_hash("testpass")
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    
    assert user.id is not None
    assert user.username == "testuser"
    assert user.created_at is not None

def test_create_access_request(session):
    """Test creating an access request"""
    request = AccessRequest(
        first_name="John",
        last_name="Doe",
        email="john@example.com",
        instagram="johndoe"
    )
    session.add(request)
    session.commit()
    session.refresh(request)
    
    assert request.id is not None
    assert request.first_name == "John"
    assert request.approved == False
    assert request.created_at is not None

def test_create_qr_token(session):
    """Test creating a QR token"""
    # First create an access request
    request = AccessRequest(
        first_name="Jane",
        last_name="Doe",
        email="jane@example.com",
        instagram="janedoe"
    )
    session.add(request)
    session.commit()
    session.refresh(request)
    
    # Create QR token
    token = QRToken(
        token="test-token-123",
        request_id=request.id
    )
    session.add(token)
    session.commit()
    session.refresh(token)
    
    assert token.id is not None
    assert token.token == "test-token-123"
    assert token.used == False
    assert token.request_id == request.id
