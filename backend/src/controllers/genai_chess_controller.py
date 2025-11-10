from src.core.chess_engine import ChessEngineLogic
from src.services.genai import Genai
from src.schemas.moves import MovesSchema


class GenAIChessController:
    def __init__(self):
        self.genai_service = Genai()
        self.chess_engine = ChessEngineLogic()

    def get_insight(self, moves:MovesSchema) -> str:
        chess_engine = self.chess_engine.san_to_fen(moves.moves)
        print("FEN final:", chess_engine)
        genai = self.genai_service._run_translate_agent(moves=moves.moves, user_message=str(chess_engine))
        return genai
        