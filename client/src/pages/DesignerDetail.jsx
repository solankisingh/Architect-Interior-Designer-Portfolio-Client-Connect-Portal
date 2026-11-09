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
  Maximize2,
  MessageSquare,
  ArrowLeft
} from 'lucide-react';

export default function DesignerDetail() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();

  const [designer, setDesigner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [activeLightboxProject, setActiveLightboxProject] = useState(null);
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
      <div className="min-h-screen py-16 text-center text-xs text-gray-500">
        Loading studio portfolio...
      </div>
    );
  }

  if (error || !designer) {
    return (
      <div className="min-h-screen py-16 text-center max-w-md mx-auto px-4">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Profile Not Found</h2>
        <p className="text-xs text-gray-500 mb-4">{error || 'This profile does not exist.'}</p>
        <Link
          to="/designers"
          className="px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Directory</span>
        </Link>
      </div>
    );
  }

  const filteredProjects = selectedCategory === 'All'
    ? (designer.projects || [])
    : (designer.projects || []).filter((p) => p.category.toLowerCase().includes(selectedCategory.toLowerCase()));

  const categories = ['All', ...new Set((designer.projects || []).map((p) => p.category))];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Cover Image */}
      <div className="relative h-64 sm:h-80 w-full bg-slate-900 overflow-hidden">
        <img
          src={designer.coverImageUrl}
          alt={designer.studioName}
          className="w-full h-full object-cover opacity-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent" />
        <div className="absolute top-4 left-4 sm:left-8">
          <Link
            to="/designers"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-black/60 hover:bg-black/80 text-white text-xs backdrop-blur-xs transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Studios</span>
          </Link>
        </div>
      </div>

      {/* Main Studio Profile Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 sm:-mt-20 relative z-10">
        <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-6 sm:p-8 mb-8">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start gap-5">
              <img
                src={designer.avatarUrl}
                alt={designer.studioName}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover border-4 border-white shadow-sm bg-white shrink-0"
              />

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-gray-100 text-gray-800 text-[11px] font-semibold">
                    {designer.budgetTier}
                  </span>
                  {designer.isVerified && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[11px] font-semibold border border-emerald-200">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      COA Registered
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {designer.studioName}
                </h1>
                {designer.tagline && (
                  <p className="text-xs text-gray-600 italic">
                    "{designer.tagline}"
                  </p>
                )}

                <p className="text-xs text-gray-500 flex flex-wrap items-center gap-3 pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    {designer.location}
                  </span>
                  <span>•</span>
                  <span>Principal: {designer.user?.name}</span>
                  <span>•</span>
                  <span>{designer.experienceYears} Years Practice</span>
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="w-full lg:w-auto flex flex-col sm:flex-row lg:flex-col items-stretch lg:items-end gap-3 shrink-0">
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 text-left lg:text-right">
                <div className="flex items-center gap-1 text-sm font-bold text-gray-900 lg:justify-end">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                  <span>{designer.averageRating} / 5.0</span>
                </div>
                <p className="text-[11px] text-gray-500">Based on {designer.reviews?.length || 0} client reviews</p>
              </div>

              <button
                onClick={() => setInquiryModalOpen(true)}
                className="px-6 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Project Inquiry</span>
              </button>
            </div>
          </div>

          {/* Accreditation details */}
          {designer.accreditations && (
            <div className="mt-6 pt-4 border-t border-gray-100 flex flex-wrap items-center gap-2 text-xs text-gray-700">
              <Award className="w-4 h-4 text-slate-700 shrink-0" />
              <span className="font-semibold text-gray-900">Statutory Accreditation:</span>
              <span className="px-2 py-0.5 rounded bg-gray-100 font-medium text-gray-800">
                {designer.accreditations}
              </span>
            </div>
          )}

          {/* Bio */}
          <div className="mt-5 pt-4 border-t border-gray-100">
            <h3 className="text-xs uppercase font-semibold text-gray-400 tracking-wider mb-1.5">
              About the Firm
            </h3>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed max-w-4xl">
              {designer.bio}
            </p>
          </div>
        </div>

        {/* Portfolio Section */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Completed Projects ({designer.projects?.length || 0})
              </h2>
              <p className="text-xs text-gray-500">Click on any project to inspect photo gallery and design specifications.</p>
            </div>

            {categories.length > 1 && (
              <div className="flex flex-wrap gap-1.5">
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedCategory(c)}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                      selectedCategory === c
                        ? 'bg-slate-900 text-white'
                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((p) => (
              <div
                key={p.id}
                onClick={() => setActiveLightboxProject(p)}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs hover:border-gray-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="h-52 bg-gray-100 relative overflow-hidden">
                    <img
                      src={p.thumbnail}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 right-2.5 bg-white/95 px-2 py-0.5 rounded text-[10px] font-semibold text-gray-800">
                      {p.style}
                    </div>
                  </div>

                  <div className="p-4 sm:p-5">
                    <div className="text-[10px] uppercase font-semibold text-amber-700 mb-1">
                      {p.category} • {p.completionYear}
                    </div>
                    <h3 className="text-base font-bold text-gray-900 group-hover:text-amber-700 transition-colors mb-1.5">
                      {p.title}
                    </h3>
                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-3">
                      {p.description}
                    </p>
                  </div>
                </div>

                <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between text-xs text-gray-500">
                  <span>{p.location}</span>
                  <div className="flex items-center gap-2">
                    {p.areaSqFt && <span className="font-semibold text-gray-700">{p.areaSqFt}</span>}
                    {p.budgetRange && <span className="text-amber-700 font-semibold">{p.budgetRange}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Client Reviews */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-gray-100">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Client Reviews ({designer.reviews?.length || 0})
              </h2>
              <p className="text-xs text-gray-500">Verified feedback from completed architectural and interior contracts.</p>
            </div>

            <button
              onClick={() => setReviewModalOpen(true)}
              className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-xs font-semibold text-gray-800 transition-colors self-start sm:self-auto"
            >
              Write a Client Review
            </button>
          </div>

          {designer.reviews && designer.reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {designer.reviews.map((r) => (
                <div key={r.id} className="p-4 rounded-lg bg-gray-50 border border-gray-200 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3.5 h-3.5 ${
                              s <= r.rating ? 'fill-amber-400 text-amber-500' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] text-gray-400">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-gray-900 mb-1">
                      "{r.reviewTitle}"
                    </h4>
                    <p className="text-xs text-gray-600 leading-relaxed mb-3">
                      {r.comment}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-gray-200 text-xs flex items-center justify-between">
                    <span className="font-semibold text-gray-800">{r.client?.name || 'Verified Client'}</span>
                    <span className="text-[10px] text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-200">
                      {r.projectCategory || 'Commissioned Scope'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-500 py-6 text-center">No client reviews submitted yet.</p>
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
