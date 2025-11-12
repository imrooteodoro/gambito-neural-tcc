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

class Studies(Base):
    __tablename__ = 'studies'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    study_data = Column(String, nullable=False)

class GameHistory(Base):
    __tablename__ = 'game_history'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    game_data = Column(String, nullable=False)

class Preferences(Base):
    __tablename__ = 'preferences'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    preference_data = Column(String, nullable=False)

class Statistics(Base):
    __tablename__ = 'statistics'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    statistics_data = Column(String, nullable=False)


Base.metadata.create_all(bind=engine)