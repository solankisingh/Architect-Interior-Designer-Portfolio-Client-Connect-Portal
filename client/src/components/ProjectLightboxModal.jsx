import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, MapPin, Calendar, Maximize2, Tag, DollarSign, Building } from 'lucide-react';

export default function ProjectLightboxModal({ project, isOpen, onClose }) {
  if (!isOpen || !project) return null;

  let imageList = [];
  try {
    imageList = typeof project.images === 'string' ? JSON.parse(project.images) : (project.images || []);
  } catch (e) {
    imageList = [project.thumbnail];
  }
  if (!imageList.length && project.thumbnail) {
    imageList = [project.thumbnail];
  }

  const [activeIdx, setActiveIdx] = useState(0);

  const prevImage = () => {
    setActiveIdx((prev) => (prev === 0 ? imageList.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setActiveIdx((prev) => (prev === imageList.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="relative bg-white rounded-xl max-w-5xl w-full overflow-hidden shadow-2xl border border-gray-200 flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-amber-700 font-bold">
              {project.category} • {project.style}
            </span>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 truncate max-w-md sm:max-w-xl">
              {project.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 p-1 rounded-md hover:bg-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-3">
          {/* Photos */}
          <div className="lg:col-span-2 bg-slate-950 flex flex-col justify-center relative min-h-[320px] sm:min-h-[440px]">
            <img
              src={imageList[activeIdx]}
              alt={`${project.title} - ${activeIdx + 1}`}
              className="w-full h-full max-h-[500px] object-contain"
            />

            {imageList.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 p-1 rounded-lg bg-black/70 max-w-[90%] overflow-x-auto">
                  {imageList.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveIdx(idx)}
                      className={`w-12 h-8 rounded overflow-hidden shrink-0 border transition-all ${
                        activeIdx === idx ? 'border-amber-400 opacity-100' : 'border-transparent opacity-50 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="thumb" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Details */}
          <div className="p-5 bg-white flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-gray-200">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm uppercase font-semibold text-gray-500 mb-1">
                  Project Concept & Scope
                </h4>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {project.description}
                </p>
              </div>

              {/* Specs Table */}
              <div className="p-3.5 rounded-lg bg-gray-50 border border-gray-200 space-y-2 text-sm">
                <div className="flex justify-between py-1 border-b border-gray-200">
                  <span className="text-gray-500">Location:</span>
                  <span className="font-medium text-gray-800">{project.location || 'Assigned'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-200">
                  <span className="text-gray-500">Completion Year:</span>
                  <span className="font-medium text-gray-800">{project.completionYear || 'Recent'}</span>
                </div>
                {project.areaSqFt && (
                  <div className="flex justify-between py-1 border-b border-gray-200">
                    <span className="text-gray-500">Built-up / Carpet Area:</span>
                    <span className="font-medium text-gray-800">{project.areaSqFt}</span>
                  </div>
                )}
                {project.budgetRange && (
                  <div className="flex justify-between py-1">
                    <span className="text-gray-500">Estimated Budget:</span>
                    <span className="font-semibold text-amber-700">{project.budgetRange}</span>
                  </div>
                )}
              </div>

              {project.designer && (
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
                    <Building className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase font-medium">Architectural Practice</p>
                    <p className="text-sm font-bold text-gray-900">{project.designer.studioName}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4">
              <button
                onClick={onClose}
                className="w-full py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm font-semibold text-gray-800 transition-colors"
              >
                Close Gallery
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
