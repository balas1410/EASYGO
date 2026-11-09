import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Plus, Edit3, Trash2, Search, MapPin, BookmarkCheck, ShieldCheck } from 'lucide-react';
import { useEasyGo } from '../context/EasyGoContext';
import { favouriteService } from '../services/favouriteService';

const CATEGORIES = ['Home', 'College', 'Hospital', 'Workplace', 'Public Location', 'Custom'];

export default function FavouritePlaces() {
  const {
    favourites,
    setFavourites,
    setStartLocation,
    addStop,
    setDestinationLocation,
    currentRoute,
    startLocation,
    destinationLocation,
    runRouteCalculation,
    recordUsageEvent
  } = useEasyGo();

  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [lat, setLat] = useState('10.8210');
  const [lng, setLng] = useState('78.6850');
  const [category, setCategory] = useState('Public Location');
  const [notes, setNotes] = useState('');
  const [statusMsg, setStatusMsg] = useState('');

  const filteredFavourites = favourites.filter(
    (f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.category && f.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSaveFavourite = async (e) => {
    e.preventDefault();
    if (!name.trim() || !address.trim()) return;

    const payload = {
      name: name.trim(),
      address: address.trim(),
      lat: parseFloat(lat) || 10.8210,
      lng: parseFloat(lng) || 78.6850,
      category,
      notes: notes.trim()
    };

    if (editingId) {
      const updated = await favouriteService.updateFavourite(editingId, payload);
      setFavourites((prev) => prev.map((item) => (item.id === editingId ? { ...item, ...updated } : item)));
      setStatusMsg(`Updated favourite "${payload.name}" (Demo Local Account Storage).`);
      recordUsageEvent('Favourite Updated', 'Favourite Places', payload.name);
      setEditingId(null);
    } else {
      const created = await favouriteService.createFavourite(payload);
      setFavourites((prev) => [created, ...prev]);
      setStatusMsg(`Saved "${payload.name}" to Favourite Places (Demo Local Account Storage).`);
      recordUsageEvent('Favourite Created', 'Favourite Places', payload.name);
    }

    setName('');
    setAddress('');
    setNotes('');
  };

  const startEdit = (fav) => {
    setEditingId(fav.id);
    setName(fav.name);
    setAddress(fav.address);
    setLat(String(fav.lat));
    setLng(String(fav.lng));
    setCategory(fav.category || 'Custom');
    setNotes(fav.notes || '');
  };

  const confirmDelete = async (id) => {
    const target = favourites.find((f) => f.id === id);
    await favouriteService.deleteFavourite(id);
    setFavourites((prev) => prev.filter((f) => f.id !== id));
    setDeleteConfirmId(null);
    setStatusMsg(`Deleted "${target?.name || 'Location'}" from Favourite Places.`);
    recordUsageEvent('Favourite Deleted', 'Favourite Places', target?.name || id);
  };

  const handleSaveCurrentJourneyEndpoint = async () => {
    if (!destinationLocation) return;
    const created = await favouriteService.createFavourite({
      name: `Saved Journey: ${destinationLocation.name}`,
      address: destinationLocation.address || 'Saved from completed journey',
      lat: destinationLocation.lat,
      lng: destinationLocation.lng,
      category: 'Custom',
      notes: `Completed route from ${startLocation?.name || 'Origin'} (${currentRoute?.distanceKm || 2.4} km, Score ${currentRoute?.scoringDetails?.overallScore || 86}/100)`
    });
    setFavourites((prev) => [created, ...prev]);
    setStatusMsg('Saved current journey destination for future reuse.');
  };

  return (
    <div className="space-y-6">
      <div className="eg-card rounded-3xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold">Favourite Places — Home, College, Hospital &amp; Custom</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Isolated per authenticated user account. In Demo Mode, places are stored in local demo storage with a clear label.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSaveCurrentJourneyEndpoint}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-500 text-slate-950 font-bold text-xs shadow"
        >
          <BookmarkCheck className="w-4 h-4" />
          <span>Save Completed Journey for Future Reuse</span>
        </button>
      </div>

      {statusMsg && (
        <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-500 font-semibold">
          {statusMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add / Edit Form */}
        <div className="eg-card rounded-2xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <h2 className="text-base font-bold mb-3 flex items-center gap-2">
            <Plus className="w-4 h-4 text-cyan-500" />
            <span>{editingId ? 'Edit Saved Place' : 'Add New Favourite Place'}</span>
          </h2>
          <form onSubmit={handleSaveFavourite} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold mb-1">Custom Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Home — Thillai Nagar / City Hospital"
                className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Street Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Full street address"
                className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold mb-1">Latitude</label>
                <input
                  type="number"
                  step="any"
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Longitude</label>
                <input
                  type="number"
                  step="any"
                  value={lng}
                  onChange={(e) => setLng(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block font-semibold mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-1">Accessibility Notes (Optional)</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. East entrance has 1:16 ramp and automatic door..."
                className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold"
              >
                {editingId ? 'Save Changes' : 'Save Favourite Place'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setName('');
                    setAddress('');
                    setNotes('');
                  }}
                  className="px-3 py-2.5 rounded-xl bg-slate-700 text-white font-semibold"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div className="mt-4 p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-[11px] text-slate-500 dark:text-slate-400 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
            <span>
              Privacy Protection: Personal addresses are scoped strictly to the authenticated user and never exposed to other accounts.
            </span>
          </div>
        </div>

        {/* Saved Places Grid */}
        <div className="lg:col-span-2 space-y-4">
          <div className="eg-card rounded-2xl p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search saved places by name, category (Home, Hospital, College), or address..."
              className="w-full bg-transparent text-xs focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredFavourites.map((fav) => (
              <div
                key={fav.id}
                className="eg-card rounded-2xl p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded-md bg-cyan-500/15 text-cyan-500 text-[10px] font-bold uppercase">
                      {fav.category || 'Saved'}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => startEdit(fav)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-cyan-400"
                        aria-label="Edit favourite"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(fav.id)}
                        className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-500"
                        aria-label="Delete favourite"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-bold text-sm">{fav.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{fav.address}</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Coordinates: {Number(fav.lat).toFixed(4)}° N, {Number(fav.lng).toFixed(4)}° E
                  </p>
                  {fav.notes && (
                    <p className="mt-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/70 text-[11px] text-slate-600 dark:text-slate-300">
                      {fav.notes}
                    </p>
                  )}
                </div>

                {/* In-card Delete Confirmation Modal State */}
                {deleteConfirmId === fav.id ? (
                  <div className="p-2.5 rounded-xl bg-red-500/15 border border-red-500/40 text-xs flex items-center justify-between">
                    <span className="font-semibold text-red-400">Confirm delete?</span>
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => confirmDelete(fav.id)}
                        className="px-2.5 py-1 rounded bg-red-600 text-white font-bold"
                      >
                        Yes, Delete
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(null)}
                        className="px-2.5 py-1 rounded bg-slate-700 text-white"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px] font-bold">
                    <button
                      type="button"
                      onClick={() => {
                        setStartLocation(fav);
                        runRouteCalculation({ start: fav });
                        navigate('/route-planner');
                      }}
                      className="py-1.5 rounded-lg bg-emerald-600/20 text-emerald-500 hover:bg-emerald-600 hover:text-white transition"
                    >
                      Set as Start
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        addStop(fav);
                        navigate('/route-planner');
                      }}
                      className="py-1.5 rounded-lg bg-amber-500/20 text-amber-500 hover:bg-amber-500 hover:text-slate-950 transition"
                    >
                      + Add Stop
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDestinationLocation(fav);
                        runRouteCalculation({ destination: fav });
                        navigate('/route-planner');
                      }}
                      className="py-1.5 rounded-lg bg-red-600/20 text-red-500 hover:bg-red-600 hover:text-white transition"
                    >
                      Set Destination
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
