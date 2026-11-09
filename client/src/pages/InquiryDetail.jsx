import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import StatusBadge from '../components/StatusBadge';
import {
  ArrowLeft,
  Send,
  Calendar,
  MapPin,
  DollarSign,
  Clock,
  ShieldCheck,
  User,
  Building,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function InquiryDetail() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [inquiry, setInquiry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);

  const fetchInquiry = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/inquiries/${id}`);
      setInquiry(res.data.inquiry);
    } catch (err) {
      console.error('Failed to load inquiry:', err);
      setError(err.response?.data?.message || 'Failed to load inquiry discussion.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchInquiry();
  }, [id, isAuthenticated]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      setSending(true);
      const res = await api.post(`/inquiries/${id}/messages`, {
        messageText: newMessage.trim()
      });

      setInquiry((prev) => ({
        ...prev,
        messages: [...(prev.messages || []), res.data.message]
      }));
      setNewMessage('');
    } catch (err) {
      console.error('Failed to send message:', err);
      alert('Could not send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setStatusUpdating(true);
      const res = await api.patch(`/inquiries/${id}/status`, { status: newStatus });
      setInquiry((prev) => ({
        ...prev,
        status: res.data.inquiry.status
      }));
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Failed to update status.');
    } finally {
      setStatusUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-24 text-center">
        <div className="w-10 h-10 border-4 border-atelier-300 border-t-atelier-700 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs text-charcoal-500">Loading project communication thread...</p>
      </div>
    );
  }

  if (error || !inquiry) {
    return (
      <div className="min-h-screen py-24 text-center max-w-md mx-auto px-4">
        <h2 className="font-serif text-2xl font-bold text-charcoal-900 mb-2">Inquiry Not Accessible</h2>
        <p className="text-xs text-charcoal-600 mb-6">{error || 'You do not have permission to view this inquiry.'}</p>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2.5 rounded-full bg-charcoal-900 text-white text-xs font-semibold uppercase tracking-wider"
        >
          Return to Previous
        </button>
      </div>
    );
  }

  const isDesigner = inquiry.designer?.userId === user?.id;
  const isAdmin = user?.role === 'ADMIN';
  const canManageStatus = isDesigner || isAdmin;

  return (
    <div className="min-h-screen bg-[#FBF9F5] py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-xs font-semibold text-charcoal-600 hover:text-charcoal-950 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
        </div>

        {/* Header Summary Card */}
        <div className="bg-white rounded-3xl border border-atelier-200 p-6 sm:p-8 shadow-sm mb-8">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-atelier-700">
                  {inquiry.projectCategory}
                </span>
                <span className="text-charcoal-300">•</span>
                <StatusBadge status={inquiry.status} />
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-950">
                {inquiry.projectTitle}
              </h1>
            </div>

            {/* Status Change Selector (Designer / Admin) */}
            {canManageStatus && (
              <div className="bg-atelier-50 p-3 rounded-2xl border border-atelier-200">
                <label className="block text-[10px] uppercase tracking-wider font-bold text-charcoal-600 mb-1">
                  Manage Commission Status:
                </label>
                <select
                  value={inquiry.status}
                  disabled={statusUpdating}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-atelier-300 bg-white text-xs font-semibold text-charcoal-900 outline-none"
                >
                  <option value="PENDING">Pending Review</option>
                  <option value="UNDER_REVIEW">Under Review</option>
                  <option value="ACCEPTED">Accepted (Scope Active)</option>
                  <option value="DECLINED">Declined</option>
                  <option value="COMPLETED">Completed Engagement</option>
                </select>
              </div>
            )}
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-[#FBF9F5] border border-atelier-100 text-xs text-charcoal-700">
            <div>
              <span className="text-[10px] uppercase text-charcoal-400 font-semibold block">Client</span>
              <p className="font-bold text-charcoal-900 mt-0.5">{inquiry.client?.name}</p>
              <p className="text-[11px] text-charcoal-500">{inquiry.client?.email}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase text-charcoal-400 font-semibold block">Studio</span>
              <p className="font-bold text-charcoal-900 mt-0.5">{inquiry.designer?.studioName}</p>
              <p className="text-[11px] text-charcoal-500">{inquiry.designer?.user?.name}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase text-charcoal-400 font-semibold block">Est. Budget</span>
              <p className="font-bold text-charcoal-900 mt-0.5">{inquiry.budgetRange}</p>
              <p className="text-[11px] text-charcoal-500">{inquiry.targetTimeline}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase text-charcoal-400 font-semibold block">Location</span>
              <p className="font-bold text-charcoal-900 mt-0.5">{inquiry.location}</p>
              <p className="text-[11px] text-charcoal-500">
                {new Date(inquiry.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Scope Description */}
          <div className="mt-6 pt-6 border-t border-atelier-100">
            <h4 className="text-xs uppercase tracking-wider text-charcoal-400 font-semibold mb-2">
              Scope of Work & Client Brief
            </h4>
            <p className="text-xs sm:text-sm text-charcoal-700 leading-relaxed bg-white p-4 rounded-xl border border-atelier-200">
              {inquiry.scopeDescription}
            </p>
          </div>
        </div>

        {/* Conversation Thread */}
        <div className="bg-white rounded-3xl border border-atelier-200 p-6 sm:p-8 shadow-sm">
          <div className="border-b border-atelier-100 pb-4 mb-6 flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-charcoal-950">
              Project Discussion History
            </h3>
            <span className="text-xs text-charcoal-400">
              {inquiry.messages?.length || 0} messages recorded
            </span>
          </div>

          {/* Message Feed */}
          <div className="space-y-4 mb-8 max-h-[500px] overflow-y-auto pr-2">
            {(inquiry.messages || []).map((msg) => {
              const isSender = msg.senderId === user?.id;
              const isClientMsg = msg.sender?.role === 'CLIENT';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isSender ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-2 mb-1 text-[11px] text-charcoal-500 px-1">
                    <span className="font-semibold text-charcoal-800">
                      {msg.sender?.name || (isSender ? 'You' : 'Participant')}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-atelier-100 text-atelier-800">
                      {msg.sender?.role}
                    </span>
                    <span>•</span>
                    <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>

                  <div
                    className={`max-w-lg p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm ${
                      isSender
                        ? 'bg-charcoal-900 text-white rounded-tr-none'
                        : 'bg-[#F5F0E8] text-charcoal-900 border border-atelier-200 rounded-tl-none'
                    }`}
                  >
                    {msg.messageText}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Reply Input Box */}
          <form onSubmit={handleSendMessage} className="pt-4 border-t border-atelier-100">
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <label className="block text-[11px] font-semibold text-charcoal-600 mb-1">
                  Send Response to {isDesigner ? inquiry.client?.name : inquiry.designer?.studioName}
                </label>
                <textarea
                  rows="3"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message, query or schedule proposal..."
                  className="w-full px-4 py-3 rounded-2xl border border-atelier-300 focus:border-atelier-600 outline-none text-xs sm:text-sm bg-[#FBF9F5] resize-none"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={sending || !newMessage.trim()}
                className="px-6 py-3.5 rounded-2xl bg-charcoal-900 hover:bg-charcoal-800 disabled:opacity-50 text-atelier-100 text-xs font-semibold tracking-wider uppercase flex items-center gap-2 shadow-md transition-all shrink-0 h-[52px]"
              >
                {sending ? 'Sending...' : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Reply</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
