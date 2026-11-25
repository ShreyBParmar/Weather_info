from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime
from backend.app.core.database import Base


class SearchHistory(Base):
    __tablename__ = "search_history"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(100), index=True, nullable=False, default="default-session")
    city_name = Column(String(100), nullable=False)
    country = Column(String(10), nullable=True)
    searched_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
