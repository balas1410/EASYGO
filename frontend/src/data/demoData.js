export const DEMO_USERS = [
  {
    id: 'usr-1001',
    name: 'Aarav Krishnan',
    email: 'aarav.krishnan@easygo.demo',
    phone: '+91 98401 23456',
    countryCode: '+91',
    role: 'admin',
    verified: true,
    verifiedMethod: 'Email & Phone (Demo)',
    createdAt: '2026-06-14T09:30:00Z',
    accessibilityPreferences: {
      wheelchairType: 'Electric Powered Wheelchair',
      maxSlopePercent: 6,
      avoidUnpaved: true,
      requireCurbRamps: true,
      preferredWidthCm: 90
    }
  },
  {
    id: 'usr-1002',
    name: 'Meera Sundaram',
    email: 'meera.s@easygo.demo',
    phone: '+91 94432 87654',
    countryCode: '+91',
    role: 'user',
    verified: true,
    verifiedMethod: 'Email (Demo)',
    createdAt: '2026-08-21T14:15:00Z',
    accessibilityPreferences: {
      wheelchairType: 'Manual Wheelchair',
      maxSlopePercent: 4,
      avoidUnpaved: true,
      requireCurbRamps: true,
      preferredWidthCm: 85
    }
  }
];

export const DEMO_LOCATIONS = [
  {
    id: 'loc-home',
    name: 'Home — Thillai Nagar 11th Cross',
    address: '11th Cross St, Thillai Nagar, Tiruchirappalli, Tamil Nadu 620018',
    lat: 10.8235,
    lng: 78.6832,
    category: 'Home',
    notes: 'Ramped apartment entrance on East gate; smooth concrete driveway.',
    verifiedContinuity: true,
    accessibleEntrance: 'Verified Ramp',
    surface: 'Smooth Concrete',
    slope: '3.2% (Verified)'
  },
  {
    id: 'loc-hospital',
    name: 'Kauvery Medical Center (Main Accessibility Wing)',
    address: 'Tennur High Rd, Tennur, Tiruchirappalli, Tamil Nadu 620017',
    lat: 10.8162,
    lng: 78.6869,
    category: 'Hospital',
    notes: 'Drop-off bay with zero-step entry, automatic doors, and wide elevator.',
    verifiedContinuity: true,
    accessibleEntrance: 'Zero-Step Automatic Entry',
    surface: 'Paved Asphalt & Tactile Tile',
    slope: '2.1% (Verified)'
  },
  {
    id: 'loc-college',
    name: 'St. Joseph Autonomous College (Library Gate)',
    address: 'College Rd, Teppakulam, Tiruchirappalli, Tamil Nadu 620002',
    lat: 10.8294,
    lng: 78.6938,
    category: 'College',
    notes: 'North library gate has wide accessible pathway and tactile paving.',
    verifiedContinuity: true,
    accessibleEntrance: 'Verified North Ramp',
    surface: 'Paved Stone & Concrete',
    slope: '4.0% (Verified)'
  },
  {
    id: 'loc-station',
    name: 'Tiruchirappalli Junction Railway Station (Escalator/Lift Entry)',
    address: 'Railway Junction, Bharathiar Salai, Tiruchirappalli, Tamil Nadu 620001',
    lat: 10.7950,
    lng: 78.6852,
    category: 'Public Transit',
    notes: 'Platform 1 accessible entrance with battery car & wheelchair ramp.',
    verifiedContinuity: true,
    accessibleEntrance: 'Platform 1 Ramp & Lift',
    surface: 'Granite Concourse',
    slope: '3.8% (Verified)'
  },
  {
    id: 'loc-park',
    name: 'Anna Science Centre & Planetarium Promenade',
    address: 'Pudukkottai Main Rd, Near Airport, Tiruchirappalli, Tamil Nadu 620007',
    lat: 10.7689,
    lng: 78.7065,
    category: 'Public Location',
    notes: 'Accessible exhibition halls; some outdoor garden gravel sections are unknown.',
    verifiedContinuity: false,
    accessibleEntrance: 'User Reported Ramp',
    surface: 'Unknown',
    slope: 'Unavailable'
  },
  {
    id: 'loc-work',
    name: 'TIDEL Neo Innovation Hub (Accessible Block B)',
    address: 'Bharathidasan Salai, Cantonment, Tiruchirappalli, Tamil Nadu 620001',
    lat: 10.8045,
    lng: 78.6798,
    category: 'Workplace',
    notes: 'Dedicated wheelchair parking bay #3, automated lobby turnstile.',
    verifiedContinuity: true,
    accessibleEntrance: 'Verified Wide Gate',
    surface: 'Smooth Paved',
    slope: '2.5% (Verified)'
  },
  {
    id: 'loc-pharmacy',
    name: 'MedPlus 24x7 Accessible Pharmacy & Clinic',
    address: 'Salai Rd, Woraiyur, Tiruchirappalli, Tamil Nadu 620003',
    lat: 10.8271,
    lng: 78.6774,
    category: 'Hospital',
    notes: 'Curb cut directly in front of store; service bell at wheelchair height.',
    verifiedContinuity: true,
    accessibleEntrance: 'Verified Curb Cut',
    surface: 'Concrete Sidewalk',
    slope: '3.5% (Verified)'
  },
  {
    id: 'loc-mall',
    name: 'Central Promenade Civic Plaza',
    address: 'West Boulevard Rd, Tiruchirappalli, Tamil Nadu 620008',
    lat: 10.8188,
    lng: 78.6915,
    category: 'Public Location',
    notes: 'Wide pedestrian walkway, accessible restrooms on ground floor.',
    verifiedContinuity: true,
    accessibleEntrance: 'Verified Level Entry',
    surface: 'Interlocking Pavers',
    slope: 'Unknown'
  }
];

