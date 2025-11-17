from src.services.auth import AuthService
from src.repositories.user_repository import UserRepository
from src.models.User import Users
from src.db.db_connection import SessionLocal
import datetime
import os
from dotenv import load_dotenv


load_dotenv()

class CreateAccountService:
    def __init__(self):
        self.db = SessionLocal()
        self.user_repository = UserRepository(self.db)
        self.auth_service = AuthService(self.user_repository)

    def create_account(self, user_data):
        existing_user = self.user_repository.get_user_by_email(user_data.email)
        if existing_user:
            raise ValueError("E-mail já cadastrado.")

        hashed_password = self.auth_service.hash_password(user_data.password)

        activation_token = self.auth_service.create_activation_token()
        activation_expires = datetime.datetime.utcnow() + datetime.timedelta(hours=int(os.getenv("ACTIVATION_EXPIRE_HOURS", 48)))

        new_user = Users(
            name=user_data.name,
            user_name=user_data.user_name,
            email=user_data.email,
            password=hashed_password,
            level=user_data.level,
            is_active=False,
            activation_token=activation_token,
            activation_expires_at=activation_expires
            
        )

        saved = self.user_repository.save_user(new_user)
        self.auth_service.send_activation_email(user_data.email, activation_token)

        return {"message": "Conta criada com sucesso. Verifique seu e-mail para ativar a conta."}
