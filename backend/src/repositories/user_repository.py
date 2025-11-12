from src.models.User import Users

class UserRepository:
    def __init__(self, db):
        self.db = db

    def get_user_by_email(self, email: str):
        return self.db.query(Users).filter(Users.email == email).first()

    def get_user_by_username(self, username: str):
        return self.db.query(Users).filter(Users.user_name == username).first()

    def get_user_by_activation_token(self, token: str):
        return self.db.query(Users).filter(Users.activation_token == token).first()

    def save_user(self, user: Users):
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user

    def update_user(self, user: Users):
        self.db.commit()
        self.db.refresh(user)
        return user
