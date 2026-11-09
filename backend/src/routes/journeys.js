import { Router } from "express";
import { db, makeId } from "../app.js";
const router = Router();

router.get("/", (req, res) => res.json({ success: true, data: db.journeys }));

router.post("/", (req, res) => {
  const { start, stops = [], destination, distanceKm = null, durationMinutes = null, routeGeometry = null } = req.body ?? {};
  if (!start || !destination || !Array.isArray(stops))
    return res.status(400).json({ success: false, message: "Start, destination and a stops array are required." });
  if (distanceKm !== null && (!Number.isFinite(distanceKm) || distanceKm < 0))
    return res.status(400).json({ success: false, message: "distanceKm must be non-negative or null." });
  if (durationMinutes !== null && (!Number.isFinite(durationMinutes) || durationMinutes < 0))
    return res.status(400).json({ success: false, message: "durationMinutes must be non-negative or null." });
  const journey = {
    id: makeId(), start, stops, destination, distanceKm, durationMinutes, routeGeometry,
    createdAt: new Date().toISOString()
  };
  db.journeys.push(journey);
  res.status(201).json({ success: true, data: journey });
});

router.delete("/:id", (req, res) => {
  const index = db.journeys.findIndex(item => item.id === req.params.id);
  if (index < 0) return res.status(404).json({ success: false, message: "Journey not found." });
  const [deleted] = db.journeys.splice(index, 1);
  res.json({ success: true, data: deleted });
});
export default router;
