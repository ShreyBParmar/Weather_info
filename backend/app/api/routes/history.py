from typing import List
from fastapi import APIRouter, Depends, Header, status
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.repositories.weather_repository import WeatherRepository
from backend.app.schemas.history import HistoryCreate, HistoryResponse

router = APIRouter(prefix="/history", tags=["Search History"])


def get_repository(db: Session = Depends(get_db)) -> WeatherRepository:
    return WeatherRepository(db)


def get_session_id(x_session_id: str = Header("default-session", alias="X-Session-ID")) -> str:
    return x_session_id.strip() or "default-session"


@router.post("", response_model=HistoryResponse, status_code=status.HTTP_201_CREATED)
def record_search(
    history_data: HistoryCreate,
    session_id: str = Depends(get_session_id),
    repo: WeatherRepository = Depends(get_repository)
):
    return repo.add_search_history(history_data, session_id)


@router.get("", response_model=List[HistoryResponse])
def get_search_history(
    session_id: str = Depends(get_session_id),
    repo: WeatherRepository = Depends(get_repository)
):
    return repo.get_search_history(session_id)


@router.delete("", status_code=status.HTTP_204_NO_CONTENT)
def clear_search_history(
    session_id: str = Depends(get_session_id),
    repo: WeatherRepository = Depends(get_repository)
):
    repo.clear_search_history(session_id)
    return None
