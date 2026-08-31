import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { ServicePlanBlock } from '../types';
import { defaultMasterDocument } from '../data/defaultPlans';

interface AddBlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBlock: (newBlock: ServicePlanBlock) => void;
  nextSectionNumber: string;
}

// Master list of core service plan sections — identical to the Setup screen catalogue
const MASTER_SECTIONS: ServicePlanBlock[] = defaultMasterDocument.blocks;

export const AddBlockModal: React.FC<AddBlockModalProps> = ({
  isOpen,
  onClose,
  onAddBlock,
  nextSectionNumber,
}) => {
  const [selectedId, setSelectedId] = useState<string>(MASTER_SECTIONS[0].id);
  const [customTitle, setCustomTitle] = useState<string>(MASTER_SECTIONS[0].title);
  const [customSubtitle, setCustomSubtitle] = useState<string>(MASTER_SECTIONS[0].subtitle || '');

  if (!isOpen) return null;

  const selectedSection = MASTER_SECTIONS.find(s => s.id === selectedId) || MASTER_SECTIONS[0];

  const handleSelectSection = (section: ServicePlanBlock) => {
    setSelectedId(section.id);
    setCustomTitle(section.title);
    setCustomSubtitle(section.subtitle || '');
  };

  const handleConfirmAdd = () => {
    const clone: ServicePlanBlock = JSON.parse(JSON.stringify(selectedSection));
    const newBlock: ServicePlanBlock = {
      ...clone,
      id: `block-${Date.now()}`,
      sectionNumber: nextSectionNumber,
      title: customTitle,
      subtitle: customSubtitle,
      enabled: true,
    };

    onAddBlock(newBlock);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-xl border border-blue-100 space-y-5 max-h-[90vh] flex flex-col text-[#111827]">
        <div className="flex items-center justify-between border-b border-blue-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-gray-900">Add Service Plan Section</h3>
            <p className="text-xs text-gray-500">
              Select a section from the master list to insert as section § {nextSectionNumber}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Master Section List (same as Setup screen) */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          <div className="space-y-1.5 border border-gray-100 rounded-lg p-1.5 bg-gray-50/30">
            {MASTER_SECTIONS.map(section => {
              const isSelected = selectedId === section.id;
              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => handleSelectSection(section)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/70 ring-1 ring-blue-600/30 shadow-2xs'
                      : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/40'
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className={`text-xs font-mono font-bold shrink-0 ${isSelected ? 'text-blue-700' : 'text-gray-500'}`}>
                      § {section.sectionNumber}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs truncate ${isSelected ? 'font-bold text-blue-900' : 'font-semibold text-gray-900'}`}>
                        {section.title}
                      </p>
                      {section.subtitle && (
                        <p className="text-[11px] text-gray-400 truncate mt-0.5">{section.subtitle}</p>
                      )}
                    </div>
                  </div>
                  {isSelected && (
                    <span className="ml-2 px-2 py-0.5 bg-blue-700 text-white rounded text-[9px] font-bold uppercase tracking-wider shrink-0">
                      Selected
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Section Metadata Inputs */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
            <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wider">Customize Section Header</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Section Title</label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={e => setCustomTitle(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs font-medium rounded-md border border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Section Subtitle / Description</label>
                <input
                  type="text"
                  value={customSubtitle}
                  onChange={e => setCustomSubtitle(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-md border border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-blue-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirmAdd}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-md text-xs font-semibold shadow-xs active:scale-98 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Section</span>
          </button>
        </div>
      </div>
    </div>
  );
};
