import React, { useState, useMemo } from 'react';
import { 
  ArrowRight, 
  Search,
  Eye,
  CheckCircle2, 
  Layers,
  Sparkles,
  Sliders,
  Check
} from 'lucide-react';
import { ServicePlanDocument, AudioCategory, DeviceType } from '../types';
import { sampleTemplates, getHearablesContentForDeviceType } from '../data/defaultPlans';
import { EarbudsCaseMockup } from './VisualMockups';

interface Screen1SetupProps {
  document: ServicePlanDocument;
  setDocument: React.Dispatch<React.SetStateAction<ServicePlanDocument>>;
  onProceedToEditor: () => void;
  onSelectPreset?: (presetKey: string) => void;
}

const CATEGORY_OPTIONS: { label: string; value: AudioCategory; description: string }[] = [
  { label: 'TWS Earbuds (True Wireless Stereo)', value: 'TWS', description: 'Charging case, in-ear stems/buds, ANC, low-latency' },
  { label: 'Wireless Neckband', value: 'Neckband', description: 'Magnetic behind-the-neck sports earphones' },
  { label: 'Over-Ear & On-Ear Headphones', value: 'Headphones', description: 'Padded earcups, headband mechanism, wired/wireless ANC' },
  { label: 'Wireless Bluetooth Speaker', value: 'Wireless Speaker', description: 'Portable rugged party speaker, multi-driver acoustic array' },
  { label: 'Smart Audio & Wearable Glasses', value: 'Smart Audio', description: 'Open-ear smart glasses, voice assistant & sensor integration' },
];

const DEVICE_TYPE_OPTIONS: { label: string; value: DeviceType }[] = [
  { label: 'SDK', value: 'SDK' },
  { label: 'Non-SDK', value: 'Non-SDK' },
];

