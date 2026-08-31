import React, { useState } from 'react';
import { 
  DEFAULT_BOAT_AIRDOPES_800D, 
  AUDIO_PRODUCT_PRESETS 
} from './data/defaultPlans';
import { ServicePlanDocument } from './types';
import { Header } from './components/Header';
import { Screen1Setup } from './components/Screen1Setup';
import { Screen2Editor } from './components/Screen2Editor';
import { PDFExportModal } from './components/PDFExportModal';

export default function App() {
  // Main workflow screen: 1 (Setup & Block Picker) | 2 (3-Lane Visual Editor)
  const [currentScreen, setCurrentScreen] = useState<1 | 2>(1);

  // Central Document State
  const [document, setDocument] = useState<ServicePlanDocument>(DEFAULT_BOAT_AIRDOPES_800D);

  // Active Block ID in Visual Editor
  const [activeBlockId, setActiveBlockId] = useState<string>(DEFAULT_BOAT_AIRDOPES_800D.blocks[0].id);

  // View Mode for Lane 2: Single Block Editor is the default main canvas mode
  const [viewMode, setViewMode] = useState<'single_block' | 'full_pdf'>('single_block');

  // Modals state
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Handle Preset Selection
  const handleSelectPreset = (presetKey: string) => {
    const selected = AUDIO_PRODUCT_PRESETS[presetKey];
    if (selected) {
      setDocument(JSON.parse(JSON.stringify(selected)));
      setActiveBlockId(selected.blocks[0]?.id || '');
    }
  };

  // Run Grammar & Quality Audit using Gemini Endpoint
  // Execute native print — filename nomenclature: "{Product Name} - {SDK|Non-SDK}"
  const handleExecutePrint = () => {
    window.document.title = `${document.productName} - ${document.deviceType}`;
    // Switch temporarily to full_pdf view so print prints the full document
    setViewMode('full_pdf');
    setTimeout(() => {
      window.print();
    }, 250);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white antialiased font-sans select-none">
      {/* Top Application Header */}
      <Header
        document={document}
        currentScreen={currentScreen}
        onSwitchScreen={setCurrentScreen}
        viewMode={viewMode}
        onSetViewMode={setViewMode}
        onOpenExport={() => setIsExportModalOpen(true)}
        onPrint={handleExecutePrint}
        onSelectPreset={handleSelectPreset}
      />

      {/* Screen 1 vs Screen 2 Layouts */}
      {currentScreen === 1 ? (
        <Screen1Setup
          document={document}
          setDocument={setDocument}
          onProceedToEditor={() => {
            setCurrentScreen(2);
            // set active block to first enabled block
            const firstEnabled = document.blocks.find(b => b.enabled) || document.blocks[0];
            if (firstEnabled) setActiveBlockId(firstEnabled.id);
          }}
          onSelectPreset={handleSelectPreset}
        />
      ) : (
        <Screen2Editor
          document={document}
          setDocument={setDocument}
          viewMode={viewMode}
          setViewMode={setViewMode}
          activeBlockId={activeBlockId}
          setActiveBlockId={setActiveBlockId}
        />
      )}

      {/* Global PDF Export & Download Modal */}
      <PDFExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        document={document}
        setDocument={setDocument}
      />
    </div>
  );
}
