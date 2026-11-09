import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Compass,
  Layers,
  MessageSquare,
  LayoutDashboard,
  ShieldAlert,
  LogOut,
  User as UserIcon,
  Menu,
  X,
  Sparkles,
  ChevronDown
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-atelier-200/60 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-charcoal-900 text-atelier-300 flex items-center justify-center font-serif text-xl font-bold tracking-tight shadow-md group-hover:bg-atelier-800 transition-colors">
              A
            </div>
            <div>
              <span className="font-serif text-2xl font-semibold tracking-tight text-charcoal-900 block leading-tight">
                Atelier<span className="text-atelier-600 font-normal italic">Connect</span>
              </span>
              <span className="text-[10px] tracking-widest uppercase text-charcoal-500 font-medium block">
                Architect & Designer Portal
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/designers"
              className={`text-sm font-medium transition-colors ${
                isActive('/designers')
                  ? 'text-charcoal-950 font-semibold border-b-2 border-atelier-600 pb-1'
                  : 'text-charcoal-600 hover:text-charcoal-950'
              }`}
            >
              Explore Studios
            </Link>

            {isAuthenticated && user?.role === 'CLIENT' && (
              <Link
                to="/client/dashboard"
                className={`text-sm font-medium flex items-center gap-1.5 transition-colors ${
                  isActive('/client/dashboard')
                    ? 'text-charcoal-950 font-semibold border-b-2 border-atelier-600 pb-1'
                    : 'text-charcoal-600 hover:text-charcoal-950'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-atelier-600" />
                Client Dashboard
              </Link>
            )}

            {isAuthenticated && user?.role === 'DESIGNER' && (
              <Link
                to="/designer/dashboard"
                className={`text-sm font-medium flex items-center gap-1.5 transition-colors ${
                  isActive('/designer/dashboard')
                    ? 'text-charcoal-950 font-semibold border-b-2 border-atelier-600 pb-1'
                    : 'text-charcoal-600 hover:text-charcoal-950'
                }`}
              >
                <Layers className="w-4 h-4 text-atelier-600" />
                Designer Studio
              </Link>
            )}

            {isAuthenticated && user?.role === 'ADMIN' && (
              <Link
                to="/admin"
                className={`text-sm font-medium flex items-center gap-1.5 transition-colors ${
                  isActive('/admin')
                    ? 'text-charcoal-950 font-semibold border-b-2 border-atelier-600 pb-1'
                    : 'text-charcoal-600 hover:text-charcoal-950'
                }`}
              >
                <ShieldAlert className="w-4 h-4 text-purple-600" />
                Admin Console
              </Link>
            )}
          </nav>

          {/* Auth CTA or User Menu */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-3 px-3 py-1.5 rounded-full border border-atelier-300 hover:border-atelier-400 bg-white/70 shadow-sm transition-all"
                >
                  <img
                    src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=1f1f1f&color=dfcbb2`}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="text-left">
                    <p className="text-xs font-semibold text-charcoal-900 leading-tight">{user.name}</p>
                    <p className="text-[10px] text-atelier-700 uppercase font-medium">{user.role}</p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-charcoal-400" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-atelier-200 py-2 z-50 animate-in fade-in slide-in-from-top-1"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-atelier-100">
                      <p className="text-xs font-semibold text-charcoal-900">{user.name}</p>
                      <p className="text-[11px] text-charcoal-500 truncate">{user.email}</p>
                    </div>

                    {user.role === 'CLIENT' && (
                      <Link
                        to="/client/dashboard"
                        className="flex items-center gap-2 px-4 py-2 text-xs text-charcoal-700 hover:bg-atelier-50"
                      >
                        <LayoutDashboard className="w-4 h-4 text-atelier-600" />
                        My Inquiries & Projects
                      </Link>
                    )}

                    {user.role === 'DESIGNER' && (
                      <Link
                        to="/designer/dashboard"
                        className="flex items-center gap-2 px-4 py-2 text-xs text-charcoal-700 hover:bg-atelier-50"
                      >
                        <Layers className="w-4 h-4 text-atelier-600" />
                        Studio Dashboard & Portfolios
                      </Link>
                    )}

                    {user.role === 'ADMIN' && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2 px-4 py-2 text-xs text-charcoal-700 hover:bg-atelier-50"
                      >
                        <ShieldAlert className="w-4 h-4 text-purple-600" />
                        Platform Administration
                      </Link>
                    )}

                    <div className="border-t border-atelier-100 mt-1 pt-1">
                      <button
                        onClick={logout}
                        className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-charcoal-700 hover:text-charcoal-950 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 rounded-full bg-charcoal-900 text-atelier-100 hover:bg-charcoal-800 text-xs font-semibold tracking-wider uppercase shadow-md hover:shadow-lg transition-all"
                >
                  Join as Studio / Client
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-charcoal-700 hover:bg-atelier-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FBF9F5] border-b border-atelier-200 px-4 pt-3 pb-6 space-y-3">
          <Link
            to="/designers"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-charcoal-800 hover:bg-atelier-100"
          >
            Explore Studios
          </Link>

          {isAuthenticated ? (
            <>
              {user.role === 'CLIENT' && (
                <Link
                  to="/client/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-charcoal-800 hover:bg-atelier-100"
                >
                  Client Dashboard
                </Link>
              )}
              {user.role === 'DESIGNER' && (
                <Link
                  to="/designer/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-charcoal-800 hover:bg-atelier-100"
                >
                  Designer Studio
                </Link>
              )}
              {user.role === 'ADMIN' && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-charcoal-800 hover:bg-atelier-100"
                >
                  Admin Console
                </Link>
              )}
              <div className="pt-2 border-t border-atelier-200">
                <p className="px-3 text-xs text-charcoal-500 font-medium">Logged in as {user.name} ({user.role})</p>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 rounded-lg mt-1 font-medium"
                >
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <div className="pt-3 border-t border-atelier-200 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-lg border border-atelier-300 text-sm font-medium text-charcoal-800"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-lg bg-charcoal-900 text-white text-xs font-semibold uppercase tracking-wider"
              >
                Join AtelierConnect
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
