.PHONY: run docker-build docker-up docker-down docker-run test

IMAGE_NAME = imrooteodoro/gambito-neural-tcc-backend

run:
	@uv run fastapi dev --port 8000 --host 0.0.0.0 backend/src/main.py --reload
docker-build:
	docker build -t $(IMAGE_NAME) .
docker-run:
	docker run -p 8000:8000 $(IMAGE_NAME)
docker-up:
	@docker compose up
docker-compose-build:
	@docker compose build --no-cache
docker-down:
	@docker compose down -v
test:
	@pytest .