.PHONY: run-backend

run-backend:
	@uv run fastapi run backend/src/main.py

frontend-run: 
	@uv run flet -w frontend/src/main.py