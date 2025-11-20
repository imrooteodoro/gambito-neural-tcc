from pydantic import BaseModel

class GameData(BaseModel):
    game_pgn: str