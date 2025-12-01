from datetime import datetime, date
from typing import Optional, List, Any

from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: str
    email: EmailStr


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class NotebookCreate(BaseModel):
    title: str
    description: Optional[str] = None


class NotebookOut(BaseModel):
    id: str
    user_id: str
    title: str
    description: Optional[str] = None
    created_at: datetime


class NoteCreate(BaseModel):
    notebook_id: str
    content: str


class NoteOut(BaseModel):
    id: str
    notebook_id: str
    content: str
    ai_summary: Optional[str] = None


class AIRequest(BaseModel):
    notebook_id: Optional[str] = None
    text: str


class QuizRequest(BaseModel):
    notebook_id: Optional[str] = None
    text: str
    level: Optional[str] = "medium"
    qtype: Optional[str] = "mix"


class StudyPlanRequest(BaseModel):
    notebook_id: Optional[str] = None
    text: str
    exam_date: Optional[date] = None


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    notebook_id: Optional[str] = None
    messages: List[ChatMessage]


class ExamCreate(BaseModel):
    subject: str
    exam_date: date
    difficulty: str
    target_grade: str


class StudyPlanOut(BaseModel):
    id: str
    notebook_id: str
    exam_date: date
    plan_json: Any


