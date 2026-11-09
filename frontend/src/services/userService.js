const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

/**
 * User Profile Service (Proposed API Contracts:
 * GET /api/users/me
 * PATCH /api/users/me)
 */
export const userService = {
  async getCurrentUser(fallbackUser) {
    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/users/me`);
        if (res.ok) return await res.json();
      } catch (_err) {
        // Fallback
      }
    }
    return { ...fallbackUser, isDemo: true };
  },

  async updateProfile(updates) {
    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/users/me`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates)
        });
        if (res.ok) return await res.json();
      } catch (_err) {
        // Fallback
      }
    }
    await new Promise((r) => setTimeout(r, 300));
    return {
      success: true,
      isDemo: true,
      updatedAt: new Date().toISOString(),
      updates
    };
  }
};
