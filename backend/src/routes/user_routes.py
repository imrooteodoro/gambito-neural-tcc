from src.controllers.user_crud import UserCRUDController
from fastapi import APIRouter, status
from src.schemas.user import User


router = APIRouter()

@router.post("/users", status_code=status.HTTP_201_CREATED, response_model=User)
async def create_user(user: User):
    controller = UserCRUDController()
    new_user = controller.create_user(user)
    return new_user

@router.get("/users/{username}", status_code=status.HTTP_200_OK, response_model=User)
async def get_user_by_username(username: str):
    controller = UserCRUDController()
    user = controller.get_user_by_username(username)
    return user