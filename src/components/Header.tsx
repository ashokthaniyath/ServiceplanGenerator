import React from 'react';
import { 
  FileText, 
  Eye, 
  Layers,
  Columns,
  Check,
  Undo2,
  RotateCcw
} from 'lucide-react';
import { ServicePlanDocument } from '../types';

interface HeaderProps {
  document: ServicePlanDocument;
  currentScreen: 1 | 2 | 'screen1' | 'screen2';
  onSwitchScreen?: (screen: 1 | 2) => void;
  setCurrentScreen?: (screen: 'screen1' | 'screen2') => void;
  viewMode: 'single_block' | 'full_pdf';
  onSetViewMode?: (mode: 'single_block' | 'full_pdf') => void;
  setViewMode?: (mode: 'single_block' | 'full_pdf') => void;
  onOpenExport?: () => void;
  onOpenExportModal?: () => void;
  onPrint?: () => void;
  onQuickPrint?: () => void;
  isDirty?: boolean;
  onApplyChanges?: () => void;
  onDiscardChanges?: () => void;
  canUndo?: boolean;
  onUndo?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  document,
  currentScreen,
  onSwitchScreen,
  setCurrentScreen,
  viewMode,
  onSetViewMode,
  setViewMode,
  onOpenExport,
  onOpenExportModal,
  onPrint,
  onQuickPrint,
  isDirty = false,
  onApplyChanges,
  onDiscardChanges,
  canUndo = false,
  onUndo,
}) => {
  const isScreen1 = currentScreen === 1 || currentScreen === 'screen1';
  const isScreen2 = currentScreen === 2 || currentScreen === 'screen2';

  const handleScreenChange = (screenNum: 1 | 2) => {
    if (onSwitchScreen) onSwitchScreen(screenNum);
    if (setCurrentScreen) setCurrentScreen(screenNum === 1 ? 'screen1' : 'screen2');
  };

  const handleViewModeChange = (mode: 'single_block' | 'full_pdf') => {
    if (onSetViewMode) onSetViewMode(mode);
    if (setViewMode) setViewMode(mode);
  };

  const handlePreviewClick = () => {
    if (onOpenExport) onOpenExport();
    else if (onOpenExportModal) onOpenExportModal();
  };

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between px-4 sm:px-6 py-3.5 bg-white border-b border-blue-100 shrink-0">
      {/* Brand & Product Info */}
      <div className="flex items-center gap-3.5">
        <div className="bg-blue-700 text-white p-2 rounded-lg shadow-xs flex items-center justify-center">
          <FileText className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-semibold text-gray-900 tracking-tight">
              Service Plan Generator
            </h1>
            <span className="text-[10px] bg-blue-700 text-white px-1.5 py-0.2 rounded font-mono font-medium uppercase tracking-wider">
              {document.category}
            </span>
            <span className="text-[10px] bg-blue-50 text-blue-800 border border-blue-200 px-1.5 py-0.2 rounded font-mono font-bold uppercase tracking-wider">
              {document.deviceType}
            </span>
          </div>
          <p className="text-xs text-gray-500 font-normal truncate max-w-[280px]">
            {document.productName} • {document.modelCode}
          </p>
        </div>
      </div>

      {/* Center: Screen Tabs & Editor Mode Tabs */}
      <div className="flex items-center gap-3">
        {/* Screen Switcher Pills */}
        <div className="flex bg-[#F3F4F6] rounded-full p-1 border border-[#E5E7EB]">
          <button
            onClick={() => handleScreenChange(1)}
            className={`px-3.5 py-1 text-xs font-medium rounded-full transition-all cursor-pointer ${
              isScreen1
                ? 'bg-white text-gray-900 shadow-sm font-semibold'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            1. Setup
          </button>
          <button
            onClick={() => handleScreenChange(2)}
            className={`px-3.5 py-1 text-xs font-medium rounded-full transition-all cursor-pointer ${
              isScreen2
                ? 'bg-white text-gray-900 shadow-sm font-semibold'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            2. Visual Editor
          </button>
        </div>

        {/* Mode toggle moved to the Visual Editor canvas toolbar */}
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2.5">
        {onUndo && (
          <button
            type="button"
            onClick={onUndo}
            disabled={!canUndo}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 text-[11px] font-bold rounded-md shadow-2xs transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            title="Undo the last change"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Undo</span>
          </button>
        )}

        {isDirty && (
          <div className="flex items-center gap-1.5 pr-1.5 border-r border-gray-200">
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-700">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="hidden sm:inline">Unsaved changes</span>
            </span>
            <button
              type="button"
              onClick={onApplyChanges}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-md shadow-2xs transition-colors cursor-pointer"
              title="Apply and persist all pending changes"
            >
              <Check className="w-3 h-3" />
              <span>Apply</span>
            </button>
            <button
              type="button"
              onClick={onDiscardChanges}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 text-[11px] font-bold rounded-md shadow-2xs transition-colors cursor-pointer"
              title="Discard pending changes and revert to last applied state"
            >
              <Undo2 className="w-3 h-3" />
              <span>Discard</span>
            </button>
          </div>
        )}

        {isScreen2 && (
          <>
            {/* Primary Action: Preview & Download Button */}
            <button
              onClick={handlePreviewClick}
              className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white text-xs font-semibold rounded-md hover:bg-blue-800 transition-all shadow-xs active:scale-98 cursor-pointer"
              title="Preview entire document before downloading in DOCX or PDF format"
            >
              <Eye className="w-4 h-4" />
              <span>Preview & Download</span>
            </button>
          </>
        )}

        {isScreen1 && (
          <button
            type="button"
            onClick={handlePreviewClick}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 rounded-md text-xs font-semibold shadow-2xs transition-colors cursor-pointer active:scale-98"
            title="Preview entire document"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview</span>
          </button>
        )}
      </div>
    </header>
  );
};


