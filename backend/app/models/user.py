"""
User models for authentication
"""
from pydantic import BaseModel, EmailStr
from typing import Optional


class UserCreate(BaseModel):
    """User registration model"""
    name: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    """User login model"""
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    """User response model (without password)"""
    id: str
    name: str
    email: str


class TokenResponse(BaseModel):
    """Token response model"""
    token: str
    user: UserResponse

