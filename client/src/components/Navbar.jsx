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
      <div className="w-full px-4 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-lg">
              <Building className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-gray-900 leading-none block font-sans">
                Arch<span className="text-amber-600 font-semibold">Connect</span>
              </span>
              <span className="text-[10px] text-gray-500 font-medium tracking-wide uppercase block">
                Architect & Designer Portal
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 text-sm">
            <Link
              to="/designers"
              className={`font-medium transition-colors ${
                isActive('/designers')
                  ? 'text-amber-700 font-semibold border-b-2 border-amber-600 pb-0.5'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Find Architects & Designers
            </Link>

            {isAuthenticated && user?.role === 'CLIENT' && (
              <Link
                to="/client/dashboard"
                className={`font-medium flex items-center gap-1.5 transition-colors ${
                  isActive('/client/dashboard')
                    ? 'text-amber-700 font-semibold border-b-2 border-amber-600 pb-0.5'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-gray-500" />
                <span>Client Dashboard</span>
              </Link>
            )}

            {isAuthenticated && user?.role === 'DESIGNER' && (
              <Link
                to="/designer/dashboard"
                className={`font-medium flex items-center gap-1.5 transition-colors ${
                  isActive('/designer/dashboard')
                    ? 'text-amber-700 font-semibold border-b-2 border-amber-600 pb-0.5'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Layers className="w-4 h-4 text-gray-500" />
                <span>Studio Workspace</span>
              </Link>
            )}

            {isAuthenticated && user?.role === 'ADMIN' && (
              <Link
                to="/admin"
                className={`font-medium flex items-center gap-1.5 transition-colors ${
                  isActive('/admin')
                    ? 'text-amber-700 font-semibold border-b-2 border-amber-600 pb-0.5'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Shield className="w-4 h-4 text-gray-500" />
                <span>Admin Console</span>
              </Link>
            )}
          </nav>

          {/* Right CTA */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-gray-300 bg-gray-50 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-semibold">
                    {user.name.charAt(0)}
                  </div>
                  <div className="text-left text-xs">
                    <p className="font-semibold text-gray-900 leading-tight">{user.name}</p>
                    <p className="text-[10px] text-gray-500 uppercase font-medium">{user.role}</p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 ml-1" />
                </button>

                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-lg border border-gray-200 py-1.5 z-50"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-gray-100 text-xs">
                      <p className="font-semibold text-gray-900">{user.name}</p>
                      <p className="text-gray-500 truncate">{user.email}</p>
                    </div>

                    {user.role === 'CLIENT' && (
                      <Link
                        to="/client/dashboard"
                        className="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-50"
                      >
                        Client Dashboard
                      </Link>
                    )}

                    {user.role === 'DESIGNER' && (
                      <Link
                        to="/designer/dashboard"
                        className="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-50"
                      >
                        Studio Workspace
                      </Link>
                    )}

                    {user.role === 'ADMIN' && (
                      <Link
                        to="/admin"
                        className="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-50"
                      >
                        Admin Console
                      </Link>
                    )}

                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button
                        onClick={logout}
                        className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-xs font-semibold text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold tracking-wide transition-colors"
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
              className="p-1.5 rounded-md text-gray-600 hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 pt-2 pb-4 space-y-2">
          <Link
            to="/designers"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Find Architects & Designers
          </Link>

          {isAuthenticated ? (
            <>
              {user.role === 'CLIENT' && (
                <Link
                  to="/client/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Client Dashboard
                </Link>
              )}
              {user.role === 'DESIGNER' && (
                <Link
                  to="/designer/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Studio Workspace
                </Link>
              )}
              {user.role === 'ADMIN' && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
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
                  className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md font-medium"
                >
                  Log Out ({user.name})
                </button>
              </div>
            </>
          ) : (
            <div className="pt-2 border-t border-gray-200 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 rounded-md border border-gray-300 text-sm font-medium text-gray-700"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 rounded-md bg-slate-900 text-white text-sm font-semibold"
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
