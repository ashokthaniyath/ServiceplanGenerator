import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  FileText, 
  Eye,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Check,
  Sparkles,
  Loader2,
  FileCheck
} from 'lucide-react';
import { ServicePlanDocument } from '../types';
import { DocumentPDFView } from './DocumentPDFView';
import { exportDocumentToDocx } from '../utils/docxExport';

interface PDFExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: ServicePlanDocument;
  setDocument: React.Dispatch<React.SetStateAction<ServicePlanDocument>>;
  onExecutePrint: () => void;
}

export const PDFExportModal: React.FC<PDFExportModalProps> = ({
  isOpen,
  onClose,
  document,
  setDocument,
  onExecutePrint,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isExportingDocx, setIsExportingDocx] = useState<boolean>(false);
  const [docxExportSuccess, setDocxExportSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleDownloadDocx = async () => {
    try {
      setIsExportingDocx(true);
      await exportDocumentToDocx(document);
      setDocxExportSuccess(true);
      setTimeout(() => setDocxExportSuccess(false), 3000);
    } catch (err) {
      console.error('Error generating DOCX:', err);
    } finally {
      setIsExportingDocx(false);
    }
  };

  const handleDownloadPdf = () => {
    onClose();
    onExecutePrint();
  };

  const enabledSectionsCount = document.blocks.filter(b => b.enabled).length;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Top Navigation & Download Bar */}
      <header className="h-16 bg-white border-b border-gray-200 px-4 sm:px-6 flex items-center justify-between shrink-0 z-10 shadow-sm">
        {/* Left: Document Info */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2 bg-blue-50 text-blue-700 rounded-lg border border-blue-100 shrink-0">
            <Eye className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-gray-900 truncate">
                Document Preview & Download
              </h2>
              <span className="text-[10px] font-mono font-semibold bg-gray-100 text-gray-700 px-2 py-0.5 rounded border border-gray-200 uppercase">
                {document.category}
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono font-semibold bg-blue-50 text-blue-800 px-2 py-0.5 rounded border border-blue-200">
                A4 (210×297 mm) • 1″ Margins
              </span>
            </div>
            <p className="text-xs text-gray-500 truncate">
              {document.productName} • {document.modelCode} • {enabledSectionsCount} Active Sections
            </p>
          </div>
        </div>

        {/* Center: Zoom Controls */}
        <div className="hidden md:flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200">
          <button
            type="button"
            onClick={() => setZoomLevel(prev => Math.max(0.6, prev - 0.1))}
            className="p-1 text-gray-600 hover:text-gray-900 rounded hover:bg-gray-200 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="font-mono text-xs font-bold text-gray-700 w-12 text-center select-none">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            type="button"
            onClick={() => setZoomLevel(prev => Math.min(1.4, prev + 0.1))}
            className="p-1 text-gray-600 hover:text-gray-900 rounded hover:bg-gray-200 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <div className="h-4 w-px bg-gray-300 mx-1" />
          <button
            type="button"
            onClick={() => setZoomLevel(0.95)}
            className="p-1 text-gray-500 hover:text-gray-900 rounded hover:bg-gray-200 transition-colors"
            title="Reset Zoom"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right: Allowed Download Formats (DOCX, then PDF) + Close */}
        <div className="flex items-center gap-2.5">
          {/* Format 1: DOCX Download */}
          <button
            type="button"
            onClick={handleDownloadDocx}
            disabled={isExportingDocx}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg shadow-sm transition-all cursor-pointer active:scale-98 ${
              docxExportSuccess
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-[#2B579A] hover:bg-[#1E3E6E] text-white border border-[#1E3E6E]'
            }`}
            title="Download formatted Word Document (.docx)"
          >
            {isExportingDocx ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : docxExportSuccess ? (
              <FileCheck className="w-4 h-4" />
            ) : (
              <FileText className="w-4 h-4" />
            )}
            <span className="whitespace-nowrap">
              {isExportingDocx ? 'Generating DOCX...' : docxExportSuccess ? 'DOCX Downloaded!' : 'Download DOCX'}
            </span>
          </button>

          {/* Format 2: PDF Download */}
          <button
            type="button"
            onClick={handleDownloadPdf}
            className="flex items-center gap-2 px-3.5 py-2 bg-black hover:bg-gray-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-all cursor-pointer active:scale-98"
            title="Print or Save Document as PDF (.pdf)"
          >
            <Printer className="w-4 h-4" />
            <span className="whitespace-nowrap">Download PDF</span>
          </button>

          <div className="h-5 w-px bg-gray-200 mx-1 hidden sm:block" />

          {/* Close Modal */}
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            title="Close Preview (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Preview Container */}
      <main className="flex-1 overflow-y-auto bg-gray-50 flex justify-center p-0 sm:p-4">
        <div className="w-full max-w-4xl flex justify-center pb-8">
          <DocumentPDFView
            document={document}
            scale={zoomLevel}
            isSingleBlockPreview={false}
          />
        </div>
      </main>

      {/* Floating Bottom Quick Download Bar on mobile */}
      <footer className="md:hidden h-14 bg-white border-t border-gray-200 px-4 flex items-center justify-between gap-2 shrink-0">
        <button
          type="button"
          onClick={handleDownloadDocx}
          disabled={isExportingDocx}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-[#2B579A] text-white text-xs font-semibold rounded-md shadow-xs"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>DOCX</span>
        </button>
        <button
          type="button"
          onClick={handleDownloadPdf}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-black text-white text-xs font-semibold rounded-md shadow-xs"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>PDF</span>
        </button>
      </footer>
    </div>
  );
};

