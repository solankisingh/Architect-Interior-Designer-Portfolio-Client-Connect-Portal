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
  Clock,
  ShieldCheck,
  User,
  Building,
  Printer
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
      alert('Failed to update status.');
    } finally {
      setStatusUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-16 text-center text-xs text-gray-500">
        Loading project discussion...
      </div>
    );
  }

  if (error || !inquiry) {
    return (
      <div className="min-h-screen py-16 text-center max-w-md mx-auto px-4">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Inquiry Not Found</h2>
        <p className="text-xs text-gray-500 mb-4">{error || 'You do not have permission to view this inquiry.'}</p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const isDesigner = inquiry.designer?.userId === user?.id;
  const isAdmin = user?.role === 'ADMIN';
  const canManageStatus = isDesigner || isAdmin;

  return (
    <div className="w-full min-h-screen bg-gray-50 py-8 px-6 sm:px-10 lg:px-16">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-200">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Inquiries</span>
        </button>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-1 text-xs text-gray-700 hover:text-gray-900 border border-gray-300 bg-white px-3.5 py-1.5 rounded-lg shadow-xs"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print Scope Brief</span>
        </button>
      </div>

      {/* Project Card */}
      <div className="w-full bg-white rounded-xl border border-gray-200 p-6 sm:p-8 shadow-xs mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold text-amber-700 uppercase">
                {inquiry.projectCategory}
              </span>
              <span className="text-gray-300">•</span>
              <StatusBadge status={inquiry.status} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {inquiry.projectTitle}
            </h1>
          </div>

          {canManageStatus && (
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <label className="block text-[11px] uppercase font-bold text-gray-500 mb-1">
                Manage Scope Status:
              </label>
              <select
                value={inquiry.status}
                disabled={statusUpdating}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-xs font-semibold text-gray-800 outline-none cursor-pointer"
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

        {/* Specs grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-lg bg-gray-50 border border-gray-200 text-xs text-gray-700">
          <div>
            <span className="text-[10px] text-gray-400 font-semibold uppercase block">Client</span>
            <p className="font-bold text-gray-900 mt-0.5 text-sm">{inquiry.client?.name}</p>
            <p className="text-xs text-gray-500">{inquiry.client?.email}</p>
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-semibold uppercase block">Studio</span>
            <p className="font-bold text-gray-900 mt-0.5 text-sm">{inquiry.designer?.studioName}</p>
            <p className="text-xs text-gray-500">{inquiry.designer?.user?.name}</p>
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-semibold uppercase block">Budget & Timeline</span>
            <p className="font-bold text-gray-900 mt-0.5 text-sm">{inquiry.budgetRange}</p>
            <p className="text-xs text-gray-500">{inquiry.targetTimeline}</p>
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-semibold uppercase block">Site Location</span>
            <p className="font-bold text-gray-900 mt-0.5 text-sm">{inquiry.location}</p>
            <p className="text-xs text-gray-500">
              {new Date(inquiry.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-gray-100">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Client Requirement & Scope Brief
          </h4>
          <p className="text-xs sm:text-sm text-gray-800 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-200">
            {inquiry.scopeDescription}
          </p>
        </div>
      </div>

      {/* Message Thread */}
      <div className="w-full bg-white rounded-xl border border-gray-200 p-6 sm:p-8 shadow-xs">
        <div className="border-b border-gray-100 pb-3 mb-5 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">
            Discussion & Communication History
          </h3>
          <span className="text-xs text-gray-400">
            {inquiry.messages?.length || 0} messages
          </span>
        </div>

        <div className="space-y-4 mb-6 max-h-[500px] overflow-y-auto pr-2">
          {(inquiry.messages || []).map((msg) => {
            const isSender = msg.senderId === user?.id;

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isSender ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center gap-1.5 mb-1 text-xs text-gray-400 px-1">
                  <span className="font-semibold text-gray-800">
                    {msg.sender?.name || (isSender ? 'You' : 'Participant')}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-gray-100 text-gray-600 font-medium">
                    {msg.sender?.role}
                  </span>
                  <span>•</span>
                  <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>

                <div
                  className={`max-w-xl p-3.5 rounded-xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                    isSender
                      ? 'bg-slate-900 text-white rounded-tr-none'
                      : 'bg-gray-100 text-gray-900 border border-gray-200 rounded-tl-none'
                  }`}
                >
                  {msg.messageText}
                </div>
              </div>
            );
          })}
        </div>

        {/* Reply Form */}
        <form onSubmit={handleSendMessage} className="pt-4 border-t border-gray-100">
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <textarea
                rows="2"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a response regarding drawings, site visit, or budget..."
                className="w-full px-4 py-2.5 text-xs sm:text-sm border border-gray-300 rounded-lg focus:border-slate-900 outline-none resize-none"
                required
              />
            </div>
            <button
              type="submit"
              disabled={sending || !newMessage.trim()}
              className="px-6 py-3 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 shrink-0 transition-colors h-[46px]"
            >
              <Send className="w-4 h-4" />
              <span>Send</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
