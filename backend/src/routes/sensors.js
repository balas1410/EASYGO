import { Router } from "express";
import { db, makeId } from "../app.js";
const router = Router();

router.get("/latest", (req, res) => {
  const reading = db.sensorReadings.at(-1) ?? null;
  res.json({ success: true, data: reading, mode: reading?.source ?? "no-data" });
});

router.get("/history", (req, res) => {
  const limit = Math.min(Math.max(Number(req.query.limit) || 50, 1), 500);
  res.json({ success: true, data: db.sensorReadings.slice(-limit).reverse() });
});

// Demo ingestion only. Add authenticated device identity before production.
router.post("/readings", (req, res) => {
  if (process.env.DEMO_MODE !== "true")
    return res.status(403).json({ success: false, message: "Demo sensor ingestion is disabled." });
  const { deviceId, distanceCm } = req.body ?? {};
  if (typeof deviceId !== "string" || !deviceId.trim() ||
      !Number.isFinite(distanceCm) || distanceCm < 0 || distanceCm > 1000)
    return res.status(400).json({ success: false, message: "Provide deviceId and distanceCm from 0 to 1000." });
  const reading = {
    id: makeId(), deviceId: deviceId.trim(), distanceCm,
    timestamp: new Date().toISOString(), source: "simulated"
  };
  db.sensorReadings.push(reading);
  res.status(201).json({ success: true, data: reading });
});
export default router;
