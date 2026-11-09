# EASY GO frontend — Live GPS addition

Set `VITE_API_BASE_URL` to the backend origin (without `/api`) and `VITE_GPS_DEVICE_ID` to the configured ESP32 ID. Run `npm install`, `npm run dev`; production build uses `npm run build`.

The new **Live GPS Tracking** navigation item reads `/api/gps/latest` and `/api/gps/history` and refreshes every 3 seconds. See `../DEPLOYMENT_GUIDE.md`.
