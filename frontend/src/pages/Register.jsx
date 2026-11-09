import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react';
import EasyGoLogo from '../components/EasyGoLogo';
import { useEasyGo } from '../context/EasyGoContext';
import { authService } from '../services/authService';

export default function Register() {
  const { setPendingAuth } = useEasyGo();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [phone, setPhone] = useState('');
  const [wheelchairType, setWheelchairType] = useState('Electric Powered Wheelchair');
  const [maxSlopePercent, setMaxSlopePercent] = useState(6);
  const [verifyMethod, setVerifyMethod] = useState('email');
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!/^\d{7,14}$/.test(phone.replace(/\s+/g, ''))) {
      setError('Please enter a valid phone number (7–14 digits).');
      return;
    }
    if (!consent) {
      setError('Please accept the privacy policy consent to create an account.');
      return;
    }

    setLoading(true);
    try {
      const contact = verifyMethod === 'email' ? email.trim() : `${countryCode} ${phone.trim()}`;
      const otpRes = await authService.sendOtp({ contact, method: verifyMethod, isRegistration: true });
      setInfoMessage(otpRes.message);
      setPendingAuth({
        mode: 'register',
        method: verifyMethod,
        contact,
        userPayload: {
          name: fullName.trim(),
          email: email.trim(),
          countryCode,
          phone: phone.trim(),
          verifyMethod,
          accessibilityPreferences: {
            wheelchairType,
            maxSlopePercent: Number(maxSlopePercent),
            avoidUnpaved: true,
            requireCurbRamps: true
          }
        }
      });
      setTimeout(() => {
        navigate('/verify-otp');
      }, 600);
    } catch (err) {
      setError(err.message || 'Registration request failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-10 bg-[#0B1220] text-slate-100">
      <div className="w-full max-w-lg rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 shadow-2xl">
        <EasyGoLogo size={40} showTagline className="mb-5" />
        <h1 className="text-2xl font-bold mb-1">Create Accessible Mobility Account</h1>
        <p className="text-xs text-slate-400 mb-5">
          Personalize your wheelchair route profile and verify your preferred contact method.
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/15 border border-red-500/40 text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {infoMessage && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{infoMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1" htmlFor="reg-name">
              Full Name
            </label>
            <input
              id="reg-name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Karthik Narayanan"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1" htmlFor="reg-email">
                Email Address
              </label>
              <input
                id="reg-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="karthik@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1" htmlFor="reg-phone">
                Phone Number
              </label>
              <div className="flex gap-1.5">
                <select
                  aria-label="Country code"
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="px-2.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs"
                >
                  <option value="+91">+91</option>
                  <option value="+1">+1</option>
                  <option value="+44">+44</option>
                  <option value="+65">+65</option>
                </select>
                <input
                  id="reg-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9840123456"
                  className="flex-1 px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm"
                  required
                />
              </div>
            </div>
          </div>

          {/* Optional Accessibility Preferences */}
          <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-3">
            <div className="text-xs font-bold text-cyan-300">Optional Accessibility Preferences</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-300 mb-1">Mobility Device Type</label>
                <select
                  value={wheelchairType}
                  onChange={(e) => setWheelchairType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs"
                >
                  <option value="Electric Powered Wheelchair">Electric Powered Wheelchair</option>
                  <option value="Manual Wheelchair">Manual Wheelchair</option>
                  <option value="Mobility Scooter">Mobility Scooter</option>
                  <option value="Assisted Stroller / Walker">Assisted Walker / Rollator</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] text-slate-300 mb-1">
                  Preferred Max Ramp Slope ({maxSlopePercent}%)
                </label>
                <input
                  type="range"
                  min="3"
                  max="10"
                  value={maxSlopePercent}
                  onChange={(e) => setMaxSlopePercent(e.target.value)}
                  className="w-full accent-cyan-400"
                />
              </div>
            </div>
          </div>

          {/* Preferred Verification Channel */}
          <div>
            <span className="block text-xs font-semibold text-slate-300 mb-1.5">
              Select Contact Method to Verify via OTP
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setVerifyMethod('email')}
                className={`py-2 rounded-xl text-xs font-semibold border ${
                  verifyMethod === 'email'
                    ? 'bg-blue-600/25 border-cyan-400 text-cyan-300'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                Verify Email Address
              </button>
              <button
                type="button"
                onClick={() => setVerifyMethod('phone')}
                className={`py-2 rounded-xl text-xs font-semibold border ${
                  verifyMethod === 'phone'
                    ? 'bg-blue-600/25 border-cyan-400 text-cyan-300'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                Verify Phone Number
              </button>
            </div>
          </div>

          <label className="flex items-start gap-2.5 text-xs text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-0.5 accent-cyan-400"
            />
            <span>
              I consent to the EASY GO privacy policy. Personal addresses and favourite places are isolated to my account.
            </span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 text-white shadow-lg flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>{loading ? 'Sending Verification OTP...' : 'Continue to OTP Verification'}</span>
          </button>
        </form>

        <div className="mt-5 text-center text-xs text-slate-400">
          Already registered?{' '}
          <Link to="/login" className="text-cyan-400 font-semibold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
