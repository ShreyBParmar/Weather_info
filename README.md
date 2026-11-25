# SkyCast: Weather Information Web Application

A full-stack Weather Information Web Application engineered with **React.js (Vite)** on the frontend and **Python FastAPI** on the backend, with database persistence via **PostgreSQL (SQLAlchemy & Alembic)** and integration with the **OpenWeather API**.

---

## 1. Architecture & Tech Stack

```mermaid
flowchart TD
    Client["React Frontend (Vite + Tailwind CSS + Recharts)"]
    FastAPI["FastAPI REST API (Uvicorn / Python 3.11+)"]
    DB[("PostgreSQL Database (SQLAlchemy ORM + Alembic)")]
    OpenWeather["OpenWeather REST API"]

    Client -->|"HTTP / REST API (Axios + X-Session-ID)"| FastAPI
    FastAPI -->|"Async HTTP Requests (HTTPX)"| OpenWeather
    FastAPI -->|"ORM Queries & Migrations"| DB
```

### Frontend
- **Framework**: React.js 19 with Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM v7
- **HTTP Client**: Axios with centralized error handling & session interceptors
- **Icons**: Lucide React
- **Data Visualizations**: Recharts (AreaChart, LineChart, BarChart)

### Backend
- **Framework**: FastAPI (Asynchronous Python 3.11+)
- **Server**: Uvicorn ASGI
- **HTTP Client**: HTTPX (Async non-blocking I/O)
- **Validation**: Pydantic v2 & Pydantic-Settings
- **ORM**: SQLAlchemy 2.0
- **Database Migrations**: Alembic
- **Testing**: Pytest & Pytest-Asyncio (100% mocked external API calls)

### Database
- **Engine**: PostgreSQL (with SQLite zero-config fallback for local development)
- **Tables**: `favorite_cities`, `search_history`

---

## 2. Core Features

1. **Live Weather Dashboard**: Current temperature, feels-like, min/max, condition, humidity, wind speed & direction, pressure, visibility, and sunrise/sunset times.
2. **City Search & Autocomplete**: Debounced suggestion dropdown using OpenWeather Geocoding API, handling empty or invalid cities with user-friendly alerts.
3. **Hourly Forecast (36 Hours)**: Horizontally scrollable cards with precipitation probability and wind speed.
4. **5-Day Outlook**: Daily aggregated min/max temperature range, dominant conditions, and rain probability.
5. **Accurate Temperature Conversion**: Instant switch between Celsius (°C) and Fahrenheit (°F) with mathematical precision and zero redundant network calls.
6. **Weather Visualizations**: Interactive Recharts graphs showing hourly temperature curves and 5-day high/low trends.
7. **Favorite Cities (PostgreSQL)**: Save and remove cities with session isolation and duplicate prevention.
8. **Search History (PostgreSQL)**: Track recent searches, re-query in one click, and clear history.
9. **Multi-City Weather Comparison**: Compare live weather, humidity, wind, and pressure side-by-side with comparison bar charts.

---

## 3. Directory Structure

```text
├── backend/
│   ├── alembic/                 # Alembic migration scripts and versions
│   │   ├── versions/
│   │   └── env.py
│   ├── app/
│   │   ├── api/
│   │   │   └── routes/          # REST route handlers (weather, favorites, history)
│   │   ├── core/                # Configuration and database connection
│   │   ├── models/              # SQLAlchemy models (favorite, search_history)
│   │   ├── repositories/        # Database query repository layer
│   │   ├── schemas/             # Pydantic validation schemas
│   │   ├── services/            # WeatherService (HTTPX integration)
│   │   ├── utils/               # Custom exceptions and handlers
│   │   └── main.py              # FastAPI app initialization and CORS
│   ├── tests/                   # Pytest test suite with mocked API responses
│   ├── alembic.ini
│   ├── pytest.ini
│   ├── requirements.txt
│   ├── .env.example
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/          # Reusable UI components (CurrentWeather, WeatherChart, etc.)
│   │   ├── hooks/               # Custom hooks (useWeather)
│   │   ├── pages/               # Dashboard, Favorites, History, Compare
│   │   ├── services/            # Axios API client and endpoints
│   │   ├── utils/               # Temperature & date formatters, session manager
│   │   ├── App.jsx              # Main layout and navigation
│   │   ├── main.jsx
│   │   └── index.css            # Tailwind CSS imports
│   ├── package.json
│   ├── vite.config.js
│   ├── vercel.json
│   ├── .env.example
│   └── .env
├── render.yaml                  # Production backend deployment configuration
└── README.md
```

