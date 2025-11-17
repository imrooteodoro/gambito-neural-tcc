from fastapi import APIRouter, HTTPException, Depends, status, Header
from src.services.auth import AuthService
from src.repositories.user_repository import UserRepository
from src.db.db_connection import SessionLocal

router = APIRouter(prefix="/auth", tags=["Auth"])

def get_auth_service():
    return AuthService(UserRepository(SessionLocal()))


@router.get("/me")
def get_logged_user(
    authorization: str = Header(None),
    auth_service: AuthService = Depends(get_auth_service)
):
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")

    try:
        scheme, token = authorization.split()
        
        if scheme.lower() != "bearer":
            raise ValueError("Invalid scheme")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid Authorization header format")

    user = auth_service.get_user_from_token(token)

    if not user:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    return {
        "id": user.id,
        "username": user.user_name,
        "email": user.email,
        "full_name": user.name,
        "level": user.level,
        "is_active": user.is_active,
    }
