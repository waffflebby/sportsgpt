Live Demo: https://sports-jeuqnzdfs-cfawow9-gmailcoms-projects.vercel.app

🏀 SportsGPT — AI-Powered Sports Chat App
A frontend ChatGPT-style UI + a Bun/Hono backend ready to pull real sports data.
📌 Overview
SportsGPT is a lightweight chat interface where users can talk about sports, view stats, and get clean sports information.
The project includes:


Frontend: React + Vite + Tailwind (ChatGPT-style UI)


Backend: Bun + Hono + SQLite (deployed on https://backend-bold-smoke-6218.fly.dev/)


API Contract: contract.yaml (Codex-generated)


Deployment Ready: Vercel (frontend), Fly.io (backend)



⚠️ Pending: Frontend needs the production API URL and healthy Fly deployment to communicate with the backend.

🚀 Features (Current)
✅ Frontend (completed)


Clean ChatGPT-style interface


Light mode UI


Conversation list


Auto-expanding input


Copy message button


Fully responsive


✅ Backend (completed)


Bun + Hono server


SQLite persistence


API routes scaffolded (/chat/send, /feed, /games, /players)


OpenAI GPT-4o-mini integration


API-Sports.io for live sports data


✅ Deployment (completed)


Frontend: Vercel


Backend: Fly.io (remember to mount a volume at /data and run migrations via release command)


Secrets: OpenAI & Sports API keys set


Optional: charts, PWA, extra models (not required)



📁 Project Structure
sportsgpt/
├── backend/
│   ├── index.ts               # Bun + Hono API server
│   ├── db.sqlite              # SQLite storage (Fly volume)
│   └── routes/…               # API endpoints
├── src/
│   ├── components/            # Chat UI pieces
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── contract.yaml              # Codex contract
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
Frontend → Vercel
Auto-build using Vite.
Backend → Fly.io
(remember to mount a volume at /data and run migrations via release command).

📍 Current Checkpoint Summary
✔ UI works
✔ Backend server works
✔ API exists
✔ Ready for OpenAI key
❌ Frontend not connected to backend
❌ No real sports stats responses yet
