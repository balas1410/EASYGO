const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

/**
 * ESP32 Ultrasonic Obstacle Sensor Service (HC-SR04 / JSN-SR04T via ESP32)
 * Proposed API Contract: GET /api/sensors/readings
 * Strictly NO camera functionality anywhere.
 */
export const sensorService = {
  async fetchLatestReading(thresholdCm = 80) {
    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/sensors/readings`);
        if (res.ok) return await res.json();
      } catch (_err) {
        // Fallback
      }
    }
    // Simulated ultrasonic distance in cm
    const simulatedDistances = [154, 138, 118, 94, 72, 64, 34, 88, 126, 160];
    const dist = simulatedDistances[Math.floor(Math.random() * simulatedDistances.length)];
    const status = dist <= Math.round(thresholdCm * 0.5) ? 'Detected' : dist <= thresholdCm ? 'Warning' : 'Clear';
    return {
      distanceCm: dist,
      status,
      thresholdCm,
      timestamp: new Date().toLocaleTimeString(),
      isDemo: true
    };
  }
};
