# AI Study Notebook - Frontend

React + Vite + Tailwind CSS frontend for the AI Study Notebook application.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   Create a `.env` file in the `frontend/` directory:
   ```env
   VITE_API_BASE_URL=http://localhost:8000
   ```
   
   Replace `http://localhost:8000` with your backend API URL if different.

3. **Start development server:**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

## Configuration

### API Base URL

The frontend communicates with the backend API. Set the `VITE_API_BASE_URL` environment variable to point to your FastAPI backend.

- Default: `http://localhost:8000`
- Change in `.env` file: `VITE_API_BASE_URL=your-backend-url`

### Authentication

The app uses JWT tokens stored in localStorage. Tokens are automatically included in API requests via the `api.js` utility.

## Project Structure

```
frontend/
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── layout/      # Sidebar, Navbar, AppShell
│   │   ├── ChatBox.jsx
│   │   ├── FileUploader.jsx
│   │   └── NotesEditor.jsx
│   ├── context/         # React Context (Auth)
│   ├── pages/           # Page components
│   ├── router/          # React Router setup
│   ├── utils/           # Utilities (API client)
│   └── styles/          # Tailwind CSS
├── .env                 # Environment variables (create this)
└── package.json
```

## Features

- ✅ Login/Signup page
- ✅ Dashboard with quick actions
- ✅ Notes page with markdown editor and AI panel
- ✅ AI Chat page
- ✅ Question Generator
- ✅ Exam Planner with calendar
- ✅ Settings page
- ✅ Responsive design
- ✅ Clean, minimal UI (Notion + Google Gemini style)

## Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

