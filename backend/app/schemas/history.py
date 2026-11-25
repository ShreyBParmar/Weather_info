from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict


class HistoryCreate(BaseModel):
    city_name: str = Field(..., min_length=1, max_length=100)
    country: Optional[str] = Field(None, max_length=10)


class HistoryResponse(BaseModel):
    id: int
    session_id: str
    city_name: str
    country: Optional[str] = None
    searched_at: datetime

    model_config = ConfigDict(from_attributes=True)
