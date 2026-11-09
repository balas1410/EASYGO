/**
 * Explainable, evidence-based Route Accessibility Scoring Engine (0–100).
 * Never treats missing data ("Unknown" / "Unavailable") as proof that a route is accessible.
 * Clearly distinguishes verified evidence from user reports and unverified segments.
 */

export const DEFAULT_SCORING_WEIGHTS = {
  continuity: 25,
  barriers: 30,
  entrances: 15,
  surface: 15,
  slope: 15
};

export function calculateExplainableAccessibilityScore(routeInput, weights = DEFAULT_SCORING_WEIGHTS) {
  const {
    verifiedContinuity = 'Available', // 'Available' | 'Partial' | 'Unknown'
    knownBarriersCount = 0,
    highSeverityBarriers = 0,
    accessibleEntrances = 'Verified', // 'Verified' | 'User Reported' | 'Unknown'
    surfaceCondition = 'Unknown', // 'Verified Smooth' | 'Paved / Mixed' | 'Unknown'
    slopeInformation = 'Unavailable', // 'Verified <= 5%' | 'Moderate 5-8%' | 'Unavailable'
    restrictions = 'None Reported'
  } = routeInput || {};

  // 1. Route Continuity (max 25)
  let continuityPoints = 0;
  let continuityStatus = verifiedContinuity;
  let continuityNote = '';
  if (verifiedContinuity === 'Available') {
    continuityPoints = weights.continuity;
    continuityNote = 'Continuous curb-to-curb sidewalk & crosswalk geometry verified.';
  } else if (verifiedContinuity === 'Partial') {
    continuityPoints = Math.round(weights.continuity * 0.6);
    continuityNote = 'Main corridor verified; intermediate connector segment relies on user reports.';
  } else {
    continuityPoints = Math.round(weights.continuity * 0.35);
    continuityStatus = 'Unknown';
    continuityNote = 'Continuity unverified. Missing data is not treated as proof of accessibility.';
  }

  // 2. Known Barriers & Obstacles (max 30)
  let barrierPoints = weights.barriers;
  let barrierNote = '0 active barriers reported along this corridor.';
  if (knownBarriersCount > 0) {
    const penalty = (highSeverityBarriers * 16) + ((knownBarriersCount - highSeverityBarriers) * 9);
    barrierPoints = Math.max(0, weights.barriers - penalty);
    barrierNote = `${knownBarriersCount} reported barrier(s) (${highSeverityBarriers} high severity). Detour or caution required.`;
  }

  // 3. Accessible Entrances & Curb Ramps (max 15)
  let entrancePoints = 0;
  let entranceNote = '';
  if (accessibleEntrances === 'Verified') {
    entrancePoints = weights.entrances;
    entranceNote = 'Origin, waypoints, and destination have verified ramp or zero-step entry.';
  } else if (accessibleEntrances === 'User Reported') {
    entrancePoints = Math.round(weights.entrances * 0.7);
    entranceNote = 'Ramps reported by community users; awaiting municipal audit.';
  } else {
    entrancePoints = Math.round(weights.entrances * 0.3);
    entranceNote = 'Entrance accessibility Unknown. Verify curb cuts upon arrival.';
  }

  // 4. Surface Information (max 15)
  let surfacePoints = 0;
  let surfaceNote = '';
  if (surfaceCondition === 'Verified Smooth') {
    surfacePoints = weights.surface;
    surfaceNote = 'Smooth concrete/asphalt surface verified across primary segments.';
  } else if (surfaceCondition === 'Paved / Mixed') {
    surfacePoints = Math.round(weights.surface * 0.75);
    surfaceNote = 'Interlocking pavers and asphalt; minor vibration for small front casters.';
  } else {
    surfacePoints = Math.round(weights.surface * 0.35);
    surfaceNote = 'Surface condition Unknown. Unverified segments receive conservative cap.';
  }

  // 5. Slope Information (max 15)
  let slopePoints = 0;
  let slopeNote = '';
  if (slopeInformation === 'Verified <= 5%') {
    slopePoints = weights.slope;
    slopeNote = 'Gradient verified within ADA/IRC 1:20 (<=5%) comfortable ramp threshold.';
  } else if (slopeInformation === 'Moderate 5-8%') {
    slopePoints = Math.round(weights.slope * 0.65);
    slopeNote = 'Short ramp segments between 5% and 8%; powered or assisted propulsion advised.';
  } else {
    slopePoints = Math.round(weights.slope * 0.35);
    slopeNote = 'Elevation/slope telemetry Unavailable. Conservative score applied.';
  }

  const rawTotal = continuityPoints + barrierPoints + entrancePoints + surfacePoints + slopePoints;
  const maxPossible = Object.values(weights).reduce((a, b) => a + b, 0) || 100;
  const overallScore = Math.min(100, Math.max(0, Math.round((rawTotal / maxPossible) * 100)));

  const hasUnknowns =
    continuityStatus === 'Unknown' ||
    accessibleEntrances === 'Unknown' ||
    surfaceCondition === 'Unknown' ||
    slopeInformation === 'Unavailable';

  let confidenceLabel = 'High Evidence (Verified Segments)';
  if (hasUnknowns && knownBarriersCount === 0) {
    confidenceLabel = 'Partial Evidence (Contains Unknowns — Not Guaranteed Accessible)';
  } else if (knownBarriersCount > 0) {
    confidenceLabel = 'Caution Required (Known Obstacles Present)';
  }

  return {
    overallScore,
    confidenceLabel,
    hasUnknowns,
    restrictions,
    breakdown: [
      {
        factor: 'Verified Route Continuity',
        status: continuityStatus,
        evidenceType: continuityStatus === 'Available' ? 'Verified GIS' : continuityStatus === 'Partial' ? 'User Reported' : 'Unknown',
        points: continuityPoints,
        maxPoints: weights.continuity,
        explanation: continuityNote
      },
      {
        factor: 'Known Barriers & Obstacles',
        status: `${knownBarriersCount} reported`,
        evidenceType: knownBarriersCount === 0 ? 'Sensor + Audit Log' : 'Verified / Community Report',
        points: barrierPoints,
        maxPoints: weights.barriers,
        explanation: barrierNote
      },
      {
        factor: 'Accessible Entrances & Ramps',
        status: accessibleEntrances,
        evidenceType: accessibleEntrances === 'Verified' ? 'Verified Audit' : accessibleEntrances === 'User Reported' ? 'User Reported' : 'Unknown',
        points: entrancePoints,
        maxPoints: weights.entrances,
        explanation: entranceNote
      },
      {
        factor: 'Surface Condition',
        status: surfaceCondition,
        evidenceType: surfaceCondition === 'Unknown' ? 'Unknown' : 'Verified / Mapped',
        points: surfacePoints,
        maxPoints: weights.surface,
        explanation: surfaceNote
      },
      {
        factor: 'Slope Information',
        status: slopeInformation,
        evidenceType: slopeInformation === 'Unavailable' ? 'Unavailable' : 'Verified Elevation',
        points: slopePoints,
        maxPoints: weights.slope,
        explanation: slopeNote
      }
    ]
  };
}
