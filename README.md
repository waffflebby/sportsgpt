🏀 SportsGPT — AI-Powered Sports Chat App
A frontend ChatGPT-style UI + a Bun/Elysia backend ready to pull real sports data.
📌 Overview
SportsGPT is a lightweight chat interface where users can talk about sports, view stats, and get clean sports information.
The project includes:


Frontend: React + Vite + Tailwind (ChatGPT-style UI)


Backend: Bun + Elysia.js + SQLite


API Contract: contract.yaml (Codex-generated)


Deployment Ready: Netlify (frontend), Fly.io (backend)


Right now, the backend API exists but is not yet hooked into the frontend — this README reflects the current checkpoint.

🚀 Features (Current)
✅ Frontend (completed)


Clean ChatGPT-style interface


Light mode UI


Conversation list


Auto-expanding input


Copy message button


Fully responsive


✅ Backend (completed)


Bun + Elysia server


SQLite persistence


API routes scaffolded (/api/analyze, /api/stats, etc.)


Ready for OpenAI integration (not connected yet)


🟡 Not Done Yet (upcoming)


Connect frontend → backend


Add real OpenAI responses


Pull live sports stats and feed them into chat


Optional: charts, PWA, extra models (not required)



📁 Project Structure
sportsgpt/
├── backend/
│   ├── index.ts               # Bun + Elysia API server
│   ├── db.sqlite              # SQLite storage (Fly volume)
│   └── routes/…               # API endpoints
├── src/
│   ├── components/            # Chat UI pieces
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── contract.yaml              # Codex contract
├── netlify.toml               # Frontend deploy config
└── index.html                 # App shell


🛠️ Getting Started
🔧 Frontend
Install:
npm install

Run dev:
npm run dev

Build:
npm run build


🔧 Backend (Bun API)
Install deps:
bun install

Run API:
bun run index.ts


🔌 Connecting Frontend → Backend (Not Done Yet)
You will eventually modify:
src/App.jsx
Inside:
handleSendMessage()

To call:
POST http://localhost:3000/api/analyze

Not implemented yet.
This is the next step.

📡 Sports Data
The backend is already structured so you can fetch stats and pass them into the chat response once OpenAI is wired in.
Nothing to do yet — just future-ready.

📦 Deployment
Frontend → Netlify
Auto-build using Vite.
Backend → Fly.io
SQLite volume already configured in /backend.

📍 Current Checkpoint Summary
✔ UI works
✔ Backend server works
✔ API exists
✔ Ready for OpenAI key
❌ Frontend not connected to backend
❌ No real sports stats responses yet
