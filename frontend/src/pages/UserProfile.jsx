import React, { useState } from 'react';
import { User, Mail, Phone, ShieldCheck, Calendar, Save, CheckCircle2 } from 'lucide-react';
import { useEasyGo } from '../context/EasyGoContext';
import { userService } from '../services/userService';

export default function UserProfile() {
  const { currentUser, setCurrentUser, activityLogs, recordUsageEvent } = useEasyGo();

  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [role, setRole] = useState(currentUser?.role || 'admin');
  const [wheelchairType, setWheelchairType] = useState(
    currentUser?.accessibilityPreferences?.wheelchairType || 'Electric Powered Wheelchair'
  );
  const [maxSlopePercent, setMaxSlopePercent] = useState(
    currentUser?.accessibilityPreferences?.maxSlopePercent || 6
  );
  const [savedBanner, setSavedBanner] = useState('');

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    const updatedUser = {
      ...currentUser,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      role,
      accessibilityPreferences: {
        ...currentUser?.accessibilityPreferences,
        wheelchairType,
        maxSlopePercent: Number(maxSlopePercent)
      }
    };
    await userService.updateProfile(updatedUser);
    setCurrentUser(updatedUser);
    setSavedBanner('Profile and accessibility preferences updated (Demo Account Storage).');
    recordUsageEvent('Profile Updated', 'User Profile', `Updated ${updatedUser.name}`);
  };

  return (
    <div className="space-y-6">
      <div className="eg-card rounded-3xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <h1 className="text-xl sm:text-2xl font-extrabold">User Profile &amp; Mobility Preferences</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Manage your verified contact details, mobility device profile, and recent session activity.
        </p>
      </div>

      {savedBanner && (
        <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-xs text-emerald-400 font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{savedBanner}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form
          onSubmit={handleSaveProfile}
          className="lg:col-span-2 eg-card rounded-2xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 text-xs"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-700"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-700"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-700"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Demo Account Role (RBAC Testing)</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-700"
              >
                <option value="admin">Administrator (Can View System Analytics)</option>
                <option value="user">Standard User (Personal Data Only)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-200 dark:border-slate-800">
            <div>
              <label className="block font-semibold mb-1">Primary Mobility Device</label>
              <select
                value={wheelchairType}
                onChange={(e) => setWheelchairType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-700"
              >
                <option value="Electric Powered Wheelchair">Electric Powered Wheelchair</option>
                <option value="Manual Wheelchair">Manual Wheelchair</option>
                <option value="Mobility Scooter">Mobility Scooter</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-1">Preferred Maximum Ramp Slope ({maxSlopePercent}%)</label>
              <input
                type="range"
                min="3"
                max="10"
                value={maxSlopePercent}
                onChange={(e) => setMaxSlopePercent(e.target.value)}
                className="w-full accent-cyan-400 mt-2"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3 text-slate-400">
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <ShieldCheck className="w-4 h-4" /> Verified ({currentUser?.verifiedMethod || 'Demo OTP'})
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" /> Joined {new Date(currentUser?.createdAt || '2026-06-14').toLocaleDateString()}
              </span>
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold"
            >
              <Save className="w-4 h-4" />
              <span>Save Profile</span>
            </button>
          </div>
        </form>

        {/* Recent Personal Activity */}
        <div className="eg-card rounded-2xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <h2 className="text-sm font-bold mb-3">Recent Account Activity</h2>
          <div className="space-y-2.5 max-h-80 overflow-y-auto text-xs">
            {activityLogs.slice(0, 6).map((act) => (
              <div
                key={act.id}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800"
              >
                <div className="flex justify-between font-bold">
                  <span>{act.activityType}</span>
                  <span className="text-[10px] text-slate-400">{act.timestamp}</span>
                </div>
                <div className="text-cyan-400 text-[11px]">{act.module} — {act.result}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
