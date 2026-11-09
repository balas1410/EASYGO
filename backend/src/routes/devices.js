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


// Local-network ESP32 command bridge for communication testing only.
// Requires the backend to run on the same LAN as the ESP32.
router.post("/esp32/commands", async (req, res) => {
  const allowed = ["forward", "backward", "left", "right", "stop", "emergency-stop"];
  const { command, esp32BaseUrl } = req.body ?? {};
  if (!allowed.includes(command)) return res.status(400).json({ success: false, message: "Invalid command." });
  let target;
  try { target = new URL(esp32BaseUrl); } catch { return res.status(400).json({ success: false, message: "Enter the ESP32 URL, e.g. http://192.168.1.50" }); }
  const ip = target.hostname.split(".").map(Number);
  const isPrivateIPv4 = ip.length === 4 && ip.every(n => Number.isInteger(n) && n >= 0 && n <= 255) &&
    (ip[0] === 10 || ip[0] === 192 && ip[1] === 168 || ip[0] === 172 && ip[1] >= 16 && ip[1] <= 31);
  if (target.protocol !== "http:" || !isPrivateIPv4 || (target.port && target.port !== "80") || target.username || target.password)
    return res.status(400).json({ success: false, message: "Only an ESP32 private-LAN IPv4 address using HTTP port 80 is allowed." });
  try {
    const response = await fetch(`${target.origin}/control?cmd=${encodeURIComponent(command.toUpperCase())}`, { signal: AbortSignal.timeout(4000) });
    const reply = await response.text();
    if (!response.ok) return res.status(502).json({ success: false, message: `ESP32 replied with HTTP ${response.status}: ${reply}` });
    return res.json({ success: true, data: { id: makeId(), command, acknowledged: true, timestamp: new Date().toISOString() }, message: `ESP32 received ${command.toUpperCase()}: ${reply}` });
  } catch (error) {
    return res.status(504).json({ success: false, message: "Cannot reach ESP32. Run this backend on the same Wi-Fi/LAN as ESP32 and verify its IP address." });
  }
});

router.get("/commands", (req, res) =>
  res.json({ success: true, data: db.commands.slice(-100).reverse() })
);
export default router;
