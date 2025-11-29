from langchain_core.chat_history import InMemoryChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.messages import trim_messages
from langchain_core.runnables import RunnablePassthrough
from operator import itemgetter

from src.core.langchain_config import chess_agent
from src.prompts.core_prompt import core_prompt, translate_chessengine_output_prompt

class Genai:
    def __init__(self):

        self.store = {}

  
        self.trimmer = trim_messages(
            max_tokens=2000,        # Mantém aprox. as últimas ~15-20 jogadas/falas
            strategy="last",        # Mantém as mais recentes
            token_counter=chess_agent, # Conta tokens usando o próprio tokenizador do modelo
            include_system=True,    # CRÍTICO: Nunca apaga o System Prompt ("Você é um GM...")
            allow_partial=False,    # Não corta mensagens no meio
            start_on="human",       # Garante que o corte comece numa mensagem do humano
        )

        chain = (
            RunnablePassthrough.assign(
                history=itemgetter("history") | self.trimmer
            )
            | core_prompt
            | chess_agent
        )

        self.agent_with_history = RunnableWithMessageHistory(
            chain,
            self._get_session_history,
            input_messages_key="user_message",
            history_messages_key="history",
        )

    def _get_session_history(self, session_id: str) -> InMemoryChatMessageHistory:
        """Fabrica ou recupera o histórico da RAM para um ID específico."""
        if session_id not in self.store:
            self.store[session_id] = InMemoryChatMessageHistory()
        return self.store[session_id]

    def _run_chess_agent(self, user_message: str, session_id: str = "default_session") -> str:
        """
        Roda o agente. O session_id é crucial para não misturar conversas se
        tiver mais de uma pessoa usando.
        """
        response = self.agent_with_history.stream(
            {"user_message": user_message},
            config={"configurable": {"session_id": session_id}}
        )
        return response

    def _run_translate_agent(self, moves: list[str], board_pgn: str) -> str:
        prompt = translate_chessengine_output_prompt.format(
            moves=moves, 
            board_pgn=board_pgn
        )
        response = chess_agent.stream(prompt)
        return response