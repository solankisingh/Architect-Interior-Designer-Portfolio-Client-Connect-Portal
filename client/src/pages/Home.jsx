import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
  Search,
  ArrowRight,
  ShieldCheck,
  Star,
  MapPin,
  Sparkles,
  Award,
  Layers,
  ChevronRight,
  Building2,
  Compass,
  CheckCircle,
  Briefcase
} from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const [featuredDesigners, setFeaturedDesigners] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
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
    if (searchTerm.trim()) {
      navigate(`/designers?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/designers');
    }
  };

  const categories = [
    {
      title: 'Residential Architecture',
      desc: 'Bespoke coastal villas, hill retreats & sustainable modern residences',
      image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=600&q=80',
      query: 'Residential'
    },
    {
      title: 'Modern Minimalist',
      desc: 'Clean lines, travertine finishes & reductionist spatial tranquility',
      image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80',
      query: 'Modern Minimalist'
    },
    {
      title: 'Biophilic Contemporary',
      desc: 'Passive climate cooling, indoor courtyards & microclimate gardens',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80',
      query: 'Biophilic Contemporary'
    },
    {
      title: 'Industrial & Creative Studios',
      desc: 'Steel crittall glazing, exposed concrete & adaptive workspace reuse',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
      query: 'Industrial Loft'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[88vh] flex items-center justify-center bg-charcoal-950 text-white overflow-hidden">
        {/* Architectural Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=85"
            alt="Architectural Masterpiece"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/70 to-charcoal-950/40" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          {/* Institutional Ribbon */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-charcoal-800/80 border border-charcoal-700 text-atelier-300 text-xs font-medium mb-8 backdrop-blur-md animate-in fade-in">
            <Award className="w-3.5 h-3.5 text-atelier-400" />
            <span>Connecting Discerning Clients with COA & IIID Accredited Studios</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.15]">
            Where Visionary Architecture <br />
            <span className="italic font-normal text-atelier-300">Meets Exceptional Living</span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-charcoal-300 mb-10 leading-relaxed font-sans font-light">
            Discover premier architects and interior designers. Explore curated portfolios, review detailed case studies, and initiate direct project commissions.
          </p>

          {/* Search Box */}
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-3xl mx-auto bg-white/95 backdrop-blur-lg p-2 rounded-2xl sm:rounded-full shadow-2xl flex flex-col sm:flex-row items-center gap-2 border border-atelier-200"
          >
            <div className="flex-1 flex items-center gap-3 px-4 w-full">
              <Search className="w-5 h-5 text-atelier-600 shrink-0" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by studio name, architectural style, or city..."
                className="w-full py-2.5 text-sm text-charcoal-900 bg-transparent outline-none placeholder:text-charcoal-400"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-charcoal-900 hover:bg-atelier-700 text-white text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shrink-0 shadow-md"
            >
              <span>Explore Studios</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Style Pills */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-charcoal-400">
            <span className="text-atelier-400 font-medium">Trending Disciplines:</span>
            {['Modern Minimalist', 'Biophilic Contemporary', 'Scandinavian', 'Penthouse Architecture', 'Courtyard Homes'].map((tag) => (
              <button
                key={tag}
                onClick={() => navigate(`/designers?style=${encodeURIComponent(tag)}`)}
                className="px-3 py-1 rounded-full bg-charcoal-800/80 hover:bg-charcoal-700 text-charcoal-300 hover:text-white border border-charcoal-700 transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Institutional Standards Banner */}
      <section className="bg-[#F5F0E8] border-y border-atelier-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-6 text-xs text-charcoal-700">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-atelier-700" />
            <span className="font-semibold text-charcoal-900">Standardized Portfolios</span>
            <span className="hidden md:inline text-charcoal-500">• Complete case studies with budget & square footage</span>
          </div>
          <div className="flex items-center gap-3">
            <Award className="w-5 h-5 text-atelier-700" />
            <span className="font-semibold text-charcoal-900">Accredited Professionals</span>
            <span className="hidden md:inline text-charcoal-500">• Council of Architecture & IIID members</span>
          </div>
          <div className="flex items-center gap-3">
            <Briefcase className="w-5 h-5 text-atelier-700" />
            <span className="font-semibold text-charcoal-900">Direct Client Inquiries</span>
            <span className="hidden md:inline text-charcoal-500">• Transparent proposal workflows</span>
          </div>
        </div>
      </section>

      {/* Curated Disciplines Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
          <div>
            <span className="text-xs uppercase tracking-widest text-atelier-700 font-semibold block mb-2">
              Curated Architectural Disciplines
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-950">
              Tailored to Your Living Philosophy
            </h2>
          </div>
          <Link
            to="/designers"
            className="mt-4 sm:mt-0 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-atelier-700 hover:text-atelier-900 group"
          >
            <span>View All Specializations</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              onClick={() => navigate(`/designers?style=${encodeURIComponent(cat.query)}`)}
              className="group cursor-pointer rounded-2xl overflow-hidden bg-white border border-atelier-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              <div className="relative h-56 overflow-hidden bg-charcoal-900">
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover img-zoom"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/80 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-4 text-xs font-semibold text-atelier-300">
                  Explore Case Studies
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-lg font-bold text-charcoal-900 group-hover:text-atelier-700 transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-charcoal-600 mt-1 leading-relaxed">
                    {cat.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-atelier-100 flex items-center justify-between text-xs font-medium text-atelier-700">
                  <span>Browse Studios</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Studios Showcase */}
      <section className="bg-[#F5F0E8] py-20 border-y border-atelier-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-widest text-atelier-700 font-semibold block mb-2">
              Featured Studios & Architects
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-950 mb-3">
              Visionary Designers Shaping Spaces
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-600">
              Selected for exceptional spatial craftsmanship, sustainable materiality, and verified client testimonials.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredDesigners.slice(0, 3).map((designer) => (
              <div
                key={designer.id}
                className="bg-white rounded-3xl overflow-hidden border border-atelier-200/90 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col"
              >
                {/* Cover & Avatar Header */}
                <div className="relative h-44 bg-charcoal-900 overflow-hidden">
                  <img
                    src={designer.coverImageUrl || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'}
                    alt={designer.studioName}
                    className="w-full h-full object-cover img-zoom"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/70 to-transparent" />
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-charcoal-900 text-[11px] font-semibold flex items-center gap-1 shadow-sm">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    <span>{designer.averageRating} ({designer.reviewCount})</span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 -mt-12 mb-3">
                      <img
                        src={designer.avatarUrl || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'}
                        alt={designer.studioName}
                        className="w-16 h-16 rounded-2xl object-cover border-4 border-white shadow-md bg-white"
                      />
                      <div className="pt-6">
                        <span className="text-[10px] text-atelier-700 font-semibold uppercase tracking-wider block">
                          {designer.budgetTier} Budget Tier • {designer.experienceYears}y Exp
                        </span>
                        <h3 className="font-serif text-lg font-bold text-charcoal-950 leading-tight">
                          {designer.studioName}
                        </h3>
                      </div>
                    </div>

                    <p className="text-xs text-charcoal-500 flex items-center gap-1 mb-3">
                      <MapPin className="w-3.5 h-3.5 text-atelier-600 shrink-0" />
                      <span>{designer.location}</span>
                    </p>

                    <p className="text-xs text-charcoal-600 line-clamp-3 leading-relaxed mb-4">
                      {designer.bio}
                    </p>

                    {/* Accreditations badge */}
                    {designer.accreditations && (
                      <div className="p-2.5 rounded-xl bg-atelier-50 border border-atelier-200 text-[11px] text-charcoal-700 mb-4 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-atelier-700 shrink-0" />
                        <span className="truncate">{designer.accreditations}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-atelier-100 flex items-center justify-between gap-3">
                    <Link
                      to={`/designers/${designer.id}`}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-charcoal-900 hover:bg-charcoal-800 text-white text-xs font-semibold text-center uppercase tracking-wider shadow-sm transition-colors"
                    >
                      View Portfolio
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/designers"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white hover:bg-atelier-100 text-charcoal-900 border border-atelier-300 text-xs font-semibold uppercase tracking-wider shadow-sm transition-all"
            >
              <span>Explore All Registered Studios</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-atelier-700 font-semibold block mb-2">
            The Commissioning Workflow
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-950 mb-3">
            Connecting Clients & Designers Seamlessly
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-600">
            A transparent and structured platform built for architectural accuracy, clear scope definitions, and trusted outcomes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-white border border-atelier-200 shadow-sm relative">
            <span className="font-serif text-5xl font-bold text-atelier-200 absolute top-6 right-6">01</span>
            <div className="w-12 h-12 rounded-2xl bg-charcoal-900 text-atelier-300 flex items-center justify-center font-bold text-lg mb-6">
              🔍
            </div>
            <h3 className="font-serif text-xl font-bold text-charcoal-900 mb-2">Discover & Compare</h3>
            <p className="text-xs text-charcoal-600 leading-relaxed">
              Filter by architectural style, budget tiers, geographic location, and accreditations. Inspect completed project case studies with photos and square footage.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-atelier-200 shadow-sm relative">
            <span className="font-serif text-5xl font-bold text-atelier-200 absolute top-6 right-6">02</span>
            <div className="w-12 h-12 rounded-2xl bg-charcoal-900 text-atelier-300 flex items-center justify-center font-bold text-lg mb-6">
              📋
            </div>
            <h3 className="font-serif text-xl font-bold text-charcoal-900 mb-2">Send Structured Inquiry</h3>
            <p className="text-xs text-charcoal-600 leading-relaxed">
              Submit your property type, timeline, and estimated budget. Directly connect with the principal architect through tracked, private communication threads.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-atelier-200 shadow-sm relative">
            <span className="font-serif text-5xl font-bold text-atelier-200 absolute top-6 right-6">03</span>
            <div className="w-12 h-12 rounded-2xl bg-charcoal-900 text-atelier-300 flex items-center justify-center font-bold text-lg mb-6">
              ⭐
            </div>
            <h3 className="font-serif text-xl font-bold text-charcoal-900 mb-2">Review & Build Trust</h3>
            <p className="text-xs text-charcoal-600 leading-relaxed">
              Upon engagement completion, provide verified ratings and reviews to celebrate exceptional craftsmanship and guide the design community.
            </p>
          </div>
        </div>
      </section>

      {/* Live Statistics / Platform KPIs */}
      <section className="bg-charcoal-950 text-white py-16 border-t border-charcoal-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="font-serif text-4xl sm:text-5xl font-bold text-atelier-300 mb-1">120+</p>
            <p className="text-xs uppercase tracking-wider text-charcoal-400">Accredited Studios</p>
          </div>
          <div>
            <p className="font-serif text-4xl sm:text-5xl font-bold text-atelier-300 mb-1">450+</p>
            <p className="text-xs uppercase tracking-wider text-charcoal-400">Portfolios Published</p>
          </div>
          <div>
            <p className="font-serif text-4xl sm:text-5xl font-bold text-atelier-300 mb-1">98%</p>
            <p className="text-xs uppercase tracking-wider text-charcoal-400">Client Satisfaction</p>
          </div>
          <div>
            <p className="font-serif text-4xl sm:text-5xl font-bold text-atelier-300 mb-1">1,200+</p>
            <p className="text-xs uppercase tracking-wider text-charcoal-400">Project Inquiries</p>
          </div>
        </div>
      </section>
    </div>
  );
}
