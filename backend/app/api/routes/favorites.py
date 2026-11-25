from typing import List
from fastapi import APIRouter, Depends, Header, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.repositories.weather_repository import WeatherRepository
from backend.app.schemas.favorite import FavoriteCreate, FavoriteResponse
from backend.app.utils.exceptions import DuplicateFavoriteException

router = APIRouter(prefix="/favorites", tags=["Favorites"])


def get_repository(db: Session = Depends(get_db)) -> WeatherRepository:
    return WeatherRepository(db)


def get_session_id(x_session_id: str = Header("default-session", alias="X-Session-ID")) -> str:
    return x_session_id.strip() or "default-session"


@router.post("", response_model=FavoriteResponse, status_code=status.HTTP_201_CREATED)
def add_favorite(
    favorite_data: FavoriteCreate,
    session_id: str = Depends(get_session_id),
    repo: WeatherRepository = Depends(get_repository)
):
    existing = repo.get_favorite_by_city(session_id, favorite_data.city_name)
    if existing:
        raise DuplicateFavoriteException(favorite_data.city_name)
    return repo.add_favorite(favorite_data, session_id)


@router.get("", response_model=List[FavoriteResponse])
def get_favorites(
    session_id: str = Depends(get_session_id),
    repo: WeatherRepository = Depends(get_repository)
):
    return repo.get_favorites(session_id)


@router.delete("/{favorite_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_favorite(
    favorite_id: int,
    session_id: str = Depends(get_session_id),
    repo: WeatherRepository = Depends(get_repository)
):
    deleted = repo.delete_favorite(favorite_id, session_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Favorite city record not found"
        )
    return None
