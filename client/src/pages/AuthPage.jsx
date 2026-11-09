import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, User, Building, AlertCircle, ArrowRight } from 'lucide-react';

export default function AuthPage({ defaultMode = 'login' }) {
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const [mode, setMode] = useState(defaultMode); // 'login' or 'register'
  const [role, setRole] = useState('CLIENT'); // 'CLIENT' or 'DESIGNER'

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    studioName: '',
    bio: '',
    location: '',
    specializations: 'Residential Architecture, Villa Planning',
    designStyles: 'Contemporary, Minimalist',
    budgetTier: '₹50L - ₹1.5 Cr',
    experienceYears: '8'
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
        const loggedUser = await login(formData.email, formData.password);
        if (loggedUser.role === 'ADMIN') navigate('/admin');
        else if (loggedUser.role === 'DESIGNER') navigate('/designer/dashboard');
        else navigate('/client/dashboard');
      } else {
        const registeredUser = await register({
          ...formData,
          role
        });
        if (registeredUser.role === 'DESIGNER') navigate('/designer/dashboard');
        else navigate('/client/dashboard');
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] w-full bg-gray-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold">
              <Building className="w-5 h-5 text-amber-400" />
            </div>
            <span className="text-2xl font-bold text-gray-900 font-sans">
              Arch<span className="text-amber-600">Connect</span>
            </span>
          </Link>
          <h2 className="text-2xl font-bold text-gray-900">
            {mode === 'login' ? 'Sign In' : 'Create an Account'}
          </h2>
          <p className="text-xs text-gray-600 mt-1">
            {mode === 'login'
              ? 'Enter your email and password to access your portal'
              : 'Register as a client or architecture / interior design professional'}
          </p>
        </div>

        {/* Card Form */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 shadow-xs">
          {/* Switch Tab */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              type="button"
              onClick={() => { setMode('login'); setError(''); }}
              className={`flex-1 pb-2.5 text-xs font-semibold text-center border-b-2 transition-colors ${
                mode === 'login'
                  ? 'border-slate-900 text-slate-900'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setError(''); }}
              className={`flex-1 pb-2.5 text-xs font-semibold text-center border-b-2 transition-colors ${
                mode === 'register'
                  ? 'border-slate-900 text-slate-900'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              Register
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Registering as:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('CLIENT')}
                    className={`py-2 px-3 rounded-lg border text-xs font-medium text-center transition-colors ${
                      role === 'CLIENT'
                        ? 'border-slate-900 bg-slate-50 text-slate-900 font-semibold'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Client / Homeowner
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('DESIGNER')}
                    className={`py-2 px-3 rounded-lg border text-xs font-medium text-center transition-colors ${
                      role === 'DESIGNER'
                        ? 'border-slate-900 bg-slate-50 text-slate-900 font-semibold'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Architect / Designer
                  </button>
                </div>
              </div>
            )}

            {mode === 'register' && (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs sm:text-sm focus:border-slate-900 outline-none"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs sm:text-sm focus:border-slate-900 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs sm:text-sm focus:border-slate-900 outline-none"
                required
              />
            </div>

            {/* Extra fields for Designer Registration */}
            {mode === 'register' && role === 'DESIGNER' && (
              <div className="space-y-3 pt-2 border-t border-gray-100">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Studio / Firm Name</label>
                  <input
                    type="text"
                    name="studioName"
                    value={formData.studioName}
                    onChange={handleChange}
                    placeholder="e.g. Design Atelier"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs focus:border-slate-900 outline-none"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="e.g. Mumbai, Bangalore"
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs focus:border-slate-900 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Experience (Years)</label>
                    <input
                      type="number"
                      name="experienceYears"
                      value={formData.experienceYears}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs focus:border-slate-900 outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 mt-3"
            >
              {loading ? 'Please wait...' : (
                <>
                  <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
