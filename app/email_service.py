import aiosmtplib
from email.message import EmailMessage
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.image import MIMEImage
import os
from typing import Optional
import logging

logger = logging.getLogger(__name__)

class EmailService:
    def __init__(self):
        self.smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
        self.smtp_port = int(os.getenv("SMTP_PORT", "587"))
        self.smtp_username = os.getenv("SMTP_USERNAME")
        self.smtp_password = os.getenv("SMTP_PASSWORD")
        self.from_email = os.getenv("FROM_EMAIL", self.smtp_username)
        
    async def send_invitation_email(
        self, 
        to_email: str, 
        guest_name: str, 
        qr_code_bytes: bytes,
        fallback_url: str
    ) -> bool:
        """Send invitation email with QR code attachment"""
        try:
            # Create multipart message
            msg = MIMEMultipart()
            msg["From"] = self.from_email
            msg["To"] = to_email
            msg["Subject"] = "🌊 Terrace After-Party Invitation - You're Approved! ✨"
            
            # Email body
            body = f"""
            <html>
            <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;">
                    <h1 style="margin: 0; font-size: 28px;">🌊 You're Invited! ✨</h1>
                    <p style="margin: 10px 0 0 0; font-size: 18px;">Terrace After-Party by the Sea</p>
                </div>
                
                <div style="padding: 30px; background: #f8f9fa;">
                    <h2 style="color: #333;">Hey {guest_name}! 👋</h2>
                    
                    <p style="font-size: 16px; line-height: 1.6; color: #555;">
                        Your request has been <strong>approved</strong>! Get ready for an unforgettable night 
                        on our seaside terrace starting at <strong>midnight (00:00)</strong>.
                    </p>
                    
                    <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0; text-align: center; border: 2px dashed #667eea;">
                        <h3 style="color: #667eea; margin-top: 0;">Your Personal QR Code</h3>
                        <p style="color: #666; margin-bottom: 15px;">
                            Show this QR code at the entrance. <strong>One-time use only!</strong>
                        </p>
                        <p style="font-size: 14px; color: #999;">
                            QR code is attached to this email as an image.
                        </p>
                    </div>
                    
                    <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <h4 style="color: #1976d2; margin-top: 0;">Backup Access Link:</h4>
                        <a href="{fallback_url}" style="color: #1976d2; text-decoration: none; font-weight: bold;">
                            {fallback_url}
                        </a>
                        <p style="font-size: 14px; color: #666; margin-bottom: 0;">
                            Use this link if you can't scan the QR code.
                        </p>
                    </div>
                    
                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
                        <p style="color: #666; font-size: 14px; margin: 0;">
                            🌊 See you at midnight on the terrace! 🥂<br>
                            Questions? Just reply to this email.
                        </p>
                    </div>
                </div>
            </body>
            </html>
            """
            
            msg.attach(MIMEText(body, "html"))
            
            # Attach QR code image
            qr_attachment = MIMEImage(qr_code_bytes)
            qr_attachment.add_header("Content-Disposition", "attachment", filename="invitation-qr-code.png")
            msg.attach(qr_attachment)
            
            # Send email
            await aiosmtplib.send(
                msg,
                hostname=self.smtp_server,
                port=self.smtp_port,
                start_tls=True,
                username=self.smtp_username,
                password=self.smtp_password,
            )
            
            logger.info(f"Invitation email sent successfully to {to_email}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send email to {to_email}: {str(e)}")
            return False

# Global email service instance
email_service = EmailService()
