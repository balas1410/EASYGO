import React, { useState } from 'react';
import { Sparkles, CheckCircle2, AlertTriangle, Route, ShieldCheck, ArrowRight } from 'lucide-react';
import { useEasyGo } from '../context/EasyGoContext';

export default function AIPathDetection() {
  const {
    startLocation,
    intermediateStops,
    destinationLocation,
    currentRoute,
    setCurrentRoute,
    routeAlternatives,
    runRouteCalculation
  } = useEasyGo();

  const [analysisStatus, setAnalysisStatus] = useState('Completed Rule-Based Evaluation (Demo Mode)');
  const [reanalyzing, setReanalyzing] = useState(false);

  const handleRunAnalysis = async () => {
    setReanalyzing(true);
    setAnalysisStatus('Evaluating waypoint continuity, curb ramps, and ultrasonic obstacle logs (Demo)...');
    await runRouteCalculation();
    setTimeout(() => {
      setReanalyzing(false);
      setAnalysisStatus('Completed Rule-Based Evaluation (Demo Mode — No External AI Model Claimed)');
    }, 450);
  };

  return (
    <div className="space-y-6">
      <div className="eg-card rounded-3xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Transparent Rule-Based Route Feasibility Engine (Demo Mode — Zero Camera Input)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold">AI-Assisted Path Detection &amp; Route Comparison</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Compares candidate multi-stop corridors using GIS continuity, reported barriers, and ultrasonic obstacle logs. Prepared for future ML routing backend integration.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRunAnalysis}
          disabled={reanalyzing}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-bold shadow"
        >
          {reanalyzing ? 'Analyzing Corridors...' : 'Re-Run Path Feasibility Analysis'}
        </button>
      </div>

      {/* Active Waypoint Chain Summary */}
      <div className="eg-card rounded-2xl p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 font-bold">
            Start: {startLocation?.name || 'Unset'}
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="px-2.5 py-1 rounded-lg bg-amber-500/15 text-amber-400 font-bold">
            {intermediateStops.length} Intermediate Stop(s)
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="px-2.5 py-1 rounded-lg bg-red-500/15 text-red-400 font-bold">
            Destination: {destinationLocation?.name || 'Unset'}
          </span>
        </div>
        <span className="text-slate-400 font-medium">Status: {analysisStatus}</span>
      </div>

      {/* Preferred Route Explanation */}
      {currentRoute && (
        <div className="eg-card rounded-3xl p-5 bg-gradient-to-br from-slate-900 via-blue-950/40 to-slate-900 border border-cyan-500/40 text-white space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold">
              Preferred Corridor Explanation (Rule-Based Demo)
            </span>
            <span className="text-xl font-extrabold text-emerald-400">
              Score: {currentRoute.scoringDetails.overallScore} / 100
            </span>
          </div>
          <h2 className="text-lg font-bold">{currentRoute.name}</h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Why this path is preferred: {currentRoute.summary} It records{' '}
            <strong>{currentRoute.obstaclesOnRoute.length} active high-severity obstacles</strong> and provides{' '}
            <strong>{currentRoute.scoringDetails.confidenceLabel}</strong> across {currentRoute.distanceKm} km ({currentRoute.durationMin} mins estimated travel time).
          </p>
        </div>
      )}

      {/* Candidate Route Comparison Table */}
      <div className="eg-card rounded-3xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-x-auto">
        <h2 className="text-base font-bold mb-3">Candidate Path Comparison Matrix</h2>
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400">
              <th className="py-2.5 pr-3">Candidate Path</th>
              <th className="py-2.5 px-3">Distance / Time</th>
              <th className="py-2.5 px-3">Accessibility Score</th>
              <th className="py-2.5 px-3">Known Obstacles</th>
              <th className="py-2.5 px-3">Route Feasibility</th>
              <th className="py-2.5 pl-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {routeAlternatives.map((alt) => {
              const score = alt.scoringDetails.overallScore;
              const feasibility =
                score >= 80
                  ? 'Feasible (Verified Ramps)'
                  : score >= 65
                  ? 'Conditional (Contains Unknowns / Lip)'
                  : 'Not Recommended (72cm Pinch Point)';
              return (
                <tr key={alt.id}>
                  <td className="py-3 pr-3 font-bold">{alt.name}</td>
                  <td className="py-3 px-3">
                    {alt.distanceKm} km • {alt.durationMin} mins
                  </td>
                  <td className="py-3 px-3 font-extrabold text-cyan-400">{score} / 100</td>
                  <td className="py-3 px-3">{alt.obstaclesOnRoute.length} reported</td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded font-semibold ${
                        score >= 80
                          ? 'bg-emerald-500/15 text-emerald-400'
                          : score >= 65
                          ? 'bg-amber-500/15 text-amber-400'
                          : 'bg-red-500/15 text-red-400'
                      }`}
                    >
                      {feasibility}
                    </span>
                  </td>
                  <td className="py-3 pl-3">
                    <button
                      type="button"
                      onClick={() => setCurrentRoute(alt)}
                      className={`px-3 py-1 rounded-lg font-bold ${
                        currentRoute?.id === alt.id
                          ? 'bg-cyan-500 text-slate-950'
                          : 'bg-slate-100 dark:bg-slate-800'
                      }`}
                    >
                      {currentRoute?.id === alt.id ? 'Selected' : 'Select Path'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
