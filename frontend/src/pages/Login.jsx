import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Phone, ShieldCheck, ArrowRight, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import EasyGoLogo from '../components/EasyGoLogo';
import { useEasyGo } from '../context/EasyGoContext';
import { authService } from '../services/authService';
import { DEMO_USERS } from '../data/demoData';

const COUNTRY_CODES = [
  { code: '+91', label: 'India (+91)' },
  { code: '+1', label: 'USA/Canada (+1)' },
  { code: '+44', label: 'UK (+44)' },
  { code: '+61', label: 'Australia (+61)' },
  { code: '+65', label: 'Singapore (+65)' }
];

export default function Login() {
  const { setPendingAuth, setCurrentUser, setIsAuthenticated, recordUsageEvent, replaySplash } = useEasyGo();
  const navigate = useNavigate();

  const [loginMethod, setLoginMethod] = useState('email'); // 'email' | 'phone'
  const [email, setEmail] = useState('aarav.krishnan@easygo.demo');
  const [countryCode, setCountryCode] = useState('+91');
  const [phone, setPhone] = useState('9840123456');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const validateForm = () => {
    if (loginMethod === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        setError('Please enter a valid email address (e.g. name@domain.com).');
        return false;
      }
    } else {
      const cleanPhone = phone.replace(/\s+/g, '');
      if (!/^\d{7,14}$/.test(cleanPhone)) {
        setError('Please enter a valid 7 to 14 digit phone number.');
        return false;
      }
    }
    return true;
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    if (!validateForm()) return;

    setLoading(true);
    try {
      const contact = loginMethod === 'email' ? email.trim() : `${countryCode} ${phone.trim()}`;
      const res = await authService.sendOtp({ contact, method: loginMethod, isRegistration: false });
      setSuccessMsg(res.message);
      setPendingAuth({
        mode: 'login',
        method: loginMethod,
        contact,
        email: loginMethod === 'email' ? email.trim() : 'aarav.krishnan@easygo.demo',
        phone: loginMethod === 'phone' ? `${countryCode} ${phone.trim()}` : '+91 98401 23456'
      });
      setTimeout(() => {
        navigate('/verify-otp');
      }, 600);
    } catch (err) {
      setError(err.message || 'Unable to initiate OTP verification.');
    } finally {
      setLoading(false);
    }
  };

  const handleInstantDemoLogin = (demoUser) => {
    setCurrentUser(demoUser);
    setIsAuthenticated(true);
    recordUsageEvent('User Login', 'Auth / Demo Quick Sign-In', `Signed in as ${demoUser.name}`);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-10 bg-[#0B1220] text-slate-100">
      <div className="w-full max-w-md rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <EasyGoLogo size={42} showTagline />
          <button
            type="button"
            onClick={() => {
              replaySplash();
              navigate('/splash');
            }}
            className="text-xs text-cyan-400 hover:underline"
          >
            Replay Intro
          </button>
        </div>

        <h1 className="text-2xl font-bold mb-1">Welcome Back</h1>
        <p className="text-xs text-slate-400 mb-6">
          Sign in via Email or Phone OTP verification, or launch Demo Mode directly.
        </p>

        {/* Method Switcher */}
        <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-slate-800/90 mb-5">
          <button
            type="button"
            onClick={() => {
              setLoginMethod('email');
              setError('');
            }}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition ${
              loginMethod === 'email'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Email Login</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setLoginMethod('phone');
              setError('');
            }}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition ${
              loginMethod === 'phone'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Phone className="w-4 h-4" />
            <span>Phone Login</span>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/15 border border-red-500/40 text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSendOtp} className="space-y-4">
          {loginMethod === 'email' ? (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5" htmlFor="login-email">
                Email Address
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm focus:outline-none focus:border-cyan-400"
                required
              />
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5" htmlFor="login-phone">
                Phone Number with Country Code
              </label>
              <div className="flex gap-2">
                <select
                  aria-label="Country code"
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs focus:outline-none focus:border-cyan-400"
                >
                  {COUNTRY_CODES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.label}
                    </option>
                  ))}
                </select>
                <input
                  id="login-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9840123456"
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 text-white shadow-lg shadow-blue-600/25 hover:opacity-95 transition flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Preparing Verification...' : 'Send OTP'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Clearly Labeled Demo Mode Quick Access */}
        <div className="mt-6 pt-5 border-t border-slate-800">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-300 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Clearly Labeled Demo Mode (No Live SMS/Email Gateway Required)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleInstantDemoLogin(DEMO_USERS[0])}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 border border-slate-700 text-left"
            >
              <div className="text-white">Demo Admin</div>
              <div className="text-[11px] text-slate-400">Aarav Krishnan</div>
            </button>
            <button
              type="button"
              onClick={() => handleInstantDemoLogin(DEMO_USERS[1])}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 border border-slate-700 text-left"
            >
              <div className="text-white">Demo Standard User</div>
              <div className="text-[11px] text-slate-400">Meera Sundaram</div>
            </button>
          </div>
        </div>

        <div className="mt-5 text-center text-xs text-slate-400">
          New to EASY GO?{' '}
          <Link to="/register" className="text-cyan-400 font-semibold hover:underline">
            Register New Account
          </Link>
        </div>

        <div className="mt-5 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
          <span>
            Privacy Notice: EASY GO never stores plaintext passwords or real OTP secrets in localStorage. Real OTP delivery requires configuring a backend SMS/Email provider.
          </span>
        </div>
      </div>
    </div>
  );
}
