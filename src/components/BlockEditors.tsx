import React, { useRef } from 'react';
import { 
  Plus, 
  Trash2, 
  Sparkles, 
  Tag,
  Type,
  FileText,
  List,
  AlertTriangle,
  Image as ImageIcon,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Info,
  AlertOctagon,
  CheckCircle2,
  Upload,
  Copy,
  Table as TableIcon,
  ExternalLink,
  Link2
} from 'lucide-react';
import { 
  ServicePlanBlock, 
  ContentElement,
  SelectedDocElement,
  WeightMatrixRow,
  AnnexureItem
} from '../types';
import { EarbudsCaseMockup, HearablesAppScreenMockup } from './VisualMockups';
import { DynamicTable } from './DynamicTable';
import { AutoResizeTextarea } from './AutoResizeTextarea';

interface BlockEditorProps {
  block: ServicePlanBlock;
  onChange: (updatedBlock: ServicePlanBlock) => void;
  onOpenToneModal?: (text: string, onReplace: (newText: string) => void) => void;
  selectedElement?: SelectedDocElement | null;
  onSelectDocElement?: (element: SelectedDocElement | null) => void;
}

export const BlockEditors: React.FC<BlockEditorProps> = ({ 
  block, 
  onChange, 
  onOpenToneModal,
  selectedElement,
  onSelectDocElement
}) => {
  // Check if a field or item is currently active in the Customizer
  const isSelected = (fieldId: string, itemId?: string, subKey?: string) => {
    if (!selectedElement) return false;
    if (selectedElement.blockId !== block.id) return false;
    if (selectedElement.fieldId !== fieldId) return false;
    if (itemId && selectedElement.itemId !== itemId) return false;
    if (subKey && selectedElement.subKey !== subKey) return false;
    return true;
  };

  // Trigger element selection for real-time bi-directional editing with Customizer
  const triggerSelect = (
    fieldId: string,
    elementType: SelectedDocElement['elementType'],
    label: string,
    text: string,
    extra?: Partial<SelectedDocElement>
  ) => {
    if (onSelectDocElement) {
      onSelectDocElement({
        blockId: block.id,
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
    }
  };

  // Helper class for focus / active styling
  const getFieldClass = (fieldId: string, itemId?: string, subKey?: string, baseClasses = '') => {
    const active = isSelected(fieldId, itemId, subKey);
    return `${baseClasses} transition-all duration-150 ${
      active 
        ? 'ring-2 ring-blue-600 border-blue-600 bg-blue-50/20 shadow-xs' 
        : 'hover:border-slate-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600'
    }`;
  };

  // Update helpers
  const updateContent = (partialContent: Partial<ServicePlanBlock['content']>) => {
    onChange({
      ...block,
      content: {
        ...block.content,
        ...partialContent,
      },
    });
  };

  const updateTitle = (title: string) => {
    onChange({ 
      ...block, 
      title,
      customization: {
        ...block.customization,
        sectionName: block.customization.isLinkedToTitle !== false ? title : block.customization.sectionName,
      }
    });
  };

  // Reusable array movement helper for dynamic tables
  const moveItem = <T,>(arr: T[], index: number, direction: 'up' | 'down'): T[] => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= arr.length) return arr;
    const copy = [...arr];
    const [removed] = copy.splice(index, 1);
    copy.splice(targetIndex, 0, removed);
    return copy;
  };

  // Reusable arbitrary-position reorder helper for drag-and-drop
  const reorderItem = <T,>(arr: T[], fromIndex: number, toIndex: number): T[] => {
    if (fromIndex === toIndex || fromIndex < 0 || fromIndex >= arr.length || toIndex < 0 || toIndex >= arr.length) return arr;
    const copy = [...arr];
    const [removed] = copy.splice(fromIndex, 1);
    copy.splice(toIndex, 0, removed);
    return copy;
  };

  // Reusable array duplication helper for dynamic tables
  const duplicateItem = <T extends { id?: string }>(arr: T[], index: number): T[] => {
    const item = arr[index];
    const newItem = {
      ...item,
      id: `${item.id || 'item'}-copy-${Date.now()}`,
    };
    const copy = [...arr];
    copy.splice(index + 1, 0, newItem);
    return copy;
  };

  // Move custom element up or down
  const handleMoveCustomElement = (index: number, direction: 'up' | 'down') => {
    const elements = block.content.contentElements || [];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= elements.length) return;

    const updated = [...elements];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);

    updateContent({ contentElements: updated });
  };

  // Render any custom contentElements attached to this block
  const renderCustomContentElements = () => {
    const elements = block.content.contentElements || [];

    return (
      <div className="pt-5 border-t border-slate-200 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Custom Added Content Elements ({elements.length})
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-semibold rounded-full border border-blue-200 whitespace-nowrap shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse shrink-0" />
              Live Synced
            </span>
          </div>
          <span className="text-[11px] text-slate-500">Edit below or customize in right sidebar</span>
        </div>

        {/* List of Custom Elements */}
        {elements.length > 0 ? (
          <div className="space-y-4">
            {elements.map((el, idx) => {
              const active = isSelected(`content-el-${el.id}`, el.id);
              return (
                <div 
                  key={el.id}
                  onClick={() => triggerSelect(`content-el-${el.id}`, el.type, `Element: ${el.type}`, el.text, { 
                    itemId: el.id, 
                    isBold: el.isBold, 
                    textCase: el.textCase, 
                    isBullet: el.isBullet, 
                    listType: el.listType,
                    noteType: el.noteType,
                    imageUrl: el.imageUrl,
                    imageCaption: el.imageCaption 
                  })}
                  className={`p-4 bg-white rounded-xl border transition-all shadow-2xs ${
                    active ? 'border-blue-600 ring-2 ring-blue-600/30 bg-blue-50/10 shadow-sm' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* Element Header with Type Tag, Active Badge, Reorder, Delete */}
                  <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                        el.type === 'table' ? 'bg-blue-100 text-blue-900 border border-blue-200' :
                        el.type === 'heading' ? 'bg-blue-100 text-blue-800' :
                        el.type === 'paragraph' ? 'bg-emerald-100 text-emerald-800' :
                        el.type === 'list' ? 'bg-indigo-100 text-indigo-800' :
                        el.type === 'note' ? 'bg-amber-100 text-amber-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {el.type} #{idx + 1}
                      </span>
                      {active && (
                        <span className="px-2 py-0.5 bg-blue-600 text-white rounded text-[9px] font-bold uppercase tracking-wider">
                          Active in Customizer
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      {/* Move Up */}
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveCustomElement(idx, 'up');
                        }}
                        className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded hover:bg-slate-100"
                        title="Move Up"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>

                      {/* Move Down */}
                      <button
                        type="button"
                        disabled={idx === elements.length - 1}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveCustomElement(idx, 'down');
                        }}
                        className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded hover:bg-slate-100"
                        title="Move Down"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!window.confirm('Delete this element? This cannot be undone.')) return;
                          const updated = elements.filter(item => item.id !== el.id);
                          updateContent({ contentElements: updated });
                        }}
                        className="p-1 text-slate-400 hover:text-red-600 rounded hover:bg-red-50"
                        title="Delete Element"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Element-specific content editors */}
                  {el.type === 'heading' && (
                    <div className="space-y-1.5">
                      <input
                        type="text"
                        value={el.text}
                        onFocus={() => triggerSelect(`content-el-${el.id}`, el.type, 'Heading Element', el.text, { itemId: el.id, isBold: el.isBold, textCase: el.textCase })}
                        onChange={e => {
                          const updated = elements.map(item =>
                            item.id === el.id ? { ...item, text: e.target.value } : item
                          );
                          updateContent({ contentElements: updated });
                        }}
                        className="w-full px-3 py-2 text-sm font-bold uppercase tracking-wider rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white"
                        placeholder="SUB-HEADING TEXT..."
                      />
                    </div>
                  )}

                  {el.type === 'paragraph' && (
                    <div className="space-y-1.5">
                      <AutoResizeTextarea
                        minRows={3}
                        value={el.text}
                        onFocus={() => triggerSelect(`content-el-${el.id}`, el.type, 'Paragraph Element', el.text, { itemId: el.id, isBold: el.isBold, textCase: el.textCase, isBullet: el.isBullet })}
                        onChange={e => {
                          const updated = elements.map(item =>
                            item.id === el.id ? { ...item, text: e.target.value } : item
                          );
                          updateContent({ contentElements: updated });
                        }}
                        className={`w-full p-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-600 leading-relaxed ${
                          el.isBold ? 'font-bold' : ''
                        }`}
                        placeholder="Enter paragraph explanation..."
                      />
                    </div>
                  )}

                  {el.type === 'list' && (
                    <div className="space-y-2">
                      <AutoResizeTextarea
                        minRows={3}
                        value={el.text}
                        onFocus={() => triggerSelect(`content-el-${el.id}`, el.type, 'List Element', el.text, { itemId: el.id, isBold: el.isBold, isBullet: true, listType: el.listType })}
                        onChange={e => {
                          const updated = elements.map(item =>
                            item.id === el.id ? { ...item, text: e.target.value, listItems: e.target.value.split('\n') } : item
                          );
                          updateContent({ contentElements: updated });
                        }}
                        className="w-full p-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-600 leading-relaxed font-mono"
                        placeholder="Enter bullet points (one per line)..."
                      />
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const updatedText = el.text ? `${el.text}\nNew list item` : 'New list item';
                            const updated = elements.map(item =>
                              item.id === el.id ? { ...item, text: updatedText, listItems: updatedText.split('\n') } : item
                            );
                            updateContent({ contentElements: updated });
                          }}
                          className="px-2.5 py-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-md flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" /> Add List Item
                        </button>
                      </div>
                    </div>
                  )}

                  {el.type === 'note' && (
                    <div className="space-y-2">
                      <div className={`p-3 rounded-lg border text-xs ${
                        el.noteType === 'danger' ? 'bg-red-50 border-red-200 text-red-900' :
                        el.noteType === 'info' ? 'bg-blue-50 border-blue-200 text-blue-900' :
                        el.noteType === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' :
                        'bg-amber-50 border-amber-200 text-amber-900'
                      }`}>
                        <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[10px] mb-1">
                          {el.noteType === 'danger' ? <AlertOctagon className="w-3.5 h-3.5" /> :
                           el.noteType === 'info' ? <Info className="w-3.5 h-3.5" /> :
                           el.noteType === 'success' ? <CheckCircle2 className="w-3.5 h-3.5" /> :
                           <AlertTriangle className="w-3.5 h-3.5" />}
                          <span>{el.noteType || 'warning'} Callout</span>
                        </div>
                        <AutoResizeTextarea
                          minRows={2}
                          value={el.text}
                          onFocus={() => triggerSelect(`content-el-${el.id}`, el.type, 'Note / Callout', el.text, { itemId: el.id, isBold: el.isBold, noteType: el.noteType })}
                          onChange={e => {
                            const updated = elements.map(item =>
                              item.id === el.id ? { ...item, text: e.target.value } : item
                            );
                            updateContent({ contentElements: updated });
                          }}
                          className="w-full p-2 text-xs rounded border border-slate-300 focus:outline-none bg-white font-medium"
                          placeholder="Enter note or technician advisory..."
                        />
                      </div>
                    </div>
                  )}

                  {el.type === 'table' && (
                    <div className="space-y-3 bg-slate-50/50 p-3 rounded-lg border border-slate-200">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 uppercase mb-0.5">Table Header Title</label>
                        <input
                          type="text"
                          value={el.text || ''}
                          onFocus={() => triggerSelect(`content-el-${el.id}`, el.type, 'Table Specification', el.text, { itemId: el.id, tableColumns: el.tableColumns, tableRows: el.tableRows })}
                          onChange={e => {
                            const updated = elements.map(item =>
                              item.id === el.id ? { ...item, text: e.target.value } : item
                            );
                            updateContent({ contentElements: updated });
                          }}
                          className="w-full px-2.5 py-1.5 text-xs font-bold rounded border border-slate-300 bg-white"
                          placeholder="TABLE SPECIFICATION TITLE..."
                        />
                      </div>

                      {/* Interactive Table Grid */}
                      <div className="overflow-x-auto border border-slate-200 rounded-md bg-white">
                        <table className="w-full text-xs text-left border-collapse">
                          <thead>
                            <tr className="bg-slate-100 border-b border-slate-200">
                              {(el.tableColumns || ['Parameter', 'Specification Standard', 'Acceptance Value']).map((col, cIdx) => (
                                <th key={cIdx} className="p-1.5 font-bold text-[10px] uppercase text-slate-700 border-r border-slate-200 last:border-r-0">
                                  <input
                                    type="text"
                                    value={col}
                                    onChange={e => {
                                      const nextCols = [...(el.tableColumns || ['Parameter', 'Specification Standard', 'Acceptance Value'])];
                                      nextCols[cIdx] = e.target.value;
                                      const updated = elements.map(item =>
                                        item.id === el.id ? { ...item, tableColumns: nextCols } : item
                                      );
                                      updateContent({ contentElements: updated });
                                    }}
                                    className="w-full bg-transparent font-bold text-slate-800 text-[10px] outline-none"
                                    placeholder={`Col ${cIdx + 1}`}
                                  />
                                </th>
                              ))}
                              <th className="p-1 text-center w-8">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const cols = el.tableColumns || ['Parameter', 'Specification Standard', 'Acceptance Value'];
                                    const nextCols = [...cols, `Column ${cols.length + 1}`];
                                    const updated = elements.map(item =>
                                      item.id === el.id ? { ...item, tableColumns: nextCols } : item
                                    );
                                    updateContent({ contentElements: updated });
                                  }}
                                  className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                  title="Add Column"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {(el.tableRows || [
                              { id: 'r1', 'col-0': 'Battery Terminal Voltage', 'col-1': '3.70V - 4.20V DC', 'col-2': 'Pass: No Drop' },
                              { id: 'r2', 'col-0': 'Charging Pin Resistance', 'col-1': '< 0.5 Ω (Clean Pogo)', 'col-2': 'Pass: Continuous' },
                            ]).map((row, rIdx) => {
                              const cols = el.tableColumns || ['Parameter', 'Specification Standard', 'Acceptance Value'];
                              return (
                                <tr key={row.id || rIdx} className="border-b border-slate-100 last:border-b-0">
                                  {cols.map((_, cIdx) => (
                                    <td key={cIdx} className="p-1.5 border-r border-slate-200 last:border-r-0">
                                      <input
                                        type="text"
                                        value={row[`col-${cIdx}`] || (row as any)[cols[cIdx]] || ''}
                                        onChange={e => {
                                          const currentRows = el.tableRows || [
                                            { id: 'r1', 'col-0': 'Battery Terminal Voltage', 'col-1': '3.70V - 4.20V DC', 'col-2': 'Pass: No Drop' },
                                            { id: 'r2', 'col-0': 'Charging Pin Resistance', 'col-1': '< 0.5 Ω (Clean Pogo)', 'col-2': 'Pass: Continuous' },
                                          ];
                                          const nextRows = [...currentRows];
                                          nextRows[rIdx] = {
                                            ...nextRows[rIdx],
                                            [`col-${cIdx}`]: e.target.value,
                                          };
                                          const updated = elements.map(item =>
                                            item.id === el.id ? { ...item, tableRows: nextRows } : item
                                          );
                                          updateContent({ contentElements: updated });
                                        }}
                                        className="w-full bg-transparent text-slate-700 text-xs outline-none"
                                        placeholder="Value..."
                                      />
                                    </td>
                                  ))}
                                  <td className="p-1 text-center">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const currentRows = el.tableRows || [
                                          { id: 'r1', 'col-0': 'Battery Terminal Voltage', 'col-1': '3.70V - 4.20V DC', 'col-2': 'Pass: No Drop' },
                                          { id: 'r2', 'col-0': 'Charging Pin Resistance', 'col-1': '< 0.5 Ω (Clean Pogo)', 'col-2': 'Pass: Continuous' },
                                        ];
                                        if (currentRows.length <= 1) return;
                                        if (!window.confirm('Delete this table row? This cannot be undone.')) return;
                                        const nextRows = currentRows.filter((_, idx) => idx !== rIdx);
                                        const updated = elements.map(item =>
                                          item.id === el.id ? { ...item, tableRows: nextRows } : item
                                        );
                                        updateContent({ contentElements: updated });
                                      }}
                                      className="p-1 text-slate-400 hover:text-red-600 rounded"
                                      title="Delete Row"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const cols = el.tableColumns || ['Parameter', 'Specification Standard', 'Acceptance Value'];
                            const currentRows = el.tableRows || [
                              { id: 'r1', 'col-0': 'Battery Terminal Voltage', 'col-1': '3.70V - 4.20V DC', 'col-2': 'Pass: No Drop' },
                              { id: 'r2', 'col-0': 'Charging Pin Resistance', 'col-1': '< 0.5 Ω (Clean Pogo)', 'col-2': 'Pass: Continuous' },
                            ];
                            const newRow: any = { id: `row-${Date.now()}` };
                            cols.forEach((_, idx) => {
                              newRow[`col-${idx}`] = idx === 0 ? `Item ${currentRows.length + 1}` : '-';
                            });
                            const nextRows = [...currentRows, newRow];
                            const updated = elements.map(item =>
                              item.id === el.id ? { ...item, tableRows: nextRows } : item
                            );
                            updateContent({ contentElements: updated });
                          }}
                          className="px-2.5 py-1 text-[11px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" /> Add Table Row
                        </button>
                      </div>
                    </div>
                  )}

                  {el.type === 'image' && (
                    <div className="space-y-2.5">
                      {el.imageUrl && (
                        <div className="w-full h-36 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 flex items-center justify-center p-1">
                          <img
                            src={el.imageUrl}
                            alt={el.text || 'Schematic Diagram'}
                            className="max-h-full max-w-full object-contain rounded"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-700 uppercase mb-0.5">Image URL</label>
                          <input
                            type="text"
                            value={el.imageUrl || ''}
                            onFocus={() => triggerSelect(`content-el-${el.id}`, el.type, 'Diagram Image', el.text, { itemId: el.id, imageUrl: el.imageUrl, imageCaption: el.imageCaption })}
                            onChange={e => {
                              const updated = elements.map(item =>
                                item.id === el.id ? { ...item, imageUrl: e.target.value } : item
                              );
                              updateContent({ contentElements: updated });
                            }}
                            className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300 font-mono"
                            placeholder="https://..."
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-700 uppercase mb-0.5">Figure Caption</label>
                          <input
                            type="text"
                            value={el.imageCaption || el.text || ''}
                            onFocus={() => triggerSelect(`content-el-${el.id}`, el.type, 'Diagram Image', el.text, { itemId: el.id, imageUrl: el.imageUrl, imageCaption: el.imageCaption })}
                            onChange={e => {
                              const updated = elements.map(item =>
                                item.id === el.id ? { ...item, imageCaption: e.target.value, text: e.target.value } : item
                              );
                              updateContent({ contentElements: updated });
                            }}
                            className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300"
                            placeholder="Fig 1.1: Component Layout"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-4 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            <p className="text-xs text-slate-500 font-medium">
              No extra content elements added yet.
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderBlockEditorBody = () => {
    switch (block.type) {
      case 'header_overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Section Title</label>
                <input
                  type="text"
                  value={block.title}
                  onFocus={() => triggerSelect('title', 'title', 'Section Title', block.title, { isBold: true })}
                  onClick={() => triggerSelect('title', 'title', 'Section Title', block.title, { isBold: true })}
                  onChange={e => updateTitle(e.target.value)}
                  className={getFieldClass('title', undefined, undefined, "w-full px-3 py-2 text-sm font-semibold rounded-lg border border-slate-300 focus:outline-none")}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Document Owner</label>
                <input
                  type="text"
                  value={block.content.documentOwner || ''}
                  onFocus={() => triggerSelect('documentOwner', 'paragraph', 'Document Owner', block.content.documentOwner || '')}
                  onClick={() => triggerSelect('documentOwner', 'paragraph', 'Document Owner', block.content.documentOwner || '')}
                  onChange={e => updateContent({ documentOwner: e.target.value })}
                  placeholder="e.g. Product Manager - Audio"
                  className={getFieldClass('documentOwner', undefined, undefined, "w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none")}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-slate-700">Document Objective / Purpose</label>
                {onOpenToneModal && (
                  <button
                    type="button"
                    onClick={() => onOpenToneModal(block.content.objective || '', newText => updateContent({ objective: newText }))}
                    className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" /> Polish with AI
                  </button>
                )}
              </div>
              <AutoResizeTextarea
                minRows={3}
                value={block.content.objective || ''}
                onFocus={() => triggerSelect('objective', 'paragraph', 'Document Objective', block.content.objective || '')}
                onClick={() => triggerSelect('objective', 'paragraph', 'Document Objective', block.content.objective || '')}
                onChange={e => updateContent({ objective: e.target.value })}
                className={getFieldClass('objective', undefined, undefined, "w-full p-3 text-sm rounded-lg border border-slate-300 focus:outline-none leading-relaxed")}
                placeholder="State the technical diagnostic and service purpose..."
              />
            </div>

            {/* Feature Highlights Manager */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold text-slate-700">Key Feature Highlights (Bullet List)</label>
                <button
                  type="button"
                  onClick={() => {
                    const current = block.content.featureHighlights || [];
                    updateContent({ featureHighlights: [...current, 'New audio feature highlight'] });
                  }}
                  className="px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-md text-xs font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Highlight
                </button>
              </div>

              <div className="space-y-2">
                {(block.content.featureHighlights || []).map((highlight, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="w-5 text-xs font-mono font-bold text-slate-400 text-right">{idx + 1}.</span>
                    <input
                      type="text"
                      value={highlight}
                      onFocus={() => triggerSelect(`feature-${idx}`, 'list', `Feature Highlight #${idx + 1}`, highlight, { itemId: `${idx}`, isBullet: true })}
                      onClick={() => triggerSelect(`feature-${idx}`, 'list', `Feature Highlight #${idx + 1}`, highlight, { itemId: `${idx}`, isBullet: true })}
                      onChange={e => {
                        const updated = [...(block.content.featureHighlights || [])];
                        updated[idx] = e.target.value;
                        updateContent({ featureHighlights: updated });
                      }}
                      className={getFieldClass(`feature-${idx}`, `${idx}`, undefined, "flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none")}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = (block.content.featureHighlights || []).filter((_, i) => i !== idx);
                        updateContent({ featureHighlights: updated });
                      }}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'technical_definitions': {
        const defs = block.content.definitions || [];
        return (
          <div className="space-y-5">
            <DynamicTable
              title="Technical Glossary & Abbreviations"
              subtitle="Service terms mapped to standard definitions"
              data={defs}
              addButtonLabel="Add Term"
              onAddRow={() => {
                updateContent({
                  definitions: [...defs, { id: `def-${Date.now()}`, term: 'NEW_TERM', definition: 'New definition' }],
                });
              }}
              onDeleteRow={(idx) => {
                const updated = defs.filter((_, i) => i !== idx);
                updateContent({ definitions: updated });
              }}
              onMoveRow={(idx, dir) => {
                updateContent({ definitions: moveItem(defs, idx, dir) });
              }}
              onReorderRow={(from, to) => {
                updateContent({ definitions: reorderItem(defs, from, to) });
              }}
              onDuplicateRow={(idx) => {
                updateContent({ definitions: duplicateItem(defs, idx) });
              }}
              columns={[
                {
                  key: 'term',
                  header: 'Terms / Abbreviations',
                  width: 'w-1/3 min-w-[150px]',
                  render: (item, idx) => (
                    <input
                      type="text"
                      value={item.term}
                      onFocus={() => triggerSelect(`def-${item.id}-term`, 'definition', `Glossary Term: ${item.term}`, item.term, { itemId: item.id, subKey: 'term', isBold: true })}
                      onClick={() => triggerSelect(`def-${item.id}-term`, 'definition', `Glossary Term: ${item.term}`, item.term, { itemId: item.id, subKey: 'term', isBold: true })}
                      onChange={e => {
                        const updated = [...defs];
                        updated[idx] = { ...updated[idx], term: e.target.value };
                        updateContent({ definitions: updated });
                      }}
                      className={getFieldClass(`def-${item.id}-term`, item.id, 'term', "w-full px-2.5 py-1.5 font-bold text-blue-900 rounded border border-slate-200 focus:outline-none bg-white")}
                    />
                  ),
                },
                {
                  key: 'definition',
                  header: 'Definitions',
                  render: (item, idx) => (
                    <input
                      type="text"
                      value={item.definition}
                      onFocus={() => triggerSelect(`def-${item.id}-def`, 'definition', `Definition (${item.term})`, item.definition, { itemId: item.id, subKey: 'definition' })}
                      onClick={() => triggerSelect(`def-${item.id}-def`, 'definition', `Definition (${item.term})`, item.definition, { itemId: item.id, subKey: 'definition' })}
                      onChange={e => {
                        const updated = [...defs];
                        updated[idx] = { ...updated[idx], definition: e.target.value };
                        updateContent({ definitions: updated });
                      }}
                      className={getFieldClass(`def-${item.id}-def`, item.id, 'definition', "w-full px-2.5 py-1.5 text-slate-700 rounded border border-slate-200 focus:outline-none bg-white")}
                    />
                  ),
                },
              ]}
            />
          </div>
        );
      }

      case 'specifications_table': {
        const specs = block.content.specifications || [];
        return (
          <div className="space-y-5">
            <DynamicTable
              title="Acoustic & Hardware Specifications"
              subtitle="Key performance benchmarks and driver parameters"
              data={specs}
              addButtonLabel="Add Spec Row"
              onAddRow={() => {
                updateContent({
                  specifications: [...specs, { id: `sp-${Date.now()}`, key: 'New Specification', value: 'Value', highlight: false }],
                });
              }}
              onDeleteRow={(idx) => {
                const updated = specs.filter((_, i) => i !== idx);
                updateContent({ specifications: updated });
              }}
              onMoveRow={(idx, dir) => {
                updateContent({ specifications: moveItem(specs, idx, dir) });
              }}
              onReorderRow={(from, to) => {
                updateContent({ specifications: reorderItem(specs, from, to) });
              }}
              onDuplicateRow={(idx) => {
                updateContent({ specifications: duplicateItem(specs, idx) });
              }}
              columns={[
                {
                  key: 'key',
                  header: 'Parameter Name',
                  width: 'w-2/5 min-w-[160px]',
                  render: (item, idx) => (
                    <input
                      type="text"
                      value={item.key}
                      onFocus={() => triggerSelect(`spec-key-${item.id}`, 'table-cell', `Spec Parameter: ${item.key}`, item.key, { itemId: item.id, subKey: 'key', isBold: true })}
                      onClick={() => triggerSelect(`spec-key-${item.id}`, 'table-cell', `Spec Parameter: ${item.key}`, item.key, { itemId: item.id, subKey: 'key', isBold: true })}
                      onChange={e => {
                        const updated = [...specs];
                        updated[idx] = { ...updated[idx], key: e.target.value };
                        updateContent({ specifications: updated });
                      }}
                      className={getFieldClass(`spec-key-${item.id}`, item.id, 'key', "w-full px-2.5 py-1.5 font-semibold text-slate-800 rounded border border-slate-200 focus:outline-none bg-white")}
                    />
                  ),
                },
                {
                  key: 'value',
                  header: 'Specification Value',
                  render: (item, idx) => (
                    <input
                      type="text"
                      value={item.value}
                      onFocus={() => triggerSelect(`spec-val-${item.id}`, 'table-cell', `Spec Value: ${item.key}`, item.value, { itemId: item.id, subKey: 'value' })}
                      onClick={() => triggerSelect(`spec-val-${item.id}`, 'table-cell', `Spec Value: ${item.key}`, item.value, { itemId: item.id, subKey: 'value' })}
                      onChange={e => {
                        const updated = [...specs];
                        updated[idx] = { ...updated[idx], value: e.target.value };
                        updateContent({ specifications: updated });
                      }}
                      className={getFieldClass(`spec-val-${item.id}`, item.id, 'value', "w-full px-2.5 py-1.5 text-slate-900 rounded border border-slate-200 focus:outline-none bg-white font-medium")}
                    />
                  ),
                },
                {
                  key: 'highlight',
                  header: 'Highlight',
                  width: 'w-20',
                  align: 'center',
                  render: (item, idx) => (
                    <div className="flex justify-center items-center py-1">
                      <input
                        type="checkbox"
                        checked={!!item.highlight}
                        onChange={e => {
                          const updated = [...specs];
                          updated[idx] = { ...updated[idx], highlight: e.target.checked };
                          updateContent({ specifications: updated });
                        }}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                        title="Highlight this specification row in PDF output"
                      />
                    </div>
                  ),
                },
              ]}
            />

            {/* Callout Note Box */}
            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
              <label className="block text-xs font-bold text-amber-900 mb-1">
                Specification Testing Condition Note
              </label>
              <AutoResizeTextarea
                minRows={2}
                value={block.customization.noteText || ''}
                onFocus={() => triggerSelect('customization-noteText', 'note', 'Specification Note', block.customization.noteText || '')}
                onClick={() => triggerSelect('customization-noteText', 'note', 'Specification Note', block.customization.noteText || '')}
                onChange={e =>
                  onChange({
                    ...block,
                    customization: {
                      ...block.customization,
                      showNote: true,
                      noteText: e.target.value,
                    },
                  })
                }
                className={getFieldClass('customization-noteText', undefined, undefined, "w-full p-2 text-xs rounded border border-amber-300 bg-white text-slate-800 focus:outline-none")}
                placeholder="e.g. Music Playtime of 45 hours per charge is based on listening at 60% volume..."
              />
            </div>
          </div>
        );
      }

      case 'packaging_contents':
        return (
          <div className="space-y-5">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-slate-900">In-Box Packaging Contents</h3>
                <p className="text-xs text-slate-500">List of standard accessories provided inside the sales box</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const current = block.content.packagingList || [];
                  updateContent({ packagingList: [...current, 'New Box Accessory'] });
                }}
                className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" /> Add Item
              </button>
            </div>

            <div className="space-y-2">
              {(block.content.packagingList || []).map((pkg, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-6 text-xs font-mono font-bold text-slate-400 text-right">{idx + 1}.</span>
                  <input
                    type="text"
                    value={pkg}
                    onFocus={() => triggerSelect(`pkg-${idx}`, 'list', `Packaging Item #${idx + 1}`, pkg, { itemId: `${idx}`, isBullet: true })}
                    onClick={() => triggerSelect(`pkg-${idx}`, 'list', `Packaging Item #${idx + 1}`, pkg, { itemId: `${idx}`, isBullet: true })}
                    onChange={e => {
                      const updated = [...(block.content.packagingList || [])];
                      updated[idx] = e.target.value;
                      updateContent({ packagingList: updated });
                    }}
                    className={getFieldClass(`pkg-${idx}`, `${idx}`, undefined, "flex-1 px-3 py-2 text-xs rounded-lg border border-slate-300 font-medium focus:outline-none")}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!window.confirm('Delete this packaging item? This cannot be undone.')) return;
                      const updated = (block.content.packagingList || []).filter((_, i) => i !== idx);
                      updateContent({ packagingList: updated });
                    }}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'colour_variants': {
        const variants = block.content.colourVariants || [];

        const handleMoveVariant = (index: number, direction: 'left' | 'right') => {
          const targetIndex = direction === 'left' ? index - 1 : index + 1;
          if (targetIndex < 0 || targetIndex >= variants.length) return;
          const updated = [...variants];
          const [moved] = updated.splice(index, 1);
          updated.splice(targetIndex, 0, moved);
          updateContent({ colourVariants: updated });
        };

        const handleDuplicateVariant = (index: number) => {
          const item = variants[index];
          const newItem = {
            ...item,
            id: `cv-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            name: `${item.name} (Copy)`,
          };
          const updated = [...variants];
          updated.splice(index + 1, 0, newItem);
          updateContent({ colourVariants: updated });
        };

        const handleDeleteVariant = (index: number) => {
          if (!window.confirm(`Delete the "${variants[index]?.name || 'variant'}" colour variant? This cannot be undone.`)) return;
          const updated = variants.filter((_, i) => i !== index);
          updateContent({ colourVariants: updated });
        };

        const handleAddVariant = () => {
          const palettePresets = [
            { name: 'Active Black', colorHex: '#0f172a', secondaryHex: '#38bdf8' },
            { name: 'Pure White', colorHex: '#f8fafc', secondaryHex: '#94a3b8' },
            { name: 'Deep Navy', colorHex: '#1e3a8a', secondaryHex: '#60a5fa' },
            { name: 'Sage Green', colorHex: '#365314', secondaryHex: '#a3e635' },
            { name: 'Sunset Crimson', colorHex: '#9f1239', secondaryHex: '#fb7185' },
            { name: 'Graphite Grey', colorHex: '#334155', secondaryHex: '#cbd5e1' },
          ];
          const preset = palettePresets[variants.length % palettePresets.length];
          const newVariant = {
            id: `cv-${Date.now()}`,
            name: `Variant ${variants.length + 1} (${preset.name})`,
            colorHex: preset.colorHex,
            secondaryHex: preset.secondaryHex,
            imageDesc: `${preset.name} finish with matching charging case`,
            isSmartVariant: false,
          };
          updateContent({ colourVariants: [...variants, newVariant] });
        };

        const handleImageUpload = (index: number, file: File) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const result = e.target?.result as string;
            const updated = [...variants];
            updated[index] = {
              ...updated[index],
              imageUrl: result,
            };
            updateContent({ colourVariants: updated });
          };
          reader.readAsDataURL(file);
        };

        const handleResetImage = (index: number) => {
          const updated = [...variants];
          const target = { ...updated[index] };
          delete target.imageUrl;
          updated[index] = target;
          updateContent({ colourVariants: updated });
        };

        return (
          <div className="space-y-5">
            {/* Header Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex flex-wrap items-center gap-2">
                  <span className="shrink-0">Product Colour Variants</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 rounded-full whitespace-nowrap shrink-0">
                    {variants.length} {variants.length === 1 ? 'Variant' : 'Variants'}
                  </span>
                </h3>
                <p className="text-xs text-slate-500">
                  Clean 3-column finish gallery. Replace images individually or preview dynamic SVG mockups.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddVariant}
                className="px-3.5 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
              >
                <Plus className="w-4 h-4" /> Add Colourway
              </button>
            </div>

            {/* Responsive Auto-Fitting Grid so cards never compress below comfortable width */}
            <div className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-4">
              {variants.map((variant, idx) => {
                const isItemActive = isSelected(`variant-${variant.id}`, variant.id);

                return (
                  <div
                    key={variant.id}
                    className={`flex flex-col bg-white rounded-xl border transition-all duration-200 overflow-hidden shadow-2xs hover:shadow-sm min-w-0 ${
                      isItemActive ? 'border-blue-600 ring-2 ring-blue-600/30' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {/* Top Action Bar (Index & Reorder/Duplicate/Delete) */}
                    <div className="flex items-center justify-between px-3 py-2 bg-slate-50 border-b border-slate-200">
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[11px] font-bold text-slate-600 font-mono">
                          #{idx + 1}
                        </span>
                        {variant.isSmartVariant && (
                          <span className="px-1.5 py-0.5 text-[9px] font-bold bg-amber-100 text-amber-800 border border-amber-300 rounded whitespace-nowrap">
                            SMART
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-0.5 shrink-0">
                        {/* Move Left / Up */}
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveVariant(idx, 'left')}
                          title="Move Left"
                          className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:pointer-events-none rounded hover:bg-slate-200"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </button>
                        {/* Move Right / Down */}
                        <button
                          type="button"
                          disabled={idx === variants.length - 1}
                          onClick={() => handleMoveVariant(idx, 'right')}
                          title="Move Right"
                          className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:pointer-events-none rounded hover:bg-slate-200"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                        {/* Duplicate */}
                        <button
                          type="button"
                          onClick={() => handleDuplicateVariant(idx)}
                          title="Duplicate Variant"
                          className="p-1 text-slate-400 hover:text-blue-600 rounded hover:bg-blue-50 ml-0.5"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() => handleDeleteVariant(idx)}
                          title="Delete Variant"
                          className="p-1 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 ml-0.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* 1. Product Image on Top */}
                    <div className="relative w-full aspect-square bg-slate-50/80 p-3 flex flex-col items-center justify-center border-b border-slate-100 group overflow-hidden">
                      {variant.imageUrl ? (
                        <img
                          src={variant.imageUrl}
                          alt={variant.name}
                          className="w-full h-full object-contain drop-shadow-sm transition-transform duration-200 group-hover:scale-102"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <EarbudsCaseMockup
                            name={variant.name}
                            colorHex={variant.colorHex}
                            secondaryHex={variant.secondaryHex}
                            isSmartVariant={variant.isSmartVariant}
                            showNameBelow={false}
                            className="w-full h-full max-h-32 bg-transparent border-0 p-0 shadow-none hover:shadow-none"
                          />
                        </div>
                      )}

                      {/* Image Replacement Toolbar */}
                      <div className="absolute inset-x-2 bottom-2 flex items-center justify-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                        <input
                          type="file"
                          id={`variant-upload-${variant.id}`}
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(idx, file);
                          }}
                        />
                        <label
                          htmlFor={`variant-upload-${variant.id}`}
                          className="cursor-pointer px-2.5 py-1 bg-white/95 hover:bg-white text-slate-700 hover:text-blue-700 border border-slate-300 rounded-md text-[11px] font-semibold shadow-xs flex items-center gap-1 backdrop-blur-xs transition-colors whitespace-nowrap"
                        >
                          <Upload className="w-3 h-3 text-blue-600 shrink-0" />
                          <span>{variant.imageUrl ? 'Replace Image' : 'Upload Image'}</span>
                        </label>

                        {variant.imageUrl && (
                          <button
                            type="button"
                            onClick={() => handleResetImage(idx)}
                            title="Reset to Vector Mockup"
                            className="p-1 bg-white/95 hover:bg-red-50 text-slate-500 hover:text-red-600 border border-slate-300 rounded-md text-[11px] shadow-xs backdrop-blur-xs transition-colors shrink-0"
                          >
                            <RotateCcw className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* 2. Editable Colour Name & Swatches Below */}
                    <div className="p-3 flex flex-col space-y-3 flex-1 justify-between bg-white min-w-0">
                      <div className="min-w-0">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 whitespace-nowrap">
                          Colourway Name
                        </label>
                        <input
                          type="text"
                          value={variant.name}
                          onFocus={() => triggerSelect(`variant-${variant.id}`, 'heading', `Variant: ${variant.name}`, variant.name, { itemId: variant.id, isBold: true })}
                          onClick={() => triggerSelect(`variant-${variant.id}`, 'heading', `Variant: ${variant.name}`, variant.name, { itemId: variant.id, isBold: true })}
                          onChange={e => {
                            const updated = [...variants];
                            updated[idx] = { ...updated[idx], name: e.target.value };
                            updateContent({ colourVariants: updated });
                          }}
                          placeholder="e.g. Active Black"
                          className={getFieldClass(`variant-${variant.id}`, variant.id, undefined, "w-full px-2.5 py-1.5 font-bold text-xs text-slate-900 bg-white rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 min-w-0")}
                        />
                      </div>

                      {/* Color Pickers (Primary & Trim) */}
                      <div className="grid grid-cols-2 gap-2 pt-0.5">
                        <div className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-lg border border-slate-200 min-w-0 overflow-hidden">
                          <input
                            type="color"
                            value={variant.colorHex}
                            onChange={e => {
                              const updated = [...variants];
                              updated[idx] = { ...updated[idx], colorHex: e.target.value };
                              updateContent({ colourVariants: updated });
                            }}
                            className="w-5 h-5 rounded cursor-pointer border border-slate-300 p-0 shrink-0"
                            title="Pick Primary Color"
                          />
                          <div className="min-w-0 flex-1 overflow-hidden">
                            <span className="block text-[9px] font-bold text-slate-500 leading-none mb-0.5 whitespace-nowrap truncate">Primary</span>
                            <input
                              type="text"
                              value={variant.colorHex}
                              onChange={e => {
                                const updated = [...variants];
                                updated[idx] = { ...updated[idx], colorHex: e.target.value };
                                updateContent({ colourVariants: updated });
                              }}
                              className="w-full text-[10px] font-mono font-semibold uppercase bg-transparent text-slate-800 focus:outline-none truncate"
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-lg border border-slate-200 min-w-0 overflow-hidden">
                          <input
                            type="color"
                            value={variant.secondaryHex || '#334155'}
                            onChange={e => {
                              const updated = [...variants];
                              updated[idx] = { ...updated[idx], secondaryHex: e.target.value };
                              updateContent({ colourVariants: updated });
                            }}
                            className="w-5 h-5 rounded cursor-pointer border border-slate-300 p-0 shrink-0"
                            title="Pick Accent Trim Color"
                          />
                          <div className="min-w-0 flex-1 overflow-hidden">
                            <span className="block text-[9px] font-bold text-slate-500 leading-none mb-0.5 whitespace-nowrap truncate">Trim</span>
                            <input
                              type="text"
                              value={variant.secondaryHex || '#334155'}
                              onChange={e => {
                                const updated = [...variants];
                                updated[idx] = { ...updated[idx], secondaryHex: e.target.value };
                                updateContent({ colourVariants: updated });
                              }}
                              className="w-full text-[10px] font-mono font-semibold uppercase bg-transparent text-slate-800 focus:outline-none truncate"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Smart Badge & Catalog Note */}
                      <div className="pt-1 flex items-center justify-between gap-2 border-t border-slate-100 text-[11px]">
                        <label className="flex items-center gap-1.5 font-semibold text-slate-700 cursor-pointer select-none whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={!!variant.isSmartVariant}
                            onChange={e => {
                              const updated = [...variants];
                              updated[idx] = { ...updated[idx], isSmartVariant: e.target.checked };
                              updateContent({ colourVariants: updated });
                            }}
                            className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5 shrink-0"
                          />
                          <span className="text-[11px] whitespace-nowrap">Smart Edition</span>
                        </label>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }

      case 'product_functionalities': {
        const fns = block.content.functionalities || [];
        return (
          <div className="space-y-5">
            <DynamicTable
              title="Product Functionalities & Touch Controls"
              subtitle="Operating procedures, gestures, and hardware resets"
              data={fns}
              addButtonLabel="Add Function"
              onAddRow={() => {
                updateContent({
                  functionalities: [
                    ...fns,
                    {
                      id: `fn-${Date.now()}`,
                      functionName: 'New Function',
                      process: 'Step-by-step operating instructions...',
                    },
                  ],
                });
              }}
              onDeleteRow={(idx) => {
                const updated = fns.filter((_, i) => i !== idx);
                updateContent({ functionalities: updated });
              }}
              onMoveRow={(idx, dir) => {
                updateContent({ functionalities: moveItem(fns, idx, dir) });
              }}
              onReorderRow={(from, to) => {
                updateContent({ functionalities: reorderItem(fns, from, to) });
              }}
              onDuplicateRow={(idx) => {
                updateContent({ functionalities: duplicateItem(fns, idx) });
              }}
              columns={[
                {
                  key: 'index',
                  header: '#',
                  width: 'w-12',
                  align: 'center',
                  render: (_, idx) => (
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-xs font-bold font-mono">
                      {idx + 1}
                    </span>
                  ),
                },
                {
                  key: 'functionName',
                  header: 'Function',
                  width: 'w-1/4 min-w-[170px]',
                  render: (fn, idx) => (
                    <input
                      type="text"
                      value={fn.functionName}
                      onFocus={() => triggerSelect(`fn-name-${fn.id}`, 'heading', `Control: ${fn.functionName}`, fn.functionName, { itemId: fn.id, subKey: 'functionName', isBold: true })}
                      onClick={() => triggerSelect(`fn-name-${fn.id}`, 'heading', `Control: ${fn.functionName}`, fn.functionName, { itemId: fn.id, subKey: 'functionName', isBold: true })}
                      onChange={e => {
                        const updated = [...fns];
                        updated[idx] = { ...updated[idx], functionName: e.target.value };
                        updateContent({ functionalities: updated });
                      }}
                      className={getFieldClass(`fn-name-${fn.id}`, fn.id, 'functionName', "w-full px-2.5 py-1.5 font-bold text-slate-900 text-xs rounded-lg border border-slate-300 focus:outline-none bg-white")}
                      placeholder="e.g. Smart Power On"
                    />
                  ),
                },
                {
                  key: 'process',
                  header: 'Instructions',
                  width: 'flex-1 min-w-[280px]',
                  render: (fn, idx) => (
                    <AutoResizeTextarea
                      minRows={3}
                      value={fn.process}
                      onFocus={() => triggerSelect(`fn-proc-${fn.id}`, 'paragraph', `Instruction: ${fn.functionName}`, fn.process, { itemId: fn.id, subKey: 'process' })}
                      onClick={() => triggerSelect(`fn-proc-${fn.id}`, 'paragraph', `Instruction: ${fn.functionName}`, fn.process, { itemId: fn.id, subKey: 'process' })}
                      onChange={e => {
                        const updated = [...fns];
                        updated[idx] = { ...updated[idx], process: e.target.value };
                        updateContent({ functionalities: updated });
                      }}
                      className={getFieldClass(`fn-proc-${fn.id}`, fn.id, 'process', "w-full p-2.5 text-xs text-slate-700 rounded-lg border border-slate-200 font-sans focus:outline-none leading-relaxed bg-white")}
                      placeholder="Detail step 1, step 2, button press duration, and feedback tones..."
                    />
                  ),
                },
              ]}
            />
          </div>
        );
      }

      case 'led_indications': {
        const caseLeds = block.content.caseLedIndications || [];
        const earbudLeds = block.content.earbudsLedIndications || [];
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Case & Earbuds LED Indication Matrices</h3>
              <p className="text-xs text-slate-500">Diagnostic LED lighting behaviors for technicians and QA inspection</p>
            </div>

            {/* Case LED Table */}
            <DynamicTable
              title="Remaining Case Battery LED Indications"
              subtitle="Charge state LED visual indicators for battery levels"
              data={caseLeds}
              addButtonLabel="Add Case State"
              onAddRow={() => {
                updateContent({
                  caseLedIndications: [
                    ...caseLeds,
                    {
                      id: `cled-${Date.now()}`,
                      scenario: 'Battery State',
                      chargingState: 'Charging LED pattern',
                      normalState: 'Normal lid open pattern',
                    },
                  ],
                });
              }}
              onDeleteRow={(idx) => {
                const updated = caseLeds.filter((_, i) => i !== idx);
                updateContent({ caseLedIndications: updated });
              }}
              onMoveRow={(idx, dir) => {
                updateContent({ caseLedIndications: moveItem(caseLeds, idx, dir) });
              }}
              onReorderRow={(from, to) => {
                updateContent({ caseLedIndications: reorderItem(caseLeds, from, to) });
              }}
              onDuplicateRow={(idx) => {
                updateContent({ caseLedIndications: duplicateItem(caseLeds, idx) });
              }}
              columns={[
                {
                  key: 'scenario',
                  header: 'Case Remaining Battery',
                  width: 'w-1/3 min-w-[150px]',
                  render: (row, idx) => (
                    <input
                      type="text"
                      value={row.scenario}
                      onFocus={() => triggerSelect(`case-led-scen-${row.id}`, 'table-cell', `Case Scenario (${row.scenario})`, row.scenario, { itemId: row.id, subKey: 'scenario', isBold: true })}
                      onClick={() => triggerSelect(`case-led-scen-${row.id}`, 'table-cell', `Case Scenario (${row.scenario})`, row.scenario, { itemId: row.id, subKey: 'scenario', isBold: true })}
                      onChange={e => {
                        const updated = [...caseLeds];
                        updated[idx] = { ...updated[idx], scenario: e.target.value };
                        updateContent({ caseLedIndications: updated });
                      }}
                      className={getFieldClass(`case-led-scen-${row.id}`, row.id, 'scenario', "w-full px-2.5 py-1.5 font-semibold text-slate-800 rounded border border-slate-200 text-xs focus:outline-none bg-white")}
                    />
                  ),
                },
                {
                  key: 'chargingState',
                  header: 'Charging State',
                  render: (row, idx) => (
                    <input
                      type="text"
                      value={row.chargingState || ''}
                      onFocus={() => triggerSelect(`case-led-chg-${row.id}`, 'table-cell', `Charging State (${row.scenario})`, row.chargingState || '', { itemId: row.id, subKey: 'chargingState' })}
                      onClick={() => triggerSelect(`case-led-chg-${row.id}`, 'table-cell', `Charging State (${row.scenario})`, row.chargingState || '', { itemId: row.id, subKey: 'chargingState' })}
                      onChange={e => {
                        const updated = [...caseLeds];
                        updated[idx] = { ...updated[idx], chargingState: e.target.value };
                        updateContent({ caseLedIndications: updated });
                      }}
                      className={getFieldClass(`case-led-chg-${row.id}`, row.id, 'chargingState', "w-full px-2.5 py-1.5 text-slate-700 rounded border border-slate-200 text-xs focus:outline-none bg-white")}
                    />
                  ),
                },
                {
                  key: 'normalState',
                  header: 'Normal (Non-Charging) State',
                  render: (row, idx) => (
                    <input
                      type="text"
                      value={row.normalState || ''}
                      onFocus={() => triggerSelect(`case-led-norm-${row.id}`, 'table-cell', `Normal State (${row.scenario})`, row.normalState || '', { itemId: row.id, subKey: 'normalState' })}
                      onClick={() => triggerSelect(`case-led-norm-${row.id}`, 'table-cell', `Normal State (${row.scenario})`, row.normalState || '', { itemId: row.id, subKey: 'normalState' })}
                      onChange={e => {
                        const updated = [...caseLeds];
                        updated[idx] = { ...updated[idx], normalState: e.target.value };
                        updateContent({ caseLedIndications: updated });
                      }}
                      className={getFieldClass(`case-led-norm-${row.id}`, row.id, 'normalState', "w-full px-2.5 py-1.5 text-slate-700 rounded border border-slate-200 text-xs focus:outline-none bg-white")}
                    />
                  ),
                },
              ]}
            />

            {/* Earbuds LED Table */}
            <DynamicTable
              title="Earbuds Operational LED Indications"
              subtitle="Earbud light patterns for pairing, connection, and low power states"
              data={earbudLeds}
              addButtonLabel="Add Earbud State"
              onAddRow={() => {
                updateContent({
                  earbudsLedIndications: [
                    ...earbudLeds,
                    {
                      id: `eled-${Date.now()}`,
                      scenario: 'New Mode',
                      chargingState: 'LED Flash description',
                    },
                  ],
                });
              }}
              onDeleteRow={(idx) => {
                const updated = earbudLeds.filter((_, i) => i !== idx);
                updateContent({ earbudsLedIndications: updated });
              }}
              onMoveRow={(idx, dir) => {
                updateContent({ earbudsLedIndications: moveItem(earbudLeds, idx, dir) });
              }}
              onReorderRow={(from, to) => {
                updateContent({ earbudsLedIndications: reorderItem(earbudLeds, from, to) });
              }}
              onDuplicateRow={(idx) => {
                updateContent({ earbudsLedIndications: duplicateItem(earbudLeds, idx) });
              }}
              columns={[
                {
                  key: 'scenario',
                  header: 'Scenario',
                  width: 'w-1/3 min-w-[150px]',
                  render: (row, idx) => (
                    <input
                      type="text"
                      value={row.scenario}
                      onFocus={() => triggerSelect(`ear-led-scen-${row.id}`, 'table-cell', `Earbuds Scenario (${row.scenario})`, row.scenario, { itemId: row.id, subKey: 'scenario', isBold: true })}
                      onClick={() => triggerSelect(`ear-led-scen-${row.id}`, 'table-cell', `Earbuds Scenario (${row.scenario})`, row.scenario, { itemId: row.id, subKey: 'scenario', isBold: true })}
                      onChange={e => {
                        const updated = [...earbudLeds];
                        updated[idx] = { ...updated[idx], scenario: e.target.value };
                        updateContent({ earbudsLedIndications: updated });
                      }}
                      className={getFieldClass(`ear-led-scen-${row.id}`, row.id, 'scenario', "w-full px-2.5 py-1.5 font-semibold text-slate-800 rounded border border-slate-200 text-xs focus:outline-none bg-white")}
                    />
                  ),
                },
                {
                  key: 'chargingState',
                  header: 'Indication & Flash Pattern',
                  render: (row, idx) => (
                    <input
                      type="text"
                      value={row.chargingState || ''}
                      onFocus={() => triggerSelect(`ear-led-flash-${row.id}`, 'table-cell', `Flash Pattern (${row.scenario})`, row.chargingState || '', { itemId: row.id, subKey: 'chargingState' })}
                      onClick={() => triggerSelect(`ear-led-flash-${row.id}`, 'table-cell', `Flash Pattern (${row.scenario})`, row.chargingState || '', { itemId: row.id, subKey: 'chargingState' })}
                      onChange={e => {
                        const updated = [...earbudLeds];
                        updated[idx] = { ...updated[idx], chargingState: e.target.value };
                        updateContent({ earbudsLedIndications: updated });
                      }}
                      className={getFieldClass(`ear-led-flash-${row.id}`, row.id, 'chargingState', "w-full px-2.5 py-1.5 text-slate-700 rounded border border-slate-200 text-xs focus:outline-none bg-white")}
                    />
                  ),
                },
              ]}
            />
          </div>
        );
      }

      case 'charging_guidelines': {
        const guidelines = block.content.chargingGuidelines || [];
        return (
          <div className="space-y-6">
            <DynamicTable
              title="Charging Precautions & Adapter Rules"
              subtitle="Standard power brick requirements, input ratings, and battery safety notes"
              data={guidelines}
              addButtonLabel="Add Rule"
              onAddRow={() => {
                updateContent({
                  chargingGuidelines: [
                    ...guidelines,
                    {
                      id: `cg-${Date.now()}`,
                      statement: 'New Charging Rule',
                      information: '5V / 1A - 2A standard charger recommended.',
                    },
                  ],
                });
              }}
              onDeleteRow={(idx) => {
                const updated = guidelines.filter((_, i) => i !== idx);
                updateContent({ chargingGuidelines: updated });
              }}
              onMoveRow={(idx, dir) => {
                updateContent({ chargingGuidelines: moveItem(guidelines, idx, dir) });
              }}
              onReorderRow={(from, to) => {
                updateContent({ chargingGuidelines: reorderItem(guidelines, from, to) });
              }}
              onDuplicateRow={(idx) => {
                updateContent({ chargingGuidelines: duplicateItem(guidelines, idx) });
              }}
              columns={[
                {
                  key: 'statement',
                  header: 'Statement / Parameter',
                  width: 'w-1/3 min-w-[160px]',
                  render: (cg, idx) => (
                    <input
                      type="text"
                      value={cg.statement}
                      onFocus={() => triggerSelect(`cg-stmt-${cg.id}`, 'table-cell', `Charging Statement: ${cg.statement}`, cg.statement, { itemId: cg.id, subKey: 'statement', isBold: true })}
                      onClick={() => triggerSelect(`cg-stmt-${cg.id}`, 'table-cell', `Charging Statement: ${cg.statement}`, cg.statement, { itemId: cg.id, subKey: 'statement', isBold: true })}
                      onChange={e => {
                        const updated = [...guidelines];
                        updated[idx] = { ...updated[idx], statement: e.target.value };
                        updateContent({ chargingGuidelines: updated });
                      }}
                      className={getFieldClass(`cg-stmt-${cg.id}`, cg.id, 'statement', "w-full px-2.5 py-1.5 font-semibold text-slate-800 rounded border border-slate-200 focus:outline-none bg-white")}
                    />
                  ),
                },
                {
                  key: 'information',
                  header: 'Specification / Condition',
                  render: (cg, idx) => (
                    <AutoResizeTextarea
                      minRows={2}
                      value={cg.information}
                      onFocus={() => triggerSelect(`cg-info-${cg.id}`, 'table-cell', `Charging Info (${cg.statement})`, cg.information, { itemId: cg.id, subKey: 'information' })}
                      onClick={() => triggerSelect(`cg-info-${cg.id}`, 'table-cell', `Charging Info (${cg.statement})`, cg.information, { itemId: cg.id, subKey: 'information' })}
                      onChange={e => {
                        const updated = [...guidelines];
                        updated[idx] = { ...updated[idx], information: e.target.value };
                        updateContent({ chargingGuidelines: updated });
                      }}
                      className={getFieldClass(`cg-info-${cg.id}`, cg.id, 'information', "w-full p-2 text-xs text-slate-700 rounded border border-slate-200 focus:outline-none bg-white")}
                    />
                  ),
                },
              ]}
            />

            {/* Charging Notes */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">Safety & Battery Longevity Notes</label>
              {(block.content.chargingNotes || []).map((note, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-5 text-xs font-mono font-bold text-slate-400 text-right">{idx + 1}.</span>
                  <input
                    type="text"
                    value={note}
                    onFocus={() => triggerSelect(`cg-note-${idx}`, 'list', `Charging Note #${idx + 1}`, note, { itemId: `${idx}`, isBullet: true })}
                    onClick={() => triggerSelect(`cg-note-${idx}`, 'list', `Charging Note #${idx + 1}`, note, { itemId: `${idx}`, isBullet: true })}
                    onChange={e => {
                      const updated = [...(block.content.chargingNotes || [])];
                      updated[idx] = e.target.value;
                      updateContent({ chargingNotes: updated });
                    }}
                    className={getFieldClass(`cg-note-${idx}`, `${idx}`, undefined, "flex-1 px-3 py-1.5 text-xs rounded border border-slate-200 focus:outline-none bg-white")}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updated = (block.content.chargingNotes || []).filter((_, i) => i !== idx);
                      updateContent({ chargingNotes: updated });
                    }}
                    className="p-1 text-slate-400 hover:text-red-600 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      }

      case 'weight_matrix': {
        const rows: WeightMatrixRow[] = block.content.weightMatrixRows && block.content.weightMatrixRows.length > 0
          ? block.content.weightMatrixRows
          : [
              {
                id: 'wm-default-1',
                product: block.content.weightMatrix?.product || '<$productname$>',
                length: block.content.weightMatrix?.length || '24.9 mm',
                breadth: block.content.weightMatrix?.breadth || '20.77 mm',
                height: block.content.weightMatrix?.height || '32.2 mm',
                earbudsWeight: block.content.weightMatrix?.earbudsWeight || '4 g per earbud',
                caseWeight: block.content.weightMatrix?.caseWeight || '36 g',
              },
            ];

        const syncRows = (newRows: WeightMatrixRow[]) => {
          updateContent({
            weightMatrixRows: newRows,
            weightMatrix: newRows[0] ? {
              product: newRows[0].product,
              length: newRows[0].length,
              breadth: newRows[0].breadth,
              height: newRows[0].height,
              earbudsWeight: newRows[0].earbudsWeight,
              caseWeight: newRows[0].caseWeight,
            } : undefined,
          });
        };

        const parameterFields = [
          { key: 'product', label: 'Product Model Identifier', placeholder: 'e.g. boAt Airdopes Prime 800D', isBold: true },
          { key: 'earbudsWeight', label: 'Earbuds Weight', placeholder: 'e.g. 4 g per earbud' },
          { key: 'caseWeight', label: 'Case Weight', placeholder: 'e.g. 36 g' },
          { key: 'length', label: 'Length', placeholder: 'e.g. 24.9 mm' },
          { key: 'breadth', label: 'Breadth', placeholder: 'e.g. 20.77 mm' },
          { key: 'height', label: 'Height', placeholder: 'e.g. 32.2 mm' },
        ] as const;

        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Physical Dimensions & Weight Matrix</h3>
                <p className="text-xs text-slate-500">Certified lab measurements with Title on the left and Content on the right</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const newRow: WeightMatrixRow = {
                    id: `wm-${Date.now()}`,
                    product: 'New Model Variant',
                    length: '24.9 mm',
                    breadth: '20.77 mm',
                    height: '32.2 mm',
                    earbudsWeight: '4 g per earbud',
                    caseWeight: '36 g',
                  };
                  syncRows([...rows, newRow]);
                }}
                className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 self-start shadow-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add Model
              </button>
            </div>

            <div className="space-y-6">
              {rows.map((row, modelIdx) => (
                <div key={row.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
                  {/* Model Header Toolbar */}
                  <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-700">
                        {rows.length > 1 ? `Model #${modelIdx + 1}: ${row.product || 'Untitled'}` : 'Specifications & Dimensions Table'}
                      </span>
                    </div>
                    {rows.length > 1 && (
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => syncRows(moveItem(rows, modelIdx, 'up'))}
                          disabled={modelIdx === 0}
                          className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded hover:bg-slate-200 transition-colors"
                          title="Move Model Up"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => syncRows(moveItem(rows, modelIdx, 'down'))}
                          disabled={modelIdx === rows.length - 1}
                          className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded hover:bg-slate-200 transition-colors"
                          title="Move Model Down"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => syncRows(duplicateItem(rows, modelIdx))}
                          className="p-1 text-slate-400 hover:text-blue-600 rounded hover:bg-blue-50 transition-colors"
                          title="Duplicate Model"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (!window.confirm('Delete this model row? This cannot be undone.')) return;
                            const updated = rows.filter((_, i) => i !== modelIdx);
                            syncRows(updated);
                          }}
                          className="p-1 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors"
                          title="Delete Model"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* 2-Column Table: Title on Left, Content on Right */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-100/75 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                          <th className="py-2.5 px-4 w-2/5 min-w-[180px] border-r border-slate-200">
                            Title / Parameter
                          </th>
                          <th className="py-2.5 px-4 min-w-[240px]">
                            Content / Measurement
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {parameterFields.map((field) => {
                          const fieldId = `wm-${row.id}-${field.key}`;
                          const isProductTitle = field.key === 'product';

                          return (
                            <tr key={field.key} className="hover:bg-slate-50/60 transition-colors">
                              {/* Left Column: Title */}
                              <td className="py-2.5 px-4 font-semibold text-slate-700 border-r border-slate-100 bg-slate-50/40">
                                {field.label}
                              </td>

                              {/* Right Column: Content */}
                              <td className="py-2 px-3">
                                <input
                                  type="text"
                                  value={row[field.key] || ''}
                                  placeholder={field.placeholder}
                                  onFocus={() => triggerSelect(fieldId, 'table-cell', `${field.label} (${row.product})`, row[field.key] || '', { itemId: row.id, subKey: field.key, isBold: isProductTitle })}
                                  onClick={() => triggerSelect(fieldId, 'table-cell', `${field.label} (${row.product})`, row[field.key] || '', { itemId: row.id, subKey: field.key, isBold: isProductTitle })}
                                  onChange={e => {
                                    const updated = [...rows];
                                    updated[modelIdx] = {
                                      ...updated[modelIdx],
                                      [field.key]: e.target.value,
                                    };
                                    syncRows(updated);
                                  }}
                                  className={getFieldClass(
                                    fieldId,
                                    row.id,
                                    field.key,
                                    `w-full px-3 py-1.5 rounded border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${
                                      isProductTitle ? 'font-bold' : 'font-medium'
                                    }`
                                  )}
                                />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      }

      case 'hearables_app': {
        const tabs = block.content.hearablesAppTabs || [];
        const guideSteps = block.content.hearablesGuideSteps || [];
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Hearables Companion App Functionalities</h3>
                <p className="text-xs text-slate-500">Sound Tab, Touch Tab, System Tab, and Smart Diagnostics</p>
              </div>
            </div>

            {/* App Screens Showcase Cards */}
            <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
              {tabs.map((tab, idx) => (
                <div
                  key={tab.id}
                  className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex flex-col items-center space-y-3"
                >
                  <input
                    type="text"
                    value={tab.tabName}
                    onFocus={() => triggerSelect(`app-tab-${tab.id}`, 'heading', `App Tab Name (${tab.tabName})`, tab.tabName, { itemId: tab.id, isBold: true })}
                    onClick={() => triggerSelect(`app-tab-${tab.id}`, 'heading', `App Tab Name (${tab.tabName})`, tab.tabName, { itemId: tab.id, isBold: true })}
                    onChange={e => {
                      const updated = [...tabs];
                      updated[idx] = { ...updated[idx], tabName: e.target.value };
                      updateContent({ hearablesAppTabs: updated });
                    }}
                    className={getFieldClass(`app-tab-${tab.id}`, tab.id, undefined, "font-bold text-slate-900 text-xs text-center border-b border-slate-200 pb-1 focus:outline-none w-full")}
                  />
                  <HearablesAppScreenMockup tabType={tab.mockupType} title={tab.tabName} imageUrl={tab.imageUrl} />

                  {/* Add / Edit / Delete the tab picture — appears in the Full Document & final DOCX */}
                  <div className="w-full flex items-center justify-center gap-2">
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-semibold rounded-md border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors">
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>{tab.imageUrl ? 'Replace Picture' : 'Add Picture'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = () => {
                            const dataUrl = reader.result as string;
                            const updated = [...tabs];
                            updated[idx] = { ...updated[idx], imageUrl: dataUrl };
                            updateContent({ hearablesAppTabs: updated });
                          };
                          reader.readAsDataURL(file);
                          e.target.value = '';
                        }}
                      />
                    </label>
                    {tab.imageUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...tabs];
                          updated[idx] = { ...updated[idx], imageUrl: undefined };
                          updateContent({ hearablesAppTabs: updated });
                        }}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-semibold rounded-md border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                        title="Delete this tab picture"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* App Guide Steps Dynamic Table */}
            <DynamicTable
              title="Hearables App Functionalities & Guide Steps"
              subtitle="Step-by-step companion app configuration, diagnostics, and EQ pairing guide"
              data={guideSteps}
              addButtonLabel="Add Guide Step"
              onAddRow={() => {
                updateContent({
                  hearablesGuideSteps: [
                    ...guideSteps,
                    {
                      id: `app-step-${Date.now()}`,
                      functionName: 'New App Feature',
                      process: 'Step 1: Open Companion App\nStep 2: Select Device Settings...',
                    },
                  ],
                });
              }}
              onDeleteRow={(idx) => {
                const updated = guideSteps.filter((_, i) => i !== idx);
                updateContent({ hearablesGuideSteps: updated });
              }}
              onMoveRow={(idx, dir) => {
                updateContent({ hearablesGuideSteps: moveItem(guideSteps, idx, dir) });
              }}
              onReorderRow={(from, to) => {
                updateContent({ hearablesGuideSteps: reorderItem(guideSteps, from, to) });
              }}
              onDuplicateRow={(idx) => {
                updateContent({ hearablesGuideSteps: duplicateItem(guideSteps, idx) });
              }}
              columns={[
                {
                  key: 'index',
                  header: '#',
                  width: 'w-12',
                  align: 'center',
                  render: (_, idx) => (
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-xs font-bold font-mono">
                      {idx + 1}
                    </span>
                  ),
                },
                {
                  key: 'functionName',
                  header: 'Function / Screen',
                  width: 'w-1/4 min-w-[170px]',
                  render: (step, idx) => (
                    <input
                      type="text"
                      value={step.functionName}
                      onFocus={() => triggerSelect(`app-fn-${step.id}`, 'heading', `App Guide: ${step.functionName}`, step.functionName, { itemId: step.id, subKey: 'functionName', isBold: true })}
                      onClick={() => triggerSelect(`app-fn-${step.id}`, 'heading', `App Guide: ${step.functionName}`, step.functionName, { itemId: step.id, subKey: 'functionName', isBold: true })}
                      onChange={e => {
                        const updated = [...guideSteps];
                        updated[idx] = { ...updated[idx], functionName: e.target.value };
                        updateContent({ hearablesGuideSteps: updated });
                      }}
                      className={getFieldClass(`app-fn-${step.id}`, step.id, 'functionName', "w-full px-2.5 py-1.5 font-bold text-slate-900 text-xs rounded-lg border border-slate-300 focus:outline-none bg-white")}
                      placeholder="e.g. Smart Diagnostics Flow"
                    />
                  ),
                },
                {
                  key: 'process',
                  header: 'Companion App SOP Instructions',
                  width: 'flex-1 min-w-[280px]',
                  render: (step, idx) => (
                    <AutoResizeTextarea
                      minRows={3}
                      value={step.process}
                      onFocus={() => triggerSelect(`app-proc-${step.id}`, 'paragraph', `App Guide Step: ${step.functionName}`, step.process, { itemId: step.id, subKey: 'process' })}
                      onClick={() => triggerSelect(`app-proc-${step.id}`, 'paragraph', `App Guide Step: ${step.functionName}`, step.process, { itemId: step.id, subKey: 'process' })}
                      onChange={e => {
                        const updated = [...guideSteps];
                        updated[idx] = { ...updated[idx], process: e.target.value };
                        updateContent({ hearablesGuideSteps: updated });
                      }}
                      className={getFieldClass(`app-proc-${step.id}`, step.id, 'process', "w-full p-2.5 text-xs text-slate-700 rounded-lg border border-slate-200 font-sans focus:outline-none leading-relaxed bg-white")}
                      placeholder="Detail the app navigation steps, button triggers, and expected response..."
                    />
                  ),
                },
              ]}
            />
          </div>
        );
      }

      case 'diagnostics_troubleshooting': {
        const items = block.content.troubleshootingItems || [];
        
        const categoryBadgeColors: Record<string, { bg: string; text: string; border: string }> = {
          Bluetooth: { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200' },
          Charging: { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
          'Sound Quality': { bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-200' },
          'Microphone / ENx': { bg: 'bg-teal-50', text: 'text-teal-800', border: 'border-teal-200' },
          Battery: { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200' },
          Controls: { bg: 'bg-indigo-50', text: 'text-indigo-800', border: 'border-indigo-200' },
          'Physical / Case': { bg: 'bg-rose-50', text: 'text-rose-800', border: 'border-rose-200' },
          General: { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' },
        };

        const categories = [
          'Bluetooth',
          'Charging',
          'Sound Quality',
          'Microphone / ENx',
          'Battery',
          'Controls',
          'Physical / Case',
          'General',
        ];

        return (
          <div className="space-y-6">
            <DynamicTable
              title="Technical Diagnostics & Troubleshooting Matrix"
              subtitle="Service center FAQs, inspection steps, and replacement protocols"
              data={items}
              addButtonLabel="Add Issue Case"
              onAddRow={() => {
                updateContent({
                  troubleshootingItems: [
                    ...items,
                    {
                      id: `tb-${Date.now()}`,
                      category: 'Bluetooth',
                      issue: 'New Probable Issue',
                      instructions: ['Step 1: Inspect hardware status', 'Step 2: Perform diagnostics test'],
                      finalResolution: 'If unresolved after cleaning and reset, replace unit under warranty.',
                      appDiagnosticsNote: 'Run Smart Diagnostics in Companion App',
                    },
                  ],
                });
              }}
              onDeleteRow={(idx) => {
                const updated = items.filter((_, i) => i !== idx);
                updateContent({ troubleshootingItems: updated });
              }}
              onMoveRow={(idx, dir) => {
                updateContent({ troubleshootingItems: moveItem(items, idx, dir) });
              }}
              onReorderRow={(from, to) => {
                updateContent({ troubleshootingItems: reorderItem(items, from, to) });
              }}
              onDuplicateRow={(idx) => {
                updateContent({ troubleshootingItems: duplicateItem(items, idx) });
              }}
              columns={[
                {
                  key: 'category',
                  header: 'Category',
                  width: 'w-32 min-w-[120px]',
                  render: (item, idx) => {
                    const catStyle = categoryBadgeColors[item.category || 'General'] || categoryBadgeColors.General;
                    return (
                      <select
                        value={item.category || 'General'}
                        onChange={e => {
                          const updated = [...items];
                          updated[idx] = { ...updated[idx], category: e.target.value };
                          updateContent({ troubleshootingItems: updated });
                        }}
                        className={`w-full px-2 py-1 text-[11px] font-bold rounded-md border ${catStyle.border} ${catStyle.bg} ${catStyle.text} focus:outline-none cursor-pointer`}
                      >
                        {categories.map(cat => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    );
                  },
                },
                {
                  key: 'issue',
                  header: 'Issue',
                  width: 'w-1/5 min-w-[160px]',
                  render: (item, idx) => (
                    <AutoResizeTextarea
                      minRows={2}
                      value={item.issue}
                      onFocus={() => triggerSelect(`tb-issue-${item.id}`, 'heading', `Issue: ${item.issue}`, item.issue, { itemId: item.id, subKey: 'issue', isBold: true })}
                      onClick={() => triggerSelect(`tb-issue-${item.id}`, 'heading', `Issue: ${item.issue}`, item.issue, { itemId: item.id, subKey: 'issue', isBold: true })}
                      onChange={e => {
                        const updated = [...items];
                        updated[idx] = { ...updated[idx], issue: e.target.value };
                        updateContent({ troubleshootingItems: updated });
                      }}
                      className={getFieldClass(`tb-issue-${item.id}`, item.id, 'issue', "w-full p-2 text-xs font-bold text-slate-900 rounded-lg border border-slate-300 focus:outline-none bg-white leading-snug")}
                      placeholder="e.g. One earbud not turning on"
                    />
                  ),
                },
                {
                  key: 'instructions',
                  header: 'Actionable SOP Instructions',
                  width: 'flex-1 min-w-[260px]',
                  render: (item, idx) => (
                    <div className="space-y-1">
                      <AutoResizeTextarea
                        minRows={4}
                        value={item.instructions.join('\n')}
                        onFocus={() => triggerSelect(`tb-step-${item.id}-0`, 'list', `Troubleshooting Steps (${item.issue})`, item.instructions.join('\n'), { itemId: item.id, isBullet: true })}
                        onClick={() => triggerSelect(`tb-step-${item.id}-0`, 'list', `Troubleshooting Steps (${item.issue})`, item.instructions.join('\n'), { itemId: item.id, isBullet: true })}
                        onChange={e => {
                          const updated = [...items];
                          updated[idx] = { ...updated[idx], instructions: e.target.value.split('\n').filter(Boolean) };
                          updateContent({ troubleshootingItems: updated });
                        }}
                        className={getFieldClass(`tb-step-${item.id}-0`, item.id, undefined, "w-full p-2 text-xs text-slate-800 rounded-lg border border-slate-200 bg-white focus:outline-none leading-relaxed")}
                        placeholder="Enter each actionable step on a new line..."
                      />
                      {onOpenToneModal && (
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() =>
                              onOpenToneModal(item.instructions.join('\n'), newText => {
                                const updated = [...items];
                                updated[idx] = {
                                  ...updated[idx],
                                  instructions: newText.split('\n').filter(Boolean),
                                };
                                updateContent({ troubleshootingItems: updated });
                              })
                            }
                            className="text-[10px] font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-indigo-50 cursor-pointer"
                            title="AI Polish instructions"
                          >
                            <Sparkles className="w-3 h-3" /> Polish with AI
                          </button>
                        </div>
                      )}
                    </div>
                  ),
                },
                {
                  key: 'finalResolution',
                  header: 'Final Resolution Protocol',
                  width: 'w-1/5 min-w-[150px]',
                  render: (item, idx) => (
                    <AutoResizeTextarea
                      minRows={2}
                      value={item.finalResolution}
                      onFocus={() => triggerSelect(`tb-res-${item.id}`, 'paragraph', `Resolution (${item.issue})`, item.finalResolution, { itemId: item.id, subKey: 'finalResolution', isBold: true })}
                      onClick={() => triggerSelect(`tb-res-${item.id}`, 'paragraph', `Resolution (${item.issue})`, item.finalResolution, { itemId: item.id, subKey: 'finalResolution', isBold: true })}
                      onChange={e => {
                        const updated = [...items];
                        updated[idx] = { ...updated[idx], finalResolution: e.target.value };
                        updateContent({ troubleshootingItems: updated });
                      }}
                      className={getFieldClass(`tb-res-${item.id}`, item.id, 'finalResolution', "w-full p-2 text-xs font-medium text-emerald-900 bg-emerald-50/40 rounded-lg border border-emerald-200 focus:outline-none leading-relaxed")}
                      placeholder="e.g. Replace unit under warranty if..."
                    />
                  ),
                },
                {
                  key: 'appDiagnosticsNote',
                  header: 'Hearables App Diagnostic Note',
                  width: 'w-1/5 min-w-[150px]',
                  render: (item, idx) => (
                    <AutoResizeTextarea
                      minRows={2}
                      value={item.appDiagnosticsNote || ''}
                      onFocus={() => triggerSelect(`tb-appnote-${item.id}`, 'note', `App Diagnostic Note (${item.issue})`, item.appDiagnosticsNote || '', { itemId: item.id, subKey: 'appDiagnosticsNote' })}
                      onClick={() => triggerSelect(`tb-appnote-${item.id}`, 'note', `App Diagnostic Note (${item.issue})`, item.appDiagnosticsNote || '', { itemId: item.id, subKey: 'appDiagnosticsNote' })}
                      onChange={e => {
                        const updated = [...items];
                        updated[idx] = { ...updated[idx], appDiagnosticsNote: e.target.value };
                        updateContent({ troubleshootingItems: updated });
                      }}
                      placeholder="e.g. Check Sound Tab > ANC toggle in app..."
                      className={getFieldClass(`tb-appnote-${item.id}`, item.id, 'appDiagnosticsNote', "w-full p-2 text-xs text-blue-900 bg-blue-50/40 rounded-lg border border-blue-200 focus:outline-none leading-relaxed")}
                    />
                  ),
                },
              ]}
            />
          </div>
        );
      }

      case 'return_codes': {
        const codes = block.content.returnCodes || [];
        return (
          <div className="space-y-5">
            <DynamicTable
              title="ASIN / FSN / EAN Barcode Codes"
              subtitle="Return tool mapping for warranty and D2C warehouse tracking"
              data={codes}
              addButtonLabel="Add SKU Code"
              onAddRow={() => {
                updateContent({
                  returnCodes: [
                    ...codes,
                    {
                      id: `rc-${Date.now()}`,
                      productDesc: 'Product Variant Description',
                      ean: '8905650130000',
                      asin: 'B0CY000000',
                      fsn: 'ACCGZ000000',
                    },
                  ],
                });
              }}
              onDeleteRow={(idx) => {
                const updated = codes.filter((_, i) => i !== idx);
                updateContent({ returnCodes: updated });
              }}
              onMoveRow={(idx, dir) => {
                updateContent({ returnCodes: moveItem(codes, idx, dir) });
              }}
              onReorderRow={(from, to) => {
                updateContent({ returnCodes: reorderItem(codes, from, to) });
              }}
              onDuplicateRow={(idx) => {
                updateContent({ returnCodes: duplicateItem(codes, idx) });
              }}
              columns={[
                {
                  key: 'productDesc',
                  header: 'Product Description',
                  render: (code, idx) => (
                    <input
                      type="text"
                      value={code.productDesc}
                      onFocus={() => triggerSelect(`rc-desc-${code.id}`, 'table-cell', `SKU Description: ${code.productDesc}`, code.productDesc, { itemId: code.id, subKey: 'productDesc', isBold: true })}
                      onClick={() => triggerSelect(`rc-desc-${code.id}`, 'table-cell', `SKU Description: ${code.productDesc}`, code.productDesc, { itemId: code.id, subKey: 'productDesc', isBold: true })}
                      onChange={e => {
                        const updated = [...codes];
                        updated[idx] = { ...updated[idx], productDesc: e.target.value };
                        updateContent({ returnCodes: updated });
                      }}
                      className={getFieldClass(`rc-desc-${code.id}`, code.id, 'productDesc', "w-full px-2.5 py-1.5 font-semibold text-slate-800 rounded border border-slate-200 focus:outline-none bg-white")}
                    />
                  ),
                },
                {
                  key: 'ean',
                  header: 'EAN Number',
                  render: (code, idx) => (
                    <input
                      type="text"
                      value={code.ean}
                      onFocus={() => triggerSelect(`rc-ean-${code.id}`, 'table-cell', `EAN (${code.productDesc})`, code.ean, { itemId: code.id, subKey: 'ean' })}
                      onClick={() => triggerSelect(`rc-ean-${code.id}`, 'table-cell', `EAN (${code.productDesc})`, code.ean, { itemId: code.id, subKey: 'ean' })}
                      onChange={e => {
                        const updated = [...codes];
                        updated[idx] = { ...updated[idx], ean: e.target.value };
                        updateContent({ returnCodes: updated });
                      }}
                      className={getFieldClass(`rc-ean-${code.id}`, code.id, 'ean', "w-full px-2.5 py-1.5 font-mono text-slate-700 rounded border border-slate-200 focus:outline-none bg-white")}
                    />
                  ),
                },
                {
                  key: 'asin',
                  header: 'ASIN (Amazon)',
                  render: (code, idx) => (
                    <input
                      type="text"
                      value={code.asin}
                      onFocus={() => triggerSelect(`rc-asin-${code.id}`, 'table-cell', `ASIN (${code.productDesc})`, code.asin, { itemId: code.id, subKey: 'asin' })}
                      onClick={() => triggerSelect(`rc-asin-${code.id}`, 'table-cell', `ASIN (${code.productDesc})`, code.asin, { itemId: code.id, subKey: 'asin' })}
                      onChange={e => {
                        const updated = [...codes];
                        updated[idx] = { ...updated[idx], asin: e.target.value };
                        updateContent({ returnCodes: updated });
                      }}
                      className={getFieldClass(`rc-asin-${code.id}`, code.id, 'asin', "w-full px-2.5 py-1.5 font-mono text-slate-700 rounded border border-slate-200 focus:outline-none bg-white")}
                    />
                  ),
                },
                {
                  key: 'fsn',
                  header: 'FSN (Flipkart)',
                  render: (code, idx) => (
                    <input
                      type="text"
                      value={code.fsn}
                      onFocus={() => triggerSelect(`rc-fsn-${code.id}`, 'table-cell', `FSN (${code.productDesc})`, code.fsn, { itemId: code.id, subKey: 'fsn' })}
                      onClick={() => triggerSelect(`rc-fsn-${code.id}`, 'table-cell', `FSN (${code.productDesc})`, code.fsn, { itemId: code.id, subKey: 'fsn' })}
                      onChange={e => {
                        const updated = [...codes];
                        updated[idx] = { ...updated[idx], fsn: e.target.value };
                        updateContent({ returnCodes: updated });
                      }}
                      className={getFieldClass(`rc-fsn-${code.id}`, code.id, 'fsn', "w-full px-2.5 py-1.5 font-mono text-slate-700 rounded border border-slate-200 focus:outline-none bg-white")}
                    />
                  ),
                },
              ]}
            />
          </div>
        );
      }

      case 'annexure': {
        const rawItems = block.content.annexureItems;
        const items: AnnexureItem[] = (rawItems && rawItems.length > 0)
          ? rawItems
          : [
              {
                id: 'ann-1',
                category: 'QA Testing',
                sopTitle: 'Testing Standard Operating Procedure',
                protocols: block.content.annexureTestingSop || '● Step 1: Visual and cosmetic casing inspection for hairline cracks or water ingress markers.\n● Step 2: Battery terminal voltage verification across charging cradle and earbud pogo pins.\n● Step 3: Audio spectrum sweep and ANC microphone sensitivity calibration test.\n● Step 4: Bluetooth multi-device reconnect speed and 10-meter range validation.',
                resourceLink: block.content.annexureTutorialLinks || 'https://service-portal.internal.com/training/neo-anc',
              },
              {
                id: 'ann-2',
                category: 'Tutorial Video',
                sopTitle: 'Service & Tutorial Video Links',
                protocols: 'Complete technical video walkthrough illustrating charging case disassembly, ultrasonic cleaning of acoustic mesh filters, and battery replacement SOP.',
                resourceLink: block.content.annexureTutorialLinks || 'https://service-portal.internal.com/training/neo-anc',
              },
              {
                id: 'ann-3',
                category: 'Service Flowchart',
                sopTitle: 'L1/L2 Technical Repair Escalation Flowchart',
                protocols: 'Standard service center flowchart for handling DOA (Dead on Arrival), single-side audio drop, touch-sensor latency, and warranty swap authorizations.',
                resourceLink: 'https://service-portal.internal.com/flowcharts/tws-escalation-v3',
              },
            ];

        const updateAnnexure = (updatedItems: AnnexureItem[]) => {
          updateContent({
            annexureItems: updatedItems,
            annexureTestingSop: updatedItems[0]?.protocols || block.content.annexureTestingSop || '',
            annexureTutorialLinks: updatedItems[1]?.resourceLink || updatedItems[0]?.resourceLink || block.content.annexureTutorialLinks || '',
          });
        };

        return (
          <div className="space-y-6">
            <DynamicTable
              title="Annexure & QA Testing SOPs"
              subtitle="Service flowcharts, technical testing protocols, tutorial videos, and warranty portal URLs"
              data={items}
              addButtonLabel="Add SOP Protocol"
              onAddRow={() => {
                const newRow: AnnexureItem = {
                  id: `ann-${Date.now()}`,
                  category: 'QA Testing',
                  sopTitle: 'New Testing SOP / Procedure',
                  protocols: '● Step 1: Detail testing step and parameters\n● Step 2: Acceptance thresholds...',
                  resourceLink: 'https://service-portal.internal.com/',
                };
                updateAnnexure([...items, newRow]);
              }}
              onDeleteRow={(idx) => {
                const updated = items.filter((_, i) => i !== idx);
                updateAnnexure(updated);
              }}
              onMoveRow={(idx, dir) => {
                updateAnnexure(moveItem(items, idx, dir));
              }}
              onReorderRow={(from, to) => {
                updateAnnexure(reorderItem(items, from, to));
              }}
              onDuplicateRow={(idx) => {
                updateAnnexure(duplicateItem(items, idx));
              }}
              columns={[
                {
                  key: 'index',
                  header: '#',
                  width: 'w-12',
                  align: 'center',
                  render: (_, idx) => (
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-xs font-bold font-mono">
                      {idx + 1}
                    </span>
                  ),
                },
                {
                  key: 'category',
                  header: 'Category',
                  width: 'w-32 min-w-[130px]',
                  render: (item, idx) => (
                    <input
                      type="text"
                      value={item.category || ''}
                      onChange={e => {
                        const updated = [...items];
                        updated[idx] = { ...updated[idx], category: e.target.value };
                        updateAnnexure(updated);
                      }}
                      className="w-full px-2.5 py-1.5 text-xs font-bold text-slate-900 rounded-lg border border-slate-300 focus:outline-none bg-white"
                      placeholder="e.g. QA Testing"
                    />
                  ),
                },
                {
                  key: 'protocols',
                  header: 'Testing SOP Protocols & Flowcharts',
                  width: 'flex-1 min-w-[280px]',
                  render: (item, idx) => (
                    <div className="space-y-1.5">
                      <AutoResizeTextarea
                        minRows={4}
                        value={item.protocols}
                        onFocus={() => triggerSelect(`ann-proto-${item.id}`, 'paragraph', `SOP Protocols (${item.sopTitle})`, item.protocols, { itemId: item.id, subKey: 'protocols' })}
                        onClick={() => triggerSelect(`ann-proto-${item.id}`, 'paragraph', `SOP Protocols (${item.sopTitle})`, item.protocols, { itemId: item.id, subKey: 'protocols' })}
                        onChange={e => {
                          const updated = [...items];
                          updated[idx] = { ...updated[idx], protocols: e.target.value };
                          updateAnnexure(updated);
                        }}
                        className={getFieldClass(`ann-proto-${item.id}`, item.id, 'protocols', "w-full p-2.5 text-xs text-slate-800 rounded-lg border border-slate-300 focus:outline-none leading-relaxed bg-white")}
                        placeholder="Detailed testing protocols, inspection criteria, and repair workflows..."
                      />
                      {onOpenToneModal && (
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() =>
                              onOpenToneModal(item.protocols, newText => {
                                const updated = [...items];
                                updated[idx] = { ...updated[idx], protocols: newText };
                                updateAnnexure(updated);
                              })
                            }
                            className="text-[10px] font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-indigo-50 cursor-pointer"
                            title="AI Polish instructions"
                          >
                            <Sparkles className="w-3 h-3" /> Polish with AI
                          </button>
                        </div>
                      )}
                    </div>
                  ),
                },
                {
                  key: 'resourceLink',
                  header: 'Service & Tutorial Video Links / Portal URL',
                  width: 'w-1/4 min-w-[200px]',
                  render: (item, idx) => (
                    <div className="space-y-1.5">
                      <div className="relative">
                        <input
                          type="text"
                          value={item.resourceLink || ''}
                          onFocus={() => triggerSelect(`ann-link-${item.id}`, 'paragraph', `Link (${item.sopTitle})`, item.resourceLink || '', { itemId: item.id, subKey: 'resourceLink' })}
                          onClick={() => triggerSelect(`ann-link-${item.id}`, 'paragraph', `Link (${item.sopTitle})`, item.resourceLink || '', { itemId: item.id, subKey: 'resourceLink' })}
                          onChange={e => {
                            const updated = [...items];
                            updated[idx] = { ...updated[idx], resourceLink: e.target.value };
                            updateAnnexure(updated);
                          }}
                          className={getFieldClass(`ann-link-${item.id}`, item.id, 'resourceLink', "w-full pl-7 pr-2 py-1.5 text-xs font-mono text-blue-950 rounded-lg border border-slate-300 focus:outline-none bg-white")}
                          placeholder="https://service-portal..."
                        />
                        <Link2 className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2.5" />
                      </div>
                      {item.resourceLink && item.resourceLink.startsWith('http') && (
                        <a
                          href={item.resourceLink}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[10px] text-blue-600 hover:text-blue-800 font-semibold px-1 py-0.5"
                          title="Open URL in new tab"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Test Link</span>
                        </a>
                      )}
                    </div>
                  ),
                },
              ]}
            />
          </div>
        );
      }

      case 'custom_section':
      default:
        return (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Custom Section Elements</h3>
                <p className="text-xs text-slate-500">Add and customize modular content blocks using the customizer on the right</p>
              </div>
            </div>

            {/* If no custom elements yet */}
            {(!block.content.contentElements || block.content.contentElements.length === 0) && (
              <div className="p-6 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                <p className="text-xs font-semibold text-slate-700">No content elements added yet</p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Use the <span className="font-bold text-slate-800">Add Content Element</span> panel in the right sidebar Customizer to add Headings, Paragraphs, Lists, Notes, or Diagrams.
                </p>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {renderBlockEditorBody()}
    </div>
  );
};
