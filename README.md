## AI Study Notebook

AI Study Notebook is a full-stack exam preparation assistant for university students. It lets you create notebooks, upload study materials, and use a local Ollama model to generate summaries, flashcards, quizzes, study plans, and RAG-style chat — all persisted in Supabase.

### Tech Stack

- **Frontend**: React (Vite), React Router, Tailwind CSS, Lucide icons
- **Backend**: FastAPI, Supabase Python client, Ollama (local LLM)
- **Database**: Supabase (Postgres + storage)

---

### Project Structure

- `backend/`
  - `main.py` – FastAPI app entrypoint, CORS, router mounting
  - `api/` – route modules:
    - `auth.py` – `POST /auth/signup`, `POST /auth/login`
    - `notebooks.py` – CRUD and notes: `POST /notebooks/create`, `GET /notebooks/list`, `GET /notebooks/{id}`, `POST /notebooks/notes`, `GET /notebooks/notes/{id}`
    - `upload.py` – `POST /upload` file ingestion (PDF/DOCX/PNG/JPG) + OCR and storage
    - `ai.py` – `POST /ai/summary`, `/ai/flashcards`, `/ai/quiz`, `/ai/study-plan`, `/ai/chat`
  - `models/schemas.py` – Pydantic request/response models
  - `services/ollama_service.py` – thin async wrapper around `http://localhost:11434/api/generate`
  - `utils/config.py` – environment configuration
  - `utils/database.py` – Supabase client creation
  - `utils/auth.py` – JWT auth helpers and `get_current_user` dependency

- `frontend/`
  - `index.html`, `vite.config.mts`, Tailwind + PostCSS config
  - `src/main.jsx` – React root, router + auth context
  - `src/router/AppRouter.jsx` – protected routes
  - `src/context/AuthContext.jsx` – login/signup/logout + token storage
  - `src/components/`
    - `layout/Sidebar.jsx`, `layout/Navbar.jsx`, `layout/AppShell.jsx`
    - `FileUploader.jsx`
    - `NotesEditor.jsx`
    - `ChatBox.jsx`
  - `src/pages/`
    - `LoginPage.jsx` – landing/login/signup
    - `DashboardPage.jsx` – welcome, quick actions, recent notes, upcoming exams
    - `NotesPage.jsx` – Notebook list, markdown-style editor, right AI panel, file upload
    - `ChatPage.jsx` – RAG chat with quick actions (MCQs, summary, plan)
    - `QuestionGeneratorPage.jsx` – topic + level/type → questions
    - `ExamPlannerPage.jsx` – exam form, countdown, AI-generated plan, simple calendar
    - `SettingsPage.jsx` – profile, theme toggle (UI), export/delete placeholders

---

### Supabase Setup

1. Create a new Supabase project and grab:
   - `SUPABASE_URL`
   - `SUPABASE_KEY` (service role or anon key with appropriate RLS)

2. Create tables (simplified SQL, adjust types/constraints as needed):

```sql
create table users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  password_hash text not null
);

create table notebooks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  title text not null,
  description text,
  created_at timestamptz not null default now()
);

create table files (
  id uuid primary key default gen_random_uuid(),
  notebook_id uuid not null references notebooks(id) on delete cascade,
  storage_path text not null,
  extracted_text text,
  created_at timestamptz not null default now()
);

create table notes (
  id uuid primary key default gen_random_uuid(),
  notebook_id uuid not null references notebooks(id) on delete cascade,
  content text not null,
  ai_summary text
);

create table flashcards (
  id uuid primary key default gen_random_uuid(),
  notebook_id uuid not null references notebooks(id) on delete cascade,
  front text not null,
  back text not null
);

create table quizzes (
  id uuid primary key default gen_random_uuid(),
  notebook_id uuid not null references notebooks(id) on delete cascade,
  data jsonb not null
);

create table study_plans (
  id uuid primary key default gen_random_uuid(),
  notebook_id uuid not null references notebooks(id) on delete cascade,
  exam_date date,
  plan_json jsonb
);
```

3. Create a storage bucket:

```text
Bucket name: notebook-files
Public: false (recommended)
```

Configure RLS as preferred (for a prototype you can keep things open, but for real use lock rows to `user_id`).

---

### Backend Configuration & Run

1. Create and activate a virtualenv, then install requirements:

```bash
cd backend
python -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
```

2. Copy `.env.example` to `.env` and fill in:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
JWT_SECRET_KEY=your_jwt_secret_key_here
JWT_ALGORITHM=HS256
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.1:8b
```

3. Start Ollama locally and pull a model:

```bash
ollama pull llama3.1:8b
ollama serve
```

4. Run the FastAPI server:

```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend endpoints (all JSON):

- `POST /auth/signup` – `{ email, password }` → user
- `POST /auth/login` – `{ email, password }` → `{ access_token }`
- `POST /notebooks/create`
- `GET /notebooks/list`
- `GET /notebooks/{id}`
- `POST /notebooks/notes`
- `GET /notebooks/notes/{notebook_id}`
- `POST /upload` – multipart file + `notebook_id`
- `POST /ai/summary`
- `POST /ai/flashcards`
- `POST /ai/quiz`
- `POST /ai/study-plan`
- `POST /ai/chat`

---

### Frontend Setup & Run

1. Install dependencies:

```bash
cd frontend
npm install
```

2. Start the dev server:

```bash
npm run dev
```

By default it runs at `http://localhost:5173` and talks to the backend at `http://localhost:8000`.

---

### Using the App

- **Landing / Login**: Go to `/login`, sign up or log in with email/password. You’ll be redirected to the dashboard.
- **Dashboard**: See welcome banner, sample next exam countdown, quick action cards, and placeholders for recent notes and upcoming exams.
- **Notes**:
  - Create notebooks (left sidebar) and edit notes in a markdown-style center editor.
  - Upload PDFs/DOCX/images; extracted text is appended into your notes and stored in Supabase.
  - Use the right AI panel to summarize, explain, or generate questions from your notebook.
- **AI Chat**: Chat with an Ollama model using optional `notebook_id` context. Quick buttons generate 100 MCQs, a summary, or a study plan prompt.
- **Question Generator**: Provide a topic, level, and question type; generate questions and optionally download to text.
- **Exam Planner**: Add exams (subject, date, difficulty, target grade), get a countdown, and generate AI study plans with a simple calendar view.
- **Settings**: Change name/email (UI only), toggle light/dark theme (UI-only toggle), export notes/delete account placeholders.

---

### Notes & Next Steps

- For production, you should:
  - Harden authentication (password policies, email verification, RLS policies).
  - Parse AI JSON (flashcards/quizzes/study plans) on the frontend and render with dedicated viewers.
  - Replace the simple calendar with a full calendar component.
  - Implement real profile updates, exports, and account deletion endpoints.


