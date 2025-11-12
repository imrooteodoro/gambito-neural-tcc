from src.services.auth import AuthService, UserRepository
from src.schemas.user import User
from src.db.db_connection import SessionLocal
from src.models.User import Users 

class CreateAccountService:
    def __init__(self):
        self.db = SessionLocal()
        self.user_repository = UserRepository(self.db)
        self.auth_service = AuthService(self.user_repository)

    def create_account(self, user_data: User):
        existing_user = self.user_repository.get_user_by_email(user_data.email)
        print(existing_user)
        if existing_user:
            raise ValueError("E-mail já cadastrado.")

        print(user_data.password)

        hashed_password = self.auth_service.hash_password(user_data.password)

        activation_token = self.auth_service.create_acount_activation_token()

        new_user = Users(
            name=user_data.name,
            user_name=user_data.user_name,
            email=user_data.email,
            password=hashed_password,
            level=user_data.level,
            is_active=False,
            # activation_token=activation_token
        )

        self.user_repository.save_user(new_user)

        self.auth_service.send_activation_email(user_data.email, activation_token)

        return {"message": "Conta criada com sucesso. Verifique seu e-mail para ativar a conta."}
