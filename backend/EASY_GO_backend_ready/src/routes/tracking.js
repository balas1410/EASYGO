import { Router } from "express";
import { pool } from "../config/db.js";
import crypto from "node:crypto";
const router = Router();
const deviceKey = process.env.ESP32_DEVICE_TOKEN;
function authorized(req, res, next) {
  const supplied = req.get("x-device-token");
  if (!deviceKey || !supplied || supplied.length !== deviceKey.length || !crypto.timingSafeEqual(Buffer.from(supplied), Buffer.from(deviceKey))) {
    return res.status(401).json({ success:false, message:"Invalid device credentials." });
  }
  next();
}
router.post("/position", authorized, async (req,res,next) => {
  try {
    const { deviceId, latitude, longitude, altitude, speedKph, heading, accuracyM, satellites, recordedAt } = req.body ?? {};
    if (typeof deviceId !== "string" || !deviceId.trim() || !Number.isFinite(latitude) || latitude < -90 || latitude > 90 || !Number.isFinite(longitude) || longitude < -180 || longitude > 180) return res.status(400).json({success:false,message:"deviceId and valid latitude/longitude are required."});
    const result = await pool.query(`INSERT INTO gps_positions (device_id, latitude, longitude, altitude_m, speed_kph, heading_deg, accuracy_m, satellites, recorded_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,COALESCE($9::timestamptz,NOW())) RETURNING id, device_id AS "deviceId", latitude, longitude, altitude_m AS altitude, speed_kph AS "speedKph", heading_deg AS heading, accuracy_m AS "accuracyM", satellites, recorded_at AS "recordedAt"`, [deviceId.trim(),latitude,longitude,altitude??null,speedKph??null,heading??null,accuracyM??null,satellites??null,recordedAt??null]);
    res.status(201).json({success:true,data:result.rows[0]});
  } catch(err){ next(err); }
});
router.get("/latest", async (req,res,next) => {
  try { const result=await pool.query(`SELECT DISTINCT ON (device_id) id, device_id AS "deviceId", latitude, longitude, altitude_m AS altitude, speed_kph AS "speedKph", heading_deg AS heading, accuracy_m AS "accuracyM", satellites, recorded_at AS "recordedAt" FROM gps_positions ORDER BY device_id, recorded_at DESC`); res.json({success:true,data:result.rows}); } catch(err){next(err);}
});
router.get("/history/:deviceId", async (req,res,next) => {
  try { const limit=Math.min(Math.max(Number(req.query.limit)||100,1),1000); const result=await pool.query(`SELECT id, device_id AS "deviceId", latitude, longitude, speed_kph AS "speedKph", heading_deg AS heading, accuracy_m AS "accuracyM", recorded_at AS "recordedAt" FROM gps_positions WHERE device_id=$1 ORDER BY recorded_at DESC LIMIT $2`,[req.params.deviceId,limit]); res.json({success:true,data:result.rows}); } catch(err){next(err);}
});
export default router;
