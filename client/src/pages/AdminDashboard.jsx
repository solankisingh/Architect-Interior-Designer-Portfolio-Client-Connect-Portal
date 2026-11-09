import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  ShieldAlert,
  Users,
  Layers,
  MessageSquare,
  TrendingUp,
  CheckCircle,
  XCircle,
  Trash2,
  Search,
  ExternalLink,
  Award,
  Sparkles,
  RefreshCw,
  Building
} from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('users'); // 'users', 'projects', 'stats'
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [userRoleFilter, setUserRoleFilter] = useState('All');
  const [userSearch, setUserSearch] = useState('');

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, projectsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/projects')
      ]);

      setStats(statsRes.data.stats);
      setUsers(usersRes.data.users || []);
      setProjects(projectsRes.data.projects || []);
    } catch (err) {
      console.error('Failed to load admin console data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleToggleVerification = async (designerId) => {
    try {
      await api.patch(`/admin/designers/${designerId}/verify`);
      await fetchAdminData();
    } catch (err) {
      alert('Failed to toggle verification status.');
    }
  };

  const handleToggleFeatured = async (designerId) => {
    try {
      await api.patch(`/admin/designers/${designerId}/feature`);
      await fetchAdminData();
    } catch (err) {
      alert('Failed to toggle featured status.');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? All associated profiles and inquiries will be removed.')) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      await fetchAdminData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to moderate and remove this portfolio project?')) return;
    try {
      await api.delete(`/admin/projects/${projectId}`);
      await fetchAdminData();
    } catch (err) {
      alert('Failed to remove project.');
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchRole = userRoleFilter === 'All' || u.role === userRoleFilter;
    const matchSearch = !userSearch || u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase());
    return matchRole && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#FBF9F5] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-atelier-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase tracking-widest text-purple-700 font-semibold flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-purple-600" />
                Administrative Governance Portal
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-950">
              Platform Overview & Control
            </h1>
            <p className="text-xs text-charcoal-500 mt-1">
              Monitor network health, oversee accredited designer certifications, and moderate architectural content.
            </p>
          </div>

          <button
            onClick={fetchAdminData}
            className="px-4 py-2 rounded-xl bg-white border border-atelier-300 hover:bg-atelier-100 text-charcoal-700 text-xs font-semibold flex items-center gap-2 self-start sm:self-auto shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Metrics</span>
          </button>
        </div>

        {/* Executive KPI Cards */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-10">
            <div className="p-5 rounded-3xl bg-white border border-atelier-200 shadow-sm">
              <span className="text-xs uppercase tracking-wider text-charcoal-400 font-semibold">Registered Studios</span>
              <p className="font-serif text-3xl font-bold text-charcoal-950 mt-1">{stats.totalDesigners}</p>
              <p className="text-[11px] text-atelier-700 mt-1">COA / IIID affiliated</p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-atelier-200 shadow-sm">
              <span className="text-xs uppercase tracking-wider text-charcoal-400 font-semibold">Active Clients</span>
              <p className="font-serif text-3xl font-bold text-charcoal-950 mt-1">{stats.totalClients}</p>
              <p className="text-[11px] text-charcoal-500 mt-1">Homeowners & developers</p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-atelier-200 shadow-sm">
              <span className="text-xs uppercase tracking-wider text-charcoal-400 font-semibold">Portfolios</span>
              <p className="font-serif text-3xl font-bold text-charcoal-950 mt-1">{stats.totalProjects}</p>
              <p className="text-[11px] text-charcoal-500 mt-1">Verified case studies</p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-atelier-200 shadow-sm">
              <span className="text-xs uppercase tracking-wider text-charcoal-400 font-semibold">Project Inquiries</span>
              <p className="font-serif text-3xl font-bold text-charcoal-950 mt-1">{stats.totalInquiries}</p>
              <p className="text-[11px] text-emerald-600 mt-1 font-medium">{stats.acceptedInquiries} scopes accepted</p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-atelier-200 shadow-sm col-span-2 lg:col-span-1">
              <span className="text-xs uppercase tracking-wider text-purple-700 font-semibold">Conversion Rate</span>
              <p className="font-serif text-3xl font-bold text-charcoal-950 mt-1">{stats.conversionRate}%</p>
              <p className="text-[11px] text-charcoal-500 mt-1">Inquiry to project hire</p>
            </div>
          </div>
        )}

        {/* Tab Controls */}
        <div className="flex border-b border-atelier-200 mb-8 space-x-8">
          <button
            onClick={() => setActiveTab('users')}
            className={`pb-3 text-xs sm:text-sm font-semibold uppercase tracking-wider border-b-2 transition-all ${
              activeTab === 'users'
                ? 'border-charcoal-950 text-charcoal-950'
                : 'border-transparent text-charcoal-500 hover:text-charcoal-800'
            }`}
          >
            User Directory & Verification ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`pb-3 text-xs sm:text-sm font-semibold uppercase tracking-wider border-b-2 transition-all ${
              activeTab === 'projects'
                ? 'border-charcoal-950 text-charcoal-950'
                : 'border-transparent text-charcoal-500 hover:text-charcoal-800'
            }`}
          >
            Content & Portfolio Moderation ({projects.length})
          </button>
        </div>

        {/* TAB 1: USER MANAGEMENT */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-3xl border border-atelier-200 shadow-sm p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Search user name or email..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-atelier-300 text-xs bg-[#FBF9F5]"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-charcoal-500">Role:</span>
                <select
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-atelier-300 text-xs bg-white"
                >
                  <option value="All">All Roles</option>
                  <option value="DESIGNER">Designers / Architects</option>
                  <option value="CLIENT">Clients</option>
                  <option value="ADMIN">Admins</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-charcoal-700">
                <thead className="bg-[#F5F0E8] text-charcoal-900 uppercase font-semibold text-[10px] tracking-wider border-y border-atelier-200">
                  <tr>
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Studio / Detail</th>
                    <th className="py-3 px-4">Status / Badge</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-atelier-100">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-atelier-50/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-charcoal-950">{u.name}</div>
                        <div className="text-[11px] text-charcoal-500">{u.email}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          u.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                          u.role === 'DESIGNER' ? 'bg-atelier-100 text-atelier-800' :
                          'bg-emerald-100 text-emerald-800'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        {u.designerProfile ? (
                          <div>
                            <span className="font-medium text-charcoal-900">{u.designerProfile.studioName}</span>
                            <span className="block text-[10px] text-charcoal-500">
                              {u.designerProfile._count?.projects || 0} projects • ⭐ {u.designerProfile.averageRating}
                            </span>
                          </div>
                        ) : (
                          <span className="text-charcoal-400">Standard User</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        {u.designerProfile ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleToggleVerification(u.designerProfile.id)}
                              className={`px-2 py-1 rounded-lg text-[10px] font-semibold border transition-all ${
                                u.designerProfile.isVerified
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                  : 'bg-charcoal-100 text-charcoal-500 border-charcoal-200'
                              }`}
                            >
                              {u.designerProfile.isVerified ? '✓ Verified' : 'Unverified'}
                            </button>
                            <button
                              onClick={() => handleToggleFeatured(u.designerProfile.id)}
                              className="px-2 py-1 rounded-lg text-[10px] font-semibold border border-amber-200 text-amber-800 bg-amber-50"
                            >
                              Toggle Spotlight
                            </button>
                          </div>
                        ) : (
                          <span className="text-charcoal-400">—</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {u.id !== user?.id && (
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: PORTFOLIO MODERATION */}
        {activeTab === 'projects' && (
          <div className="bg-white rounded-3xl border border-atelier-200 shadow-sm p-6 sm:p-8">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-charcoal-950 mb-1">
              Portfolio Project Moderation
            </h2>
            <p className="text-xs text-charcoal-500 mb-6">
              Review published projects across all studios to ensure compliance with architectural quality and copyright standards.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className="rounded-2xl border border-atelier-200 overflow-hidden bg-[#FBF9F5] flex flex-col justify-between"
                >
                  <div>
                    <div className="h-40 bg-charcoal-900 relative">
                      <img src={proj.thumbnail} alt={proj.title} className="w-full h-full object-cover" />
                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/70 text-white text-[10px]">
                        {proj.category}
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="font-serif text-base font-bold text-charcoal-900 mb-1">{proj.title}</h4>
                      <p className="text-[11px] text-charcoal-500 mb-2">Studio: {proj.designer?.studioName}</p>
                      <p className="text-xs text-charcoal-600 line-clamp-2">{proj.description}</p>
                    </div>
                  </div>

                  <div className="p-3 bg-white border-t border-atelier-200 flex items-center justify-between">
                    <span className="text-[10px] text-charcoal-400">{proj.style}</span>
                    <button
                      onClick={() => handleDeleteProject(proj.id)}
                      className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-semibold flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Moderate / Remove</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
