from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.core.config import settings
from app.core.database import engine, Base
import app.models  # Ensure models are imported
from app.api.routes import weather, favorites, history


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure tables exist on startup
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title=settings.APP_NAME,
    description="REST API for Weather Information Application with OpenWeather integration",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS if isinstance(settings.CORS_ORIGINS, list) else [settings.CORS_ORIGINS],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    # Security: do not leak raw stack traces or internal secrets
    if settings.DEBUG:
        return JSONResponse(
            status_code=500,
            content={"detail": f"Internal Server Error: {str(exc)}"}
        )
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal server error occurred. Please try again later."}
    )


# Include Routers
app.include_router(weather.router, prefix="/api")
app.include_router(favorites.router, prefix="/api")
app.include_router(history.router, prefix="/api")


@app.get("/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "environment": settings.APP_ENV
    }


@app.get("/", tags=["Root"])
def root():
    return {
        "message": "Welcome to Weather Information API",
        "docs_url": "/docs",
        "health": "/health"
    }
