"""
Configuration settings for the FastAPI application
Loads environment variables from .env file
"""
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # Flipkart API Credentials (using dummy values for sample project)
    flipkart_affiliate_id: str = "dummy_affiliate_id_12345"
    flipkart_affiliate_token: str = "dummy_affiliate_token_abcdef123456"
    flipkart_base_url: str = "https://affiliate-api.flipkart.net/affiliate/1.0"
    
    # CORS Configuration
    cors_allowed_origins: str = "http://localhost:5173,http://localhost:3000"
    
    # Server Configuration
    port: int = 8000
    host: str = "0.0.0.0"
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False
    
    @property
    def cors_origins_list(self) -> List[str]:
        """Convert comma-separated CORS origins to list"""
        return [
            origin.strip() 
            for origin in self.cors_allowed_origins.split(",") 
            if origin.strip()
        ]


# Global settings instance
settings = Settings()


