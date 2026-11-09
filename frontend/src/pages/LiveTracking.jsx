import React, { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Activity, Crosshair, RefreshCw, Signal, SignalZero } from 'lucide-react';

const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
const DEVICE_ID = import.meta.env.VITE_GPS_DEVICE_ID || 'easygo-wheelchair-01';
const wheelchairIcon = L.divIcon({ className: 'gps-marker', html: '<div style="background:#0891b2;color:white;border:3px solid white;border-radius:50%;width:38px;height:38px;display:grid;place-items:center;font-size:19px;box-shadow:0 2px 10px #0005">♿</div>', iconSize:[38,38], iconAnchor:[19,19] });
function Recenter({ position }) { const map=useMap(); useEffect(()=>{if(position) map.flyTo(position, Math.max(map.getZoom(),16), {duration:.7});},[position,map]); return null; }
export default function LiveTracking(){
 const [latest,setLatest]=useState(null), [history,setHistory]=useState([]), [error,setError]=useState(''), [loading,setLoading]=useState(true), [lastCheck,setLastCheck]=useState(null);
 const refresh=async()=>{try{const [a,b]=await Promise.all([fetch(`${API_BASE}/api/gps/latest?deviceId=${encodeURIComponent(DEVICE_ID)}`),fetch(`${API_BASE}/api/gps/history?deviceId=${encodeURIComponent(DEVICE_ID)}&limit=100`)]); if(!a.ok||!b.ok) throw new Error(`API error (${a.status}/${b.status})`); const latestJson=await a.json(), historyJson=await b.json();setLatest(latestJson);setHistory((historyJson.data||[]).slice().reverse());setError('');setLastCheck(new Date());}catch(e){setError(`${e.message}. Check VITE_API_BASE_URL and backend deployment.`);}finally{setLoading(false);}};
 useEffect(()=>{refresh();const t=setInterval(refresh,3000);return()=>clearInterval(t);},[]);
 const point=latest?.data; const position=point?[point.latitude,point.longitude]:null; const live=Boolean(latest?.isLive); const center=position||[10.8188,78.6869];
 const path=useMemo(()=>history.map(x=>[x.latitude,x.longitude]),[history]);
 const age=latest?.ageSeconds==null?null:Math.floor(latest.ageSeconds);
 return <div className="space-y-5">
  <div className="flex flex-wrap items-center justify-between gap-3"><div><h1 className="text-2xl font-extrabold">Live Wheelchair Tracking</h1><p className="text-sm text-slate-500">Real GPS coordinates reported by the ESP32 device</p></div><button onClick={refresh} className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-4 py-2 text-white font-semibold"><RefreshCw size={16}/> Refresh</button></div>
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
   <div className="eg-card rounded-2xl p-4"><div className="flex items-center gap-2 text-sm text-slate-500"><Activity size={16}/> Device status</div><div className={`mt-2 text-xl font-bold ${live?'text-emerald-600':'text-amber-600'}`}>{live?'LIVE':'OFFLINE / STALE'}</div><div className="text-xs text-slate-500 mt-1">{point?.deviceId||DEVICE_ID}</div></div>
   <div className="eg-card rounded-2xl p-4"><div className="flex items-center gap-2 text-sm text-slate-500"><Crosshair size={16}/> Coordinates</div><div className="mt-2 font-bold">{point?`${Number(point.latitude).toFixed(6)}, ${Number(point.longitude).toFixed(6)}`:'Waiting for GPS'}</div><div className="text-xs text-slate-500 mt-1">Accuracy: {point?.accuracy!=null?`${point.accuracy} m`:'—'}</div></div>
   <div className="eg-card rounded-2xl p-4"><div className="flex items-center gap-2 text-sm text-slate-500">{live?<Signal size={16}/>:<SignalZero size={16}/>} Last GPS update</div><div className="mt-2 text-xl font-bold">{age==null?'—':`${age}s ago`}</div><div className="text-xs text-slate-500 mt-1">Speed: {point?.speed!=null?`${point.speed} km/h`:'—'} · Satellites: {point?.satellites??'—'}</div></div>
  </div>
  {error&&<div className="rounded-xl border border-rose-300 bg-rose-50 text-rose-800 p-3 text-sm">{error}</div>}
  <div className="eg-card rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700"><div className="p-4 flex justify-between"><div className="font-bold">Live GPS map</div><span className="text-xs text-slate-500">Auto-refresh: 3 seconds</span></div><div className="h-[480px]"><MapContainer center={center} zoom={position?16:6} scrollWheelZoom style={{height:'100%',width:'100%'}}><TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/><Recenter position={position}/>{path.length>1&&<Polyline positions={path} pathOptions={{color:'#0891b2',weight:5}}/>}{position&&<Marker position={position} icon={wheelchairIcon}><Popup><b>{DEVICE_ID}</b><br/>GPS reported position<br/>{point?.recordedAt?new Date(point.recordedAt).toLocaleString():''}</Popup></Marker>}</MapContainer></div></div>
  <p className="text-xs text-slate-500">{loading?'Connecting to GPS service…':`Last server check: ${lastCheck?.toLocaleTimeString()||'—'}. ${live?'Location is recent.':'No recent GPS packet; marker is not guaranteed to be current.'}`}</p>
 </div>;
}
