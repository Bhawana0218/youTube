# YouTube Clone (Next.js + Express + MongoDB)

A full-stack YouTube-style app with:

- Google sign-in
- Channel/profile flow
- Video upload and playback
- Record video from camera and post it
- Likes, watch later, history, comments
- Search and related videos

## Project Structure

```text
C:\YOUTUBE
|- server    # Express + MongoDB backend
|- youtube   # Next.js frontend
```

## Prerequisites

- Node.js 18+
- npm
- MongoDB connection string

## Environment Variables

### 1) Backend (`server/.env`)

```env
PORT=5000
DB_URL=your_mongodb_connection_string
```

### 2) Frontend (`youtube/.env.local`)

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

## Install Dependencies

### Backend

```bash
cd server
npm install
```

### Frontend

```bash
cd youtube
npm install
```

## Run the App

Open two terminals.

### Terminal 1: Backend

```bash
cd server
npm start
```

Backend runs on `http://localhost:5000`.

### Terminal 2: Frontend

```bash
cd youtube
npm run dev
```

Frontend runs on `http://localhost:3000`.

## Main Scripts

### `server/package.json`

- `npm start` -> starts backend with nodemon

### `youtube/package.json`

- `npm run dev` -> starts Next.js dev server
- `npm run build` -> production build
- `npm start` -> start production server
- `npm run lint` -> run ESLint

## API Base Paths (Backend)

- `/user`
- `/video`
- `/like`
- `/watchlater`
- `/history`
- `/comment`
- `/uploads` (static uploaded files)

## Notes

- Uploaded videos are stored in `server/uploads`.
- Current Firebase config is defined in `youtube/lib/firebase.js`.
- If upload/playback fails, first verify `NEXT_PUBLIC_BACKEND_URL` and backend server status.

