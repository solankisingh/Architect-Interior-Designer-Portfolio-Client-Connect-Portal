import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  Building
} from 'lucide-react';

export default function DesignerDashboard() {
  const { user, refreshUser } = useAuth();

  const [activeTab, setActiveTab] = useState('portfolio'); // 'portfolio', 'inquiries', 'profile'
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Project Modal
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [projectFormData, setProjectFormData] = useState({
    title: '',
    category: 'Residential Villa',
    style: 'Contemporary',
    description: '',
    location: '',
    completionYear: new Date().getFullYear().toString(),
    areaSqFt: '3,200 sq.ft',
    budgetRange: '₹75 Lakhs',
    thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    images: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    isFeatured: false
  });
  const [savingProject, setSavingProject] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Profile Form
  const [profileFormData, setProfileFormData] = useState({});
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
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
          budgetTier: fullDesignerRes.data.designer.budgetTier || '₹25L - ₹75L',
          specializations: fullDesignerRes.data.designer.specializations || '',
          designStyles: fullDesignerRes.data.designer.designStyles || '',
          accreditations: fullDesignerRes.data.designer.accreditations || '',
          website: fullDesignerRes.data.designer.website || '',
          phone: fullDesignerRes.data.designer.phone || ''
        });
      }

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
      category: 'Residential Villa',
      style: 'Tropical Modern',
      description: '',
      location: profile?.location || 'Bangalore',
      completionYear: new Date().getFullYear().toString(),
      areaSqFt: '3,500 sq.ft',
      budgetRange: '₹80 Lakhs',
      thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      images: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      isFeatured: false
    });
    setProjectModalOpen(true);
  };

  const handleOpenEditProject = (p) => {
    setEditingProject(p);
    let imagesStr = p.thumbnail;
    try {
      const arr = typeof p.images === 'string' ? JSON.parse(p.images) : p.images;
      if (Array.isArray(arr)) imagesStr = arr.join('\n');
    } catch (e) {
      imagesStr = p.thumbnail;
    }

    setProjectFormData({
      title: p.title,
      category: p.category,
      style: p.style,
      description: p.description,
      location: p.location,
      completionYear: p.completionYear,
      areaSqFt: p.areaSqFt || '',
      budgetRange: p.budgetRange || '',
      thumbnail: p.thumbnail,
      images: imagesStr,
      isFeatured: p.isFeatured || false
    });
    setProjectModalOpen(true);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const fd = new FormData();
      fd.append('image', file);

      const res = await api.post('/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setProjectFormData((prev) => ({
        ...prev,
        thumbnail: res.data.url,
        images: prev.images ? `${res.data.url}\n${prev.images}` : res.data.url
      }));
    } catch (err) {
      alert('Failed to upload image file.');
    } finally {
      setUploadingImage(false);
    }
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
      alert(err.response?.data?.message || 'Failed to save project');
    } finally {
      setSavingProject(false);
    }
  };

  const handleDeleteProject = async (projId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await api.delete(`/projects/${projId}`);
      await fetchDashboardData();
    } catch (err) {
      alert('Failed to delete project.');
    }
  };

  const handleUpdateStatus = async (inqId, newStatus) => {
    try {
      await api.patch(`/inquiries/${inqId}/status`, { status: newStatus });
      await fetchDashboardData();
    } catch (err) {
      console.error(err);
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
      setProfileMessage('Error updating profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-gray-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase font-bold text-amber-700 tracking-wider">
                Architect Studio Workspace
              </span>
              {profile?.isVerified && (
                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-semibold border border-emerald-200">
                  COA Verified
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {profile?.studioName || 'Your Studio'}
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Manage your portfolio drawings, case studies, and client inquiries.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {profile && (
              <Link
                to={`/designers/${profile.id}`}
                target="_blank"
                className="px-3.5 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 text-gray-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Public Profile</span>
              </Link>
            )}
            <button
              onClick={handleOpenAddProject}
              className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Project</span>
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-xs">
            <span className="text-xs font-semibold text-gray-400 uppercase">Portfolios</span>
            <p className="text-2xl font-bold text-gray-900 mt-1">{projects.length}</p>
            <p className="text-[11px] text-gray-500 mt-0.5">Published case studies</p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-xs">
            <span className="text-xs font-semibold text-amber-700 uppercase">Client Inquiries</span>
            <p className="text-2xl font-bold text-gray-900 mt-1">{inquiries.length}</p>
            <p className="text-[11px] text-emerald-600 mt-0.5 font-medium">
              {inquiries.filter((i) => i.status === 'PENDING').length} pending review
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-xs">
            <span className="text-xs font-semibold text-gray-400 uppercase">Average Rating</span>
            <div className="flex items-center gap-1 mt-1">
              <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
              <p className="text-2xl font-bold text-gray-900">{profile?.averageRating || 5.0}</p>
            </div>
            <p className="text-[11px] text-gray-500 mt-0.5">{profile?.reviewCount || 0} client reviews</p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-xs">
            <span className="text-xs font-semibold text-gray-400 uppercase">Experience</span>
            <p className="text-2xl font-bold text-gray-900 mt-1">{profile?.experienceYears || 5} Years</p>
            <p className="text-[11px] text-gray-500 mt-0.5">{profile?.budgetTier}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6 space-x-6 text-xs sm:text-sm font-semibold">
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`pb-2.5 border-b-2 transition-colors ${
              activeTab === 'portfolio'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            Portfolio Projects ({projects.length})
          </button>
          <button
            onClick={() => setActiveTab('inquiries')}
            className={`pb-2.5 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'inquiries'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <span>Client Inquiries</span>
            {inquiries.filter((i) => i.status === 'PENDING').length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-600 text-white text-[10px]">
                {inquiries.filter((i) => i.status === 'PENDING').length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-2.5 border-b-2 transition-colors ${
              activeTab === 'profile'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            Studio Details & Accreditations
          </button>
        </div>

        {/* TAB 1: PORTFOLIO */}
        {activeTab === 'portfolio' && (
          <div>
            {projects.length === 0 ? (
              <div className="py-12 text-center bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-sm font-bold text-gray-800 mb-1">No Projects in Portfolio</h3>
                <p className="text-xs text-gray-500 mb-4">
                  Add photos of your completed projects to show prospective clients.
                </p>
                <button
                  onClick={handleOpenAddProject}
                  className="px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold"
                >
                  Upload First Project
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="h-44 bg-gray-100 relative overflow-hidden">
                        <img
                          src={proj.thumbnail}
                          alt={proj.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-white/90 text-[10px] font-semibold text-gray-800">
                          {proj.style}
                        </div>
                      </div>

                      <div className="p-4">
                        <div className="text-[10px] font-bold text-amber-700 uppercase">
                          {proj.category} • {proj.completionYear}
                        </div>
                        <h3 className="text-base font-bold text-gray-900 mt-0.5 mb-1">
                          {proj.title}
                        </h3>
                        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                          {proj.description}
                        </p>
                        <div className="mt-3 pt-2 border-t border-gray-100 flex justify-between text-[11px] text-gray-500">
                          <span>{proj.location}</span>
                          <span className="font-semibold text-gray-700">{proj.areaSqFt}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between gap-2">
                      <button
                        onClick={() => handleOpenEditProject(proj)}
                        className="flex-1 py-1.5 px-3 rounded-lg bg-white border border-gray-300 hover:bg-gray-100 text-xs font-semibold text-gray-700 flex items-center justify-center gap-1 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteProject(proj.id)}
                        className="py-1.5 px-3 rounded-lg bg-white border border-red-200 hover:bg-red-50 text-xs font-semibold text-red-600 flex items-center justify-center gap-1 transition-colors"
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

        {/* TAB 2: INQUIRIES */}
        {activeTab === 'inquiries' && (
          <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6 shadow-xs">
            <h2 className="text-lg font-bold text-gray-900 mb-1">
              Client Commission Inquiries
            </h2>
            <p className="text-xs text-gray-500 mb-6">
              Review project specifications, update scope status, and communicate directly with clients.
            </p>

            {inquiries.length === 0 ? (
              <div className="py-12 text-center text-xs text-gray-500">
                No inquiries received yet.
              </div>
            ) : (
              <div className="space-y-3.5">
                {inquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className="p-4 rounded-lg border border-gray-200 bg-gray-50/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <StatusBadge status={inq.status} />
                        <span className="text-[11px] text-gray-500 font-medium">
                          Client: <strong className="text-gray-900">{inq.client?.name}</strong> ({inq.client?.email})
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-gray-900">
                        {inq.projectTitle}
                      </h3>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
                        <span>Category: {inq.projectCategory}</span>
                        <span>•</span>
                        <span>Budget: <strong className="text-gray-900">{inq.budgetRange}</strong></span>
                        <span>•</span>
                        <span>Timeline: {inq.targetTimeline}</span>
                        <span>•</span>
                        <span>Site: {inq.location}</span>
                      </div>

                      <p className="text-xs text-gray-700 bg-white p-2.5 rounded border border-gray-200 mt-2">
                        {inq.scopeDescription}
                      </p>
                    </div>

                    <div className="flex sm:flex-col items-stretch gap-2 shrink-0 w-full md:w-auto">
                      <Link
                        to={`/inquiries/${inq.id}`}
                        className="py-2 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors text-center"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Reply to Client</span>
                      </Link>

                      <select
                        value={inq.status}
                        onChange={(e) => handleUpdateStatus(inq.id, e.target.value)}
                        className="py-1.5 px-2.5 rounded-lg border border-gray-300 text-xs font-semibold text-gray-800 bg-white cursor-pointer"
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

        {/* TAB 3: PROFILE SETTINGS */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs max-w-3xl">
            <h2 className="text-lg font-bold text-gray-900 mb-1">
              Studio Information & Accreditations
            </h2>
            <p className="text-xs text-gray-500 mb-5">
              Update your firm's description, base location, and Council of Architecture (COA) registration.
            </p>

            {profileMessage && (
              <div className="mb-4 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>{profileMessage}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Studio Practice Name *</label>
                  <input
                    type="text"
                    value={profileFormData.studioName || ''}
                    onChange={(e) => setProfileFormData({ ...profileFormData, studioName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs sm:text-sm focus:border-slate-900 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Tagline</label>
                  <input
                    type="text"
                    value={profileFormData.tagline || ''}
                    onChange={(e) => setProfileFormData({ ...profileFormData, tagline: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs sm:text-sm focus:border-slate-900 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">About the Practice & Philosophy *</label>
                <textarea
                  rows="3"
                  value={profileFormData.bio || ''}
                  onChange={(e) => setProfileFormData({ ...profileFormData, bio: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs sm:text-sm focus:border-slate-900 outline-none resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">City / Location *</label>
                  <input
                    type="text"
                    value={profileFormData.location || ''}
                    onChange={(e) => setProfileFormData({ ...profileFormData, location: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs focus:border-slate-900 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Experience (Years)</label>
                  <input
                    type="number"
                    value={profileFormData.experienceYears || ''}
                    onChange={(e) => setProfileFormData({ ...profileFormData, experienceYears: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs focus:border-slate-900 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Budget Tier</label>
                  <input
                    type="text"
                    value={profileFormData.budgetTier || '₹25L - ₹75L'}
                    onChange={(e) => setProfileFormData({ ...profileFormData, budgetTier: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs focus:border-slate-900 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Accreditations / COA Registration Number</label>
                <input
                  type="text"
                  value={profileFormData.accreditations || ''}
                  onChange={(e) => setProfileFormData({ ...profileFormData, accreditations: e.target.value })}
                  placeholder="e.g. Council of Architecture (CA/2012/55320), IIID Life Member"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs focus:border-slate-900 outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-6 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  {savingProfile ? 'Saving...' : 'Save Profile Changes'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* PROJECT ADD / EDIT MODAL */}
      {projectModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-white rounded-xl max-w-xl w-full p-6 shadow-xl border border-gray-200 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setProjectModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1 rounded-md"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-gray-900 mb-1">
              {editingProject ? 'Edit Project' : 'Add New Portfolio Project'}
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Upload photos and project drawings to showcase to prospective clients.
            </p>

            <form onSubmit={handleSaveProject} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Project Title *</label>
                <input
                  type="text"
                  value={projectFormData.title}
                  onChange={(e) => setProjectFormData({ ...projectFormData, title: e.target.value })}
                  placeholder="e.g. 4BHK Courtyard Residence at Whitefield"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs sm:text-sm focus:border-slate-900 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={projectFormData.category}
                    onChange={(e) => setProjectFormData({ ...projectFormData, category: e.target.value })}
                    className="w-full px-2.5 py-2 rounded-lg border border-gray-300 text-xs focus:border-slate-900 outline-none bg-white"
                  >
                    <option value="Residential Villa">Residential Villa</option>
                    <option value="Apartment Interior">Apartment Interior</option>
                    <option value="Commercial Office">Commercial Office</option>
                    <option value="Holiday Home">Holiday Home</option>
                    <option value="Bungalow Construction">Bungalow Construction</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Design Style</label>
                  <select
                    value={projectFormData.style}
                    onChange={(e) => setProjectFormData({ ...projectFormData, style: e.target.value })}
                    className="w-full px-2.5 py-2 rounded-lg border border-gray-300 text-xs focus:border-slate-900 outline-none bg-white"
                  >
                    <option value="Tropical Modern">Tropical Modern</option>
                    <option value="Modern Minimalist">Modern Minimalist</option>
                    <option value="Contemporary">Contemporary</option>
                    <option value="Traditional Indian">Traditional Indian</option>
                    <option value="Industrial">Industrial</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Description & Materiality *</label>
                <textarea
                  rows="3"
                  value={projectFormData.description}
                  onChange={(e) => setProjectFormData({ ...projectFormData, description: e.target.value })}
                  placeholder="Detail the floor plan organization, daylighting, materials used (Kota stone, Teak wood, Exposed brickwork)..."
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs sm:text-sm focus:border-slate-900 outline-none resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">City / Site</label>
                  <input
                    type="text"
                    value={projectFormData.location}
                    onChange={(e) => setProjectFormData({ ...projectFormData, location: e.target.value })}
                    placeholder="e.g. Bangalore"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Year</label>
                  <input
                    type="text"
                    value={projectFormData.completionYear}
                    onChange={(e) => setProjectFormData({ ...projectFormData, completionYear: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Built-up Area</label>
                  <input
                    type="text"
                    value={projectFormData.areaSqFt}
                    onChange={(e) => setProjectFormData({ ...projectFormData, areaSqFt: e.target.value })}
                    placeholder="e.g. 3,500 sq.ft"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 text-xs"
                  />
                </div>
              </div>

              {/* Image Upload or URL */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Cover Photo URL *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={projectFormData.thumbnail}
                    onChange={(e) => setProjectFormData({ ...projectFormData, thumbnail: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 px-3 py-1.5 rounded-lg border border-gray-300 text-xs"
                    required
                  />
                  <label className="px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 text-xs font-medium text-gray-700 cursor-pointer flex items-center gap-1 shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingImage ? 'Uploading...' : 'Upload'}</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Gallery Images (One URL per line)
                </label>
                <textarea
                  rows="2"
                  value={projectFormData.images}
                  onChange={(e) => setProjectFormData({ ...projectFormData, images: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-mono text-[11px] resize-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setProjectModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-gray-600 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingProject}
                  className="px-5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold uppercase tracking-wider transition-colors"
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