export const INITIAL_FAVOURITES = [
  {
    id: 'fav-1',
    name: 'Home — Thillai Nagar',
    address: '11th Cross St, Thillai Nagar, Tiruchirappalli 620018',
    lat: 10.8235,
    lng: 78.6832,
    category: 'Home',
    notes: 'East gate ramp access; security intercom at 100cm height.'
  },
  {
    id: 'fav-2',
    name: 'Kauvery Medical Center',
    address: 'Tennur High Rd, Tennur, Tiruchirappalli 620017',
    lat: 10.8162,
    lng: 78.6869,
    category: 'Hospital',
    notes: 'Main outpatient accessibility drop-off bay & elevator B.'
  },
  {
    id: 'fav-3',
    name: 'St. Joseph College Library Gate',
    address: 'College Rd, Teppakulam, Tiruchirappalli 620002',
    lat: 10.8294,
    lng: 78.6938,
    category: 'College',
    notes: 'Accessible ramp at North Gate; wide reading room doorway.'
  },
  {
    id: 'fav-4',
    name: 'TIDEL Neo Innovation Hub',
    address: 'Bharathidasan Salai, Cantonment, Tiruchirappalli 620001',
    lat: 10.8045,
    lng: 78.6798,
    category: 'Workplace',
    notes: 'Block B level entrance; accessible washroom near reception.'
  },
  {
    id: 'fav-5',
    name: 'MedPlus 24x7 Accessible Pharmacy',
    address: 'Salai Rd, Woraiyur, Tiruchirappalli 620003',
    lat: 10.8271,
    lng: 78.6774,
    category: 'Hospital',
    notes: 'Quick stop along commute for prescriptions; curb ramp available.'
  }
];

export const KNOWN_OBSTACLES = [
  {
    id: 'obs-101',
    title: 'Storm Drain Grate Gap & Uneven Curb',
    lat: 10.8202,
    lng: 78.6851,
    severity: 'Warning',
    source: 'User Reported + Ultrasonic Log (Demo)',
    verified: true,
    distanceImpactM: 120,
    description: '3.5cm lip at crosswalk transition on Shastri Road; caution advised for small front caster wheels.',
    reportedAt: '2026-10-23T11:20:00Z'
  },
  {
    id: 'obs-102',
    title: 'Sidewalk Utility Pole & Narrow Clearance (72cm)',
    lat: 10.8258,
    lng: 78.6889,
    severity: 'High',
    source: 'Verified Municipal Audit (Demo)',
    verified: true,
    distanceImpactM: 250,
    description: 'Transformer box narrows sidewalk below 75cm width; detour via parallel service lane recommended.',
    reportedAt: '2026-10-22T16:40:00Z'
  },
  {
    id: 'obs-103',
    title: 'Temporary Trench Work Near Bus Shelter',
    lat: 10.8112,
    lng: 78.6838,
    severity: 'High',
    source: 'Community Accessibility Report (Demo)',
    verified: false,
    distanceImpactM: 180,
    description: 'Temporary steel plates placed over cable trench; steep temporary edge.',
    reportedAt: '2026-10-24T08:15:00Z'
  },
  {
    id: 'obs-104',
    title: 'Parked Two-Wheelers Encroaching Ramp',
    lat: 10.8266,
    lng: 78.6805,
    severity: 'Warning',
    source: 'ESP32 Ultrasonic Detection Log (Demo)',
    verified: false,
    distanceImpactM: 60,
    description: 'Intermittent obstruction detected at 58cm range near corner curb ramp.',
    reportedAt: '2026-10-24T13:05:00Z'
  }
];

