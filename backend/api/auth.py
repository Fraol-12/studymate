from datetime import timedelta

from fastapi import APIRouter, HTTPException

from models.schemas import UserCreate, UserLogin, UserOut, Token
from utils.auth import get_password_hash, verify_password, create_access_token
from utils.database import supabase


router = APIRouter()


@router.post("/signup", response_model=UserOut)
def signup(payload: UserCreate):
    try:
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


