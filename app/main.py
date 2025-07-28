from fastapi import FastAPI, Request, Form, Depends, HTTPException, status
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from sqlmodel import Session
from app.models import create_db_and_tables, get_session
from app.schemas import AccessRequestCreate
from app import crud
from app.auth import create_session_token, get_current_user, require_auth
from app.email_service import email_service
from app.qr_service import qr_service
import os
from typing import Annotated

# Create FastAPI app
app = FastAPI(title="Terrace Party Invites", version="1.0.0")

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Templates
templates = Jinja2Templates(directory="templates")

# Create database tables on startup
@app.on_event("startup")
def on_startup():
    create_db_and_tables()

@app.get("/", response_class=HTMLResponse)
async def request_access_page(request: Request):
    """Public page to request access"""
    return templates.TemplateResponse("request_access.html", {"request": request})

@app.post("/request-access")
async def submit_access_request(
    request: Request,
    first_name: Annotated[str, Form()],
    last_name: Annotated[str, Form()],
    email: Annotated[str, Form()],
    instagram: Annotated[str, Form()],
    session: Session = Depends(get_session)
):
    """Submit access request"""
    try:
        access_request = AccessRequestCreate(
            first_name=first_name,
            last_name=last_name,
            email=email,
            instagram=instagram
        )
        
        crud.create_access_request(session, access_request)
        
        return templates.TemplateResponse(
            "request_access.html", 
            {
                "request": request, 
                "success": True,
                "message": "Your request has been submitted! You'll receive an email if approved."
            }
        )
    except Exception as e:
        return templates.TemplateResponse(
            "request_access.html", 
            {
                "request": request, 
                "error": True,
                "message": "Something went wrong. Please try again."
            }
        )

@app.get("/admin/login", response_class=HTMLResponse)
async def admin_login_page(request: Request):
    """Admin login page"""
    return templates.TemplateResponse("admin_login.html", {"request": request})

@app.post("/admin/login")
async def admin_login(
    request: Request,
    username: Annotated[str, Form()],
    password: Annotated[str, Form()],
    session: Session = Depends(get_session)
):
    """Admin login"""
    user = crud.authenticate_user(session, username, password)
    if not user:
        return templates.TemplateResponse(
            "admin_login.html", 
            {"request": request, "error": "Invalid credentials"}
        )
    
    # Create session token
    session_token = create_session_token(user.username)
    
    # Redirect to admin panel with session cookie
    response = RedirectResponse(url="/admin", status_code=status.HTTP_302_FOUND)
    response.set_cookie(
        key="session", 
        value=session_token, 
        httponly=True, 
        max_age=86400,  # 24 hours
        samesite="lax"
    )
    return response

@app.get("/admin", response_class=HTMLResponse)
async def admin_panel(
    request: Request,
    session: Session = Depends(get_session)
):
    """Admin panel - requires authentication"""
    username = require_auth(request)
    
    # Get all requests
    requests = crud.get_all_requests(session)
    
    return templates.TemplateResponse(
        "admin_panel.html", 
        {
            "request": request, 
            "requests": requests,
            "username": username
        }
    )

@app.post("/admin/approve/{request_id}")
async def approve_request(
    request_id: int,
    request: Request,
    session: Session = Depends(get_session)
):
    """Approve access request and send invitation email"""
    require_auth(request)
    
    # Approve request and generate QR token
    approved_request = crud.approve_request(session, request_id)
    if not approved_request:
        raise HTTPException(status_code=404, detail="Request not found")
    
    # Get QR token
    qr_token = crud.get_qr_token(session, approved_request.id)  # This needs to be fixed
    
    # Actually, let's get the QR token properly
    from sqlmodel import select
    from app.models import QRToken
    statement = select(QRToken).where(QRToken.request_id == approved_request.id)
    qr_token = session.exec(statement).first()
    
    if qr_token:
        # Generate QR code
        qr_code_bytes = qr_service.generate_qr_code(qr_token.token)
        
        # Create fallback URL
        base_url = os.getenv("BASE_URL", "http://localhost:8000")
        fallback_url = f"{base_url}/q/{qr_token.token}"
        
        # Send invitation email
        guest_name = f"{approved_request.first_name} {approved_request.last_name}"
        await email_service.send_invitation_email(
            approved_request.email,
            guest_name,
            qr_code_bytes,
            fallback_url
        )
    
    return RedirectResponse(url="/admin", status_code=status.HTTP_302_FOUND)

@app.get("/admin/logout")
async def admin_logout():
    """Admin logout"""
    response = RedirectResponse(url="/admin/login", status_code=status.HTTP_302_FOUND)
    response.delete_cookie("session")
    return response

@app.get("/q/{token}", response_class=HTMLResponse)
async def validate_qr_token(
    token: str,
    request: Request,
    session: Session = Depends(get_session)
):
    """Validate QR token - one-time use"""
    qr_token = crud.get_qr_token(session, token)
    
    if not qr_token:
        return templates.TemplateResponse(
            "invalid_qr.html", 
            {"request": request, "message": "Invalid QR code"}
        )
    
    if qr_token.used:
        return templates.TemplateResponse(
            "invalid_qr.html", 
            {"request": request, "message": "QR code already used"}
        )
    
    # Mark as used
    crud.use_qr_token(session, token)
    
    # Get guest info
    guest_request = crud.get_request_by_id(session, qr_token.request_id)
    guest_name = f"{guest_request.first_name} {guest_request.last_name}"
    
    return templates.TemplateResponse(
        "approved.html", 
        {
            "request": request, 
            "guest_name": guest_name,
            "instagram": guest_request.instagram
        }
    )

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
