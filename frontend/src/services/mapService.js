import { DEMO_LOCATIONS } from '../data/demoData';

const GEOCODING_URL = import.meta.env.VITE_GEOCODING_API_URL || 'https://nominatim.openstreetmap.org';

/**
 * Geocoding & Location Search Service
 * Uses OpenStreetMap Nominatim when reachable, with automatic fallback to curated Demo Locations.
 */
export const mapService = {
  async searchLocations(query) {
    if (!query || !query.trim()) return [];
    const q = query.trim().toLowerCase();

    // First match local demo places for instant response
    const localMatches = DEMO_LOCATIONS.filter(
      (loc) =>
        loc.name.toLowerCase().includes(q) ||
        loc.address.toLowerCase().includes(q) ||
        (loc.category && loc.category.toLowerCase().includes(q))
    ).map((item) => ({ ...item, source: 'Demo Gazetteer' }));

    try {
      const url = `${GEOCODING_URL}/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`;
      const res = await fetch(url, {
        headers: { 'Accept-Language': 'en' }
      });
      if (res.ok) {
        const data = await res.json();
        const osmResults = data.map((d) => ({
          id: `osm-${d.place_id}`,
          name: d.display_name.split(',')[0],
          address: d.display_name,
          lat: parseFloat(d.lat),
          lng: parseFloat(d.lon),
          category: d.type || 'Place',
          source: 'OpenStreetMap Nominatim'
        }));
        return [...localMatches, ...osmResults];
      }
    } catch (_err) {
      // Network offline or rate-limited; return local demo gazetteer
    }
    return localMatches;
  },

  async reverseGeocode(lat, lng) {
    const fixedLat = Number(lat).toFixed(5);
    const fixedLng = Number(lng).toFixed(5);
    try {
      const url = `${GEOCODING_URL}/reverse?format=json&lat=${fixedLat}&lon=${fixedLng}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data && data.display_name) {
          return {
            name: data.display_name.split(',')[0] || `Pin (${fixedLat}, ${fixedLng})`,
            address: data.display_name,
            lat: Number(lat),
            lng: Number(lng),
            source: 'OpenStreetMap Nominatim'
          };
        }
      }
    } catch (_err) {
      // Fallback
    }
    return {
      name: `Selected Map Point (${fixedLat}, ${fixedLng})`,
      address: `Coordinates: ${fixedLat}° N, ${fixedLng}° E (Tiruchirappalli Sector — Demo Geocode)`,
      lat: Number(lat),
      lng: Number(lng),
      source: 'Demo Reverse Geocoder'
    };
  }
};
