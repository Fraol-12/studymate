import os
import uuid
from tempfile import NamedTemporaryFile

from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException

import docx2txt
import pytesseract
from PIL import Image
from pypdf import PdfReader

from utils.auth import get_current_user
from utils.database import supabase


router = APIRouter()


def _extract_text_from_pdf(path: str) -> str:
    reader = PdfReader(path)
    texts: list[str] = []
    for page in reader.pages:
        texts.append(page.extract_text() or "")
    return "\n".join(texts)


def _extract_text_from_docx(path: str) -> str:
    return docx2txt.process(path) or ""


def _extract_text_from_image(path: str) -> str:
    img = Image.open(path)
    return pytesseract.image_to_string(img)


@router.post("")
async def upload_file(
    notebook_id: str = Form(...),
    file: UploadFile = File(...),
    user=Depends(get_current_user),
):
    # Check notebook ownership
    nb = (
        supabase.table("notebooks")
        .select("id, user_id")
        .eq("id", notebook_id)
        .limit(1)
        .execute()
    )
    if not nb.data or nb.data[0]["user_id"] != user["id"]:
        raise HTTPException(status_code=404, detail="Notebook not found")

    suffix = os.path.splitext(file.filename or "")[1].lower()
    tmp = NamedTemporaryFile(delete=False, suffix=suffix)
    try:
        content = await file.read()
        tmp.write(content)
        tmp.flush()
        tmp.close()

        if suffix in [".pdf"]:
            extracted_text = _extract_text_from_pdf(tmp.name)
        elif suffix in [".doc", ".docx"]:
            extracted_text = _extract_text_from_docx(tmp.name)
        elif suffix in [".png", ".jpg", ".jpeg"]:
            extracted_text = _extract_text_from_image(tmp.name)
        else:
            raise HTTPException(status_code=400, detail="Unsupported file type")

        # Upload to Supabase storage
        storage_path = f"{notebook_id}/{uuid.uuid4()}{suffix}"
        with open(tmp.name, "rb") as f:
            supabase.storage.from_("notebook-files").upload(
                file=f, path=storage_path
            )

        resp = (
            supabase.table("files")
            .insert(
                {
                    "notebook_id": notebook_id,
                    "storage_path": storage_path,
                    "extracted_text": extracted_text,
                }
            )
            .execute()
        )
        return {"id": resp.data[0]["id"], "extracted_text": extracted_text}
    finally:
        try:
            os.unlink(tmp.name)
        except OSError:
            pass


