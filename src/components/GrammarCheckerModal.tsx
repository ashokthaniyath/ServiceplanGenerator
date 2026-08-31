import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Check, 
  CheckCheck, 
  AlertCircle, 
  BookCheck, 
  RotateCw, 
  Zap, 
  FileText, 
  ChevronRight,
  Sliders
} from 'lucide-react';
import { GrammarIssue, ServicePlanDocument } from '../types';
import { AutoResizeTextarea } from './AutoResizeTextarea';

interface GrammarCheckerModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: ServicePlanDocument;
  setDocument: React.Dispatch<React.SetStateAction<ServicePlanDocument>>;
  grammarIssues: GrammarIssue[];
  setGrammarIssues: React.Dispatch<React.SetStateAction<GrammarIssue[]>>;
  isScanning: boolean;
  onRunScan: () => void;
}

export const GrammarCheckerModal: React.FC<GrammarCheckerModalProps> = ({
  isOpen,
  onClose,
  document,
  setDocument,
  grammarIssues,
  setGrammarIssues,
  isScanning,
  onRunScan,
}) => {
  const [activeTab, setActiveTab] = useState<'issues' | 'tone_transformer'>('issues');
  const [toneInputText, setToneInputText] = useState('');
  const [selectedTone, setSelectedTone] = useState<'technical_sop' | 'customer_facing' | 'executive_summary' | 'boat_brand'>('technical_sop');
  const [toneResult, setToneResult] = useState('');
  const [isPolishing, setIsPolishing] = useState(false);

  if (!isOpen) return null;

  const handleApplyFix = (issue: GrammarIssue) => {
    // Apply fix across document blocks
    setDocument(prev => {
      const updatedBlocks = prev.blocks.map(block => {
        if (block.id !== issue.blockId) return block;

        const stringified = JSON.stringify(block.content);
        // Replace exact instance of originalText with suggestedText
        if (stringified.includes(issue.originalText)) {
          const replaced = stringified.replace(issue.originalText, issue.suggestedText);
          try {
            return {
              ...block,
              content: JSON.parse(replaced),
            };
          } catch {
            return block;
          }
        }
        return block;
      });

      return {
        ...prev,
        blocks: updatedBlocks,
      };
    });

    // Mark as applied
    setGrammarIssues(prev =>
      prev.map(i => (i.id === issue.id ? { ...i, applied: true } : i))
    );
  };

  const handleApplyAllFixes = () => {
    const unapplied = grammarIssues.filter(i => !i.applied);
    unapplied.forEach(issue => handleApplyFix(issue));
  };

  const handleTransformTone = async () => {
    if (!toneInputText.trim()) return;
    setIsPolishing(true);
    try {
      const res = await fetch('/api/gemini/polish-tone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: toneInputText,
          targetTone: selectedTone,
          context: `Audio Service Plan for ${document.productName} (${document.category})`,
        }),
      });
      const data = await res.json();
      setToneResult(data.polishedText || toneInputText);
    } catch (err) {
      console.error('Tone polish error:', err);
    } finally {
      setIsPolishing(false);
    }
  };

  const unresolved = grammarIssues.filter(i => !i.applied);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-xl max-w-3xl w-full p-6 shadow-xl border border-[#E5E7EB] space-y-5 max-h-[90vh] flex flex-col text-[#111827]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-md bg-gray-100 text-gray-900 border border-gray-200">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Grammar & Technical Quality Checker</h3>
              <p className="text-xs text-gray-500">
                Audits spelling, technical vocabulary ('boAt', 'Bluetooth', 'IWP™'), and SOP formatting
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-2">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('issues')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeTab === 'issues'
                  ? 'bg-black text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Detected Recommendations ({unresolved.length})
            </button>
            <button
              onClick={() => setActiveTab('tone_transformer')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeTab === 'tone_transformer'
                  ? 'bg-black text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              AI Tone & SOP Transformer
            </button>
          </div>

          {activeTab === 'issues' && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onRunScan}
                disabled={isScanning}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                <RotateCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
                <span>Re-scan Document</span>
              </button>

              {unresolved.length > 0 && (
                <button
                  type="button"
                  onClick={handleApplyAllFixes}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-black hover:bg-gray-800 rounded-md shadow-xs transition-colors"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Accept All ({unresolved.length})</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Tab 1: Issues List */}
        {activeTab === 'issues' && (
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {isScanning ? (
              <div className="py-12 text-center space-y-3">
                <RotateCw className="w-6 h-6 text-black animate-spin mx-auto" />
                <p className="text-sm font-semibold text-gray-900">Scanning all service plan sections with Gemini AI...</p>
                <p className="text-xs text-gray-500">Verifying audio terminology, trademark casing, and SOP grammar</p>
              </div>
            ) : grammarIssues.length === 0 ? (
              <div className="py-12 text-center space-y-3 bg-gray-50 rounded-lg border border-gray-200">
                <BookCheck className="w-8 h-8 text-black mx-auto" />
                <h4 className="font-bold text-gray-900 text-sm">All Clean! No Grammar or Terminology Issues</h4>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Your audio service plan meets strict technical writing standards, trademark formats, and procedural guidelines.
                </p>
                <button
                  onClick={onRunScan}
                  className="mt-2 px-3 py-1.5 text-xs font-semibold text-gray-900 bg-white border border-gray-300 hover:bg-gray-50 rounded-md"
                >
                  Trigger Fresh Scan
                </button>
              </div>
            ) : (
              grammarIssues.map(issue => (
                <div
                  key={issue.id}
                  className={`p-3.5 rounded-lg border transition-all ${
                    issue.applied
                      ? 'bg-gray-50/60 border-gray-200 opacity-60'
                      : 'bg-white border-gray-200 shadow-2xs hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-1.5 py-0.2 text-[9px] font-bold rounded uppercase tracking-wider ${
                            issue.type === 'spelling'
                              ? 'bg-red-100 text-red-700'
                              : issue.type === 'technical_tone'
                              ? 'bg-blue-100 text-blue-700'
                              : issue.type === 'grammar'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {issue.type.replace('_', ' ')}
                        </span>
                        <span className="text-xs font-semibold text-gray-500">
                          {issue.blockTitle}
                        </span>
                      </div>

                      {/* Diff view */}
                      <div className="flex flex-wrap items-center gap-2 text-xs pt-1">
                        <span className="line-through text-red-600 bg-red-50 px-2 py-0.5 rounded font-mono">
                          {issue.originalText}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                        <span className="font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded font-mono">
                          {issue.suggestedText}
                        </span>
                      </div>

                      <p className="text-xs text-gray-600 pt-0.5">{issue.explanation}</p>
                    </div>

                    <div>
                      {issue.applied ? (
                        <span className="flex items-center gap-1 text-xs font-bold text-green-700 px-2.5 py-1 bg-green-50 rounded-md">
                          <Check className="w-3.5 h-3.5" /> Applied
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleApplyFix(issue)}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-black hover:bg-gray-800 rounded-md shadow-xs transition-all active:scale-98"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Accept Fix</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: AI Tone & SOP Transformer */}
        {activeTab === 'tone_transformer' && (
          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Select Desired Audio Documentation Tone
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'technical_sop', label: 'Technical SOP', desc: 'Strict, imperative procedural phrasing for service technicians' },
                  { id: 'customer_facing', label: 'Customer Friendly', desc: 'Polite, clear troubleshooting guidance for end-users' },
                  { id: 'boat_brand', label: 'boAt Brand Tone', desc: 'Lifestyle energetic sound staging with official trademark tags' },
                  { id: 'executive_summary', label: 'Executive Brief', desc: 'High-level concise hardware & battery summary' },
                ].map(t => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSelectedTone(t.id as any)}
                    className={`p-2.5 rounded-lg border text-left text-xs transition-all ${
                      selectedTone === t.id
                        ? 'bg-gray-100 border-black ring-1 ring-black text-gray-900 font-bold'
                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <p className="font-bold">{t.label}</p>
                    <p className="text-[10px] text-gray-500 font-normal line-clamp-1">{t.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Text to Transform / Rephrase</label>
              <AutoResizeTextarea
                minRows={4}
                value={toneInputText}
                onChange={e => setToneInputText(e.target.value)}
                placeholder="Paste any section text, troubleshooting step, or spec description here..."
                className="w-full p-3 text-xs rounded-md border border-gray-200 focus:ring-1 focus:ring-black focus:border-black focus:outline-none"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleTransformTone}
                disabled={isPolishing || !toneInputText.trim()}
                className="flex items-center gap-1.5 px-4 py-2 bg-black hover:bg-gray-800 disabled:bg-gray-300 text-white rounded-md text-xs font-semibold shadow-xs"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isPolishing ? 'animate-spin' : ''}`} />
                <span>{isPolishing ? 'Transforming with AI...' : 'Transform Tone'}</span>
              </button>
            </div>

            {toneResult && (
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-900 uppercase">Polished Output</span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(toneResult);
                    }}
                    className="text-[11px] font-semibold text-gray-700 hover:text-black underline"
                  >
                    Copy Text
                  </button>
                </div>
                <p className="text-xs text-gray-800 leading-relaxed font-medium bg-white p-3 rounded-md border border-gray-200">
                  {toneResult}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-end pt-3 border-t border-[#E5E7EB]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
