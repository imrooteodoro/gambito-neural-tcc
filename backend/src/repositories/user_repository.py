from src.models.User import Users, GameHistory, Studies, Statistics
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

    # GameHistory methods
    def insert_game_history(self, game_history: GameHistory):
        self.db.add(game_history)
        self.db.commit()
        self.db.refresh(game_history)
        return game_history

    def get_game_history_by_user(self, user_id: int):
        return self.db.query(GameHistory).filter(GameHistory.user_id == user_id).all()

    # Studies methods
    def insert_study(self, study: Studies):
        self.db.add(study)
        self.db.commit()
        self.db.refresh(study)
        return study

    def get_studies_by_user(self, user_id: int):
        return self.db.query(Studies).filter(Studies.user_id == user_id).all()
    
    # Statistics methods
    def insert_statistics(self, statistics: Statistics):
        self.db.add(statistics)
        self.db.commit()
        self.db.refresh(statistics)
        return statistics

    def get_statistics_by_user(self, user_id: int):
        return self.db.query(Statistics).filter(Statistics.user_id == user_id).all()

    def delete_study(self, study_id: int) -> bool:
        study = self.db.query(Studies).filter(Studies.id == study_id).first()
        if not study:
            return False

        self.db.delete(study)
        self.db.commit()
        return True