.PHONY: run docker-build docker-up docker-down docker-run

IMAGE_NAME = gambito-neural-tcc-backend

run:
	@uv run fastapi dev backend/src/main.py --reload
docker-build:
	docker build -t $(IMAGE_NAME) .
docker-run:
	docker run -p 8000:8000 $(IMAGE_NAME)
docker-up:
	@docker-compose up
docker-down:
	@docker-compose down