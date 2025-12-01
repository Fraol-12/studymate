from datetime import timedelta
import uuid

from fastapi import APIRouter, HTTPException

from models.schemas import UserCreate, UserLogin, UserOut, Token
from utils.auth import get_password_hash, verify_password, create_access_token
from utils.config import settings

# Lazy import supabase to avoid initializing on module import
from utils.database import supabase  # type: ignore

# Local DB fallback (optional)
local_db = None
if settings.use_local_db:
    from utils import local_db as _local_db

    local_db = _local_db
    # ensure tables exist
    try:
        local_db.init_db()
    except Exception:
        # let the endpoints handle errors
        local_db = None


router = APIRouter()


@router.post("/signup", response_model=UserOut)
def signup(payload: UserCreate):
    try:
        # Local DB path
        if settings.use_local_db and local_db is not None:
            existing = local_db.get_user_by_email(payload.email)
            if existing:
                raise HTTPException(status_code=400, detail="Email already registered")

            user_id = str(uuid.uuid4())
            hashed = get_password_hash(payload.password)
            user = local_db.create_user(user_id, payload.email, hashed)
            return {"id": user["id"], "email": user["email"]}

        # Supabase path
        existing = supabase.table("users").select("id").eq("email", payload.email).execute()
        if existing.data:
            raise HTTPException(status_code=400, detail="Email already registered")

        hashed = get_password_hash(payload.password)
        resp = (
            supabase.table("users")
            .insert({"email": payload.email, "password_hash": hashed})
            .execute()
        )
        user = resp.data[0]
        return {"id": user["id"], "email": user["email"]}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Signup failed: {str(e)}")


@router.post("/login", response_model=Token)
def login(payload: UserLogin):
    try:
        # Local DB path
        if settings.use_local_db and local_db is not None:
            user = local_db.get_user_by_email(payload.email)
            if not user:
                raise HTTPException(status_code=400, detail="Invalid credentials")
            if not verify_password(payload.password, user["password_hash"]):
                raise HTTPException(status_code=400, detail="Invalid credentials")

            access_token = create_access_token(
                data={"sub": user["id"]}, expires_delta=timedelta(hours=24)
            )
            return {"access_token": access_token, "token_type": "bearer"}

        # Supabase path
        resp = (
            supabase.table("users")
            .select("id, email, password_hash")
            .eq("email", payload.email)
            .limit(1)
            .execute()
        )
        if not resp.data:
            raise HTTPException(status_code=400, detail="Invalid credentials")
        user = resp.data[0]
        if not verify_password(payload.password, user["password_hash"]):
            raise HTTPException(status_code=400, detail="Invalid credentials")

        access_token = create_access_token(
            data={"sub": user["id"]}, expires_delta=timedelta(hours=24)
        )
        return {"access_token": access_token, "token_type": "bearer"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Login failed: {str(e)}")


