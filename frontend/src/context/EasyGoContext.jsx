import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  DEMO_USERS,
  DEMO_LOCATIONS,
  INITIAL_FAVOURITES,
  KNOWN_OBSTACLES,
  INITIAL_RECENT_ROUTES,
  INITIAL_SENSOR_READINGS,
  INITIAL_NOTIFICATIONS,
  ANALYTICS_DEMO_DATASET,
  INITIAL_ACTIVITY_LOGS
} from '../data/demoData';
import { DEFAULT_SCORING_WEIGHTS } from '../utils/accessibilityScoring';
import { routeService } from '../services/routeService';
import { analyticsService } from '../services/analyticsService';

const EasyGoContext = createContext(null);

function safeGetStorage(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (_e) {
    return fallback;
  }
}

function safeSetStorage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (_e) {
    // Ignore storage block in restricted iframe
  }
}

export function EasyGoProvider({ children }) {
  // Splash & Auth State
  const [hasSeenSplash, setHasSeenSplash] = useState(() => safeGetStorage('eg_seen_splash', false));
  const [currentUser, setCurrentUser] = useState(() => safeGetStorage('eg_user_profile', DEMO_USERS[0]));
  const [isAuthenticated, setIsAuthenticated] = useState(() => safeGetStorage('eg_authenticated', true));
  const [pendingAuth, setPendingAuth] = useState(null); // Holds contact & method waiting for OTP verification

  // System & Hardware Status State
  const [connectionMode, setConnectionMode] = useState('Demo Mode'); // 'Online' | 'Offline' | 'Connecting' | 'Demo Mode'
  const [esp32Status, setEsp32Status] = useState('Simulated (Demo)'); // 'Connected' | 'Disconnected' | 'Simulated (Demo)'
  const [wheelchairStatus, setWheelchairStatus] = useState('Standby (Demo)');
  const [sensorStatus, setSensorStatus] = useState('Active Simulation (Demo)');
  const [batteryLevel, setBatteryLevel] = useState(88);

  // Shared Map & Route Planner State
  const [startLocation, setStartLocation] = useState(DEMO_LOCATIONS[0]); // Home — Thillai Nagar
  const [intermediateStops, setIntermediateStops] = useState([DEMO_LOCATIONS[6]]); // MedPlus 24x7 Accessible Pharmacy
  const [destinationLocation, setDestinationLocation] = useState(DEMO_LOCATIONS[1]); // Kauvery Medical Center
  const [mapSelectionMode, setMapSelectionMode] = useState('destination'); // 'start' | 'stop' | 'destination'
  const [routePreference, setRoutePreference] = useState('verified_accessible');
  const [scoringWeights, setScoringWeights] = useState(DEFAULT_SCORING_WEIGHTS);

  const [currentRoute, setCurrentRoute] = useState(null);
  const [routeAlternatives, setRouteAlternatives] = useState([]);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
  const [routeError, setRouteError] = useState('');
  const [recentRoutes, setRecentRoutes] = useState(() => safeGetStorage('eg_recent_routes', INITIAL_RECENT_ROUTES));
  const [totalRouteSearches, setTotalRouteSearches] = useState(94);

  // Favourite Places
  const [favourites, setFavourites] = useState(() => safeGetStorage('eg_favourites', INITIAL_FAVOURITES));

  // Ultrasonic Obstacle Sensor State (Strictly NO Camera)
  const [warningThresholdCm, setWarningThresholdCm] = useState(80);
  const [sensorReadings, setSensorReadings] = useState(INITIAL_SENSOR_READINGS);
  const [knownObstacles, setKnownObstacles] = useState(KNOWN_OBSTACLES);
  const [lastSensorUpdate, setLastSensorUpdate] = useState('15:17:00');

  // Wheelchair Remote Control State
  const [wheelchairSpeed, setWheelchairSpeed] = useState(2);
  const [movementDirection, setMovementDirection] = useState('Stopped');
  const [commandHistory, setCommandHistory] = useState([
    {
      id: 'cmd-init-1',
      command: 'System Self-Check',
      speedLevel: 1,
      timestamp: '15:05:12',
      acknowledgedByHardware: false,
      isDemo: true,
      statusMessage: 'Demo Mode initialized — Ultrasonic & Motor Telemetry simulated safely.'
    }
  ]);

  // Notifications & Usage Tracking State
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [activityLogs, setActivityLogs] = useState(INITIAL_ACTIVITY_LOGS);
  const [analyticsRange, setAnalyticsRange] = useState('7d');

  // Accessibility & UI Settings State
  const [settings, setSettings] = useState(() =>
    safeGetStorage('eg_settings', {
      theme: 'dark',
      fontSize: 'md',
      highContrast: false,
      reducedMotion: false,
      language: 'English',
      distanceUnit: 'km',
      notificationsEnabled: true,
      soundAlerts: false,
      privacyShareAnonLogs: true
    })
  );

  // Persist non-sensitive preferences
  useEffect(() => {
    safeSetStorage('eg_settings', settings);
    const root = document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    root.classList.remove('font-scale-sm', 'font-scale-md', 'font-scale-lg', 'font-scale-xl');
    root.classList.add(`font-scale-${settings.fontSize || 'md'}`);
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
  }, [settings]);

  useEffect(() => {
    safeSetStorage('eg_favourites', favourites);
  }, [favourites]);

  useEffect(() => {
    safeSetStorage('eg_recent_routes', recentRoutes);
  }, [recentRoutes]);

  const recordUsageEvent = useCallback(async (activityType, module, result) => {
    const evt = await analyticsService.trackEvent({
      userHash: currentUser ? `USR#${currentUser.id.slice(-4).toUpperCase()} (Anon)` : 'USR#GUEST',
      activityType,
      module,
      result
    });
    setActivityLogs((prev) => [evt, ...prev.slice(0, 49)]);
  }, [currentUser]);

  const addNotification = useCallback((notif) => {
    const item = {
      id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: 'Just now',
      read: false,
      isDemo: connectionMode === 'Demo Mode',
      ...notif
    };
    setNotifications((prev) => [item, ...prev]);
  }, [connectionMode]);

  // Calculate route whenever start, stops, destination, or preference changes
  const runRouteCalculation = useCallback(async (customParams = {}) => {
    const s = customParams.start !== undefined ? customParams.start : startLocation;
    const st = customParams.stops !== undefined ? customParams.stops : intermediateStops;
    const d = customParams.destination !== undefined ? customParams.destination : destinationLocation;
    const pref = customParams.preference || routePreference;

    if (!s || !d) {
      setRouteError('Please select both a Starting Point and a Destination.');
      return null;
    }

    setIsCalculatingRoute(true);
    setRouteError('');
    try {
      const response = await routeService.calculateRoute({
        start: s,
        stops: st,
        destination: d,
        preference: pref,
        scoringWeights
      });
      setCurrentRoute(response.selectedRoute);
      setRouteAlternatives(response.alternatives);
      setTotalRouteSearches((c) => c + 1);

      const newHistoryItem = {
        id: `rt-${Date.now()}`,
        name: `${s.name.split('—')[0].trim()}${st.length > 0 ? ` → +${st.length} Stop(s)` : ''} → ${d.name.split('(')[0].trim()}`,
        start: s.name,
        stops: st.map((x) => x.name),
        destination: d.name,
        distanceKm: response.selectedRoute.distanceKm,
        durationMin: response.selectedRoute.durationMin,
        accessibilityScore: response.selectedRoute.scoringDetails.overallScore,
        knownBarriers: response.selectedRoute.obstaclesOnRoute.length,
        timestamp: new Date().toISOString(),
        isDemo: response.isDemo
      };
      setRecentRoutes((prev) => [newHistoryItem, ...prev.slice(0, 9)]);
      recordUsageEvent('Route Calculation', 'Route Planner & Map', `Success (${response.selectedRoute.scoringDetails.overallScore}/100)`);
      return response;
    } catch (err) {
      const msg = err.message || 'Unable to calculate route.';
      setRouteError(msg);
      recordUsageEvent('Route Calculation', 'Route Planner & Map', `Failed: ${msg}`);
      addNotification({
        type: 'route_error',
        title: 'Route Calculation Error',
        message: msg
      });
      return null;
    } finally {
      setIsCalculatingRoute(false);
    }
  }, [startLocation, intermediateStops, destinationLocation, routePreference, scoringWeights, recordUsageEvent, addNotification]);

  // Initial route calculation on load
  useEffect(() => {
    runRouteCalculation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Waypoint helpers
  const addStop = (stopObj) => {
    const nextStops = [...intermediateStops, stopObj];
    setIntermediateStops(nextStops);
    runRouteCalculation({ stops: nextStops });
  };

  const removeStop = (index) => {
    const nextStops = intermediateStops.filter((_, idx) => idx !== index);
    setIntermediateStops(nextStops);
    runRouteCalculation({ stops: nextStops });
  };

  const updateStop = (index, updatedStop) => {
    const nextStops = intermediateStops.map((item, idx) => (idx === index ? updatedStop : item));
    setIntermediateStops(nextStops);
    runRouteCalculation({ stops: nextStops });
  };

  const moveStop = (index, direction) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= intermediateStops.length) return;
    const nextStops = [...intermediateStops];
    const temp = nextStops[index];
    nextStops[index] = nextStops[targetIdx];
    nextStops[targetIdx] = temp;
    setIntermediateStops(nextStops);
    runRouteCalculation({ stops: nextStops });
  };

  const swapStartAndDestination = () => {
    if (!startLocation && !destinationLocation) return;
    const newStart = destinationLocation;
    const newDest = startLocation;
    setStartLocation(newStart);
    setDestinationLocation(newDest);
    if (newStart && newDest) {
      runRouteCalculation({ start: newStart, destination: newDest });
    }
  };

  const clearAllLocations = () => {
    setStartLocation(null);
    setIntermediateStops([]);
    setDestinationLocation(null);
    setCurrentRoute(null);
    setRouteAlternatives([]);
  };

  const completeSplash = () => {
    setHasSeenSplash(true);
    safeSetStorage('eg_seen_splash', true);
  };

  const replaySplash = () => {
    setHasSeenSplash(false);
    safeSetStorage('eg_seen_splash', false);
  };

  const logout = () => {
    setIsAuthenticated(false);
    safeSetStorage('eg_authenticated', false);
    recordUsageEvent('User Logout', 'Authentication', 'Session Ended');
  };

  const value = {
    hasSeenSplash,
    completeSplash,
    replaySplash,
    currentUser,
    setCurrentUser,
    isAuthenticated,
    setIsAuthenticated,
    pendingAuth,
    setPendingAuth,
    logout,
    connectionMode,
    setConnectionMode,
    esp32Status,
    setEsp32Status,
    wheelchairStatus,
    setWheelchairStatus,
    sensorStatus,
    setSensorStatus,
    batteryLevel,
    setBatteryLevel,
    startLocation,
    setStartLocation,
    intermediateStops,
    setIntermediateStops,
    destinationLocation,
    setDestinationLocation,
    mapSelectionMode,
    setMapSelectionMode,
    routePreference,
    setRoutePreference,
    scoringWeights,
    setScoringWeights,
    currentRoute,
    setCurrentRoute,
    routeAlternatives,
    isCalculatingRoute,
    routeError,
    setRouteError,
    recentRoutes,
    setRecentRoutes,
    totalRouteSearches,
    runRouteCalculation,
    addStop,
    removeStop,
    updateStop,
    moveStop,
    swapStartAndDestination,
    clearAllLocations,
    favourites,
    setFavourites,
    warningThresholdCm,
    setWarningThresholdCm,
    sensorReadings,
    setSensorReadings,
    knownObstacles,
    setKnownObstacles,
    lastSensorUpdate,
    setLastSensorUpdate,
    wheelchairSpeed,
    setWheelchairSpeed,
    movementDirection,
    setMovementDirection,
    commandHistory,
    setCommandHistory,
    notifications,
    setNotifications,
    addNotification,
    activityLogs,
    setActivityLogs,
    analyticsRange,
    setAnalyticsRange,
    ANALYTICS_DEMO_DATASET,
    settings,
    setSettings,
    recordUsageEvent
  };

  return <EasyGoContext.Provider value={value}>{children}</EasyGoContext.Provider>;
}

export function useEasyGo() {
  const ctx = useContext(EasyGoContext);
  if (!ctx) {
    throw new Error('useEasyGo must be used within an EasyGoProvider');
  }
  return ctx;
}
