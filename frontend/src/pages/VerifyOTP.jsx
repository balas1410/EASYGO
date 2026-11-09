import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, RefreshCw, Edit3, CheckCircle2, AlertCircle } from 'lucide-react';
import EasyGoLogo from '../components/EasyGoLogo';
import { useEasyGo } from '../context/EasyGoContext';
import { authService } from '../services/authService';

export default function VerifyOTP() {
  const { pendingAuth, setCurrentUser, setIsAuthenticated, recordUsageEvent, addNotification } = useEasyGo();
  const navigate = useNavigate();

  const [digits, setDigits] = useState(['1', '2', '3', '4', '5', '6']);
  const [countdown, setCountdown] = useState(120);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleDigitChange = (index, val) => {
    const clean = val.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[index] = clean;
    setDigits(next);
    if (clean && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const next = ['','','','','',''];
    for (let i = 0; i < 6; i++) {
      next[i] = pasted[i] || '';
    }
    setDigits(next);
    const focusIdx = Math.min(5, pasted.length);
    inputRefs.current[focusIdx]?.focus();
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    if (countdown === 0) {
      setError('OTP timer has expired. Please click Resend OTP.');
      return;
    }
    const otpCode = digits.join('');
    if (otpCode.length !== 6) {
      setError('Please enter all 6 digits.');
      return;
    }

    setLoading(true);
    try {
      const contact = pendingAuth?.contact || 'aarav.krishnan@easygo.demo';
      await authService.verifyOtp({
        contact,
        method: pendingAuth?.method || 'email',
        otpCode
      });

      if (pendingAuth?.mode === 'register' && pendingAuth?.userPayload) {
        const regRes = await authService.register(pendingAuth.userPayload);
        setCurrentUser(regRes.user);
        recordUsageEvent('Registration Complete', 'Auth / OTP', `Created Demo Profile: ${regRes.user.name}`);
      } else {
        recordUsageEvent('OTP Verified', 'Auth / OTP', `Verified ${contact} (Demo Mode)`);
      }

      setIsAuthenticated(true);
      setSuccess(true);
      addNotification({
        type: 'account_verified',
        title: 'Contact Verified (Demo Mode)',
        message: `Successfully verified ${contact}. Welcome to EASY GO!`
      });

      setTimeout(() => {
        navigate('/dashboard');
      }, 650);
    } catch (err) {
      setError(err.message || 'Verification failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setCountdown(120);
    setDigits(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-10 bg-[#0B1220] text-slate-100">
      <div className="w-full max-w-md rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 shadow-2xl">
        <EasyGoLogo size={40} className="mb-5" />
        <h1 className="text-2xl font-bold mb-1">Verify Six-Digit OTP</h1>
        <p className="text-xs text-slate-400 mb-4">
          Target Contact:{' '}
          <span className="text-cyan-300 font-semibold">
            {pendingAuth?.contact || 'aarav.krishnan@easygo.demo'}
          </span>
        </p>

        <div className="mb-5 p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-xs text-amber-200">
          <strong>Demo Mode Transparency:</strong> No external SMS/Email OTP gateway is connected. Pre-filled demo code{' '}
          <code className="px-1.5 py-0.5 rounded bg-slate-950 text-cyan-300 font-mono">123456</code> or any 6 digits can be used to test verification.
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/15 border border-red-500/40 text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>OTP Verified! Opening Smart Mobility Command Center...</span>
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-5">
          <div className="flex justify-between gap-2" onPaste={handlePaste}>
            {digits.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => {
                  inputRefs.current[idx] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                aria-label={`OTP digit ${idx + 1}`}
                value={digit}
                onChange={(e) => handleDigitChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="w-12 h-14 text-center text-xl font-bold rounded-xl bg-slate-800 border border-slate-700 focus:border-cyan-400 focus:outline-none"
              />
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>
              {countdown > 0 ? (
                <>Code expires in <strong className="text-cyan-300">{countdown}s</strong></>
              ) : (
                <strong className="text-red-400">Code Expired</strong>
              )}
            </span>
            <button
              type="button"
              onClick={handleResend}
              className="inline-flex items-center gap-1 text-cyan-400 hover:underline font-semibold"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Resend OTP</span>
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 text-white shadow-lg flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{loading ? 'Verifying...' : 'Verify OTP & Enter Dashboard'}</span>
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-slate-800 flex justify-between items-center text-xs">
          <button
            type="button"
            onClick={() => navigate(pendingAuth?.mode === 'register' ? '/register' : '/login')}
            className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Contact Details</span>
          </button>
        </div>
      </div>
    </div>
  );
}
