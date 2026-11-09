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
  const [projectCategory, setProjectCategory] = useState('Residential Villa');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen || !designer) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setError('You must be signed in as a client to leave a review.');
      return;
    }

    if (!comment.trim()) {
      setError('Please provide feedback about your project experience.');
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
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-gray-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1 rounded-md"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-5">
          <span className="text-[11px] uppercase tracking-wider text-amber-700 font-bold block mb-1">
            Client Review & Rating
          </span>
          <h3 className="text-xl font-bold text-gray-900">
            Review {designer.studioName}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Share your feedback on architectural drawings, communication, and site supervision.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div className="py-8 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h4 className="text-base font-bold text-gray-900">Review Submitted</h4>
            <p className="text-xs text-gray-500">Thank you for sharing your experience.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Rating (1 to 5 Stars) *
              </label>
              <div className="flex items-center gap-1.5">
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
                      className={`w-6 h-6 ${
                        (hoverRating || rating) >= star
                          ? 'fill-amber-400 text-amber-500'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-semibold text-gray-700 ml-2">
                  {rating} / 5 Stars
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Headline / Title
              </label>
              <input
                type="text"
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
                placeholder="e.g. Accurate drawings and smooth site coordination"
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:border-slate-900 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Project Category
              </label>
              <select
                value={projectCategory}
                onChange={(e) => setProjectCategory(e.target.value)}
                className="w-full px-2.5 py-2 text-xs border border-gray-300 rounded-lg focus:border-slate-900 outline-none bg-white"
              >
                <option value="Residential Villa">Residential Villa</option>
                <option value="Apartment Interior">Apartment Interior</option>
                <option value="Commercial Workspace">Commercial Workspace</option>
                <option value="Holiday Home">Holiday Home</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Detailed Feedback *
              </label>
              <textarea
                rows="3"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Detail the collaboration, drawing revisions, adherence to budget, and site outcome..."
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:border-slate-900 outline-none resize-none"
                required
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-gray-100">
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
                className="px-5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold uppercase tracking-wider transition-colors"
              >
                {loading ? 'Submitting...' : 'Post Review'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
