from pydantic import BaseModel

class MovesSchema(BaseModel):
    moves: list[str]