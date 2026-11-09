# EASY GO backend

Node.js + Express API. Install with `npm install`; configure environment variables from `.env.example`; run `npm run dev` locally or `npm start` in production.

The new `/api/gps` endpoints store authenticated ESP32 GPS packets in PostgreSQL. Run `database/gps_tracking.sql` first. The device must send `x-device-token` matching `ESP32_DEVICE_TOKEN`.

See `../DEPLOYMENT_GUIDE.md` for deployment and hardware setup. Existing legacy routes are retained for compatibility; several still use in-memory/demo data and are not production persistence.
