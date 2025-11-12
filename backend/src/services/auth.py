import smtplib
import secrets
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from src.repositories.user_repository import UserRepository
import hashlib
import os
from dotenv import load_dotenv

load_dotenv()

class AuthService:
    def __init__(self, user_repository):
        self.user_repository = user_repository

    def create_acount_activation_token(self):
        return secrets.token_urlsafe(16)

    def hash_password(self, password:str):
       return hashlib.md5(password.encode()).hexdigest()

    def send_activation_email(self, user_email: str, activation_token: str):
        sender_email = os.getenv("SENDER_EMAIL")
        receiver_email = user_email
        subject = """
       """
        activation_link = f"{os.getenv("ACTIVATION_LINK")}?token={activation_token}"
        body = f"""
      
        Por favor, clique no link para ativar a sua conta: {activation_link}
        

        """
        msg = MIMEMultipart()
        msg['From'] = sender_email
        msg['To'] = receiver_email
        msg['Subject'] = subject
        msg.attach(MIMEText(body, 'plain')) 
        try:
            with smtplib.SMTP('smtp.gmail.com', 587) as server:
                server.starttls()
                server.login(sender_email, os.getenv("EMAIL_PASSWORD"))
                server.sendmail(sender_email, receiver_email, msg.as_string())
            print("Activation email sent successfully.")
        except Exception as e:
            print(f"Failed to send email: {e}")

    def activate_user_account(self, token: str):
        user = self.user_repository.get_user_by_activation_token(token)
        if user:
            user.is_active = True
            self.user_repository.update_user(user)
            return True
        return False

    def authenticate_user(self, username: str, password: str):
        user = self.user_repository.get_user_by_username(username)
        if user and user.password == password:
            return user
        return None

    def reset_password(self, user_email: str):
        user = self.user_repository.get_user_by_email(user_email)
        if user:
            new_password = secrets.token_urlsafe(8)
            user.password = new_password
            self.user_repository.update_user(user)
            self.send_reset_password_email(user_email, new_password)
            return True
        return False