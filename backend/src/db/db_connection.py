from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv
import logging

load_dotenv()

database_variables = {
    "DB_USER": os.getenv("DB_USER"),
    "DB_PASSWORD": os.getenv("DB_PASSWORD"),
    "DB_HOST": os.getenv("DB_HOST"),
    "DB_PORT": os.getenv("DB_PORT"),
    "DB_NAME": os.getenv("DB_NAME"),
}

for variable in database_variables:
    if database_variables[variable] is None:
        raise ValueError(f"Environment variable {variable} is not set.")

user = database_variables["DB_USER"]
password = database_variables["DB_PASSWORD"]
host = database_variables["DB_HOST"]
port = database_variables["DB_PORT"]
dbname = database_variables["DB_NAME"]

DATABASE_URL = f"postgresql://{user}:{password}@{host}:{port}/{dbname}"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

with engine.connect() as connection:
    connection.execute(text("SELECT 1"))
    logging.info(f"Database {dbname} connection established successfully.")
