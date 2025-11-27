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

ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))
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

    def _get_html_template(self, title: str, message: str, button_text: str, link: str) -> str:
        """Gera um template de e-mail estilizado com o tema Neural Gambit."""
        return f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0f172a; margin: 0; padding: 0; }}
                .container {{ max-width: 600px; margin: 0 auto; background-color: #1e293b; border-radius: 8px; overflow: hidden; margin-top: 40px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }}
                .header {{ background-color: #1e293b; padding: 30px; text-align: center; border-bottom: 1px solid #334155; }}
                .logo-text {{ color: #a855f7; font-size: 24px; font-weight: bold; text-decoration: none; letter-spacing: 1px; }}
                .icon {{ font-size: 24px; margin-right: 8px; }}
                .content {{ padding: 40px 30px; color: #e2e8f0; line-height: 1.6; font-size: 16px; text-align: center; }}
                .h1-title {{ color: #f8fafc; margin-top: 0; font-size: 22px; }}
                .btn {{ display: inline-block; background-color: #7c3aed; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 20px; transition: background-color 0.3s; }}
                .footer {{ background-color: #0f172a; padding: 20px; text-align: center; color: #64748b; font-size: 12px; }}
                .link-alt {{ color: #94a3b8; word-break: break-all; font-size: 12px; margin-top: 20px; display: block; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <span class="logo-text">♟️ Neural Gambit</span>
                </div>
                <div class="content">
                    <h1 class="h1-title">{title}</h1>
                    <p>{message}</p>
                    <a href="{link}" class="btn" style="color: #ffffff;">{button_text}</a>
                    
                    <br><br>
                    <p style="font-size: 14px; color: #94a3b8;">Ou cole este link no seu navegador:</p>
                    <a href="{link}" class="link-alt">{link}</a>
                </div>
                <div class="footer">
                    &copy; {datetime.datetime.now().year} Neural Gambit AI. Todos os direitos reservados.
                </div>
            </div>
        </body>
        </html>
        """

    def send_email(self, to_email: str, subject: str, text_body: str, html_body: str = None):
        msg = MIMEMultipart("alternative")
        msg["From"] = f"Neural Gambit <{SMTP_USER}>"
        msg["To"] = to_email
        msg["Subject"] = subject

        # Anexa versão texto puro (fallback)
        msg.attach(MIMEText(text_body, "plain"))
        
        # Anexa versão HTML (se fornecida)
        if html_body:
            msg.attach(MIMEText(html_body, "html"))

        try:
            with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
                server.starttls()
                server.login(SMTP_USER, SMTP_PASS)
                server.sendmail(SMTP_USER, to_email, msg.as_string())
        except Exception as e:
            print("Failed to send email:", e)

    def send_activation_email(self, user_email: str, activation_token: str):
        activation_link = f"{os.getenv('ACTIVATION_LINK')}?token={activation_token}"
        
        text_body = (
            f"Bem-vindo ao Neural Gambit ♞!\n\n"
            f"Clique no link para ativar sua conta: {activation_link}\n\n"
            f"Este link expira em {ACTIVATION_TOKEN_EXPIRE_HOURS} horas."
        )

        html_body = self._get_html_template(
            title="Ative sua conta",
            message=f"Bem-vindo ao Neural Gambit ! Estamos felizes em tê-lo conosco. Para começar a usar nossa IA de xadrez, por favor confirme seu e-mail.",
            button_text="Ativar Conta Agora",
            link=activation_link
        )

        self.send_email(user_email, "Bem-vindo ao Neural Gambit", text_body, html_body)

    def send_reset_password_email(self, user_email: str, reset_token: str):
        reset_link = f"{os.getenv('RESET_LINK')}?token={reset_token}"
        
        text_body = (
            f"Recuperação de Senha - Neural Gambit\n\n"
            f"Use este link para redefinir sua senha: {reset_link}\n\n"
            f"Este link expira em {RESET_TOKEN_EXPIRE_MINUTES} minutos."
        )

        html_body = self._get_html_template(
            title="Redefinição de Senha",
            message="Recebemos uma solicitação para redefinir a senha da sua conta Neural Gambit. Se não foi você, ignore este e-mail.",
            button_text="Redefinir Minha Senha",
            link=reset_link
        )

        self.send_email(user_email, "Redefinir senha - Neural Gambit", text_body, html_body)


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

    def delete_account(self, user_id: int) -> bool:
        return self.user_repository.delete_user(user_id)

    def change_password(self, user_id: int, new_password: str) -> bool:
        user = self.user_repository.get_user_by_id(user_id)
        if not user:
            return False

        user.password = self.hash_password(new_password)
        self.user_repository.update_user(user)
        return True