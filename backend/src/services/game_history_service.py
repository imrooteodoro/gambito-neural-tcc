from src.repositories.user_repository import UserRepository
from src.models.User import GameHistory, Studies
from src.db.db_connection import SessionLocal


class GameHistoryService:
    def __init__(self, db=None):
        # permite injeção de session pela rota
        self.db = db or SessionLocal()
        self.user_repository = UserRepository(self.db)

    # ===========================
    #     GAME HISTORY CRUD
    # ===========================

    def insert_game_history(self, user_id: int, game_data: dict):
        """
        game_data deve conter:
        { "game_pgn": "<pgn>" }
        """
        new_game = GameHistory(
            user_id=user_id,
            game_pgn=game_data["game_pgn"]
        )
        return self.user_repository.insert_game_history(new_game)

    def get_game_history_by_user(self, user_id: int):
        return self.user_repository.get_game_history_by_user(user_id)

    def delete_game_history(self, game_history_id: int) -> bool:
        return self.user_repository.delete_game_history(game_history_id)

    # ===========================
    #     STUDIES CRUD
    # ===========================

    def insert_study(self, user_id: int, study_data: str):
        study = Studies(
            user_id=user_id,
            study_data=study_data
        )
        return self.user_repository.insert_study(study)

    def get_studies_by_user(self, user_id: int):
        return self.user_repository.get_studies_by_user(user_id)

    def delete_study(self, study_id: int, user_id: int) -> bool:
        return self.user_repository.delete_study(study_id, user_id)
