from datetime import date

from fastapi import APIRouter, Depends, HTTPException

from models.schemas import (
    AIRequest,
    QuizRequest,
    StudyPlanRequest,
    ChatRequest,
)
from services.ollama_service import chat_with_context
from utils.auth import get_current_user
from utils.database import supabase


router = APIRouter()


def _build_notebook_context(notebook_id: str, user_id: str) -> str:
    # Ensure notebook belongs to user
    nb = (
        supabase.table("notebooks")
        .select("id, user_id, title, description")
        .eq("id", notebook_id)
        .limit(1)
        .execute()
    )
    if not nb.data or nb.data[0]["user_id"] != user_id:
        raise HTTPException(status_code=404, detail="Notebook not found")

    notebook = nb.data[0]
    note_resp = (
        supabase.table("notes")
        .select("content")
        .eq("notebook_id", notebook_id)
        .limit(1)
        .execute()
    )
    note_text = note_resp.data[0]["content"] if note_resp.data else ""

    files_resp = (
        supabase.table("files")
        .select("extracted_text")
        .eq("notebook_id", notebook_id)
        .execute()
    )
    file_texts = [f["extracted_text"] for f in files_resp.data] if files_resp.data else []

    combined = f"Notebook: {notebook['title']}\nDescription: {notebook.get('description') or ''}\n\nNotes:\n{note_text}\n\nFiles:\n" + "\n\n".join(
        file_texts
    )
    return combined


@router.post("/summary")
async def summarize(req: AIRequest, user=Depends(get_current_user)):
    context = ""
    if req.notebook_id:
        context = _build_notebook_context(req.notebook_id, user["id"])
    prompt = (
        "You are an AI study assistant. Create a concise, exam-focused summary of the following content.\n\n"
        f"Context:\n{context}\n\nText:\n{req.text}"
    )
    answer = await chat_with_context("Summarize study notes for exams.", prompt)

    if req.notebook_id:
        # store summary on the main note if present
        notes = (
            supabase.table("notes")
            .select("id")
            .eq("notebook_id", req.notebook_id)
            .limit(1)
            .execute()
        )
        if notes.data:
            supabase.table("notes").update({"ai_summary": answer}).eq(
                "id", notes.data[0]["id"]
            ).execute()

    return {"summary": answer}


@router.post("/flashcards")
async def flashcards(req: AIRequest, user=Depends(get_current_user)):
    context = ""
    if req.notebook_id:
        context = _build_notebook_context(req.notebook_id, user["id"])
    prompt = (
        "Generate high-quality flashcards in JSON array format "
        '[{"front": "...", "back": "..."}] from the following exam notes.\n\n'
        f"Context:\n{context}\n\nText:\n{req.text}"
    )
    answer = await chat_with_context("Create flashcards for spaced repetition.", prompt)

    # naive store: save raw JSON string in flashcards table if parse fails client-side
    if req.notebook_id:
        supabase.table("flashcards").insert(
            {"notebook_id": req.notebook_id, "front": "BULK_JSON", "back": answer}
        ).execute()

    return {"flashcards_raw": answer}


@router.post("/quiz")
async def quiz(req: QuizRequest, user=Depends(get_current_user)):
    context = ""
    if req.notebook_id:
        context = _build_notebook_context(req.notebook_id, user["id"])
    prompt = (
        "Generate a set of exam-style questions as JSON with fields "
        'type, question, options (for MCQ), answer, explanation. '
        f"Level: {req.level}. Type: {req.qtype}.\n\n"
        f"Context:\n{context}\n\nText:\n{req.text}"
    )
    answer = await chat_with_context("Create practice exam questions.", prompt)
    if req.notebook_id:
        supabase.table("quizzes").insert(
            {"notebook_id": req.notebook_id, "data": answer}
        ).execute()
    return {"quiz_raw": answer}


@router.post("/study-plan")
async def study_plan(req: StudyPlanRequest, user=Depends(get_current_user)):
    context = ""
    if req.notebook_id:
        context = _build_notebook_context(req.notebook_id, user["id"])

    exam_date: date | None = req.exam_date
    date_str = exam_date.isoformat() if exam_date else "unknown"
    prompt = (
        "Create a detailed day-by-day study plan in JSON format for an upcoming university exam. "
        f"Exam date: {date_str}.\n"
        "Return a JSON object with days and tasks."
        f"\n\nContext:\n{context}\n\nText:\n{req.text}"
    )
    answer = await chat_with_context("Plan an efficient exam study schedule.", prompt)

    if req.notebook_id:
        supabase.table("study_plans").insert(
            {
                "notebook_id": req.notebook_id,
                "exam_date": exam_date,
                "plan_json": answer,
            }
        ).execute()

    return {"plan_raw": answer}


@router.post("/chat")
async def rag_chat(req: ChatRequest, user=Depends(get_current_user)):
    context = ""
    if req.notebook_id:
        context = _build_notebook_context(req.notebook_id, user["id"])

    history_text = ""
    for m in req.messages:
        history_text += f"{m.role.upper()}: {m.content}\n"

    system_prompt = (
        "You are an AI study assistant helping a university student prepare for exams. "
        "Answer based only on the provided notebook context and conversation history when possible."
    )
    user_message = f"Notebook context:\n{context}\n\nConversation:\n{history_text}"
    answer = await chat_with_context(system_prompt, user_message)
    return {"answer": answer}


