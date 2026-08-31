import React, { useState } from 'react';
import { 
  ServicePlanDocument, 
  ServicePlanBlock, 
  SelectedDocElement,
  AnnexureItem
} from '../types';
import { EarbudsCaseMockup, HearablesAppScreenMockup } from './VisualMockups';
import { 
  FileText, 
  Layers, 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Sparkles,
  Printer
} from 'lucide-react';

interface DocumentPDFViewProps {
  document: ServicePlanDocument;
  activeBlockId?: string;
  isSingleBlockPreview?: boolean;
  scale?: number;
  hideLayoutControls?: boolean;
  selectedElement?: SelectedDocElement | null;
  onSelectDocElement?: (element: SelectedDocElement | null) => void;
}

export const DocumentPDFView: React.FC<DocumentPDFViewProps> = ({
  document,
  activeBlockId,
  isSingleBlockPreview = false,
  scale = 1,
  hideLayoutControls = false,
  selectedElement,
  onSelectDocElement,
}) => {
  const [pageLayoutMode, setPageLayoutMode] = useState<'paginated' | 'continuous'>('paginated');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = 18;

  // Split view hides the layout toolbar and always renders continuous flow
  const effectiveLayoutMode = hideLayoutControls ? 'continuous' : pageLayoutMode;

  const blocksToRender = isSingleBlockPreview && activeBlockId
    ? document.blocks.filter(b => b.id === activeBlockId && b.enabled)
    : document.blocks.filter(b => b.enabled);

  // Helper to check if field is selected
  const isSelected = (blockId: string, fieldId: string) => {
    return selectedElement?.blockId === blockId && selectedElement?.fieldId === fieldId;
  };

  // Helper to get clickable style class
  const getClickableClass = (blockId: string, fieldId: string, extraClasses = '') => {
    const selected = isSelected(blockId, fieldId);
    return `cursor-pointer transition-all duration-150 rounded px-1 py-0.5 -mx-1 -my-0.5 group relative hover:outline-dashed hover:outline-1 hover:outline-blue-500 ${
      selected ? 'ring-2 ring-blue-600 bg-blue-50/80 shadow-xs z-20' : ''
    } ${extraClasses}`;
  };

  const handleElementClick = (
    e: React.MouseEvent,
    blockId: string,
    fieldId: string,
    elementType: SelectedDocElement['elementType'],
    label: string,
    text: string,
    extra?: Partial<SelectedDocElement>
  ) => {
    e.stopPropagation();
    if (!onSelectDocElement) return;

    onSelectDocElement({
      blockId,
      fieldId,
      elementType,
      label,
      text: text || '',
      isBold: extra?.isBold ?? false,
      textCase: extra?.textCase,
      isBullet: extra?.isBullet,
      imageUrl: extra?.imageUrl,
      itemId: extra?.itemId,
      subKey: extra?.subKey,
    });
  };

  // Resolve active accent color for any block or fallback to document theme
  const getBlockAccent = (blockId?: string): string => {
    if (blockId) {
      const b = document.blocks.find(blk => blk.id === blockId);
      if (b?.customization?.accentColor) return b.customization.accentColor;
    }
    return document.themeColor || '#1e40af';
  };

  // Helper to render custom content elements attached to any block
  const renderCustomContentElements = (block: ServicePlanBlock) => {
    const accent = getBlockAccent(block.id);
    if (!block.content.contentElements || block.content.contentElements.length === 0) return null;
    return (
      <div className="mt-3.5 space-y-3 pt-2 border-t border-dashed" style={{ borderColor: `${accent}40` }}>
        {block.content.contentElements.map(el => (
          <div key={el.id} className="text-xs">
            {el.type === 'heading' && (
              <h4 
                onClick={(e) => handleElementClick(e, block.id, `content-el-${el.id}`, 'heading', 'Heading Element', el.text, { isBold: el.isBold ?? true, textCase: el.textCase, itemId: el.id })}
                className={`text-xs tracking-wider border-l-2 pl-2 my-1.5 ${
                  el.textCase === 'uppercase' ? 'uppercase' : el.textCase === 'capitalize' ? 'capitalize' : ''
                } ${
                  el.isBold !== false ? 'font-bold' : 'font-semibold'
                } ${getClickableClass(block.id, `content-el-${el.id}`)}`}
                style={{ color: accent, borderLeftColor: accent }}
              >
                {el.text}
              </h4>
            )}

            {el.type === 'paragraph' && (
              <p 
                onClick={(e) => handleElementClick(e, block.id, `content-el-${el.id}`, 'paragraph', 'Paragraph Element', el.text, { isBold: el.isBold, textCase: el.textCase, itemId: el.id })}
                className={`text-slate-800 leading-relaxed whitespace-pre-line ${
                  el.textCase === 'uppercase' ? 'uppercase' : el.textCase === 'capitalize' ? 'capitalize' : ''
                } ${el.isBold ? 'font-bold' : ''} ${getClickableClass(block.id, `content-el-${el.id}`)}`}
              >
                {el.text}
              </p>
            )}

            {el.type === 'list' && (
              el.listType === 'numbered' ? (
                <ol 
                  onClick={(e) => handleElementClick(e, block.id, `content-el-${el.id}`, 'list', 'Numbered List Element', el.text, { isBold: el.isBold, listType: 'numbered', itemId: el.id })}
                  className={`space-y-1 pl-2 text-slate-800 list-decimal list-inside ${getClickableClass(block.id, `content-el-${el.id}`)}`}
                >
                  {(el.listItems || el.text.split('\n')).map((item, idx) => (
                    <li key={idx} className={el.isBold ? 'font-bold' : ''}>
                      <span>{item.replace(/^[\s•\-\*\d\.\)]+\s*/, '')}</span>
                    </li>
                  ))}
                </ol>
              ) : (
                <ul 
                  onClick={(e) => handleElementClick(e, block.id, `content-el-${el.id}`, 'list', 'List Element', el.text, { isBold: el.isBold, isBullet: true, listType: 'bullet', itemId: el.id })}
                  className={`space-y-1 pl-2 text-slate-800 ${getClickableClass(block.id, `content-el-${el.id}`)}`}
                >
                  {(el.listItems || el.text.split('\n')).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="font-bold" style={{ color: accent }}>•</span>
                      <span className={el.isBold ? 'font-bold' : ''}>{item.replace(/^[\s•\-\*]+\s*/, '')}</span>
                    </li>
                  ))}
                </ul>
              )
            )}

            {el.type === 'note' && (
              <div 
                onClick={(e) => handleElementClick(e, block.id, `content-el-${el.id}`, 'note', 'Note / Callout', el.text, { isBold: el.isBold, noteType: el.noteType, itemId: el.id })}
                className={`p-2.5 rounded-r-md text-xs border-l-4 ${getClickableClass(block.id, `content-el-${el.id}`)}`}
                style={{
                  borderLeftColor: accent,
                  backgroundColor: `${accent}0d`,
                  color: '#0f172a'
                }}
              >
                <p 
                  className="font-bold text-[10px] uppercase tracking-wider mb-0.5 flex items-center gap-1.5"
                  style={{ color: accent }}
                >
                  <span>
                    {el.noteType === 'danger' ? '🚨 Critical Safety Advisory' :
                     el.noteType === 'info' ? 'ℹ️ Service Information' :
                     el.noteType === 'success' ? '✅ Verification Standard' :
                     '⚠️ Service Technician Note'}
                  </span>
                </p>
                <p className={`leading-relaxed font-medium ${el.isBold ? 'font-bold' : ''}`}>{el.text}</p>
              </div>
            )}

            {el.type === 'table' && (
              <div 
                onClick={(e) => handleElementClick(e, block.id, `content-el-${el.id}`, 'table', el.text || 'Technical Matrix Table', el.text, { 
                  itemId: el.id,
                  tableColumns: el.tableColumns || ['Parameter', 'Specification Standard', 'Acceptance Value'],
                  tableRows: el.tableRows || [
                    { id: 'r1', 'col-0': 'Operating Voltage', 'col-1': '3.70V - 4.20V DC', 'col-2': 'Pass: 3.7V Nominal' },
                    { id: 'r2', 'col-0': 'Current Draw (Idle)', 'col-1': '< 15mA continuous', 'col-2': 'Pass: ≤ 18mA' },
                  ]
                })}
                className={`my-3 overflow-hidden rounded-lg ${block.customization?.tableBorder !== false ? 'border border-slate-300 shadow-2xs' : ''} ${getClickableClass(block.id, `content-el-${el.id}`)}`}
              >
                {el.text && (
                  <div className="bg-slate-800 text-white px-3 py-1.5 text-xs font-bold uppercase tracking-wider flex items-center justify-between">
                    <span className={`${el.isBold ? 'font-bold' : 'font-medium'} ${el.textCase === 'uppercase' ? 'uppercase' : el.textCase === 'capitalize' ? 'capitalize' : ''}`}>{el.text}</span>
                    <span className="text-[10px] font-mono text-slate-300 font-normal">Table Specification</span>
                  </div>
                )}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-300 text-slate-800">
                        {(el.tableColumns || ['Parameter', 'Specification Standard', 'Acceptance Value']).map((col, idx) => (
                          <th key={idx} className="p-2 font-bold text-[11px] uppercase tracking-wide border-r border-slate-200 last:border-r-0">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {(el.tableRows || [
                        { id: 'r1', 'col-0': 'Operating Voltage', 'col-1': '3.70V - 4.20V DC', 'col-2': 'Pass: 3.7V Nominal' },
                        { id: 'r2', 'col-0': 'Current Draw (Idle)', 'col-1': '< 15mA continuous', 'col-2': 'Pass: ≤ 18mA' },
                      ]).map((row, rIdx) => {
                        const cols = el.tableColumns || ['Parameter', 'Specification Standard', 'Acceptance Value'];
                        const isZebra = block.customization?.zebraStriping !== false && rIdx % 2 === 1;
                        return (
                          <tr 
                            key={row.id || rIdx} 
                            className={`border-b border-slate-200 last:border-b-0 hover:bg-blue-50/50 transition-colors ${
                              isZebra ? 'bg-slate-50/70' : 'bg-white'
                            }`}
                          >
                            {cols.map((col, cIdx) => (
                              <td key={cIdx} className="p-2 text-slate-700 font-medium border-r border-slate-200 last:border-r-0">
                                {row[`col-${cIdx}`] || (row as any)[col] || '-'}
                              </td>
                            ))}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {el.type === 'image' && (
              <div 
                onClick={(e) => handleElementClick(e, block.id, `content-el-${el.id}`, 'image', 'Image / Diagram', el.text, { imageUrl: el.imageUrl, imageCaption: el.imageCaption, itemId: el.id })}
                className={`my-2 space-y-1 ${getClickableClass(block.id, `content-el-${el.id}`)}`}
              >
                {el.imageUrl && (
                  <div className="border border-slate-300 rounded overflow-hidden bg-slate-50 flex items-center justify-center p-2">
                    <img
                      src={el.imageUrl}
                      alt={el.imageCaption || el.text || 'Service Schematic'}
                      className="max-h-56 object-contain rounded"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}
                {(el.imageCaption || el.text) && (
                  <p className="text-[10px] text-slate-600 italic text-center font-medium">
                    {el.imageCaption || `Fig: ${el.text}`}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Find blocks by ID for discrete page views
  const bHeader = document.blocks.find(b => b.type === 'header_overview') || document.blocks[0];
  const bDefinitions = document.blocks.find(b => b.type === 'technical_definitions') || document.blocks[1];
  const bSpecs = document.blocks.find(b => b.type === 'specifications_table') || document.blocks[2];
  const bPackaging = document.blocks.find(b => b.type === 'packaging_contents') || document.blocks[3];
  const bVariants = document.blocks.find(b => b.type === 'colour_variants') || document.blocks[4];
  const bFunctionalities = document.blocks.find(b => b.type === 'product_functionalities') || document.blocks[5];
  const bLed = document.blocks.find(b => b.type === 'led_indications') || document.blocks[6];
  const bCharging = document.blocks.find(b => b.type === 'charging_guidelines') || document.blocks[7];
  const bWeight = document.blocks.find(b => b.type === 'weight_matrix') || document.blocks[8];
  const bHearables = document.blocks.find(b => b.type === 'hearables_app') || document.blocks[9];
  const bDiag = document.blocks.find(b => b.type === 'diagnostics_troubleshooting') || document.blocks[10];
  const bCodes = document.blocks.find(b => b.type === 'return_codes') || document.blocks[11];
  const bAnnexure = document.blocks.find(b => b.type === 'annexure') || document.blocks[12];

  // Helper to render discrete pages corresponding exactly to the 18 pages of the boAt PDF (A4 210×297 mm, 1-inch padding)
  const renderPaginatedPage = (pageNumber: number) => {
    return (
      <div 
        key={`page-${pageNumber}`}
        id={`pdf-page-${pageNumber}`}
        className="pdf-page bg-white text-slate-900 w-[210mm] max-w-full min-h-[297mm] p-6 sm:p-[1in] mb-8 relative flex flex-col justify-between border border-gray-300 shadow-md rounded-xs box-border transition-shadow hover:shadow-lg print:shadow-none print:border-none print:p-0 print:m-0 print:break-after-page print:w-[210mm] print:min-h-[297mm]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Page Content */}
        <div className="flex-1 space-y-4 font-sans text-slate-900">
          {/* Page 1 */}
          {pageNumber === 1 && (
            <div className="space-y-4">
              {/* Section 1 Header */}
              <div>
                <h1 
                  onClick={(e) => handleElementClick(e, bHeader.id, 'title', 'title', 'Document Title', bHeader.title, { isBold: true })}
                  className={`text-base sm:text-lg font-bold tracking-tight leading-snug underline underline-offset-4 decoration-[#245598] text-[#245598] ${getClickableClass(bHeader.id, 'title')}`}
                >
                  {bHeader.sectionNumber ? `${bHeader.sectionNumber} ` : '1 '}{bHeader.title}
                </h1>
                <div className="mt-2 space-y-1.5 text-xs text-black">
                  <p 
                    onClick={(e) => handleElementClick(e, bHeader.id, 'objective', 'paragraph', 'Objective', bHeader.content.objective || '')}
                    className={getClickableClass(bHeader.id, 'objective')}
                  >
                    <strong className="font-bold text-black">Objective:</strong> {bHeader.content.objective}
                  </p>
                  <p 
                    onClick={(e) => handleElementClick(e, bHeader.id, 'documentOwner', 'paragraph', 'Document Owner', bHeader.content.documentOwner || '')}
                    className={getClickableClass(bHeader.id, 'documentOwner')}
                  >
                    <strong className="font-bold text-black">Document Owner:</strong> {bHeader.content.documentOwner}
                  </p>
                  {bHeader.content.featureHighlights && (
                    <ol className="list-decimal list-inside space-y-0.5 text-xs text-black pt-1">
                      {bHeader.content.featureHighlights.map((f, i) => (
                        <li 
                          key={i}
                          onClick={(e) => handleElementClick(e, bHeader.id, `feature-${i}`, 'list', `Feature #${i + 1}`, f, { itemId: String(i) })}
                          className={getClickableClass(bHeader.id, `feature-${i}`)}
                        >
                          <span className="text-black">{f}</span>
                        </li>
                      ))}
                    </ol>
                  )}
                </div>
                {renderCustomContentElements(bHeader)}
              </div>

              {/* Section 2 Technical Definitions */}
              <div className="pt-2">
                <h2 
                  onClick={(e) => handleElementClick(e, bDefinitions.id, 'title', 'title', 'Definitions Title', bDefinitions.title, { isBold: true })}
                  className={`text-sm sm:text-base font-bold mb-2 text-[#245598] ${getClickableClass(bDefinitions.id, 'title')}`}
                >
                  {bDefinitions.sectionNumber ? `${bDefinitions.sectionNumber} ` : '2 '}{bDefinitions.title}
                </h2>
                <table className="w-full border border-black text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-black font-bold bg-white">
                      <th className="p-1.5 border-r border-black font-bold text-left w-1/3 text-black">Terms</th>
                      <th className="p-1.5 font-bold text-left text-black">Definitions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(bDefinitions.content.definitions || []).map(def => (
                      <tr key={def.id} className="border-b border-black last:border-b-0">
                        <td 
                          onClick={(e) => handleElementClick(e, bDefinitions.id, `def-term-${def.id}`, 'definition', `Term: ${def.term}`, def.term, { isBold: true, itemId: def.id, subKey: 'term' })}
                          className={`p-1.5 font-bold border-r border-black align-top text-black ${getClickableClass(bDefinitions.id, `def-term-${def.id}`)}`}
                        >
                          {def.term}
                        </td>
                        <td 
                          onClick={(e) => handleElementClick(e, bDefinitions.id, `def-desc-${def.id}`, 'paragraph', `Def: ${def.term}`, def.definition, { itemId: def.id, subKey: 'definition' })}
                          className={`p-1.5 text-black ${getClickableClass(bDefinitions.id, `def-desc-${def.id}`)}`}
                        >
                          {def.definition}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {renderCustomContentElements(bDefinitions)}
              </div>

              {/* Section 3 Header & 3.1 Specs Part 1 */}
              <div className="pt-2">
                <h2 
                  className="text-sm sm:text-base font-bold mb-1 text-[#245598]"
                >
                  3 Product Details
                </h2>
                <h3 
                  onClick={(e) => handleElementClick(e, bSpecs.id, 'title', 'title', '3.1 Specifications', bSpecs.title, { isBold: true })}
                  className={`text-xs sm:text-sm font-bold text-black mb-2 ${getClickableClass(bSpecs.id, 'title')}`}
                >
                  3.1 {bSpecs.title}
                </h3>
                <table className="w-full border border-black text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-black font-bold bg-white">
                      <th className="p-1.5 border-r border-black font-bold text-left w-1/2 text-black">Product Details</th>
                      <th className="p-1.5 font-bold text-left text-black">Specification Values</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(bSpecs.content.specifications || []).slice(0, 7).map(spec => (
                      <tr key={spec.id} className="border-b border-black last:border-b-0">
                        <td 
                          onClick={(e) => handleElementClick(e, bSpecs.id, `spec-key-${spec.id}`, 'table-cell', `Spec: ${spec.key}`, spec.key, { isBold: true, itemId: spec.id, subKey: 'key' })}
                          className={`p-1.5 font-bold border-r border-black text-black ${getClickableClass(bSpecs.id, `spec-key-${spec.id}`)}`}
                        >
                          {spec.key}
                        </td>
                        <td 
                          onClick={(e) => handleElementClick(e, bSpecs.id, `spec-val-${spec.id}`, 'table-cell', `Value: ${spec.key}`, spec.value, { itemId: spec.id, subKey: 'value' })}
                          className={`p-1.5 text-black ${getClickableClass(bSpecs.id, `spec-val-${spec.id}`)}`}
                        >
                          {spec.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Page 2 */}
          {pageNumber === 2 && (
            <div className="space-y-4">
              {/* 3.1 Specs Part 2 */}
              <div>
                <table className="w-full border border-black text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-black">
                      <th className="p-1.5 border-r border-black font-bold text-left w-1/2">Product Details</th>
                      <th className="p-1.5 font-bold text-left">Specification Values</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(bSpecs.content.specifications || []).slice(7).map(spec => (
                      <tr key={spec.id} className="border-b border-black last:border-b-0">
                        <td 
                          onClick={(e) => handleElementClick(e, bSpecs.id, `spec-key-${spec.id}`, 'table-cell', `Spec: ${spec.key}`, spec.key, { isBold: true, itemId: spec.id, subKey: 'key' })}
                          className={`p-1.5 font-bold border-r border-black ${getClickableClass(bSpecs.id, `spec-key-${spec.id}`)}`}
                        >
                          {spec.key}
                        </td>
                        <td 
                          onClick={(e) => handleElementClick(e, bSpecs.id, `spec-val-${spec.id}`, 'table-cell', `Value: ${spec.key}`, spec.value, { itemId: spec.id, subKey: 'value' })}
                          className={`p-1.5 text-slate-800 ${getClickableClass(bSpecs.id, `spec-val-${spec.id}`)}`}
                        >
                          {spec.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p 
                  onClick={(e) => handleElementClick(e, bSpecs.id, 'noteText', 'note', 'Specifications Note', bSpecs.customization.noteText || '')}
                  className={`text-[11px] text-slate-800 mt-2 leading-relaxed ${getClickableClass(bSpecs.id, 'noteText')}`}
                >
                  <strong>Note: </strong>
                  {bSpecs.customization.noteText || 'Music Playtime of 45 hours per charge is based on listening to music at 60% volume & in AAC Codec. Listening to music/audio files at more than 60% volume, Dolby Audio On, and Multipoint On will reduce the playtime.'}
                </p>
                {renderCustomContentElements(bSpecs)}
              </div>

              {/* 3.2 Packaging Contents */}
              <div className="pt-2">
                <h3 
                  onClick={(e) => handleElementClick(e, bPackaging.id, 'title', 'title', '3.2 Packaging Contents', bPackaging.title, { isBold: true })}
                  className={`text-xs sm:text-sm font-bold text-slate-900 mb-2 ${getClickableClass(bPackaging.id, 'title')}`}
                >
                  3.2 {bPackaging.title}
                </h3>
                <div className="border border-black text-xs">
                  <ol className="p-2 space-y-1 list-decimal list-inside">
                    {(bPackaging.content.packagingList || []).map((item, idx) => (
                      <li 
                        key={idx}
                        onClick={(e) => handleElementClick(e, bPackaging.id, `pkg-${idx}`, 'list', `Packaging Item #${idx + 1}`, item, { itemId: String(idx) })}
                        className={getClickableClass(bPackaging.id, `pkg-${idx}`)}
                      >
                        <span className="font-normal">{item.replace(/^\d+\s*[X\.\-]?\s*/, '')}</span>
                      </li>
                    ))}
                  </ol>
                </div>
                {renderCustomContentElements(bPackaging)}
              </div>

              {/* 3.3 Colour Variants */}
              <div className="pt-2">
                <h3 
                  onClick={(e) => handleElementClick(e, bVariants.id, 'title', 'title', '3.3 Colour Variants', bVariants.title, { isBold: true })}
                  className={`text-xs sm:text-sm font-bold text-black mb-2 ${getClickableClass(bVariants.id, 'title')}`}
                >
                  3.3 {bVariants.title}
                </h3>
                {/* 2-Column Table */}
                <table className="w-full border border-black text-xs border-collapse mb-2.5">
                  <thead>
                    <tr className="border-b border-black font-bold bg-white">
                      <th className="p-1.5 border-r border-black font-bold text-left w-1/3 text-black">Product Name</th>
                      <th className="p-1.5 font-bold text-left text-black">Colour Variants</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-black last:border-b-0">
                      <td className="p-1.5 font-bold border-r border-black align-top text-black">
                        Airdopes Prime 800D
                      </td>
                      <td className="p-1.5 text-black leading-relaxed">
                        <div>Raven Black</div>
                        <div>Swedish White</div>
                        <div>Royal Blue</div>
                        <div>Smart Raven Black</div>
                        <div>Smart Swedish White</div>
                        <div>Smart Royal Blue</div>
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* Colour Variants Visual Mockups Container */}
                <div className="overflow-hidden border border-black">
                  <table className="w-full border-collapse text-xs">
                    <tbody>
                      {/* Row 1: Photos */}
                      <tr className="border-b border-black bg-white">
                        <td className="p-3 text-center border-r border-black align-middle w-1/3">
                          <div className="flex justify-center items-center h-28 max-w-36 mx-auto">
                            <EarbudsCaseMockup
                              name="Raven Black"
                              colorHex="#1A1A1A"
                              secondaryHex="#333333"
                              isSmartVariant={false}
                              showNameBelow={false}
                              className="w-full h-full bg-transparent border-0 p-0 shadow-none hover:shadow-none"
                            />
                          </div>
                        </td>
                        <td className="p-3 text-center border-r border-black align-middle w-1/3">
                          <div className="flex justify-center items-center h-28 max-w-36 mx-auto">
                            <EarbudsCaseMockup
                              name="Royal Blue"
                              colorHex="#1E3A8A"
                              secondaryHex="#3B82F6"
                              isSmartVariant={false}
                              showNameBelow={false}
                              className="w-full h-full bg-transparent border-0 p-0 shadow-none hover:shadow-none"
                            />
                          </div>
                        </td>
                        <td className="p-3 text-center align-middle w-1/3">
                          <div className="flex justify-center items-center h-28 max-w-36 mx-auto">
                            <EarbudsCaseMockup
                              name="Swedish White"
                              colorHex="#E2E8F0"
                              secondaryHex="#94A3B8"
                              isSmartVariant={false}
                              showNameBelow={false}
                              className="w-full h-full bg-transparent border-0 p-0 shadow-none hover:shadow-none"
                            />
                          </div>
                        </td>
                      </tr>
                      {/* Row 2: Names below photos */}
                      <tr className="bg-white">
                        <td className="p-1.5 text-center font-bold text-black border-r border-black w-1/3">
                          Raven Black
                        </td>
                        <td className="p-1.5 text-center font-bold text-black border-r border-black w-1/3">
                          Royal Blue
                        </td>
                        <td className="p-1.5 text-center font-bold text-black w-1/3">
                          Swedish White
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                {renderCustomContentElements(bVariants)}
              </div>
            </div>
          )}

          {/* Page 3 */}
          {pageNumber === 3 && (
            <div className="space-y-4">
              <h3 
                onClick={(e) => handleElementClick(e, bFunctionalities.id, 'title', 'title', '3.4 Product Functionalities', bFunctionalities.title, { isBold: true })}
                className={`text-xs sm:text-sm font-bold text-slate-900 mb-2 ${getClickableClass(bFunctionalities.id, 'title')}`}
              >
                3.4 {bFunctionalities.title}
              </h3>
              <table className="w-full border border-black text-xs border-collapse">
                <thead>
                  <tr className="border-b border-black">
                    <th className="p-1.5 border-r border-black font-bold text-left w-1/4">Function</th>
                    <th className="p-1.5 font-bold text-left">Process</th>
                  </tr>
                </thead>
                <tbody>
                  {(bFunctionalities.content.functionalities || []).slice(0, 11).map(fn => (
                    <tr key={fn.id} className="border-b border-black last:border-b-0">
                      <td 
                        onClick={(e) => handleElementClick(e, bFunctionalities.id, `fn-name-${fn.id}`, 'heading', `Function: ${fn.functionName}`, fn.functionName, { isBold: true, itemId: fn.id, subKey: 'functionName' })}
                        className={`p-1.5 font-bold border-r border-black align-top ${getClickableClass(bFunctionalities.id, `fn-name-${fn.id}`)}`}
                      >
                        {fn.functionName}
                      </td>
                      <td 
                        onClick={(e) => handleElementClick(e, bFunctionalities.id, `fn-proc-${fn.id}`, 'paragraph', `Process for ${fn.functionName}`, fn.process, { itemId: fn.id, subKey: 'process' })}
                        className={`p-1.5 text-slate-800 whitespace-pre-line leading-relaxed ${getClickableClass(bFunctionalities.id, `fn-proc-${fn.id}`)}`}
                      >
                        {fn.process}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Page 4 */}
          {pageNumber === 4 && (
            <div className="space-y-4">
              <table className="w-full border border-black text-xs border-collapse">
                <thead>
                  <tr className="border-b border-black">
                    <th className="p-1.5 border-r border-black font-bold text-left w-1/4">Function</th>
                    <th className="p-1.5 font-bold text-left">Process</th>
                  </tr>
                </thead>
                <tbody>
                  {(bFunctionalities.content.functionalities || []).slice(11).map(fn => (
                    <tr key={fn.id} className="border-b border-black last:border-b-0">
                      <td 
                        onClick={(e) => handleElementClick(e, bFunctionalities.id, `fn-name-${fn.id}`, 'heading', `Function: ${fn.functionName}`, fn.functionName, { isBold: true, itemId: fn.id, subKey: 'functionName' })}
                        className={`p-1.5 font-bold border-r border-black align-top ${getClickableClass(bFunctionalities.id, `fn-name-${fn.id}`)}`}
                      >
                        {fn.functionName}
                      </td>
                      <td 
                        onClick={(e) => handleElementClick(e, bFunctionalities.id, `fn-proc-${fn.id}`, 'paragraph', `Process for ${fn.functionName}`, fn.process, { itemId: fn.id, subKey: 'process' })}
                        className={`p-1.5 text-slate-800 whitespace-pre-line leading-relaxed ${getClickableClass(bFunctionalities.id, `fn-proc-${fn.id}`)}`}
                      >
                        {fn.process}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {renderCustomContentElements(bFunctionalities)}
            </div>
          )}

          {/* Page 5 */}
          {pageNumber === 5 && (
            <div className="space-y-4">
              <h3 
                onClick={(e) => handleElementClick(e, bLed.id, 'title', 'title', '3.5 Product LED Indications', bLed.title, { isBold: true })}
                className={`text-xs sm:text-sm font-bold text-slate-900 mb-2 ${getClickableClass(bLed.id, 'title')}`}
              >
                3.5 {bLed.title}
              </h3>

              {/* 3.5.1 Case LED Indications */}
              <div>
                <h4 className="font-bold text-xs text-slate-900 mb-1.5">3.5.1 Remaining Case Battery LED Indications</h4>
                <table className="w-full border border-black text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-black">
                      <th className="p-1.5 border-r border-black font-bold text-left w-1/3">Case Remaining Battery</th>
                      <th className="p-1.5 border-r border-black font-bold text-left w-1/3">Charging State</th>
                      <th className="p-1.5 font-bold text-left w-1/3">Normal (Non-Charging) State</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(bLed.content.caseLedIndications || []).map(row => (
                      <tr key={row.id} className="border-b border-black last:border-b-0">
                        <td 
                          onClick={(e) => handleElementClick(e, bLed.id, `case-led-scen-${row.id}`, 'table-cell', `LED Range: ${row.scenario}`, row.scenario, { isBold: true, itemId: row.id, subKey: 'scenario' })}
                          className={`p-1.5 font-bold border-r border-black ${getClickableClass(bLed.id, `case-led-scen-${row.id}`)}`}
                        >
                          {row.scenario}
                        </td>
                        <td 
                          onClick={(e) => handleElementClick(e, bLed.id, `case-led-chg-${row.id}`, 'table-cell', `Charging State: ${row.scenario}`, row.chargingState || '', { itemId: row.id, subKey: 'chargingState' })}
                          className={`p-1.5 border-r border-black text-slate-800 ${getClickableClass(bLed.id, `case-led-chg-${row.id}`)}`}
                        >
                          {row.chargingState}
                        </td>
                        <td 
                          onClick={(e) => handleElementClick(e, bLed.id, `case-led-norm-${row.id}`, 'table-cell', `Normal State: ${row.scenario}`, row.normalState || '', { itemId: row.id, subKey: 'normalState' })}
                          className={`p-1.5 text-slate-800 ${getClickableClass(bLed.id, `case-led-norm-${row.id}`)}`}
                        >
                          {row.normalState}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 3.5.2 Earbuds LED Indications */}
              <div className="pt-2">
                <h4 className="font-bold text-xs text-slate-900 mb-1.5">3.5.2 Earbuds LED Indications</h4>
                <table className="w-full border border-black text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-black">
                      <th className="p-1.5 border-r border-black font-bold text-left w-1/3">Scenario</th>
                      <th className="p-1.5 font-bold text-left">Charging / Operating State</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(bLed.content.earbudsLedIndications || []).map(row => (
                      <tr key={row.id} className="border-b border-black last:border-b-0">
                        <td 
                          onClick={(e) => handleElementClick(e, bLed.id, `ear-led-scen-${row.id}`, 'table-cell', `Earbud Scenario: ${row.scenario}`, row.scenario, { isBold: true, itemId: row.id, subKey: 'scenario' })}
                          className={`p-1.5 font-bold border-r border-black ${getClickableClass(bLed.id, `ear-led-scen-${row.id}`)}`}
                        >
                          {row.scenario}
                        </td>
                        <td 
                          onClick={(e) => handleElementClick(e, bLed.id, `ear-led-chg-${row.id}`, 'table-cell', `Earbud State: ${row.scenario}`, row.chargingState || '', { itemId: row.id, subKey: 'chargingState' })}
                          className={`p-1.5 text-slate-800 whitespace-pre-line ${getClickableClass(bLed.id, `ear-led-chg-${row.id}`)}`}
                        >
                          {row.chargingState}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Page 6 */}
          {pageNumber === 6 && (
            <div className="space-y-4">
              {/* 3.5.3 Factory Reset LED */}
              <div>
                <h4 className="font-bold text-xs text-slate-900 mb-1.5">3.5.3 Factory Reset LED Indications</h4>
                <table className="w-full border border-black text-xs border-collapse">
                  <tbody>
                    {(bLed.content.factoryResetLed || []).map(row => (
                      <tr key={row.id} className="border-b border-black last:border-b-0">
                        <td 
                          onClick={(e) => handleElementClick(e, bLed.id, `reset-led-scen-${row.id}`, 'table-cell', `Reset: ${row.scenario}`, row.scenario, { isBold: true, itemId: row.id, subKey: 'scenario' })}
                          className={`p-1.5 font-bold border-r border-black w-1/3 ${getClickableClass(bLed.id, `reset-led-scen-${row.id}`)}`}
                        >
                          {row.scenario}
                        </td>
                        <td 
                          onClick={(e) => handleElementClick(e, bLed.id, `reset-led-res-${row.id}`, 'table-cell', `Result: ${row.scenario}`, row.result || '', { itemId: row.id, subKey: 'result' })}
                          className={`p-1.5 text-slate-800 whitespace-pre-line ${getClickableClass(bLed.id, `reset-led-res-${row.id}`)}`}
                        >
                          {row.result}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {renderCustomContentElements(bLed)}
              </div>

              {/* 3.6 Charging Procedure and Guidelines */}
              <div className="pt-2">
                <h3 
                  onClick={(e) => handleElementClick(e, bCharging.id, 'title', 'title', '3.6 Charging Guidelines', bCharging.title, { isBold: true })}
                  className={`text-xs sm:text-sm font-bold text-slate-900 mb-2 ${getClickableClass(bCharging.id, 'title')}`}
                >
                  3.6 {bCharging.title}
                </h3>
                <table className="w-full border border-black text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-black">
                      <th className="p-1.5 border-r border-black font-bold text-left w-1/4">Statement</th>
                      <th className="p-1.5 font-bold text-left">Information</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(bCharging.content.chargingGuidelines || []).map(cg => (
                      <tr key={cg.id} className="border-b border-black last:border-b-0">
                        <td 
                          onClick={(e) => handleElementClick(e, bCharging.id, `cg-stat-${cg.id}`, 'table-cell', `Statement: ${cg.statement}`, cg.statement, { isBold: true, itemId: cg.id, subKey: 'statement' })}
                          className={`p-1.5 font-bold border-r border-black align-top ${getClickableClass(bCharging.id, `cg-stat-${cg.id}`)}`}
                        >
                          {cg.statement}
                        </td>
                        <td 
                          onClick={(e) => handleElementClick(e, bCharging.id, `cg-info-${cg.id}`, 'paragraph', `Info: ${cg.statement}`, cg.information, { itemId: cg.id, subKey: 'information' })}
                          className={`p-1.5 text-slate-800 whitespace-pre-line leading-relaxed ${getClickableClass(bCharging.id, `cg-info-${cg.id}`)}`}
                        >
                          {cg.information}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {renderCustomContentElements(bCharging)}
              </div>

              {/* Product Weight Matrix */}
              <div className="pt-2">
                <h3 
                  onClick={(e) => handleElementClick(e, bWeight.id, 'title', 'title', `${bWeight.sectionNumber} Weight Matrix`, bWeight.title, { isBold: true })}
                  className={`text-xs sm:text-sm font-bold text-black mb-2 ${getClickableClass(bWeight.id, 'title')}`}
                >
                  {bWeight.sectionNumber} {bWeight.title}
                </h3>
                {(() => {
                  const wmRows = bWeight.content.weightMatrixRows && bWeight.content.weightMatrixRows.length > 0
                    ? bWeight.content.weightMatrixRows
                    : [
                        {
                          id: 'wm-row-0',
                          product: 'boAt Airdopes Prime 800D',
                          length: '24.9 mm',
                          breadth: '20.77 mm',
                          height: '32.2 mm',
                          earbudsWeight: '4 g per earbud',
                          caseWeight: '36 g',
                        },
                      ];

                  return (
                    <table className="w-full border border-black text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-black font-bold bg-white">
                          <th className="p-1.5 border-r border-black font-bold text-left text-black">Product</th>
                          <th className="p-1.5 border-r border-black font-bold text-left text-black">Length</th>
                          <th className="p-1.5 border-r border-black font-bold text-left text-black">Breadth</th>
                          <th className="p-1.5 border-r border-black font-bold text-left text-black">Height</th>
                          <th className="p-1.5 border-r border-black font-bold text-left text-black">Earbuds Weight</th>
                          <th className="p-1.5 font-bold text-left text-black">Case Weight</th>
                        </tr>
                      </thead>
                      <tbody>
                        {wmRows.map(row => (
                          <tr key={row.id} className="border-b border-black last:border-b-0">
                            <td className="p-1.5 font-bold border-r border-black text-black">{row.product}</td>
                            <td className="p-1.5 border-r border-black text-black">{row.length}</td>
                            <td className="p-1.5 border-r border-black text-black">{row.breadth}</td>
                            <td className="p-1.5 border-r border-black text-black">{row.height}</td>
                            <td className="p-1.5 border-r border-black text-black">{row.earbudsWeight}</td>
                            <td className="p-1.5 text-black">{row.caseWeight}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  );
                })()}
                {renderCustomContentElements(bWeight)}
              </div>
            </div>
          )}

          {/* Page 7: Hearables App Screenshots */}
          {pageNumber === 7 && (
            <div className="space-y-4">
              <h2 
                onClick={(e) => handleElementClick(e, bHearables.id, 'title', 'title', `${bHearables.sectionNumber} Hearables App`, bHearables.title, { isBold: true })}
                className={`text-sm sm:text-base font-bold mb-3 text-[#245598] ${getClickableClass(bHearables.id, 'title')}`}
              >
                {bHearables.sectionNumber} {bHearables.title}
              </h2>

              {/* SDK / Non-SDK Device Classification Callout */}
              <div 
                className="border rounded-sm p-3 flex items-center justify-between gap-3"
                style={{ borderColor: getBlockAccent(bHearables.id), backgroundColor: `${getBlockAccent(bHearables.id)}08` }}
              >
                <p className="text-xs text-slate-800 leading-relaxed">
                  This model is classified as a <span className="font-bold">{document.deviceType}</span> device.
                  SDK devices support the full Hearables app feature set (EQ, touch remapping, OTA updates);
                  Non-SDK devices support the reduced Sound / System app set only.
                </p>
                <div className="flex items-center gap-1.5 shrink-0">
                  {(['SDK', 'Non-SDK'] as const).map(dt => (
                    <span
                      key={dt}
                      className={`text-[10px] px-2 py-1 rounded font-bold uppercase tracking-wider border ${
                        document.deviceType === dt ? 'text-white' : 'text-slate-400 bg-white border-slate-200'
                      }`}
                      style={document.deviceType === dt ? { backgroundColor: getBlockAccent(bHearables.id), borderColor: getBlockAccent(bHearables.id) } : {}}
                    >
                      {dt}
                    </span>
                  ))}
                </div>
              </div>

              <div className="overflow-hidden border border-black">
                <table className="w-full border-collapse table-fixed text-xs">
                  <thead>
                    <tr className="border-b border-black font-bold bg-white">
                      {(bHearables.content.hearablesAppTabs || []).map((tab, idx) => (
                        <th 
                          key={tab.id}
                          className={`p-2 text-center text-black ${idx < (bHearables.content.hearablesAppTabs || []).length - 1 ? 'border-r border-black' : ''}`}
                          style={{ width: `${100 / ((bHearables.content.hearablesAppTabs || []).length || 1)}%` }}
                        >
                          {tab.tabName}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      {(bHearables.content.hearablesAppTabs || []).map((tab, idx) => (
                        <td 
                          key={tab.id}
                          className={`p-3 text-center align-top bg-white ${idx < (bHearables.content.hearablesAppTabs || []).length - 1 ? 'border-r border-black' : ''}`}
                        >
                          <div className="flex justify-center items-center w-full py-1">
                            <HearablesAppScreenMockup tabType={tab.mockupType} title={tab.tabName} />
                          </div>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Page 8: App Guide Table Part 1 */}
          {pageNumber === 8 && (
            <div className="space-y-4">
              <table className="w-full border border-black text-xs border-collapse">
                <thead>
                  <tr className="border-b border-black">
                    <th className="p-1.5 border-r border-black font-bold text-left bg-slate-100 text-slate-900 w-1/4">Function</th>
                    <th className="p-1.5 font-bold text-left bg-slate-100 text-slate-900">Process</th>
                  </tr>
                </thead>
                <tbody>
                  {(bHearables.content.hearablesGuideSteps || []).slice(0, 5).map(step => (
                    <tr key={step.id} className="border-b border-black last:border-b-0">
                      <td 
                        onClick={(e) => handleElementClick(e, bHearables.id, `app-fn-${step.id}`, 'heading', `App Step: ${step.functionName}`, step.functionName, { isBold: true, itemId: step.id, subKey: 'functionName' })}
                        className={`p-1.5 font-bold border-r border-black align-top ${getClickableClass(bHearables.id, `app-fn-${step.id}`)}`}
                      >
                        {step.functionName}
                      </td>
                      <td 
                        onClick={(e) => handleElementClick(e, bHearables.id, `app-proc-${step.id}`, 'paragraph', `Process: ${step.functionName}`, step.process, { itemId: step.id, subKey: 'process' })}
                        className={`p-1.5 text-slate-800 whitespace-pre-line leading-relaxed ${getClickableClass(bHearables.id, `app-proc-${step.id}`)}`}
                      >
                        {step.process}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Page 9: App Guide Table Part 2 */}
          {pageNumber === 9 && (
            <div className="space-y-4">
              <table className="w-full border border-black text-xs border-collapse">
                <thead>
                  <tr className="border-b border-black">
                    <th className="p-1.5 border-r border-black font-bold text-left bg-slate-100 text-slate-900 w-1/4">Function</th>
                    <th className="p-1.5 font-bold text-left bg-slate-100 text-slate-900">Process</th>
                  </tr>
                </thead>
                <tbody>
                  {(bHearables.content.hearablesGuideSteps || []).slice(5, 6).map(step => (
                    <tr key={step.id} className="border-b border-black last:border-b-0">
                      <td 
                        onClick={(e) => handleElementClick(e, bHearables.id, `app-fn-${step.id}`, 'heading', `App Step: ${step.functionName}`, step.functionName, { isBold: true, itemId: step.id, subKey: 'functionName' })}
                        className={`p-1.5 font-bold border-r border-black align-top ${getClickableClass(bHearables.id, `app-fn-${step.id}`)}`}
                      >
                        {step.functionName}
                      </td>
                      <td 
                        onClick={(e) => handleElementClick(e, bHearables.id, `app-proc-${step.id}`, 'paragraph', `Process: ${step.functionName}`, step.process, { itemId: step.id, subKey: 'process' })}
                        className={`p-1.5 text-slate-800 whitespace-pre-line leading-relaxed ${getClickableClass(bHearables.id, `app-proc-${step.id}`)}`}
                      >
                        {step.process}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Page 10: App Guide Table Part 3 */}
          {pageNumber === 10 && (
            <div className="space-y-4">
              <table className="w-full border border-black text-xs border-collapse">
                <thead>
                  <tr className="border-b border-black">
                    <th className="p-1.5 border-r border-black font-bold text-left bg-slate-100 text-slate-900 w-1/4">Function</th>
                    <th className="p-1.5 font-bold text-left bg-slate-100 text-slate-900">Process</th>
                  </tr>
                </thead>
                <tbody>
                  {(bHearables.content.hearablesGuideSteps || []).slice(6).map(step => (
                    <tr key={step.id} className="border-b border-black last:border-b-0">
                      <td 
                        onClick={(e) => handleElementClick(e, bHearables.id, `app-fn-${step.id}`, 'heading', `App Step: ${step.functionName}`, step.functionName, { isBold: true, itemId: step.id, subKey: 'functionName' })}
                        className={`p-1.5 font-bold border-r border-black align-top ${getClickableClass(bHearables.id, `app-fn-${step.id}`)}`}
                      >
                        {step.functionName}
                      </td>
                      <td 
                        onClick={(e) => handleElementClick(e, bHearables.id, `app-proc-${step.id}`, 'paragraph', `Process: ${step.functionName}`, step.process, { itemId: step.id, subKey: 'process' })}
                        className={`p-1.5 text-slate-800 whitespace-pre-line leading-relaxed ${getClickableClass(bHearables.id, `app-proc-${step.id}`)}`}
                      >
                        {step.process}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {renderCustomContentElements(bHearables)}
            </div>
          )}

          {/* Page 11: Section 5 Diagnostics Start */}
          {pageNumber === 11 && (
            <div className="space-y-4">
              <h2 
                onClick={(e) => handleElementClick(e, bDiag.id, 'title', 'title', `${bDiag.sectionNumber} Technical Diagnostics Guidelines`, bDiag.title, { isBold: true })}
                className={`text-sm sm:text-base font-bold mb-2 ${getClickableClass(bDiag.id, 'title')}`}
                style={{ color: getBlockAccent(bDiag.id) }}
              >
                {bDiag.sectionNumber} {bDiag.title}
              </h2>

              {/* Service Channels */}
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 mb-2">{bDiag.sectionNumber}.1 Service Channels</h3>
                <table className="w-full border border-black text-xs border-collapse">
                  <thead style={{ backgroundColor: `${getBlockAccent(bDiag.id)}15` }}>
                    <tr className="border-b border-black">
                      <th className="p-1.5 border-r border-black font-bold text-left w-1/3">Product Name</th>
                      <th className="p-1.5 font-bold text-left">Service Channels</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(bDiag.content.serviceChannels || []).map(sc => (
                      <tr key={sc.id} className="border-b border-black last:border-b-0">
                        <td className="p-1.5 font-bold border-r border-black align-top">{document.productName}</td>
                        <td className="p-1.5 text-slate-800 whitespace-pre-line">{sc.details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Probable FAQs Part 1 */}
              <div className="pt-2">
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 mb-2">
                  {bDiag.sectionNumber}.2 Probable FAQs, Actionable Instructions and Resolutions for {document.productName}
                </h3>
                <table className="w-full border border-black text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-black">
                      <th className="p-1.5 border-r border-black font-bold text-left w-1/4">Issues</th>
                      <th className="p-1.5 border-r border-black font-bold text-left w-1/2">Instructions</th>
                      <th className="p-1.5 font-bold text-left w-1/4">Final Resolution</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(bDiag.content.troubleshootingItems || []).slice(0, 1).map(tb => (
                      <tr key={tb.id} className="border-b border-black last:border-b-0">
                        <td 
                          onClick={(e) => handleElementClick(e, bDiag.id, `tb-issue-${tb.id}`, 'heading', `Issue: ${tb.issue}`, tb.issue, { isBold: true, itemId: tb.id, subKey: 'issue' })}
                          className={`p-1.5 font-bold border-r border-black align-top ${getClickableClass(bDiag.id, `tb-issue-${tb.id}`)}`}
                        >
                          {tb.issue}
                        </td>
                        <td className="p-1.5 text-slate-800 border-r border-black align-top">
                          <ul className="list-disc list-inside space-y-1">
                            {tb.instructions.map((inst, idx) => (
                              <li key={idx}><span>{inst}</span></li>
                            ))}
                          </ul>
                          {tb.appDiagnosticsNote && (
                            <p className="mt-2 text-slate-900 font-normal">
                              <span className="bg-[#FFFF00] text-black font-bold px-1 py-0.5 inline-block mr-1">App -</span>
                              {tb.appDiagnosticsNote}
                            </p>
                          )}
                        </td>
                        <td className="p-1.5 font-medium align-top">{tb.finalResolution}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Page 12: FAQs Part 2 */}
          {pageNumber === 12 && (
            <div className="space-y-4">
              <table className="w-full border border-black text-xs border-collapse">
                <thead>
                  <tr className="border-b border-black font-bold bg-white">
                    <th className="p-1.5 border-r border-black font-bold text-left w-1/4 text-black">Issues</th>
                    <th className="p-1.5 border-r border-black font-bold text-left w-1/2 text-black">Instructions</th>
                    <th className="p-1.5 font-bold text-left w-1/4 text-black">Final Resolution</th>
                  </tr>
                </thead>
                <tbody>
                  {(bDiag.content.troubleshootingItems || []).slice(1, 3).map(tb => (
                    <tr key={tb.id} className="border-b border-black last:border-b-0">
                      <td 
                        onClick={(e) => handleElementClick(e, bDiag.id, `tb-issue-${tb.id}`, 'heading', `Issue: ${tb.issue}`, tb.issue, { isBold: true, itemId: tb.id, subKey: 'issue' })}
                        className={`p-1.5 font-bold border-r border-black align-top text-black ${getClickableClass(bDiag.id, `tb-issue-${tb.id}`)}`}
                      >
                        {tb.issue}
                      </td>
                      <td className="p-1.5 text-black border-r border-black align-top">
                        <ul className="list-disc list-inside space-y-1">
                          {tb.instructions.map((inst, idx) => (
                            <li key={idx}><span>{inst}</span></li>
                          ))}
                        </ul>
                        {tb.appDiagnosticsNote && (
                          <p className="mt-2 text-black font-normal">
                            <span className="bg-[#FFFF00] text-black font-bold px-1 py-0.5 inline-block mr-1">App -</span>
                            {tb.appDiagnosticsNote}
                          </p>
                        )}
                      </td>
                      <td className="p-1.5 font-medium align-top text-black">{tb.finalResolution}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Page 13: FAQs Part 3 */}
          {pageNumber === 13 && (
            <div className="space-y-4">
              <table className="w-full border border-black text-xs border-collapse">
                <thead>
                  <tr className="border-b border-black font-bold bg-white">
                    <th className="p-1.5 border-r border-black font-bold text-left w-1/4 text-black">Issues</th>
                    <th className="p-1.5 border-r border-black font-bold text-left w-1/2 text-black">Instructions</th>
                    <th className="p-1.5 font-bold text-left w-1/4 text-black">Final Resolution</th>
                  </tr>
                </thead>
                <tbody>
                  {(bDiag.content.troubleshootingItems || []).slice(3, 6).map(tb => (
                    <tr key={tb.id} className="border-b border-black last:border-b-0">
                      <td 
                        onClick={(e) => handleElementClick(e, bDiag.id, `tb-issue-${tb.id}`, 'heading', `Issue: ${tb.issue}`, tb.issue, { isBold: true, itemId: tb.id, subKey: 'issue' })}
                        className={`p-1.5 font-bold border-r border-black align-top text-black ${getClickableClass(bDiag.id, `tb-issue-${tb.id}`)}`}
                      >
                        {tb.issue}
                      </td>
                      <td className="p-1.5 text-black border-r border-black align-top">
                        <ul className="list-disc list-inside space-y-1">
                          {tb.instructions.map((inst, idx) => (
                            <li key={idx}><span>{inst}</span></li>
                          ))}
                        </ul>
                        {tb.appDiagnosticsNote && (
                          <p className="mt-2 text-black font-normal">
                            <span className="bg-[#FFFF00] text-black font-bold px-1 py-0.5 inline-block mr-1">App -</span>
                            {tb.appDiagnosticsNote}
                          </p>
                        )}
                      </td>
                      <td className="p-1.5 font-medium align-top text-black">{tb.finalResolution}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Page 14: FAQs Part 4 */}
          {pageNumber === 14 && (
            <div className="space-y-4">
              <table className="w-full border border-black text-xs border-collapse">
                <thead>
                  <tr className="border-b border-black font-bold bg-white">
                    <th className="p-1.5 border-r border-black font-bold text-left w-1/4 text-black">Issues</th>
                    <th className="p-1.5 border-r border-black font-bold text-left w-1/2 text-black">Instructions</th>
                    <th className="p-1.5 font-bold text-left w-1/4 text-black">Final Resolution</th>
                  </tr>
                </thead>
                <tbody>
                  {(bDiag.content.troubleshootingItems || []).slice(6, 8).map(tb => (
                    <tr key={tb.id} className="border-b border-black last:border-b-0">
                      <td 
                        onClick={(e) => handleElementClick(e, bDiag.id, `tb-issue-${tb.id}`, 'heading', `Issue: ${tb.issue}`, tb.issue, { isBold: true, itemId: tb.id, subKey: 'issue' })}
                        className={`p-1.5 font-bold border-r border-black align-top text-black ${getClickableClass(bDiag.id, `tb-issue-${tb.id}`)}`}
                      >
                        {tb.issue}
                      </td>
                      <td className="p-1.5 text-black border-r border-black align-top">
                        <ul className="list-disc list-inside space-y-1">
                          {tb.instructions.map((inst, idx) => (
                            <li key={idx}><span>{inst}</span></li>
                          ))}
                        </ul>
                        {tb.appDiagnosticsNote && (
                          <p className="mt-2 text-black font-normal">
                            <span className="bg-[#FFFF00] text-black font-bold px-1 py-0.5 inline-block mr-1">App -</span>
                            {tb.appDiagnosticsNote}
                          </p>
                        )}
                      </td>
                      <td className="p-1.5 font-medium align-top text-black">{tb.finalResolution}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Page 15: FAQs Part 5 */}
          {pageNumber === 15 && (
            <div className="space-y-4">
              <table className="w-full border border-black text-xs border-collapse">
                <thead>
                  <tr className="border-b border-black font-bold bg-white">
                    <th className="p-1.5 border-r border-black font-bold text-left w-1/4 text-black">Issues</th>
                    <th className="p-1.5 border-r border-black font-bold text-left w-1/2 text-black">Instructions</th>
                    <th className="p-1.5 font-bold text-left w-1/4 text-black">Final Resolution</th>
                  </tr>
                </thead>
                <tbody>
                  {(bDiag.content.troubleshootingItems || []).slice(8, 13).map(tb => (
                    <tr key={tb.id} className="border-b border-black last:border-b-0">
                      <td 
                        onClick={(e) => handleElementClick(e, bDiag.id, `tb-issue-${tb.id}`, 'heading', `Issue: ${tb.issue}`, tb.issue, { isBold: true, itemId: tb.id, subKey: 'issue' })}
                        className={`p-1.5 font-bold border-r border-black align-top text-black ${getClickableClass(bDiag.id, `tb-issue-${tb.id}`)}`}
                      >
                        {tb.issue}
                      </td>
                      <td className="p-1.5 text-black border-r border-black align-top">
                        <ul className="list-disc list-inside space-y-1">
                          {tb.instructions.map((inst, idx) => (
                            <li key={idx}><span>{inst}</span></li>
                          ))}
                        </ul>
                        {tb.appDiagnosticsNote && (
                          <p className="mt-2 text-black font-normal">
                            <span className="bg-[#FFFF00] text-black font-bold px-1 py-0.5 inline-block mr-1">App -</span>
                            {tb.appDiagnosticsNote}
                          </p>
                        )}
                      </td>
                      <td className="p-1.5 font-medium align-top text-black">{tb.finalResolution}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Page 16: FAQs Part 6 */}
          {pageNumber === 16 && (
            <div className="space-y-4">
              <table className="w-full border border-black text-xs border-collapse">
                <thead>
                  <tr className="border-b border-black font-bold bg-white">
                    <th className="p-1.5 border-r border-black font-bold text-left w-1/4 text-black">Issues</th>
                    <th className="p-1.5 border-r border-black font-bold text-left w-1/2 text-black">Instructions</th>
                    <th className="p-1.5 font-bold text-left w-1/4 text-black">Final Resolution</th>
                  </tr>
                </thead>
                <tbody>
                  {(bDiag.content.troubleshootingItems || []).slice(13, 18).map(tb => (
                    <tr key={tb.id} className="border-b border-black last:border-b-0">
                      <td 
                        onClick={(e) => handleElementClick(e, bDiag.id, `tb-issue-${tb.id}`, 'heading', `Issue: ${tb.issue}`, tb.issue, { isBold: true, itemId: tb.id, subKey: 'issue' })}
                        className={`p-1.5 font-bold border-r border-black align-top text-black ${getClickableClass(bDiag.id, `tb-issue-${tb.id}`)}`}
                      >
                        {tb.issue}
                      </td>
                      <td className="p-1.5 text-black border-r border-black align-top">
                        <ul className="list-disc list-inside space-y-1">
                          {tb.instructions.map((inst, idx) => (
                            <li key={idx}><span>{inst}</span></li>
                          ))}
                        </ul>
                        {tb.appDiagnosticsNote && (
                          <p className="mt-2 text-black font-normal">
                            <span className="bg-[#FFFF00] text-black font-bold px-1 py-0.5 inline-block mr-1">App -</span>
                            {tb.appDiagnosticsNote}
                          </p>
                        )}
                      </td>
                      <td className="p-1.5 font-medium align-top text-black">{tb.finalResolution}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Page 17: FAQs Part 7 */}
          {pageNumber === 17 && (
            <div className="space-y-4">
              <table className="w-full border border-black text-xs border-collapse">
                <thead>
                  <tr className="border-b border-black font-bold bg-white">
                    <th className="p-1.5 border-r border-black font-bold text-left w-1/4 text-black">Issues</th>
                    <th className="p-1.5 border-r border-black font-bold text-left w-1/2 text-black">Instructions</th>
                    <th className="p-1.5 font-bold text-left w-1/4 text-black">Final Resolution</th>
                  </tr>
                </thead>
                <tbody>
                  {(bDiag.content.troubleshootingItems || []).slice(18, 25).map(tb => (
                    <tr key={tb.id} className="border-b border-black last:border-b-0">
                      <td 
                        onClick={(e) => handleElementClick(e, bDiag.id, `tb-issue-${tb.id}`, 'heading', `Issue: ${tb.issue}`, tb.issue, { isBold: true, itemId: tb.id, subKey: 'issue' })}
                        className={`p-1.5 font-bold border-r border-black align-top text-black ${getClickableClass(bDiag.id, `tb-issue-${tb.id}`)}`}
                      >
                        {tb.issue}
                      </td>
                      <td className="p-1.5 text-black border-r border-black align-top">
                        <ul className="list-disc list-inside space-y-1">
                          {tb.instructions.map((inst, idx) => (
                            <li key={idx}><span>{inst}</span></li>
                          ))}
                        </ul>
                        {tb.appDiagnosticsNote && (
                          <p className="mt-2 text-black font-normal">
                            <span className="bg-[#FFFF00] text-black font-bold px-1 py-0.5 inline-block mr-1">App -</span>
                            {tb.appDiagnosticsNote}
                          </p>
                        )}
                      </td>
                      <td className="p-1.5 font-medium align-top text-black">{tb.finalResolution}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Page 18: FAQs Part 8 + Section 6 + Section 7 */}
          {pageNumber === 18 && (
            <div className="space-y-4">
              <table className="w-full border border-black text-xs border-collapse">
                <thead>
                  <tr className="border-b border-black">
                    <th className="p-1.5 border-r border-black font-bold text-left w-1/4">Issues</th>
                    <th className="p-1.5 border-r border-black font-bold text-left w-1/2">Instructions</th>
                    <th className="p-1.5 font-bold text-left w-1/4">Final Resolution</th>
                  </tr>
                </thead>
                <tbody>
                  {(bDiag.content.troubleshootingItems || []).slice(25).map(tb => (
                    <tr key={tb.id} className="border-b border-black last:border-b-0">
                      <td 
                        onClick={(e) => handleElementClick(e, bDiag.id, `tb-issue-${tb.id}`, 'heading', `Issue: ${tb.issue}`, tb.issue, { isBold: true, itemId: tb.id, subKey: 'issue' })}
                        className={`p-1.5 font-bold border-r border-black align-top ${getClickableClass(bDiag.id, `tb-issue-${tb.id}`)}`}
                      >
                        {tb.issue}
                      </td>
                      <td className="p-1.5 text-slate-800 border-r border-black align-top">
                        <ul className="list-disc list-inside space-y-1">
                          {tb.instructions.map((inst, idx) => (
                            <li key={idx}><span>{inst}</span></li>
                          ))}
                        </ul>
                      </td>
                      <td className="p-1.5 font-medium align-top">{tb.finalResolution}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {renderCustomContentElements(bDiag)}

              {/* Section 6 Return Codes */}
              <div className="pt-2">
                <h2 
                  onClick={(e) => handleElementClick(e, bCodes.id, 'title', 'title', `${bCodes.sectionNumber} Return Codes`, bCodes.title, { isBold: true })}
                  className={`text-sm sm:text-base font-bold mb-2 ${getClickableClass(bCodes.id, 'title')}`}
                  style={{ color: getBlockAccent(bCodes.id) }}
                >
                  {bCodes.sectionNumber} {bCodes.title}
                </h2>
                <table className="w-full border border-black text-xs border-collapse">
                  <thead style={{ backgroundColor: `${getBlockAccent(bCodes.id)}15` }}>
                    <tr className="border-b border-black">
                      <th className="p-1.5 border-r border-black font-bold text-left">Product Description</th>
                      <th className="p-1.5 border-r border-black font-bold text-left">EAN Code</th>
                      <th className="p-1.5 border-r border-black font-bold text-left">ASIN</th>
                      <th className="p-1.5 font-bold text-left">FSN</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(bCodes.content.returnCodes || []).map(code => (
                      <tr key={code.id} className="border-b border-black last:border-b-0">
                        <td className="p-1.5 font-bold border-r border-black">{code.productDesc}</td>
                        <td className="p-1.5 border-r border-black font-mono">{code.ean}</td>
                        <td className="p-1.5 border-r border-black font-mono">{code.asin}</td>
                        <td className="p-1.5 font-mono">{code.fsn}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {renderCustomContentElements(bCodes)}
              </div>

              {/* Section 7 Annexure */}
              <div className="pt-2">
                <h2 
                  onClick={(e) => handleElementClick(e, bAnnexure.id, 'title', 'title', `${bAnnexure.sectionNumber} Annexure`, bAnnexure.title, { isBold: true })}
                  className={`text-sm sm:text-base font-bold mb-2 ${getClickableClass(bAnnexure.id, 'title')}`}
                  style={{ color: getBlockAccent(bAnnexure.id) }}
                >
                  {bAnnexure.sectionNumber} {bAnnexure.title}
                </h2>
                {(() => {
                  const items: AnnexureItem[] = (bAnnexure.content.annexureItems && bAnnexure.content.annexureItems.length > 0)
                    ? bAnnexure.content.annexureItems
                    : [
                        {
                          id: 'ann-1',
                          sopTitle: 'Testing Standard Operating Procedure',
                          protocols: bAnnexure.content.annexureTestingSop || '● Step 1: Visual and cosmetic inspection.\n● Step 2: Battery voltage verification.\n● Step 3: Audio spectrum sweep.\n● Step 4: Bluetooth RF validation.',
                          resourceLink: bAnnexure.content.annexureTutorialLinks || 'https://service-portal.internal.com/training/neo-anc',
                          category: 'QA Testing'
                        },
                        {
                          id: 'ann-2',
                          sopTitle: 'Service & Tutorial Video Links',
                          protocols: 'Complete technical video walkthrough illustrating disassembly and battery replacement SOP.',
                          resourceLink: bAnnexure.content.annexureTutorialLinks || 'https://service-portal.internal.com/training/neo-anc',
                          category: 'Tutorial Video'
                        },
                      ];

                  return (
                    <div className="space-y-2 text-xs">
                      <div className="overflow-hidden border border-black rounded-xs">
                        <table className="w-full text-left border-collapse">
                          <thead className="bg-slate-100 border-b border-black font-bold">
                            <tr>
                              <th className="p-1.5 border-r border-black w-12 text-center">S.No.</th>
                              <th className="p-1.5 border-r border-black w-1/4">SOP Title</th>
                              <th className="p-1.5 border-r border-black w-1/2">Testing Protocols & Procedures</th>
                              <th className="p-1.5 w-1/4">Resource & Video Link</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-black">
                            {items.map((item, idx) => (
                              <tr key={item.id || idx}>
                                <td className="p-1.5 text-center font-bold font-mono border-r border-black align-top bg-slate-50/50">
                                  {`7.${idx + 1}`}
                                </td>
                                <td className="p-1.5 font-bold text-slate-900 border-r border-black align-top">
                                  <span>{item.sopTitle}</span>
                                  {item.category && (
                                    <span className="block mt-0.5 text-[9px] font-medium text-slate-500 font-sans">
                                      [{item.category}]
                                    </span>
                                  )}
                                </td>
                                <td className="p-1.5 border-r border-black align-top whitespace-pre-line leading-relaxed text-slate-800 text-[11px]">
                                  {item.protocols}
                                </td>
                                <td className="p-1.5 align-top break-all text-[11px]">
                                  {item.resourceLink ? (
                                    <a
                                      href={item.resourceLink}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-blue-700 hover:text-blue-900 underline font-mono"
                                    >
                                      {item.resourceLink}
                                    </a>
                                  ) : (
                                    <span className="text-slate-400 italic">No link</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })()}
                {renderCustomContentElements(bAnnexure)}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div 
      className="pdf-document-root bg-white w-full flex flex-col items-center select-text overflow-x-auto min-h-full p-2 sm:p-4"
      style={{ fontSize: document.fontSize === 'compact' ? '12px' : document.fontSize === 'spacious' ? '15px' : '13px' }}
      onClick={() => onSelectDocElement && onSelectDocElement(null)}
    >
      {/* Top Controls Toolbar: Paginated 18-Page vs Continuous Flow & Paper Spec */}
      {!hideLayoutControls && (
      <div className="w-full max-w-4xl mb-4 bg-gray-50 border border-gray-200 rounded-lg p-2.5 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs z-30 print:hidden">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPageLayoutMode('paginated')}
            className={`px-3 py-1.5 rounded-md font-semibold flex items-center gap-1.5 transition-colors ${
              pageLayoutMode === 'paginated'
                ? 'bg-blue-800 text-white shadow-xs'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            18-Page Exact PDF Format
          </button>
          <button
            onClick={() => setPageLayoutMode('continuous')}
            className={`px-3 py-1.5 rounded-md font-semibold flex items-center gap-1.5 transition-colors ${
              pageLayoutMode === 'continuous'
                ? 'bg-blue-800 text-white shadow-xs'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Continuous Document Flow
          </button>
        </div>

        {/* Paper Size & Padding Spec Badge */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 bg-white border border-gray-200 text-gray-700 font-mono text-[11px] font-semibold px-2.5 py-1 rounded-md shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            A4 Portrait (210×297 mm) • 1″ Padding
          </span>

          {pageLayoutMode === 'paginated' && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
                className="p-1 rounded bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 disabled:opacity-40"
                title="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-semibold text-gray-800 px-1">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="p-1 rounded bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 disabled:opacity-40"
                title="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <select
                value={currentPage}
                onChange={(e) => {
                  const target = parseInt(e.target.value, 10);
                  setCurrentPage(target);
                  const el = typeof window !== 'undefined' ? window.document.getElementById(`pdf-page-${target}`) : null;
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="ml-1 bg-white border border-gray-200 rounded px-2 py-1 text-xs text-gray-700 font-medium"
              >
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <option key={p} value={p}>Jump to Page {p}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>
      )}

      {/* RENDER IN PAGINATED 18-PAGE MODE */}
      {effectiveLayoutMode === 'paginated' ? (
        <div 
          className="flex flex-col items-center w-full"
          style={{
            transform: scale !== 1 ? `scale(${scale})` : undefined,
            transformOrigin: 'top center',
          }}
        >
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => renderPaginatedPage(p))}
        </div>
      ) : (
        /* RENDER IN CONTINUOUS FLOW MODE */
        <div 
          className="pdf-page bg-white text-slate-900 border border-gray-300 shadow-md w-[210mm] max-w-full min-h-[297mm] p-6 sm:p-[1in] relative box-border rounded-xs print:shadow-none print:border-none print:p-0 print:max-w-none print:w-[210mm] print:min-h-[297mm]"
          style={{
            transform: scale !== 1 ? `scale(${scale})` : undefined,
            transformOrigin: 'top center',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Document Confidentiality Watermark */}
          {document.watermark && (
            <div 
              onClick={(e) => handleElementClick(e, 'doc-root', 'watermark', 'product-meta', 'Document Watermark', document.watermark)}
              className={`watermark absolute inset-0 flex items-center justify-center opacity-[0.03] select-none rotate-[-30deg] z-0 ${
                isSelected('doc-root', 'watermark') ? 'opacity-[0.15] bg-blue-50/20' : ''
              }`}
            >
              <span className="text-6xl sm:text-8xl font-black uppercase text-slate-950 tracking-widest text-center px-4">
                {document.watermark}
              </span>
            </div>
          )}

          {/* Header Branding Bar */}
          {document.showHeaderFooter && (
            <div 
              className="doc-header border-b-2 pb-3 mb-8 flex justify-between items-end relative z-10"
              style={{ borderBottomColor: document.themeColor || '#1e40af' }}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span 
                    className="text-xs px-2 py-0.5 rounded font-bold uppercase"
                    style={{
                      backgroundColor: `${document.themeColor || '#1e40af'}18`,
                      color: document.themeColor || '#1e40af'
                    }}
                  >
                    Service Manual SOP
                  </span>
                  <span 
                    className="text-xs px-2 py-0.5 rounded font-bold uppercase text-white"
                    style={{ backgroundColor: document.themeColor || '#1e40af' }}
                    title="Device Type Classification"
                  >
                    {document.deviceType}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                  <span
                    onClick={(e) => handleElementClick(e, 'doc-root', 'productName', 'product-meta', 'Product Name', document.productName, { isBold: true })}
                    className={getClickableClass('doc-root', 'productName')}
                    title="Click to edit Product Name in Customization"
                  >
                    {document.productName}
                  </span>
                  {' • '}
                  <span>Model: </span>
                  <span
                    onClick={(e) => handleElementClick(e, 'doc-root', 'modelCode', 'product-meta', 'Model Code', document.modelCode)}
                    className={getClickableClass('doc-root', 'modelCode')}
                    title="Click to edit Model Code in Customization"
                  >
                    {document.modelCode}
                  </span>
                </p>
              </div>

              <div className="text-right text-[10px] text-slate-500 font-mono">
                <p>
                  Version:{' '}
                  <span 
                    onClick={(e) => handleElementClick(e, 'doc-root', 'version', 'product-meta', 'Document Version', document.version, { isBold: true })}
                    className={`font-bold text-slate-800 ${getClickableClass('doc-root', 'version')}`}
                  >
                    {document.version}
                  </span>
                </p>
                <p>
                  Date:{' '}
                  <span
                    onClick={(e) => handleElementClick(e, 'doc-root', 'lastUpdated', 'product-meta', 'Document Date', document.lastUpdated)}
                    className={getClickableClass('doc-root', 'lastUpdated')}
                  >
                    {document.lastUpdated}
                  </span>
                </p>
              </div>
            </div>
          )}

          {/* Main Content Blocks Sequence */}
          <div className="doc-content space-y-10 relative z-10">
            {blocksToRender.map(block => (
              <section
                key={block.id}
                id={`pdf-section-${block.id}`}
                className={`doc-block transition-all ${
                  block.customization.pageBreakBefore ? 'print:break-before-page pt-6' : ''
                }`}
              >
                {/* Section Main Title */}
                {block.customization.showSectionNumber !== false && (
                  <div 
                    className="border-b pb-1.5 mb-4"
                    style={{ borderBottomColor: `${getBlockAccent(block.id)}33` }}
                  >
                    <h2 
                      className="text-lg font-bold tracking-tight flex items-baseline gap-2"
                      style={{ color: getBlockAccent(block.id) }}
                    >
                      <span 
                        onClick={(e) => handleElementClick(e, block.id, 'sectionNumber', 'heading', `Section ${block.sectionNumber} Number`, block.sectionNumber, { isBold: true })}
                        className={`font-black ${getClickableClass(block.id, 'sectionNumber')}`}
                        style={{ color: getBlockAccent(block.id) }}
                        title="Click to edit Section Number"
                      >
                        {block.sectionNumber}
                      </span>
                      <span 
                        onClick={(e) => handleElementClick(e, block.id, 'title', 'title', `Title (${block.title})`, block.title, { isBold: true, textCase: block.title === block.title.toUpperCase() ? 'uppercase' : 'capitalize' })}
                        className={`${getClickableClass(block.id, 'title')}`}
                        title="Click to edit Section Title"
                      >
                        {block.title}
                      </span>
                    </h2>
                  </div>
                )}

                {/* Header Overview */}
                {block.type === 'header_overview' && (
                  <div className="space-y-3 text-xs leading-relaxed">
                    {block.content.objective && (
                      <p 
                        onClick={(e) => handleElementClick(e, block.id, 'objective', 'paragraph', 'Document Objective', block.content.objective || '')}
                        className={`text-slate-800 ${getClickableClass(block.id, 'objective')}`}
                      >
                        <strong className="font-bold text-slate-900">Objective:</strong> {block.content.objective}
                      </p>
                    )}
                    {block.content.documentOwner && (
                      <p 
                        onClick={(e) => handleElementClick(e, block.id, 'documentOwner', 'paragraph', 'Document Owner', block.content.documentOwner || '')}
                        className={`text-slate-800 ${getClickableClass(block.id, 'documentOwner')}`}
                      >
                        <strong className="font-bold text-slate-900">Document Owner:</strong> {block.content.documentOwner}
                      </p>
                    )}
                    {block.content.featureHighlights && (
                      <div className="pt-2">
                        <ol className="list-decimal list-inside space-y-1 text-slate-800 font-medium pl-1">
                          {block.content.featureHighlights.map((f, i) => (
                            <li 
                              key={i} 
                              onClick={(e) => handleElementClick(e, block.id, `feature-${i}`, 'list', `Feature Highlight #${i + 1}`, f, { itemId: String(i) })}
                              className={`pl-1 ${getClickableClass(block.id, `feature-${i}`)}`}
                            >
                              <span className="font-normal text-slate-800">{f}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}
                  </div>
                )}

                {/* Technical Definitions */}
                {block.type === 'technical_definitions' && (
                  <div className="overflow-hidden border border-black rounded-xs">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-slate-100 border-b border-black text-slate-900 font-bold">
                        <tr>
                          <th className="p-2 border-r border-black w-1/3">Terms</th>
                          <th className="p-2">Definitions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-black">
                        {(block.content.definitions || []).map(def => (
                          <tr key={def.id}>
                            <td 
                              onClick={(e) => handleElementClick(e, block.id, `def-term-${def.id}`, 'definition', `Definition Term: ${def.term}`, def.term, { isBold: true, itemId: def.id, subKey: 'term' })}
                              className={`p-2 font-bold text-slate-900 border-r border-black ${getClickableClass(block.id, `def-term-${def.id}`)}`}
                            >
                              {def.term}
                            </td>
                            <td 
                              onClick={(e) => handleElementClick(e, block.id, `def-desc-${def.id}`, 'paragraph', `Definition for ${def.term}`, def.definition, { itemId: def.id, subKey: 'definition' })}
                              className={`p-2 text-slate-800 ${getClickableClass(block.id, `def-desc-${def.id}`)}`}
                            >
                              {def.definition}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Specifications Table */}
                {block.type === 'specifications_table' && (
                  <div className="space-y-3">
                    <div className="overflow-hidden border border-black rounded-xs">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead className="bg-slate-100 border-b border-black text-slate-900 font-bold">
                          <tr>
                            <th className="p-2 border-r border-black w-1/2">Product Details</th>
                            <th className="p-2">Specification Values</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-black">
                          {(block.content.specifications || []).map(spec => (
                            <tr key={spec.id}>
                              <td 
                                onClick={(e) => handleElementClick(e, block.id, `spec-key-${spec.id}`, 'table-cell', `Spec Label: ${spec.key}`, spec.key, { isBold: true, itemId: spec.id, subKey: 'key' })}
                                className={`p-2 font-bold text-slate-900 border-r border-black ${getClickableClass(block.id, `spec-key-${spec.id}`)}`}
                              >
                                {spec.key}
                              </td>
                              <td 
                                onClick={(e) => handleElementClick(e, block.id, `spec-val-${spec.id}`, 'table-cell', `Spec Value: ${spec.key}`, spec.value, { itemId: spec.id, subKey: 'value' })}
                                className={`p-2 text-slate-800 ${getClickableClass(block.id, `spec-val-${spec.id}`)}`}
                              >
                                {spec.value}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {block.customization.noteText && (
                      <p className="text-xs text-slate-700 leading-normal">
                        <strong className="text-slate-900">Note: </strong>
                        {block.customization.noteText}
                      </p>
                    )}
                  </div>
                )}

                {/* Packaging Contents */}
                {block.type === 'packaging_contents' && (
                  <div className="overflow-hidden border border-black rounded-xs">
                    <table className="w-full text-left text-xs border-collapse">
                      <tbody className="divide-y divide-black">
                        {(block.content.packagingList || []).map((item, idx) => (
                          <tr key={idx}>
                            <td className="p-2 w-12 font-bold text-center border-r border-black bg-slate-50">{idx + 1}.</td>
                            <td 
                              onClick={(e) => handleElementClick(e, block.id, `pkg-${idx}`, 'list', `Packaging Item #${idx + 1}`, item, { itemId: String(idx) })}
                              className={`p-2 font-medium text-slate-800 ${getClickableClass(block.id, `pkg-${idx}`)}`}
                            >
                              {item}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Colour Variants Table: Row 1 = Photos, Row 2 = Names */}
                {block.type === 'colour_variants' && (
                  <div className="overflow-hidden border border-black rounded-xs">
                    <table className="w-full border-collapse text-xs">
                      <tbody>
                        {(() => {
                          const variants = block.content.colourVariants || [];
                          const chunks: typeof variants[] = [];
                          for (let i = 0; i < (variants.length || 1); i += 3) {
                            chunks.push(variants.slice(i, i + 3));
                          }
                          if (chunks.length === 0 || variants.length === 0) {
                            return (
                              <tr>
                                <td className="p-4 text-center text-slate-400 italic">No colour variants defined</td>
                              </tr>
                            );
                          }
                          return chunks.map((chunk, chunkIdx) => (
                            <React.Fragment key={`chunk-cont-${chunkIdx}`}>
                              {/* Row 1: Photos */}
                              <tr className="border-b border-black bg-slate-50/50">
                                {chunk.map(variant => (
                                  <td
                                    key={`photo-cont-${variant.id}`}
                                    style={{ width: `${100 / Math.min(chunk.length, 3)}%` }}
                                    onClick={(e) => handleElementClick(e, block.id, `variant-card-${variant.id}`, 'table-cell', `Variant Photo (${variant.name})`, variant.name, { itemId: variant.id, subKey: 'name' })}
                                    className={`p-3 text-center border-r border-black last:border-r-0 align-middle ${getClickableClass(block.id, `variant-card-${variant.id}`)}`}
                                  >
                                    <div className="flex justify-center items-center h-28 max-w-36 mx-auto">
                                      {variant.imageUrl ? (
                                        <img
                                          src={variant.imageUrl}
                                          alt={variant.name}
                                          className="max-h-28 max-w-full object-contain drop-shadow-sm"
                                          referrerPolicy="no-referrer"
                                        />
                                      ) : (
                                        <EarbudsCaseMockup
                                          name={variant.name}
                                          colorHex={variant.colorHex}
                                          secondaryHex={variant.secondaryHex}
                                          isSmartVariant={variant.isSmartVariant}
                                          showNameBelow={false}
                                          className="w-full h-full bg-transparent border-0 p-0 shadow-none hover:shadow-none"
                                        />
                                      )}
                                    </div>
                                  </td>
                                ))}
                              </tr>
                              {/* Row 2: Names below photos */}
                              <tr className={`bg-white ${chunkIdx < chunks.length - 1 ? 'border-b border-black' : ''}`}>
                                {chunk.map(variant => (
                                  <td
                                    key={`name-cont-${variant.id}`}
                                    style={{ width: `${100 / Math.min(chunk.length, 3)}%` }}
                                    onClick={(e) => handleElementClick(e, block.id, `variant-${variant.id}`, 'table-cell', `Variant Name (${variant.name})`, variant.name, { itemId: variant.id, subKey: 'name', isBold: true })}
                                    className={`p-2 text-center font-bold text-slate-900 border-r border-black last:border-r-0 ${getClickableClass(block.id, `variant-${variant.id}`)}`}
                                  >
                                    <div className="flex items-center justify-center gap-1.5">
                                      <span
                                        className="w-3 h-3 rounded-full border border-slate-400 shrink-0"
                                        style={{ backgroundColor: variant.colorHex }}
                                      />
                                      <span className="text-xs">{variant.name}</span>
                                      {variant.isSmartVariant && (
                                        <span className="px-1 py-0.2 text-[8px] font-bold bg-amber-100 text-amber-800 border border-amber-300 rounded">
                                          SMART
                                        </span>
                                      )}
                                    </div>
                                  </td>
                                ))}
                              </tr>
                            </React.Fragment>
                          ));
                        })()}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Product Functionalities */}
                {block.type === 'product_functionalities' && (
                  <div className="overflow-hidden border border-black rounded-xs">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-slate-100 border-b border-black text-slate-900 font-bold">
                        <tr>
                          <th className="p-2 border-r border-black w-1/4">Function</th>
                          <th className="p-2">Process</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-black">
                        {(block.content.functionalities || []).map(fn => (
                          <tr key={fn.id}>
                            <td 
                              onClick={(e) => handleElementClick(e, block.id, `fn-name-${fn.id}`, 'heading', `Function: ${fn.functionName}`, fn.functionName, { isBold: true, itemId: fn.id, subKey: 'functionName' })}
                              className={`p-2 font-bold text-slate-900 border-r border-black align-top ${getClickableClass(block.id, `fn-name-${fn.id}`)}`}
                            >
                              {fn.functionName}
                            </td>
                            <td 
                              onClick={(e) => handleElementClick(e, block.id, `fn-proc-${fn.id}`, 'paragraph', `Process for ${fn.functionName}`, fn.process, { itemId: fn.id, subKey: 'process' })}
                              className={`p-2 text-slate-800 whitespace-pre-line leading-relaxed ${getClickableClass(block.id, `fn-proc-${fn.id}`)}`}
                            >
                              {fn.process}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* LED Indications */}
                {block.type === 'led_indications' && (
                  <div className="space-y-4 text-xs">
                    <h3 className="font-bold text-slate-900">3.5.1 Remaining Case Battery LED Indications</h3>
                    <div className="overflow-hidden border border-black rounded-xs">
                      <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-100 border-b border-black text-slate-900 font-bold">
                          <tr>
                            <th className="p-2 border-r border-black w-1/3">Case Remaining Battery</th>
                            <th className="p-2 border-r border-black w-1/3">Charging State</th>
                            <th className="p-2 w-1/3">Normal (Non-Charging) State</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-black">
                          {(block.content.caseLedIndications || []).map(row => (
                            <tr key={row.id}>
                              <td className="p-2 font-bold border-r border-black">{row.scenario}</td>
                              <td className="p-2 border-r border-black">{row.chargingState}</td>
                              <td className="p-2">{row.normalState}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <h3 className="font-bold text-slate-900 pt-2">3.5.2 Earbuds LED Indications</h3>
                    <div className="overflow-hidden border border-black rounded-xs">
                      <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-100 border-b border-black text-slate-900 font-bold">
                          <tr>
                            <th className="p-2 border-r border-black w-1/3">Scenario</th>
                            <th className="p-2">Charging / Operating State</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-black">
                          {(block.content.earbudsLedIndications || []).map(row => (
                            <tr key={row.id}>
                              <td className="p-2 font-bold border-r border-black">{row.scenario}</td>
                              <td className="p-2 whitespace-pre-line">{row.chargingState}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {block.content.factoryResetLed && (
                      <div className="pt-2">
                        <h3 className="font-bold text-slate-900 mb-1">3.5.3 Factory Reset LED Indications</h3>
                        <div className="overflow-hidden border border-black rounded-xs">
                          <table className="w-full text-left border-collapse">
                            <tbody>
                              {block.content.factoryResetLed.map(row => (
                                <tr key={row.id}>
                                  <td className="p-2 font-bold border-r border-black w-1/3">{row.scenario}</td>
                                  <td className="p-2 whitespace-pre-line">{row.result}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Charging Guidelines */}
                {block.type === 'charging_guidelines' && (
                  <div className="space-y-4 text-xs">
                    <div className="overflow-hidden border border-black rounded-xs">
                      <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-100 border-b border-black text-slate-900 font-bold">
                          <tr>
                            <th className="p-2 border-r border-black w-1/4">Statement</th>
                            <th className="p-2">Information</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-black">
                          {(block.content.chargingGuidelines || []).map(cg => (
                            <tr key={cg.id}>
                              <td className="p-2 font-bold border-r border-black align-top">{cg.statement}</td>
                              <td className="p-2 whitespace-pre-line leading-relaxed">{cg.information}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Weight Matrix */}
                {block.type === 'weight_matrix' && (
                  <div className="space-y-4 text-xs">
                    {(() => {
                      const wmRows = block.content.weightMatrixRows && block.content.weightMatrixRows.length > 0
                        ? block.content.weightMatrixRows
                        : block.content.weightMatrix
                        ? [{ id: 'wm-row-0', ...block.content.weightMatrix }]
                        : [];

                      const paramSpecs = [
                        { key: 'product', label: 'Product Model Identifier', isBold: true },
                        { key: 'earbudsWeight', label: 'Earbuds Weight', isBold: false },
                        { key: 'caseWeight', label: 'Case Weight', isBold: false },
                        { key: 'length', label: 'Length', isBold: false },
                        { key: 'breadth', label: 'Breadth', isBold: false },
                        { key: 'height', label: 'Height', isBold: false },
                      ] as const;

                      return (
                        <div className="space-y-3">
                          {wmRows.map((row, idx) => (
                            <div key={row.id} className="border border-black rounded-xs overflow-hidden">
                              {wmRows.length > 1 && (
                                <div className="px-2.5 py-1.5 bg-slate-100 border-b border-black font-bold text-xs">
                                  Model #{idx + 1}: {row.product}
                                </div>
                              )}
                              <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-100 border-b border-black text-slate-900 font-bold">
                                  <tr>
                                    <th className="p-2 w-1/3 border-r border-black">Title / Parameter</th>
                                    <th className="p-2">Content / Measurement</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {paramSpecs.map((param, pIdx) => (
                                    <tr key={param.key} className={pIdx < paramSpecs.length - 1 ? 'border-b border-black' : ''}>
                                      <td className="p-2 font-bold border-r border-black bg-slate-50/50">
                                        {param.label}
                                      </td>
                                      <td className={`p-2 ${param.isBold ? 'font-bold' : ''}`}>
                                        {row[param.key]}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* Hearables App Functionalities */}
                {block.type === 'hearables_app' && (
                  <div className="space-y-6 text-xs">
                    {/* SDK / Non-SDK Device Classification Callout */}
                    <div 
                      className="border rounded-sm p-3 flex items-center justify-between gap-3"
                      style={{ borderColor: getBlockAccent(block.id), backgroundColor: `${getBlockAccent(block.id)}08` }}
                    >
                      <p className="text-xs text-slate-800 leading-relaxed">
                        This model is classified as a <span className="font-bold">{document.deviceType}</span> device.
                        SDK devices support the full Hearables app feature set (EQ, touch remapping, OTA updates);
                        Non-SDK devices support the reduced Sound / System app set only.
                      </p>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {(['SDK', 'Non-SDK'] as const).map(dt => (
                          <span
                            key={dt}
                            className={`text-[10px] px-2 py-1 rounded font-bold uppercase tracking-wider border ${
                              document.deviceType === dt ? 'text-white' : 'text-slate-400 bg-white border-slate-200'
                            }`}
                            style={document.deviceType === dt ? { backgroundColor: getBlockAccent(block.id), borderColor: getBlockAccent(block.id) } : {}}
                          >
                            {dt}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="overflow-hidden border border-black rounded-xs">
                      <table className="w-full border-collapse table-fixed">
                        <thead>
                          <tr className="border-b border-black bg-slate-50">
                            {(block.content.hearablesAppTabs || []).map((tab, idx) => (
                              <th 
                                key={tab.id}
                                className={`py-2 px-2 text-center text-xs font-bold text-slate-900 ${
                                  idx < (block.content.hearablesAppTabs || []).length - 1 ? 'border-r border-black' : ''
                                }`}
                                style={{ width: `${100 / (block.content.hearablesAppTabs || []).length}%` }}
                              >
                                {tab.tabName}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            {(block.content.hearablesAppTabs || []).map((tab, idx) => (
                              <td 
                                key={tab.id}
                                className={`p-3 text-center align-top bg-white ${
                                  idx < (block.content.hearablesAppTabs || []).length - 1 ? 'border-r border-black' : ''
                                }`}
                              >
                                <div className="flex justify-center items-center w-full py-1">
                                  <HearablesAppScreenMockup tabType={tab.mockupType} title={tab.tabName} />
                                </div>
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {block.content.hearablesGuideSteps && (
                      <div className="overflow-hidden border border-black rounded-xs">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b border-black">
                              <th className="p-2 bg-slate-100 text-slate-900 font-bold border-r border-black w-1/4">Function</th>
                              <th className="p-2 bg-slate-100 text-slate-900 font-bold">Process</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-black">
                            {block.content.hearablesGuideSteps.map(step => (
                              <tr key={step.id}>
                                <td className="p-2 font-bold border-r border-black align-top">{step.functionName}</td>
                                <td className="p-2 whitespace-pre-line leading-relaxed">{step.process}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* Diagnostics Troubleshooting */}
                {block.type === 'diagnostics_troubleshooting' && (
                  <div className="space-y-6 text-xs">
                    {block.content.serviceChannels && (
                      <div>
                        <h3 className="font-bold text-slate-900 mb-2">{block.sectionNumber}.1 Service Channels</h3>
                        <div className="overflow-hidden border border-black rounded-xs">
                          <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-100 border-b border-black font-bold">
                              <tr>
                                <th className="p-2 border-r border-black w-1/3">Product Name</th>
                                <th className="p-2">Service Channels</th>
                              </tr>
                            </thead>
                            <tbody>
                              {block.content.serviceChannels.map(sc => (
                                <tr key={sc.id}>
                                  <td className="p-2 font-bold border-r border-black align-top">{document.productName}</td>
                                  <td className="p-2 whitespace-pre-line">{sc.details}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    <div>
                      <h3 className="font-bold text-slate-900 mb-2">{block.sectionNumber}.2 Probable FAQs, Actionable Instructions and Resolutions</h3>
                      <div className="overflow-hidden border border-black rounded-xs">
                        <table className="w-full text-left border-collapse">
                          <thead className="bg-slate-100 border-b border-black font-bold">
                            <tr>
                              <th className="p-2 border-r border-black w-1/4">Issues</th>
                              <th className="p-2 border-r border-black w-1/2">Instructions</th>
                              <th className="p-2 w-1/4">Final Resolution</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-black">
                            {(block.content.troubleshootingItems || []).map(item => (
                              <tr key={item.id}>
                                <td className="p-2 font-bold border-r border-black align-top">
                                  {item.issue}
                                </td>
                                <td className="p-2 border-r border-black align-top">
                                  <ul className="list-disc list-inside space-y-1">
                                    {item.instructions.map((step, idx) => (
                                      <li key={idx}><span>{step}</span></li>
                                    ))}
                                  </ul>
                                  {item.appDiagnosticsNote && (
                                    <p className="mt-2 font-normal">
                                      <span className="bg-[#FFFF00] text-black font-bold px-1 py-0.5 inline-block mr-1">App -</span>
                                      {item.appDiagnosticsNote}
                                    </p>
                                  )}
                                </td>
                                <td className="p-2 font-medium align-top">{item.finalResolution}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* Return Codes */}
                {block.type === 'return_codes' && (
                  <div className="overflow-hidden border border-black rounded-xs text-xs">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-slate-100 border-b border-black font-bold">
                        <tr>
                          <th className="p-2 border-r border-black">Product Description</th>
                          <th className="p-2 border-r border-black">EAN Code</th>
                          <th className="p-2 border-r border-black">ASIN</th>
                          <th className="p-2">FSN</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-black">
                        {(block.content.returnCodes || []).map(code => (
                          <tr key={code.id}>
                            <td className="p-2 font-bold border-r border-black">{code.productDesc}</td>
                            <td className="p-2 border-r border-black font-mono">{code.ean}</td>
                            <td className="p-2 border-r border-black font-mono">{code.asin}</td>
                            <td className="p-2 font-mono">{code.fsn}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Annexure */}
                {block.type === 'annexure' && (() => {
                  const items: AnnexureItem[] = (block.content.annexureItems && block.content.annexureItems.length > 0)
                    ? block.content.annexureItems
                    : [
                        {
                          id: 'ann-1',
                          sopTitle: 'Testing Standard Operating Procedure',
                          protocols: block.content.annexureTestingSop || '● Step 1: Visual and cosmetic casing inspection for hairline cracks or water ingress markers.\n● Step 2: Battery terminal voltage verification across charging cradle and earbud pogo pins.\n● Step 3: Audio spectrum sweep and ANC microphone sensitivity calibration test.\n● Step 4: Bluetooth multi-device reconnect speed and 10-meter range validation.',
                          resourceLink: block.content.annexureTutorialLinks || 'https://service-portal.internal.com/training/neo-anc',
                          category: 'QA Testing'
                        },
                        {
                          id: 'ann-2',
                          sopTitle: 'Service & Tutorial Video Links',
                          protocols: 'Complete technical video walkthrough illustrating charging case disassembly, ultrasonic cleaning of acoustic mesh filters, and battery replacement SOP.',
                          resourceLink: block.content.annexureTutorialLinks || 'https://service-portal.internal.com/training/neo-anc',
                          category: 'Tutorial Video'
                        },
                      ];

                  return (
                    <div className="space-y-4 text-xs">
                      <div className="overflow-hidden border border-black rounded-xs">
                        <table className="w-full text-left border-collapse">
                          <thead className="bg-slate-100 border-b border-black font-bold">
                            <tr>
                              <th className="p-2 border-r border-black w-14 text-center">S.No.</th>
                              <th className="p-2 border-r border-black w-1/4">SOP Title / Document</th>
                              <th className="p-2 border-r border-black w-1/2">Testing Protocols & Procedures</th>
                              <th className="p-2 w-1/4">Resource & Video Link</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-black">
                            {items.map((item, idx) => (
                              <tr 
                                key={item.id || idx}
                                className="transition-colors hover:bg-blue-50/10"
                              >
                                <td className="p-2 text-center font-bold font-mono border-r border-black align-top bg-slate-50/50">
                                  {block.sectionNumber ? `${block.sectionNumber}.${idx + 1}` : `${idx + 1}`}
                                </td>
                                <td className="p-2 font-bold text-slate-900 border-r border-black align-top">
                                  <span
                                    onClick={(e) => handleElementClick(e, block.id, `ann-title-${item.id}`, 'table-cell', `Annexure SOP: ${item.sopTitle}`, item.sopTitle, { itemId: item.id, subKey: 'sopTitle', isBold: true })}
                                    className={getClickableClass(block.id, `ann-title-${item.id}`)}
                                  >
                                    {item.sopTitle}
                                  </span>
                                  {item.category && (
                                    <span className="block mt-1 text-[10px] font-medium text-slate-500 font-sans">
                                      [{item.category}]
                                    </span>
                                  )}
                                </td>
                                <td className="p-2 border-r border-black align-top whitespace-pre-line leading-relaxed text-slate-800">
                                  <span
                                    onClick={(e) => handleElementClick(e, block.id, `ann-proto-${item.id}`, 'paragraph', `SOP Protocols (${item.sopTitle})`, item.protocols, { itemId: item.id, subKey: 'protocols' })}
                                    className={getClickableClass(block.id, `ann-proto-${item.id}`)}
                                  >
                                    {item.protocols}
                                  </span>
                                </td>
                                <td className="p-2 align-top break-all">
                                  {item.resourceLink ? (
                                    <span
                                      onClick={(e) => handleElementClick(e, block.id, `ann-link-${item.id}`, 'paragraph', `Link (${item.sopTitle})`, item.resourceLink || '', { itemId: item.id, subKey: 'resourceLink' })}
                                      className={getClickableClass(block.id, `ann-link-${item.id}`)}
                                    >
                                      <a
                                        href={item.resourceLink}
                                        target="_blank"
                                        rel="noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className="text-blue-700 hover:text-blue-900 underline font-mono text-[11px] inline-flex items-center gap-1"
                                      >
                                        <span>{item.resourceLink}</span>
                                      </a>
                                    </span>
                                  ) : (
                                    <span className="text-slate-400 italic">No link specified</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })()}

                {/* Custom Content Elements */}
                {renderCustomContentElements(block)}
              </section>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
