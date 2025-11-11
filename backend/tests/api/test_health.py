from src.main import app
from fastapi.testclient import TestClient

client = TestClient(app)

def test_health_route()->None:
    response = client.get(url="/health")
    assert response.status_code == 200