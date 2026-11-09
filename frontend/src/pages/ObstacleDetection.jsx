import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine
} from 'recharts';
import { Radar, AlertTriangle, CheckCircle2, RefreshCw, Wrench, ShieldAlert } from 'lucide-react';
import { useEasyGo } from '../context/EasyGoContext';
import { sensorService } from '../services/sensorService';

export default function ObstacleDetection() {
  const {
    warningThresholdCm,
    setWarningThresholdCm,
    sensorReadings,
    setSensorReadings,
    knownObstacles,
    sensorStatus,
    setSensorStatus,
    lastSensorUpdate,
    setLastSensorUpdate,
    recordUsageEvent,
    addNotification
  } = useEasyGo();

  const [polling, setPolling] = useState(false);

  const latest = sensorReadings[sensorReadings.length - 1] || {
    distanceCm: 142,
    status: 'Clear',
    time: '15:17:00'
  };

  const computedStatus =
    latest.distanceCm <= Math.round(warningThresholdCm * 0.5)
      ? 'Detected'
      : latest.distanceCm <= warningThresholdCm
      ? 'Warning'
      : 'Clear';

  const handleSampleUltrasonicPulse = async () => {
    setPolling(true);
    try {
      const reading = await sensorService.fetchLatestReading(warningThresholdCm);
      const entry = {
        time: reading.timestamp,
        distanceCm: reading.distanceCm,
        status: reading.status,
        thresholdCm: warningThresholdCm,
        isDemo: true
      };
      setSensorReadings((prev) => [...prev.slice(-11), entry]);
      setLastSensorUpdate(reading.timestamp);
      recordUsageEvent('Ultrasonic Sensor Pulse', 'Obstacle Detection', `${reading.distanceCm} cm (${reading.status})`);

      if (reading.status !== 'Clear') {
        addNotification({
          type: 'obstacle_alert',
          title: `Ultrasonic ${reading.status}: ${reading.distanceCm} cm (Demo)`,
          message: `ESP32 ultrasonic echo detected object within ${reading.distanceCm} cm (Threshold: ${warningThresholdCm} cm).`
        });
      }
    } finally {
      setPolling(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="eg-card rounded-3xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase text-cyan-500">
            ESP32 Acoustic Time-of-Flight Telemetry • Simulated Demo Mode
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold">Ultrasonic Obstacle Detection</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Measures front/curb clearance in centimeters using an ESP32 ultrasonic sensor array. Note: An ultrasonic sensor measures local acoustic reflections and cannot detect every hazard or verify an entire route.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSampleUltrasonicPulse}
          disabled={polling}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-bold shadow"
        >
          <RefreshCw className={`w-4 h-4 ${polling ? 'animate-spin' : ''}`} />
          <span>{polling ? 'Sampling Echo...' : 'Simulate Ultrasonic Reading'}</span>
        </button>
      </div>

      {/* Live Distance & Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="eg-card rounded-2xl p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-400">Current Distance (Simulated)</span>
          <div className="text-3xl font-extrabold mt-1 text-cyan-400">{latest.distanceCm} cm</div>
          <span className="text-[11px] text-slate-400">Last update: {lastSensorUpdate}</span>
        </div>

        <div className="eg-card rounded-2xl p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-400">Detection Status</span>
          <div
            className={`text-2xl font-extrabold mt-1 flex items-center gap-2 ${
              computedStatus === 'Detected'
                ? 'text-red-500'
                : computedStatus === 'Warning'
                ? 'text-amber-500'
                : 'text-emerald-500'
            }`}
          >
            {computedStatus === 'Clear' ? <CheckCircle2 className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
            <span>{computedStatus}</span>
          </div>
          <span className="text-[11px] text-slate-400">Threshold: {warningThresholdCm} cm</span>
        </div>

        <div className="eg-card rounded-2xl p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex justify-between text-xs font-bold mb-1">
            <span>Warning Threshold</span>
            <span className="text-cyan-400">{warningThresholdCm} cm</span>
          </div>
          <input
            type="range"
            min="30"
            max="200"
            value={warningThresholdCm}
            onChange={(e) => setWarningThresholdCm(Number(e.target.value))}
            className="w-full accent-cyan-400 mt-2"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>30 cm</span>
            <span>100 cm</span>
            <span>200 cm</span>
          </div>
        </div>

        <div className="eg-card rounded-2xl p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-400">Sensor Connection</span>
          <div className="text-sm font-bold mt-1 text-teal-400">{sensorStatus}</div>
          <button
            type="button"
            onClick={() =>
              setSensorStatus((s) =>
                s.includes('Disconnected') ? 'Active Simulation (Demo)' : 'Sensor Disconnected (Simulated)'
              )
            }
            className="mt-2 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold"
          >
            Toggle Sensor Link State
          </button>
        </div>
      </div>

      {/* Ultrasonic Time-Series Chart */}
      <div className="eg-card rounded-3xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <h2 className="text-base font-bold mb-1">Ultrasonic Distance Readings Over Time (cm — Demo Telemetry)</h2>
        <p className="text-xs text-slate-400 mb-4">
          Dashed amber reference line marks your configured warning threshold ({warningThresholdCm} cm).
        </p>
        <div className="relative h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sensorReadings}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="time" stroke="#94A3B8" fontSize={11} />
              <YAxis stroke="#94A3B8" fontSize={11} domain={[0, 220]} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
              />
              <ReferenceLine y={warningThresholdCm} stroke="#F59E0B" strokeDasharray="4 4" label="Warning Threshold" />
              <Area type="monotone" dataKey="distanceCm" stroke="#22D3EE" fill="#22D3EE" fillOpacity={0.2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Known Obstacle Events & Troubleshooting */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="eg-card rounded-2xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <h2 className="text-base font-bold mb-3">Known Obstacle Events Along Corridors</h2>
          <div className="space-y-2.5">
            {knownObstacles.map((obs) => (
              <div
                key={obs.id}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-800 text-xs"
              >
                <div className="flex items-center justify-between font-bold">
                  <span>{obs.title}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] ${
                      obs.severity === 'High' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
                    }`}
                  >
                    {obs.severity}
                  </span>
                </div>
                <p className="text-slate-500 dark:text-slate-300 mt-1">{obs.description}</p>
                <div className="text-[10px] text-slate-400 mt-1">Source: {obs.source}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="eg-card rounded-2xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <h2 className="text-base font-bold flex items-center gap-2">
            <Wrench className="w-4 h-4 text-cyan-400" />
            <span>ESP32 Ultrasonic Sensor Troubleshooting</span>
          </h2>
          <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
              <strong>1. No Echo / Timeout (Reading 0 cm or &gt;400 cm):</strong> Verify 5V/3.3V level shifting on Trigger (GPIO 5) and Echo (GPIO 18) pins of the ESP32 module.
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
              <strong>2. Angled Surface Drop-Offs:</strong> Ultrasonic acoustic cones reflect away from steep downward steps or grates; always pair local sensor alerts with verified map curb-cut data.
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
              <strong>3. WebSocket Stream Reconnection:</strong> Ensure the wheelchair prototype Wi-Fi AP or local broker matches <code>VITE_ESP32_WS_URL</code>.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
