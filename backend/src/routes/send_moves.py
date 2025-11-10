from fastapi import APIRouter, status
from src.controllers.genai_chess_controller import GenAIChessController, MovesSchema
from fastapi.responses import StreamingResponse

router = APIRouter()

@router.post("/send-moves", status_code=status.HTTP_200_OK)
async def send_moves(moves: MovesSchema) -> StreamingResponse:
    controller = GenAIChessController()
    async def event_stream():
        response = controller.get_insight(moves)
        for chunk in response:
            yield chunk.content

    return StreamingResponse(event_stream(), media_type="text/event-stream")