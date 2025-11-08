from fastapi import FastAPI, status
from src.routes.genai_routes import router as genai_router

app = FastAPI(
    title="Chess Application API",
    description="API based in GenAI to analyze chess positions.",
    version="1.0.0",
    contact={
        "name": "Neural Gambit",
        "email": 'imrooteodoro.ai.dev@gmail.com' }  
)


@app.get("/health", status_code=status.HTTP_200_OK)
async def health_route() -> dict:
    return {"status": "Chess app is running"}

app.include_router(genai_router, prefix="/genai", tags=["GenAI"])