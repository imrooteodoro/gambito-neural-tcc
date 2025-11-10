from sqlalchemy import Table, Column, Integer, String, Boolean
from src.db.db_connection import *

class Users(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    user_name = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    level = Column(Integer, default=1)
    is_active = Column(Boolean, default=True)