---

## 4. Local Development Setup

### Prerequisites
- Python 3.11 or higher
- Node.js 18+ and npm
- OpenWeather API Key (Free tier at [openweathermap.org](https://openweathermap.org/api))

---

### Step 1: Backend Setup

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a Python virtual environment:
   ```bash
   # Windows
   python -m venv venv
   .\venv\Scripts\activate

   # macOS / Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure environment variables:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and set your OpenWeather API key:
   ```ini
   OPENWEATHER_API_KEY=your_actual_api_key_here
   DATABASE_URL=sqlite:///./weather.db
   ```
   *(For PostgreSQL, set `DATABASE_URL=postgresql://username:password@localhost:5432/weather_db`)*

5. Run database migrations:
   ```bash
   alembic upgrade head
   ```

6. Start the FastAPI development server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
   Interactive Swagger API documentation will be available at: `http://localhost:8000/docs`

---

### Step 2: Frontend Setup

1. In a new terminal, navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install npm dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   *(By default in local dev, Vite proxies `/api` requests to `http://localhost:8000`)*

4. Start the Vite development server:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173`.

---

## 5. Running Automated Backend Tests

The backend test suite executes 100% mocked external API calls using `pytest` and `pytest-asyncio`:

```bash
cd backend
.\venv\Scripts\pytest -v
```

Tests cover:
- WeatherService current weather and forecast responses
- 404 City Not Found and empty city handling
- 401 Missing / Invalid API key exceptions
- 429 Rate limiting and 504 timeouts
- Favorites CRUD and duplicate prevention
- Multi-user / guest session isolation
- Search history recording and clear operations
- Accurate mathematical temperature conversions

---

## 6. REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/weather/current?city={name}` | Fetch real-time weather metrics |
| `GET` | `/api/weather/forecast?city={name}` | 36-hr hourly & 5-day daily forecast |
| `GET` | `/api/weather/compare?cities=A,B,C` | Multi-city weather comparison |
| `GET` | `/api/weather/suggestions?query={q}` | Geocoding city autocomplete |
| `POST` | `/api/favorites` | Save a city to favorites (with session isolation) |
| `GET` | `/api/favorites` | Retrieve saved favorite cities |
| `DELETE`| `/api/favorites/{id}` | Delete a favorite city |
| `POST` | `/api/history` | Log a city search |
| `GET` | `/api/history` | Retrieve recent searches |
| `DELETE`| `/api/history` | Clear search history |
| `GET` | `/health` | Health check probe |

---

## 7. Production Deployment Instructions

### Database (PostgreSQL on Supabase or Neon)
1. Create a free PostgreSQL instance on [Neon](https://neon.tech) or [Supabase](https://supabase.com).
2. Copy the PostgreSQL connection URI: `postgresql://user:password@host:port/dbname`.

### Backend (Render)
1. Push your repository to GitHub.
2. In Render, select **New > Web Service** and connect your repository.
3. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt && alembic upgrade head`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Set Environment Variables in Render:
   - `OPENWEATHER_API_KEY`: Your OpenWeather key
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `CORS_ORIGINS`: Your Vercel frontend URL (e.g., `https://your-app.vercel.app`)
   - `APP_ENV`: `production`
   - `DEBUG`: `false`

### Frontend (Vercel)
1. In Vercel, click **Add New > Project** and import the GitHub repository.
2. Configure:
   - **Root Directory**: `frontend`
   - **Framework Preset**: `Vite`
3. Add Environment Variable:
   - `VITE_API_BASE_URL`: The deployed Render backend URL (e.g., `https://your-backend.onrender.com`)
4. Deploy! Single-page app rewrites are configured in `frontend/vercel.json`.
