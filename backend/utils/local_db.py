import sqlite3
from pathlib import Path
from typing import Optional, Dict, Any

DB_PATH = Path(__file__).resolve().parents[1] / "local.db"


def _get_conn():
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
    """Create users table if it doesn't exist."""
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = _get_conn()
    try:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL
            )
            """
        )
        conn.commit()
    finally:
        conn.close()


def create_user(user_id: str, email: str, password_hash: str) -> Dict[str, Any]:
    conn = _get_conn()
    try:
        conn.execute(
            "INSERT INTO users(id, email, password_hash) VALUES (?, ?, ?)",
            (user_id, email, password_hash),
        )
        conn.commit()
        return {"id": user_id, "email": email}
    finally:
        conn.close()


def get_user_by_email(email: str) -> Optional[Dict[str, Any]]:
    conn = _get_conn()
    try:
        cur = conn.execute("SELECT id, email, password_hash FROM users WHERE email = ? LIMIT 1", (email,))
        row = cur.fetchone()
        if not row:
            return None
        return {"id": row["id"], "email": row["email"], "password_hash": row["password_hash"]}
    finally:
        conn.close()
