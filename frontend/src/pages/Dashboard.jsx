import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Cpu,
  Accessibility,
  Radar,
  ShieldCheck,
  Search,
  AlertTriangle,
  Navigation,
  Clock,
  BatteryCharging,
  Heart,
  Activity,
  MapPin,
  Route,
  Gamepad2,
  BarChart3,
  ArrowUpRight
} from 'lucide-react';
import { useEasyGo } from '../context/EasyGoContext';

export default function Dashboard() {
  const {
    esp32Status,
    wheelchairStatus,
    sensorStatus,
    currentRoute,
    totalRouteSearches,
    knownObstacles,
    batteryLevel,
    favourites,
    lastSensorUpdate,
    startLocation,
    intermediateStops,
    destinationLocation,
    recentRoutes,
    sensorReadings,
    notifications
  } = useEasyGo();

  const navigate = useNavigate();
  const latestSensor = sensorReadings[sensorReadings.length - 1] || { distanceCm: 142, status: 'Clear' };
  const score = currentRoute?.scoringDetails?.overallScore ?? 86;

  const summaryCards = [
    { label: 'ESP32 Controller', value: esp32Status, sub: 'ws://192.168.4.1:81', icon: Cpu, accent: 'text-cyan-500' },
    { label: 'Wheelchair Prototype', value: wheelchairStatus, sub: 'Safe Standby', icon: Accessibility, accent: 'text-blue-500' },
    { label: 'Ultrasonic Sensor', value: `${latestSensor.distanceCm} cm (${latestSensor.status})`, sub: sensorStatus, icon: Radar, accent: 'text-teal-500' },
    { label: 'Accessibility Score', value: `${score} / 100`, sub: currentRoute?.scoringDetails?.confidenceLabel || 'Explainable Score', icon: ShieldCheck, accent: 'text-emerald-500' },
    { label: 'Total Route Searches', value: `${totalRouteSearches}`, sub: 'Session + Demo History', icon: Search, accent: 'text-blue-500' },
    { label: 'Known Obstacles', value: `${knownObstacles.length} Active`, sub: '2 Verified • 2 Reported', icon: AlertTriangle, accent: 'text-amber-500' },
    { label: 'Current Journey Distance', value: `${currentRoute?.distanceKm ?? 2.4} km`, sub: `${intermediateStops.length} intermediate stop(s)`, icon: Navigation, accent: 'text-cyan-500' },
    { label: 'Estimated Travel Time', value: `${currentRoute?.durationMin ?? 18} mins`, sub: 'At ~6.6 km/h cruise', icon: Clock, accent: 'text-teal-500' },
    { label: 'Battery Level (Demo)', value: `${batteryLevel}%`, sub: '24V LiFePO4 Pack (Sim)', icon: BatteryCharging, accent: 'text-emerald-500' },
    { label: 'Saved Favourite Places', value: `${favourites.length} Places`, sub: 'Home, Hospital, College...', icon: Heart, accent: 'text-rose-500' },
    { label: 'Last Sensor Update', value: lastSensorUpdate, sub: 'Ultrasonic Echo Poll', icon: Activity, accent: 'text-indigo-500' }
  ];

  const quickActions = [
    { label: 'Plan an Accessible Route', path: '/route-planner', icon: Route, primary: true },
    { label: 'Open Interactive Map', path: '/interactive-map', icon: MapPin },
    { label: 'Remote Control', path: '/remote-control', icon: Gamepad2 },
    { label: 'Obstacle Detection', path: '/obstacle-detection', icon: Radar },
    { label: 'Favourite Places', path: '/favourite-places', icon: Heart },
    { label: 'Analytics and Reports', path: '/analytics-reports', icon: BarChart3 }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="eg-card rounded-3xl p-6 bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white border border-slate-800 shadow-xl flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-xs font-semibold mb-2">
            <span>Smart Mobility Command Center • Demo Telemetry Active</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Accessible Routes. Independent Journeys.
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Synchronized multi-stop wheelchair route planning, explainable 0–100 accessibility scoring, and ESP32 ultrasonic obstacle telemetry (strictly zero camera input).
          </p>
        </div>

        {/* Quick Actions Bar */}
        <div className="flex flex-wrap gap-2">
          {quickActions.map((act) => {
            const Icon = act.icon;
            return (
              <button
                key={act.path}
                type="button"
                onClick={() => navigate(act.path)}
                className={`inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  act.primary
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-600/25'
                    : 'bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{act.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 11 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-3.5">
        {summaryCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="eg-card rounded-2xl p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-start justify-between"
            >
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{card.label}</p>
                <p className="text-lg font-extrabold mt-1">{card.value}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{card.sub}</p>
              </div>
              <div className={`p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 ${card.accent}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Layout: Prominent Interactive Route Corridor Canvas + Side Telemetry */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Prominent Map & Route Visual Card (2 columns wide) */}
        <div className="xl:col-span-2 eg-card rounded-3xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div>
              <h2 className="text-lg font-bold">Active Multi-Stop Accessible Corridor</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Synchronized with Interactive Map &amp; Route Planner ({intermediateStops.length} intermediate stop{intermediateStops.length === 1 ? '' : 's'})
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/interactive-map')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-500"
            >
              <span>Expand Full Interactive Map</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Interactive SVG Corridor Preview */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-[#0D1829] h-80 p-4 flex flex-col justify-between">
            <svg className="w-full h-full absolute inset-0" viewBox="0 0 800 320" preserveAspectRatio="none">
              <defs>
                <pattern id="dashGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1E293B" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="800" height="320" fill="url(#dashGrid)" />
              {/* Urban Road Network Background */}
              <path d="M 40 260 Q 240 220 400 170 T 740 70" stroke="#334155" strokeWidth="14" fill="none" strokeLinecap="round" />
              <path d="M 90 60 Q 300 140 420 180 T 710 250" stroke="#1E293B" strokeWidth="10" fill="none" />
              {/* Highlighted Accessible Route Polyline */}
              <path
                d="M 90 245 C 210 230, 280 150, 410 155 C 530 160, 610 95, 710 80"
                stroke="#22D3EE"
                strokeWidth="6"
                fill="none"
                strokeDasharray="10 5"
              />
              {/* Start Marker (Green) */}
              <circle cx="90" cy="245" r="11" fill="#16A34A" stroke="#FFFFFF" strokeWidth="3" />
              {/* Stop Marker (Orange) */}
              <circle cx="410" cy="155" r="10" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="3" />
              {/* Known Obstacle Warning Marker */}
              <circle cx="340" cy="205" r="9" fill="#DC2626" stroke="#FFFFFF" strokeWidth="2" />
              {/* Destination Marker (Red) */}
              <circle cx="710" cy="80" r="11" fill="#DC2626" stroke="#FFFFFF" strokeWidth="3" />
            </svg>

            <div className="relative z-10 flex flex-wrap items-center justify-between gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-700 text-[11px] text-cyan-300 font-semibold">
                {currentRoute?.name || 'Route A — Accessible Priority Corridor (Demo Route)'}
              </span>
              <div className="flex items-center gap-3 px-3 py-1 rounded-lg bg-slate-900/90 border border-slate-700 text-[11px] text-slate-200">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Start</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Stop ({intermediateStops.length})</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block" /> Destination</span>
              </div>
            </div>

            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-2 bg-slate-900/90 border border-slate-800 p-3 rounded-xl text-xs text-slate-200">
              <div>
                <span className="text-[10px] uppercase text-emerald-400 font-bold block">Starting Point</span>
                <span className="font-semibold truncate block">{startLocation?.name || 'Not selected'}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-amber-400 font-bold block">
                  Intermediate Stops ({intermediateStops.length})
                </span>
                <span className="font-semibold truncate block">
                  {intermediateStops.length > 0 ? intermediateStops.map((s) => s.name).join(', ') : 'Direct (No Stops)'}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-rose-400 font-bold block">Final Destination</span>
                <span className="font-semibold truncate block">{destinationLocation?.name || 'Not selected'}</span>
              </div>
            </div>
          </div>

          {/* Recent Routes List */}
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
              Recent Accessible Route Calculations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
              {recentRoutes.slice(0, 3).map((rt) => (
                <div
                  key={rt.id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs"
                >
                  <div className="font-semibold truncate mb-1">{rt.name}</div>
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                    <span>{rt.distanceKm} km • {rt.durationMin}m</span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 font-bold">
                      Score {rt.accessibilityScore}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Explainable Score Snapshot + Notifications */}
        <div className="space-y-6">
          <div className="eg-card rounded-3xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold">Accessibility Score Breakdown</h2>
              <span className="px-2.5 py-1 rounded-xl text-xs font-extrabold bg-emerald-500/15 text-emerald-600 dark:text-emerald-300">
                {score} / 100
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              {currentRoute?.scoringDetails?.confidenceLabel || 'Evidence-based evaluation. Missing data is labeled Unknown.'}
            </p>
            <div className="space-y-2.5">
              {(currentRoute?.scoringDetails?.breakdown || []).map((item, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-xs">
                  <div className="flex items-center justify-between font-semibold">
                    <span>{item.factor}</span>
                    <span className="text-cyan-600 dark:text-cyan-300">
                      {item.status} ({item.points}/{item.maxPoints})
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{item.explanation}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="eg-card rounded-3xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h2 className="text-base font-bold mb-3">Recent System Notifications</h2>
            <div className="space-y-2">
              {notifications.slice(0, 3).map((n) => (
                <div
                  key={n.id}
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-xs"
                >
                  <div className="flex justify-between font-semibold">
                    <span>{n.title}</span>
                    <span className="text-[10px] text-slate-400">{n.timestamp}</span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 mt-0.5">{n.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
