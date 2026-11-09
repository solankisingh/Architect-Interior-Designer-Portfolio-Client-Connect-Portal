import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { X, Star, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ReviewModal({ designer, isOpen, onClose, onSuccess }) {
  const { user, isAuthenticated } = useAuth();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState('');
  const [comment, setComment] = useState('');
  const [projectCategory, setProjectCategory] = useState('Residential Architecture');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen || !designer) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setError('You must be signed in as a client to leave a verified review.');
      return;
    }

    if (!comment.trim()) {
      setError('Please provide written feedback about your experience.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const res = await api.post('/reviews', {
        designerId: designer.id,
        rating,
        reviewTitle: reviewTitle || 'Client Review',
        comment,
        projectCategory
      });

      setSuccess(true);
      if (onSuccess) onSuccess(res.data.review);

      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-charcoal-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-[#FBF9F5] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-atelier-200 animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-charcoal-400 hover:text-charcoal-800 p-2 rounded-full hover:bg-atelier-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <span className="text-xs uppercase tracking-widest text-atelier-700 font-semibold block mb-1">
            Client Testimonial & Review
          </span>
          <h3 className="font-serif text-2xl font-bold text-charcoal-950">
            Rate {designer.studioName}
          </h3>
          <p className="text-xs text-charcoal-500 mt-1">
            Share your feedback on architectural vision, communication, and execution.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
            <h4 className="font-serif text-xl font-bold text-charcoal-900">Review Submitted!</h4>
            <p className="text-xs text-charcoal-600">Thank you for helping build trusted architectural excellence.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Star Rating Selector */}
            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1.5">
                Overall Experience Rating (1 - 5 Stars) *
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        (hoverRating || rating) >= star
                          ? 'fill-amber-400 text-amber-500'
                          : 'text-atelier-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-medium text-charcoal-600 ml-2">
                  {rating} / 5 Stars
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                Headline / Review Title
              </label>
              <input
                type="text"
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
                placeholder="e.g. Masterful spatial planning and effortless communication"
                className="w-full px-4 py-2.5 rounded-xl border border-atelier-300 focus:border-atelier-600 outline-none text-sm bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                Project Category
              </label>
              <select
                value={projectCategory}
                onChange={(e) => setProjectCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-atelier-300 focus:border-atelier-600 outline-none text-sm bg-white"
              >
                <option value="Residential Architecture">Residential Architecture</option>
                <option value="Luxury Penthouse">Luxury Penthouse</option>
                <option value="Commercial Space">Commercial Space</option>
                <option value="Interior Renovation">Interior Renovation</option>
                <option value="Landscape & Courtyard">Landscape & Courtyard</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                Written Testimonial *
              </label>
              <textarea
                rows="4"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Detail the collaboration, material choices, transparency with timelines, and final outcome..."
                className="w-full px-4 py-2.5 rounded-xl border border-atelier-300 focus:border-atelier-600 outline-none text-sm bg-white resize-none"
                required
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
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
                className="px-6 py-2.5 rounded-xl bg-charcoal-900 hover:bg-charcoal-800 text-atelier-100 text-xs font-semibold tracking-wider uppercase shadow-md transition-all"
              >
                {loading ? 'Submitting...' : 'Post Verified Review'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
