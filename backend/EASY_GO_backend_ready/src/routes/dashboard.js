import { Router } from "express";
import { db } from "../app.js";
const router = Router();

router.get("/summary", (req, res) => res.json({
  success: true,
  data: {
    savedPlaces: db.places.length,
    savedJourneys: db.journeys.length,
    sensorReadings: db.sensorReadings.length,
    recordedCommands: db.commands.length,
    latestSensorReading: db.sensorReadings.at(-1) ?? null,
    demoMode: process.env.DEMO_MODE === "true"
  }
}));

router.get("/activity", (req, res) => {
  const items = [
    ...db.places.map(x => ({ type: "place", id: x.id, timestamp: x.createdAt, label: `Saved place: ${x.name}` })),
    ...db.journeys.map(x => ({ type: "journey", id: x.id, timestamp: x.createdAt, label: "Journey saved" })),
    ...db.sensorReadings.map(x => ({ type: "sensor", id: x.id, timestamp: x.timestamp, label: `Sensor reading: ${x.distanceCm} cm` })),
    ...db.commands.map(x => ({ type: "command", id: x.id, timestamp: x.timestamp, label: `Demo command: ${x.command}` }))
  ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  res.json({ success: true, data: items.slice(0, 100) });
});
export default router;
