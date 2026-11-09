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
  DollarSign,
  ArrowRight,
  ExternalLink,
  Star,
  Layers,
  Sparkles
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
    <div className="min-h-screen bg-[#FBF9F5] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-atelier-200">
          <div>
            <span className="text-xs uppercase tracking-widest text-atelier-700 font-semibold block mb-1">
              Client Commission Hub
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-950">
              Welcome, {user?.name}
            </h1>
            <p className="text-xs text-charcoal-500 mt-1">
              Monitor your active project commissions, communicate with architects, and track milestones.
            </p>
          </div>

          <Link
            to="/designers"
            className="px-6 py-3 rounded-2xl bg-charcoal-900 hover:bg-charcoal-800 text-atelier-100 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 shadow-md self-start sm:self-auto"
          >
            <Compass className="w-4 h-4" />
            <span>Discover More Studios</span>
          </Link>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="p-6 rounded-3xl bg-white border border-atelier-200 shadow-sm">
            <span className="text-xs uppercase tracking-wider text-charcoal-400 font-semibold">Total Inquiries</span>
            <p className="font-serif text-3xl font-bold text-charcoal-950 mt-1">{totalInquiries}</p>
            <p className="text-[11px] text-charcoal-500 mt-1">Submitted to accredited studios</p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-atelier-200 shadow-sm">
            <span className="text-xs uppercase tracking-wider text-atelier-700 font-semibold">Active Inquiries</span>
            <p className="font-serif text-3xl font-bold text-charcoal-950 mt-1">{activeInquiries}</p>
            <p className="text-[11px] text-emerald-600 mt-1 font-medium">Under architectural evaluation</p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-atelier-200 shadow-sm">
            <span className="text-xs uppercase tracking-wider text-purple-700 font-semibold">Completed Projects</span>
            <p className="font-serif text-3xl font-bold text-charcoal-950 mt-1">{completedInquiries}</p>
            <p className="text-[11px] text-charcoal-500 mt-1">Ready for verified testimonials</p>
          </div>
        </div>

        {/* Inquiries List */}
        <div className="bg-white rounded-3xl border border-atelier-200/90 shadow-sm p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-atelier-100">
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-charcoal-950">
                Your Commission Inquiries
              </h2>
              <p className="text-xs text-charcoal-500 mt-0.5">
                Real-time status updates and direct messages from design studios.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="py-16 text-center">
              <div className="w-8 h-8 border-4 border-atelier-300 border-t-atelier-700 rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs text-charcoal-500">Loading your project inquiries...</p>
            </div>
          ) : inquiries.length === 0 ? (
            <div className="py-16 text-center max-w-md mx-auto">
              <div className="w-14 h-14 rounded-3xl bg-atelier-100 text-atelier-700 flex items-center justify-center font-bold text-xl mx-auto mb-4">
                📐
              </div>
              <h3 className="font-serif text-lg font-bold text-charcoal-900 mb-1">No Inquiries Submitted Yet</h3>
              <p className="text-xs text-charcoal-500 mb-6">
                Explore our curated directory of certified architects and interior designers to commission your next project.
              </p>
              <Link
                to="/designers"
                className="px-6 py-2.5 rounded-full bg-charcoal-900 text-white text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-2"
              >
                <span>Browse Studios</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {inquiries.map((inq) => (
                <div
                  key={inq.id}
                  className="p-5 sm:p-6 rounded-2xl bg-[#FBF9F5] border border-atelier-200 hover:border-atelier-400 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge status={inq.status} />
                      <span className="text-[11px] text-charcoal-500 font-medium">
                        • {inq.projectCategory} • Submitted on {new Date(inq.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="font-serif text-lg font-bold text-charcoal-950">
                      {inq.projectTitle}
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-charcoal-600">
                      <span className="font-semibold text-charcoal-900">
                        Studio: {inq.designer?.studioName}
                      </span>
                      <span>•</span>
                      <span>Budget: {inq.budgetRange}</span>
                      <span>•</span>
                      <span>Location: {inq.location}</span>
                    </div>

                    {inq.messages && inq.messages.length > 0 && (
                      <p className="text-xs text-charcoal-500 italic line-clamp-1 bg-white/70 p-2 rounded-lg border border-atelier-100">
                        Latest: "{inq.messages[0].messageText}"
                      </p>
                    )}
                  </div>

                  <div className="flex sm:flex-col items-center gap-2 shrink-0 w-full sm:w-auto">
                    <Link
                      to={`/inquiries/${inq.id}`}
                      className="flex-1 sm:flex-none py-2.5 px-5 rounded-xl bg-charcoal-900 hover:bg-charcoal-800 text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm text-center"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Open Thread</span>
                    </Link>

                    <Link
                      to={`/designers/${inq.designer?.id}`}
                      className="py-2.5 px-3 rounded-xl border border-atelier-300 hover:bg-atelier-100 text-charcoal-700 text-xs font-medium flex items-center justify-center"
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
    </div>
  );
}
