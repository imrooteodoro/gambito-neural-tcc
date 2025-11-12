from src.services.create_account import CreateAccountService
from src.schemas.user import User

class CreateAccountController:
    def __init__(self):
        self.create_account_service = CreateAccountService()

    def create_account(self,payload: User):
        response = self.create_account_service.create_account(user_data=payload)
        return response
