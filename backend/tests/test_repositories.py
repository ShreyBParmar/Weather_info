import pytest
from app.repositories.weather_repository import WeatherRepository
from app.schemas.favorite import FavoriteCreate
from app.schemas.history import HistoryCreate


def test_repository_favorites_session_isolation(db_session):
    repo = WeatherRepository(db_session)
    
    # Add for user A
    fav_a = repo.add_favorite(
        FavoriteCreate(city_name="Rome", country="IT", latitude=41.9, longitude=12.5),
        session_id="session-user-a"
    )
    assert fav_a.id is not None
    assert fav_a.city_name == "Rome"

    # Add for user B
    fav_b = repo.add_favorite(
        FavoriteCreate(city_name="Berlin", country="DE", latitude=52.5, longitude=13.4),
        session_id="session-user-b"
    )
    assert fav_b.id is not None

    # Verify session isolation
    favs_a = repo.get_favorites("session-user-a")
    favs_b = repo.get_favorites("session-user-b")
    
    assert len(favs_a) == 1
    assert favs_a[0].city_name == "Rome"
    assert len(favs_b) == 1
    assert favs_b[0].city_name == "Berlin"


def test_repository_history_session_isolation_and_clear(db_session):
    repo = WeatherRepository(db_session)

    repo.add_search_history(HistoryCreate(city_name="Cairo", country="EG"), session_id="user-1")
    repo.add_search_history(HistoryCreate(city_name="Athens", country="GR"), session_id="user-2")

    hist_1 = repo.get_search_history("user-1")
    hist_2 = repo.get_search_history("user-2")

    assert len(hist_1) == 1
    assert hist_1[0].city_name == "Cairo"
    assert len(hist_2) == 1
    assert hist_2[0].city_name == "Athens"

    # Clear user-1 only
    cleared = repo.clear_search_history("user-1")
    assert cleared == 1

    assert len(repo.get_search_history("user-1")) == 0
    assert len(repo.get_search_history("user-2")) == 1
