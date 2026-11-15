import React, { useState, useEffect, useRef } from 'react';
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

  // ----- Hero slideshow state -----
  const heroImages = [
    // 1. Modern luxury villa exterior
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
    // 2. Premium contemporary interior
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1600&q=80',
    // 3. Modern commercial architecture
    'https://images.unsplash.com/photo-1529429617121-8da5d85fd6e8?auto=format&fit=crop&w=1600&q=80',
    // 4. Luxury residential architecture
    'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1600&q=80'
  ];
  const [bgIndex, setBgIndex] = useState(0);
  const intervalRef = useRef(null);

  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const startSlideshow = () => {
    if (prefersReducedMotion) return;
    intervalRef.current = setInterval(() => {
      setBgIndex(prev => (prev + 1) % heroImages.length);
    }, 5000);
  };

  const resetSlideshow = () => {
    clearInterval(intervalRef.current);
    startSlideshow();
  };

  useEffect(() => {
    startSlideshow();
    return () => clearInterval(intervalRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Preload next image to avoid flash
    const nextIdx = (bgIndex + 1) % heroImages.length;
    const img = new Image();
    img.src = heroImages[nextIdx];
  }, [bgIndex]);

  // ----- Fetch featured designers -----
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
      image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80',
      category: 'Residential'
    },
    {
      title: 'Apartment & Penthouse Interiors',
      desc: 'Turn-key 2BHK/3BHK interior renovation, modular kitchens & bespoke woodwork',
      image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80',
      category: 'Apartment'
    },
    {
      title: 'Commercial & Retail Workspaces',
      desc: 'Office interiors, collaborative coworking hubs, and retail outlets',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
      category: 'Commercial'
    },
    {
      title: 'Holiday Homes & Vernacular Villas',
      desc: 'Heritage restoration, Goan villas, hill cottages, and farmhouses',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
      category: 'Holiday'
    }
  ];

  return (
    <div className="w-full min-h-screen bg-white">
      {/* Hero Section */}
      <section
        className="relative w-full border-b border-gray-200 bg-white text-white min-h-[70vh] flex items-center justify-center py-20 lg:py-28 px-6 sm:px-10 lg:px-16 bg-cover bg-center transition-opacity duration-1000"
        style={{ backgroundImage: `url(${heroImages[bgIndex]})` }}
      >
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent pointer-events-none"></div>
        <div className="relative w-full text-center max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-amber-400 text-sm font-medium mb-6">
            <Award className="w-4 h-4" />
            <span>Council of Architecture (COA) &amp; IIID Professional Guidelines Compliant</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-5 leading-tight font-sans">
            Connect with Registered Architects &amp; <br className="hidden sm:inline" />
            Interior Designers
          </h1>

          <p className="text-base sm:text-lg text-gray-300 max-w-3xl mx-auto mb-10 font-normal leading-relaxed">
            Explore authentic portfolio case studies with square footage, floor layouts, and realistic budgets. Send project inquiries directly to principal architects.
          </p>

          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="w-full max-w-4xl mx-auto bg-white p-2.5 rounded-xl shadow-xl flex flex-col sm:flex-row items-center gap-2.5 border border-gray-300 text-gray-900">
            <div className="flex-1 flex items-center gap-2.5 px-4 w-full">
              <Search className="w-5 h-5 text-gray-400 shrink-0" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search studio name, design style, or building category..."
                className="w-full py-2.5 text-sm sm:text-base bg-transparent outline-none placeholder:text-gray-400"
              />
            </div>

            <div className="w-full sm:w-56 border-t sm:border-t-0 sm:border-l border-gray-200 px-3">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full py-2.5 text-sm sm:text-base bg-transparent text-gray-700 outline-none cursor-pointer"
              >
                <option value="">All Cities in India</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi NCR</option>
                <option value="Goa">Goa</option>
                <option value="Kochi">Kochi</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Pune">Pune</option>
              </select>
            </div>

            <button type="submit" className="w-full sm:w-auto px-8 py-3 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold uppercase tracking-wider transition-colors shrink-0">
              Search Studios
            </button>
          </form>

          {/* Popular Cities */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5 text-sm text-gray-400">
            <span className="font-medium text-gray-300">Explore City Hubs:</span>
            {['Bangalore', 'Mumbai', 'Goa', 'Delhi NCR', 'Kochi', 'Hyderabad', 'Pune'].map((city) => (
              <button
                key={city}
                onClick={() => navigate(`/designers?location=${encodeURIComponent(city)}`)}
                className="px-3.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-gray-200 text-sm font-medium transition-colors"
              >
                {city}
              </button>
            ))}
          </div>

          {/* Slideshow Indicators
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {heroImages.map((_, i) => (
              <button
                key={i}
                onClick={() => { setBgIndex(i); resetSlideshow(); }}
                className={`w-3 h-3 rounded-full transition-colors ${i === bgIndex ? 'bg-white' : 'bg-white/50 hover:bg-white/80'}`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div> */}
        </div>
      </section>

      {/* Categories Section */}
      <section className="w-full px-6 sm:px-10 lg:px-16 py-16 lg:py-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-3 border-b border-gray-100">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Disciplines &amp; Specializations
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Select a specialized category to discover architects with verified project case studies.
            </p>
          </div>
          <Link
            to="/designers"
            className="mt-2 sm:mt-0 text-sm font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1.5"
          >
            <span>Explore All Registered Practices</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {projectCategories.map((item, idx) => (
            <div
              key={idx}
              onClick={() => navigate(`/designers?specialization=${encodeURIComponent(item.category)}`)}
              className="group cursor-pointer rounded-xl border border-gray-200 overflow-hidden hover:border-gray-400 hover:shadow-lg transition-all flex flex-col bg-white"
            >
              <div className="h-52 overflow-hidden bg-gray-100">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-amber-700 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100 text-sm font-semibold text-amber-700 flex items-center justify-between">
                  <span>Browse Studios</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Remaining sections unchanged ... */}
    </div>
  );
}
