from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api import auth, notebooks, upload, ai


app = FastAPI(title="AI Study Notebook API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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


