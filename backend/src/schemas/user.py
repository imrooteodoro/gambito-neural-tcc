from pydantic import BaseModel

class User(BaseModel):
    name: str
    user_name: str
    email: str
    password: str
    level: int
    is_active: bool = True