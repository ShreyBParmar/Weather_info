import pytest
from unittest.mock import AsyncMock, patch, MagicMock
import httpx
from backend.app.services.weather_service import WeatherService
from backend.app.utils.exceptions import (
    CityNotFoundException,
    InvalidAPIKeyException,
    RateLimitException,
    WeatherAPIException
)

MOCK_CURRENT_WEATHER_JSON = {
    "coord": {"lon": -0.1257, "lat": 51.5085},
    "weather": [{"id": 800, "main": "Clear", "description": "clear sky", "icon": "01d"}],
    "base": "stations",
    "main": {
        "temp": 18.5,
        "feels_like": 17.8,
        "temp_min": 16.0,
        "temp_max": 20.2,
        "pressure": 1015,
        "humidity": 65
    },
    "visibility": 10000,
    "wind": {"speed": 4.1, "deg": 220},
    "sys": {"country": "GB", "sunrise": 1700000000, "sunset": 1700040000},
    "timezone": 0,
    "dt": 1700010000,
    "name": "London"
}

MOCK_FORECAST_JSON = {
    "city": {
        "name": "London",
        "country": "GB",
        "coord": {"lat": 51.5085, "lon": -0.1257}
    },
    "list": [
        {
            "dt": 1700010000,
            "main": {"temp": 18.0, "feels_like": 17.5, "temp_min": 17.0, "temp_max": 19.0, "humidity": 60},
            "weather": [{"main": "Clear", "description": "clear sky", "icon": "01d"}],
            "wind": {"speed": 3.5},
            "pop": 0.1,
            "dt_txt": "2026-11-25 12:00:00"
        },
        {
            "dt": 1700020800,
            "main": {"temp": 16.0, "feels_like": 15.0, "temp_min": 15.0, "temp_max": 17.0, "humidity": 70},
            "weather": [{"main": "Clouds", "description": "scattered clouds", "icon": "03d"}],
            "wind": {"speed": 4.0},
            "pop": 0.2,
            "dt_txt": "2026-11-25 15:00:00"
        },
        {
            "dt": 1700096400,
            "main": {"temp": 14.0, "feels_like": 13.0, "temp_min": 11.0, "temp_max": 15.0, "humidity": 80},
            "weather": [{"main": "Rain", "description": "light rain", "icon": "10d"}],
            "wind": {"speed": 5.0},
            "pop": 0.75,
            "dt_txt": "2026-11-26 12:00:00"
        }
    ]
}


@pytest.mark.asyncio
async def test_get_current_weather_success():
    service = WeatherService(api_key="valid_test_key")
    
    mock_resp = MagicMock(spec=httpx.Response)
    mock_resp.status_code = 200
    mock_resp.json.return_value = MOCK_CURRENT_WEATHER_JSON

    with patch("httpx.AsyncClient.get", new_callable=AsyncMock, return_value=mock_resp):
        result = await service.get_current_weather("London")
        assert result.city_name == "London"
        assert result.country == "GB"
        assert result.temperature == 18.5
        assert result.feels_like == 17.8
        assert result.humidity == 65
        assert result.condition == "Clear"
        assert result.icon == "01d"
        assert "openweathermap.org" in result.icon_url


@pytest.mark.asyncio
async def test_get_current_weather_city_not_found():
    service = WeatherService(api_key="valid_test_key")
    
    mock_resp = MagicMock(spec=httpx.Response)
    mock_resp.status_code = 404
    mock_resp.text = "city not found"

    with patch("httpx.AsyncClient.get", new_callable=AsyncMock, return_value=mock_resp):
        with pytest.raises(CityNotFoundException):
            await service.get_current_weather("InvalidCityNameXYZ")


@pytest.mark.asyncio
async def test_invalid_api_key_raises_exception():
    service = WeatherService(api_key="")
    with pytest.raises(InvalidAPIKeyException):
        await service.get_current_weather("London")


@pytest.mark.asyncio
async def test_rate_limit_exception():
    service = WeatherService(api_key="valid_test_key")
    
    mock_resp = MagicMock(spec=httpx.Response)
    mock_resp.status_code = 429
    mock_resp.text = "rate limit exceeded"

    with patch("httpx.AsyncClient.get", new_callable=AsyncMock, return_value=mock_resp):
        with pytest.raises(RateLimitException):
            await service.get_current_weather("London")


@pytest.mark.asyncio
async def test_get_forecast_success():
    service = WeatherService(api_key="valid_test_key")
    
    mock_resp = MagicMock(spec=httpx.Response)
    mock_resp.status_code = 200
    mock_resp.json.return_value = MOCK_FORECAST_JSON

    with patch("httpx.AsyncClient.get", new_callable=AsyncMock, return_value=mock_resp):
        result = await service.get_forecast("London")
        assert result.city_name == "London"
        assert len(result.hourly) == 3
        assert len(result.daily) == 2
        # Verify daily aggregation
        day1 = result.daily[0]
        assert day1.date == "2026-11-25"
        assert day1.temp_min == 15.0
        assert day1.temp_max == 19.0


@pytest.mark.asyncio
async def test_compare_weather_multiple_cities():
    service = WeatherService(api_key="valid_test_key")
    
    def side_effect(url, params):
        mock_resp = MagicMock(spec=httpx.Response)
        mock_resp.status_code = 200
        city = params.get("q", "")
        mock_resp.json.return_value = {
            **MOCK_CURRENT_WEATHER_JSON,
            "name": city
        }
        return mock_resp

    with patch("httpx.AsyncClient.get", new_callable=AsyncMock, side_effect=side_effect):
        result = await service.compare_weather(["London", "Paris", "Tokyo"])
        assert len(result.cities) == 3
        assert [c.city_name for c in result.cities] == ["London", "Paris", "Tokyo"]
