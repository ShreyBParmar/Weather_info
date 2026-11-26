from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, DateTime, UniqueConstraint
from app.core.database import Base


class FavoriteCity(Base):
    __tablename__ = "favorite_cities"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(100), index=True, nullable=False, default="default-session")
    city_name = Column(String(100), nullable=False)
    country = Column(String(10), nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    __table_args__ = (
        UniqueConstraint("session_id", "city_name", "country", name="uq_session_city_country"),
    )
