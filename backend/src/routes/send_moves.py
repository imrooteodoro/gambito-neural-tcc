from fastapi import APIRouter, status, Depends
from src.controllers.genai_chess_controller import GenAIChessController, MovesSchema
from fastapi.responses import StreamingResponse
from src.services.auth import AuthService
from src.db.db_connection import SessionLocal
from src.repositories.user_repository import UserRepository


auth_service = AuthService(UserRepository(SessionLocal()))

router = APIRouter()

@router.post("/send-moves", status_code=status.HTTP_200_OK)
async def send_moves(moves: MovesSchema, 
current_user = Depends(auth_service.get_current_user)
) -> StreamingResponse:
    controller = GenAIChessController()
    async def event_stream():
        response = controller.get_insight(moves)
        for chunk in response:
            yield chunk.content

    return StreamingResponse(event_stream(), media_type="text/event-stream")