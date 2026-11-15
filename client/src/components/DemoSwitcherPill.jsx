import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Compass, User, RefreshCw, X, ChevronUp } from 'lucide-react';

export default function DemoSwitcherPill() {
  const { user, demoLogin, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [loadingRole, setLoadingRole] = useState(null);

  const handleSwitch = async (role) => {
    try {
      setLoadingRole(role);
      await demoLogin(role);
      setIsOpen(false);
    } catch (err) {
      console.error('Failed to switch demo account:', err);
    } finally {
      setLoadingRole(null);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {isOpen && (
        <div className="mb-3 w-72 bg-charcoal-900 text-white rounded-2xl shadow-2xl border border-charcoal-700 p-4 transition-all animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between pb-3 border-b border-charcoal-800">
            <div>
              <p className="text-sm font-semibold tracking-wider uppercase text-atelier-300">Quick Persona Switcher</p>
              <p className="text-[11px] text-charcoal-400">Test different role experiences</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-charcoal-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-3 space-y-2">
            {/* Client Persona */}
            <button
              onClick={() => handleSwitch('CLIENT')}
              disabled={loadingRole !== null}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-sm transition-colors ${
                user?.role === 'CLIENT'
                  ? 'bg-atelier-600 text-white font-medium ring-1 ring-atelier-400'
                  : 'bg-charcoal-800 hover:bg-charcoal-700 text-charcoal-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  🏡
                </div>
                <div>
                  <div className="font-medium text-white">Client Mode</div>
                  <div className="text-[10px] text-charcoal-300">Aarav & Meera Kapoor</div>
                </div>
              </div>
              {user?.role === 'CLIENT' && <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded">Active</span>}
            </button>

            {/* Designer Persona */}
            <button
              onClick={() => handleSwitch('DESIGNER')}
              disabled={loadingRole !== null}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-sm transition-colors ${
                user?.role === 'DESIGNER'
                  ? 'bg-atelier-600 text-white font-medium ring-1 ring-atelier-400'
                  : 'bg-charcoal-800 hover:bg-charcoal-700 text-charcoal-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-atelier-500/20 text-atelier-400 flex items-center justify-center font-bold">
                  🏛️
                </div>
                <div>
                  <div className="font-medium text-white">Architect / Designer</div>
                  <div className="text-[10px] text-charcoal-300">Ar. Vikramaditya Singhania</div>
                </div>
              </div>
              {user?.role === 'DESIGNER' && <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded">Active</span>}
            </button>

            {/* Admin Persona */}
            <button
              onClick={() => handleSwitch('ADMIN')}
              disabled={loadingRole !== null}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-sm transition-colors ${
                user?.role === 'ADMIN'
                  ? 'bg-atelier-600 text-white font-medium ring-1 ring-atelier-400'
                  : 'bg-charcoal-800 hover:bg-charcoal-700 text-charcoal-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                  👑
                </div>
                <div>
                  <div className="font-medium text-white">Admin Console</div>
                  <div className="text-[10px] text-charcoal-300">Elena Vance, Curator</div>
                </div>
              </div>
              {user?.role === 'ADMIN' && <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded">Active</span>}
            </button>
          </div>

          {user && (
            <div className="mt-3 pt-3 border-t border-charcoal-800 flex justify-between items-center text-[11px]">
              <span className="text-charcoal-400">Currently: <strong className="text-white">{user.name}</strong></span>
              <button
                onClick={logout}
                className="text-rose-400 hover:text-rose-300 underline"
              >
                Log Out
              </button>
            </div>
          )}
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 bg-charcoal-900 hover:bg-charcoal-800 text-white rounded-full shadow-xl border border-charcoal-700 hover:border-atelier-400 transition-all text-sm font-medium group"
      >
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-atelier-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-atelier-500"></span>
        </span>
        <span className="text-atelier-200 font-semibold">Demo Switcher</span>
        {user ? (
          <span className="px-2 py-0.5 rounded-full bg-charcoal-800 text-[10px] text-charcoal-300 border border-charcoal-700">
            {user.role}
          </span>
        ) : (
          <span className="text-charcoal-400 text-[11px]">Guest</span>
        )}
        <ChevronUp className={`w-3.5 h-3.5 text-charcoal-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
    </div>
  );
}

