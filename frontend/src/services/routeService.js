import { KNOWN_OBSTACLES } from '../data/demoData';
import { calculateExplainableAccessibilityScore } from '../utils/accessibilityScoring';

const ROUTING_URL = import.meta.env.VITE_ROUTING_API_URL || 'https://router.project-osrm.org';

/**
 * Multi-Waypoint Accessible Route Calculation Service
 * Proposed API Contract: POST /api/routes/calculate, GET /api/routes/history
 * Queries OSRM ordered waypoint routing when online, or generates multi-segment street-grid road geometry
 * through all ordered waypoints (never a simple 2-point straight line) in Demo Mode.
 */
function haversineDistanceKm(a, b) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s1 =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return 2 * R * Math.atan2(Math.sqrt(s1), Math.sqrt(1 - s1));
}

function buildCurvedStreetGeometry(waypoints, variantOffset = 0) {
  const coords = [];
  for (let i = 0; i < waypoints.length - 1; i++) {
    const p1 = waypoints[i];
    const p2 = waypoints[i + 1];
    const steps = 14;
    const dLat = p2.lat - p1.lat;
    const dLng = p2.lng - p1.lng;
    // Orthogonal street-grid style intermediate bends so routes follow realistic urban corridors
    for (let s = 0; s <= steps; s++) {
      const t = s / steps;
      const curve = Math.sin(t * Math.PI) * (0.0014 + variantOffset);
      const dogleg = Math.sin(t * Math.PI * 2) * 0.0006;
      const lat = p1.lat + dLat * t + curve * (i % 2 === 0 ? 1 : -1) + dogleg;
      const lng = p1.lng + dLng * t - curve * 0.8 + dogleg;
      coords.push([Number(lat.toFixed(6)), Number(lng.toFixed(6))]);
    }
  }
  return coords;
}

