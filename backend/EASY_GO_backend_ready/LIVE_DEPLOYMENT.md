# EASY GO live GPS deployment

## What this adds
- Authenticated ESP32 GPS ingestion at `POST /api/tracking/position` (`x-device-token` header).
- PostgreSQL persistence in Supabase (`gps_positions`).
- Latest device coordinates and history endpoints.
- Interactive Map UI polls the live API every 3 seconds and displays real device coordinates; it does not fabricate GPS data.

## 1. Supabase database
1. Open Supabase project → SQL Editor.
2. Run `database/gps_tracking.sql`.
3. Copy the PostgreSQL connection string from Supabase Database settings. Use the pooler connection for hosted services if direct IPv6 connectivity is unavailable. Keep credentials private.

## 2. Deploy backend (Render)
- Create a new Web Service from the backend Git repository/folder.
- Build command: `npm install`
- Start command: `npm start`
- Environment variables: `NODE_ENV=production`, `DATABASE_URL`, `FRONTEND_URL` (your exact Vercel URL), and `ESP32_DEVICE_TOKEN` (long random secret).
- Health check path: `/api/health`; confirm response has `database: connected`.
- Never commit `.env` or share `DATABASE_URL` / device token.

## 3. Deploy frontend (Vercel)
- Import frontend project. Build command `npm run build`; output directory `dist`.
- Set `VITE_API_BASE_URL=https://YOUR-API.onrender.com` (no trailing slash).
- Redeploy after setting the variable.
- Add the final frontend origin to backend `FRONTEND_URL`.

## 4. ESP32 + GPS wiring
- GPS module TX → ESP32 GPIO16 (RX2).
- GPS module RX → ESP32 GPIO17 (TX2), optional for basic NMEA receive.
- GPS VCC/GND according to the module's rated voltage and board wiring.
- Install Arduino `TinyGPSPlus` library. Open `hardware/esp32_gps_tracker.ino`; fill Wi-Fi, HTTPS API URL, token and device ID.
- The sample sketch has `client.setInsecure()` only to simplify first connectivity tests. This disables TLS certificate verification and is NOT production-safe. Before public deployment, replace it with the correct root CA certificate for your API host.
- Outdoor sky view may be required for a GPS fix. The dashboard shows no device until real coordinates arrive.

## 5. API contract
`POST /api/tracking/position` with `x-device-token: <ESP32_DEVICE_TOKEN>` and JSON:
```json
{
  "deviceId":"easygo-chair-01", "latitude":10.81, "longitude":78.69,
  "altitude":80, "speedKph":0.4, "heading":120, "accuracyM":4.5, "satellites":8
}
```
Read latest devices: `GET /api/tracking/latest`
Read device history: `GET /api/tracking/history/easygo-chair-01?limit=100`

## Important limitations / safety
- This is GPS position tracking, not certified navigation or emergency response. GPS can drift or lose fix indoors.
- The current wheelchair remote-control routes are demo-only and must not be treated as real motor controls. This patch does not enable physical drive commands. Add hardware safety interlocks, authenticated command acknowledgements, watchdog and physical emergency stop before any motor-control integration.
- Existing login/OTP UI remains a demo flow; this GPS endpoint uses a separate device token. Do not expose device tokens in frontend code.
- Current live UI polls every 3 seconds (near-real-time), not a persistent WebSocket.