export const INITIAL_RECENT_ROUTES = [
  {
    id: 'rt-hist-1',
    name: 'Home → MedPlus Pharmacy → Kauvery Medical Center',
    start: 'Home — Thillai Nagar',
    stops: ['MedPlus 24x7 Accessible Pharmacy'],
    destination: 'Kauvery Medical Center',
    distanceKm: 2.4,
    durationMin: 18,
    accessibilityScore: 86,
    knownBarriers: 0,
    timestamp: '2026-10-24T10:30:00Z',
    isDemo: true
  },
  {
    id: 'rt-hist-2',
    name: 'Home → TIDEL Neo Innovation Hub',
    start: 'Home — Thillai Nagar',
    stops: [],
    destination: 'TIDEL Neo Innovation Hub',
    distanceKm: 3.1,
    durationMin: 24,
    accessibilityScore: 78,
    knownBarriers: 1,
    timestamp: '2026-10-23T17:45:00Z',
    isDemo: true
  },
  {
    id: 'rt-hist-3',
    name: 'TIDEL Neo → Central Plaza → St. Joseph College',
    start: 'TIDEL Neo Innovation Hub',
    stops: ['Central Promenade Civic Plaza'],
    destination: 'St. Joseph College Library Gate',
    distanceKm: 4.2,
    durationMin: 31,
    accessibilityScore: 72,
    knownBarriers: 1,
    timestamp: '2026-10-22T09:15:00Z',
    isDemo: true
  }
];

export const INITIAL_SENSOR_READINGS = [
  { time: '15:10:00', distanceCm: 165, status: 'Clear', thresholdCm: 80, isDemo: true },
  { time: '15:11:00', distanceCm: 148, status: 'Clear', thresholdCm: 80, isDemo: true },
  { time: '15:12:00', distanceCm: 112, status: 'Clear', thresholdCm: 80, isDemo: true },
  { time: '15:13:00', distanceCm: 74, status: 'Warning', thresholdCm: 80, isDemo: true },
  { time: '15:14:00', distanceCm: 38, status: 'Detected', thresholdCm: 80, isDemo: true },
  { time: '15:15:00', distanceCm: 92, status: 'Clear', thresholdCm: 80, isDemo: true },
  { time: '15:16:00', distanceCm: 134, status: 'Clear', thresholdCm: 80, isDemo: true },
  { time: '15:17:00', distanceCm: 142, status: 'Clear', thresholdCm: 80, isDemo: true }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    type: 'route_success',
    title: 'Accessible Route Calculated (Demo)',
    message: 'Route from Home — Thillai Nagar via 1 stop to Kauvery Medical Center scored 86/100 with 0 high-severity barriers.',
    timestamp: '10 mins ago',
    read: false,
    isDemo: true
  },
  {
    id: 'notif-2',
    type: 'obstacle_alert',
    title: 'Known Obstacle Alert Near Shastri Rd (Demo)',
    message: 'Storm drain grate gap reported 120m from Alternate Route B. Curb-ramp detour active.',
    timestamp: '38 mins ago',
    read: false,
    isDemo: true
  },
  {
    id: 'notif-3',
    type: 'esp32_status',
    title: 'ESP32 Prototype Operating in Demo Simulation',
    message: 'No live WebSocket hardware detected at ws://192.168.4.1:81. Running safe ultrasonic & remote simulation.',
    timestamp: '1 hour ago',
    read: false,
    isDemo: true
  },
  {
    id: 'notif-4',
    type: 'account_verified',
    title: 'Demo Session Authenticated',
    message: 'Signed in as Aarav Krishnan (Admin Demo Profile). Local privacy guards active.',
    timestamp: '2 hours ago',
    read: true,
    isDemo: true
  }
];

