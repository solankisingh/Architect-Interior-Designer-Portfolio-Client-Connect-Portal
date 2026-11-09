import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import InquiryModal from '../components/InquiryModal';
import ProjectLightboxModal from '../components/ProjectLightboxModal';
import ReviewModal from '../components/ReviewModal';
import {
  Star,
  MapPin,
  Calendar,
  Award,
  Globe,
  Phone,
  Mail,
  ShieldCheck,
  Send,
  Eye,
  Sparkles,
  Maximize2,
  Tag,
  MessageSquarePlus,
  ArrowLeft
} from 'lucide-react';

export default function DesignerDetail() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();

  const [designer, setDesigner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals state
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [activeLightboxProject, setActiveLightboxProject] = useState(null);

  // Filter projects by category inside portfolio
  const [selectedCategory, setSelectedCategory] = useState('All');

  const fetchDesigner = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/designers/${id}`);
      setDesigner(res.data.designer);
    } catch (err) {
      console.error('Failed to fetch designer:', err);
      setError('Designer profile not found.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDesigner();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen py-24 text-center">
        <div className="w-10 h-10 border-4 border-atelier-300 border-t-atelier-700 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs text-charcoal-500">Loading studio portfolio...</p>
      </div>
    );
  }

  if (error || !designer) {
    return (
      <div className="min-h-screen py-24 text-center max-w-md mx-auto px-4">
        <h2 className="font-serif text-2xl font-bold text-charcoal-900 mb-2">Profile Not Found</h2>
        <p className="text-xs text-charcoal-600 mb-6">{error || 'This studio does not exist or has been removed.'}</p>
        <Link
          to="/designers"
          className="px-6 py-2.5 rounded-full bg-charcoal-900 text-white text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Studios</span>
        </Link>
      </div>
    );
  }

  // Filter projects
  const filteredProjects = selectedCategory === 'All'
    ? (designer.projects || [])
    : (designer.projects || []).filter((p) => p.category.toLowerCase().includes(selectedCategory.toLowerCase()));

  const categories = ['All', ...new Set((designer.projects || []).map((p) => p.category))];

  return (
    <div className="min-h-screen bg-[#FBF9F5] pb-24">
      {/* Studio Header Banner */}
      <div className="relative h-72 sm:h-96 w-full bg-charcoal-950 overflow-hidden">
        <img
          src={designer.coverImageUrl || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80'}
          alt={designer.studioName}
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FBF9F5] via-transparent to-charcoal-950/60" />

        <div className="absolute top-6 left-4 sm:left-8 z-10">
          <Link
            to="/designers"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white text-xs font-medium backdrop-blur-md border border-white/20 transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Directory</span>
          </Link>
        </div>
      </div>

      {/* Main Studio Information Card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 sm:-mt-32 relative z-20">
        <div className="bg-white rounded-3xl border border-atelier-200/90 shadow-xl p-6 sm:p-10 mb-12">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-8">
            {/* Studio Identity */}
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <img
                src={designer.avatarUrl || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80'}
                alt={designer.studioName}
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl object-cover border-4 border-white shadow-xl bg-white shrink-0"
              />

              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-atelier-100 text-atelier-800 text-[11px] font-bold uppercase tracking-wider">
                    {designer.budgetTier} Budget Tier
                  </span>
                  {designer.isVerified && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Verified Studio
                    </span>
                  )}
                  {designer.featured && (
                    <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-semibold">
                      Curated Spotlight
                    </span>
                  )}
                </div>

                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-950">
                  {designer.studioName}
                </h1>
                {designer.tagline && (
                  <p className="text-sm font-serif italic text-atelier-700">
                    "{designer.tagline}"
                  </p>
                )}

                <p className="text-xs text-charcoal-500 flex items-center gap-4 pt-1">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-atelier-600" />
                    {designer.location}
                  </span>
                  <span>•</span>
                  <span>Led by {designer.user?.name}</span>
                  <span>•</span>
                  <span>{designer.experienceYears} Years Experience</span>
                </p>
              </div>
            </div>

            {/* Quick Actions & Ratings */}
            <div className="w-full lg:w-auto flex flex-col sm:flex-row lg:flex-col items-stretch lg:items-end gap-3 shrink-0">
              <div className="p-3.5 rounded-2xl bg-atelier-50 border border-atelier-200 text-right flex items-center lg:justify-end gap-3">
                <div className="text-left lg:text-right">
                  <div className="flex items-center gap-1 text-sm font-bold text-charcoal-900 justify-start lg:justify-end">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                    <span>{designer.averageRating} / 5.0</span>
                  </div>
                  <p className="text-[11px] text-charcoal-500">Based on {designer.reviews?.length || designer.reviewCount} verified reviews</p>
                </div>
              </div>

              {/* Commission Button */}
              <button
                onClick={() => setInquiryModalOpen(true)}
                className="px-8 py-3.5 rounded-2xl bg-charcoal-900 hover:bg-atelier-800 text-atelier-100 text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Initiate Project Inquiry</span>
              </button>
            </div>
          </div>

          {/* Accreditations Ribbon */}
          {designer.accreditations && (
            <div className="mt-8 pt-6 border-t border-atelier-100 flex flex-wrap items-center gap-3 text-xs text-charcoal-700">
              <Award className="w-4 h-4 text-atelier-700 shrink-0" />
              <strong className="text-charcoal-900">Accreditations & Affiliations:</strong>
              <span className="px-3 py-1 rounded-lg bg-atelier-100/70 border border-atelier-200 text-charcoal-800 font-medium">
                {designer.accreditations}
              </span>
            </div>
          )}

          {/* Philosophy / Bio */}
          <div className="mt-8 pt-6 border-t border-atelier-100">
            <h3 className="text-xs uppercase tracking-wider text-atelier-700 font-semibold mb-2">
              Studio Philosophy & Architectural Vision
            </h3>
            <p className="text-xs sm:text-sm text-charcoal-700 leading-relaxed max-w-4xl">
              {designer.bio}
            </p>
          </div>
        </div>

        {/* Portfolio Showcase Section */}
        <div className="mb-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs uppercase tracking-widest text-atelier-700 font-semibold block mb-1">
                Completed Case Studies
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-950">
                Portfolio Showcase ({designer.projects?.length || 0})
              </h2>
            </div>

            {/* Category Filter Pills */}
            {categories.length > 1 && (
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                      selectedCategory === cat
                        ? 'bg-charcoal-900 text-white'
                        : 'bg-white hover:bg-atelier-100 text-charcoal-700 border border-atelier-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {filteredProjects.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-3xl border border-atelier-200 p-8">
              <p className="font-serif text-lg font-bold text-charcoal-800">No projects in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => setActiveLightboxProject(project)}
                  className="bg-white rounded-3xl overflow-hidden border border-atelier-200/90 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col group cursor-pointer"
                >
                  <div className="relative h-64 bg-charcoal-900 overflow-hidden">
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      className="w-full h-full object-cover img-zoom"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-5">
                      <span className="text-xs font-semibold text-atelier-200 flex items-center gap-1.5">
                        <Eye className="w-4 h-4" />
                        <span>View Project Case Study & Gallery</span>
                      </span>
                    </div>

                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-white/95 backdrop-blur-sm text-charcoal-900 text-[10px] font-semibold">
                      {project.style}
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-atelier-700 font-semibold mb-1">
                        <span>{project.category}</span>
                        <span>•</span>
                        <span>{project.completionYear}</span>
                      </div>
                      <h3 className="font-serif text-xl font-bold text-charcoal-950 group-hover:text-atelier-700 transition-colors mb-2">
                        {project.title}
                      </h3>
                      <p className="text-xs text-charcoal-600 line-clamp-3 leading-relaxed mb-4">
                        {project.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-atelier-100 flex items-center justify-between text-xs text-charcoal-500">
                      <span>{project.location}</span>
                      {project.areaSqFt && <span className="font-medium text-charcoal-800">{project.areaSqFt}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Client Reviews & Testimonials Section */}
        <div className="bg-white rounded-3xl border border-atelier-200/90 shadow-sm p-6 sm:p-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-atelier-100">
            <div>
              <span className="text-xs uppercase tracking-widest text-atelier-700 font-semibold block mb-1">
                Verified Client Testimonials
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-950">
                Client Reviews ({designer.reviews?.length || 0})
              </h2>
            </div>

            <button
              onClick={() => setReviewModalOpen(true)}
              className="px-5 py-2.5 rounded-xl border border-atelier-300 hover:border-atelier-600 hover:bg-atelier-50 text-charcoal-800 text-xs font-semibold uppercase tracking-wider transition-all inline-flex items-center gap-2 self-start sm:self-auto"
            >
              <MessageSquarePlus className="w-4 h-4 text-atelier-600" />
              <span>Leave Client Review</span>
            </button>
          </div>

          {designer.reviews && designer.reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {designer.reviews.map((rev) => (
                <div key={rev.id} className="p-6 rounded-2xl bg-[#FBF9F5] border border-atelier-200 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-4 h-4 ${
                              s <= rev.rating ? 'fill-amber-400 text-amber-500' : 'text-atelier-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[11px] text-charcoal-400">
                        {new Date(rev.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}
                      </span>
                    </div>

                    <h4 className="font-serif text-base font-bold text-charcoal-900 mb-1.5">
                      "{rev.reviewTitle}"
                    </h4>
                    <p className="text-xs text-charcoal-600 leading-relaxed mb-4">
                      {rev.comment}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-atelier-200/80 flex items-center justify-between text-xs">
                    <span className="font-semibold text-charcoal-900">{rev.client?.name || 'Verified Client'}</span>
                    <span className="text-[10px] text-atelier-700 bg-atelier-100 px-2 py-0.5 rounded">
                      {rev.projectCategory || 'Commissioned Project'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-charcoal-500">
              No public reviews submitted yet. Be the first client to review this studio!
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <InquiryModal
        designer={designer}
        isOpen={inquiryModalOpen}
        onClose={() => setInquiryModalOpen(false)}
        onSuccess={() => {}}
      />

      <ReviewModal
        designer={designer}
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        onSuccess={() => fetchDesigner()}
      />

      <ProjectLightboxModal
        project={activeLightboxProject}
        isOpen={!!activeLightboxProject}
        onClose={() => setActiveLightboxProject(null)}
      />
    </div>
  );
}
