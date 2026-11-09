import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon, Type, Eye, Sparkles, Globe, Bell, Radar, LogOut, CheckCircle2 } from 'lucide-react';
import { useEasyGo } from '../context/EasyGoContext';

export default function SettingsAccessibility() {
  const {
    settings,
    setSettings,
    routePreference,
    setRoutePreference,
    warningThresholdCm,
    setWarningThresholdCm,
    logout,
    recordUsageEvent
  } = useEasyGo();

  const navigate = useNavigate();

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    recordUsageEvent('Setting Updated', 'Settings & Accessibility', `${key}: ${value}`);
  };

  return (
    <div className="space-y-6">
      <div className="eg-card rounded-3xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <h1 className="text-xl sm:text-2xl font-extrabold">Settings &amp; Accessibility</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Changes apply immediately across EASY GO and persist in non-sensitive local preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Visual & Display Accessibility */}
        <div className="eg-card rounded-2xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 text-xs">
          <h2 className="text-sm font-bold flex items-center gap-2">
            <Eye className="w-4 h-4 text-cyan-400" />
            <span>Visual &amp; Motion Accessibility</span>
          </h2>

          <div className="flex items-center justify-between">
            <span className="font-semibold">Color Theme</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => updateSetting('theme', 'light')}
                className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 ${
                  settings.theme === 'light' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800'
                }`}
              >
                <Sun className="w-3.5 h-3.5" /> Light
              </button>
              <button
                type="button"
                onClick={() => updateSetting('theme', 'dark')}
                className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 ${
                  settings.theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800'
                }`}
              >
                <Moon className="w-3.5 h-3.5" /> Dark
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-semibold flex items-center gap-1.5">
              <Type className="w-4 h-4 text-cyan-400" /> Font-Size Scale
            </span>
            <div className="flex gap-1.5">
              {['sm', 'md', 'lg', 'xl'].map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => updateSetting('fontSize', sz)}
                  className={`px-2.5 py-1 rounded-lg uppercase font-bold ${
                    settings.fontSize === sz ? 'bg-cyan-500 text-slate-950' : 'bg-slate-100 dark:bg-slate-800'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-center justify-between cursor-pointer">
            <span className="font-semibold">High-Contrast Mode (Strong Borders &amp; Contrast)</span>
            <input
              type="checkbox"
              checked={settings.highContrast}
              onChange={(e) => updateSetting('highContrast', e.target.checked)}
              className="accent-cyan-400 w-4 h-4"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <span className="font-semibold">Reduced-Motion Mode (Disable Wheel Spin &amp; Transitions)</span>
            <input
              type="checkbox"
              checked={settings.reducedMotion}
              onChange={(e) => updateSetting('reducedMotion', e.target.checked)}
              className="accent-cyan-400 w-4 h-4"
            />
          </label>
        </div>

        {/* Navigation, Sensor & Language Preferences */}
        <div className="eg-card rounded-2xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 text-xs">
          <h2 className="text-sm font-bold flex items-center gap-2">
            <Globe className="w-4 h-4 text-cyan-400" />
            <span>Navigation, Units &amp; Sensor Thresholds</span>
          </h2>

          <div className="flex items-center justify-between">
            <span className="font-semibold">Interface Language</span>
            <select
              value={settings.language}
              onChange={(e) => updateSetting('language', e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-700"
            >
              <option value="English">English</option>
              <option value="Tamil (தமிழ்)">Tamil (தமிழ்)</option>
              <option value="Hindi (हिन्दी)">Hindi (हिन्दी)</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-semibold">Distance Units</span>
            <div className="flex gap-1.5">
              {['km', 'miles'].map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => updateSetting('distanceUnit', u)}
                  className={`px-3 py-1 rounded-lg font-bold uppercase ${
                    settings.distanceUnit === u ? 'bg-cyan-500 text-slate-950' : 'bg-slate-100 dark:bg-slate-800'
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between font-semibold mb-1">
              <span>Ultrasonic Obstacle Warning Threshold</span>
              <span className="text-cyan-400">{warningThresholdCm} cm</span>
            </div>
            <input
              type="range"
              min="30"
              max="200"
              value={warningThresholdCm}
              onChange={(e) => setWarningThresholdCm(Number(e.target.value))}
              className="w-full accent-cyan-400"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Default Route Optimization Preference</label>
            <select
              value={routePreference}
              onChange={(e) => setRoutePreference(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-700"
            >
              <option value="verified_accessible">Prefer Verified Accessibility Information</option>
              <option value="fewer_obstacles">Prefer Fewer Known Obstacles</option>
              <option value="shortest_distance">Minimize Distance</option>
              <option value="fastest_time">Minimize Travel Time</option>
            </select>
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold"
            >
              Open Profile Settings
            </button>
            <button
              type="button"
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="px-3.5 py-2 rounded-xl bg-red-600 text-white font-bold flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
