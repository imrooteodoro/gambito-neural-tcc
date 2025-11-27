from src.core.langchain_config import chess_agent
from src.prompts.core_prompt import core_prompt, translate_chessengine_output_prompt

class Genai:
    def __init__(self):
        self.memory = []

    def _get_history_string(self) -> str:
        if not self.memory:
            return "Nenhum histórico anterior."
        
       
        return "\n".join([f"{msg['role']}: {msg['content']}" for msg in self.memory])

    def _update_memory(self, role: str, content: str):
        """Adiciona uma nova interação à memória"""
        self.memory.append({"role": role, "content": content})
        
        if len(self.memory) > 20: 
            self.memory.pop(0)

    def _run_chess_agent(self, user_message: str):
        chat_history_str = self._get_history_string()
        prompt = core_prompt.format(
            user_message=user_message,
            chat_history=chat_history_str
        )
        
        self._update_memory("User", user_message)

        response_stream = chess_agent.stream(prompt)
        
        full_ai_response = ""
        
        for chunk in response_stream:
            content = chunk.content if hasattr(chunk, 'content') else str(chunk)
            full_ai_response += content
            yield content 

        self._update_memory("AI", full_ai_response)

    def _run_translate_agent(self, moves: list[str], board_pgn: str) -> str:
       
        prompt = translate_chessengine_output_prompt.format(moves=moves, board_pgn=board_pgn)
        response = chess_agent.stream(prompt)
        return response