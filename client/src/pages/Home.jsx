import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
  Search,
  ArrowRight,
  ShieldCheck,
  Star,
  MapPin,
  Building,
  Briefcase,
  CheckCircle,
  Award,
  ChevronRight
} from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const [featuredDesigners, setFeaturedDesigners] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get('/designers/featured');
        setFeaturedDesigners(res.data.featured || []);
      } catch (err) {
        console.error('Failed to load featured designers:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const queryParts = [];
    if (searchTerm.trim()) queryParts.push(`search=${encodeURIComponent(searchTerm.trim())}`);
    if (selectedCity) queryParts.push(`location=${encodeURIComponent(selectedCity)}`);

    if (queryParts.length > 0) {
      navigate(`/designers?${queryParts.join('&')}`);
    } else {
      navigate('/designers');
    }
  };

  const projectCategories = [
    {
      title: 'Residential Architecture',
      desc: 'Independent villas, bungalow construction, and courtyard floor plans',
      image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=600&q=80',
      category: 'Residential'
    },
    {
      title: 'Apartment & Penthouse Interiors',
      desc: 'Turn-key 2BHK/3BHK interior renovation, modular kitchens & bespoke woodwork',
      image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80',
      category: 'Apartment'
    },
    {
      title: 'Commercial & Retail Workspaces',
      desc: 'Office interiors, collaborative coworking hubs, and retail outlets',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
      category: 'Commercial'
    },
    {
      title: 'Holiday Homes & Vernacular Villas',
      desc: 'Heritage restoration, Goan villas, hill cottages, and farmhouses',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80',
      category: 'Holiday'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="border-b border-gray-200 bg-slate-900 text-white relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-amber-400 text-xs font-medium mb-6">
            <Award className="w-3.5 h-3.5" />
            <span>Aligned with Council of Architecture (COA) & IIID Professional Guidelines</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight font-sans">
            Connect with Registered Architects & <br className="hidden sm:inline" />
            Interior Designers for Your Project
          </h1>

          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto mb-8 font-normal">
            Explore authentic portfolio case studies with square footage, floor layouts, and realistic budgets. Send project inquiries directly to principal architects.
          </p>

          {/* Search Box */}
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-3xl mx-auto bg-white p-2 rounded-xl shadow-lg flex flex-col sm:flex-row items-center gap-2 border border-gray-300 text-gray-900"
          >
            <div className="flex-1 flex items-center gap-2 px-3 w-full">
              <Search className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by studio name, style, or specialization..."
                className="w-full py-2 text-xs sm:text-sm bg-transparent outline-none placeholder:text-gray-400"
              />
            </div>

            <div className="w-full sm:w-44 border-t sm:border-t-0 sm:border-l border-gray-200 px-2">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full py-2 text-xs sm:text-sm bg-transparent text-gray-700 outline-none cursor-pointer"
              >
                <option value="">All Cities</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi NCR</option>
                <option value="Goa">Goa</option>
                <option value="Kochi">Kochi</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Pune">Pune</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold uppercase tracking-wider transition-colors shrink-0"
            >
              Search
            </button>
          </form>

          {/* Quick city tags */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs text-gray-400">
            <span>Popular Cities:</span>
            {['Bangalore', 'Mumbai', 'Goa', 'Delhi NCR', 'Pune'].map((city) => (
              <button
                key={city}
                onClick={() => navigate(`/designers?location=${encodeURIComponent(city)}`)}
                className="px-2.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-gray-300 transition-colors"
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Project Categories & Specializations
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Select a discipline to discover specialized architecture and design studios.
            </p>
          </div>
          <Link
            to="/designers"
            className="mt-2 sm:mt-0 text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1"
          >
            <span>View All Designers</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {projectCategories.map((item, idx) => (
            <div
              key={idx}
              onClick={() => navigate(`/designers?specialization=${encodeURIComponent(item.category)}`)}
              className="group cursor-pointer rounded-xl border border-gray-200 overflow-hidden hover:border-gray-400 hover:shadow-md transition-all flex flex-col bg-white"
            >
              <div className="h-44 overflow-hidden bg-gray-100">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 group-hover:text-amber-700 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-600 mt-1 leading-normal">
                    {item.desc}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-gray-100 text-[11px] font-semibold text-amber-700 flex items-center gap-1">
                  <span>Browse Studios</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Studios */}
      <section className="bg-gray-50 border-y border-gray-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl font-bold text-gray-900">
              Featured Architecture Studios
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Accredited design practices with completed real-world portfolios and verified client reviews.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredDesigners.slice(0, 3).map((designer) => (
              <div
                key={designer.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="h-44 bg-gray-200 relative overflow-hidden">
                    <img
                      src={designer.coverImageUrl}
                      alt={designer.studioName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2.5 right-2.5 bg-white/95 px-2 py-0.5 rounded text-[11px] font-semibold text-gray-800 flex items-center gap-1 shadow-xs">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                      <span>{designer.averageRating} ({designer.reviewCount})</span>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-semibold text-amber-700">
                        {designer.budgetTier}
                      </span>
                      <span className="text-gray-300">•</span>
                      <span className="text-[11px] text-gray-500">
                        {designer.experienceYears} Years Exp
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-gray-900 leading-snug">
                      {designer.studioName}
                    </h3>

                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1 mb-2">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      <span>{designer.location}</span>
                    </p>

                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-3">
                      {designer.bio}
                    </p>

                    {designer.accreditations && (
                      <div className="p-2 rounded bg-slate-50 border border-slate-200 text-[11px] text-gray-700 flex items-center gap-1.5 mb-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                        <span className="truncate">{designer.accreditations}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                  <Link
                    to={`/designers/${designer.id}`}
                    className="w-full py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1 transition-colors"
                  >
                    <span>View Profile & Work</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/designers"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 text-xs font-semibold text-gray-800 transition-colors"
            >
              <span>Explore All Registered Studios</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            How ArchConnect Works
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Simple 3-step process to find, evaluate, and collaborate with verified architects.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl border border-gray-200 bg-white">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm mb-4">
              1
            </div>
            <h3 className="text-sm font-bold text-gray-900 mb-1">
              Search by City & Budget
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Filter by project type (Bungalow, Flat, Commercial), location, and budget range in Rupees. Review completed photos and square footages.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-gray-200 bg-white">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm mb-4">
              2
            </div>
            <h3 className="text-sm font-bold text-gray-900 mb-1">
              Send Structured Project Brief
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Submit your plot size or apartment carpet area, estimated budget, and requirements. The architect reviews the scope and replies directly.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-gray-200 bg-white">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm mb-4">
              3
            </div>
            <h3 className="text-sm font-bold text-gray-900 mb-1">
              Direct Communication & Review
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Communicate through the project inquiry thread. Once your drawings and project are complete, leave an honest client rating.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
