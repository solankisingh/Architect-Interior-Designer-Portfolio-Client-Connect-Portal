import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Calculator, ArrowRight, DollarSign, Sparkles, Building, Sliders, CheckCircle } from 'lucide-react';

export default function BudgetEstimatorModal({ isOpen, onClose }) {
  const navigate = useNavigate();

  const [projectType, setProjectType] = useState('villa');
  const [areaSqFt, setAreaSqFt] = useState(3500);
  const [finishTier, setFinishTier] = useState('luxury');
  const [includeLandscape, setIncludeLandscape] = useState(true);

  if (!isOpen) return null;

  // Rate calculations (rates per sq ft for design & execution estimation)
  const baseRates = {
    apartment: { standard: 65, luxury: 110, bespoke: 180 },
    villa: { standard: 85, luxury: 140, bespoke: 220 },
    penthouse: { standard: 95, luxury: 160, bespoke: 250 },
    commercial: { standard: 50, luxury: 90, bespoke: 150 }
  };

  const selectedRate = baseRates[projectType]?.[finishTier] || 120;
  const designFeeRate = finishTier === 'bespoke' ? 0.12 : (finishTier === 'luxury' ? 0.09 : 0.07);

  const baseTotal = areaSqFt * selectedRate;
  const landscapeAddon = includeLandscape ? baseTotal * 0.10 : 0;
  const estimatedExecutionTotal = baseTotal + landscapeAddon;
  const estimatedDesignConsultingFee = Math.round(estimatedExecutionTotal * designFeeRate);

  const formatCurrency = (val) => {
    return '$' + Math.round(val).toLocaleString();
  };

  const getRecommendedBudgetTier = () => {
    if (estimatedExecutionTotal < 50000) return '$';
    if (estimatedExecutionTotal < 150000) return '$$';
    if (estimatedExecutionTotal < 350000) return '$$$';
    return '$$$$';
  };

  const handleFindStudios = () => {
    const tier = getRecommendedBudgetTier();
    onClose();
    navigate(`/designers?budget=${encodeURIComponent(tier)}`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-charcoal-950/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="relative bg-[#FBF9F5] rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-atelier-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-charcoal-400 hover:text-charcoal-800 p-2 rounded-full hover:bg-atelier-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <span className="text-xs uppercase tracking-widest text-atelier-700 font-semibold block mb-1 flex items-center gap-1.5">
            <Calculator className="w-4 h-4 text-atelier-600" />
            Architectural Cost Estimator
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-950">
            Estimate Project Budget
          </h3>
          <p className="text-xs text-charcoal-500 mt-1">
            Calculate estimated design consulting fees and execution budgets based on scale and materiality.
          </p>
        </div>

        <div className="space-y-5">
          {/* Project Type */}
          <div>
            <label className="block text-xs font-semibold text-charcoal-700 mb-1.5">
              Project Topology
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'apartment', label: 'Apartment', icon: '🏢' },
                { id: 'villa', label: 'Bespoke Villa', icon: '🏡' },
                { id: 'penthouse', label: 'Penthouse', icon: '🏙️' },
                { id: 'commercial', label: 'Workspace', icon: '🏬' }
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setProjectType(t.id)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all ${
                    projectType === t.id
                      ? 'border-atelier-600 bg-atelier-100/70 text-charcoal-950 shadow-sm'
                      : 'border-atelier-200 bg-white text-charcoal-600 hover:bg-atelier-50'
                  }`}
                >
                  <div className="text-lg mb-0.5">{t.icon}</div>
                  <div>{t.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Area Slider */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-charcoal-700">
                Built-Up Floor Area
              </label>
              <span className="text-xs font-bold text-atelier-800 bg-atelier-100 px-2.5 py-0.5 rounded-md">
                {areaSqFt.toLocaleString()} sq ft
              </span>
            </div>
            <input
              type="range"
              min="800"
              max="15000"
              step="100"
              value={areaSqFt}
              onChange={(e) => setAreaSqFt(parseInt(e.target.value, 10))}
              className="w-full accent-atelier-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-charcoal-400 mt-1">
              <span>800 sq ft</span>
              <span>5,000 sq ft</span>
              <span>10,000 sq ft</span>
              <span>15,000+ sq ft</span>
            </div>
          </div>

          {/* Quality Tier */}
          <div>
            <label className="block text-xs font-semibold text-charcoal-700 mb-1.5">
              Materiality & Finish Tier
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'standard', name: 'Standard Modern', desc: 'Engineered oak, clean finishes' },
                { id: 'luxury', name: 'Luxury Contemporary', desc: 'Italian marble, custom joinery' },
                { id: 'bespoke', name: 'Ultra-High-End', desc: 'Bespoke stone, imported fixtures' }
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFinishTier(f.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    finishTier === f.id
                      ? 'border-atelier-600 bg-atelier-50 text-charcoal-950 ring-1 ring-atelier-400'
                      : 'border-atelier-200 bg-white text-charcoal-600 hover:bg-atelier-50'
                  }`}
                >
                  <p className="text-xs font-bold">{f.name}</p>
                  <p className="text-[10px] text-charcoal-400 mt-0.5">{f.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Add-on toggle */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="landscape"
              checked={includeLandscape}
              onChange={(e) => setIncludeLandscape(e.target.checked)}
              className="rounded border-atelier-300 text-atelier-600"
            />
            <label htmlFor="landscape" className="text-xs text-charcoal-700 cursor-pointer">
              Include Landscape, Courtyards & Outdoor Living spaces (+10%)
            </label>
          </div>

          {/* Estimated Results Card */}
          <div className="p-5 rounded-2xl bg-charcoal-900 text-white shadow-lg space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-charcoal-800">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-atelier-300 font-semibold block">
                  Est. Architectural Design Fee (COA Guidelines)
                </span>
                <p className="font-serif text-2xl font-bold text-white">
                  {formatCurrency(estimatedDesignConsultingFee)}
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-atelier-800 text-atelier-200 text-xs font-bold uppercase tracking-wider">
                {getRecommendedBudgetTier()} Tier Studios
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-charcoal-300">
              <span>Estimated Total Project Turnkey Execution:</span>
              <span className="font-bold text-white text-sm">
                {formatCurrency(estimatedExecutionTotal * 0.9)} - {formatCurrency(estimatedExecutionTotal * 1.15)}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="text-xs text-charcoal-500 hover:text-charcoal-800 font-medium"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleFindStudios}
              className="px-6 py-3 rounded-xl bg-charcoal-900 hover:bg-charcoal-800 text-atelier-100 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 shadow-md transition-all"
            >
              <span>Explore {getRecommendedBudgetTier()} Tier Studios</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

