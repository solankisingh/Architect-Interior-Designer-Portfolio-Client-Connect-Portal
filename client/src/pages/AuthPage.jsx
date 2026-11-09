import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Lock,
  Mail,
  User,
  Building,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  AlertCircle,
  Briefcase
} from 'lucide-react';

export default function AuthPage({ defaultMode = 'login' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, demoLogin } = useAuth();

  const [mode, setMode] = useState(defaultMode); // 'login' or 'register'
  const [role, setRole] = useState('CLIENT'); // 'CLIENT' or 'DESIGNER'

  // Form states
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    studioName: '',
    bio: '',
    location: '',
    specializations: 'Residential Architecture, Luxury Interiors',
    designStyles: 'Modern Minimalist, Contemporary',
    budgetTier: '$$$',
    experienceYears: '5'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const user = await login(formData.email, formData.password);
        if (user.role === 'ADMIN') navigate('/admin');
        else if (user.role === 'DESIGNER') navigate('/designer/dashboard');
        else navigate('/client/dashboard');
      } else {
        const user = await register({
          ...formData,
          role
        });
        if (user.role === 'DESIGNER') navigate('/designer/dashboard');
        else navigate('/client/dashboard');
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError(err.response?.data?.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async (demoRole) => {
    try {
      setLoading(true);
      setError('');
      const user = await demoLogin(demoRole);
      if (user.role === 'ADMIN') navigate('/admin');
      else if (user.role === 'DESIGNER') navigate('/designer/dashboard');
      else navigate('/client/dashboard');
    } catch (err) {
      setError('Failed to log in with demo account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-charcoal-900 text-atelier-300 flex items-center justify-center font-serif text-xl font-bold">
              A
            </div>
            <span className="font-serif text-2xl font-bold text-charcoal-950">
              Atelier<span className="text-atelier-600 font-normal italic">Connect</span>
            </span>
          </Link>
          <h2 className="mt-4 font-serif text-2xl sm:text-3xl font-bold text-charcoal-950">
            {mode === 'login' ? 'Welcome Back' : 'Create an Account'}
          </h2>
          <p className="text-xs text-charcoal-500 mt-1">
            {mode === 'login'
              ? 'Access your architectural portfolios & client inquiries'
              : 'Join the premier network for architects, designers & clients'}
          </p>
        </div>

        {/* 1-Click Fast Demo Login Shortcuts */}
        <div className="mb-6 p-4 rounded-2xl bg-white border border-atelier-200 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-charcoal-500 mb-2.5 text-center">
            🚀 1-Click Fast Demo Access (No Typing Needed)
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleDemo('CLIENT')}
              disabled={loading}
              className="p-2 rounded-xl border border-atelier-200 hover:border-emerald-500 hover:bg-emerald-50/50 text-center transition-all group"
            >
              <div className="text-base mb-0.5">🏡</div>
              <div className="text-[11px] font-bold text-charcoal-900 group-hover:text-emerald-700">Client</div>
              <div className="text-[9px] text-charcoal-400">Aarav K.</div>
            </button>

            <button
              type="button"
              onClick={() => handleDemo('DESIGNER')}
              disabled={loading}
              className="p-2 rounded-xl border border-atelier-200 hover:border-atelier-500 hover:bg-atelier-50/50 text-center transition-all group"
            >
              <div className="text-base mb-0.5">🏛️</div>
              <div className="text-[11px] font-bold text-charcoal-900 group-hover:text-atelier-700">Architect</div>
              <div className="text-[9px] text-charcoal-400">Singhania</div>
            </button>

            <button
              type="button"
              onClick={() => handleDemo('ADMIN')}
              disabled={loading}
              className="p-2 rounded-xl border border-atelier-200 hover:border-purple-500 hover:bg-purple-50/50 text-center transition-all group"
            >
              <div className="text-base mb-0.5">👑</div>
              <div className="text-[11px] font-bold text-charcoal-900 group-hover:text-purple-700">Admin</div>
              <div className="text-[9px] text-charcoal-400">Curator</div>
            </button>
          </div>
        </div>

        {/* Auth Box */}
        <div className="bg-white rounded-3xl border border-atelier-200/90 shadow-xl p-6 sm:p-8">
          {/* Mode Switcher Tabs */}
          <div className="flex rounded-xl bg-[#F5F0E8] p-1 mb-6">
            <button
              type="button"
              onClick={() => { setMode('login'); setError(''); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                mode === 'login' ? 'bg-white text-charcoal-950 shadow-sm' : 'text-charcoal-600 hover:text-charcoal-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setError(''); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                mode === 'register' ? 'bg-white text-charcoal-950 shadow-sm' : 'text-charcoal-600 hover:text-charcoal-900'
              }`}
            >
              Register
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {/* If Register: Role selector */}
            {mode === 'register' && (
              <div className="mb-4">
                <label className="block text-xs font-semibold text-charcoal-700 mb-1.5">
                  I am registering as:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('CLIENT')}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                      role === 'CLIENT'
                        ? 'border-atelier-600 bg-atelier-50 text-charcoal-950'
                        : 'border-atelier-200 text-charcoal-600'
                    }`}
                  >
                    🏡 Homeowner / Client
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('DESIGNER')}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                      role === 'DESIGNER'
                        ? 'border-atelier-600 bg-atelier-50 text-charcoal-950'
                        : 'border-atelier-200 text-charcoal-600'
                    }`}
                  >
                    🏛️ Architect / Designer
                  </button>
                </div>
              </div>
            )}

            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-charcoal-700 mb-1">Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Maya Lin"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-atelier-300 focus:border-atelier-600 outline-none text-xs sm:text-sm bg-[#FBF9F5]"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1">Email Address *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-atelier-300 focus:border-atelier-600 outline-none text-xs sm:text-sm bg-[#FBF9F5]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1">Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-atelier-300 focus:border-atelier-600 outline-none text-xs sm:text-sm bg-[#FBF9F5]"
                  required
                />
              </div>
            </div>

            {/* Additional Fields if registering as Designer */}
            {mode === 'register' && role === 'DESIGNER' && (
              <div className="space-y-3 pt-2 border-t border-atelier-100">
                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 mb-1">Studio / Practice Name *</label>
                  <input
                    type="text"
                    name="studioName"
                    value={formData.studioName}
                    onChange={handleChange}
                    placeholder="e.g. Atelier Vora Architects"
                    className="w-full px-3 py-2 rounded-xl border border-atelier-300 text-xs bg-[#FBF9F5]"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-charcoal-700 mb-1">Base City *</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="e.g. Mumbai, Goa"
                      className="w-full px-3 py-2 rounded-xl border border-atelier-300 text-xs bg-[#FBF9F5]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-charcoal-700 mb-1">Experience (Years)</label>
                    <input
                      type="number"
                      name="experienceYears"
                      value={formData.experienceYears}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-xl border border-atelier-300 text-xs bg-[#FBF9F5]"
                    />
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-charcoal-900 hover:bg-charcoal-800 text-atelier-100 text-xs font-semibold uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 mt-2"
            >
              {loading ? 'Processing...' : (
                <>
                  <span>{mode === 'login' ? 'Sign In to Workspace' : 'Complete Registration'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
