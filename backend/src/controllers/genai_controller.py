from src.services.genai import Genai


class GenAIController:
    def __init__(self):
        self.genai_service = Genai()

    def analyze_position(self, prompt: str) -> str:
        response = self.genai_service._run_chess_agent(prompt)
        return response