export const ANALYTICS_DEMO_DATASET = {
  today: {
    summary: {
      totalUsers: 148,
      activeUsers: 42,
      loginSessions: 67,
      routeSearches: 94,
      successfulRoutes: 89,
      failedRoutes: 5,
      avgAccessibilityScore: 81.4,
      obstacleEvents: 19,
      remoteCommands: 134,
      totalDistanceKm: 118.6,
      avgSessionMin: 16.8,
      mostUsedModule: 'Interactive Map & Planner',
      favouritesSaved: 63
    },
    dailySeries: [
      { label: '08:00', activeUsers: 8, registrations: 1, logins: 11, searches: 14, successRoutes: 13, failedRoutes: 1, obstacles: 2, commands: 18, sessionMin: 14 },
      { label: '10:00', activeUsers: 14, registrations: 2, logins: 19, searches: 26, successRoutes: 25, failedRoutes: 1, obstacles: 5, commands: 32, sessionMin: 18 },
      { label: '12:00', activeUsers: 19, registrations: 1, logins: 15, searches: 22, successRoutes: 20, failedRoutes: 2, obstacles: 6, commands: 41, sessionMin: 17 },
      { label: '14:00', activeUsers: 24, registrations: 3, logins: 22, searches: 32, successRoutes: 31, failedRoutes: 1, obstacles: 6, commands: 43, sessionMin: 18 }
    ]
  },
  '7d': {
    summary: {
      totalUsers: 148,
      activeUsers: 112,
      loginSessions: 384,
      routeSearches: 540,
      successfulRoutes: 514,
      failedRoutes: 26,
      avgAccessibilityScore: 79.8,
      obstacleEvents: 128,
      remoteCommands: 860,
      totalDistanceKm: 742.5,
      avgSessionMin: 18.4,
      mostUsedModule: 'Accessible Route Planner',
      favouritesSaved: 214
    },
    dailySeries: [
      { label: 'Oct 18', activeUsers: 68, registrations: 4, logins: 48, searches: 65, successRoutes: 62, failedRoutes: 3, obstacles: 16, commands: 110, sessionMin: 17 },
      { label: 'Oct 19', activeUsers: 74, registrations: 6, logins: 54, searches: 78, successRoutes: 74, failedRoutes: 4, obstacles: 19, commands: 125, sessionMin: 18 },
      { label: 'Oct 20', activeUsers: 81, registrations: 5, logins: 61, searches: 84, successRoutes: 79, failedRoutes: 5, obstacles: 21, commands: 134, sessionMin: 19 },
      { label: 'Oct 21', activeUsers: 79, registrations: 3, logins: 52, searches: 72, successRoutes: 69, failedRoutes: 3, obstacles: 15, commands: 112, sessionMin: 17 },
      { label: 'Oct 22', activeUsers: 88, registrations: 7, logins: 59, searches: 86, successRoutes: 82, failedRoutes: 4, obstacles: 22, commands: 142, sessionMin: 20 },
      { label: 'Oct 23', activeUsers: 92, registrations: 5, logins: 63, searches: 89, successRoutes: 85, failedRoutes: 4, obstacles: 18, commands: 128, sessionMin: 19 },
      { label: 'Oct 24', activeUsers: 96, registrations: 7, logins: 47, searches: 66, successRoutes: 63, failedRoutes: 3, obstacles: 17, commands: 109, sessionMin: 18 }
    ]
  },
  '30d': {
    summary: {
      totalUsers: 148,
      activeUsers: 139,
      loginSessions: 1490,
      routeSearches: 2180,
      successfulRoutes: 2074,
      failedRoutes: 106,
      avgAccessibilityScore: 78.6,
      obstacleEvents: 492,
      remoteCommands: 3410,
      totalDistanceKm: 2890.4,
      avgSessionMin: 19.2,
      mostUsedModule: 'Interactive Map & Planner',
      favouritesSaved: 412
    },
    dailySeries: [
      { label: 'Week 1', activeUsers: 98, registrations: 28, logins: 310, searches: 460, successRoutes: 435, failedRoutes: 25, obstacles: 108, commands: 740, sessionMin: 18 },
      { label: 'Week 2', activeUsers: 112, registrations: 36, logins: 365, searches: 520, successRoutes: 494, failedRoutes: 26, obstacles: 121, commands: 830, sessionMin: 19 },
      { label: 'Week 3', activeUsers: 125, registrations: 42, logins: 395, searches: 580, successRoutes: 552, failedRoutes: 28, obstacles: 134, commands: 910, sessionMin: 20 },
      { label: 'Week 4', activeUsers: 139, registrations: 42, logins: 420, searches: 620, successRoutes: 593, failedRoutes: 27, obstacles: 129, commands: 930, sessionMin: 20 }
    ]
  }
};

