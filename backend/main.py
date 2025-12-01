from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api import auth, notebooks, upload, ai
from utils.database import get_supabase
from utils.config import settings


app = FastAPI(title="AI Study Notebook API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def validate_startup():
    """Validate critical configuration at startup so failures are visible early.

    This calls into `get_supabase()` which raises a ValueError when SUPABASE_URL
    or SUPABASE_KEY are missing or left as placeholders. We also check the
    JWT secret so authentication won't silently fail.
    """
    # If configured to use the local DB for development, skip Supabase validation.
    if not settings.use_local_db:
        # Validate Supabase configuration (will raise ValueError with helpful text)
        try:
            get_supabase()
        except Exception as exc:  # keep broad to convert to RuntimeError with context
            raise RuntimeError(f"Startup validation failed: {exc}")

    # Validate JWT secret
    if not settings.jwt_secret_key or settings.jwt_secret_key.strip() == "":
        raise RuntimeError(
            "JWT_SECRET_KEY is missing. Please set JWT_SECRET_KEY in your .env file."
        )


@app.get("/health")
async def health_check():
    return {"status": "ok"}


app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(notebooks.router, prefix="/notebooks", tags=["notebooks"])
app.include_router(upload.router, prefix="/upload", tags=["upload"])
app.include_router(ai.router, prefix="/ai", tags=["ai"])


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)


