import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../services/api';
import {
  Search,
  Star,
  MapPin,
  ShieldCheck,
  ArrowRight,
  X,
  Building,
  CheckCircle2
} from 'lucide-react';

export default function DesignersDirectory() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [designers, setDesigners] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [style, setStyle] = useState(searchParams.get('style') || 'All');
  const [budget, setBudget] = useState(searchParams.get('budget') || 'All');
  const [location, setLocation] = useState(searchParams.get('location') || 'All');
  const [specialization, setSpecialization] = useState(searchParams.get('specialization') || 'All');
  const [sort, setSort] = useState(searchParams.get('sort') || 'rating');

  const fetchDesigners = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (style !== 'All') params.style = style;
      if (budget !== 'All') params.budget = budget;
      if (location !== 'All') params.location = location;
      if (specialization !== 'All') params.specialization = specialization;
      if (sort) params.sort = sort;

      const res = await api.get('/designers', { params });
      setDesigners(res.data.designers || []);
    } catch (err) {
      console.error('Failed to fetch designers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDesigners();
  }, [searchParams]);

  const handleApplyFilters = () => {
    const next = {};
    if (search) next.search = search;
    if (style !== 'All') next.style = style;
    if (budget !== 'All') next.budget = budget;
    if (location !== 'All') next.location = location;
    if (specialization !== 'All') next.specialization = specialization;
    if (sort !== 'rating') next.sort = sort;
    setSearchParams(next);
  };

  const handleResetFilters = () => {
    setSearch('');
    setStyle('All');
    setBudget('All');
    setLocation('All');
    setSpecialization('All');
    setSort('rating');
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Find Architects & Interior Designers
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Browse verified architecture practices, review portfolio drawings & project photos, and commission work.
          </p>
        </div>

        {/* Filter bar */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-xs mb-8 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Search */}
            <div className="lg:col-span-2 relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
                placeholder="Search studio name, specialization, keywords..."
                className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-lg focus:border-slate-900 outline-none"
              />
            </div>

            {/* City */}
            <div>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-2.5 py-2 text-xs border border-gray-300 rounded-lg focus:border-slate-900 outline-none cursor-pointer bg-white"
              >
                <option value="All">All Locations</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi NCR</option>
                <option value="Goa">Goa</option>
                <option value="Kochi">Kochi</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Pune">Pune</option>
              </select>
            </div>

            {/* Specialization */}
            <div>
              <select
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                className="w-full px-2.5 py-2 text-xs border border-gray-300 rounded-lg focus:border-slate-900 outline-none cursor-pointer bg-white"
              >
                <option value="All">All Disciplines</option>
                <option value="Residential">Residential Architecture</option>
                <option value="Apartment">Apartment Interiors</option>
                <option value="Commercial">Commercial Offices</option>
                <option value="Sustainable">Sustainable & Farmhouses</option>
                <option value="Holiday">Heritage & Holiday Villas</option>
              </select>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleApplyFilters}
                className="flex-1 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold uppercase tracking-wider transition-colors"
              >
                Apply
              </button>
              {(search || style !== 'All' || budget !== 'All' || location !== 'All' || specialization !== 'All') && (
                <button
                  onClick={handleResetFilters}
                  className="p-2 rounded-lg border border-gray-300 text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                  title="Reset filters"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs text-gray-500">
            <span>
              Showing <strong className="text-gray-900">{designers.length}</strong> registered studios
            </span>
            <div className="flex items-center gap-2">
              <span>Sort:</span>
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  const next = Object.fromEntries(searchParams.entries());
                  next.sort = e.target.value;
                  setSearchParams(next);
                }}
                className="bg-transparent font-medium text-gray-800 outline-none cursor-pointer"
              >
                <option value="rating">Highest Rating</option>
                <option value="experience">Years of Experience</option>
                <option value="reviews">Review Count</option>
                <option value="newest">Recently Registered</option>
              </select>
            </div>
          </div>
        </div>

        {/* Studio Cards Grid */}
        {loading ? (
          <div className="py-16 text-center text-xs text-gray-500">
            Loading design studios...
          </div>
        ) : designers.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-xl border border-gray-200 p-8">
            <h3 className="text-base font-bold text-gray-800 mb-1">No Studios Found</h3>
            <p className="text-xs text-gray-500 mb-4">
              Try broadening your location or specialization filter.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-medium"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {designers.map((designer) => (
              <div
                key={designer.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs hover:border-gray-300 hover:shadow-sm transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Studio Image Header */}
                  <div className="h-44 bg-gray-100 relative overflow-hidden">
                    <img
                      src={designer.coverImageUrl}
                      alt={designer.studioName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2.5 right-2.5 bg-white/95 px-2 py-0.5 rounded text-[11px] font-semibold text-gray-800 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                      <span>{designer.averageRating} ({designer.reviewCount})</span>
                    </div>

                    {designer.featured && (
                      <div className="absolute top-2.5 left-2.5 bg-slate-900/90 text-white px-2 py-0.5 rounded text-[10px] font-medium tracking-wide">
                        Featured Firm
                      </div>
                    )}
                  </div>

                  <div className="p-4 sm:p-5">
                    {/* Studio Header */}
                    <div className="flex items-start gap-3 mb-2">
                      <img
                        src={designer.avatarUrl}
                        alt={designer.user?.name}
                        className="w-11 h-11 rounded-lg object-cover border border-gray-200 shrink-0"
                      />
                      <div>
                        <h2 className="text-base font-bold text-gray-900 leading-tight">
                          {designer.studioName}
                        </h2>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {designer.user?.name} • {designer.experienceYears}y exp
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 flex items-center gap-1 mb-2">
                      <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span>{designer.location}</span>
                    </p>

                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-3">
                      {designer.bio}
                    </p>

                    {/* COA Badge */}
                    {designer.accreditations && (
                      <div className="p-2 rounded bg-gray-50 border border-gray-200 text-[11px] text-gray-700 flex items-center gap-1.5 mb-3">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate font-medium">{designer.accreditations}</span>
                      </div>
                    )}

                    {/* Project previews */}
                    {designer.projects && designer.projects.length > 0 && (
                      <div className="mb-2">
                        <span className="text-[10px] uppercase font-semibold text-gray-400 tracking-wider block mb-1">
                          Recent Projects ({designer.projects.length})
                        </span>
                        <div className="grid grid-cols-3 gap-1.5">
                          {designer.projects.slice(0, 3).map((p) => (
                            <div key={p.id} className="h-14 rounded overflow-hidden bg-gray-100 border border-gray-200">
                              <img src={p.thumbnail} alt={p.title} className="w-full h-full object-cover" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between gap-2">
                  <div className="text-xs">
                    <span className="text-gray-400 block text-[10px] uppercase">Budget Tier</span>
                    <span className="font-semibold text-gray-800">{designer.budgetTier}</span>
                  </div>
                  <Link
                    to={`/designers/${designer.id}`}
                    className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors flex items-center gap-1"
                  >
                    <span>View Portfolio</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