export const Screen1Setup: React.FC<Screen1SetupProps> = ({
  document,
  setDocument,
  onProceedToEditor,
  onSelectPreset,
}) => {
  const [selectedPreviewBlockId, setSelectedPreviewBlockId] = useState<string>(
    document.blocks[0]?.id || 'block-header-1'
  );
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleCategoryChange = (category: AudioCategory) => {
    setDocument(prev => ({
      ...prev,
      category,
    }));
  };

  // Switching device type rebinds ONLY the Hearables App section to the SDK (full) or
  // Non-SDK (reduced Sound/System) functionality. All other product-specific content is
  // preserved so the current product stays isolated — no cross-product data leaks.
  const handleDeviceTypeChange = (deviceType: DeviceType) => {
    setDocument(prev => ({
      ...prev,
      deviceType,
      blocks: prev.blocks.map(b =>
        b.type === 'hearables_app'
          ? { ...b, content: getHearablesContentForDeviceType(deviceType) }
          : b
      ),
    }));
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = sampleTemplates.find(t => t.id === templateId);
    if (template) {
      setDocument(JSON.parse(JSON.stringify(template.document)));
      if (template.document.blocks.length > 0) {
        setSelectedPreviewBlockId(template.document.blocks[0].id);
      }
    }
  };

  const handleToggleBlock = (blockId: string) => {
    setDocument(prev => ({
      ...prev,
      blocks: prev.blocks.map(b => (b.id === blockId ? { ...b, enabled: !b.enabled } : b)),
    }));
  };

  const handleSelectAll = (enable: boolean) => {
    setDocument(prev => ({
      ...prev,
      blocks: prev.blocks.map(b => ({ ...b, enabled: enable })),
    }));
  };

  // Filter blocks by search query — selected (enabled) sections always sort to the top
  const filteredBlocks = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    const matched = !q
      ? document.blocks
      : document.blocks.filter(b => 
          b.title.toLowerCase().includes(q) ||
          b.sectionNumber.toLowerCase().includes(q) ||
          b.archetype.toLowerCase().includes(q) ||
          (b.subtitle && b.subtitle.toLowerCase().includes(q))
        );
    return [...matched].sort((a, b) => Number(b.enabled) - Number(a.enabled));
  }, [document.blocks, searchQuery]);

  const activeBlocks = document.blocks.filter(b => b.enabled);
  const selectedPreviewBlock = document.blocks.find(b => b.id === selectedPreviewBlockId) || document.blocks[0];

  return (
    <div className="min-h-[calc(100vh-3.8rem)] bg-[#F9FAFB] py-6 px-4 sm:px-6 lg:px-8 text-[#111827]">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Top Header & Sticky Action Bar */}
        <div className="bg-white rounded-xl p-6 border border-[#E5E7EB] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">
                Service Plan Generator
              </h1>
              <span className="text-[10px] bg-blue-700 text-white px-2 py-0.5 rounded font-mono font-medium">
                STEP 1: CONFIGURATION
              </span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed max-w-2xl">
              Generate, standardize, and customize official service manuals and technical SOP documentation.<br className="hidden sm:inline" />
              Configure product specifications, select procedural blocks, and refine details in the visual editor.
            </p>
          </div>
        </div>

        {/* Quick Presets Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-white rounded-xl border border-[#E5E7EB] shadow-xs text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-700">Quick Audio Presets:</span>
            <span className="text-gray-400 text-[11px]">Load pre-configured blueprints:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {sampleTemplates.map(tpl => (
              <button
                key={tpl.id}
                type="button"
                onClick={() => handleTemplateSelect(tpl.id)}
                className="px-3 py-1 bg-gray-50 hover:bg-gray-100 hover:border-gray-300 border border-gray-200 rounded-md text-xs font-medium text-gray-800 transition-colors"
              >
                {tpl.name}
              </button>
            ))}
          </div>
        </div>

        {/* Card 1: Product Information (Simplified: Model Name, SKU, Category Dropdown) */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="w-5 h-5 rounded-full bg-blue-700 text-white text-[11px] font-bold flex items-center justify-center">
                1
              </span>
              <div>
                <h2 className="font-bold text-gray-900 text-sm">Product Information</h2>
                <p className="text-[11px] text-gray-400">Device model identification and classification</p>
              </div>
            </div>
            <span className="text-[11px] text-gray-400 font-mono">Step 1 of 2</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Product Name */}
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                Product Full Name *
              </label>
              <input
                type="text"
                value={document.productName}
                onChange={e => setDocument(prev => ({ ...prev, productName: e.target.value }))}
                placeholder="e.g. boAt Airdopes Prime 800D"
                className="w-full px-3 py-2 text-xs font-medium rounded-md border border-gray-200 bg-white text-gray-900 focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors"
              />
            </div>

            {/* SKU / Model Code */}
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                Internal Model Code / SKU
              </label>
              <input
                type="text"
                value={document.modelCode}
                onChange={e => setDocument(prev => ({ ...prev, modelCode: e.target.value }))}
                placeholder="e.g. AD-PRIME-800D"
                className="w-full px-3 py-2 text-xs rounded-md border border-gray-200 bg-white text-gray-900 focus:border-black focus:ring-1 focus:ring-black outline-none font-mono transition-colors"
              />
            </div>

            {/* Category Dropdown */}
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                Device Category *
              </label>
              <select
                value={document.category}
                onChange={e => handleCategoryChange(e.target.value as AudioCategory)}
                className="w-full px-3 py-2 text-xs font-medium rounded-md border border-gray-200 bg-white text-gray-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-colors cursor-pointer"
              >
                {CATEGORY_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Device Type: SDK / Non-SDK */}
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                Device Type (SDK / Non-SDK) *
              </label>
              <select
                value={document.deviceType}
                onChange={e => handleDeviceTypeChange(e.target.value as DeviceType)}
                className="w-full px-3 py-2 text-xs font-medium rounded-md border border-gray-200 bg-white text-gray-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-colors cursor-pointer"
              >
                {DEVICE_TYPE_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Card 2: Combined "Select Core Service Plan Sections" + "Section Preview" in 1 Card */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-xs space-y-5">
          {/* Card Header with Counter and Bulk Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="w-5 h-5 rounded-full bg-blue-700 text-white text-[11px] font-bold flex items-center justify-center">
                2
              </span>
              <div>
                <h2 className="font-bold text-gray-900 text-sm">
                  Select Core Service Plan Sections & Live Preview
                </h2>
                <p className="text-[11px] text-gray-400">
                  Select sections to include in the service plan and review sample contents on the right
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs bg-gray-100 text-gray-800 font-semibold px-2.5 py-1 rounded-md">
                {activeBlocks.length} of {document.blocks.length} Sections Active
              </span>
              <div className="flex items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => handleSelectAll(true)}
                  className="font-semibold text-gray-700 hover:text-black transition-colors"
                >
                  Select All
                </button>
                <span className="text-gray-300">|</span>
                <button
                  type="button"
                  onClick={() => handleSelectAll(false)}
                  className="font-semibold text-gray-400 hover:text-gray-700 transition-colors"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>

          {/* 2-Column Combined Layout: Left = Section Checklists, Right = Section Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column (7 Cols): Search Bar & Section Checkbox List */}
            <div className="lg:col-span-7 space-y-3">
              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search sections by title, section number, or keyword..."
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-md border border-gray-200 bg-gray-50/60 focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-700 font-medium"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Sections Checklist Container */}
              <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1 border border-gray-100 rounded-lg p-1.5 bg-gray-50/30">
                {filteredBlocks.length === 0 ? (
                  <div className="py-8 text-center text-xs text-gray-500">
                    No sections match "{searchQuery}"
                  </div>
                ) : (
                  filteredBlocks.map(block => {
                    const isChecked = block.enabled;
                    const isSelectedForPreview = selectedPreviewBlockId === block.id;

                    return (
                      <div
                        key={block.id}
                        onClick={() => setSelectedPreviewBlockId(block.id)}
                        className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer ${
                          isSelectedForPreview
                            ? 'border-blue-600 bg-blue-50/70 ring-1 ring-blue-600/30 shadow-2xs'
                            : isChecked
                            ? 'border-blue-300 bg-blue-50/40 hover:border-blue-400 hover:bg-blue-50/70'
                            : 'border-gray-200 bg-gray-50/50 opacity-60 hover:opacity-80'
                        }`}
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          {/* Standard Clean Checkbox */}
                          <div 
                            className="flex items-center justify-center shrink-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleBlock(block.id);
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleToggleBlock(block.id)}
                              className="w-4 h-4 rounded border-gray-300 text-blue-700 accent-blue-700 focus:ring-blue-600 cursor-pointer"
                            />
                          </div>

                          {/* Section Number & Title */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className={`text-xs font-mono font-bold shrink-0 ${isChecked ? 'text-blue-700' : 'text-gray-500'}`}>
                                § {block.sectionNumber}
                              </span>
                              <span className={`text-xs truncate ${isChecked ? 'font-semibold text-gray-900' : 'text-gray-600 line-through'}`}>
                                {block.title}
                              </span>
                            </div>
                            {block.subtitle && (
                              <p className="text-[11px] text-gray-400 truncate mt-0.5">{block.subtitle}</p>
                            )}
                          </div>
                        </div>

                        {/* Preview Indicator */}
                        <div className="flex items-center gap-2 shrink-0 ml-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedPreviewBlockId(block.id);
                            }}
                            className={`p-1.5 rounded text-xs transition-colors ${
                              isSelectedForPreview
                                ? 'bg-blue-700 text-white'
                                : 'text-gray-400 hover:text-blue-800 hover:bg-blue-50'
                            }`}
                            title="View section preview"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right Column (5 Cols): Live Section Preview */}
            <div className="lg:col-span-5 flex flex-col">
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 flex flex-col h-full min-h-[440px]">
                {/* Preview Box Header */}
                <div className="flex items-center justify-between border-b border-gray-200 pb-2.5 mb-3">
                  <div className="flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-gray-700" />
                    <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                      Section Preview: § {selectedPreviewBlock?.sectionNumber}
                    </span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                    selectedPreviewBlock?.enabled ? 'bg-blue-700 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {selectedPreviewBlock?.enabled ? 'Active' : 'Disabled'}
                  </span>
                </div>

                {/* Preview Content Render Area */}
                <div className="flex-1 overflow-y-auto pr-1 text-xs space-y-3 bg-white p-3.5 rounded border border-gray-200">
                  <div className="border-b border-gray-100 pb-2">
                    <h4 className="font-bold text-gray-900 text-sm mt-0.5">{selectedPreviewBlock?.title}</h4>
                    {selectedPreviewBlock?.subtitle && (
                      <p className="text-[11px] text-gray-500">{selectedPreviewBlock.subtitle}</p>
                    )}
                  </div>

                  {/* Header & Overview Preview */}
                  {selectedPreviewBlock?.type === 'header_overview' && (
                    <div className="space-y-2.5">
                      <p className="text-gray-700 leading-relaxed">{selectedPreviewBlock.content.objective}</p>
                      {selectedPreviewBlock.content.featureHighlights && (
                        <div className="pt-1">
                          <p className="font-bold text-gray-900 mb-1">Key Audio Highlights:</p>
                          <ul className="list-disc list-inside space-y-1 text-gray-600">
                            {selectedPreviewBlock.content.featureHighlights.slice(0, 4).map((f, i) => (
                              <li key={i} className="truncate">{f}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Specifications Table Preview */}
                  {selectedPreviewBlock?.type === 'specifications_table' && (
                    <div className="border border-gray-200 rounded overflow-hidden">
                      <table className="w-full text-left border-collapse text-[11px]">
                        <tbody>
                          {selectedPreviewBlock.content.specifications?.slice(0, 6).map(s => (
                            <tr key={s.id} className="border-b border-gray-100">
                              <td className="p-2 font-semibold text-gray-500 w-1/2 bg-gray-50">{s.key}</td>
                              <td className="p-2 text-gray-900 font-medium">{s.value}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Colour Variants Preview */}
                  {selectedPreviewBlock?.type === 'colour_variants' && (
                    <div className="space-y-2">
                      <p className="text-[11px] text-gray-500 font-medium">Rendered SKU Variant Hardware:</p>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedPreviewBlock.content.colourVariants?.slice(0, 2).map(variant => (
                          <EarbudsCaseMockup
                            key={variant.id}
                            name={variant.name}
                            colorHex={variant.colorHex}
                            secondaryHex={variant.secondaryHex}
                            isSmartVariant={variant.isSmartVariant}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Product Functionalities Preview */}
                  {selectedPreviewBlock?.type === 'product_functionalities' && (
                    <div className="space-y-2">
                      {selectedPreviewBlock.content.functionalities?.slice(0, 3).map(fn => (
                        <div key={fn.id} className="p-2 bg-gray-50 rounded border border-gray-200">
                          <span className="font-bold text-gray-900">{fn.functionName}: </span>
                          <span className="text-gray-600 line-clamp-2">{fn.process}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Diagnostics Troubleshooting Preview */}
                  {selectedPreviewBlock?.type === 'diagnostics_troubleshooting' && (
                    <div className="space-y-2">
                      {selectedPreviewBlock.content.troubleshootingItems?.slice(0, 2).map(tb => (
                        <div key={tb.id} className="p-2.5 bg-gray-50 rounded border border-gray-200">
                          <p className="font-bold text-red-600 mb-0.5">Defect: {tb.issue}</p>
                          <p className="text-gray-600 line-clamp-2">SOP Step: {tb.instructions[0]}</p>
                          <p className="mt-1 font-semibold text-gray-900 text-[11px]">Action: {tb.finalResolution}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Hearables App Preview */}
                  {selectedPreviewBlock?.type === 'hearables_app' && (
                    <div className="space-y-2 text-center py-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2.5 bg-black text-white rounded">
                          <p className="font-bold">Sound Tab</p>
                          <p className="text-[10px] text-gray-400">Dolby & EQ Profiles</p>
                        </div>
                        <div className="p-2.5 bg-black text-white rounded">
                          <p className="font-bold">Controls Tab</p>
                          <p className="text-[10px] text-gray-400">CTC Gesture Remap</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Fallback for other block types */}
                  {!['header_overview', 'specifications_table', 'colour_variants', 'product_functionalities', 'diagnostics_troubleshooting', 'hearables_app'].includes(selectedPreviewBlock?.type || '') && (
                    <div className="p-3 text-gray-600">
                      <p className="font-medium text-gray-800">
                        {selectedPreviewBlock?.title || 'Section Block'}
                      </p>
                      <p className="text-[11px] text-gray-500 mt-1">
                        Formatted tabular parameters and instructions ready for full editing in the visual editor.
                      </p>
                    </div>
                  )}
                </div>

                {/* Section Toggle inside preview footer */}
                <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => handleToggleBlock(selectedPreviewBlock.id)}
                    className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                      selectedPreviewBlock.enabled
                        ? 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                        : 'bg-black hover:bg-gray-800 text-white'
                    }`}
                  >
                    {selectedPreviewBlock.enabled ? 'Disable this Section' : 'Enable this Section'}
                  </button>
                  <button
                    type="button"
                    onClick={onProceedToEditor}
                    className="text-xs font-semibold text-gray-900 hover:underline flex items-center gap-1"
                  >
                    <span>Edit in Canvas</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
