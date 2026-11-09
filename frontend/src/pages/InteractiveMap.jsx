import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import {
  MapPin,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Repeat,
  Compass,
  Search,
  AlertTriangle,
  Navigation
} from 'lucide-react';
import { useEasyGo } from '../context/EasyGoContext';
import { mapService } from '../services/mapService';
import { DEMO_LOCATIONS } from '../data/demoData';

// Custom SVG DivIcons for distinct markers
function createPinIcon(bgColor, labelText) {
  return L.divIcon({
    className: 'easy-go-custom-pin',
    html: `<div style="background:${bgColor};color:#fff;width:30px;height:30px;border-radius:9999px;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:12px;border:3px solid #fff;box-shadow:0 4px 10px rgba(0,0,0,0.35);">${labelText}</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });
}

function MapClickSelectionHandler({ mode, onPickCoordinate }) {
  useMapEvents({
    click(e) {
      onPickCoordinate(e.latlng.lat, e.latlng.lng, mode);
    }
  });
  return null;
}

export default function InteractiveMap() {
  const {
    startLocation,
    setStartLocation,
    intermediateStops,
    destinationLocation,
    setDestinationLocation,
    mapSelectionMode,
    setMapSelectionMode,
    currentRoute,
     setCurrentRoute,
    routeAlternatives,
    isCalculatingRoute,
    runRouteCalculation,
    addStop,
    removeStop,
    moveStop,
    swapStartAndDestination,
    clearAllLocations,
    knownObstacles
  } = useEasyGo();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(DEMO_LOCATIONS.slice(0, 5));
  const [searching, setSearching] = useState(false);
  const [geoStatus, setGeoStatus] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearching(true);
    try {
      const results = await mapService.searchLocations(searchQuery);
      setSearchResults(results);
    } finally {
      setSearching(false);
    }
  };

  const applyLocationByMode = async (loc, explicitMode = mapSelectionMode) => {
    if (explicitMode === 'start') {
      setStartLocation(loc);
      if (destinationLocation) await runRouteCalculation({ start: loc });
    } else if (explicitMode === 'stop') {
      addStop(loc);
    } else {
      setDestinationLocation(loc);
      if (startLocation) await runRouteCalculation({ destination: loc });
    }
  };

  const handleMapClickCoordinate = async (lat, lng, mode) => {
    const resolved = await mapService.reverseGeocode(lat, lng);
    await applyLocationByMode(resolved, mode);
  };

  const handleUseBrowserGeolocation = () => {
    setGeoStatus('Requesting browser location permission...');
    if (!navigator.geolocation) {
      const fallback = DEMO_LOCATIONS[0];
      setStartLocation(fallback);
      setGeoStatus('Browser geolocation unavailable — set Start to Demo Home (Thillai Nagar).');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const resolved = await mapService.reverseGeocode(pos.coords.latitude, pos.coords.longitude);
        setStartLocation(resolved);
        setGeoStatus(`Current location set: ${resolved.name}`);
        if (destinationLocation) await runRouteCalculation({ start: resolved });
      },
      () => {
        const fallback = DEMO_LOCATIONS[0];
        setStartLocation(fallback);
        setGeoStatus('Location permission declined — using Demo Home (Thillai Nagar) as Starting Point.');
      }
    );
  };

  const centerPosition = startLocation
    ? [startLocation.lat, startLocation.lng]
    : [10.8188, 78.6869];

  return (
    <div className="space-y-6">
      {/* Header & Map Pin Mode Bar */}
      <div className="eg-card rounded-3xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold">
            Interactive Wheelchair Route Map — Start, Stops &amp; Destination
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Select a map pin placement mode below, then click anywhere on the map or pick from geocoded suggestions.
          </p>
        </div>

        {/* Explicit Map Selection Modes */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setMapSelectionMode('start')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition ${
              mapSelectionMode === 'start'
                ? 'bg-emerald-600 text-white border-emerald-500 shadow'
                : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700'
            }`}
          >
            Mode: Set Starting Point (Green)
          </button>
          <button
            type="button"
            onClick={() => setMapSelectionMode('stop')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition ${
              mapSelectionMode === 'stop'
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow'
                : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700'
            }`}
          >
            Mode: Add Stop (Orange)
          </button>
          <button
            type="button"
            onClick={() => setMapSelectionMode('destination')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition ${
              mapSelectionMode === 'destination'
                ? 'bg-red-600 text-white border-red-500 shadow'
                : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700'
            }`}
          >
            Mode: Set Destination (Red)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Sidebar: Search, Waypoints, Controls */}
        <div className="space-y-4">
          {/* Geocoding Search Box */}
          <div className="eg-card rounded-2xl p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <form onSubmit={handleSearch} className="flex gap-2 mb-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search address, hospital, college..."
                className="flex-1 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
              />
              <button
                type="submit"
                className="px-3.5 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold flex items-center gap-1"
              >
                <Search className="w-3.5 h-3.5" />
                <span>{searching ? '...' : 'Search'}</span>
              </button>
            </form>

            <button
              type="button"
              onClick={handleUseBrowserGeolocation}
              className="w-full mb-3 py-2 px-3 rounded-xl text-xs font-semibold bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30 flex items-center justify-center gap-1.5"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Use My Current Location as Start</span>
            </button>
            {geoStatus && <p className="text-[11px] text-cyan-500 mb-2">{geoStatus}</p>}

            <div className="space-y-1.5 max-h-44 overflow-y-auto">
              {searchResults.map((loc) => (
                <div
                  key={loc.id}
                  className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <div className="font-semibold truncate">{loc.name}</div>
                    <div className="text-[10px] text-slate-400 truncate">{loc.address}</div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => applyLocationByMode(loc, 'start')}
                      className="px-2 py-1 rounded bg-emerald-600 text-white text-[10px] font-bold"
                      title="Set as Starting Point"
                    >
                      Start
                    </button>
                    <button
                      type="button"
                      onClick={() => applyLocationByMode(loc, 'stop')}
                      className="px-2 py-1 rounded bg-amber-500 text-slate-950 text-[10px] font-bold"
                      title="Add as Intermediate Stop"
                    >
                      +Stop
                    </button>
                    <button
                      type="button"
                      onClick={() => applyLocationByMode(loc, 'destination')}
                      className="px-2 py-1 rounded bg-red-600 text-white text-[10px] font-bold"
                      title="Set as Final Destination"
                    >
                      Dest
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ordered Waypoints Manager */}
          <div className="eg-card rounded-2xl p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold">Ordered Route Waypoints</h2>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={swapStartAndDestination}
                  className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs flex items-center gap-1"
                  title="Swap Start and Destination"
                >
                  <Repeat className="w-3.5 h-3.5" />
                  <span>Swap</span>
                </button>
                <button
                  type="button"
                  onClick={clearAllLocations}
                  className="p-1.5 rounded-lg bg-red-500/15 text-red-500 text-xs"
                  title="Clear All Locations"
                >
                  Clear All
                </button>
              </div>
            </div>

            {/* Starting Point */}
            <div className="p-3 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-xs">
              <div className="font-bold text-emerald-600 dark:text-emerald-400">Starting Point (Green Pin)</div>
              {startLocation ? (
                <>
                  <div className="font-semibold mt-0.5">{startLocation.name}</div>
                  <div className="text-[11px] opacity-80">
                    {startLocation.lat.toFixed(4)}° N, {startLocation.lng.toFixed(4)}° E
                  </div>
                </>
              ) : (
                <div className="text-slate-400 italic">Click map or search to set Starting Point</div>
              )}
            </div>

            {/* Intermediate Stops */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-amber-500">
                <span>Intermediate Stops ({intermediateStops.length})</span>
                <button
                  type="button"
                  onClick={() => addStop(DEMO_LOCATIONS[7])}
                  className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-400"
                >
                  <Plus className="w-3 h-3" /> Add Sample Stop
                </button>
              </div>
              {intermediateStops.map((stop, idx) => (
                <div
                  key={`${stop.id || idx}-${idx}`}
                  className="p-2.5 rounded-xl border border-amber-500/40 bg-amber-500/10 text-xs flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <div className="font-bold text-amber-500">Stop {idx + 1}</div>
                    <div className="font-semibold truncate">{stop.name}</div>
                    <div className="text-[10px] opacity-75">
                      {stop.lat.toFixed(4)}° N, {stop.lng.toFixed(4)}° E
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => moveStop(idx, -1)}
                      disabled={idx === 0}
                      className="p-1 rounded bg-slate-800 text-white disabled:opacity-30"
                      aria-label="Move stop up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveStop(idx, 1)}
                      disabled={idx === intermediateStops.length - 1}
                      className="p-1 rounded bg-slate-800 text-white disabled:opacity-30"
                      aria-label="Move stop down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeStop(idx)}
                      className="p-1 rounded bg-red-600 text-white"
                      aria-label="Remove stop"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Destination */}
            <div className="p-3 rounded-xl border border-red-500/40 bg-red-500/10 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-red-500">Final Destination (Red Pin)</span>
                {destinationLocation && (
                  <button
                    type="button"
                    onClick={() => setDestinationLocation(null)}
                    className="text-[10px] text-red-400 underline"
                  >
                    Clear Destination
                  </button>
                )}
              </div>
              {destinationLocation ? (
                <>
                  <div className="font-semibold mt-0.5">{destinationLocation.name}</div>
                  <div className="text-[11px] opacity-80">
                    {destinationLocation.lat.toFixed(4)}° N, {destinationLocation.lng.toFixed(4)}° E
                  </div>
                </>
              ) : (
                <div className="text-slate-400 italic">Click map or search to set Destination</div>
              )}
            </div>

            <button
              type="button"
              onClick={() => runRouteCalculation()}
              disabled={isCalculatingRoute}
              className="w-full py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 text-white shadow-lg flex items-center justify-center gap-2"
            >
              <Navigation className="w-4 h-4" />
              <span>{isCalculatingRoute ? 'Calculating Accessible Route...' : 'Find Accessible Route'}</span>
            </button>
          </div>
        </div>

        {/* Map Canvas + Legend + Route Alternatives (2 columns) */}
        <div className="xl:col-span-2 space-y-4">
          <div className="eg-card rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 shadow-lg relative h-[480px]">
            <MapContainer center={centerPosition} zoom={14} className="w-full h-full z-10">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapClickSelectionHandler mode={mapSelectionMode} onPickCoordinate={handleMapClickCoordinate} />

              {startLocation && (
                <Marker position={[startLocation.lat, startLocation.lng]} icon={createPinIcon('#16A34A', 'S')}>
                  <Popup>
                    <strong>Starting Point:</strong> {startLocation.name}
                  </Popup>
                </Marker>
              )}

              {intermediateStops.map((st, idx) => (
                <Marker key={idx} position={[st.lat, st.lng]} icon={createPinIcon('#F59E0B', `${idx + 1}`)}>
                  <Popup>
                    <strong>Stop {idx + 1}:</strong> {st.name}
                  </Popup>
                </Marker>
              ))}

              {destinationLocation && (
                <Marker position={[destinationLocation.lat, destinationLocation.lng]} icon={createPinIcon('#DC2626', 'D')}>
                  <Popup>
                    <strong>Destination:</strong> {destinationLocation.name}
                  </Popup>
                </Marker>
              )}

              {knownObstacles.map((obs) => (
                <Marker key={obs.id} position={[obs.lat, obs.lng]} icon={createPinIcon('#7C2D12', '!')}>
                  <Popup>
                    <strong>Obstacle ({obs.severity}):</strong> {obs.title}
                    <br />
                    {obs.description}
                  </Popup>
                </Marker>
              ))}

              {currentRoute?.geometry && (
                <Polyline
                  positions={currentRoute.geometry}
                  pathOptions={{ color: '#22D3EE', weight: 6, opacity: 0.9 }}
                />
              )}
            </MapContainer>

            {/* Map Legend Overlay */}
            <div className="absolute bottom-4 left-4 z-20 p-3 rounded-2xl bg-slate-900/95 border border-slate-700 text-white text-xs shadow-xl flex flex-wrap items-center gap-3">
              <span className="font-bold text-cyan-300">Map Legend:</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-600 inline-block" /> Green: Starting Point</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-500 inline-block" /> Orange: Intermediate Stop</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-600 inline-block" /> Red: Final Destination</span>
              <span className="flex items-center gap-1.5"><span className="w-4 h-1.5 bg-cyan-400 inline-block" /> Cyan: Selected Route</span>
              <span className="flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> Warning: Known Obstacle</span>
            </div>
          </div>

          {/* Route Alternatives Selector */}
          {routeAlternatives.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {routeAlternatives.map((alt) => {
                const isSelected = currentRoute?.id === alt.id;
                return (
                  <button
                    key={alt.id}
                    type="button"
                    onClick={() => setCurrentRoute(alt)}
                    className={`p-4 rounded-2xl border text-left transition ${
                      isSelected
                        ? 'bg-blue-600/15 border-cyan-400 shadow-md'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold mb-1">
                      <span className="text-cyan-500">{alt.badge}</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-500">
                        Score {alt.scoringDetails.overallScore}/100
                      </span>
                    </div>
                    <div className="font-bold text-sm mb-1">{alt.name}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                      {alt.distanceKm} km • {alt.durationMin} mins • {alt.stopsCount} stop(s)
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">{alt.summary}</p>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
