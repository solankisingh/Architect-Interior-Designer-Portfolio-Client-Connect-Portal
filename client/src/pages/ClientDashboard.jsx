import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import StatusBadge from '../components/StatusBadge';
import {
  MessageSquare,
  Clock,
  Compass,
  CheckCircle2,
  Calendar,
  ArrowRight,
  ExternalLink,
  Star,
  Building
} from 'lucide-react';

export default function ClientDashboard() {
  const { user } = useAuth();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyInquiries = async () => {
    try {
      setLoading(true);
      const res = await api.get('/inquiries/my');
      setInquiries(res.data.inquiries || []);
    } catch (err) {
      console.error('Failed to fetch client inquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyInquiries();
  }, []);

  const totalInquiries = inquiries.length;
  const activeInquiries = inquiries.filter((i) => ['PENDING', 'UNDER_REVIEW', 'ACCEPTED'].includes(i.status)).length;
  const completedInquiries = inquiries.filter((i) => i.status === 'COMPLETED').length;

  return (
    <div className="w-full min-h-screen bg-gray-50 py-8 px-6 sm:px-10 lg:px-16">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Client Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Welcome, <strong className="text-gray-800">{user?.name}</strong>. Track your project inquiries, messages, and project milestones.
          </p>
        </div>

        <Link
          to="/designers"
          className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 self-start sm:self-auto transition-colors"
        >
          <Compass className="w-4 h-4" />
          <span>Find New Architects</span>
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="p-5 rounded-xl bg-white border border-gray-200 shadow-xs">
          <span className="text-xs uppercase font-semibold text-gray-400">Total Inquiries</span>
          <p className="text-3xl font-bold text-gray-900 mt-1">{totalInquiries}</p>
          <p className="text-xs text-gray-500 mt-1">Submitted to architecture firms</p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-gray-200 shadow-xs">
          <span className="text-xs uppercase font-semibold text-amber-700">Active Discussions</span>
          <p className="text-3xl font-bold text-gray-900 mt-1">{activeInquiries}</p>
          <p className="text-xs text-emerald-600 mt-1 font-medium">Under evaluation or scope accepted</p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-gray-200 shadow-xs">
          <span className="text-xs uppercase font-semibold text-gray-500">Completed Contracts</span>
          <p className="text-3xl font-bold text-gray-900 mt-1">{completedInquiries}</p>
          <p className="text-xs text-gray-500 mt-1">Eligible for verified reviews</p>
        </div>
      </div>

      {/* Inquiries List */}
      <div className="w-full bg-white rounded-xl border border-gray-200 shadow-xs p-6 sm:p-8">
        <div className="mb-6 pb-3 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Your Project Inquiries
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">Real-time status updates and direct messages from architects.</p>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-gray-500">
            Loading your inquiries...
          </div>
        ) : inquiries.length === 0 ? (
          <div className="py-16 text-center max-w-sm mx-auto">
            <Building className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-800 mb-1">No Inquiries Submitted Yet</h3>
            <p className="text-xs text-gray-500 mb-5">
              Explore registered architects and send a project brief to get started.
            </p>
            <Link
              to="/designers"
              className="px-5 py-2.5 rounded-lg bg-slate-900 text-white text-xs font-semibold inline-flex items-center gap-1.5"
            >
              <span>Browse Directory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {inquiries.map((inq) => (
              <div
                key={inq.id}
                className="p-5 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gray-50/50"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={inq.status} />
                    <span className="text-xs text-gray-500 font-medium">
                      • {inq.projectCategory} • Submitted on {new Date(inq.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900">
                    {inq.projectTitle}
                  </h3>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
                    <span>Studio: <strong className="text-gray-900">{inq.designer?.studioName}</strong></span>
                    <span>•</span>
                    <span>Budget: {inq.budgetRange}</span>
                    <span>•</span>
                    <span>Location: {inq.location}</span>
                  </div>

                  {inq.messages && inq.messages.length > 0 && (
                    <p className="text-xs text-gray-700 italic line-clamp-1 bg-white p-2.5 rounded-lg border border-gray-200 mt-2">
                      Latest: "{inq.messages[0].messageText}"
                    </p>
                  )}
                </div>

                <div className="flex sm:flex-col items-center gap-2 shrink-0 w-full sm:w-auto">
                  <Link
                    to={`/inquiries/${inq.id}`}
                    className="flex-1 sm:flex-none py-2 px-5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors text-center"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>View Discussion</span>
                  </Link>

                  <Link
                    to={`/designers/${inq.designer?.id}`}
                    className="py-2 px-3 rounded-lg border border-gray-300 hover:bg-gray-100 text-gray-700 text-xs font-medium flex items-center justify-center"
                    title="View Studio Profile"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
