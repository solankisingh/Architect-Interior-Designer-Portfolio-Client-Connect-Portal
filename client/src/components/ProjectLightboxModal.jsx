import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, MapPin, Calendar, Maximize2, Tag, DollarSign } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-charcoal-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div className="relative bg-[#1A1A1A] text-white rounded-3xl max-w-5xl w-full overflow-hidden shadow-2xl border border-charcoal-800 flex flex-col max-h-[92vh]">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between p-4 sm:px-6 border-b border-charcoal-800 bg-charcoal-900/90 z-10">
          <div>
            <span className="text-[11px] uppercase tracking-widest text-atelier-400 font-semibold">
              {project.category} • {project.style}
            </span>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-white truncate max-w-md sm:max-w-xl">
              {project.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-charcoal-400 hover:text-white p-2 rounded-full hover:bg-charcoal-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-3">
          {/* Main Visual Gallery (2 Columns on Desktop) */}
          <div className="lg:col-span-2 bg-black flex flex-col justify-center relative min-h-[340px] sm:min-h-[460px]">
            <img
              src={imageList[activeIdx]}
              alt={`${project.title} - ${activeIdx + 1}`}
              className="w-full h-full max-h-[550px] object-contain transition-opacity duration-300"
            />

            {/* Prev / Next Controls */}
            {imageList.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-sm border border-white/10 transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-sm border border-white/10 transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Thumbnails row */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 p-1.5 rounded-2xl bg-black/70 backdrop-blur-md max-w-[90%] overflow-x-auto">
                  {imageList.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveIdx(idx)}
                      className={`w-12 h-9 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                        activeIdx === idx ? 'border-atelier-400 scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="thumb" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Project Details Sidebar */}
          <div className="p-6 bg-charcoal-900 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-charcoal-800">
            <div className="space-y-5">
              <div>
                <h4 className="text-xs uppercase tracking-wider text-charcoal-400 font-semibold mb-2">Project Overview</h4>
                <p className="text-xs sm:text-sm text-charcoal-300 leading-relaxed">
                  {project.description}
                </p>
              </div>

              {/* Specifications Card */}
              <div className="p-4 rounded-2xl bg-charcoal-850 border border-charcoal-750 space-y-3">
                <h5 className="text-[11px] uppercase tracking-wider text-atelier-300 font-semibold">Specifications</h5>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between py-1 border-b border-charcoal-800 text-charcoal-300">
                    <span className="flex items-center gap-1.5 text-charcoal-400"><MapPin className="w-3.5 h-3.5 text-atelier-400" /> Location</span>
                    <span className="font-medium text-white">{project.location || 'Assigned'}</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-charcoal-800 text-charcoal-300">
                    <span className="flex items-center gap-1.5 text-charcoal-400"><Calendar className="w-3.5 h-3.5 text-atelier-400" /> Year</span>
                    <span className="font-medium text-white">{project.completionYear || 'Recent'}</span>
                  </div>
                  {project.areaSqFt && (
                    <div className="flex items-center justify-between py-1 border-b border-charcoal-800 text-charcoal-300">
                      <span className="flex items-center gap-1.5 text-charcoal-400"><Maximize2 className="w-3.5 h-3.5 text-atelier-400" /> Area</span>
                      <span className="font-medium text-white">{project.areaSqFt}</span>
                    </div>
                  )}
                  {project.budgetRange && (
                    <div className="flex items-center justify-between py-1 text-charcoal-300">
                      <span className="flex items-center gap-1.5 text-charcoal-400"><DollarSign className="w-3.5 h-3.5 text-atelier-400" /> Est. Budget</span>
                      <span className="font-medium text-atelier-300">{project.budgetRange}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Studio attribution */}
              {project.designer && (
                <div className="p-3.5 rounded-2xl bg-charcoal-800/80 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-atelier-500/20 text-atelier-300 flex items-center justify-center font-bold text-sm">
                    🏛️
                  </div>
                  <div>
                    <p className="text-[11px] text-charcoal-400 uppercase">Designed by</p>
                    <p className="text-xs font-semibold text-white">{project.designer.studioName}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-6">
              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-charcoal-800 hover:bg-charcoal-700 text-xs font-medium text-white transition-colors"
              >
                Close Project Showcase
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
