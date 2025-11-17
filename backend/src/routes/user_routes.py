from fastapi import APIRouter, Depends
from src.controllers.user_crud import UserCRUDController
from src.services.auth import AuthService
from src.repositories.user_repository import UserRepository
from src.db.db_connection import SessionLocal

router = APIRouter()

auth_service = AuthService(UserRepository(SessionLocal()))

@router.get("/users/{username}")
async def get_user_by_username(
    username: str,
    current_user = Depends(auth_service.get_current_user) 
):
    controller = UserCRUDController()
    return controller.get_user_by_username(username)
