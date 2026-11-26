# League of Legends Multiplayer Quiz

Event Driven 3B Final Project

A real-time multiplayer League of Legends quiz and chat application built with Node.js, Express, and Socket.IO.

## Requirements

- Node.js 18 or newer
- npm

## Run locally

From the project directory, install dependencies and start the server:

```bash
npm ci
npm start
```

By default, the server runs on port `5000`. Open:

- Quiz: <http://localhost:5000/quiz>

To use a different port, set `PORT` before starting the server. For example, in PowerShell:

```powershell
$env:PORT="8000"
npm start
```

Then open <http://localhost:8000/quiz>.

The quiz and chat work without a MySQL server. The user-management API (`/users`) requires MySQL. To use it, copy `.env.example` to `.env`, set the database connection values, start MySQL, and run:

```bash
npm run migrate
npm start
```

## Play a multiplayer quiz

1. Open `/quiz` in two or more browser tabs or devices connected to the same server.
2. One player creates a lobby and shares the six-character room code.
3. Other players enter the code and join.
4. Players mark themselves ready; the host starts the game once everyone is ready.

## Project structure

- `server.js` — Express server and HTTP routes
- `socket.js` — real-time chat
- `socket-quiz.js` — quiz rooms, questions, and game events
- `view/` — chat and quiz pages
- `controllers/`, `models/` — user API and MySQL access
