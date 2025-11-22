# Notes API (NestJS + SQLite)

This project is a minimal Notes API built with NestJS, TypeScript, SQLite and JWT authentication. It provides register/login and private notes per user. Swagger is enabled for API docs.

Quick start (Windows PowerShell):

```powershell
npm install
npm run start:dev

# Open Swagger: http://localhost:3000/docs
```

Default DB: `db.sqlite` (created in project root). JWT secret is in code (for demo). For production, move secrets to env vars.

Frontend (static):

The `frontend/` folder contains a minimal single-page app that can talk to the API at `http://localhost:3000`.

To use the frontend, run the backend and then open `frontend/index.html` in your browser (or serve the folder with a static server). The frontend supports register, login, create/read/update/delete notes.

Example PowerShell to serve the frontend quickly:

```powershell
# from project root
# Option A: open file directly (may be blocked by some browser policies)
Start-Process -FilePath (Resolve-Path frontend\index.html)

# Option B: use a simple static server via Python or Node
# If you have Python: python -m http.server 5173 -d frontend
# Or with Node installed, install http-server: npm i -g http-server; http-server frontend -p 5173
```

API docs (Swagger) available after starting backend: `http://localhost:3000/docs`
