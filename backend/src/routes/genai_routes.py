from fastapi import APIRouter, status
from fastapi.responses import StreamingResponse
from src.controllers.genai_controller import GenAIController
from src.schemas.user_message_schema import UserMessageSchema

router = APIRouter()

@router.post("/analyze", status_code=status.HTTP_200_OK)
async def analyze_position(prompt: UserMessageSchema):
    controller = GenAIController()

    async def event_stream():
        response = controller.analyze_position(prompt.message)
        for chunk in response:
            # print(chunk.content + "\n")
            yield chunk.content

    return StreamingResponse(event_stream(), media_type="text/event-stream")
