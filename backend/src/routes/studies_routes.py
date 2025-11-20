# ...existing code...
from fastapi import APIRouter, Depends, HTTPException
from src.services.auth import AuthService
from src.repositories.user_repository import UserRepository
from src.services.game_history_service import GameHistoryService
from src.db.db_connection import SessionLocal
from src.models.User import Users
from src.schemas.game_data import GameData

studies_router = APIRouter(prefix="/studies", tags=["Studies"])

def get_auth_service():
    return AuthService(UserRepository(SessionLocal()))

def get_studies_service():
    return GameHistoryService()

@studies_router.post("/insert", status_code=201)
async def insert_study(
    data: GameData,
    current_user: Users = Depends(get_auth_service().get_current_user),
    service: GameHistoryService = Depends(get_studies_service)
):
    try:
        # print(data.game_pgn)
        new_study = service.insert_study(
            user_id=current_user.id,
            study_data=data.game_pgn
        )

        return {
            "message": "Study inserted successfully",
            "data": {
                "id": new_study.id,
                "study_data": new_study.study_data
            }
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@studies_router.get("/list", status_code=200)
async def list_studies(
    current_user: Users = Depends(get_auth_service().get_current_user),
    service: GameHistoryService = Depends(get_studies_service)
):
    studies = service.get_studies_by_user(current_user.id)

    return {
        "message": "Studies fetched successfully",
        "count": len(studies),
        "studies": [
            {
                "id": s.user_id,
                "study_data": s.study_data,
                "created_at": s.created_at.isoformat() if s.created_at else None
            }
            for s in studies
        ]
    }


@studies_router.delete("/delete/{study_id}", status_code=200)
async def delete_study(
    study_id: int,
    current_user: Users = Depends(get_auth_service().get_current_user),
    service: GameHistoryService = Depends(get_studies_service)
):
    deleted = service.delete_study(study_id, current_user.id)

    if not deleted:
        raise HTTPException(status_code=404, detail="Study not found")

    return {"message": "Study deleted successfully"}
