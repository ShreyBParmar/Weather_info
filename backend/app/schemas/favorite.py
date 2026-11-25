from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict


class FavoriteCreate(BaseModel):
    city_name: str = Field(..., min_length=1, max_length=100)
    country: Optional[str] = Field(None, max_length=10)
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class FavoriteResponse(BaseModel):
    id: int
    session_id: str
    city_name: str
    country: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
