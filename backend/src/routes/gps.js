import { Router } from 'express';
import crypto from 'node:crypto';
import { pool } from '../config/db.js';
const router = Router();

function deviceAuth(req, res, next) {
  const expected = process.env.ESP32_DEVICE_TOKEN || '';
  const supplied = req.get('x-device-token') || '';
  if (!expected || !supplied) return res.status(401).json({ success:false, message:'Device authentication is not configured.' });
  const a = Buffer.from(expected); const b = Buffer.from(supplied);
  if (a.length !== b.length || !crypto.timingSafeEqual(a,b)) return res.status(401).json({ success:false, message:'Invalid device token.' });
  next();
}
router.post('/location', deviceAuth, async (req,res,next) => {
  try {
    const { deviceId='easygo-wheelchair-01', latitude, longitude, altitude=null, speed=null, heading=null, accuracy=null, satellites=null, recordedAt=null } = req.body || {};
    if (typeof deviceId !== 'string' || !deviceId.trim() || !Number.isFinite(latitude) || latitude < -90 || latitude > 90 || !Number.isFinite(longitude) || longitude < -180 || longitude > 180)
      return res.status(400).json({success:false,message:'deviceId, valid latitude and longitude are required.'});
    for (const [key,value] of Object.entries({altitude,speed,heading,accuracy,satellites})) if (value !== null && (!Number.isFinite(value) || value < 0)) return res.status(400).json({success:false,message:`${key} must be a non-negative number or null.`});
    const result = await pool.query(`INSERT INTO gps_locations (device_id, latitude, longitude, altitude_m, speed_kmh, heading_deg, accuracy_m, satellites, recorded_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,COALESCE($9::timestamptz,NOW())) RETURNING id, device_id AS "deviceId", latitude, longitude, altitude_m AS altitude, speed_kmh AS speed, heading_deg AS heading, accuracy_m AS accuracy, satellites, recorded_at AS "recordedAt", NOW() AS "receivedAt"`, [deviceId.trim(),latitude,longitude,altitude,speed,heading,accuracy,satellites,recordedAt]);
    res.status(201).json({success:true,data:result.rows[0]});
  } catch(e){ next(e); }
});
router.get('/latest', async (req,res,next) => {
  try { const result=await pool.query(`SELECT id,device_id AS "deviceId",latitude,longitude,altitude_m AS altitude,speed_kmh AS speed,heading_deg AS heading,accuracy_m AS accuracy,satellites,recorded_at AS "recordedAt", NOW() AS "serverTime" FROM gps_locations WHERE device_id=$1 ORDER BY recorded_at DESC LIMIT 1`,[String(req.query.deviceId || 'easygo-wheelchair-01')]);
    const data=result.rows[0] || null; const ageSeconds=data ? Math.max(0,(Date.now()-new Date(data.recordedAt).getTime())/1000) : null;
    res.json({success:true,data,ageSeconds,isLive:ageSeconds !== null && ageSeconds <= Number(process.env.GPS_LIVE_WINDOW_SECONDS || 30)});
  } catch(e){next(e);}
});
router.get('/history', async(req,res,next)=>{ try { const limit=Math.min(Math.max(Number(req.query.limit)||100,1),1000); const result=await pool.query(`SELECT id,device_id AS "deviceId",latitude,longitude,speed_kmh AS speed,heading_deg AS heading,accuracy_m AS accuracy,recorded_at AS "recordedAt" FROM gps_locations WHERE device_id=$1 ORDER BY recorded_at DESC LIMIT $2`,[String(req.query.deviceId || 'easygo-wheelchair-01'),limit]); res.json({success:true,data:result.rows}); }catch(e){next(e);} });
export default router;
