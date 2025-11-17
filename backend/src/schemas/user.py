from pydantic import BaseModel, EmailStr, constr

class User(BaseModel):
    name: str
    user_name: str
    email: str
    password: str
    level: int
    is_active: bool = True

class UserCreate(BaseModel):
    name: str
    user_name: constr(min_length=3)
    email: EmailStr
    password: constr(min_length=8)
    level: str | None = None

class UserOut(BaseModel):
    id: int
    name: str
    user_name: str
    email: EmailStr
    level: str | None
    is_active: bool

    class Config:
        orm_mode = True

class LoginRequest(BaseModel):
    username: str
    password: str


class PasswordResetRequest(BaseModel):
    token: str
    new_password: str