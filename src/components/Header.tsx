import React from 'react';
import { 
  FileText, 
  Eye, 
  Layers,
  Columns
} from 'lucide-react';
import { ServicePlanDocument } from '../types';

interface HeaderProps {
  document: ServicePlanDocument;
  currentScreen: 1 | 2 | 'screen1' | 'screen2';
  onSwitchScreen?: (screen: 1 | 2) => void;
  setCurrentScreen?: (screen: 'screen1' | 'screen2') => void;
  viewMode: 'single_block' | 'full_pdf' | 'split';
  onSetViewMode?: (mode: 'single_block' | 'full_pdf' | 'split') => void;
  setViewMode?: (mode: 'single_block' | 'full_pdf' | 'split') => void;
  onOpenExport?: () => void;
  onOpenExportModal?: () => void;
  onPrint?: () => void;
  onQuickPrint?: () => void;
  onSelectPreset?: (presetKey: string) => void;
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
}) => {
  const isScreen1 = currentScreen === 1 || currentScreen === 'screen1';
  const isScreen2 = currentScreen === 2 || currentScreen === 'screen2';

  const handleScreenChange = (screenNum: 1 | 2) => {
    if (onSwitchScreen) onSwitchScreen(screenNum);
    if (setCurrentScreen) setCurrentScreen(screenNum === 1 ? 'screen1' : 'screen2');
  };

  const handleViewModeChange = (mode: 'single_block' | 'full_pdf' | 'split') => {
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
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePreviewClick}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 rounded-md text-xs font-semibold shadow-2xs transition-colors cursor-pointer active:scale-98"
              title="Preview entire document"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>
            <button
              type="button"
              onClick={() => handleScreenChange(2)}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-md text-xs font-semibold shadow-xs transition-colors active:scale-98 cursor-pointer"
            >
              <span>Launch Visual Editor</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};


