import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { X, Send, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function InquiryModal({ designer, isOpen, onClose, onSuccess }) {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    projectTitle: '',
    projectCategory: 'Residential Villa Construction',
    location: '',
    budgetRange: '₹50 Lakhs - ₹1 Crore',
    targetTimeline: '6 - 9 Months',
    scopeDescription: '',
    initialMessage: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen || !designer) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login?redirect=inquiry');
      return;
    }

    if (!formData.projectTitle || !formData.scopeDescription) {
      setError('Please provide a project title and scope description.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const res = await api.post('/inquiries', {
        designerId: designer.id,
        ...formData
      });

      setSuccess(true);
      if (onSuccess) onSuccess(res.data.inquiry);

      setTimeout(() => {
        onClose();
        navigate(`/inquiries/${res.data.inquiry.id}`);
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit inquiry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-xl max-w-xl w-full p-6 sm:p-7 shadow-xl border border-gray-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1 rounded-md hover:bg-gray-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-5">
          <span className="text-[11px] uppercase tracking-wider text-amber-700 font-bold block mb-1">
            Project Commission Brief
          </span>
          <h3 className="text-xl font-bold text-gray-900">
            Send Inquiry to {designer.studioName}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Principal: {designer.user?.name} • Base: {designer.location}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div className="py-10 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h4 className="text-base font-bold text-gray-900">Inquiry Sent Successfully</h4>
            <p className="text-xs text-gray-500">Redirecting to project communication thread...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Project Name / Scope Summary *
              </label>
              <input
                type="text"
                name="projectTitle"
                value={formData.projectTitle}
                onChange={handleChange}
                placeholder="e.g. 4BHK Villa Construction on 2400 sq.ft plot, 3BHK Flat Renovation"
                className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:border-slate-900 outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Project Category
                </label>
                <select
                  name="projectCategory"
                  value={formData.projectCategory}
                  onChange={handleChange}
                  className="w-full px-2.5 py-2 text-xs border border-gray-300 rounded-lg focus:border-slate-900 outline-none bg-white"
                >
                  <option value="Residential Villa Construction">Residential Villa Construction</option>
                  <option value="Apartment Interior Design">Apartment Interior Design</option>
                  <option value="Farmhouse & Vacation Home">Farmhouse & Vacation Home</option>
                  <option value="Commercial Office Workspace">Commercial Office Workspace</option>
                  <option value="Full House Renovation">Full House Renovation</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Site City / Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Whitefield Bangalore, Worli Mumbai"
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:border-slate-900 outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Estimated Budget
                </label>
                <select
                  name="budgetRange"
                  value={formData.budgetRange}
                  onChange={handleChange}
                  className="w-full px-2.5 py-2 text-xs border border-gray-300 rounded-lg focus:border-slate-900 outline-none bg-white"
                >
                  <option value="Under ₹25 Lakhs">Under ₹25 Lakhs (Interiors / Consultation)</option>
                  <option value="₹25 Lakhs - ₹50 Lakhs">₹25 Lakhs - ₹50 Lakhs (2BHK/3BHK Renovation)</option>
                  <option value="₹50 Lakhs - ₹1 Crore">₹50 Lakhs - ₹1 Crore (Villa Construction)</option>
                  <option value="₹1 Crore - ₹2.5 Crores">₹1 Crore - ₹2.5 Crores (Luxury Villa)</option>
                  <option value="₹2.5 Crores+">₹2.5 Crores+ (Estate / Landmark)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Target Timeline
                </label>
                <select
                  name="targetTimeline"
                  value={formData.targetTimeline}
                  onChange={handleChange}
                  className="w-full px-2.5 py-2 text-xs border border-gray-300 rounded-lg focus:border-slate-900 outline-none bg-white"
                >
                  <option value="Immediate (1-2 months)">Immediate (1-2 months)</option>
                  <option value="3 - 6 Months">3 - 6 Months</option>
                  <option value="6 - 12 Months">6 - 12 Months</option>
                  <option value="Concept / Planning Stage">Concept / Planning Stage</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Detailed Scope of Work & Requirements *
              </label>
              <textarea
                name="scopeDescription"
                rows="3"
                value={formData.scopeDescription}
                onChange={handleChange}
                placeholder="Mention plot dimensions or apartment carpet area, number of bedrooms, floor requirements, and key priorities (courtyard, modular kitchen, balcony, site supervision)..."
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:border-slate-900 outline-none resize-none"
                required
              />
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-gray-100">
              <span className="text-[11px] text-gray-500">
                Direct inquiry tracked in your dashboard
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-1.5 text-xs text-gray-600 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                >
                  {loading ? 'Sending...' : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Inquiry</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
