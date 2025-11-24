import chess.engine
import chess
import chess.pgn
import chess.polyglot
from dotenv import load_dotenv
import os


load_dotenv()

class ChessEngineLogic:
    def __init__(self):
        self.engine = chess.engine.SimpleEngine.popen_uci(os.getenv("CHESS_ENGINE_PATH"))

    def chess_move(self, fen: str, time_limit: float = 0.1) -> str:
        board = chess.Board(fen)
        info = self.engine.analyse(board, chess.engine.Limit(time=time_limit))
        # print(info)
        print(info['pv'][0:3])
        return info['pv'][0].uci()

    def chess_pgn(self, moves: list) -> str:
        board = chess.Board()
        game = chess.pgn.Game()
        node = game

        for move in moves:
            chess_move = board.push_san(move)
            node = node.add_variation(chess_move)

        return str(game)

    def san_to_fen(self, moves: list) -> str:
        """
        Exemplo: ["e4", "e5", "Nf3", "Nc6"]
        """
        board = chess.Board()
        for move in moves:
            try:
                board.push_san(move)
            except ValueError:
                raise ValueError(f"Lance inválido: {move}")
        return board.fen()

# logic = ChessEngineLogic()

# moves = ["e4", "e5", "Nf3", "Nc6", "Bb5"]
# fen_final = logic.san_to_fen(moves)

# print("FEN final:", fen_final)
