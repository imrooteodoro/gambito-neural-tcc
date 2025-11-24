from fastapi import APIRouter, status, Depends
from fastapi.responses import StreamingResponse
from src.controllers.genai_controller import GenAIController
from src.schemas.user_message_schema import UserMessageSchema
from src.services.auth import AuthService
from src.models.User import Users
from src.repositories.user_repository import UserRepository
from src.db.db_connection import SessionLocal

auth_service = AuthService(UserRepository(SessionLocal()))

router = APIRouter()

@router.post("/analyze", status_code=status.HTTP_200_OK)
async def analyze_position(prompt: UserMessageSchema, current_user: Users = Depends(auth_service.get_current_user)) -> StreamingResponse:
    controller = GenAIController()

    async def event_stream():
        response = controller.analyze_position(prompt.message)
        for chunk in response:
            # print(chunk.content + "\n")
            yield chunk.content

    return StreamingResponse(event_stream(), media_type="text/event-stream")
