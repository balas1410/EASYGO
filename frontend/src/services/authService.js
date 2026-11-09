const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

/**
 * Authentication Service (Proposed API Contracts:
 * POST /api/auth/register
 * POST /api/auth/send-otp
 * POST /api/auth/verify-otp
 * POST /api/auth/login)
 * Never stores plaintext passwords or real OTP secrets in frontend code.
 */
export const authService = {
  async sendOtp({ contact, method, isRegistration = false }) {
    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/send-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contact, method, isRegistration })
        });
        if (res.ok) return await res.json();
      } catch (_err) {
        // Fallback to clearly labeled demo mode when backend is unavailable
      }
    }
    await new Promise((r) => setTimeout(r, 450));
    return {
      success: true,
      isDemo: true,
      expiresInSeconds: 120,
      message: `Demo Mode: Backend OTP provider is not connected. Enter any 6-digit code (e.g. 123456) to simulate verification for ${contact}.`
    };
  },

  async verifyOtp({ contact, method, otpCode }) {
    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contact, method, otpCode })
        });
        if (res.ok) return await res.json();
      } catch (_err) {
        // Fallback to demo verification
      }
    }
    await new Promise((r) => setTimeout(r, 450));
    if (!otpCode || otpCode.length !== 6 || !/^\d{6}$/.test(otpCode)) {
      throw new Error('Please enter a valid 6-digit numeric verification code.');
    }
    return {
      success: true,
      isDemo: true,
      sessionToken: `demo-jwt-session-${Date.now()}`,
      verifiedAt: new Date().toISOString()
    };
  },

  async register(userPayload) {
    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userPayload)
        });
        if (res.ok) return await res.json();
      } catch (_err) {
        // Fallback to demo registration
      }
    }
    await new Promise((r) => setTimeout(r, 400));
    return {
      success: true,
      isDemo: true,
      user: {
        id: `usr-${Date.now()}`,
        name: userPayload.name,
        email: userPayload.email,
        phone: `${userPayload.countryCode || '+91'} ${userPayload.phone}`,
        countryCode: userPayload.countryCode || '+91',
        role: 'user',
        verified: true,
        verifiedMethod: `${userPayload.verifyMethod === 'phone' ? 'Phone' : 'Email'} (Demo Mode)`,
        createdAt: new Date().toISOString(),
        accessibilityPreferences: userPayload.accessibilityPreferences || {
          wheelchairType: 'Electric Powered Wheelchair',
          maxSlopePercent: 6,
          avoidUnpaved: true,
          requireCurbRamps: true
        }
      }
    };
  }
};
