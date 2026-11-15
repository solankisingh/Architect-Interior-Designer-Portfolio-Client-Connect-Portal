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
  RefreshCw,
  Building
} from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('users'); // 'users', 'projects'
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

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
      alert('Failed to update verification status.');
    }
  };

  const handleToggleFeatured = async (designerId) => {
    try {
      await api.patch(`/admin/designers/${designerId}/feature`);
      await fetchAdminData();
    } catch (err) {
      alert('Failed to update spotlight status.');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      await fetchAdminData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to remove this project?')) return;
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
    <div className="w-full min-h-screen bg-gray-50 py-8 px-6 sm:px-10 lg:px-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-1.5 text-sm uppercase font-bold text-slate-700 tracking-wider mb-1">
            <ShieldAlert className="w-4 h-4 text-slate-700" />
            <span>Portal Administration & Moderation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Admin Governance Console
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Verify Council of Architecture (COA) credentials, monitor portfolio uploads, and oversee user activity.
          </p>
        </div>

        <button
          onClick={fetchAdminData}
          className="px-4 py-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Stats Row */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
          <div className="p-5 rounded-xl bg-white border border-gray-200 shadow-xs">
            <span className="text-sm uppercase font-semibold text-gray-400">Architects</span>
            <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalDesigners}</p>
            <p className="text-sm text-gray-500 mt-0.5">COA registered firms</p>
          </div>

          <div className="p-5 rounded-xl bg-white border border-gray-200 shadow-xs">
            <span className="text-sm uppercase font-semibold text-gray-400">Clients</span>
            <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalClients}</p>
            <p className="text-sm text-gray-500 mt-0.5">Active property owners</p>
          </div>

          <div className="p-5 rounded-xl bg-white border border-gray-200 shadow-xs">
            <span className="text-sm uppercase font-semibold text-gray-400">Portfolios</span>
            <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalProjects}</p>
            <p className="text-sm text-gray-500 mt-0.5">Verified case studies</p>
          </div>

          <div className="p-5 rounded-xl bg-white border border-gray-200 shadow-xs">
            <span className="text-sm uppercase font-semibold text-gray-400">Inquiries</span>
            <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalInquiries}</p>
            <p className="text-sm text-emerald-600 font-medium mt-0.5">{stats.acceptedInquiries} accepted</p>
          </div>

          <div className="p-5 rounded-xl bg-white border border-gray-200 shadow-xs col-span-2 sm:col-span-1">
            <span className="text-sm uppercase font-semibold text-gray-400">Conversion</span>
            <p className="text-3xl font-bold text-gray-900 mt-1">{stats.conversionRate}%</p>
            <p className="text-sm text-gray-500 mt-0.5">Inquiry to commission</p>
          </div>
        </div>
      )}

      {/* Tab switcher */}
      <div className="flex border-b border-gray-200 mb-6 space-x-8 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === 'users'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          User Directory & Verification ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('projects')}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === 'projects'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          Portfolio Content Moderation ({projects.length})
        </button>
      </div>

      {/* TAB 1: USERS */}
      {activeTab === 'users' && (
        <div className="w-full bg-white rounded-xl border border-gray-200 shadow-xs p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search user by name or email..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-slate-900 outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Filter Role:</span>
              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-300 text-sm bg-white"
              >
                <option value="All">All Roles</option>
                <option value="DESIGNER">Designers / Architects</option>
                <option value="CLIENT">Clients</option>
                <option value="ADMIN">Admins</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-700">
              <thead className="bg-gray-50 text-gray-900 uppercase font-semibold text-[10px] tracking-wider border-y border-gray-200">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Firm Name / Location</th>
                  <th className="py-3 px-4">COA Verification</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50/70">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-gray-900">{u.name}</div>
                      <div className="text-[11px] text-gray-500">{u.email}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                        u.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                        u.role === 'DESIGNER' ? 'bg-amber-100 text-amber-800' :
                        'bg-emerald-100 text-emerald-800'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {u.designerProfile ? (
                        <div>
                          <span className="font-medium text-gray-800">{u.designerProfile.studioName}</span>
                          <span className="block text-[10px] text-gray-500">
                            {u.designerProfile._count?.projects || 0} projects • ⭐ {u.designerProfile.averageRating}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400">Regular Client</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {u.designerProfile ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleVerification(u.designerProfile.id)}
                            className={`px-2.5 py-1 rounded text-[10px] font-semibold border ${
                              u.designerProfile.isVerified
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : 'bg-gray-100 text-gray-500 border-gray-200'
                            }`}
                          >
                            {u.designerProfile.isVerified ? '✓ Verified' : 'Unverified'}
                          </button>
                          <button
                            onClick={() => handleToggleFeatured(u.designerProfile.id)}
                            className="px-2.5 py-1 rounded text-[10px] font-medium border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                          >
                            Toggle Spotlight
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {u.id !== user?.id && (
                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded"
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

      {/* TAB 2: PROJECTS */}
      {activeTab === 'projects' && (
        <div className="w-full bg-white rounded-xl border border-gray-200 shadow-xs p-6 sm:p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-1">
            Portfolio Project Moderation
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Inspect uploaded projects to ensure high architectural resolution and prevent copyright infringement.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="rounded-lg border border-gray-200 overflow-hidden bg-gray-50/50 flex flex-col justify-between"
              >
                <div>
                  <div className="h-40 bg-gray-200 relative">
                    <img src={proj.thumbnail} alt={proj.title} className="w-full h-full object-cover" />
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/75 text-white text-[10px]">
                      {proj.category}
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-gray-900 text-sm mb-0.5">{proj.title}</h4>
                    <p className="text-[11px] text-gray-500 mb-1.5">Studio: {proj.designer?.studioName}</p>
                    <p className="text-sm text-gray-600 line-clamp-2">{proj.description}</p>
                  </div>
                </div>

                <div className="p-3 bg-white border-t border-gray-200 flex items-center justify-between">
                  <span className="text-[10px] text-gray-400">{proj.style}</span>
                  <button
                    onClick={() => handleDeleteProject(proj.id)}
                    className="px-3 py-1 rounded bg-red-50 hover:bg-red-100 text-red-700 text-sm font-semibold flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
