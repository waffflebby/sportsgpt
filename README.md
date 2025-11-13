# ChatGPT Clone - Light Mode Frontend

A modern, responsive ChatGPT clone frontend built with React, TailwindCSS, and Vite.

## Features

- ✨ Clean light mode design
- 💬 Chat interface with message history
- 📱 Fully responsive (mobile & desktop)
- 🎨 Modern UI with smooth animations
- 🗂️ Conversation management (create, select, delete)
- ⌨️ Auto-expanding textarea input
- 📋 Copy message functionality
- 👍 Message feedback buttons

## Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The app will open at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

Output will be in the `dist` folder.

## Project Structure

```
src/
├── components/
│   ├── Sidebar.jsx       # Left sidebar with conversations
│   ├── ChatWindow.jsx    # Main chat area
│   ├── MessageList.jsx   # Message display
│   └── InputArea.jsx     # Message input
├── App.jsx               # Main app component
├── main.jsx              # Entry point
└── index.css             # Global styles
```

## Technologies

- **React 18** - UI library
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **Lucide React** - Icons

## Notes

- This is a frontend-only implementation
- Messages are simulated with demo responses
- To connect to a real API, modify the `handleSendMessage` function in `App.jsx`
