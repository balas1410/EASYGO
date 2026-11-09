const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

/**
 * Notification Service
 * Proposed API Contract: GET /api/notifications
 */
export const notificationService = {
  async fetchNotifications(initialNotifications) {
    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/notifications`);
        if (res.ok) return await res.json();
      } catch (_err) {
        // Fallback
      }
    }
    return initialNotifications;
  }
};
