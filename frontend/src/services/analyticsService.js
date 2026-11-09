const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

/**
 * Real-Data-Ready Website Usage Tracking & Analytics Service
 * Proposed API Contracts:
 * POST /api/analytics/events
 * GET /api/analytics/summary
 * GET /api/analytics/usage
 */
export const analyticsService = {
  async trackEvent(eventPayload) {
    const safeEvent = {
      id: `evt-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      userHash: eventPayload.userHash || 'USR#8F2A (Anon)',
      activityType: eventPayload.activityType || 'Interaction',
      module: eventPayload.module || 'Dashboard',
      result: eventPayload.result || 'Recorded (Demo)',
      duration: eventPayload.duration || 'Active Session',
      isDemo: !API_BASE_URL
    };

    if (API_BASE_URL) {
      try {
        await fetch(`${API_BASE_URL}/analytics/events`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(safeEvent)
        });
      } catch (_err) {
        // Fallback to local state log
      }
    }
    return safeEvent;
  }
};
