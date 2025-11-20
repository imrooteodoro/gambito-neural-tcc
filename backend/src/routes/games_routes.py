from fastapi import APIRouter, Depends, HTTPException
from src.services.auth import AuthService
from src.repositories.user_repository import UserRepository
from src.services.game_history_service import GameHistoryService
from src.db.db_connection import SessionLocal
from src.models.User import Users
from src.schemas.game_data import GameData

router = APIRouter(prefix="/games", tags=["Games"])

def get_auth_service():
    return AuthService(UserRepository(SessionLocal()))

def get_game_history_service():
    return GameHistoryService()


@router.post("/insert", status_code=201)
async def insert_game_history(
    game_data: GameData,
    current_user: Users = Depends(lambda: get_auth_service().get_current_user()),
    service: GameHistoryService = Depends(get_game_history_service)
):
    try:
        result = service.insert_game_history(
            user_id=current_user.id,
            game_data=game_data.game_pgn
        )
        return {
            "message": "Game history inserted successfully",
            "data": {
                "id": result.id,
                "pgn": result.game_pgn
            }
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/list", status_code=200)
async def list_game_history(
    current_user: Users = Depends(lambda: get_auth_service().get_current_user()),
    service: GameHistoryService = Depends(get_game_history_service)
):
    try:
        games = service.get_game_history_by_user(current_user.id)

        return {
            "message": "Games fetched successfully",
            "count": len(games),
            "games": [
                {
                    "id": game.id,
                    "pgn": game.game_pgn,
                    "created_at": game.created_at.isoformat() if game.created_at else None
                }
                for game in games
            ]
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/delete/{game_id}", status_code=200)
async def delete_game_history(
    game_id: int,
    current_user: Users = Depends(lambda: get_auth_service().get_current_user()),
    service: GameHistoryService = Depends(get_game_history_service)
):
    deleted = service.delete_game_history(game_id)

    if not deleted:
        raise HTTPException(status_code=404, detail="Game not found")

    return {"message": "Game deleted successfully"}
