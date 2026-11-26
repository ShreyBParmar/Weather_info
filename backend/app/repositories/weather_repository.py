from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.favorite import FavoriteCity
from app.models.search_history import SearchHistory
from app.schemas.favorite import FavoriteCreate
from app.schemas.history import HistoryCreate


class WeatherRepository:
    def __init__(self, db: Session):
        self.db = db

    # Favorite Cities
    def get_favorites(self, session_id: str) -> List[FavoriteCity]:
        return (
            self.db.query(FavoriteCity)
            .filter(FavoriteCity.session_id == session_id)
            .order_by(FavoriteCity.created_at.desc())
            .all()
        )

    def get_favorite_by_city(self, session_id: str, city_name: str) -> Optional[FavoriteCity]:
        return (
            self.db.query(FavoriteCity)
            .filter(
                FavoriteCity.session_id == session_id,
                FavoriteCity.city_name.ilike(city_name.strip())
            )
            .first()
        )

    def get_favorite_by_id(self, favorite_id: int, session_id: str) -> Optional[FavoriteCity]:
        return (
            self.db.query(FavoriteCity)
            .filter(
                FavoriteCity.id == favorite_id,
                FavoriteCity.session_id == session_id
            )
            .first()
        )

    def add_favorite(self, data: FavoriteCreate, session_id: str) -> FavoriteCity:
        favorite = FavoriteCity(
            session_id=session_id,
            city_name=data.city_name.strip(),
            country=data.country.strip() if data.country else None,
            latitude=data.latitude,
            longitude=data.longitude
        )
        self.db.add(favorite)
        self.db.commit()
        self.db.refresh(favorite)
        return favorite

    def delete_favorite(self, favorite_id: int, session_id: str) -> bool:
        favorite = self.get_favorite_by_id(favorite_id, session_id)
        if not favorite:
            return False
        self.db.delete(favorite)
        self.db.commit()
        return True

    # Search History
    def get_search_history(self, session_id: str, limit: int = 20) -> List[SearchHistory]:
        return (
            self.db.query(SearchHistory)
            .filter(SearchHistory.session_id == session_id)
            .order_by(SearchHistory.searched_at.desc())
            .limit(limit)
            .all()
        )

    def add_search_history(self, data: HistoryCreate, session_id: str) -> SearchHistory:
        # Avoid duplicate consecutive identical searches within short window or remove older duplicates
        existing = (
            self.db.query(SearchHistory)
            .filter(
                SearchHistory.session_id == session_id,
                SearchHistory.city_name.ilike(data.city_name.strip())
            )
            .first()
        )
        if existing:
            self.db.delete(existing)
            self.db.commit()

        history_item = SearchHistory(
            session_id=session_id,
            city_name=data.city_name.strip(),
            country=data.country.strip() if data.country else None
        )
        self.db.add(history_item)
        self.db.commit()
        self.db.refresh(history_item)
        return history_item

    def clear_search_history(self, session_id: str) -> int:
        deleted_count = (
            self.db.query(SearchHistory)
            .filter(SearchHistory.session_id == session_id)
            .delete(synchronize_session=False)
        )
        self.db.commit()
        return deleted_count
