import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { translations } from '../../data/translations';

export const GoogleAuthScreen = ({ onLoginSuccess, onSkip, currentLang = 'en' }) => {
  const { loginWithGoogle, login, register, setAuthRole } = useAuth();
  const [selectedRole, setSelectedRole] = useState('buyer'); // 'buyer' or 'artisan'
  const [authMethod, setAuthMethod] = useState('google'); // 'google' or 'email'
  const [isSignUp, setIsSignUp] = useState(false); // for email auth: false = Sign In, true = Sign Up
  
  // Email form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pehchanId, setPehchanId] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const t = translations[currentLang] || translations.en;

  // Real or Simulated Google Auth
  const handleGoogleSignIn = async (customProfile = null) => {
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      let profilePayload;

      if (customProfile) {
        profilePayload = {
          ...customProfile,
          role: selectedRole
        };
      } else {
        const isArtisan = selectedRole === 'artisan';
        profilePayload = {
          email: isArtisan ? 'artisan.yashoda@kalasetu.gov.in' : 'patron.aarav@kalasetu.gov.in',
          name: isArtisan ? 'Smt. Yashoda Bai' : 'Aarav Sharma',
          picture: isArtisan
            ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
            : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
          role: selectedRole,
          pehchanId: isArtisan ? 'MP-CH-2018-912' : undefined,
          googleId: `gid-${Date.now()}`
        };
      }

      const res = await loginWithGoogle(profilePayload);
      const effectiveRole = res.user?.role || selectedRole;
      setAuthRole(effectiveRole);
      if (onLoginSuccess) {
        onLoginSuccess({ role: effectiveRole, user: res.user });
      }
    } catch (err) {
      console.error('Google sign-in error:', err);
      setError(err.message || 'Unable to sign in with Google. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Email Sign In or Sign Up
  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    if (isSignUp && !name) {
      setError('Please enter your full name.');
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        // Register new account
        await register({
          name: selectedRole === 'artisan' && !name.startsWith('Karigar') ? `Karigar ${name}` : name,
          email,
          password,
          role: selectedRole,
          pehchanId: selectedRole === 'artisan' ? pehchanId : undefined
        });
        setSuccessMsg('Account created! Logging you in...');
      } else {
        // Sign In with existing credentials
        await login(email, password);
      }

      // Read updated user from local storage or context
      const savedUser = JSON.parse(localStorage.getItem('kalasetu_user') || '{}');
      const finalRole = savedUser.role || selectedRole;
      setAuthRole(finalRole);

      if (onLoginSuccess) {
        onLoginSuccess({ role: finalRole, user: savedUser });
      }
    } catch (err) {
      console.error('Email auth error:', err);
      setError(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col px-4 pt-3 pb-6 justify-between relative bg-[#faf7f2] overflow-y-auto">
      {/* Top Header Section */}
      <div className="space-y-3">
        {/* Brand & Government Trust Pill */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-white shadow-xs font-serif text-xl font-bold">
              क
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-serif-heading text-lg font-bold text-[#1c1c19] leading-tight">
                  KalaSetu
                </h1>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  SIH 2026
                </span>
              </div>
              <p className="text-[10px] font-medium text-primary tracking-wide">
                Direct Heritage Network • MoSJE
              </p>
            </div>
          </div>

          <button
            onClick={onSkip}
            className="text-xs font-bold text-neutral-500 hover:text-neutral-800 px-2.5 py-1 rounded-full hover:bg-neutral-100 transition-colors cursor-pointer"
            type="button"
          >
            Skip &gt;
          </button>
        </div>

        {/* Hero Greeting Banner */}
        <div className="bg-gradient-to-br from-[#f8f5ef] to-[#ede7dc]/80 rounded-2xl p-3.5 border border-[#e5dfd3] shadow-xs">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
              <span className="material-symbols-outlined text-[12px]">verified</span>
              Direct Artisan Linkage
            </span>
          </div>
          <h2 className="font-serif-heading text-lg font-bold text-[#1c1c19] leading-snug">
            {selectedRole === 'artisan' ? 'कारीगर स्टूडियो / Karigar Studio' : 'कला सेतु मार्केटप्लेस / Patron Portal'}
          </h2>
          <p className="text-[11px] text-[#57423b] mt-0.5 leading-relaxed">
            {selectedRole === 'artisan'
              ? 'Join as an Artisan to list crafts by voice, receive fair pricing, and sell across India.'
              : 'Join as a Buyer to discover certified GI crafts with transparent artisan provenance.'}
          </p>
        </div>

        {/* Step 1: Role Bifurcation Selection */}
        <div className="space-y-2 mt-2">
          <div className="flex items-center justify-between px-0.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#1c1c19] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[15px] text-primary">badge</span>
              <span>1. Choose Role / भूमिका चुनें</span>
            </label>
            <span className="text-[10px] font-semibold text-primary capitalize">{selectedRole} Selected</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* Buyer Card */}
            <div
              onClick={() => setSelectedRole('buyer')}
              className={`cursor-pointer p-3 rounded-2xl transition-all relative overflow-hidden border-2 shadow-xs ${
                selectedRole === 'buyer'
                  ? 'bg-[#fdf1ec] border-primary shadow-sm'
                  : 'bg-white border-[#e5dfd3] hover:border-primary/40'
              }`}
            >
              <div className="flex items-start justify-between mb-1.5">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                  selectedRole === 'buyer' ? 'bg-primary text-white' : 'bg-primary-light text-primary'
                }`}>
                  <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
                </div>
                <div className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                  selectedRole === 'buyer' ? 'bg-primary border-primary text-white' : 'border-neutral-300 bg-white'
                }`}>
                  {selectedRole === 'buyer' && (
                    <span className="material-symbols-outlined text-[11px] font-bold">check</span>
                  )}
                </div>
              </div>
              <h3 className="font-serif text-xs font-bold text-[#1c1c19] leading-tight">
                Buyer / ग्राहक
              </h3>
              <p className="text-[9px] text-[#57423b] mt-0.5 leading-tight">
                GI handicrafts &amp; escrow orders.
              </p>
            </div>

            {/* Artisan Card */}
            <div
              onClick={() => setSelectedRole('artisan')}
              className={`cursor-pointer p-3 rounded-2xl transition-all relative overflow-hidden border-2 shadow-xs ${
                selectedRole === 'artisan'
                  ? 'bg-[#eef2ff] border-secondary shadow-sm'
                  : 'bg-white border-[#e5dfd3] hover:border-secondary/40'
              }`}
            >
              <div className="flex items-start justify-between mb-1.5">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                  selectedRole === 'artisan' ? 'bg-secondary text-white' : 'bg-blue-100 text-secondary'
                }`}>
                  <span className="material-symbols-outlined text-[18px]">handyman</span>
                </div>
                <div className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                  selectedRole === 'artisan' ? 'bg-secondary border-secondary text-white' : 'border-neutral-300 bg-white'
                }`}>
                  {selectedRole === 'artisan' && (
                    <span className="material-symbols-outlined text-[11px] font-bold">check</span>
                  )}
                </div>
              </div>
              <h3 className="font-serif text-xs font-bold text-[#1c1c19] leading-tight">
                Artisan / कारीगर
              </h3>
              <p className="text-[9px] text-[#57423b] mt-0.5 leading-tight">
                Voice cataloging &amp; AI fair price.
              </p>
            </div>
          </div>
        </div>

        {/* Step 2: Auth Method Tabs (Google vs Email) */}
        <div className="mt-3 space-y-2">
          <div className="flex bg-[#ede7dc] p-1 rounded-xl border border-[#dad2c5]">
            <button
              type="button"
              onClick={() => { setAuthMethod('google'); setError(''); }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                authMethod === 'google'
                  ? 'bg-white text-[#1c1c19] shadow-xs'
                  : 'text-neutral-600 hover:text-[#1c1c19]'
              }`}
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Google Sign In</span>
            </button>

            <button
              type="button"
              onClick={() => { setAuthMethod('email'); setError(''); }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                authMethod === 'email'
                  ? 'bg-white text-[#1c1c19] shadow-xs'
                  : 'text-neutral-600 hover:text-[#1c1c19]'
              }`}
            >
              <span className="material-symbols-outlined text-[15px] text-primary">mail</span>
              <span>Email Sign {isSignUp ? 'Up' : 'In'}</span>
            </button>
          </div>
        </div>

        {/* Error / Success Messages */}
        {error && (
          <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-red-600">error</span>
            <span>{error}</span>
          </div>
        )}
        {successMsg && (
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-emerald-600">check_circle</span>
            <span>{successMsg}</span>
          </div>
        )}
      </div>

      {/* Main Interactive Action Area */}
      <div className="mt-4 space-y-3">
        {authMethod === 'google' ? (
          /* GOOGLE SIGN IN PANEL */
          <div className="space-y-3">
            <button
              onClick={() => handleGoogleSignIn()}
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-neutral-50 active:scale-[0.99] border-2 border-[#dadce0] shadow-sm transition-all flex items-center justify-center gap-3 cursor-pointer text-xs font-bold text-[#3c4043]"
              type="button"
            >
              {loading ? (
                <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
              ) : (
                <>
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>
                    Continue with Google as {selectedRole === 'artisan' ? 'Artisan' : 'Buyer'}
                  </span>
                </>
              )}
            </button>

            {/* Quick Switch to Email option link */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => setAuthMethod('email')}
                className="text-xs font-semibold text-[#57423b] hover:text-primary underline cursor-pointer"
              >
                Prefer using your Email and Password?
              </button>
            </div>
          </div>
        ) : (
          /* EMAIL AUTH PANEL (SIGN IN / SIGN UP) */
          <form onSubmit={handleEmailAuth} className="bg-white p-4 rounded-2xl border border-[#e5dfd3] shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <span className="text-xs font-bold text-[#1c1c19]">
                {isSignUp ? `Create ${selectedRole === 'artisan' ? 'Artisan' : 'Buyer'} Account` : `Sign In as ${selectedRole === 'artisan' ? 'Artisan' : 'Buyer'}`}
              </span>
              <button
                type="button"
                onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
                className="text-[11px] font-bold text-primary hover:underline cursor-pointer"
              >
                {isSignUp ? 'Have an account? Sign In' : 'New here? Sign Up'}
              </button>
            </div>

            {/* Name field (for Sign Up) */}
            {isSignUp && (
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-neutral-600 tracking-wider">
                  Full Name / पूरा नाम
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={selectedRole === 'artisan' ? 'e.g. Ramesh Kumar' : 'e.g. Priya Sen'}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 focus:border-primary focus:outline-none bg-[#fdfcfb]"
                  required={isSignUp}
                />
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-neutral-600 tracking-wider">
                Email Address / ईमेल
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 focus:border-primary focus:outline-none bg-[#fdfcfb]"
                required
              />
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-neutral-600 tracking-wider">
                Password / पासवर्ड
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 focus:border-primary focus:outline-none bg-[#fdfcfb]"
                required
              />
            </div>

            {/* Optional Artisan Pehchan ID (for Sign Up) */}
            {isSignUp && selectedRole === 'artisan' && (
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-neutral-600 tracking-wider flex items-center justify-between">
                  <span>Pehchan Card ID (Optional)</span>
                  <span className="text-emerald-700 font-normal">Govt Verified</span>
                </label>
                <input
                  type="text"
                  value={pehchanId}
                  onChange={(e) => setPehchanId(e.target.value)}
                  placeholder="e.g. MP-CH-2018-912"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 focus:border-primary focus:outline-none bg-[#fdfcfb]"
                />
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                selectedRole === 'artisan'
                  ? 'bg-secondary hover:bg-secondary/90 text-white'
                  : 'bg-primary hover:bg-[#862f0f] text-white'
              }`}
            >
              {loading ? (
                <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
              ) : (
                <>
                  <span>{isSignUp ? `Sign Up as ${selectedRole === 'artisan' ? 'Karigar' : 'Buyer'}` : `Sign In as ${selectedRole === 'artisan' ? 'Karigar' : 'Buyer'}`}</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* 1-Tap Quick Demo Switcher (Instant test for SIH judges) */}
        <div className="bg-[#f5f1ea] rounded-xl p-2.5 border border-[#e5dfd3]">
          <div className="flex items-center justify-between mb-1.5 px-1">
            <span className="text-[10px] font-bold text-[#57423b] uppercase tracking-wider">
              1-Tap Demo Switcher (SIH Pitch)
            </span>
            <span className="text-[9px] font-semibold text-emerald-700 bg-emerald-100/80 px-1.5 py-0.2 rounded-full">
              Instant
            </span>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => {
                setSelectedRole('artisan');
                handleGoogleSignIn({
                  email: 'artisan@kalasetu.gov.in',
                  name: 'Smt. Yashoda Bai',
                  picture: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
                  pehchanId: 'MP-CH-2018-912'
                });
              }}
              className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-blue-50 border border-blue-200 text-left transition-all active:scale-[0.98] cursor-pointer"
              type="button"
            >
              <div className="text-[11px] font-bold text-secondary truncate">
                🪡 Yashoda Bai
              </div>
              <div className="text-[9px] text-[#57423b]">Master Weaver (Artisan)</div>
            </button>

            <button
              onClick={() => {
                setSelectedRole('buyer');
                handleGoogleSignIn({
                  email: 'buyer@kalasetu.gov.in',
                  name: 'Aarav Sharma',
                  picture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
                });
              }}
              className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-orange-50 border border-orange-200 text-left transition-all active:scale-[0.98] cursor-pointer"
              type="button"
            >
              <div className="text-[11px] font-bold text-primary truncate">
                🛍️ Aarav Sharma
              </div>
              <div className="text-[9px] text-[#57423b]">Craft Patron (Buyer)</div>
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-[10px] text-[#57423b] leading-tight">
          By signing in, you agree to KalaSetu's{' '}
          <span className="underline cursor-pointer">Fair Price Terms</span> and{' '}
          <span className="underline cursor-pointer">Artisan Direct Protection</span>.
        </p>
      </div>
    </div>
  );
};
