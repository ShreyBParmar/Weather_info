from typing import List, Optional
from pydantic import BaseModel, Field


class WeatherCondition(BaseModel):
    id: int
    main: str
    description: str
    icon: str
    icon_url: str


class CurrentWeatherResponse(BaseModel):
    city_name: str
    country: Optional[str] = None
    latitude: float
    longitude: float
    temperature: float
    feels_like: float
    temp_min: float
    temp_max: float
    pressure: int
    humidity: int
    visibility: Optional[int] = None
    wind_speed: float
    wind_deg: Optional[int] = None
    condition: str
    description: str
    icon: str
    icon_url: str
    sunrise: Optional[int] = None
    sunset: Optional[int] = None
    timezone_offset: Optional[int] = None
    timestamp: int


class HourlyForecastItem(BaseModel):
    timestamp: int
    time_iso: str
    time_label: str
    temperature: float
    feels_like: float
    condition: str
    description: str
    icon: str
    icon_url: str
    pop: float = Field(0.0, description="Probability of precipitation (0 to 1)")
    wind_speed: float
    humidity: int


class DailyForecastItem(BaseModel):
    date: str
    day_name: str
    temp_min: float
    temp_max: float
    temp_day: float
    condition: str
    description: str
    icon: str
    icon_url: str
    wind_speed: float
    pop: float = Field(0.0, description="Probability of precipitation (0 to 1)")
    humidity: int


class ForecastResponse(BaseModel):
    city_name: str
    country: Optional[str] = None
    latitude: float
    longitude: float
    hourly: List[HourlyForecastItem]
    daily: List[DailyForecastItem]


class CitySuggestionItem(BaseModel):
    name: str
    country: str
    state: Optional[str] = None
    latitude: float
    longitude: float


class ComparisonCityItem(BaseModel):
    city_name: str
    country: Optional[str] = None
    temperature: float
    feels_like: float
    temp_min: float
    temp_max: float
    condition: str
    description: str
    icon: str
    icon_url: str
    humidity: int
    wind_speed: float
    pressure: int


class ComparisonResponse(BaseModel):
    cities: List[ComparisonCityItem]
