import os
import bcrypt
import secrets
import datetime
import jwt
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import smtplib
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from dotenv import load_dotenv

load_dotenv()

JWT_SECRET = os.getenv("JWT_SECRET")
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))
ACTIVATION_TOKEN_EXPIRE_HOURS = int(os.getenv("ACTIVATION_EXPIRE_HOURS", "48"))
RESET_TOKEN_EXPIRE_MINUTES = int(os.getenv("RESET_EXPIRE_MINUTES", "15"))

SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SMTP_USER = os.getenv("SENDER_EMAIL")
SMTP_PASS = os.getenv("EMAIL_PASSWORD")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


class AuthService:
    def __init__(self, user_repository):
        self.user_repository = user_repository

    def hash_password(self, password: str) -> str:
        hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt())
        return hashed.decode()

    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        try:
            return bcrypt.checkpw(plain_password.encode(), hashed_password.encode())
        except Exception:
            return False

    def create_access_token(self, subject: dict, expires_delta=None) -> str:
        now = datetime.datetime.utcnow()
        expire = now + (expires_delta or datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))

        to_encode = {**subject, "exp": expire, "iat": now}

        return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)

    def validate_token(self, token: str):
        """Valida e decodifica um JWT de forma segura."""
        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
            return payload

        except jwt.ExpiredSignatureError:
            raise HTTPException(status_code=401, detail="Token expirado")

        except jwt.InvalidTokenError:
            raise HTTPException(status_code=401, detail="Token inválido")

    def create_activation_token(self) -> str:
        return secrets.token_urlsafe(32)

    def create_reset_token(self) -> str:
        return secrets.token_urlsafe(32)

    def send_email(self, to_email: str, subject: str, body: str):
        msg = MIMEMultipart()
        msg["From"] = SMTP_USER
        msg["To"] = to_email
        msg["Subject"] = subject
        msg.attach(MIMEText(body, "plain"))

        try:
            with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
                server.starttls()
                server.login(SMTP_USER, SMTP_PASS)
                server.sendmail(SMTP_USER, to_email, msg.as_string())
        except Exception as e:
            print("Failed to send email:", e)

    def send_activation_email(self, user_email: str, activation_token: str):
        activation_link = f"{os.getenv('ACTIVATION_LINK')}?token={activation_token}"
        body = (
            f"Olá,\n\nClique no link para ativar sua conta: {activation_link}"
            f"\n\nEsse link expira em {ACTIVATION_TOKEN_EXPIRE_HOURS} horas."
        )
        self.send_email(user_email, "Ative sua conta", body)

    def send_reset_password_email(self, user_email: str, reset_token: str):
        reset_link = f"{os.getenv('RESET_LINK')}?token={reset_token}"
        body = (
            f"Olá,\n\nUse este link para redefinir sua senha: {reset_link}"
            f"\n\nEsse link expira em {RESET_TOKEN_EXPIRE_MINUTES} minutos."
        )
        self.send_email(user_email, "Redefinir senha", body)


    def activate_user_account(self, token: str) -> bool:
        user = self.user_repository.get_user_by_activation_token(token)
        if not user:
            return False

        user.is_active = True
        user.activation_token = None
        user.activation_expires_at = None
        self.user_repository.update_user(user)
        return True

    def initiate_password_reset(self, user_email: str) -> bool:
        user = self.user_repository.get_user_by_email(user_email)
        if not user:
            return False

        token = self.create_reset_token()
        user.reset_token = token
        user.reset_expires_at = datetime.datetime.utcnow() + datetime.timedelta(
            minutes=RESET_TOKEN_EXPIRE_MINUTES
        )
        self.user_repository.update_user(user)
        self.send_reset_password_email(user_email, token)
        return True

    def reset_password(self, token: str, new_password: str) -> bool:
        user = self.user_repository.get_user_by_reset_token(token)
        if not user:
            return False

        user.password = self.hash_password(new_password)
        user.reset_token = None
        user.reset_expires_at = None
        self.user_repository.update_user(user)
        return True


    def authenticate_user(self, username: str, password: str):
        user = self.user_repository.get_user_by_username(username)

        if user and self.verify_password(password, user.password) and user.is_active:
            payload = {"sub": str(user.id), "user_name": user.user_name, "email": user.email}
            token = self.create_access_token(payload)
            return {"access_token": token, "token_type": "bearer"}

        return None


    def get_current_user(self, token: str = Depends(oauth2_scheme)):
        payload = self.validate_token(token)
        user_id = payload.get("sub")

        if not user_id:
            raise HTTPException(status_code=401, detail="Token inválido")

        user = self.user_repository.get_user_by_id(int(user_id))

        if not user:
            raise HTTPException(status_code=404, detail="Usuário não encontrado")
        
        return user  

    def get_user_from_token(self, token: str):
        payload = self.validate_token(token)
        user_id = payload.get("sub")

        if not user_id:
            return None

        return self.user_repository.get_user_by_id(int(user_id))
