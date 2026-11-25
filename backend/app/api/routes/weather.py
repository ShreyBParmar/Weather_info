from typing import List, Optional
from fastapi import APIRouter, Query, Depends
from backend.app.schemas.weather import (
    CurrentWeatherResponse,
    ForecastResponse,
    ComparisonResponse,
    CitySuggestionItem
)
from backend.app.services.weather_service import WeatherService
from backend.app.utils.exceptions import CityNotFoundException

router = APIRouter(prefix="/weather", tags=["Weather"])


def get_weather_service() -> WeatherService:
    return WeatherService()


@router.get("/current", response_model=CurrentWeatherResponse)
async def get_current_weather(
    city: str = Query(..., min_length=1, description="Name of the city"),
    service: WeatherService = Depends(get_weather_service)
):
    if not city.strip():
        raise CityNotFoundException(city="")
    return await service.get_current_weather(city.strip())


@router.get("/forecast", response_model=ForecastResponse)
async def get_weather_forecast(
    city: str = Query(..., min_length=1, description="Name of the city"),
    service: WeatherService = Depends(get_weather_service)
):
    if not city.strip():
        raise CityNotFoundException(city="")
    return await service.get_forecast(city.strip())


@router.get("/compare", response_model=ComparisonResponse)
async def compare_weather(
    cities: str = Query(..., description="Comma-separated list of city names (e.g. London,Paris,Tokyo)"),
    service: WeatherService = Depends(get_weather_service)
):
    city_list = [c.strip() for c in cities.split(",") if c.strip()]
    if not city_list:
        return ComparisonResponse(cities=[])
    return await service.compare_weather(city_list)


@router.get("/suggestions", response_model=List[CitySuggestionItem])
async def get_city_suggestions(
    query: str = Query(..., min_length=2, description="City name query for autocomplete"),
    service: WeatherService = Depends(get_weather_service)
):
    return await service.get_city_suggestions(query.strip())
