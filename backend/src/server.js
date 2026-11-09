import "dotenv/config";
import app from "./app.js";
const port = Number(process.env.PORT || 5000);
app.listen(port, () => {
  console.log(`EASY GO backend running at http://localhost:${port}`);
  console.log(`Health check: http://localhost:${port}/api/health`);
  console.log(`Mode: ${process.env.DEMO_MODE === "true" ? "DEMO" : "CONFIGURED"}`);
});
