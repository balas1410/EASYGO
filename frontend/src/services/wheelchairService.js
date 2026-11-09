const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// Sends prototype test commands through the EASY GO backend to the ESP32 web server.
// The ESP32 firmware used for this test only logs commands; it does not drive motors.
export const wheelchairService = {
  async sendCommand({ command, speedLevel, esp32BaseUrl }) {
    const normalized = String(command).toLowerCase().replaceAll(' ', '-');
    const allowed = ['forward', 'backward', 'left', 'right', 'stop', 'emergency-stop'];
    if (!allowed.includes(normalized)) throw new Error('Invalid command');
    if (!API_BASE_URL) throw new Error('Set VITE_API_BASE_URL to your EASY GO backend URL.');
    const response = await fetch(`${API_BASE_URL}/devices/esp32/commands`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ command: normalized, speedLevel, esp32BaseUrl })
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.message || `ESP32 request failed (${response.status})`);
    return {
      id: result.data?.id || `cmd-${Date.now()}`,
      command, speedLevel, timestamp: new Date().toLocaleTimeString(),
      acknowledgedByHardware: Boolean(result.data?.acknowledged), isDemo: false,
      statusMessage: result.message || 'Command delivered to ESP32 test endpoint.'
    };
  }
};
