# Veylo Chat

Veylo Chat is a language exchange web app where people can discover learners, connect as friends, chat, and start video calls.

## Features

- Sign up, log in, and complete or edit a language learning profile
- Discover learners by their native and learning languages
- Send and accept friend requests
- View friends and open direct conversations
- Real-time messaging and video calls powered by Stream
- Theme selection and responsive mobile navigation

## Tech stack

- Frontend: React, Vite, React Router, TanStack Query, Tailwind CSS, DaisyUI
- Backend: Node.js, Express, MongoDB with Mongoose
- Chat and video: Stream Chat and Stream Video SDKs
- Authentication: JWT stored in an HTTP-only cookie

## Requirements

- Node.js and npm
- A MongoDB database (local or MongoDB Atlas)
- A Stream application with Chat and Video enabled

## Configuration

Create `backend/.env` with the following variables:

```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET_KEY=replace_with_a_long_random_secret
STREAM_API_KEY=your_stream_api_key
STREAM_API_SECRET=your_stream_api_secret
NODE_ENV=development
```

Create `frontend/.env`:

```env
VITE_STREAM_API_KEY=your_stream_api_key
```

Use the same Stream API key in both files. Keep the Stream secret and JWT secret private. Do not commit either `.env` file.

## Run locally

Install dependencies from the project root:

```bash
npm run build
```

Start the backend in one terminal:

```bash
cd backend
npm run dev
```

Start the frontend in another terminal:

```bash
cd frontend
npm run dev
```

Open the Vite URL shown in the frontend terminal (usually `http://localhost:5173`). The backend listens on port `5001` by default.

## Available scripts

From the project root:

- `npm run build` installs backend and frontend dependencies and builds the frontend.
- `npm start` starts the backend.

From `frontend/`:

- `npm run dev` starts the Vite development server.
- `npm run build` creates a production build in `frontend/dist`.
- `npm run preview` previews the production build locally.
- `npm run lint` runs ESLint.

From `backend/`:

- `npm run dev` starts the API with Nodemon.
- `npm start` starts the API with Node.js.

## Production

Build the frontend and run the backend with `NODE_ENV=production`. The Express server serves the built frontend from `frontend/dist` in production. Configure the production environment variables and deployment networking for your hosting provider. The current CORS configuration allows `http://localhost:5173` for local development; update it for a separate production frontend origin if needed.
