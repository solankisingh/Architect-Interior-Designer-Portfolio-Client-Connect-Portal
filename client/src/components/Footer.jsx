import React from 'react';
import { Link } from 'react-router-dom';
import { Building, Award, Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-gray-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-slate-800 text-white flex items-center justify-center font-bold">
                <Building className="w-4 h-4 text-amber-400" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Arch<span className="text-amber-500">Connect</span>
              </span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Online portfolio and client connection portal for registered architects, interior design studios, and property owners.
            </p>
            <div className="pt-1 text-xs text-amber-400 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Aligned with Council of Architecture (COA) Guidelines</span>
            </div>
          </div>

          {/* Specializations */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-3">Disciplines</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><Link to="/designers?specialization=Residential" className="hover:text-white transition-colors">Residential Architecture</Link></li>
              <li><Link to="/designers?specialization=Apartment" className="hover:text-white transition-colors">Apartment & Penthouse Interiors</Link></li>
              <li><Link to="/designers?specialization=Commercial" className="hover:text-white transition-colors">Commercial & Office Workspaces</Link></li>
              <li><Link to="/designers?specialization=Holiday" className="hover:text-white transition-colors">Holiday Homes & Farmhouses</Link></li>
              <li><Link to="/designers?specialization=Sustainable" className="hover:text-white transition-colors">Sustainable & Courtyard Design</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-3">Portal Navigation</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><Link to="/designers" className="hover:text-white transition-colors">Explore All Designers</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Sign In</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">Register as Architect / Client</Link></li>
              <li><Link to="/client/dashboard" className="hover:text-white transition-colors">Client Inquiries Hub</Link></li>
              <li><Link to="/designer/dashboard" className="hover:text-white transition-colors">Architect Studio Workspace</Link></li>
            </ul>
          </div>

          {/* Regulatory Context */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-3">Professional Bodies</h4>
            <div className="space-y-2 text-[11px] text-gray-400">
              <p className="border-l-2 border-amber-500 pl-2">
                <strong className="text-gray-200 block">Council of Architecture (COA)</strong>
                Statutory body regulating architectural education and professional standards in India.
              </p>
              <p className="border-l-2 border-amber-500 pl-2">
                <strong className="text-gray-200 block">Indian Institute of Interior Designers (IIID)</strong>
                Apex body establishing ethical standards and practices in interior architecture.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-2">
          <p>© {new Date().getFullYear()} ArchConnect Portal. Architect & Interior Designer Portfolio & Client Connect Portal.</p>
          <p className="text-gray-400">Built with React, Node.js, Express & Prisma.</p>
        </div>
      </div>
    </footer>
  );
}
