# StudyBuddy

StudyBuddy is a full-stack student planning application built with Next.js, React, Node.js runtime APIs, and Firebase-ready integrations. It is designed around assignment management, live planning context, and a clean, presentation-ready UI.

## Core Features
- Multi-page frontend with navigable routes: Home, Dashboard, Assignments, About, Login, Signup.
- Authentication flow with Firebase Auth when configured.
- Demo auth fallback using local storage so the full auth UX still works during local demos.
- Assignment CRUD with Firestore when Firebase is configured.
- Local persistence fallback for guest sessions and demo mode.
- Two external API integrations displayed on the dashboard:
  - Open-Meteo weather data
  - Open Library study resource search

## Tech Stack
- Next.js
- React
- styled-components
- Firebase Auth
- Firestore
- Next.js API routes

## Local Development
1. Install dependencies:
   `npm install`
2. Start the dev server:
   `npm run dev`
3. Build for production:
   `npm run build`
4. Start the production server:
   `npm run start`

## Firebase Setup (Optional but Recommended)
Create a `.env.local` file in the project root and provide:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

If these values are not present, the app automatically runs in demo mode so login/signup and assignment persistence are still functional for local review.

## Rubric Coverage
- Frontend: more than 3 navigable pages with polished UI and reusable components.
- React Hooks: `useState`, `useEffect`, and `useMemo` are used throughout the app.
- Component Structure: shared layout, navbar, auth form, and dashboard widgets.
- Authentication: login and signup flows implemented.
- Database: assignment read/write/update/delete implemented.
- APIs: weather and study resources are loaded from external services.

## Presentation Notes
- Demo route for core functionality: `/dashboard`
- CRUD workflow: `/assignments`
- Auth workflow: `/auth/signup` and `/auth/login`
- Project overview: `/about`
