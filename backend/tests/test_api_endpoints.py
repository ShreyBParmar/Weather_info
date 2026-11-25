from unittest.mock import AsyncMock, patch, MagicMock
import httpx
from backend.tests.test_weather_service import MOCK_CURRENT_WEATHER_JSON, MOCK_FORECAST_JSON


def test_health_check(client):
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"


def test_api_weather_current_endpoint(client):
    mock_resp = MagicMock(spec=httpx.Response)
    mock_resp.status_code = 200
    mock_resp.json.return_value = MOCK_CURRENT_WEATHER_JSON

    with patch("httpx.AsyncClient.get", new_callable=AsyncMock, return_value=mock_resp), \
         patch("backend.app.services.weather_service.settings.OPENWEATHER_API_KEY", "test_key"):
        response = client.get("/api/weather/current?city=London")
        assert response.status_code == 200
        data = response.json()
        assert data["city_name"] == "London"
        assert data["temperature"] == 18.5


def test_api_weather_forecast_endpoint(client):
    mock_resp = MagicMock(spec=httpx.Response)
    mock_resp.status_code = 200
    mock_resp.json.return_value = MOCK_FORECAST_JSON

    with patch("httpx.AsyncClient.get", new_callable=AsyncMock, return_value=mock_resp), \
         patch("backend.app.services.weather_service.settings.OPENWEATHER_API_KEY", "test_key"):
        response = client.get("/api/weather/forecast?city=London")
        assert response.status_code == 200
        data = response.json()
        assert data["city_name"] == "London"
        assert len(data["hourly"]) > 0
        assert len(data["daily"]) > 0


def test_favorites_crud_and_duplicates(client):
    headers = {"X-Session-ID": "test-session-123"}
    
    # 1. Add favorite
    payload = {
        "city_name": "Paris",
        "country": "FR",
        "latitude": 48.8566,
        "longitude": 2.3522
    }
    res = client.post("/api/favorites", json=payload, headers=headers)
    assert res.status_code == 201
    fav_data = res.json()
    assert fav_data["city_name"] == "Paris"
    fav_id = fav_data["id"]

    # 2. Prevent duplicate favorite
    duplicate_res = client.post("/api/favorites", json=payload, headers=headers)
    assert duplicate_res.status_code == 409
    assert "already in your favorites" in duplicate_res.json()["detail"]

    # 3. Get favorites
    get_res = client.get("/api/favorites", headers=headers)
    assert get_res.status_code == 200
    items = get_res.json()
    assert len(items) == 1
    assert items[0]["city_name"] == "Paris"

    # 4. Delete favorite
    del_res = client.delete(f"/api/favorites/{fav_id}", headers=headers)
    assert del_res.status_code == 204

    # 5. Verify deleted
    get_res_after = client.get("/api/favorites", headers=headers)
    assert len(get_res_after.json()) == 0


def test_search_history_crud(client):
    headers = {"X-Session-ID": "test-history-session"}

    # 1. Add search history
    res1 = client.post("/api/history", json={"city_name": "Tokyo", "country": "JP"}, headers=headers)
    assert res1.status_code == 201

    res2 = client.post("/api/history", json={"city_name": "New York", "country": "US"}, headers=headers)
    assert res2.status_code == 201

    # 2. Retrieve history
    history_res = client.get("/api/history", headers=headers)
    assert history_res.status_code == 200
    items = history_res.json()
    assert len(items) == 2
    assert items[0]["city_name"] == "New York"  # most recent first

    # 3. Clear history
    clear_res = client.delete("/api/history", headers=headers)
    assert clear_res.status_code == 204

    # 4. Verify cleared
    empty_res = client.get("/api/history", headers=headers)
    assert len(empty_res.json()) == 0
