import React, { useState, useMemo, useEffect } from 'react';
import { DEFAULT_BOAT_AIRDOPES_800D } from './data/defaultPlans';
import { ServicePlanDocument } from './types';
import { Header } from './components/Header';
import { Screen1Setup } from './components/Screen1Setup';
import { Screen2Editor } from './components/Screen2Editor';
import { PDFExportModal } from './components/PDFExportModal';

const SAVED_DOC_KEY = 'spg-saved-document';

function loadSavedDocument(): ServicePlanDocument | null {
  try {
    const raw = localStorage.getItem(SAVED_DOC_KEY);
    return raw ? (JSON.parse(raw) as ServicePlanDocument) : null;
  } catch {
    return null;
  }
}

export default function App() {
  // Main workflow screen: 1 (Setup & Block Picker) | 2 (3-Lane Visual Editor)
  const [currentScreen, setCurrentScreen] = useState<1 | 2>(1);

  // Central Document State — restored from last applied baseline when available
  const [document, setDocument] = useState<ServicePlanDocument>(() => loadSavedDocument() || DEFAULT_BOAT_AIRDOPES_800D);

  // Last applied baseline for unsaved-change detection
  const [savedDocument, setSavedDocument] = useState<ServicePlanDocument>(() => loadSavedDocument() || DEFAULT_BOAT_AIRDOPES_800D);

  const isDirty = useMemo(
    () => JSON.stringify(document) !== JSON.stringify(savedDocument),
    [document, savedDocument]
  );

  const handleApplyChanges = () => {
    setSavedDocument(document);
    try {
      localStorage.setItem(SAVED_DOC_KEY, JSON.stringify(document));
    } catch (e) {
      console.warn('Could not persist document baseline:', e);
    }
  };

  const handleDiscardChanges = () => {
    if (!window.confirm('Discard all unsaved changes and revert to the last applied state?')) return;
    setDocument(JSON.parse(JSON.stringify(savedDocument)));
  };

  // Warn before closing the tab with unsaved changes
  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [isDirty]);

  // Active Block ID in Visual Editor
  const [activeBlockId, setActiveBlockId] = useState<string>(DEFAULT_BOAT_AIRDOPES_800D.blocks[0].id);

  // View Mode for Lane 2: Single Block Editor is the default main canvas mode
  const [viewMode, setViewMode] = useState<'single_block' | 'full_pdf'>('single_block');

  // Modals state
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

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
        isDirty={isDirty}
        onApplyChanges={handleApplyChanges}
        onDiscardChanges={handleDiscardChanges}
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
