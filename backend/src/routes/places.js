import { Router } from "express";
import { db, makeId } from "../app.js";
const router = Router();

router.get("/", (req, res) => res.json({ success: true, data: db.places }));

router.post("/", (req, res) => {
  const { name, address = "", latitude, longitude, category = "Custom", notes = "" } = req.body ?? {};
  if (typeof name !== "string" || !name.trim())
    return res.status(400).json({ success: false, message: "Place name is required." });
  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90 ||
      !Number.isFinite(longitude) || longitude < -180 || longitude > 180)
    return res.status(400).json({ success: false, message: "Valid numeric latitude and longitude are required." });
  const place = {
    id: makeId(), name: name.trim(),
    address: typeof address === "string" ? address : "",
    latitude, longitude,
    category: typeof category === "string" ? category : "Custom",
    notes: typeof notes === "string" ? notes : "",
    createdAt: new Date().toISOString()
  };
  db.places.push(place);
  res.status(201).json({ success: true, data: place });
});

router.patch("/:id", (req, res) => {
  const place = db.places.find(item => item.id === req.params.id);
  if (!place) return res.status(404).json({ success: false, message: "Place not found." });
  const { name, address, latitude, longitude, category, notes } = req.body ?? {};
  if (name !== undefined && (typeof name !== "string" || !name.trim()))
    return res.status(400).json({ success: false, message: "Name must be a non-empty string." });
  if (latitude !== undefined && (!Number.isFinite(latitude) || latitude < -90 || latitude > 90))
    return res.status(400).json({ success: false, message: "Invalid latitude." });
  if (longitude !== undefined && (!Number.isFinite(longitude) || longitude < -180 || longitude > 180))
    return res.status(400).json({ success: false, message: "Invalid longitude." });
  Object.assign(place, {
    ...(name !== undefined ? { name: name.trim() } : {}),
    ...(address !== undefined ? { address } : {}),
    ...(latitude !== undefined ? { latitude } : {}),
    ...(longitude !== undefined ? { longitude } : {}),
    ...(category !== undefined ? { category } : {}),
    ...(notes !== undefined ? { notes } : {}),
    updatedAt: new Date().toISOString()
  });
  res.json({ success: true, data: place });
});

router.delete("/:id", (req, res) => {
  const index = db.places.findIndex(item => item.id === req.params.id);
  if (index < 0) return res.status(404).json({ success: false, message: "Place not found." });
  const [deleted] = db.places.splice(index, 1);
  res.json({ success: true, data: deleted });
});
export default router;