export const MODULE_USAGE_DATA = [
  { module: 'Interactive Map', count: 640, fill: '#2563EB' },
  { module: 'Route Planner', count: 540, fill: '#22D3EE' },
  { module: 'Obstacle Sensor', count: 410, fill: '#14B8A6' },
  { module: 'Favourite Places', count: 320, fill: '#3B82F6' },
  { module: 'Remote Control', count: 290, fill: '#06B6D4' },
  { module: 'AI Path Analysis', count: 215, fill: '#10B981' }
];

export const SCORE_DISTRIBUTION_DATA = [
  { range: '90–100 (Verified High)', count: 142, fill: '#16A34A' },
  { range: '75–89 (Good / Partial Info)', count: 238, fill: '#14B8A6' },
  { range: '60–74 (Moderate / Unknowns)', count: 96, fill: '#F59E0B' },
  { range: '<60 (Barriers / Insufficient Data)', count: 38, fill: '#DC2626' }
];

export const INITIAL_ACTIVITY_LOGS = [
  { id: 'act-101', timestamp: '2026-10-24 15:12', userHash: 'USR#8F2A (Anon)', activityType: 'Route Calculation', module: 'Route Planner', result: 'Success (Score: 86/100)', duration: '19m 20s', isDemo: true },
  { id: 'act-102', timestamp: '2026-10-24 14:58', userHash: 'USR#8F2A (Anon)', activityType: 'Ultrasonic Alert', module: 'Obstacle Detection', result: 'Warning @ 68cm', duration: '19m 20s', isDemo: true },
  { id: 'act-103', timestamp: '2026-10-24 14:40', userHash: 'USR#3C91 (Anon)', activityType: 'Waypoint Reorder', module: 'Interactive Map', result: '2 Stops Synchronized', duration: '14m 05s', isDemo: true },
  { id: 'act-104', timestamp: '2026-10-24 14:22', userHash: 'USR#7D4E (Anon)', activityType: 'Favourite Added', module: 'Favourite Places', result: 'Saved: Kauvery Hospital', duration: '11m 40s', isDemo: true },
  { id: 'act-105', timestamp: '2026-10-24 13:55', userHash: 'USR#8F2A (Anon)', activityType: 'Remote Command', module: 'Remote Control', result: 'Simulated Forward (Speed 2)', duration: '22m 10s', isDemo: true },
  { id: 'act-106', timestamp: '2026-10-24 13:30', userHash: 'USR#1B55 (Anon)', activityType: 'AI Path Comparison', module: 'AI Path Detection', result: 'Evaluated 3 Candidate Paths', duration: '16m 50s', isDemo: true },
  { id: 'act-107', timestamp: '2026-10-24 12:48', userHash: 'USR#9E12 (Anon)', activityType: 'Route Calculation', module: 'Interactive Map', result: 'Failed (Unreachable Coord)', duration: '06m 15s', isDemo: true },
  { id: 'act-108', timestamp: '2026-10-24 11:20', userHash: 'USR#4A77 (Anon)', activityType: 'Session Login', module: 'Auth / OTP', result: 'Demo Email Verified', duration: '24m 00s', isDemo: true },
  { id: 'act-109', timestamp: '2026-10-23 18:05', userHash: 'USR#3C91 (Anon)', activityType: 'Emergency Stop Test', module: 'Remote Control', result: 'Immediate Halt Confirmed (Demo)', duration: '15m 30s', isDemo: true },
  { id: 'act-110', timestamp: '2026-10-23 16:40', userHash: 'USR#8F2A (Anon)', activityType: 'Accessibility Settings', module: 'Settings & Accessibility', result: 'High Contrast + Threshold 80cm', duration: '18m 12s', isDemo: true }
];
