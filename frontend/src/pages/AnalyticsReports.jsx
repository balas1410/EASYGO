import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { Download, Printer, Search, ArrowUpDown, ShieldCheck, Calendar } from 'lucide-react';
import { useEasyGo } from '../context/EasyGoContext';
import { MODULE_USAGE_DATA, SCORE_DISTRIBUTION_DATA } from '../data/demoData';
import { reportService } from '../services/reportService';

export default function AnalyticsReports() {
  const {
    currentUser,
    analyticsRange,
    setAnalyticsRange,
    ANALYTICS_DEMO_DATASET,
    activityLogs,
    favourites
  } = useEasyGo();

  const [customStart, setCustomStart] = useState('2026-10-01');
  const [customEnd, setCustomEnd] = useState('2026-10-24');
  const [tableSearch, setTableSearch] = useState('');
  const [sortAsc, setSortAsc] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const activeBundle = ANALYTICS_DEMO_DATASET[analyticsRange] || ANALYTICS_DEMO_DATASET['7d'];
  const summary = activeBundle.summary;
  const series = activeBundle.dailySeries;

  const filteredLogs = useMemo(() => {
    const q = tableSearch.trim().toLowerCase();
    const list = activityLogs.filter(
      (item) =>
        item.activityType.toLowerCase().includes(q) ||
        item.module.toLowerCase().includes(q) ||
        item.result.toLowerCase().includes(q) ||
        item.userHash.toLowerCase().includes(q)
    );
    return [...list].sort((a, b) =>
      sortAsc ? a.timestamp.localeCompare(b.timestamp) : b.timestamp.localeCompare(a.timestamp)
    );
  }, [activityLogs, tableSearch, sortAsc]);

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / pageSize));
  const paginatedLogs = filteredLogs.slice((page - 1) * pageSize, page * pageSize);

  const handleExportCsv = () => {
    const csv = reportService.generateCsvContent({
      rangeLabel: analyticsRange === 'custom' ? `${customStart} to ${customEnd}` : analyticsRange,
      summary,
      activityLogs: filteredLogs
    });
    reportService.triggerCsvDownload(csv);
  };

  const handlePrintReport = () => {
    window.print();
  };

  if (currentUser?.role !== 'admin') {
    return (
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-amber-500/40 text-center max-w-xl mx-auto mt-8">
        <h1 className="text-xl font-bold text-amber-400 mb-2">Administrator Access Required</h1>
        <p className="text-xs text-slate-400">
          Only authorized administrators can access system-wide usage reports so regular users never see other users&apos; activity records. Switch your Demo Role to Administrator in the User Profile page to view full analytics.
        </p>
      </div>
    );
  }

  const summaryCards = [
    { label: 'Total Registered Users', value: summary.totalUsers },
    { label: 'Active Users', value: summary.activeUsers },
    { label: 'Login Sessions', value: summary.loginSessions },
    { label: 'Route Searches', value: summary.routeSearches },
    { label: 'Successful Route Calcs', value: summary.successfulRoutes },
    { label: 'Failed Route Calcs', value: summary.failedRoutes },
    { label: 'Avg Accessibility Score', value: `${summary.avgAccessibilityScore} / 100` },
    { label: 'Obstacle Events', value: summary.obstacleEvents },
    { label: 'Remote-Control Commands', value: summary.remoteCommands },
    { label: 'Total Journey Distance', value: `${summary.totalDistanceKm} km` },
    { label: 'Avg Session Duration', value: `${summary.avgSessionMin} mins` },
    { label: 'Most-Used Module', value: summary.mostUsedModule },
    { label: 'Favourite Places Saved', value: Math.max(summary.favouritesSaved, favourites.length) }
  ];

  return (
    <div className="space-y-6">
      {/* Header & Date Filter Controls */}
      <div className="eg-card rounded-3xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase text-cyan-400">
            Admin Usage Telemetry • Clearly Labeled Demo Analytics + Live Session Events
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold">Usage Analytics &amp; Accessibility Reports</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Report Generated: {new Date().toLocaleString()} • Privacy-safe anonymized identifiers enforced.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 no-print">
          {[
            { id: 'today', label: 'Today' },
            { id: '7d', label: 'Last 7 Days' },
            { id: '30d', label: 'Last 30 Days' },
            { id: 'custom', label: 'Custom Date Range' }
          ].map((btn) => (
            <button
              key={btn.id}
              type="button"
              onClick={() => setAnalyticsRange(btn.id)}
              className={`px-3 py-2 rounded-xl text-xs font-bold border ${
                analyticsRange === btn.id
                  ? 'bg-blue-600 text-white border-blue-500'
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700'
              }`}
            >
              {btn.label}
            </button>
          ))}

          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={handlePrintReport}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF Report</span>
          </button>
        </div>
      </div>

      {analyticsRange === 'custom' && (
        <div className="eg-card rounded-2xl p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-3 text-xs no-print">
          <Calendar className="w-4 h-4 text-cyan-400" />
          <span className="font-bold">Custom Filter Window:</span>
          <input
            type="date"
            value={customStart}
            onChange={(e) => setCustomStart(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-700"
          />
          <span>to</span>
          <input
            type="date"
            value={customEnd}
            onChange={(e) => setCustomEnd(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-700"
          />
        </div>
      )}

      {/* 13 Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {summaryCards.map((c, idx) => (
          <div
            key={idx}
            className="eg-card rounded-2xl p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
          >
            <div className="text-[11px] text-slate-400">{c.label}</div>
            <div className="text-base sm:text-lg font-extrabold mt-1 text-cyan-400">{c.value}</div>
          </div>
        ))}
      </div>

      {/* Charts Grid (Covers all 10 required metrics) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Active Users, Registrations & Login Sessions */}
        <div className="eg-card rounded-3xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <h2 className="text-sm font-bold mb-3">
            Active Users, Registrations &amp; Login Sessions (Demo Series)
          </h2>
          <div className="relative h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={series}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="label" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', fontSize: '12px' }} />
                <Legend />
                <Area type="monotone" dataKey="activeUsers" name="Active Users" stroke="#2563EB" fill="#2563EB" fillOpacity={0.2} />
                <Area type="monotone" dataKey="logins" name="Login Sessions" stroke="#22D3EE" fill="#22D3EE" fillOpacity={0.15} />
                <Area type="monotone" dataKey="registrations" name="Registrations" stroke="#14B8A6" fill="#14B8A6" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Route Searches & Successful vs Failed Calculations */}
        <div className="eg-card rounded-3xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <h2 className="text-sm font-bold mb-3">
            Route Searches: Successful vs. Failed Calculations
          </h2>
          <div className="relative h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={series}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="label" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', fontSize: '12px' }} />
                <Legend />
                <Bar dataKey="searches" name="Total Searches" fill="#2563EB" radius={[4, 4, 0, 0]} />
                <Bar dataKey="successRoutes" name="Successful Routes" fill="#16A34A" radius={[4, 4, 0, 0]} />
                <Bar dataKey="failedRoutes" name="Failed Routes" fill="#DC2626" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Obstacle Events, Remote Commands & Session Duration */}
        <div className="eg-card rounded-3xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <h2 className="text-sm font-bold mb-3">
            Obstacle Events, Remote Commands &amp; Avg Session Duration (min)
          </h2>
          <div className="relative h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={series}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="label" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', fontSize: '12px' }} />
                <Legend />
                <Line type="monotone" dataKey="commands" name="Remote Commands" stroke="#22D3EE" strokeWidth={2} />
                <Line type="monotone" dataKey="obstacles" name="Obstacle Events" stroke="#F59E0B" strokeWidth={2} />
                <Line type="monotone" dataKey="sessionMin" name="Session Duration (m)" stroke="#14B8A6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Frequently Used Modules & Accessibility Score Distribution */}
        <div className="eg-card rounded-3xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <h2 className="text-xs font-bold mb-2">Frequently Used Modules</h2>
            <div className="relative h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MODULE_USAGE_DATA} layout="vertical">
                  <XAxis type="number" stroke="#94A3B8" fontSize={10} />
                  <YAxis dataKey="module" type="category" stroke="#94A3B8" fontSize={10} width={95} />
                  <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', fontSize: '11px' }} />
                  <Bar dataKey="count" fill="#22D3EE" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div>
            <h2 className="text-xs font-bold mb-2">Accessibility Score Distribution</h2>
            <div className="relative h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={SCORE_DISTRIBUTION_DATA} dataKey="count" nameKey="range" cx="50%" cy="50%" outerRadius={65} label>
                    {SCORE_DISTRIBUTION_DATA.map((entry, index) => (
                      <Cell key={index} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Privacy-Safe Activity Table with Search, Sort & Pagination */}
      <div className="eg-card rounded-3xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-base font-bold">Real-Time &amp; Demo Activity Log Table</h2>
          <div className="flex items-center gap-2 no-print">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={tableSearch}
                onChange={(e) => {
                  setTableSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Filter activity, module, result..."
                className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-700 text-xs"
              />
            </div>
            <button
              type="button"
              onClick={() => setSortAsc((s) => !s)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold flex items-center gap-1"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>{sortAsc ? 'Oldest First' : 'Newest First'}</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400">
                <th className="py-2 pr-3">Date &amp; Time</th>
                <th className="py-2 px-3">Privacy-Safe User ID</th>
                <th className="py-2 px-3">Activity Type</th>
                <th className="py-2 px-3">Module Accessed</th>
                <th className="py-2 px-3">Event Result</th>
                <th className="py-2 pl-3">Session Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {paginatedLogs.map((log) => (
                <tr key={log.id}>
                  <td className="py-2.5 pr-3 font-mono">{log.timestamp}</td>
                  <td className="py-2.5 px-3 font-semibold text-cyan-400">{log.userHash}</td>
                  <td className="py-2.5 px-3 font-bold">{log.activityType}</td>
                  <td className="py-2.5 px-3">{log.module}</td>
                  <td className="py-2.5 px-3 text-emerald-400">{log.result}</td>
                  <td className="py-2.5 pl-3 text-slate-400">{log.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between text-xs pt-2 no-print">
          <span className="text-slate-400">
            Showing page {page} of {totalPages} ({filteredLogs.length} records)
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1 rounded-lg bg-slate-800 text-white disabled:opacity-40"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1 rounded-lg bg-slate-800 text-white disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
