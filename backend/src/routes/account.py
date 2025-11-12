from fastapi import status, APIRouter

from src.controllers.create_account import CreateAccountController, User

router = APIRouter()

@router.post("/create-account")
async def create_account_route(payload:User):
    return CreateAccountController().create_account(payload=payload)
    
