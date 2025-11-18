from src.models.User import Users
from sqlalchemy.orm import Session
import datetime

class UserRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_user_by_id(self, user_id: int):
        return self.db.query(Users).filter(Users.id == user_id).first()

    def get_user_by_email(self, email: str):
        return self.db.query(Users).filter(Users.email == email).first()

    def get_user_by_username(self, username: str):
        return self.db.query(Users).filter(Users.user_name == username).first()

    def get_user_by_activation_token(self, token: str):
        now = datetime.datetime.utcnow()
        return self.db.query(Users).filter(
            Users.activation_token == token,
            Users.activation_expires_at != None,
            Users.activation_expires_at > now
        ).first()

    def get_user_by_reset_token(self, token: str):
        now = datetime.datetime.utcnow()
        return self.db.query(Users).filter(
            Users.reset_token == token,
            Users.reset_expires_at != None,
            Users.reset_expires_at > now
        ).first()

    def save_user(self, user: Users):
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user

    def update_user(self, user: Users):
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user
    def delete_user(self, user_id: int):
        user = self.db.query(Users).filter(Users.id == user_id).first()
        if not user:
            return False
        self.db.delete(user)
        self.db.commit()
        return True
