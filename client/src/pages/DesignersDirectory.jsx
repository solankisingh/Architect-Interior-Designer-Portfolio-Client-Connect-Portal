import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../services/api';
import {
  Search,
  Filter,
  Star,
  MapPin,
  ShieldCheck,
  ArrowRight,
  SlidersHorizontal,
  X,
  ChevronDown,
  Layers,
  Sparkles
} from 'lucide-react';

export default function DesignersDirectory() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [designers, setDesigners] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state initialized from URL query params
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [style, setStyle] = useState(searchParams.get('style') || 'All');
  const [budget, setBudget] = useState(searchParams.get('budget') || 'All');
  const [location, setLocation] = useState(searchParams.get('location') || 'All');
  const [specialization, setSpecialization] = useState(searchParams.get('specialization') || 'All');
  const [sort, setSort] = useState(searchParams.get('sort') || 'rating');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

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
    const nextParams = {};
    if (search) nextParams.search = search;
    if (style !== 'All') nextParams.style = style;
    if (budget !== 'All') nextParams.budget = budget;
    if (location !== 'All') nextParams.location = location;
    if (specialization !== 'All') nextParams.specialization = specialization;
    if (sort !== 'rating') nextParams.sort = sort;
    setSearchParams(nextParams);
    setMobileFilterOpen(false);
  };

  const handleClearFilters = () => {
    setSearch('');
    setStyle('All');
    setBudget('All');
    setLocation('All');
    setSpecialization('All');
    setSort('rating');
    setSearchParams({});
  };

  return (
    <div className="min-h-screen py-10 bg-[#FBF9F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-10 text-center sm:text-left">
          <span className="text-xs uppercase tracking-widest text-atelier-700 font-semibold block mb-2">
            Curated Architectural Directory
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal-950">
            Discover Architects & Interior Studios
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-600 mt-2 max-w-2xl">
            Explore verified portfolios, compare design philosophies, and connect directly with studios for your next residential or commercial vision.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-2xl border border-atelier-200 p-4 sm:p-5 shadow-sm mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Search Input */}
            <div className="md:col-span-5 relative">
              <Search className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
                placeholder="Search studio name, architect, keyword..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-atelier-300 focus:border-atelier-600 outline-none text-xs sm:text-sm bg-[#FBF9F5]"
              />
            </div>

            {/* Design Style Filter */}
            <div className="md:col-span-3">
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-atelier-300 focus:border-atelier-600 outline-none text-xs sm:text-sm bg-[#FBF9F5]"
              >
                <option value="All">All Design Styles</option>
                <option value="Modern Minimalist">Modern Minimalist</option>
                <option value="Biophilic Contemporary">Biophilic Contemporary</option>
                <option value="Scandinavian">Scandinavian</option>
                <option value="Industrial Loft">Industrial Loft</option>
                <option value="Neo-Classical">Neo-Classical</option>
                <option value="Mediterranean Warmth">Mediterranean Warmth</option>
              </select>
            </div>

            {/* Budget Filter */}
            <div className="md:col-span-2">
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-atelier-300 focus:border-atelier-600 outline-none text-xs sm:text-sm bg-[#FBF9F5]"
              >
                <option value="All">All Budgets</option>
                <option value="$">$ (Under $25K)</option>
                <option value="$$">$$ ($25K - $75K)</option>
                <option value="$$$">$$$ ($75K - $200K)</option>
                <option value="$$$$">$$$$ ($200K+ Luxury)</option>
              </select>
            </div>

            {/* Apply Button */}
            <div className="md:col-span-2 flex items-center gap-2">
              <button
                onClick={handleApplyFilters}
                className="w-full py-2.5 rounded-xl bg-charcoal-900 hover:bg-charcoal-800 text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
              >
                Filter
              </button>
              {(search || style !== 'All' || budget !== 'All' || location !== 'All' || specialization !== 'All') && (
                <button
                  onClick={handleClearFilters}
                  className="p-2.5 rounded-xl border border-atelier-300 text-charcoal-500 hover:text-charcoal-900 hover:bg-atelier-100 transition-colors"
                  title="Clear all filters"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Secondary Sorting and Active Counts */}
          <div className="flex flex-wrap items-center justify-between pt-3 border-t border-atelier-100 text-xs text-charcoal-600">
            <span className="font-medium">
              Showing <strong className="text-charcoal-950">{designers.length}</strong> accredited studios
            </span>

            <div className="flex items-center gap-2">
              <span className="text-charcoal-400">Sort By:</span>
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  const next = Object.fromEntries(searchParams.entries());
                  next.sort = e.target.value;
                  setSearchParams(next);
                }}
                className="bg-transparent font-semibold text-charcoal-900 outline-none cursor-pointer"
              >
                <option value="rating">Highest Rated</option>
                <option value="experience">Years of Experience</option>
                <option value="reviews">Most Reviewed</option>
                <option value="newest">Recently Joined</option>
              </select>
            </div>
          </div>
        </div>

        {/* Directory Grid */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-10 h-10 border-4 border-atelier-300 border-t-atelier-700 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-xs text-charcoal-500">Searching design studios...</p>
          </div>
        ) : designers.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-atelier-200 p-8">
            <p className="font-serif text-2xl font-bold text-charcoal-900 mb-2">No Studios Match Your Search</p>
            <p className="text-xs text-charcoal-500 max-w-md mx-auto mb-6">
              Try adjusting your style or budget criteria, or clear the filters to explore all registered architects.
            </p>
            <button
              onClick={handleClearFilters}
              className="px-6 py-2.5 rounded-full bg-charcoal-900 text-white text-xs font-semibold uppercase tracking-wider"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {designers.map((designer) => (
              <div
                key={designer.id}
                className="bg-white rounded-3xl overflow-hidden border border-atelier-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                {/* Cover Image & Rating Badge */}
                <div className="relative h-48 bg-charcoal-900 overflow-hidden">
                  <img
                    src={designer.coverImageUrl || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'}
                    alt={designer.studioName}
                    className="w-full h-full object-cover img-zoom"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/70 via-transparent to-transparent" />
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-sm text-charcoal-900 text-[11px] font-semibold flex items-center gap-1 shadow-sm">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    <span>{designer.averageRating}</span>
                    <span className="text-charcoal-400">({designer.reviewCount})</span>
                  </div>

                  {designer.featured && (
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-atelier-600 text-white text-[10px] font-semibold uppercase tracking-wider shadow-sm">
                      Curated Spotlight
                    </div>
                  )}
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Header with avatar */}
                    <div className="flex items-start gap-3 -mt-12 mb-3">
                      <img
                        src={designer.avatarUrl || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'}
                        alt={designer.studioName}
                        className="w-16 h-16 rounded-2xl object-cover border-4 border-white shadow-md bg-white shrink-0"
                      />
                      <div className="pt-6">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-atelier-700 font-bold uppercase tracking-wider">
                            {designer.budgetTier} Tier
                          </span>
                          <span className="text-charcoal-300">•</span>
                          <span className="text-[10px] text-charcoal-500 font-medium">
                            {designer.experienceYears} Years Exp
                          </span>
                        </div>
                        <h3 className="font-serif text-lg font-bold text-charcoal-950 group-hover:text-atelier-700 transition-colors leading-snug">
                          {designer.studioName}
                        </h3>
                      </div>
                    </div>

                    <p className="text-xs text-charcoal-500 flex items-center gap-1 mb-2">
                      <MapPin className="w-3.5 h-3.5 text-atelier-600 shrink-0" />
                      <span>{designer.location}</span>
                    </p>

                    <p className="text-xs text-charcoal-600 line-clamp-2 leading-relaxed mb-4">
                      {designer.bio}
                    </p>

                    {/* Design Styles Tags */}
                    {designer.designStyles && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {designer.designStyles.split(',').slice(0, 3).map((st, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md bg-atelier-50 text-[10px] text-charcoal-700 border border-atelier-200"
                          >
                            {st.trim()}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Project Thumbnail Previews */}
                    {designer.projects && designer.projects.length > 0 && (
                      <div className="mb-4">
                        <span className="text-[10px] uppercase tracking-wider text-charcoal-400 font-semibold block mb-1.5">
                          Recent Portfolios ({designer._count?.projects || designer.projects.length})
                        </span>
                        <div className="grid grid-cols-3 gap-1.5">
                          {designer.projects.slice(0, 3).map((proj) => (
                            <div key={proj.id} className="h-14 rounded-lg overflow-hidden bg-charcoal-100">
                              <img
                                src={proj.thumbnail}
                                alt={proj.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-atelier-100 flex items-center justify-between gap-3">
                    <Link
                      to={`/designers/${designer.id}`}
                      className="w-full py-2.5 px-4 rounded-xl bg-charcoal-900 hover:bg-charcoal-800 text-white text-xs font-semibold text-center uppercase tracking-wider shadow-sm transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>Explore Portfolio</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
