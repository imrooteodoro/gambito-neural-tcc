from langchain import chat_models
from dotenv import load_dotenv
import os
import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
)

load_dotenv()

variables = {
    "MODEL_NAME": os.getenv("MODEL_NAME"),
    "MODEL_PROVIDER": os.getenv("MODEL_PROVIDER"),
    "GENAI_API_KEY": os.getenv("GENAI_API_KEY"),
}

for variable in variables:
    if variables[variable] is None:
        logging.error(f"Environment variable {variable} is not set.")
        raise ValueError(f"Environment variable {variable} is not set.")

chess_agent = chat_models.init_chat_model(
    model=variables["MODEL_NAME"],
    model_provider= variables["MODEL_PROVIDER"],
    api_key=variables["GENAI_API_KEY"],
    )