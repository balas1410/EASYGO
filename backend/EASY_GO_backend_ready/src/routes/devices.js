import { Router } from "express";
import { db, makeId } from "../app.js";
const router = Router();

router.get("/status", (req, res) => res.json({
  success: true, mode: "demo", connected: false,
  message: "No physical ESP32 is connected. Commands are not sent to hardware."
}));

// Demo-only command logging. This does not control a physical wheelchair.
router.post("/commands", (req, res) => {
  const allowed = ["forward", "backward", "left", "right", "stop", "emergency-stop"];
  const { command, speed = 0 } = req.body ?? {};
  if (!allowed.includes(command))
    return res.status(400).json({ success: false, message: "Invalid command." });
  if (!Number.isFinite(speed) || speed < 0 || speed > 100)
    return res.status(400).json({ success: false, message: "Speed must be between 0 and 100." });
  const record = {
    id: makeId(), command,
    speed: ["stop", "emergency-stop"].includes(command) ? 0 : speed,
    timestamp: new Date().toISOString(), mode: "demo",
    sentToHardware: false, acknowledgedByHardware: false
  };
  db.commands.push(record);
  res.status(201).json({
    success: true, data: record,
    message: "Demo command recorded. No physical movement occurred."
  });
});

router.get("/commands", (req, res) =>
  res.json({ success: true, data: db.commands.slice(-100).reverse() })
);
export default router;
