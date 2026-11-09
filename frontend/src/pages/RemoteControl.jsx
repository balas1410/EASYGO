import React, { useState } from 'react';
import {
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Octagon,
  Square,
  BatteryCharging,
  Cpu,
  ShieldAlert,
  WifiOff,
  Gauge
} from 'lucide-react';
import { useEasyGo } from '../context/EasyGoContext';
import { wheelchairService } from '../services/wheelchairService';

export default function RemoteControl() {
  const {
    esp32Status,
    setEsp32Status,
    wheelchairStatus,
    setWheelchairStatus,
    batteryLevel,
    wheelchairSpeed,
    setWheelchairSpeed,
    movementDirection,
    setMovementDirection,
    commandHistory,
    setCommandHistory,
    recordUsageEvent,
    addNotification
  } = useEasyGo();

  const [hardwareConnected, setHardwareConnected] = useState(false);
  const [esp32BaseUrl, setEsp32BaseUrl] = useState('http://192.168.1.50');
  const [connectionMessage, setConnectionMessage] = useState('Enter the ESP32 IP shown in Arduino Serial Monitor.');
  const [sending, setSending] = useState(false);

  const isDisconnected = esp32Status === 'Disconnected';

  const triggerCommand = async (cmdLabel) => {
    if (isDisconnected && cmdLabel !== 'Stop' && cmdLabel !== 'Emergency Stop') {
      return;
    }
    setSending(true);
    try {
      const res = await wheelchairService.sendCommand({
        command: cmdLabel,
        speedLevel: wheelchairSpeed,
        hardwareConnected,
        esp32BaseUrl
      });
      setMovementDirection(cmdLabel === 'Stop' || cmdLabel === 'Emergency Stop' ? 'Stopped' : `${cmdLabel} (Command sent)`);
      setWheelchairStatus(
        cmdLabel === 'Emergency Stop'
          ? 'Emergency Halt Engaged (Demo)'
          : cmdLabel === 'Stop'
          ? 'Stop command sent (prototype test)'
          : `Command sent: ${cmdLabel} (prototype test)`
      );
      setCommandHistory((prev) => [res, ...prev.slice(0, 19)]);
      setConnectionMessage(res.statusMessage);
      recordUsageEvent('Remote Command', 'Remote Control', `${cmdLabel} (Speed ${wheelchairSpeed})`);

      if (cmdLabel === 'Emergency Stop') {
        addNotification({
          type: 'esp32_status',
          title: 'Emergency Stop Triggered (Demo)',
          message: 'All simulated propulsion commands halted immediately.'
        });
      }
    } catch (error) {
      setConnectionMessage(error.message || 'ESP32 command failed');
      addNotification({ type: 'esp32_status', title: 'ESP32 command failed', message: error.message || 'Check ESP32 IP and local backend connection.' });
    } finally {
      setSending(false);
    }
  };

  const toggleConnectionState = () => {
    if (esp32Status === 'Disconnected') {
      setEsp32Status('Connected (LAN test)');
      setHardwareConnected(true);
      setWheelchairStatus('Standby (prototype test)');
    } else {
      setEsp32Status('Disconnected');
      setHardwareConnected(false);
      setWheelchairStatus('Safe Lockout — Disconnected');
      setMovementDirection('Stopped');
    }
  };

  return (
    <div className="space-y-6">
      {/* Safety Disclaimer Banner */}
      <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-xs text-amber-700 dark:text-amber-300 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
        <div>
          <span className="font-extrabold uppercase tracking-wider block mb-0.5">
            Demo Mode &amp; Hardware Safety Notice
          </span>
          This remote-control interface is designed for an ESP32-based wheelchair prototype and is <strong>not a safety-certified medical wheelchair control system</strong>. Physical movement is never reported as confirmed unless acknowledged by a connected ESP32 controller. Currently running in <strong>{esp32Status}</strong>.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Directional Pad & Emergency Stop (2 cols) */}
        <div className="lg:col-span-2 eg-card rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-extrabold">ESP32 Wheelchair Prototype Remote Control</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Directional commands automatically disable if the ESP32 link enters a disconnected state.
              </p>
            </div>
            <button
              type="button"
              onClick={toggleConnectionState}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border ${
                isDisconnected
                  ? 'bg-emerald-600 text-white border-emerald-500'
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700'
              }`}
            >
              <WifiOff className="w-3.5 h-3.5" />
              <span>{isDisconnected ? 'Reconnect Demo ESP32' : 'Simulate Connection Loss'}</span>
            </button>
          </div>

          {isDisconnected && (
            <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/40 text-xs text-red-400 font-semibold">
              ESP32 Disconnected: Unsafe directional movement commands are locked out. Reconnect or use Emergency Stop.
            </div>
          )}

          <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 space-y-3">
            <div className="text-sm font-bold">Local ESP32 Wi-Fi Connection (command test only)</div>
            <div className="flex flex-col sm:flex-row gap-2">
              <input aria-label="ESP32 base URL" value={esp32BaseUrl} onChange={(e) => setEsp32BaseUrl(e.target.value)} placeholder="http://192.168.1.50" className="flex-1 min-w-0 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm" />
              <button type="button" onClick={() => { setHardwareConnected(true); setEsp32Status('Connected (LAN test)'); setConnectionMessage('ESP32 address saved. Use STOP first to test the connection.'); }} className="px-4 py-2 rounded-xl bg-cyan-600 text-white text-xs font-bold">Use ESP32 IP</button>
            </div>
            <p className="text-xs text-slate-500">{connectionMessage}</p>
            <p className="text-[11px] text-amber-600 dark:text-amber-300">The backend must run on the same Wi-Fi/LAN as the ESP32. Commands are logged by the test firmware only; no motor output is enabled.</p>
          </div>

          {/* Directional Control Pad */}
          <div className="flex flex-col items-center justify-center py-4 space-y-3">
            <button
              type="button"
              disabled={isDisconnected || sending}
              onClick={() => triggerCommand('Forward')}
              className="w-28 h-24 rounded-2xl bg-gradient-to-b from-blue-600 to-cyan-500 text-white font-bold flex flex-col items-center justify-center gap-1 shadow-lg disabled:opacity-35 active:scale-95 transition"
            >
              <ArrowUp className="w-7 h-7" />
              <span className="text-xs">Forward</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={isDisconnected || sending}
                onClick={() => triggerCommand('Left')}
                className="w-28 h-24 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold flex flex-col items-center justify-center gap-1 border border-slate-700 disabled:opacity-35 active:scale-95 transition"
              >
                <ArrowLeft className="w-7 h-7 text-cyan-400" />
                <span className="text-xs">Left</span>
              </button>

              <button
                type="button"
                onClick={() => triggerCommand('Stop')}
                className="w-28 h-24 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold flex flex-col items-center justify-center gap-1 shadow-md active:scale-95 transition"
              >
                <Square className="w-6 h-6 fill-current" />
                <span className="text-xs">Stop</span>
              </button>

              <button
                type="button"
                disabled={isDisconnected || sending}
                onClick={() => triggerCommand('Right')}
                className="w-28 h-24 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold flex flex-col items-center justify-center gap-1 border border-slate-700 disabled:opacity-35 active:scale-95 transition"
              >
                <ArrowRight className="w-7 h-7 text-cyan-400" />
                <span className="text-xs">Right</span>
              </button>
            </div>

            <button
              type="button"
              disabled={isDisconnected || sending}
              onClick={() => triggerCommand('Backward')}
              className="w-28 h-24 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold flex flex-col items-center justify-center gap-1 border border-slate-700 disabled:opacity-35 active:scale-95 transition"
            >
              <ArrowDown className="w-7 h-7 text-cyan-400" />
              <span className="text-xs">Backward</span>
            </button>
          </div>

          {/* Speed Slider & Emergency Stop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70">
              <div className="flex items-center justify-between text-xs font-bold mb-2">
                <span className="flex items-center gap-1.5">
                  <Gauge className="w-4 h-4 text-cyan-500" />
                  <span>PWM Speed Limit</span>
                </span>
                <span className="text-cyan-500">Level {wheelchairSpeed} / 5</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={wheelchairSpeed}
                onChange={(e) => setWheelchairSpeed(Number(e.target.value))}
                className="w-full accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>1 (Indoor Creep)</span>
                <span>3 (Standard)</span>
                <span>5 (Max Prototype)</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => triggerCommand('Emergency Stop')}
              className="p-4 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-extrabold flex items-center justify-center gap-3 shadow-lg shadow-red-600/30 active:scale-95 transition"
            >
              <Octagon className="w-7 h-7" />
              <div className="text-left">
                <div className="text-sm uppercase tracking-wider">EMERGENCY STOP</div>
                <div className="text-[11px] font-normal opacity-90">Immediate Motor Disengage</div>
              </div>
            </button>
          </div>
        </div>

        {/* Status Cards & Command History */}
        <div className="space-y-4">
          <div className="eg-card rounded-2xl p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
            <h2 className="text-sm font-bold">Hardware &amp; Telemetry Status</h2>
            <div className="flex justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
              <span className="text-slate-400 flex items-center gap-1.5"><Cpu className="w-4 h-4 text-cyan-400" /> ESP32 Link</span>
              <span className="font-bold">{esp32Status}</span>
            </div>
            <div className="flex justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
              <span className="text-slate-400">Wheelchair State</span>
              <span className="font-bold text-cyan-400">{wheelchairStatus}</span>
            </div>
            <div className="flex justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
              <span className="text-slate-400">Active Vector</span>
              <span className="font-bold">{movementDirection}</span>
            </div>
            <div className="flex justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
              <span className="text-slate-400 flex items-center gap-1.5"><BatteryCharging className="w-4 h-4 text-emerald-400" /> Battery (Simulated)</span>
              <span className="font-bold text-emerald-400">{batteryLevel}%</span>
            </div>
            <div className="flex justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
              <span className="text-slate-400">Last Command Timestamp</span>
              <span className="font-bold">{commandHistory[0]?.timestamp || 'None'}</span>
            </div>
          </div>

          <div className="eg-card rounded-2xl p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <h2 className="text-sm font-bold mb-2.5">Command History Log</h2>
            <div className="space-y-2 max-h-72 overflow-y-auto text-xs">
              {commandHistory.map((item) => (
                <div
                  key={item.id}
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-800"
                >
                  <div className="flex justify-between font-bold">
                    <span className="text-cyan-400">{item.command} (Speed {item.speedLevel})</span>
                    <span className="text-[10px] text-slate-400">{item.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{item.statusMessage}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
