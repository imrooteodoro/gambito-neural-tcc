from fastapi import FastAPI, status
from src.routes.genai_routes import router as genai_router
from src.routes.send_moves import router as send_moves_router
from src.routes.user_routes import router as user_router
from src.routes.account import router as account_routes
from src.routes.games_routes import router as games_router
from src.routes.studies_routes import studies_router
from src.routes.me import router as me_router
from src.core.chess_engine import ChessEngineLogic
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
# from src.db.db_connection import *




app = FastAPI(
    title="Chess Application API",
    description="API based in GenAI to analyze chess positions.",
    version="1.0.0",
    contact={
        "name": "Neural Gambit",
        "email": 'imrooteodoro.ai.dev@gmail.com'}  
)

load_dotenv()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", status_code=status.HTTP_200_OK)
async def health_route() -> dict:
    return {"status": "Chess app is running"}

app.include_router(genai_router, prefix="/genai", tags=["GenAI"])
app.include_router(send_moves_router, prefix="/moves", tags=["Moves"])
app.include_router(user_router, prefix="/api", tags=["Users"])
app.include_router(account_routes, prefix="/signup", tags=["Signup"])
app.include_router(me_router, prefix="/auth", tags=["Auth"])
app.include_router(games_router, prefix="/games", tags=["Games"])
app.include_router(studies_router, prefix="/studies", tags=["Studies"])
