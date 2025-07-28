import qrcode
from qrcode.image.pil import PilImage
from io import BytesIO
import os

class QRService:
    def __init__(self):
        self.base_url = os.getenv("BASE_URL", "http://localhost:8000")
    
    def generate_qr_code(self, token: str) -> bytes:
        """Generate QR code for token and return as PNG bytes"""
        # Create QR code URL
        qr_url = f"{self.base_url}/q/{token}"
        
        # Generate QR code
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data(qr_url)
        qr.make(fit=True)
        
        # Create image
        img = qr.make_image(fill_color="black", back_color="white")
        
        # Convert to bytes
        img_buffer = BytesIO()
        img.save(img_buffer, format='PNG')
        img_buffer.seek(0)
        
        return img_buffer.getvalue()

# Global QR service instance
qr_service = QRService()
