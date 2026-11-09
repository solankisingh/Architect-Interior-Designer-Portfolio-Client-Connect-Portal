import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { X, Send, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function InquiryModal({ designer, isOpen, onClose, onSuccess }) {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    projectTitle: '',
    projectCategory: 'Residential Architecture',
    location: '',
    budgetRange: '$25,000 - $50,000',
    targetTimeline: '3-6 Months',
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
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-charcoal-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-[#FBF9F5] rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-atelier-200 animate-in fade-in zoom-in-95">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-charcoal-400 hover:text-charcoal-800 p-2 rounded-full hover:bg-atelier-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <span className="text-xs uppercase tracking-widest text-atelier-700 font-semibold block mb-1">
            Project Commission & Inquiry
          </span>
          <h3 className="font-serif text-2xl font-bold text-charcoal-950">
            Connect with {designer.studioName}
          </h3>
          <p className="text-xs text-charcoal-500 mt-1">
            Led by {designer.user?.name} • {designer.location}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div className="py-12 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
            <h4 className="font-serif text-xl font-bold text-charcoal-900">Inquiry Sent to {designer.studioName}!</h4>
            <p className="text-xs text-charcoal-600">Redirecting to your project communication thread...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                Project Title / Scope Name *
              </label>
              <input
                type="text"
                name="projectTitle"
                value={formData.projectTitle}
                onChange={handleChange}
                placeholder="e.g. Modern Minimalist Seaside Villa, 4BHK Penthouse Renovation"
                className="w-full px-4 py-2.5 rounded-xl border border-atelier-300 focus:border-atelier-600 focus:ring-1 focus:ring-atelier-600 outline-none text-sm bg-white"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                  Project Category
                </label>
                <select
                  name="projectCategory"
                  value={formData.projectCategory}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-xl border border-atelier-300 focus:border-atelier-600 outline-none text-sm bg-white"
                >
                  <option value="Residential Architecture">Residential Architecture</option>
                  <option value="Interior Design & Styling">Interior Design & Styling</option>
                  <option value="Penthouse Renovation">Penthouse Renovation</option>
                  <option value="Commercial & Office Space">Commercial & Office Space</option>
                  <option value="Hospitality & Dining">Hospitality & Dining</option>
                  <option value="Landscape & Courtyard">Landscape & Courtyard</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                  Site / Project Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. North Goa, Mumbai, Bengaluru"
                  className="w-full px-4 py-2.5 rounded-xl border border-atelier-300 focus:border-atelier-600 outline-none text-sm bg-white"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                  Estimated Budget Range
                </label>
                <select
                  name="budgetRange"
                  value={formData.budgetRange}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-xl border border-atelier-300 focus:border-atelier-600 outline-none text-sm bg-white"
                >
                  <option value="Under $25,000">Under $25,000 (Consultation & Conceptual)</option>
                  <option value="$25,000 - $75,000">$25,000 - $75,000 (Apartment / Interior)</option>
                  <option value="$75,000 - $200,000">$75,000 - $200,000 (Luxury Renovation / Duplex)</option>
                  <option value="$200,000 - $500,000">$200,000 - $500,000 (Full Villa Architecture)</option>
                  <option value="$500,000+">$500,000+ (Estate / Landmark Scale)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                  Target Timeline
                </label>
                <select
                  name="targetTimeline"
                  value={formData.targetTimeline}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-xl border border-atelier-300 focus:border-atelier-600 outline-none text-sm bg-white"
                >
                  <option value="Immediate (Within 1 month)">Immediate (Within 1 month)</option>
                  <option value="1 - 3 Months">1 - 3 Months</option>
                  <option value="3 - 6 Months">3 - 6 Months</option>
                  <option value="6 - 12 Months">6 - 12 Months</option>
                  <option value="Planning / Concept Stage">Planning / Concept Stage</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                Project Scope & Requirements *
              </label>
              <textarea
                name="scopeDescription"
                rows="3"
                value={formData.scopeDescription}
                onChange={handleChange}
                placeholder="Describe your property, approximate area (sq ft), aesthetic preferences, and key priorities (e.g. natural daylight, courtyard, infinity pool)..."
                className="w-full px-4 py-2.5 rounded-xl border border-atelier-300 focus:border-atelier-600 outline-none text-sm bg-white resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                Personalized Note to Architect (Optional)
              </label>
              <input
                type="text"
                name="initialMessage"
                value={formData.initialMessage}
                onChange={handleChange}
                placeholder="e.g. Hello, we loved your Solarium Cliff Villa and would like to schedule a site consultation."
                className="w-full px-4 py-2.5 rounded-xl border border-atelier-300 focus:border-atelier-600 outline-none text-sm bg-white"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-[11px] text-charcoal-500">
                Direct inquiry tracked securely via AtelierConnect
              </span>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-charcoal-600 hover:text-charcoal-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl bg-charcoal-900 hover:bg-charcoal-800 text-atelier-100 text-xs font-semibold tracking-wider uppercase flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
                >
                  {loading ? 'Sending...' : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      Submit Inquiry
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
