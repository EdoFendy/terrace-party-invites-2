import pytest
from app.qr_service import QRService
import os

def test_generate_qr_code():
    """Test QR code generation"""
    qr_service = QRService()
    token = "test-token-123"
    
    qr_bytes = qr_service.generate_qr_code(token)
    
    assert qr_bytes is not None
    assert isinstance(qr_bytes, bytes)
    assert len(qr_bytes) > 0
    
    # Check if it's a valid PNG (starts with PNG signature)
    assert qr_bytes.startswith(b'\x89PNG')
