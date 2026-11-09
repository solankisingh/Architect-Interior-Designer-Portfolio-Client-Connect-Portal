import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Award, Building, Sparkles, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-charcoal-950 text-charcoal-300 pt-16 pb-12 border-t border-charcoal-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-12 border-b border-charcoal-800">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-atelier-500 text-charcoal-950 flex items-center justify-center font-serif text-xl font-bold">
                A
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                Atelier<span className="text-atelier-400 font-normal italic">Connect</span>
              </span>
            </div>
            <p className="text-xs text-charcoal-400 leading-relaxed">
              The premier digital portfolio and client connect marketplace for accredited architects, interior designers, and visionary property owners.
            </p>
            <div className="pt-2 text-xs text-atelier-300 flex items-center gap-2">
              <Award className="w-4 h-4 text-atelier-400" />
              <span>Aligned with COA, IIID & IFI Standards</span>
            </div>
          </div>

          {/* Directory Links */}
          <div className="space-y-3">
            <p className="text-xs font-semibold tracking-wider uppercase text-white font-sans">Explore Disciplines</p>
            <ul className="space-y-2 text-xs text-charcoal-400">
              <li><Link to="/designers?specialization=Residential" className="hover:text-atelier-300 transition-colors">Residential Architecture</Link></li>
              <li><Link to="/designers?style=Modern+Minimalist" className="hover:text-atelier-300 transition-colors">Modern Minimalist Interiors</Link></li>
              <li><Link to="/designers?style=Biophilic+Contemporary" className="hover:text-atelier-300 transition-colors">Biophilic Living & Courtyards</Link></li>
              <li><Link to="/designers?specialization=Commercial" className="hover:text-atelier-300 transition-colors">Commercial & Creative Workspaces</Link></li>
              <li><Link to="/designers?style=Scandinavian" className="hover:text-atelier-300 transition-colors">Scandinavian & Japandi Spaces</Link></li>
            </ul>
          </div>

          {/* Portals & Workflows */}
          <div className="space-y-3">
            <p className="text-xs font-semibold tracking-wider uppercase text-white font-sans">Platform Portals</p>
            <ul className="space-y-2 text-xs text-charcoal-400">
              <li><Link to="/designers" className="hover:text-atelier-300 transition-colors">Studio Directory</Link></li>
              <li><Link to="/client/dashboard" className="hover:text-atelier-300 transition-colors">Client Inquiry Hub</Link></li>
              <li><Link to="/designer/dashboard" className="hover:text-atelier-300 transition-colors">Architect Portfolio Studio</Link></li>
              <li><Link to="/admin" className="hover:text-atelier-300 transition-colors">Admin Governance & KPIs</Link></li>
              <li><Link to="/register" className="hover:text-atelier-300 transition-colors">Accredited Designer Registration</Link></li>
            </ul>
          </div>

          {/* Institutional Affiliations */}
          <div className="space-y-3">
            <p className="text-xs font-semibold tracking-wider uppercase text-white font-sans">Professional Standards</p>
            <div className="space-y-2 text-[11px] text-charcoal-400">
              <p className="border-l-2 border-atelier-500 pl-3">
                <strong className="text-charcoal-200 block">Council of Architecture (COA)</strong>
                Statutory body regulating architectural education & professional practice.
              </p>
              <p className="border-l-2 border-atelier-500 pl-3">
                <strong className="text-charcoal-200 block">Indian Institute of Interior Designers</strong>
                Promoting high ethics and excellence in interior architecture.
              </p>
              <p className="border-l-2 border-atelier-500 pl-3">
                <strong className="text-charcoal-200 block">International Federation (IFI)</strong>
                Global voice and network for interior architects & designers.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-charcoal-500 gap-4">
          <p>© {new Date().getFullYear()} AtelierConnect Portal. All rights reserved.</p>
          <p className="flex items-center gap-1.5 text-charcoal-400">
            Crafted for architectural excellence & seamless client connection.
          </p>
        </div>
      </div>
    </footer>
  );
}
