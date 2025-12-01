# Quick Setup Guide

Follow these steps to get the AI Study Notebook running with your own keys.

## 1. Backend Configuration

### Create `.env` file in `backend/` directory:

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` with your actual values:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-anon-key
JWT_SECRET_KEY=your-random-secret-key-here-min-32-chars
JWT_ALGORITHM=HS256
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.1:8b
```

**Where to find Supabase keys:**
1. Go to your Supabase project dashboard
2. Settings → API
3. Copy "Project URL" → `SUPABASE_URL`
4. Copy "anon public" key → `SUPABASE_KEY`

**Generate JWT secret:**
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

## 2. Frontend Configuration

### Create `.env` file in `frontend/` directory:

```bash
cd frontend
```

Create `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:8000
```

If your backend runs on a different port or URL, update this value.

## 3. Supabase Database Setup

Run this SQL in your Supabase SQL Editor:

```sql
-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL
);

-- Create notebooks table
CREATE TABLE IF NOT EXISTS notebooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create files table
CREATE TABLE IF NOT EXISTS files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notebook_id UUID NOT NULL REFERENCES notebooks(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  extracted_text TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create notes table
CREATE TABLE IF NOT EXISTS notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notebook_id UUID NOT NULL REFERENCES notebooks(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  ai_summary TEXT
);

-- Create flashcards table
CREATE TABLE IF NOT EXISTS flashcards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notebook_id UUID NOT NULL REFERENCES notebooks(id) ON DELETE CASCADE,
  front TEXT NOT NULL,
  back TEXT NOT NULL
);

-- Create quizzes table
CREATE TABLE IF NOT EXISTS quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notebook_id UUID NOT NULL REFERENCES notebooks(id) ON DELETE CASCADE,
  data JSONB NOT NULL
);

-- Create study_plans table
CREATE TABLE IF NOT EXISTS study_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notebook_id UUID NOT NULL REFERENCES notebooks(id) ON DELETE CASCADE,
  exam_date DATE,
  plan_json JSONB
);
```

### Create Storage Bucket

1. Go to Supabase Dashboard → Storage
2. Create a new bucket named: `notebook-files`
3. Make it public (or configure RLS policies as needed)

## 4. Install & Run

### Backend (Terminal 1):

```bash
cd backend
source .venv/bin/activate  # or: .venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Ollama (Terminal 2):

```bash
# Make sure Ollama is installed and running
ollama pull llama3.1:8b
ollama serve
```

### Frontend (Terminal 3):

```bash
cd frontend
npm install
npm run dev
```

## 5. Access the App

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## Troubleshooting

### Backend won't start
- Check `.env` file exists and has correct values
- Verify Supabase URL and key are correct
- Make sure Python 3.11 is being used (not 3.13)

### Frontend can't connect to backend
- Check `VITE_API_BASE_URL` in `frontend/.env`
- Verify backend is running on port 8000
- Check browser console for CORS errors

### AI features not working
- Ensure Ollama is running: `ollama serve`
- Check model is installed: `ollama list`
- Verify `OLLAMA_BASE_URL` in backend `.env`

### Database errors
- Verify all SQL tables were created
- Check Supabase connection in backend logs
- Ensure storage bucket `notebook-files` exists

## Next Steps

1. Sign up at http://localhost:5173/login
2. Create your first notebook
3. Upload a PDF or DOCX file
4. Try the AI features (Summarize, Explain, Generate Questions)

Enjoy your AI Study Notebook! 🎓

