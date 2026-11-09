# EASY GO Backend — Ready-made Development Starter

## Includes
- Express API and health check
- Favourite places create/list/update/delete
- Journeys create/list/delete
- Demo ultrasonic sensor readings and history
- Demo wheelchair command logging (never controls hardware)
- Dashboard summary and activity endpoints
- CORS and Helmet security headers

## Requirements
Node.js 18+ (Node.js 20+ recommended) and npm.

## Run
1. Open a terminal in this folder.
2. Run `npm install`.
3. Copy `.env.example` to `.env`.
4. Run `npm run dev`.
5. Open http://localhost:5000/api/health.

## Frontend connection
In your React/Vite frontend `.env`, set:
`VITE_API_BASE_URL=http://localhost:5000/api`
Restart Vite after changing `.env`.

## Endpoints
- GET `/api/health`
- GET, POST `/api/places`
- PATCH, DELETE `/api/places/:id`
- GET, POST `/api/journeys`
- DELETE `/api/journeys/:id`
- GET `/api/sensors/latest`
- GET `/api/sensors/history`
- POST `/api/sensors/readings` (demo mode only)
- GET `/api/devices/status`
- GET, POST `/api/devices/commands` (demo logging only)
- GET `/api/dashboard/summary`
- GET `/api/dashboard/activity`

## Limitations and safety
This is a local development starter. Data is stored in memory and disappears when the server restarts. It does not include real authentication/OTP, database persistence, per-user access control, device authentication, or physical ESP32 control. Do not deploy it publicly as-is. Before production, add persistent storage, authenticated access, rate limiting, device identity, and a secure hardware gateway.

Ordinary driving routes do not prove wheelchair accessibility.
