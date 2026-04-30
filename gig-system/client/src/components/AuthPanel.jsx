import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useLang } from '../context/LangContext.jsx';
import { resendCampusOtp, verifyCampusEmail } from '../api.js';
import welcomeStudent from '../assets/brand/photos/welcome-student.jpg';

export default function AuthPanel() {
  const { login, signup, refreshUser } = useAuth();
  const { t } = useLang();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'buyer',
    university: '',
    universityEmail: '',
    department: '',
    studentId: '',
  });
  const [otp, setOtp] = useState('123456');
  const [needsVerification, setNeedsVerification] = useState(false);
  const [verificationHint, setVerificationHint] = useState('');
  const [otpCooldown, setOtpCooldown] = useState(0);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const isSellerSignup = mode === 'signup' && form.role === 'seller';
  const universityHint = useMemo(
    () =>
      isSellerSignup
        ? 'FSc, college, or university students can apply. Add a Pakistani education email if available.'
        : '',
    [isSellerSignup],
  );

  useEffect(() => {
    if (!otpCooldown) return undefined;
    const timer = setInterval(() => {
      setOtpCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [otpCooldown]);

  const submit = async (event) => {
    event.preventDefault();
    setStatus('');
    try {
      setLoading(true);
      if (mode === 'login') {
        await login({ email: form.email, password: form.password });
        setNeedsVerification(false);
        setStatus('Welcome back.');
      } else {
        const response = await signup(form);
        if (response?.verificationRequired) {
          setNeedsVerification(true);
          setVerificationHint(response?.verificationHint || 'Complete student verification to unlock gig creation.');
          setOtpCooldown(60);
          setStatus(response?.verificationHint || 'Complete student verification to unlock gig creation.');
        } else {
          setNeedsVerification(false);
          setStatus('Account created successfully.');
        }
      }
    } catch (error) {
      setStatus(error?.response?.data?.error || 'Auth failed');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setStatus('');
    try {
      setLoading(true);
      await verifyCampusEmail({ email: form.email, otp });
      await refreshUser();
      setNeedsVerification(false);
      setVerificationHint('');
      setStatus('Campus verification complete. You can now create gigs.');
    } catch (error) {
      setStatus(error?.response?.data?.error || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    setStatus('');
    try {
      setLoading(true);
      const response = await resendCampusOtp({ email: form.email });
      setOtpCooldown(60);
      setStatus(response?.message || 'OTP resent. Use the demo code 123456.');
    } catch (error) {
      setStatus(error?.response?.data?.error || 'Could not resend OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setStatus('');
    setGoogleLoading(true);
    try {
      const res = await fetch('/api/auth/google');
      const data = await res.json();
      if (!res.ok) {
        setStatus(data?.error || 'Google OAuth is not ready yet.');
      } else if (data?.url) {
        window.location.href = data.url;
      } else {
        setStatus('Google OAuth is being prepared. Please use email/password for now.');
      }
    } catch {
      setStatus('Google OAuth is not reachable right now.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="card overflow-hidden p-0">
      <div className="grid gap-0 md:grid-cols-[0.9fr,1.1fr]">
        <div className="relative bg-gradient-to-br from-[#8C2F40] via-[#A13C4C] to-[#6B1D2A] text-white">
          <div className="absolute inset-0">
            <img
              src={welcomeStudent}
              alt="Student creator"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="hidden">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">Success starts here</p>
            <h2 className="font-display text-3xl font-semibold">Create your UniHire account</h2>
            <ul className="space-y-3 text-sm text-white/80">
              <li>✓ Over 700 campus-friendly categories</li>
              <li>✓ Quality work done faster</li>
              <li>✓ Access to verified students across Pakistan</li>
            </ul>
            <div className="mt-auto rounded-2xl bg-white/10 px-4 py-3 text-xs text-white/70">
              Additional verification may be required at a later stage.
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-semibold">{t('account')}</h3>
              <p className="text-xs text-muted">Already have an account? {mode === 'signup' ? 'Sign in' : 'Sign up'}</p>
            </div>
            <div className="flex gap-2">
              <button
                className={`rounded-full px-4 py-1 text-sm ${mode === 'login' ? 'bg-primary text-white' : 'bg-base'}`}
                onClick={() => {
                  setMode('login');
                  setNeedsVerification(false);
                  setStatus('');
                }}
                type="button"
              >
                {t('login')}
              </button>
              <button
                className={`rounded-full px-4 py-1 text-sm ${mode === 'signup' ? 'bg-primary text-white' : 'bg-base'}`}
                onClick={() => {
                  setMode('signup');
                  setStatus('');
                }}
                type="button"
              >
                {t('signup')}
              </button>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <button
              className="w-full rounded-2xl border border-border-color bg-[#F3F7FA] px-4 py-3 text-sm font-semibold text-ink hover:border-primary transition disabled:cursor-not-allowed disabled:opacity-70"
              type="button"
              onClick={handleGoogle}
              disabled={googleLoading}
            >
              {googleLoading ? 'Connecting Google...' : 'Continue with Google'}
            </button>
            <button className="w-full rounded-2xl border border-border-color bg-[#F3F7FA] px-4 py-3 text-sm font-semibold text-ink hover:border-primary transition" type="button">
              Continue with Apple
            </button>
            <button className="w-full rounded-2xl border border-border-color bg-[#F3F7FA] px-4 py-3 text-sm font-semibold text-ink hover:border-primary transition" type="button">
              Continue with Facebook
            </button>
            <p className="text-xs text-muted">
              Google OAuth status: <span className="font-semibold text-ink">Connecting soon</span>
            </p>
            <div className="flex items-center gap-3 text-xs text-muted">
              <span className="h-px flex-1 bg-[#E5E7EB]" />
              or
              <span className="h-px flex-1 bg-[#E5E7EB]" />
            </div>
          </div>

          <form onSubmit={submit} className="mt-4 space-y-3">
        {mode === 'signup' && (
          <input
            className="w-full rounded-2xl border border-border-color bg-[#F3F7FA] px-4 py-2"
            placeholder="Full name"
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            required
          />
        )}
        <input
          className="w-full rounded-2xl border border-border-color bg-[#F3F7FA] px-4 py-2"
          placeholder={mode === 'signup' ? 'Email' : 'Email'}
          type="email"
          value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
          required
        />
        <input
          className="w-full rounded-2xl border border-border-color bg-[#F3F7FA] px-4 py-2"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(event) => setForm({ ...form, password: event.target.value })}
          required
        />
        {mode === 'signup' && (
          <>
            <select
              className="w-full rounded-2xl border border-border-color bg-[#F3F7FA] px-4 py-2"
              value={form.role}
              onChange={(event) => setForm({ ...form, role: event.target.value })}
            >
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
            </select>
            {form.role === 'seller' && (
              <div className="space-y-3">
                <input
                  className="w-full rounded-2xl border border-border-color bg-[#F3F7FA] px-4 py-2"
                  placeholder="College / University / Institute"
                  value={form.university}
                  onChange={(event) => setForm({ ...form, university: event.target.value })}
                />
                <input
                  className="w-full rounded-2xl border border-border-color bg-[#F3F7FA] px-4 py-2"
                  placeholder="Education email (optional if not available)"
                  type="email"
                  value={form.universityEmail}
                  onChange={(event) => setForm({ ...form, universityEmail: event.target.value })}
                />
                <p className="text-xs text-muted">{universityHint}</p>
                <div className="grid gap-3 md:grid-cols-2">
                  <input
                    className="w-full rounded-2xl border border-border-color bg-[#F3F7FA] px-4 py-2"
                    placeholder="Class / Department / Program"
                    value={form.department}
                    onChange={(event) => setForm({ ...form, department: event.target.value })}
                  />
                  <input
                    className="w-full rounded-2xl border border-border-color bg-[#F3F7FA] px-4 py-2"
                    placeholder="Student ID / Roll number"
                    value={form.studentId}
                    onChange={(event) => setForm({ ...form, studentId: event.target.value })}
                  />
                </div>
              </div>
            )}
          </>
        )}
        <button className="btn-primary w-full" disabled={loading}>
          {loading ? 'Please wait...' : mode === 'signup' ? 'Create account' : 'Continue'}
        </button>
          </form>

          {needsVerification && mode === 'signup' && (
            <div className="mt-4 rounded-3xl border border-border-color bg-[#F3F7FA] p-4">
              <p className="text-sm font-semibold text-ink">{t('campusVerification')}</p>
              <p className="mt-1 text-xs text-muted">
                {verificationHint || 'Enter the demo OTP 123456 to verify your student account.'}
              </p>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                <input
                  className="flex-1 rounded-2xl border border-border-color bg-white px-4 py-2"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(event) => setOtp(event.target.value)}
                />
                <button className="btn-secondary" type="button" onClick={verifyOtp} disabled={loading}>
                  {t('verify')}
                </button>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted">
                <span>Didn&apos;t receive it?</span>
                <button
                  type="button"
                  onClick={resendOtp}
                  disabled={loading || otpCooldown > 0}
                  className={`font-semibold ${otpCooldown > 0 ? 'text-muted' : 'text-primary'}`}
                >
                  {otpCooldown > 0 ? `Resend in ${otpCooldown}s` : t('resendOtp')}
                </button>
              </div>
            </div>
          )}

          {status && <p className="mt-3 text-sm text-primary">{status}</p>}
        </div>
      </div>
    </div>
  );
}
