from fastapi import HTTPException, status


class WeatherAPIException(HTTPException):
    def __init__(self, detail: str = "Failed to communicate with Weather API", status_code: int = status.HTTP_502_BAD_GATEWAY):
        super().__init__(status_code=status_code, detail=detail)


class CityNotFoundException(HTTPException):
    def __init__(self, city: str):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"City '{city}' not found. Please check spelling and try again."
        )


class InvalidAPIKeyException(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="OpenWeather API key is missing or invalid. Please configure OPENWEATHER_API_KEY in the backend .env file."
        )


class RateLimitException(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Weather API rate limit reached. Please wait a moment before trying again."
        )


class DuplicateFavoriteException(HTTPException):
    def __init__(self, city_name: str):
        super().__init__(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"City '{city_name}' is already in your favorites."
        )
