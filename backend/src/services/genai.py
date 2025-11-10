from src.core.langchain_config import chess_agent
from src.prompts.core_prompt import core_prompt, translate_chessengine_output_prompt


class Genai:
    # def __init__(self):
    #     pass
    def _run_chess_agent(self, user_message: str) -> str:
        prompt = core_prompt.format(user_message=user_message)
        response = chess_agent.stream(prompt)
        return response
    def _run_translate_agent(self, moves:list[str], user_message: str) -> str:
        prompt = translate_chessengine_output_prompt.format(user_message=user_message, moves=moves)
        response = chess_agent.stream(prompt)
        print("Translate Agent Response:", response)
        return response