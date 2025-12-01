# Troubleshooting Guide

## Problem 1: Backend Won't Start - "Invalid URL" Error

### What Was Wrong:
The Supabase client was being created at import time (when the module loads), which caused the backend to crash immediately if the `.env` file had placeholder values.

### What I Fixed:
- Changed `utils/database.py` to **lazy-load** the Supabase client (only creates it when first used)
- Added validation that shows clear error messages if Supabase credentials are missing or invalid
- The backend will now start even if Supabase isn't configured, but will show helpful errors when you try to use it

### What You Need to Do:
1. **Edit `backend/.env`** and replace the placeholder values:

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

2. **Get your Supabase credentials:**
   - Go to https://supabase.com/dashboard
   - Select your project
   - Go to **Settings** → **API**
   - Copy **Project URL** → paste as `SUPABASE_URL`
   - Copy **anon public** key → paste as `SUPABASE_KEY`

3. **Restart the backend:**
   ```bash
   cd backend
   source .venv/bin/activate
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

---

## Problem 2: Frontend Authentication Not Working

### What Was Wrong:
1. Error messages weren't being shown to users (just console logs)
2. No validation feedback when API calls failed
3. Backend errors weren't being properly caught and displayed

### What I Fixed:
1. **Added error handling in `AuthContext.jsx`:**
   - Now throws errors with clear messages
   - Catches API errors and extracts error details

2. **Added error display in `LoginPage.jsx`:**
   - Shows red error banner when login/signup fails
   - Displays the actual error message from the backend

3. **Improved backend error messages:**
   - Auth endpoints now return detailed error messages
   - Better exception handling

### What You Need to Check:

1. **Backend is running:**
   ```bash
   # Check if backend is accessible
   curl http://localhost:8000/health
   # Should return: {"status":"ok"}
   ```

2. **Frontend can reach backend:**
   - Check `frontend/.env` has: `VITE_API_BASE_URL=http://localhost:8000`
   - Open browser console (F12) and check for CORS or connection errors

3. **Supabase tables exist:**
   - Make sure you ran the SQL schema in Supabase (see `README.md`)
   - The `users` table must exist for auth to work

4. **Check browser console:**
   - Open DevTools (F12) → Console tab
   - Try to sign up/login
   - Look for error messages - they'll tell you exactly what's wrong

---

## Common Issues & Solutions

### Issue: "Email already registered"
- **Solution:** The email is already in the database. Try logging in instead, or use a different email.

### Issue: "Invalid credentials"
- **Solution:** Wrong email/password combination. Make sure you're using the correct credentials.

### Issue: "Network Error" or "Failed to fetch"
- **Solution:** 
  - Backend is not running → Start it with `uvicorn main:app --reload`
  - Wrong API URL → Check `frontend/.env` has correct `VITE_API_BASE_URL`
  - CORS error → Backend CORS is already configured, but make sure frontend URL matches

### Issue: "Signup failed: ..." or "Login failed: ..."
- **Solution:** Check the error message - it will tell you what's wrong:
  - If it mentions Supabase → Check your `.env` credentials
  - If it mentions database → Make sure tables exist in Supabase
  - If it mentions connection → Check Supabase project is active

### Issue: Backend starts but shows Supabase errors
- **Solution:** The backend will now start even with invalid Supabase config, but you'll see clear errors when trying to use auth. Fix your `.env` file.

---

## Testing Authentication

1. **Test backend directly:**
   ```bash
   # Sign up
   curl -X POST http://localhost:8000/auth/signup \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"test123"}'
   
   # Login
   curl -X POST http://localhost:8000/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"test123"}'
   ```

2. **Test in browser:**
   - Go to http://localhost:5173/login
   - Try to sign up with a new email
   - Check browser console for any errors
   - Error messages will now appear in a red banner on the page

---

## Quick Checklist

Before reporting issues, make sure:

- [ ] Backend `.env` has valid Supabase URL and key
- [ ] Frontend `.env` has `VITE_API_BASE_URL=http://localhost:8000`
- [ ] Backend is running on port 8000
- [ ] Frontend is running on port 5173
- [ ] Supabase tables are created (run SQL from README.md)
- [ ] Supabase storage bucket `notebook-files` exists
- [ ] Browser console shows no CORS errors
- [ ] You're using a valid email format

---

## Still Having Issues?

1. **Check backend logs** - They'll show detailed error messages
2. **Check browser console** - Frontend errors are logged there
3. **Check Supabase dashboard** - Verify tables exist and project is active
4. **Test API directly** - Use curl or Postman to test backend endpoints

The error messages are now much more helpful and will guide you to the exact problem!

