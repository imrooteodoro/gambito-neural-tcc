from fastapi import APIRouter, HTTPException, Depends, status
from src.schemas.user import UserCreate, LoginRequest, PasswordResetRequest
from src.services.create_account import CreateAccountService
from src.services.auth import AuthService
from src.db.db_connection import SessionLocal
from src.repositories.user_repository import UserRepository


router = APIRouter(prefix="/auth", tags=["Auth"])


def get_auth_service():
    return AuthService(UserRepository(SessionLocal()))

def get_create_account_service():
    return CreateAccountService()


@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(user: UserCreate, service: CreateAccountService = Depends(get_create_account_service)):
    try:
        return service.create_account(user)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/login")
def login(
    form_data: LoginRequest,
    auth_service: AuthService = Depends(get_auth_service)
):
    res = auth_service.authenticate_user(form_data.username, form_data.password)
    if not res:
        raise HTTPException(status_code=401, detail="Invalid credentials or inactive account")
    return res


@router.get("/activate")
def activate(token: str, auth_service: AuthService = Depends(get_auth_service)):
    ok = auth_service.activate_user_account(token)
    if not ok:
        raise HTTPException(status_code=400, detail="Invalid or expired token")
    return {"message": "Conta ativada com sucesso."}


@router.post("/password/forgot")
def forgot_password(
    body: dict,
    auth_service: AuthService = Depends(get_auth_service)
):
    user_email = body.get("email")

    auth_service.initiate_password_reset(user_email)
    return {"message": "Se o e-mail existe, um link foi enviado."}


@router.post("/password/reset")
def password_reset(
    req: PasswordResetRequest,
    auth_service: AuthService = Depends(get_auth_service)
):
    ok = auth_service.reset_password(req.token, req.new_password)
    if not ok:
        raise HTTPException(status_code=400, detail="Token inválido ou expirado")
    return {"message": "Senha redefinida com sucesso."}

auth_service = AuthService(UserRepository(SessionLocal()))

@router.post("delete_account")
async def delete_account(
    auth_service: AuthService = Depends(get_auth_service),
    current_user = Depends(auth_service.get_current_user)
):
    user = current_user
    auth_service.user_repository.delete_user(user)
    return {"message": "Conta deletada com sucesso."}