export const routeService = {
  async calculateRoute({ start, stops = [], destination, preference = 'verified_accessible', scoringWeights }) {
    if (!start || !destination) {
      throw new Error('Both a starting point and a destination are required to calculate a route.');
    }

    const orderedWaypoints = [start, ...stops, destination];
    for (const wp of orderedWaypoints) {
      if (typeof wp.lat !== 'number' || typeof wp.lng !== 'number' || Number.isNaN(wp.lat) || Number.isNaN(wp.lng)) {
        throw new Error(`Invalid coordinates for waypoint: ${wp.name || 'Unnamed location'}`);
      }
    }

    // Calculate base distance across ordered waypoints
    let straightDistKm = 0;
    for (let i = 0; i < orderedWaypoints.length - 1; i++) {
      straightDistKm += haversineDistanceKm(orderedWaypoints[i], orderedWaypoints[i + 1]);
    }
    const baseRoadKm = Math.max(0.4, Number((straightDistKm * 1.28).toFixed(2)));

    // Try OSRM live road geometry if reachable
    let osrmGeometry = null;
    let isLiveOsrm = false;
    try {
      const coordString = orderedWaypoints.map((w) => `${w.lng},${w.lat}`).join(';');
      const res = await fetch(`${ROUTING_URL}/route/v1/foot/${coordString}?overview=full&geometries=geojson&alternatives=true`);
      if (res.ok) {
        const data = await res.json();
        if (data.routes && data.routes.length > 0) {
          osrmGeometry = data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
          isLiveOsrm = true;
        }
      }
    } catch (_err) {
      // Offline / Sandbox VM mode — use multi-segment urban corridor geometry
    }

    const primaryGeometry = osrmGeometry || buildCurvedStreetGeometry(orderedWaypoints, 0);
    const altGeometryA = buildCurvedStreetGeometry(orderedWaypoints, 0.0018);
    const altGeometryB = buildCurvedStreetGeometry(orderedWaypoints, -0.0016);

    // Build 3 transparent candidate routes
    const candidates = [
      {
        id: 'route-accessible-primary',
        name: 'Route A — Accessible Priority Corridor (Demo Route)',
        badge: 'Recommended Accessible Path',
        isDemo: !isLiveOsrm,
        routingSource: isLiveOsrm ? 'OSRM Foot Network + Demo Accessibility Layer' : 'Simulated Urban Corridor Geometry (Demo Mode)',
        distanceKm: Number((baseRoadKm * 1.06).toFixed(2)),
        durationMin: Math.max(4, Math.round((baseRoadKm * 1.06) / 0.11)), // ~6.6 km/h wheelchair cruising speed
        stopsCount: stops.length,
        geometry: primaryGeometry,
        summary: `Continuous ramped corridor via ${stops.length > 0 ? `${stops.length} intermediate stop(s)` : 'main arterial boulevard'} avoiding Shastri Rd utility pole narrowing.`,
        warnings: [
          'Simulated Accessibility Layer: Verify curb-cut condition at final intersection.'
        ],
        obstaclesOnRoute: [],
        scoringDetails: calculateExplainableAccessibilityScore(
          {
            verifiedContinuity: 'Available',
            knownBarriersCount: 0,
            highSeverityBarriers: 0,
            accessibleEntrances: 'Verified',
            surfaceCondition: 'Verified Smooth',
            slopeInformation: 'Verified <= 5%',
            restrictions: 'None Reported'
          },
          scoringWeights
        )
      },
      {
        id: 'route-shortest-direct',
        name: 'Route B — Shortest Direct Arterial (Demo Route)',
        badge: 'Shortest Distance • 1 Known Barrier',
        isDemo: true,
        routingSource: 'Simulated Urban Corridor Geometry (Demo Mode)',
        distanceKm: baseRoadKm,
        durationMin: Math.max(3, Math.round(baseRoadKm / 0.115)),
        stopsCount: stops.length,
        geometry: altGeometryA,
        summary: 'Shortest road distance through commercial sector, but passes storm drain grate lip and unverified slope segment.',
        warnings: [
          '1 Known Obstacle: Storm Drain Grate Gap & Uneven Curb (3.5cm lip).',
          'Slope telemetry is Unavailable on East Connector.'
        ],
        obstaclesOnRoute: [KNOWN_OBSTACLES[0]],
        scoringDetails: calculateExplainableAccessibilityScore(
          {
            verifiedContinuity: 'Partial',
            knownBarriersCount: 1,
            highSeverityBarriers: 0,
            accessibleEntrances: 'User Reported',
            surfaceCondition: 'Paved / Mixed',
            slopeInformation: 'Unavailable',
            restrictions: 'Caution for small front caster wheels at drain grate'
          },
          scoringWeights
        )
      },
      {
        id: 'route-unverified-backstreet',
        name: 'Route C — Secondary Service Lane (Demo Route)',
        badge: 'Low Evidence • High Caution',
        isDemo: true,
        routingSource: 'Simulated Urban Corridor Geometry (Demo Mode)',
        distanceKm: Number((baseRoadKm * 1.15).toFixed(2)),
        durationMin: Math.max(5, Math.round((baseRoadKm * 1.15) / 0.1)),
        stopsCount: stops.length,
        geometry: altGeometryB,
        summary: 'Lower traffic volume, but contains sidewalk utility pole narrowing (72cm) and unverified surface segments.',
        warnings: [
          'High-Severity Barrier: Sidewalk Utility Pole narrows passage to 72cm.',
          'Surface Condition & Slope Information are Unknown.'
        ],
        obstaclesOnRoute: [KNOWN_OBSTACLES[1]],
        scoringDetails: calculateExplainableAccessibilityScore(
          {
            verifiedContinuity: 'Unknown',
            knownBarriersCount: 2,
            highSeverityBarriers: 1,
            accessibleEntrances: 'Unknown',
            surfaceCondition: 'Unknown',
            slopeInformation: 'Unavailable',
            restrictions: 'Minimum width 72cm < 85cm standard wheelchair clearance'
          },
          scoringWeights
        )
      }
    ];

    // Sort according to user route preference
    if (preference === 'shortest_distance') {
      candidates.sort((a, b) => a.distanceKm - b.distanceKm);
    } else if (preference === 'fastest_time') {
      candidates.sort((a, b) => a.durationMin - b.durationMin);
    } else if (preference === 'fewer_obstacles') {
      candidates.sort((a, b) => a.obstaclesOnRoute.length - b.obstaclesOnRoute.length || b.scoringDetails.overallScore - a.scoringDetails.overallScore);
    } else {
      candidates.sort((a, b) => b.scoringDetails.overallScore - a.scoringDetails.overallScore);
    }

    return {
      success: true,
      isDemo: !isLiveOsrm,
      calculatedAt: new Date().toISOString(),
      orderedWaypoints,
      selectedRoute: candidates[0],
      alternatives: candidates
    };
  }
};
