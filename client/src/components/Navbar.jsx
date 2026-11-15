import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Building,
  Layers,
  LayoutDashboard,
  Shield,
  LogOut,
  Menu,
  X,
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
    <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-200 shadow-xs">
      <div className="w-full px-6 sm:px-10 lg:px-16">
        <div className="flex items-center justify-between h-18 py-3">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-lg">
              <Building className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <span className="text-2xl font-bold tracking-tight text-gray-900 leading-none block font-sans">
                Arch<span className="text-amber-600 font-semibold">Connect</span>
              </span>
              <span className="text-sm text-gray-500 font-medium tracking-wide uppercase block mt-0.5">
                Architect & Designer Portal
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 text-base">
            <Link
              to="/designers"
              className={`font-medium transition-colors ${
                isActive('/designers')
                  ? 'text-amber-700 font-semibold border-b-2 border-amber-600 pb-1'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Find Architects & Designers
            </Link>

            {isAuthenticated && user?.role === 'CLIENT' && (
              <Link
                to="/client/dashboard"
                className={`font-medium flex items-center gap-2 transition-colors ${
                  isActive('/client/dashboard')
                    ? 'text-amber-700 font-semibold border-b-2 border-amber-600 pb-1'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-gray-500" />
                <span>Client Dashboard</span>
              </Link>
            )}

            {isAuthenticated && user?.role === 'DESIGNER' && (
              <Link
                to="/designer/dashboard"
                className={`font-medium flex items-center gap-2 transition-colors ${
                  isActive('/designer/dashboard')
                    ? 'text-amber-700 font-semibold border-b-2 border-amber-600 pb-1'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                <Layers className="w-4 h-4 text-gray-500" />
                <span>Studio Workspace</span>
              </Link>
            )}

            {isAuthenticated && user?.role === 'ADMIN' && (
              <Link
                to="/admin"
                className={`font-medium flex items-center gap-2 transition-colors ${
                  isActive('/admin')
                    ? 'text-amber-700 font-semibold border-b-2 border-amber-600 pb-1'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                <Shield className="w-4 h-4 text-gray-500" />
                <span>Admin Console</span>
              </Link>
            )}
          </nav>

          {/* Right CTA */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-3 px-3.5 py-2 rounded-lg border border-gray-200 hover:border-gray-300 bg-gray-50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center text-sm font-semibold">
                    {user.name.charAt(0)}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-900 leading-tight">{user.name}</p>
                    <p className="text-sm text-gray-500 uppercase font-medium">{user.role}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400 ml-1" />
                </button>

                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 text-sm"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2.5 border-b border-gray-100">
                      <p className="font-semibold text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500 truncate mt-0.5">{user.email}</p>
                    </div>

                    {user.role === 'CLIENT' && (
                      <Link
                        to="/client/dashboard"
                        className="block px-4 py-2.5 text-gray-700 hover:bg-gray-50"
                      >
                        Client Dashboard
                      </Link>
                    )}

                    {user.role === 'DESIGNER' && (
                      <Link
                        to="/designer/dashboard"
                        className="block px-4 py-2.5 text-gray-700 hover:bg-gray-50"
                      >
                        Studio Workspace
                      </Link>
                    )}

                    {user.role === 'ADMIN' && (
                      <Link
                        to="/admin"
                        className="block px-4 py-2.5 text-gray-700 hover:bg-gray-50"
                      >
                        Admin Console
                      </Link>
                    )}

                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button
                        onClick={logout}
                        className="w-full text-left flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold tracking-wide transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-6 pt-3 pb-5 space-y-3">
          <Link
            to="/designers"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
          >
            Find Architects & Designers
          </Link>

          {isAuthenticated ? (
            <>
              {user.role === 'CLIENT' && (
                <Link
                  to="/client/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                >
                  Client Dashboard
                </Link>
              )}
              {user.role === 'DESIGNER' && (
                <Link
                  to="/designer/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                >
                  Studio Workspace
                </Link>
              )}
              {user.role === 'ADMIN' && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                >
                  Admin Console
                </Link>
              )}
              <div className="pt-2 border-t border-gray-200">
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2.5 text-base text-red-600 hover:bg-red-50 rounded-md font-medium"
                >
                  Log Out ({user.name})
                </button>
              </div>
            </>
          ) : (
            <div className="pt-3 border-t border-gray-200 flex flex-col gap-2.5">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-md border border-gray-300 text-base font-medium text-gray-700"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-md bg-slate-900 text-white text-base font-semibold"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
