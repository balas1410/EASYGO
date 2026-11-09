/**
 * Report Generation & CSV Export Service
 * Proposed API Contract: GET /api/analytics/reports
 */
export const reportService = {
  generateCsvContent({ rangeLabel, summary, activityLogs }) {
    const headers = ['Timestamp', 'User Identifier (Privacy-Safe)', 'Activity Type', 'Module Accessed', 'Event Result', 'Session Duration', 'Data Mode'];
    const rows = activityLogs.map((log) => [
      `"${log.timestamp}"`,
      `"${log.userHash}"`,
      `"${log.activityType}"`,
      `"${log.module}"`,
      `"${log.result}"`,
      `"${log.duration}"`,
      `"${log.isDemo ? 'Demo Mode' : 'Verified Backend'}"`
    ]);

    const summaryHeader = [
      `# EASY GO — Usage Analytics & Accessibility Report`,
      `# Date Range: ${rangeLabel}`,
      `# Generated At: ${new Date().toISOString()}`,
      `# Mode: Demo Mode (Clearly Labeled Sample + Live Session Events)`,
      `# Total Users: ${summary.totalUsers}, Active Users: ${summary.activeUsers}, Route Searches: ${summary.routeSearches}, Avg Accessibility Score: ${summary.avgAccessibilityScore}`,
      ``
    ];

    return [...summaryHeader, headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  },

  triggerCsvDownload(csvText, filename = `easy-go-usage-report-${new Date().toISOString().slice(0, 10)}.csv`) {
    const blob = new Blob([csvText], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', filename);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
};
