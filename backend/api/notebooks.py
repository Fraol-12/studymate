from fastapi import APIRouter, Depends, HTTPException

from models.schemas import NotebookCreate, NotebookOut, NoteCreate, NoteOut
from utils.auth import get_current_user
from utils.database import supabase


router = APIRouter()


@router.post("/create", response_model=NotebookOut)
async def create_notebook(payload: NotebookCreate, user=Depends(get_current_user)):
    resp = (
        supabase.table("notebooks")
        .insert(
            {
                "user_id": user["id"],
                "title": payload.title,
                "description": payload.description,
            }
        )
        .execute()
    )
    return resp.data[0]


@router.get("/list", response_model=list[NotebookOut])
async def list_notebooks(user=Depends(get_current_user)):
    resp = (
        supabase.table("notebooks")
        .select("*")
        .eq("user_id", user["id"])
        .order("created_at", desc=True)
        .execute()
    )
    return resp.data


@router.get("/{notebook_id}", response_model=NotebookOut)
async def get_notebook(notebook_id: str, user=Depends(get_current_user)):
    resp = (
        supabase.table("notebooks")
        .select("*")
        .eq("id", notebook_id)
        .eq("user_id", user["id"])
        .limit(1)
        .execute()
    )
    if not resp.data:
        raise HTTPException(status_code=404, detail="Notebook not found")
    return resp.data[0]


@router.post("/notes", response_model=NoteOut)
async def create_or_update_note(payload: NoteCreate, user=Depends(get_current_user)):
    # Ensure notebook belongs to user
    nb = (
        supabase.table("notebooks")
        .select("id, user_id")
        .eq("id", payload.notebook_id)
        .limit(1)
        .execute()
    )
    if not nb.data or nb.data[0]["user_id"] != user["id"]:
        raise HTTPException(status_code=404, detail="Notebook not found")

    # Upsert by notebook_id (simple strategy: one main note per notebook)
    existing = (
        supabase.table("notes")
        .select("id")
        .eq("notebook_id", payload.notebook_id)
        .limit(1)
        .execute()
    )
    if existing.data:
        note_id = existing.data[0]["id"]
        resp = (
            supabase.table("notes")
            .update({"content": payload.content})
            .eq("id", note_id)
            .execute()
        )
    else:
        resp = (
            supabase.table("notes")
            .insert(
                {"notebook_id": payload.notebook_id, "content": payload.content}
            )
            .execute()
        )
    return resp.data[0]


@router.get("/notes/{notebook_id}", response_model=NoteOut | None)
async def get_note(notebook_id: str, user=Depends(get_current_user)):
    nb = (
        supabase.table("notebooks")
        .select("id, user_id")
        .eq("id", notebook_id)
        .limit(1)
        .execute()
    )
    if not nb.data or nb.data[0]["user_id"] != user["id"]:
        raise HTTPException(status_code=404, detail="Notebook not found")

    resp = (
        supabase.table("notes")
        .select("*")
        .eq("notebook_id", notebook_id)
        .limit(1)
        .execute()
    )
    if not resp.data:
        return None
    return resp.data[0]


