import express from "express";
import cors from "cors";
import helmet from "helmet";
import crypto from "node:crypto";
import placesRouter from "./routes/places.js";
import journeysRouter from "./routes/journeys.js";
import sensorsRouter from "./routes/sensors.js";
import devicesRouter from "./routes/devices.js";
import trackingRouter from "./routes/tracking.js";
import dashboardRouter from "./routes/dashboard.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { pool } from "./config/db.js";

const app = express();
export const db = { places: [], journeys: [], sensorReadings: [], commands: [], notifications: [] };
export const makeId = () => crypto.randomUUID();

const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173").split(",").map(x => x.trim());
app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Origin not allowed by CORS"));
  }
}));
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", async (req, res) => {
  let database = "not-configured";
  try { await pool.query("SELECT 1"); database = "connected"; } catch { database = "disconnected"; }
  res.json({
  success: true, app: "EASY GO", status: "running",
  mode: "live-api", database,
  timestamp: new Date().toISOString()
  });
});

app.use("/api/places", placesRouter);
app.use("/api/journeys", journeysRouter);
app.use("/api/sensors", sensorsRouter);
app.use("/api/devices", devicesRouter);
app.use("/api/tracking", trackingRouter);
app.use("/api/dashboard", dashboardRouter);
app.use((req, res) => res.status(404).json({ success: false, message: `API endpoint not found: ${req.method} ${req.path}` }));
app.use(errorHandler);
export default app;
