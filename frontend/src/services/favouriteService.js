const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

/**
 * Favourite Places Service
 * Proposed API Contracts:
 * GET /api/favourites
 * POST /api/favourites
 * PATCH /api/favourites/:id
 * DELETE /api/favourites/:id
 */
export const favouriteService = {
  async listFavourites(initialList) {
    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/favourites`);
        if (res.ok) return await res.json();
      } catch (_err) {
        // Fallback
      }
    }
    return initialList;
  },

  async createFavourite(fav) {
    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/favourites`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(fav)
        });
        if (res.ok) return await res.json();
      } catch (_err) {
        // Fallback
      }
    }
    return {
      ...fav,
      id: `fav-${Date.now()}`,
      isDemo: true
    };
  },

  async updateFavourite(id, updates) {
    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/favourites/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates)
        });
        if (res.ok) return await res.json();
      } catch (_err) {
        // Fallback
      }
    }
    return { id, ...updates, isDemo: true };
  },

  async deleteFavourite(id) {
    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/favourites/${id}`, {
          method: 'DELETE'
        });
        if (res.ok) return await res.json();
      } catch (_err) {
        // Fallback
      }
    }
    return { id, deleted: true, isDemo: true };
  }
};
