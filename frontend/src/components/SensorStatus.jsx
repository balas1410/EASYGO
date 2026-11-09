import React, { useEffect, useState } from "react";

function SensorStatus() {
  const [distance, setDistance] = useState(null);
  const [status, setStatus] = useState("Connecting...");
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    let active = true;

    const fetchDistance = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/sensor/distance"
        );

        if (!response.ok) {
          throw new Error("Sensor unavailable");
        }

        const data = await response.json();

        if (!active) return;

        const value = Number(data.distance);

        if (!Number.isFinite(value) || value < 0) {
          setDistance(null);
          setStatus("No sensor reading");
          return;
        }

        setDistance(value);
        setStatus(value < 50 ? "Obstacle Detected" : "Path Clear");
        setLastUpdated(new Date());
      } catch (error) {
        if (!active) return;

        setDistance(null);
        setStatus("Connection unavailable");
      }
    };

    fetchDistance();

    const interval = setInterval(fetchDistance, 1000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  const isObstacle = distance !== null && distance < 50;

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <h2>Ultrasonic Sensor</h2>
        <span
          style={{
            ...styles.badge,
            background: distance === null ? "#777" : "#168b65",
          }}
        >
          {distance === null ? "OFFLINE" : "LIVE"}
        </span>
      </div>

      <div style={styles.distance}>
        {distance === null ? "--" : distance.toFixed(1)}
        <span style={styles.unit}> cm</span>
      </div>

      <div
        style={{
          ...styles.status,
          background: isObstacle ? "#fee2e2" : "#dcfce7",
          color: isObstacle ? "#b91c1c" : "#166534",
        }}
      >
        {distance === null
          ? status
          : isObstacle
          ? "⚠️ Obstacle Detected!"
          : "✓ Path Clear"}
      </div>

      <p style={styles.updated}>
        {lastUpdated
          ? `Last updated: ${lastUpdated.toLocaleTimeString()}`
          : "Waiting for sensor data..."}
      </p>
    </div>
  );
}

const styles = {
  card: {
    background: "#ffffff",
    padding: "24px",
    borderRadius: "16px",
    boxShadow: "0 3px 12px rgba(0,0,0,0.08)",
    margin: "20px 0",
    maxWidth: "450px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  badge: {
    color: "white",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "12px",
  },
  distance: {
    fontSize: "48px",
    fontWeight: "bold",
    margin: "20px 0",
  },
  unit: {
    fontSize: "20px",
  },
  status: {
    padding: "14px",
    borderRadius: "10px",
    fontWeight: "bold",
  },
  updated: {
    color: "#777",
    fontSize: "12px",
    marginTop: "15px",
  },
};

export default SensorStatus;