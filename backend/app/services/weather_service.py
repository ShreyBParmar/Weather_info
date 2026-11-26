import asyncio
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
import httpx
from app.core.config import settings
from app.schemas.weather import (
    CurrentWeatherResponse,
    ForecastResponse,
    HourlyForecastItem,
    DailyForecastItem,
    CitySuggestionItem,
    ComparisonCityItem,
    ComparisonResponse,
)
from app.utils.exceptions import (
    WeatherAPIException,
    CityNotFoundException,
    InvalidAPIKeyException,
    RateLimitException,
)


class WeatherService:
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key if api_key is not None else settings.OPENWEATHER_API_KEY
        self.base_url = settings.OPENWEATHER_BASE_URL
        self.geo_url = settings.OPENWEATHER_GEO_URL
        self.timeout = 10.0

    def _validate_api_key(self):
        if not self.api_key or self.api_key == "your_openweather_api_key_here" or self.api_key == "mock_key_or_user_key":
            raise InvalidAPIKeyException()

    def _handle_http_error(self, response: httpx.Response, city: Optional[str] = None):
        if response.status_code == 404:
            raise CityNotFoundException(city=city or "requested")
        elif response.status_code == 401:
            raise InvalidAPIKeyException()
        elif response.status_code == 429:
            raise RateLimitException()
        elif response.status_code >= 500:
            raise WeatherAPIException(
                detail="OpenWeather service is currently experiencing issues. Please try again later.",
                status_code=502
            )
        elif response.status_code != 200:
            raise WeatherAPIException(
                detail=f"OpenWeather API returned unexpected status {response.status_code}: {response.text}",
                status_code=response.status_code
            )

    async def get_current_weather(self, city: str) -> CurrentWeatherResponse:
        self._validate_api_key()
        cleaned_city = city.strip()
        if not cleaned_city:
            raise CityNotFoundException(city="")

        params = {
            "q": cleaned_city,
            "appid": self.api_key,
            "units": "metric"
        }

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.get(f"{self.base_url}/weather", params=params)
        except httpx.TimeoutException:
            raise WeatherAPIException("OpenWeather request timed out after 10 seconds.", status_code=504)
        except httpx.RequestError as exc:
            raise WeatherAPIException(f"Network error connecting to OpenWeather: {str(exc)}", status_code=502)

        self._handle_http_error(response, city=cleaned_city)
        data = response.json()
        return self._format_current_weather(data)

    def _format_current_weather(self, data: Dict[str, Any]) -> CurrentWeatherResponse:
        weather_arr = data.get("weather", [{}])
        first_weather = weather_arr[0] if weather_arr else {}
        main = data.get("main", {})
        wind = data.get("wind", {})
        sys = data.get("sys", {})
        coord = data.get("coord", {})
        icon_code = first_weather.get("icon", "01d")

        return CurrentWeatherResponse(
            city_name=data.get("name", "Unknown"),
            country=sys.get("country"),
            latitude=coord.get("lat", 0.0),
            longitude=coord.get("lon", 0.0),
            temperature=round(main.get("temp", 0.0), 1),
            feels_like=round(main.get("feels_like", 0.0), 1),
            temp_min=round(main.get("temp_min", 0.0), 1),
            temp_max=round(main.get("temp_max", 0.0), 1),
            pressure=main.get("pressure", 1013),
            humidity=main.get("humidity", 0),
            visibility=data.get("visibility"),
            wind_speed=round(wind.get("speed", 0.0), 1),
            wind_deg=wind.get("deg"),
            condition=first_weather.get("main", "Clear"),
            description=first_weather.get("description", "clear sky").title(),
            icon=icon_code,
            icon_url=f"https://openweathermap.org/img/wn/{icon_code}@2x.png",
            sunrise=sys.get("sunrise"),
            sunset=sys.get("sunset"),
            timezone_offset=data.get("timezone", 0),
            timestamp=data.get("dt", int(datetime.now(timezone.utc).timestamp()))
        )

    async def get_forecast(self, city: str) -> ForecastResponse:
        self._validate_api_key()
        cleaned_city = city.strip()
        if not cleaned_city:
            raise CityNotFoundException(city="")

        params = {
            "q": cleaned_city,
            "appid": self.api_key,
            "units": "metric"
        }

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.get(f"{self.base_url}/forecast", params=params)
        except httpx.TimeoutException:
            raise WeatherAPIException("OpenWeather forecast request timed out.", status_code=504)
        except httpx.RequestError as exc:
            raise WeatherAPIException(f"Network error connecting to OpenWeather: {str(exc)}", status_code=502)

        self._handle_http_error(response, city=cleaned_city)
        data = response.json()
        return self._format_forecast(data)

    def _format_forecast(self, data: Dict[str, Any]) -> ForecastResponse:
        city_info = data.get("city", {})
        coord = city_info.get("coord", {})
        list_items = data.get("list", [])

        hourly_items: List[HourlyForecastItem] = []
        # Next 12 points (up to 36 hours of 3-hour forecasts)
        for item in list_items[:12]:
            dt_ts = item.get("dt", 0)
            dt_obj = datetime.fromtimestamp(dt_ts, tz=timezone.utc)
            main = item.get("main", {})
            w_arr = item.get("weather", [{}])
            w_first = w_arr[0] if w_arr else {}
            icon_code = w_first.get("icon", "01d")

            hourly_items.append(
                HourlyForecastItem(
                    timestamp=dt_ts,
                    time_iso=item.get("dt_txt", dt_obj.isoformat()),
                    time_label=dt_obj.strftime("%I:%M %p"),
                    temperature=round(main.get("temp", 0.0), 1),
                    feels_like=round(main.get("feels_like", 0.0), 1),
                    condition=w_first.get("main", "Clear"),
                    description=w_first.get("description", "").title(),
                    icon=icon_code,
                    icon_url=f"https://openweathermap.org/img/wn/{icon_code}@2x.png",
                    pop=float(round(item.get("pop", 0.0), 2)),
                    wind_speed=round(item.get("wind", {}).get("speed", 0.0), 1),
                    humidity=main.get("humidity", 0)
                )
            )

        # Aggregate daily forecasts by date string YYYY-MM-DD
        days_map: Dict[str, List[Dict[str, Any]]] = {}
        for item in list_items:
            dt_txt = item.get("dt_txt", "")
            date_str = dt_txt.split(" ")[0] if " " in dt_txt else ""
            if not date_str:
                dt_ts = item.get("dt", 0)
                date_str = datetime.fromtimestamp(dt_ts, tz=timezone.utc).strftime("%Y-%m-%d")
            
            if date_str not in days_map:
                days_map[date_str] = []
            days_map[date_str].append(item)

        daily_items: List[DailyForecastItem] = []
        for date_str, items in days_map.items():
            min_temps = [it.get("main", {}).get("temp_min", it.get("main", {}).get("temp", 0.0)) for it in items]
            max_temps = [it.get("main", {}).get("temp_max", it.get("main", {}).get("temp", 0.0)) for it in items]
            min_temp = min(min_temps) if min_temps else 0.0
            max_temp = max(max_temps) if max_temps else 0.0
            
            # Select midday item (~12:00) or middle item for representative condition
            mid_item = items[len(items) // 2]
            for it in items:
                if "12:00:00" in it.get("dt_txt", ""):
                    mid_item = it
                    break

            w_first = (mid_item.get("weather", [{}]) or [{}])[0]
            icon_code = w_first.get("icon", "01d")
            
            # Max precipitation probability and max wind speed across that day
            pops = [it.get("pop", 0.0) for it in items]
            max_pop = max(pops) if pops else 0.0
            winds = [it.get("wind", {}).get("speed", 0.0) for it in items]
            max_wind = max(winds) if winds else 0.0
            humidities = [it.get("main", {}).get("humidity", 0) for it in items]
            avg_humidity = int(sum(humidities) / len(humidities)) if humidities else 0

            date_obj = datetime.strptime(date_str, "%Y-%m-%d")
            day_name = date_obj.strftime("%A")

            daily_items.append(
                DailyForecastItem(
                    date=date_str,
                    day_name=day_name,
                    temp_min=round(min_temp, 1),
                    temp_max=round(max_temp, 1),
                    temp_day=round(mid_item.get("main", {}).get("temp", (min_temp + max_temp) / 2), 1),
                    condition=w_first.get("main", "Clear"),
                    description=w_first.get("description", "").title(),
                    icon=icon_code,
                    icon_url=f"https://openweathermap.org/img/wn/{icon_code}@2x.png",
                    wind_speed=round(max_wind, 1),
                    pop=round(max_pop, 2),
                    humidity=avg_humidity
                )
            )

        return ForecastResponse(
            city_name=city_info.get("name", "Unknown"),
            country=city_info.get("country"),
            latitude=coord.get("lat", 0.0),
            longitude=coord.get("lon", 0.0),
            hourly=hourly_items,
            daily=daily_items
        )

    async def get_city_suggestions(self, query: str) -> List[CitySuggestionItem]:
        self._validate_api_key()
        cleaned_query = query.strip()
        if len(cleaned_query) < 2:
            return []

        params = {
            "q": cleaned_query,
            "limit": 5,
            "appid": self.api_key
        }

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.get(f"{self.geo_url}/direct", params=params)
        except Exception:
            # Fallback gracefully if geocoding fails
            return []

        if response.status_code != 200:
            return []

        items = response.json()
        results: List[CitySuggestionItem] = []
        for item in items:
            results.append(
                CitySuggestionItem(
                    name=item.get("name", ""),
                    country=item.get("country", ""),
                    state=item.get("state"),
                    latitude=item.get("lat", 0.0),
                    longitude=item.get("lon", 0.0)
                )
            )
        return results

    async def compare_weather(self, cities: List[str]) -> ComparisonResponse:
        self._validate_api_key()
        cleaned_cities = [c.strip() for c in cities if c.strip()]
        if not cleaned_cities:
            return ComparisonResponse(cities=[])

        tasks = [self.get_current_weather(city) for city in cleaned_cities]
        results = await asyncio.gather(*tasks, return_exceptions=True)

        items: List[ComparisonCityItem] = []
        for idx, res in enumerate(results):
            if isinstance(res, CurrentWeatherResponse):
                items.append(
                    ComparisonCityItem(
                        city_name=res.city_name,
                        country=res.country,
                        temperature=res.temperature,
                        feels_like=res.feels_like,
                        temp_min=res.temp_min,
                        temp_max=res.temp_max,
                        condition=res.condition,
                        description=res.description,
                        icon=res.icon,
                        icon_url=res.icon_url,
                        humidity=res.humidity,
                        wind_speed=res.wind_speed,
                        pressure=res.pressure
                    )
                )
            elif isinstance(res, CityNotFoundException):
                continue
            elif isinstance(res, Exception):
                raise res

        return ComparisonResponse(cities=items)
