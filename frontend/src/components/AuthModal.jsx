import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export const AuthModal = () => {
  const { authModalOpen, setAuthModalOpen, authRole, setAuthRole, login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pehchanId, setPehchanId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!authModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (isRegister) {
        await register({
          name: authRole === 'artisan' ? `Karigar ${name}` : name,
          email,
          password,
          role: authRole,
          pehchanId: authRole === 'artisan' ? pehchanId : undefined
        });
        setSuccessMsg('Account created successfully!');
      } else {
        await login(email, password);
      }
    } catch (err) {
      setError(err.message || 'Authentication error. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#faf8f5] w-full max-w-md rounded-2xl shadow-2xl border border-[#ece7df] p-6 sm:p-8 relative">
        <button
          onClick={() => setAuthModalOpen(false)}
          className="absolute top-4 right-4 p-1 text-neutral-400 hover:text-neutral-700 rounded-full hover:bg-neutral-100 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {/* Role Switcher Tabs */}
        <div className="flex bg-neutral-100 p-1 rounded-xl mb-6 border border-[#ece7df]">
          <button
            type="button"
            onClick={() => setAuthRole('buyer')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              authRole === 'buyer'
                ? 'bg-white text-[#1e1e1a] shadow-xs'
                : 'text-neutral-500 hover:text-[#1e1e1a]'
            }`}
          >
            Patron / Buyer
          </button>
          <button
            type="button"
            onClick={() => setAuthRole('artisan')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 ${
              authRole === 'artisan'
                ? 'bg-primary text-white shadow-xs'
                : 'text-neutral-500 hover:text-[#1e1e1a]'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">verified</span>
            <span>Master Karigar</span>
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="font-serif-heading text-2xl font-bold text-[#1e1e1a]">
            {isRegister
              ? authRole === 'artisan'
                ? 'Join as Registered Artisan'
                : 'Create Patron Account'
              : authRole === 'artisan'
              ? 'Artisan Pehchan Sign-In'
              : 'Welcome Back to KalaSetu'}
          </h2>
          <p className="text-xs text-[#6b665f] mt-1">
            {authRole === 'artisan'
              ? 'Direct cluster access, fair-wage ledger, and craft listings'
              : 'Direct-from-loom handcrafted acquisitions with ONDC escrow protection'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            {error}
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-bold text-[#1e1e1a] uppercase mb-1">Full Name</label>
              <input
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={authRole === 'artisan' ? 'e.g. Yashoda Bai' : 'e.g. Aarav Sharma'}
                className="w-full px-3.5 py-2.5 bg-white border border-[#ece7df] rounded-lg text-sm focus:outline-none focus:border-primary"
              />
            </div>
          )}

          {isRegister && authRole === 'artisan' && (
            <div>
              <label className="block text-xs font-bold text-[#1e1e1a] uppercase mb-1">
                Pehchan ID / Handloom Card #
              </label>
              <input
                type="text"
                value={pehchanId}
                onChange={(e) => setPehchanId(e.target.value)}
                placeholder="e.g. MP-CH-2018-912"
                className="w-full px-3.5 py-2.5 bg-white border border-[#ece7df] rounded-lg text-sm focus:outline-none focus:border-primary font-mono"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[#1e1e1a] uppercase mb-1">Email Address</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full px-3.5 py-2.5 bg-white border border-[#ece7df] rounded-lg text-sm focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1e1e1a] uppercase mb-1">Password</label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 bg-white border border-[#ece7df] rounded-lg text-sm focus:outline-none focus:border-primary"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary hover:bg-[#862f0f] text-white rounded-xl font-bold text-sm shadow-md transition-all mt-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : isRegister ? 'Register & Verify' : 'Sign In'}
          </button>
        </form>

        <div className="mt-5 text-center text-xs text-[#6b665f]">
          {isRegister ? (
            <span>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsRegister(false);
                  setError('');
                }}
                className="text-primary font-bold hover:underline cursor-pointer"
              >
                Sign In
              </button>
            </span>
          ) : (
            <span>
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsRegister(true);
                  setError('');
                }}
                className="text-primary font-bold hover:underline cursor-pointer"
              >
                Create Account
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
