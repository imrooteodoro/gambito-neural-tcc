from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from src.db.db_connection import Base, engine


class Users(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    user_name = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    level = Column(String, default=1)
    is_active = Column(Boolean, default=False)
    activation_token = Column(String, nullable=True)
    activation_expires_at = Column(DateTime, nullable=True)

    studies = relationship("Studies", back_populates="user", cascade="all, delete-orphan")
    games = relationship("GameHistory", back_populates="user", cascade="all, delete-orphan")
    preferences = relationship("Preferences", back_populates="user", cascade="all, delete-orphan")
    statistics = relationship("Statistics", back_populates="user", cascade="all, delete-orphan")


class Studies(Base):
    __tablename__ = 'studies'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete="CASCADE"))
    study_data = Column(String, nullable=False)

    user = relationship("Users", back_populates="studies")


class GameHistory(Base):
    __tablename__ = 'game_history'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete="CASCADE"))
    game_pgn = Column(String, nullable=False)


    user = relationship("Users", back_populates="games")


class Preferences(Base):
    __tablename__ = 'preferences'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete="CASCADE"))
    preference_data = Column(String, nullable=False)

    user = relationship("Users", back_populates="preferences")


class Statistics(Base):
    __tablename__ = 'statistics'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete="CASCADE"))
    statistics_data = Column(String, nullable=False)

    user = relationship("Users", back_populates="statistics")


Base.metadata.create_all(bind=engine)