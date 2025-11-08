FROM python:3.12-slim-bookworm

WORKDIR /app

COPY pyproject.toml uv.lock* ./

RUN pip install --no-cache-dir uv

COPY  . .

EXPOSE 8000

CMD ["uv", "run", "fastapi", "run", "backend/src/main.py", "--host", "0.0.0.0", "--port", "8000"]
