# NeuroHaven

Mental health wellness platform with journaling, counselor booking, and supportive tools.

## Status

- Current branch: dev (merge to main later).

## Tech stack

- Frontend: React 18, Vite, TypeScript, Tailwind, shadcn/ui, Firebase Auth
- Backend: Node.js, Express 5, MongoDB (Mongoose), JWT auth
- Integrations: Firebase Admin (Google sign-in verification), Google Calendar/Meet

## Project structure (indexed)

```
neurohaven-main/
  backend/
    .env.example
    index.js
    package.json
    package-lock.json
    lib/
      bookingTime.js
      firebaseAdmin.js
      googleMeet.js
      jwt.js
      seedCounselors.js
    middleware/
      requireAuth.js
    models/
      Counselor.js
      JournalEntry.js
      SessionBooking.js
      User.js
    routes/
      auth.js
      counselors.js
      journal.js
  frontend/
    index.html
    package.json
    package-lock.json
    bun.lockb
    vite.config.ts
    tsconfig.json
    tsconfig.app.json
    tsconfig.node.json
    tailwind.config.ts
    postcss.config.js
    eslint.config.js
    components.json
    public/
      favicon.ico
      placeholder.svg
      robots.txt
    src/
      App.tsx
      main.tsx
      index.css
      App.css
      firebase.ts
      vite-env.d.ts
      assets/
      components/
        Layout.tsx
        NotificationCenter.tsx
        SilentSOS.tsx
        UserAvatarMenu.tsx
        ui/
      context/
        AuthContext.tsx
      hooks/
        use-mobile.tsx
        use-toast.ts
      lib/
        authApi.ts
        journalUtils.ts
        utils.ts
      pages/
        Calmscapes.tsx
        CounselorCare.tsx
        Dashboard.tsx
        EmotionTwin.tsx
        Journal.tsx
        Landing.tsx
        LandingPage.tsx
        Login.tsx
        NotFound.tsx
        PeerPods.tsx
      types/
```

## Features

- Email/password auth with JWT
- Google sign-in via Firebase Auth and Firebase Admin verification
- Journal entries per day with mood tracking
- Counselor discovery and booking with availability checks
- Optional Google Meet link creation for video sessions

## Backend overview

- Base URL: `http://localhost:3001`
- Health: `GET /`
- Auth:
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `POST /api/auth/google`
  - `GET /api/auth/me`
- Journal:
  - `GET /api/journal`
  - `POST /api/journal`
- Counselors:
  - `GET /api/counselors`
  - `GET /api/counselors/:id`
  - `GET /api/counselors/:counselorId/slots?date=YYYY-MM-DD`
  - `GET /api/counselors/bookings/me`
  - `POST /api/counselors/bookings`

## Frontend overview

- App routes:
  - `/` landing
  - `/login` login
  - `/dashboard`, `/emotion-twin`, `/peer-pods`, `/journal`, `/counselor`, `/calmscapes` (protected)

## Environment variables

### Backend (.env)

Create `backend/.env` from `backend/.env.example`:

```
PORT=3001
MONGO_URI=mongodb://127.0.0.1:27017/neurohaven
JWT_SECRET=replace-with-a-long-random-string-in-production
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=http://localhost:5000
# FIREBASE_SERVICE_ACCOUNT_JSON={...}
# GOOGLE_SERVICE_ACCOUNT_JSON={...}
# GOOGLE_CALENDAR_ID=primary
# GOOGLE_CALENDAR_IMPERSONATE_EMAIL=counselor@yourdomain.com
# MEET_LINK_FALLBACK=https://meet.google.com/new
```

### Frontend (.env)

Create `frontend/.env`:

```
VITE_API_URL=http://localhost:3001
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Setup (Git Bash on Windows)

From the repo root `neurohaven-main`:

### 1) Backend

```bash
cd backend
npm install
cp .env.example .env
# edit .env with your values
npm run dev
```

Backend runs on `http://localhost:3001`.

### 2) Frontend

```bash
cd ../frontend
npm install
# create .env manually with the variables shown above
npm run dev
```

Frontend runs on `http://localhost:5000`.

## Notes

- Counselor data is auto-seeded on first backend start if the collection is empty.
- Google sign-in requires Firebase Admin service account JSON on the backend and Firebase web config on the frontend.
- Google Meet link creation requires Calendar API access; a fallback link is used if configured but no Meet link is returned.
