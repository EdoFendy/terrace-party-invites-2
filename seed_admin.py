#!/usr/bin/env python3
"""
Seed script to create admin user
Run this script to create the initial admin user
"""

import os
from sqlmodel import Session, select
from app.models import User, create_db_and_tables, engine
from app.crud import get_password_hash
from dotenv import load_dotenv

def create_admin_user():
    """Create admin user if it doesn't exist"""
    load_dotenv()
    
    # Create tables
    create_db_and_tables()
    
    # Get admin credentials from environment
    admin_username = os.getenv("ADMIN_USERNAME", "admin")
    admin_password = os.getenv("ADMIN_PASSWORD", "password")
    
    with Session(engine) as session:
        # Check if admin user already exists
        statement = select(User).where(User.username == admin_username)
        existing_user = session.exec(statement).first()
        
        if existing_user:
            print(f"Admin user '{admin_username}' already exists!")
            return
        
        # Create admin user
        hashed_password = get_password_hash(admin_password)
        admin_user = User(
            username=admin_username,
            hashed_password=hashed_password
        )
        
        session.add(admin_user)
        session.commit()
        
        print(f"✅ Admin user created successfully!")
        print(f"Username: {admin_username}")
        print(f"Password: {admin_password}")
        print(f"⚠️  Please change the default password in production!")

if __name__ == "__main__":
    create_admin_user()
