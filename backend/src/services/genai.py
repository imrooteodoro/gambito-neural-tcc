from src.core.langchain_config import chess_agent
from src.prompts.core_prompt import core_prompt


class Genai:
    def __init__(self):
        pass
    def _run_chess_agent(self, user_message: str) -> str:
        prompt = core_prompt.format(user_message=user_message)
        response = chess_agent.stream(prompt)
        return response