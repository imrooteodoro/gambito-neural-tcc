from src.db.db_connection import SessionLocal
from src.models.User import Users
from src.schemas.user import User

class InsertUserService:
    def __init__(self):
        self.db = SessionLocal()

    def insert_user(self, user: User):
        db_user = Users(
            name=user.name,
            user_name=user.user_name,
            email=user.email,
            password=user.password,
            level=user.level,
            is_active=user.is_active
        )
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        return db_user
    def get_user_by_username(self, user_name: str):
        return self.db.query(Users).filter(Users.user_name == user_name).first()