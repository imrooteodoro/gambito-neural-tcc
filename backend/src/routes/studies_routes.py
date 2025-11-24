from fastapi import APIRouter, Depends, HTTPException
from src.services.auth import AuthService
from src.repositories.user_repository import UserRepository
from src.services.game_history_service import GameHistoryService
from src.services.chart_service import ChartService  
from src.db.db_connection import SessionLocal
from src.models.User import Users
from src.schemas.game_data import GameData
from src.core.langchain_config import chess_agent

studies_router = APIRouter(prefix="/studies", tags=["Studies"])


def get_auth_service():
    return AuthService(UserRepository(SessionLocal()))

def get_studies_service():
    return GameHistoryService()

def get_chart_service(
    data_service: GameHistoryService = Depends(get_studies_service)
):
    return ChartService(game_history_service=data_service, llm=chess_agent)



@studies_router.post("/insert", status_code=201)
async def insert_study(
    data: GameData,
    current_user: Users = Depends(get_auth_service().get_current_user),
    service: GameHistoryService = Depends(get_studies_service)
):
    try:
        new_study = service.insert_study(
            user_id=current_user.id,
            study_data=data.game_pgn
        )
        return {
            "message": "Study inserted successfully",
            "data": {"id": new_study.id, "study_data": new_study.study_data}
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



@studies_router.get("/statistics", status_code=200)
async def get_dashboard_statistics(
    current_user: Users = Depends(get_auth_service().get_current_user), # Valida Token
    chart_service: ChartService = Depends(get_chart_service)            # Injeta Service+IA
):
    """
    Gera estatísticas e gráficos para o dashboard baseados nos estudos do usuário.
    Retorna JSON formatado para Recharts.
    """
    try:
        chart_data = chart_service.generate_chart_data(current_user.id)
        return chart_data
    except Exception as e:
        print(f"Error generating dashboard: {e}")
        raise HTTPException(status_code=500, detail="Erro ao processar dados de inteligência.")