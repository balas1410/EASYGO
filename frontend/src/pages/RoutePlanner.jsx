import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Route,
  Repeat,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  ShieldCheck,
  AlertTriangle,
  Heart,
  Sliders,
  Map
} from 'lucide-react';
import { useEasyGo } from '../context/EasyGoContext';

export default function RoutePlanner() {
  const {
    startLocation,
    setStartLocation,
    intermediateStops,
    destinationLocation,
    setDestinationLocation,
    routePreference,
    setRoutePreference,
    scoringWeights,
    setScoringWeights,
    currentRoute,
    setCurrentRoute,
    routeAlternatives,
    isCalculatingRoute,
    runRouteCalculation,
    addStop,
    removeStop,
    moveStop,
    swapStartAndDestination,
    clearAllLocations,
    favourites
  } = useEasyGo();

  const navigate = useNavigate();

  const handleWeightChange = (key, val) => {
    const next = { ...scoringWeights, [key]: Number(val) };
    setScoringWeights(next);
  };

  return (
    <div className="space-y-6">
      <div className="eg-card rounded-3xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold">Accessible Route Planner &amp; Explainable Scoring</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Synchronized with the Interactive Map. Configure route optimization preferences and inspect transparent 0–100 accessibility evidence.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/interactive-map')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-blue-600 text-white"
        >
          <Map className="w-4 h-4" />
          <span>View on Interactive Map</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: Waypoints & Favourite Places Quick Picker */}
        <div className="space-y-4">
          <div className="eg-card rounded-2xl p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold">Route Waypoints</h2>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={swapStartAndDestination}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-semibold flex items-center gap-1"
                >
                  <Repeat className="w-3 h-3" /> Swap
                </button>
                <button
                  type="button"
                  onClick={clearAllLocations}
                  className="px-2.5 py-1 rounded-lg bg-red-500/15 text-red-500 text-xs font-semibold"
                >
                  Clear Route
                </button>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs">
              <div className="font-bold text-emerald-500">Starting Point</div>
              <div className="font-semibold mt-0.5">{startLocation?.name || 'None selected'}</div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-bold text-amber-500">
                Intermediate Stops ({intermediateStops.length})
              </div>
              {intermediateStops.map((st, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs flex items-center justify-between"
                >
                  <span className="font-semibold truncate">
                    Stop {idx + 1}: {st.name}
                  </span>
                  <div className="flex gap-1">
                    <button type="button" onClick={() => moveStop(idx, -1)} className="p-1 rounded bg-slate-800 text-white">
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button type="button" onClick={() => moveStop(idx, 1)} className="p-1 rounded bg-slate-800 text-white">
                      <ArrowDown className="w-3 h-3" />
                    </button>
                    <button type="button" onClick={() => removeStop(idx)} className="p-1 rounded bg-red-600 text-white">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs">
              <div className="font-bold text-red-500">Destination</div>
              <div className="font-semibold mt-0.5">{destinationLocation?.name || 'None selected'}</div>
            </div>

            {/* Route Preferences */}
            <div>
              <label className="block text-xs font-bold mb-1.5">Optimization Preference</label>
              <select
                value={routePreference}
                onChange={(e) => {
                  setRoutePreference(e.target.value);
                  runRouteCalculation({ preference: e.target.value });
                }}
                className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-semibold"
              >
                <option value="verified_accessible">Prefer Verified Accessibility Information</option>
                <option value="fewer_obstacles">Prefer Fewer Known Obstacles</option>
                <option value="shortest_distance">Minimize Distance</option>
                <option value="fastest_time">Minimize Travel Time</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => runRouteCalculation()}
              disabled={isCalculatingRoute}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-xs shadow"
            >
              {isCalculatingRoute ? 'Recalculating...' : 'Find Accessible Route'}
            </button>
          </div>

          {/* Favourite Places Selector */}
          <div className="eg-card rounded-2xl p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-xs font-bold mb-3">
              <Heart className="w-4 h-4 text-rose-500" />
              <span>Quick Assign from Saved Favourite Places</span>
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {favourites.map((fav) => (
                <div
                  key={fav.id}
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between gap-2"
                >
                  <div className="truncate font-semibold">{fav.name}</div>
                  <div className="flex gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setStartLocation(fav);
                        runRouteCalculation({ start: fav });
                      }}
                      className="px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-bold"
                    >
                      Start
                    </button>
                    <button
                      type="button"
                      onClick={() => addStop(fav)}
                      className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 text-[10px] font-bold"
                    >
                      +Stop
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDestinationLocation(fav);
                        runRouteCalculation({ destination: fav });
                      }}
                      className="px-2 py-0.5 rounded bg-red-600 text-white text-[10px] font-bold"
                    >
                      Dest
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Column 2 & 3: Explainable Accessibility Score & Route Alternatives */}
        <div className="lg:col-span-2 space-y-4">
          {currentRoute && (
            <div className="eg-card rounded-3xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-bold uppercase text-cyan-500">{currentRoute.routingSource}</span>
                  <h2 className="text-lg font-extrabold">{currentRoute.name}</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{currentRoute.summary}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-extrabold text-emerald-500">
                    {currentRoute.scoringDetails.overallScore} <span className="text-sm font-normal">/ 100</span>
                  </div>
                  <div className="text-[11px] font-semibold text-slate-400">
                    {currentRoute.distanceKm} km • {currentRoute.durationMin} mins
                  </div>
                </div>
              </div>

              {/* Explainable Breakdown Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400">
                      <th className="py-2 pr-3">Accessibility Factor</th>
                      <th className="py-2 px-3">Status</th>
                      <th className="py-2 px-3">Evidence Source</th>
                      <th className="py-2 px-3">Score Contribution</th>
                      <th className="py-2 pl-3">Explanation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {currentRoute.scoringDetails.breakdown.map((row, idx) => (
                      <tr key={idx}>
                        <td className="py-2.5 pr-3 font-bold">{row.factor}</td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`px-2 py-0.5 rounded font-semibold ${
                              row.status === 'Unknown' || row.status === 'Unavailable'
                                ? 'bg-amber-500/15 text-amber-500'
                                : 'bg-cyan-500/15 text-cyan-500'
                            }`}
                          >
                            {row.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-400">{row.evidenceType}</td>
                        <td className="py-2.5 px-3 font-bold">
                          {row.points} / {row.maxPoints} pts
                        </td>
                        <td className="py-2.5 pl-3 text-slate-500 dark:text-slate-300">{row.explanation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-600 dark:text-amber-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>
                  Transparency Guarantee: Missing surface or slope data is explicitly marked as <strong>Unknown / Unavailable</strong> and is never interpreted as proof that a route is fully wheelchair-accessible.
                </span>
              </div>
            </div>
          )}

          {/* Configurable Scoring Weights */}
          <div className="eg-card rounded-2xl p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-sm font-bold">
                <Sliders className="w-4 h-4 text-cyan-500" />
                <span>Configurable Scoring Factor Weights</span>
              </div>
              <button
                type="button"
                onClick={() => runRouteCalculation()}
                className="px-3 py-1 rounded-lg bg-cyan-500/15 text-cyan-500 text-xs font-bold"
              >
                Apply &amp; Recalculate
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
              {Object.entries(scoringWeights).map(([key, val]) => (
                <div key={key} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
                  <div className="flex justify-between font-semibold capitalize mb-1">
                    <span>{key}</span>
                    <span>{val} pts</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    value={val}
                    onChange={(e) => handleWeightChange(key, e.target.value)}
                    className="w-full accent-cyan-400"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Candidate Alternatives */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {routeAlternatives.map((alt) => (
              <div
                key={alt.id}
                onClick={() => setCurrentRoute(alt)}
                className={`p-4 rounded-2xl border cursor-pointer transition ${
                  currentRoute?.id === alt.id
                    ? 'border-cyan-400 bg-blue-600/10'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                }`}
              >
                <div className="flex justify-between items-center text-xs font-bold mb-1">
                  <span className="text-cyan-400">{alt.badge}</span>
                  <span>{alt.scoringDetails.overallScore}/100</span>
                </div>
                <div className="font-bold text-sm">{alt.name}</div>
                <div className="text-xs text-slate-400 mt-1">
                  {alt.distanceKm} km • {alt.durationMin} mins
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
