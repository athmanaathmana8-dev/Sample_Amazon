"""
Authentication Service
Handles user registration, login, and JWT token generation
For sample project, uses in-memory storage
"""
from datetime import datetime, timedelta
from typing import Optional, Dict
import hashlib
import secrets
from fastapi import HTTPException, status
from app.models.user import UserCreate, UserResponse

# In-memory user storage (for sample project)
# In production, use a proper database
users_db: Dict[str, dict] = {}

# JWT secret key (for sample project - use environment variable in production)
SECRET_KEY = "sample_secret_key_change_in_production_12345"
ALGORITHM = "HS256"


def hash_password(password: str) -> str:
    """Hash password using SHA256 (for sample project)"""
    return hashlib.sha256(password.encode()).hexdigest()


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against hash"""
    return hash_password(plain_password) == hashed_password


def generate_token(user_id: str) -> str:
    """Generate a simple token (for sample project)"""
    # In production, use proper JWT library like python-jose
    token_data = f"{user_id}:{datetime.utcnow().isoformat()}"
    token = hashlib.sha256(f"{token_data}:{SECRET_KEY}".encode()).hexdigest()
    return f"{user_id}:{token}"


def verify_token(token: str) -> Optional[str]:
    """Verify token and return user_id"""
    try:
        parts = token.split(":")
        if len(parts) != 2:
            return None
        user_id, token_hash = parts
        if user_id in users_db:
            # Simple verification (in production, use proper JWT verification)
            return user_id
        return None
    except:
        return None


def register_user(user_data: UserCreate):
    """Register a new user"""
    email = user_data.email.lower()
    
    # Check if user already exists
    if email in users_db:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists"
        )
    
    # Validate password length
    if len(user_data.password) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 6 characters"
        )
    
    # Create user
    user_id = secrets.token_urlsafe(16)
    hashed_password = hash_password(user_data.password)
    
    user = {
        "id": user_id,
        "name": user_data.name,
        "email": email,
        "password": hashed_password,
        "created_at": datetime.utcnow().isoformat()
    }
    
    users_db[email] = user
    
    # Generate token
    token = generate_token(user_id)
    
    user_response = UserResponse(
        id=user_id,
        name=user_data.name,
        email=email
    )
    
    return user_response, token


def login_user(email: str, password: str):
    """Authenticate user and return token"""
    email = email.lower()
    
    # Check if user exists
    if email not in users_db:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    user = users_db[email]
    
    # Verify password
    if not verify_password(password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Generate token
    token = generate_token(user["id"])
    
    user_response = UserResponse(
        id=user["id"],
        name=user["name"],
        email=user["email"]
    )
    
    return user_response, token


def get_user_by_id(user_id: str) -> Optional[UserResponse]:
    """Get user by ID"""
    for user in users_db.values():
        if user["id"] == user_id:
            return UserResponse(
                id=user["id"],
                name=user["name"],
                email=user["email"]
            )
    return None

