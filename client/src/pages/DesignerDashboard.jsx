import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import StatusBadge from '../components/StatusBadge';
import {
  Layers,
  Plus,
  Edit3,
  Trash2,
  MessageSquare,
  Star,
  Eye,
  CheckCircle,
  X,
  AlertCircle,
  Upload,
  ExternalLink,
  ShieldCheck,
  Building,
  DollarSign,
  MapPin,
  Calendar
} from 'lucide-react';

export default function DesignerDashboard() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('portfolio'); // 'portfolio', 'inquiries', 'profile'
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Project Modal state (Add / Edit)
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [projectFormData, setProjectFormData] = useState({
    title: '',
    category: 'Residential',
    style: 'Modern Minimalist',
    description: '',
    location: '',
    completionYear: new Date().getFullYear().toString(),
    areaSqFt: '',
    budgetRange: '',
    thumbnail: '',
    images: '',
    isFeatured: false
  });
  const [savingProject, setSavingProject] = useState(false);

  // Profile Form state
  const [profileFormData, setProfileFormData] = useState({});
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch user profile and their projects
      const meRes = await api.get('/auth/me');
      const designerProfile = meRes.data.user.designerProfile;

      if (designerProfile) {
        const fullDesignerRes = await api.get(`/designers/${designerProfile.id}`);
        setProfile(fullDesignerRes.data.designer);
        setProjects(fullDesignerRes.data.designer.projects || []);
        setProfileFormData({
          studioName: fullDesignerRes.data.designer.studioName || '',
          tagline: fullDesignerRes.data.designer.tagline || '',
          bio: fullDesignerRes.data.designer.bio || '',
          location: fullDesignerRes.data.designer.location || '',
          experienceYears: fullDesignerRes.data.designer.experienceYears || 5,
          budgetTier: fullDesignerRes.data.designer.budgetTier || '$$',
          specializations: fullDesignerRes.data.designer.specializations || '',
          designStyles: fullDesignerRes.data.designer.designStyles || '',
          accreditations: fullDesignerRes.data.designer.accreditations || '',
          website: fullDesignerRes.data.designer.website || '',
          phone: fullDesignerRes.data.designer.phone || ''
        });
      }

      // Fetch received inquiries
      const inqRes = await api.get('/inquiries/my');
      setInquiries(inqRes.data.inquiries || []);
    } catch (err) {
      console.error('Failed to load designer dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleOpenAddProject = () => {
    setEditingProject(null);
    setProjectFormData({
      title: '',
      category: 'Residential',
      style: 'Modern Minimalist',
      description: '',
      location: profile?.location || '',
      completionYear: new Date().getFullYear().toString(),
      areaSqFt: '3,500 sq ft',
      budgetRange: '$150,000 - $250,000',
      thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      images: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      isFeatured: false
    });
    setProjectModalOpen(true);
  };

  const handleOpenEditProject = (proj) => {
    setEditingProject(proj);
    let imagesStr = proj.thumbnail;
    try {
      const arr = typeof proj.images === 'string' ? JSON.parse(proj.images) : proj.images;
      if (Array.isArray(arr)) imagesStr = arr.join('\n');
    } catch (e) {
      imagesStr = proj.thumbnail;
    }

    setProjectFormData({
      title: proj.title,
      category: proj.category,
      style: proj.style,
      description: proj.description,
      location: proj.location,
      completionYear: proj.completionYear,
      areaSqFt: proj.areaSqFt || '',
      budgetRange: proj.budgetRange || '',
      thumbnail: proj.thumbnail,
      images: imagesStr,
      isFeatured: proj.isFeatured || false
    });
    setProjectModalOpen(true);
  };

  const handleSaveProject = async (e) => {
    e.preventDefault();
    try {
      setSavingProject(true);
      const imagesArr = projectFormData.images
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        ...projectFormData,
        images: imagesArr.length > 0 ? imagesArr : [projectFormData.thumbnail]
      };

      if (editingProject) {
        await api.put(`/projects/${editingProject.id}`, payload);
      } else {
        await api.post('/projects', payload);
      }

      setProjectModalOpen(false);
      await fetchDashboardData();
    } catch (err) {
      console.error('Failed to save project:', err);
      alert(err.response?.data?.message || 'Failed to save project');
    } finally {
      setSavingProject(false);
    }
  };

  const handleDeleteProject = async (projId) => {
    if (!window.confirm('Are you sure you want to remove this project from your portfolio?')) return;
    try {
      await api.delete(`/projects/${projId}`);
      await fetchDashboardData();
    } catch (err) {
      console.error('Failed to delete project:', err);
      alert('Failed to delete project.');
    }
  };

  const handleUpdateStatus = async (inqId, newStatus) => {
    try {
      await api.patch(`/inquiries/${inqId}/status`, { status: newStatus });
      await fetchDashboardData();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setSavingProfile(true);
      setProfileMessage('');
      await api.put('/designers/profile', profileFormData);
      setProfileMessage('Studio profile updated successfully!');
      await refreshUser();
      await fetchDashboardData();
    } catch (err) {
      console.error('Failed to update profile:', err);
      setProfileMessage('Error updating profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Studio Top Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-atelier-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase tracking-widest text-atelier-700 font-semibold">
                Architectural Studio Workspace
              </span>
              {profile?.isVerified && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-semibold border border-emerald-200">
                  COA / IIID Verified
                </span>
              )}
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-950">
              {profile?.studioName || 'Your Studio'}
            </h1>
            <p className="text-xs text-charcoal-500 mt-1">
              Curate portfolio case studies, review incoming client commissions, and adjust studio credentials.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {profile && (
              <Link
                to={`/designers/${profile.id}`}
                target="_blank"
                className="px-4 py-2.5 rounded-xl border border-atelier-300 hover:bg-atelier-100 text-charcoal-800 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Public Profile</span>
              </Link>
            )}
            <button
              onClick={handleOpenAddProject}
              className="px-5 py-2.5 rounded-xl bg-charcoal-900 hover:bg-charcoal-800 text-atelier-100 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 shadow-md transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Project</span>
            </button>
          </div>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div className="p-5 rounded-3xl bg-white border border-atelier-200 shadow-sm">
            <span className="text-xs uppercase tracking-wider text-charcoal-400 font-semibold">Portfolios</span>
            <p className="font-serif text-3xl font-bold text-charcoal-950 mt-1">{projects.length}</p>
            <p className="text-[11px] text-charcoal-500 mt-1">Published case studies</p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-atelier-200 shadow-sm">
            <span className="text-xs uppercase tracking-wider text-atelier-700 font-semibold">Client Inquiries</span>
            <p className="font-serif text-3xl font-bold text-charcoal-950 mt-1">{inquiries.length}</p>
            <p className="text-[11px] text-emerald-600 mt-1 font-medium">
              {inquiries.filter((i) => i.status === 'PENDING').length} pending review
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-atelier-200 shadow-sm">
            <span className="text-xs uppercase tracking-wider text-charcoal-400 font-semibold">Average Rating</span>
            <div className="flex items-center gap-1.5 mt-1">
              <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
              <p className="font-serif text-3xl font-bold text-charcoal-950">{profile?.averageRating || 5.0}</p>
            </div>
            <p className="text-[11px] text-charcoal-500 mt-1">{profile?.reviewCount || 0} client reviews</p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-atelier-200 shadow-sm">
            <span className="text-xs uppercase tracking-wider text-charcoal-400 font-semibold">Experience</span>
            <p className="font-serif text-3xl font-bold text-charcoal-950 mt-1">{profile?.experienceYears || 5}y</p>
            <p className="text-[11px] text-charcoal-500 mt-1">{profile?.budgetTier} tier pricing</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-atelier-200 mb-8 space-x-8">
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`pb-3 text-xs sm:text-sm font-semibold uppercase tracking-wider border-b-2 transition-all ${
              activeTab === 'portfolio'
                ? 'border-charcoal-950 text-charcoal-950'
                : 'border-transparent text-charcoal-500 hover:text-charcoal-800'
            }`}
          >
            Portfolio Projects ({projects.length})
          </button>
          <button
            onClick={() => setActiveTab('inquiries')}
            className={`pb-3 text-xs sm:text-sm font-semibold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'inquiries'
                ? 'border-charcoal-950 text-charcoal-950'
                : 'border-transparent text-charcoal-500 hover:text-charcoal-800'
            }`}
          >
            <span>Client Leads & Inquiries</span>
            {inquiries.filter((i) => i.status === 'PENDING').length > 0 && (
              <span className="w-5 h-5 rounded-full bg-atelier-600 text-white text-[10px] flex items-center justify-center font-bold">
                {inquiries.filter((i) => i.status === 'PENDING').length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 text-xs sm:text-sm font-semibold uppercase tracking-wider border-b-2 transition-all ${
              activeTab === 'profile'
                ? 'border-charcoal-950 text-charcoal-950'
                : 'border-transparent text-charcoal-500 hover:text-charcoal-800'
            }`}
          >
            Studio Profile & Settings
          </button>
        </div>

        {/* TAB 1: PORTFOLIO MANAGEMENT */}
        {activeTab === 'portfolio' && (
          <div>
            {projects.length === 0 ? (
              <div className="py-20 text-center bg-white rounded-3xl border border-atelier-200 p-8">
                <p className="font-serif text-xl font-bold text-charcoal-900 mb-2">No Projects Uploaded Yet</p>
                <p className="text-xs text-charcoal-500 max-w-md mx-auto mb-6">
                  Showcase your completed residential villas, commercial hubs, or interior renovations with rich photography.
                </p>
                <button
                  onClick={handleOpenAddProject}
                  className="px-6 py-2.5 rounded-full bg-charcoal-900 text-white text-xs font-semibold uppercase tracking-wider"
                >
                  Upload First Project
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="bg-white rounded-3xl overflow-hidden border border-atelier-200 shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-48 bg-charcoal-900 overflow-hidden">
                        <img
                          src={proj.thumbnail}
                          alt={proj.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 text-charcoal-900 text-[10px] font-semibold">
                          {proj.style}
                        </div>
                        {proj.isFeatured && (
                          <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-atelier-600 text-white text-[9px] font-bold uppercase tracking-wider">
                            Featured
                          </div>
                        )}
                      </div>

                      <div className="p-5">
                        <span className="text-[10px] uppercase font-bold text-atelier-700 tracking-wider">
                          {proj.category} • {proj.completionYear}
                        </span>
                        <h3 className="font-serif text-lg font-bold text-charcoal-950 mt-1 mb-2">
                          {proj.title}
                        </h3>
                        <p className="text-xs text-charcoal-600 line-clamp-2 leading-relaxed">
                          {proj.description}
                        </p>
                        <div className="mt-3 pt-3 border-t border-atelier-100 flex items-center justify-between text-[11px] text-charcoal-500">
                          <span>{proj.location}</span>
                          <span>{proj.areaSqFt}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-atelier-50/60 border-t border-atelier-200 flex items-center justify-between gap-2">
                      <button
                        onClick={() => handleOpenEditProject(proj)}
                        className="flex-1 py-2 px-3 rounded-xl bg-white border border-atelier-300 hover:border-atelier-600 text-xs font-semibold text-charcoal-800 flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteProject(proj.id)}
                        className="py-2 px-3 rounded-xl bg-white border border-rose-200 hover:bg-rose-50 text-xs font-semibold text-rose-600 flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: INQUIRIES & LEADS */}
        {activeTab === 'inquiries' && (
          <div className="bg-white rounded-3xl border border-atelier-200 p-6 sm:p-8 shadow-sm">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-charcoal-950 mb-1">
              Client Commission Inquiries
            </h2>
            <p className="text-xs text-charcoal-500 mb-6">
              Review project specifications, accept or decline scopes, and message clients directly.
            </p>

            {inquiries.length === 0 ? (
              <div className="py-16 text-center text-xs text-charcoal-500">
                No inquiries received yet. Ensure your portfolio is complete to attract prospective clients!
              </div>
            ) : (
              <div className="space-y-4">
                {inquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className="p-5 rounded-2xl bg-[#FBF9F5] border border-atelier-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <StatusBadge status={inq.status} />
                        <span className="text-[11px] text-charcoal-500 font-medium">
                          From: <strong className="text-charcoal-900">{inq.client?.name}</strong> ({inq.client?.email})
                        </span>
                      </div>

                      <h4 className="font-serif text-lg font-bold text-charcoal-950">
                        {inq.projectTitle}
                      </h4>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-charcoal-600">
                        <span>Category: {inq.projectCategory}</span>
                        <span>•</span>
                        <span>Budget: <strong className="text-charcoal-900">{inq.budgetRange}</strong></span>
                        <span>•</span>
                        <span>Timeline: {inq.targetTimeline}</span>
                        <span>•</span>
                        <span>Location: {inq.location}</span>
                      </div>

                      <p className="text-xs text-charcoal-600 line-clamp-2 bg-white/60 p-2 rounded-lg border border-atelier-100 mt-2">
                        {inq.scopeDescription}
                      </p>
                    </div>

                    <div className="flex flex-wrap sm:flex-col items-stretch gap-2 shrink-0 w-full md:w-auto">
                      <Link
                        to={`/inquiries/${inq.id}`}
                        className="py-2 px-4 rounded-xl bg-charcoal-900 hover:bg-charcoal-800 text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm text-center"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Reply / Thread</span>
                      </Link>

                      {/* Quick Status Select */}
                      <select
                        value={inq.status}
                        onChange={(e) => handleUpdateStatus(inq.id, e.target.value)}
                        className="py-1.5 px-3 rounded-xl border border-atelier-300 text-xs font-semibold text-charcoal-900 bg-white outline-none cursor-pointer"
                      >
                        <option value="PENDING">Pending</option>
                        <option value="UNDER_REVIEW">Under Review</option>
                        <option value="ACCEPTED">Accept Scope</option>
                        <option value="DECLINED">Decline</option>
                        <option value="COMPLETED">Mark Completed</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: STUDIO PROFILE & SETTINGS */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-3xl border border-atelier-200 p-6 sm:p-10 shadow-sm max-w-4xl">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-charcoal-950 mb-1">
              Studio Practice & Accreditations
            </h2>
            <p className="text-xs text-charcoal-500 mb-6">
              Update your public studio branding, design philosophy, and Council of Architecture details.
            </p>

            {profileMessage && (
              <div className="mb-6 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>{profileMessage}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 mb-1">Studio Practice Name *</label>
                  <input
                    type="text"
                    value={profileFormData.studioName || ''}
                    onChange={(e) => setProfileFormData({ ...profileFormData, studioName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-atelier-300 text-xs sm:text-sm bg-[#FBF9F5]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 mb-1">Tagline / Motto</label>
                  <input
                    type="text"
                    value={profileFormData.tagline || ''}
                    onChange={(e) => setProfileFormData({ ...profileFormData, tagline: e.target.value })}
                    placeholder="e.g. Sculptural Modernism & Harmonious Living"
                    className="w-full px-4 py-2.5 rounded-xl border border-atelier-300 text-xs sm:text-sm bg-[#FBF9F5]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal-700 mb-1">Studio Philosophy & Biography *</label>
                <textarea
                  rows="4"
                  value={profileFormData.bio || ''}
                  onChange={(e) => setProfileFormData({ ...profileFormData, bio: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-atelier-300 text-xs sm:text-sm bg-[#FBF9F5] resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 mb-1">Operating Location *</label>
                  <input
                    type="text"
                    value={profileFormData.location || ''}
                    onChange={(e) => setProfileFormData({ ...profileFormData, location: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-atelier-300 text-xs sm:text-sm bg-[#FBF9F5]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 mb-1">Years of Experience</label>
                  <input
                    type="number"
                    value={profileFormData.experienceYears || ''}
                    onChange={(e) => setProfileFormData({ ...profileFormData, experienceYears: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-atelier-300 text-xs sm:text-sm bg-[#FBF9F5]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 mb-1">Budget Tier</label>
                  <select
                    value={profileFormData.budgetTier || '$$'}
                    onChange={(e) => setProfileFormData({ ...profileFormData, budgetTier: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-atelier-300 text-xs sm:text-sm bg-[#FBF9F5]"
                  >
                    <option value="$">$ (Economy / Modular)</option>
                    <option value="$$">$$ (Standard / Residential)</option>
                    <option value="$$$">$$$ (Premium / Bespoke)</option>
                    <option value="$$$$">$$$$ (Ultra-Luxury / Landmark)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 mb-1">Specializations</label>
                  <input
                    type="text"
                    value={profileFormData.specializations || ''}
                    onChange={(e) => setProfileFormData({ ...profileFormData, specializations: e.target.value })}
                    placeholder="e.g. Residential, Penthouse Interiors, Landscape"
                    className="w-full px-4 py-2.5 rounded-xl border border-atelier-300 text-xs sm:text-sm bg-[#FBF9F5]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 mb-1">Design Styles</label>
                  <input
                    type="text"
                    value={profileFormData.designStyles || ''}
                    onChange={(e) => setProfileFormData({ ...profileFormData, designStyles: e.target.value })}
                    placeholder="e.g. Modern Minimalist, Scandinavian, Biophilic"
                    className="w-full px-4 py-2.5 rounded-xl border border-atelier-300 text-xs sm:text-sm bg-[#FBF9F5]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal-700 mb-1">Accreditations & Reg Numbers</label>
                <input
                  type="text"
                  value={profileFormData.accreditations || ''}
                  onChange={(e) => setProfileFormData({ ...profileFormData, accreditations: e.target.value })}
                  placeholder="e.g. Council of Architecture (CA/2012/51930), Fellow IIID"
                  className="w-full px-4 py-2.5 rounded-xl border border-atelier-300 text-xs sm:text-sm bg-[#FBF9F5]"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-8 py-3 rounded-xl bg-charcoal-900 hover:bg-charcoal-800 text-white text-xs font-semibold uppercase tracking-wider shadow-md transition-all"
                >
                  {savingProfile ? 'Saving...' : 'Save Studio Profile'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* PROJECT ADD / EDIT MODAL */}
      {projectModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-charcoal-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-[#FBF9F5] rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-atelier-200 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setProjectModalOpen(false)}
              className="absolute top-5 right-5 text-charcoal-400 hover:text-charcoal-800 p-2 rounded-full hover:bg-atelier-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-2xl font-bold text-charcoal-950 mb-1">
              {editingProject ? 'Edit Portfolio Project' : 'Add New Portfolio Project'}
            </h3>
            <p className="text-xs text-charcoal-500 mb-6">
              Present your architectural concept, materials, and high-resolution imagery.
            </p>

            <form onSubmit={handleSaveProject} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-charcoal-700 mb-1">Project Title *</label>
                <input
                  type="text"
                  value={projectFormData.title}
                  onChange={(e) => setProjectFormData({ ...projectFormData, title: e.target.value })}
                  placeholder="e.g. The Solarium Cliff Villa"
                  className="w-full px-4 py-2.5 rounded-xl border border-atelier-300 text-xs sm:text-sm bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 mb-1">Category</label>
                  <select
                    value={projectFormData.category}
                    onChange={(e) => setProjectFormData({ ...projectFormData, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-atelier-300 text-xs sm:text-sm bg-white"
                  >
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Hospitality">Hospitality</option>
                    <option value="Penthouse">Penthouse</option>
                    <option value="Landscape">Landscape</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 mb-1">Design Style</label>
                  <select
                    value={projectFormData.style}
                    onChange={(e) => setProjectFormData({ ...projectFormData, style: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-atelier-300 text-xs sm:text-sm bg-white"
                  >
                    <option value="Modern Minimalist">Modern Minimalist</option>
                    <option value="Biophilic Contemporary">Biophilic Contemporary</option>
                    <option value="Scandinavian">Scandinavian</option>
                    <option value="Industrial Loft">Industrial Loft</option>
                    <option value="Neo-Classical">Neo-Classical</option>
                    <option value="Mediterranean Warmth">Mediterranean Warmth</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal-700 mb-1">Project Description & Concept *</label>
                <textarea
                  rows="3"
                  value={projectFormData.description}
                  onChange={(e) => setProjectFormData({ ...projectFormData, description: e.target.value })}
                  placeholder="Detail the spatial organization, daylight studies, materiality (travertine, cedar, concrete)..."
                  className="w-full px-4 py-2.5 rounded-xl border border-atelier-300 text-xs sm:text-sm bg-white resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={projectFormData.location}
                    onChange={(e) => setProjectFormData({ ...projectFormData, location: e.target.value })}
                    placeholder="e.g. North Goa"
                    className="w-full px-3 py-2.5 rounded-xl border border-atelier-300 text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 mb-1">Year</label>
                  <input
                    type="text"
                    value={projectFormData.completionYear}
                    onChange={(e) => setProjectFormData({ ...projectFormData, completionYear: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-atelier-300 text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 mb-1">Area (sq ft)</label>
                  <input
                    type="text"
                    value={projectFormData.areaSqFt}
                    onChange={(e) => setProjectFormData({ ...projectFormData, areaSqFt: e.target.value })}
                    placeholder="e.g. 5,200 sq ft"
                    className="w-full px-3 py-2.5 rounded-xl border border-atelier-300 text-xs bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal-700 mb-1">Cover Thumbnail Image URL *</label>
                <input
                  type="text"
                  value={projectFormData.thumbnail}
                  onChange={(e) => setProjectFormData({ ...projectFormData, thumbnail: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2.5 rounded-xl border border-atelier-300 text-xs sm:text-sm bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                  Gallery Images (One URL per line for Lightbox showcase)
                </label>
                <textarea
                  rows="3"
                  value={projectFormData.images}
                  onChange={(e) => setProjectFormData({ ...projectFormData, images: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-1...&#10;https://images.unsplash.com/photo-2..."
                  className="w-full px-4 py-2.5 rounded-xl border border-atelier-300 text-xs bg-white resize-none font-mono text-[11px]"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={projectFormData.isFeatured}
                  onChange={(e) => setProjectFormData({ ...projectFormData, isFeatured: e.target.checked })}
                  className="rounded border-atelier-300 text-atelier-600 focus:ring-atelier-500"
                />
                <label htmlFor="isFeatured" className="text-xs text-charcoal-700 font-medium">
                  Feature this project on studio highlight carousel
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-atelier-100">
                <button
                  type="button"
                  onClick={() => setProjectModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-charcoal-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingProject}
                  className="px-6 py-2.5 rounded-xl bg-charcoal-900 hover:bg-charcoal-800 text-white text-xs font-semibold uppercase tracking-wider shadow-md transition-all"
                >
                  {savingProject ? 'Saving...' : (editingProject ? 'Update Project' : 'Publish Project')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
