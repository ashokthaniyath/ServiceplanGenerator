import React, { useState, useRef } from 'react';
import { 
  Link as LinkIcon, 
  Unlink, 
  Plus, 
  Trash2, 
  List, 
  Type, 
  Sparkles,
  MousePointerClick,
  ChevronUp,
  ChevronDown,
  Upload,
  Image as ImageIcon,
  AlertTriangle,
  AlertOctagon,
  Info,
  CheckCircle2,
  FileText,
  ListOrdered,
  Table as TableIcon,
  LayoutGrid,
  Columns,
  Rows,
  Check,
  Split,
  Layers
} from 'lucide-react';
import { ServicePlanBlock, ContentElement, SelectedDocElement } from '../types';
import { AutoResizeTextarea } from './AutoResizeTextarea';

interface SectionCustomizerPanelProps {
  block: ServicePlanBlock;
  onChange: (updatedBlock: ServicePlanBlock) => void;
  selectedElement: SelectedDocElement | null;
  onSelectElement: (element: SelectedDocElement | null) => void;
  onUpdateSelectedElementText: (text: string, updates?: Partial<SelectedDocElement>) => void;
  onDeleteSelectedElement: () => void;
}

// Preset technical diagram image options (drop matching files into assets/images/)
const PRESET_DIAGRAMS = [
  {
    name: 'Exploded Earbuds Assembly',
    url: '/images/diagram-exploded-earbuds.png',
    caption: 'Exploded Component Architecture: Driver, Battery, PCB & Acoustic Chamber',
  },
  {
    name: 'Charging Case & Pogo Pins',
    url: '/images/diagram-charging-case.png',
    caption: 'Case Docking Interface & Gold-plated Pogo Charging Pins',
  },
  {
    name: 'PCB Circuit & Test Points',
    url: '/images/diagram-pcb-test-points.png',
    caption: 'Motherboard Diagnostic Test Pads & Multimeter Probe Points',
  },
  {
    name: 'Acoustic Nozzle & Filter Mesh',
    url: '/images/diagram-acoustic-nozzle.png',
    caption: 'Sound Port Nozzle, Tuning Mesh & Silicone Ear-tip Seat',
  },
];

export const SectionCustomizerPanel: React.FC<SectionCustomizerPanelProps> = ({
  block,
  onChange,
  selectedElement,
  onSelectElement,
  onUpdateSelectedElementText,
  onDeleteSelectedElement,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showPresets, setShowPresets] = useState(false);

  // Whether section name is linked to title
  const isLinked = block.customization.isLinkedToTitle !== false;
  
  // Section name (defaults to block.title if linked or undefined)
  const sectionName = block.customization.sectionName ?? block.title;

  // Ensure contentElements exists
  const contentElements = block.content.contentElements || [];

  // Determine what is actively being edited in the card
  const isCustomElementSelected = selectedElement && selectedElement.blockId === block.id && selectedElement.fieldId.startsWith('content-el-');
  const customElId = isCustomElementSelected ? selectedElement?.itemId : undefined;
  const activeCustomElement = contentElements.find(el => el.id === customElId);

  // Active text value
  const activeText = selectedElement ? selectedElement.text : block.title;

  // Active Bold state
  const isCurrentBold = selectedElement?.isBold ?? (activeCustomElement ? !!activeCustomElement.isBold : true);

  // Active Case state
  const currentCase = selectedElement?.textCase || (activeCustomElement?.textCase) || (activeText === activeText.toUpperCase() ? 'uppercase' : 'capitalize');

  // Active Bullet state
  const isCurrentBullet = selectedElement?.isBullet ?? (activeCustomElement ? !!activeCustomElement.isBullet : false);

  // Active List Type
  const currentListType = selectedElement?.listType || activeCustomElement?.listType || 'bullet';

  // Active Note Type
  const currentNoteType = selectedElement?.noteType || activeCustomElement?.noteType || 'warning';

  // Active Image URL & Caption
  const currentImageUrl = selectedElement?.imageUrl || activeCustomElement?.imageUrl || '';
  const currentImageCaption = selectedElement?.imageCaption || activeCustomElement?.imageCaption || '';

  // Handle Section Name input change
  const handleSectionNameChange = (newName: string) => {
    if (isLinked) {
      onChange({
        ...block,
        title: newName,
        customization: {
          ...block.customization,
          sectionName: newName,
        },
      });
      if (selectedElement && selectedElement.fieldId === 'title') {
        onSelectElement({
          ...selectedElement,
          text: newName,
        });
      }
    } else {
      onChange({
        ...block,
        customization: {
          ...block.customization,
          sectionName: newName,
        },
      });
    }
  };

  // Toggle Linked to Title
  const handleToggleLinked = () => {
    const nextLinked = !isLinked;
    onChange({
      ...block,
      customization: {
        ...block.customization,
        isLinkedToTitle: nextLinked,
        sectionName: nextLinked ? block.title : sectionName,
      },
    });
  };

  // Add new content element
  const handleAddElement = (type: ContentElement['type']) => {
    const newId = `el-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    let defaultText = '';
    let isBold = false;
    let isBullet = false;
    let textCase: ContentElement['textCase'] = 'normal';
    let imageUrl = '';
    let imageCaption = '';
    let noteType: ContentElement['noteType'] = 'warning';
    let listType: ContentElement['listType'] = 'bullet';

    switch (type) {
      case 'heading':
        defaultText = 'SUB-HEADING & PROCEDURAL OVERVIEW';
        isBold = true;
        textCase = 'uppercase';
        break;
      case 'paragraph':
        defaultText = 'Verify operational functionality and follow standard testing guidelines specified in the service repair manual.';
        break;
      case 'list':
        defaultText = 'Check earbud charging pins and case connector\nClean contact surfaces with isopropyl alcohol (IPA)\nVerify LED status indication upon docking';
        isBullet = true;
        listType = 'bullet';
        break;
      case 'note':
        defaultText = 'Always discharge electrostatic voltage before inspecting internal circuitry and battery connectors.';
        isBold = false;
        noteType = 'warning';
        break;
      case 'image':
        defaultText = 'Technical Schematic & Component Layout';
        imageUrl = PRESET_DIAGRAMS[0].url;
        imageCaption = PRESET_DIAGRAMS[0].caption;
        break;
    }

    const newElement: ContentElement = {
      id: newId,
      type,
      text: defaultText,
      isBold,
      isBullet,
      listType,
      noteType,
      textCase,
      imageUrl,
      imageCaption,
      listItems: type === 'list' ? defaultText.split('\n') : undefined,
    };

    const nextElements = [...contentElements, newElement];

    onChange({
      ...block,
      content: {
        ...block.content,
        contentElements: nextElements,
      },
    });

    onSelectElement({
      blockId: block.id,
      fieldId: `content-el-${newId}`,
      elementType: type,
      label: `${type.toUpperCase()} ELEMENT`,
      text: defaultText,
      isBold,
      isBullet,
      listType,
      noteType,
      textCase,
      imageUrl,
      imageCaption,
      itemId: newId,
    });
  };

  // Reorder content elements
  const handleMoveElement = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= contentElements.length) return;

    const updated = [...contentElements];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);

    onChange({
      ...block,
      content: {
        ...block.content,
        contentElements: updated,
      },
    });
  };

  // Delete a specific content element
  const handleDeleteElementById = (elementId: string) => {
    const remaining = contentElements.filter(el => el.id !== elementId);
    onChange({
      ...block,
      content: {
        ...block.content,
        contentElements: remaining,
      },
    });

    // Reset selection to block title
    onSelectElement({
      blockId: block.id,
      fieldId: 'title',
      elementType: 'title',
      label: 'Title Text',
      text: block.title,
      isBold: true,
    });
  };

  // Handle active field text change
  const handleActiveTextChange = (newText: string) => {
    if (!selectedElement) {
      if (isLinked) {
        onChange({
          ...block,
          title: newText,
          customization: {
            ...block.customization,
            sectionName: newText,
          },
        });
      } else {
        onChange({
          ...block,
          title: newText,
        });
      }
      return;
    }

    onUpdateSelectedElementText(newText);
  };

  // Formatting: Toggle Bold
  const handleToggleBold = () => {
    const nextBold = !isCurrentBold;
    if (selectedElement) {
      onUpdateSelectedElementText(activeText, { isBold: nextBold });
    }
  };

  // Formatting: Cycle Case
  const handleCycleCase = () => {
    const text = activeText;
    if (!text) return;

    let transformed = text;
    let nextCase: ContentElement['textCase'] = 'normal';

    if (text === text.toUpperCase()) {
      // Convert to Title Case
      transformed = text
        .toLowerCase()
        .split(' ')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
      nextCase = 'capitalize';
    } else if (text === text.toLowerCase()) {
      // Convert to UPPERCASE
      transformed = text.toUpperCase();
      nextCase = 'uppercase';
    } else {
      // Convert to UPPERCASE
      transformed = text.toUpperCase();
      nextCase = 'uppercase';
    }

    onUpdateSelectedElementText(transformed, { textCase: nextCase });
  };

  // Formatting: Toggle Bullet
  const handleToggleBullet = () => {
    const lines = activeText.split('\n');
    const hasBullets = lines.some(l => l.trim().startsWith('•') || l.trim().startsWith('-'));
    
    let newText = '';
    if (hasBullets) {
      newText = lines.map(l => l.replace(/^[\s•\-\*]+\s*/, '')).join('\n');
    } else {
      newText = lines.map(l => (l.trim() ? `• ${l.replace(/^[\s•\-\*]+\s*/, '')}` : l)).join('\n');
    }

    onUpdateSelectedElementText(newText, { isBullet: !hasBullets });
  };

  // File upload handler for custom image diagrams
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      onUpdateSelectedElementText(activeText, { imageUrl: dataUrl });
    };
    reader.readAsDataURL(file);
  };

  // Dynamic label for top of card
  const getEditingHeader = () => {
    if (!selectedElement) return 'EDITING TITLE TEXT';
    if (selectedElement.fieldId === 'title') return 'EDITING TITLE TEXT';
    if (selectedElement.fieldId === 'subtitle') return 'EDITING SUBTITLE TEXT';
    if (selectedElement.elementType === 'table' || activeCustomElement?.type === 'table') return 'EDITING TECHNICAL TABLE';
    return `EDITING ${selectedElement.label.toUpperCase()}`;
  };

  const getFieldLabel = () => {
    if (!selectedElement) return 'TITLE TEXT';
    if (selectedElement.fieldId === 'title') return 'TITLE TEXT';
    if (selectedElement.fieldId === 'subtitle') return 'SUBTITLE TEXT';
    if (selectedElement.elementType === 'table' || activeCustomElement?.type === 'table') return 'TECHNICAL TABLE MATRIX';
    return selectedElement.label.toUpperCase();
  };

  // Layout format handler
  const handleSetLayoutStyle = (layout: 'table' | 'cards' | 'compact' | 'split' | 'grid') => {
    onChange({
      ...block,
      customization: {
        ...block.customization,
        layoutStyle: layout,
      },
    });
  };

  // Table manipulation helpers for active custom table element
  const currentTableColumns = selectedElement?.tableColumns || activeCustomElement?.tableColumns || ['Parameter', 'Specification Standard', 'Acceptance Value'];
  const currentTableRows = selectedElement?.tableRows || activeCustomElement?.tableRows || [
    { id: 'r1', 'col-0': 'Operating Voltage', 'col-1': '3.70V - 4.20V DC', 'col-2': 'Pass: 3.7V Nominal' },
    { id: 'r2', 'col-0': 'Current Draw (Idle)', 'col-1': '< 15mA continuous', 'col-2': 'Pass: ≤ 18mA' },
  ];

  const handleAddTableColumn = () => {
    const nextCols = [...currentTableColumns, `Column ${currentTableColumns.length + 1}`];
    if (activeCustomElement) {
      const updatedElements = contentElements.map(el => {
        if (el.id === activeCustomElement.id) {
          return {
            ...el,
            tableColumns: nextCols,
          };
        }
        return el;
      });
      onChange({
        ...block,
        content: {
          ...block.content,
          contentElements: updatedElements,
        },
      });
    }
    onUpdateSelectedElementText(activeText, { tableColumns: nextCols });
  };

  const handleRemoveTableColumn = (colIdx: number) => {
    if (currentTableColumns.length <= 1) return;
    if (!window.confirm(`Delete column "${currentTableColumns[colIdx]}" and its data in all rows? This cannot be undone.`)) return;
    const nextCols = currentTableColumns.filter((_, idx) => idx !== colIdx);
    const nextRows = currentTableRows.map(r => {
      const copy: any = { id: r.id };
      nextCols.forEach((_, newIdx) => {
        const oldKey = newIdx >= colIdx ? `col-${newIdx + 1}` : `col-${newIdx}`;
        copy[`col-${newIdx}`] = r[oldKey] || '';
      });
      return copy;
    });

    if (activeCustomElement) {
      const updatedElements = contentElements.map(el => {
        if (el.id === activeCustomElement.id) {
          return {
            ...el,
            tableColumns: nextCols,
            tableRows: nextRows,
          };
        }
        return el;
      });
      onChange({
        ...block,
        content: {
          ...block.content,
          contentElements: updatedElements,
        },
      });
    }
    onUpdateSelectedElementText(activeText, { tableColumns: nextCols, tableRows: nextRows });
  };

  const handleUpdateColumnTitle = (colIdx: number, newTitle: string) => {
    const nextCols = [...currentTableColumns];
    nextCols[colIdx] = newTitle;
    if (activeCustomElement) {
      const updatedElements = contentElements.map(el => {
        if (el.id === activeCustomElement.id) {
          return { ...el, tableColumns: nextCols };
        }
        return el;
      });
      onChange({
        ...block,
        content: {
          ...block.content,
          contentElements: updatedElements,
        },
      });
    }
    onUpdateSelectedElementText(activeText, { tableColumns: nextCols });
  };

  const handleAddTableRow = () => {
    const newRowId = `row-${Date.now()}-${Math.random().toString(36).substr(2, 3)}`;
    const newRow: any = { id: newRowId };
    currentTableColumns.forEach((_, idx) => {
      newRow[`col-${idx}`] = idx === 0 ? `New Item ${currentTableRows.length + 1}` : '-';
    });
    const nextRows = [...currentTableRows, newRow];

    if (activeCustomElement) {
      const updatedElements = contentElements.map(el => {
        if (el.id === activeCustomElement.id) {
          return { ...el, tableRows: nextRows };
        }
        return el;
      });
      onChange({
        ...block,
        content: {
          ...block.content,
          contentElements: updatedElements,
        },
      });
    }
    onUpdateSelectedElementText(activeText, { tableRows: nextRows });
  };

  const handleRemoveTableRow = (rowIdx: number) => {
    if (currentTableRows.length <= 1) return;
    if (!window.confirm('Delete this table row? This cannot be undone.')) return;
    const nextRows = currentTableRows.filter((_, idx) => idx !== rowIdx);

    if (activeCustomElement) {
      const updatedElements = contentElements.map(el => {
        if (el.id === activeCustomElement.id) {
          return { ...el, tableRows: nextRows };
        }
        return el;
      });
      onChange({
        ...block,
        content: {
          ...block.content,
          contentElements: updatedElements,
        },
      });
    }
    onUpdateSelectedElementText(activeText, { tableRows: nextRows });
  };

  const handleReorderTableRow = (rowIdx: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? rowIdx - 1 : rowIdx + 1;
    if (targetIdx < 0 || targetIdx >= currentTableRows.length) return;
    const nextRows = [...currentTableRows];
    const [removed] = nextRows.splice(rowIdx, 1);
    nextRows.splice(targetIdx, 0, removed);

    if (activeCustomElement) {
      const updatedElements = contentElements.map(el => {
        if (el.id === activeCustomElement.id) {
          return { ...el, tableRows: nextRows };
        }
        return el;
      });
      onChange({
        ...block,
        content: {
          ...block.content,
          contentElements: updatedElements,
        },
      });
    }
    onUpdateSelectedElementText(activeText, { tableRows: nextRows });
  };

  const handleUpdateTableCellValue = (rowIdx: number, colIdx: number, val: string) => {
    const nextRows = [...currentTableRows];
    nextRows[rowIdx] = {
      ...nextRows[rowIdx],
      [`col-${colIdx}`]: val,
    };

    if (activeCustomElement) {
      const updatedElements = contentElements.map(el => {
        if (el.id === activeCustomElement.id) {
          return { ...el, tableRows: nextRows };
        }
        return el;
      });
      onChange({
        ...block,
        content: {
          ...block.content,
          contentElements: updatedElements,
        },
      });
    }
    onUpdateSelectedElementText(activeText, { tableRows: nextRows });
  };

  return (
    <div className="space-y-4 select-none font-sans">
      {/* 1. TOP CARD: SECTION NAME WITH LINKED TO TITLE */}
      <div className="bg-white rounded-xl border border-gray-200/90 p-3 shadow-2xs">
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">
            SECTION NAME
          </label>
          <button
            type="button"
            onClick={handleToggleLinked}
            className={`flex items-center gap-1 text-[11px] font-medium transition-colors ${
              isLinked ? 'text-gray-600 hover:text-gray-900' : 'text-gray-400 hover:text-gray-600'
            }`}
            title={isLinked ? 'Section name is synchronized with Title text' : 'Section name is unlinked from Title text'}
          >
            {isLinked ? (
              <>
                <LinkIcon className="w-3 h-3 text-gray-500" />
                <span>Linked to Title</span>
              </>
            ) : (
              <>
                <Unlink className="w-3 h-3 text-gray-400" />
                <span className="text-gray-400 line-through">Linked to Title</span>
              </>
            )}
          </button>
        </div>

        <input
          type="text"
          value={sectionName}
          onChange={e => handleSectionNameChange(e.target.value)}
          placeholder="Product Identification"
          className="w-full px-3 py-2 text-xs font-semibold rounded-lg border border-gray-200 bg-white text-gray-900 shadow-2xs focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
        />
      </div>

      {/* 1.5 LAYOUT STYLE / FORMAT SELECTOR (TABLE FORMAT FOCUS) */}
      <div className="bg-white rounded-xl border border-gray-200/90 p-3 shadow-2xs space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
            <TableIcon className="w-3.5 h-3.5 text-blue-600" />
            <span>Layout & Format</span>
          </label>
          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 uppercase">
            {block.customization.layoutStyle || 'table'} Format
          </span>
        </div>

        {/* Layout Style Switcher Buttons */}
        <div className="grid grid-cols-3 gap-1.5">
          <button
            type="button"
            onClick={() => handleSetLayoutStyle('table')}
            className={`py-1.5 px-2 rounded-lg border text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all ${
              (block.customization.layoutStyle || 'table') === 'table'
                ? 'bg-black text-white border-black shadow-xs'
                : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
            }`}
            title="Technical Standard Table Format (Crisp borders, aligned columns)"
          >
            <TableIcon className="w-3 h-3 shrink-0" />
            <span>Table</span>
          </button>

          <button
            type="button"
            onClick={() => handleSetLayoutStyle('cards')}
            className={`py-1.5 px-2 rounded-lg border text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all ${
              block.customization.layoutStyle === 'cards'
                ? 'bg-black text-white border-black shadow-xs'
                : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
            }`}
            title="Card Grid Layout"
          >
            <LayoutGrid className="w-3 h-3 shrink-0" />
            <span>Cards</span>
          </button>

          <button
            type="button"
            onClick={() => handleSetLayoutStyle('compact')}
            className={`py-1.5 px-2 rounded-lg border text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all ${
              block.customization.layoutStyle === 'compact'
                ? 'bg-black text-white border-black shadow-xs'
                : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
            }`}
            title="Compact High-Density List"
          >
            <Rows className="w-3 h-3 shrink-0" />
            <span>Compact</span>
          </button>
        </div>

        {/* Table Formatting Quick Toggles */}
        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-gray-100">
          <label className="flex items-center gap-1.5 cursor-pointer text-[11px] font-medium text-gray-700">
            <input
              type="checkbox"
              checked={block.customization.zebraStriping !== false}
              onChange={e =>
                onChange({
                  ...block,
                  customization: {
                    ...block.customization,
                    zebraStriping: e.target.checked,
                  },
                })
              }
              className="rounded text-black focus:ring-black accent-black"
            />
            <span>Zebra Striping</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer text-[11px] font-medium text-gray-700">
            <input
              type="checkbox"
              checked={block.customization.tableBorder !== false}
              onChange={e =>
                onChange({
                  ...block,
                  customization: {
                    ...block.customization,
                    tableBorder: e.target.checked,
                  },
                })
              }
              className="rounded text-black focus:ring-black accent-black"
            />
            <span>Table Borders</span>
          </label>
        </div>
      </div>

      {/* 2. MIDDLE SECTION: ADD CONTENT ELEMENT BUTTONS */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider">
            ADD CONTENT ELEMENT
          </label>
          <span className="text-[10px] text-gray-500 font-medium">Modular Blocks</span>
        </div>

        {/* 2-Row Button Grid with TABLE included */}
        <div className="space-y-2">
          {/* Row 1: Table, Heading, Paragraph */}
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleAddElement('table')}
              className="py-2 px-2 bg-blue-50/80 hover:bg-blue-100/80 hover:border-blue-300 border border-blue-200 rounded-lg text-xs font-bold text-blue-900 shadow-2xs transition-all flex items-center justify-center gap-1 active:scale-[0.98] group"
              title="Add technical parameter or procedural inspection table"
            >
              <TableIcon className="w-3.5 h-3.5 text-blue-700 group-hover:scale-110 transition-transform" />
              <span>Table</span>
            </button>

            <button
              type="button"
              onClick={() => handleAddElement('heading')}
              className="py-2 px-2 bg-white hover:bg-gray-50 hover:border-gray-300 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 shadow-2xs transition-all flex items-center justify-center gap-1 active:scale-[0.98] group"
              title="Add a custom section sub-heading"
            >
              <Type className="w-3 h-3 text-blue-600 group-hover:scale-110 transition-transform" />
              <span>Heading</span>
            </button>

            <button
              type="button"
              onClick={() => handleAddElement('paragraph')}
              className="py-2 px-2 bg-white hover:bg-gray-50 hover:border-gray-300 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 shadow-2xs transition-all flex items-center justify-center gap-1 active:scale-[0.98] group"
              title="Add explanatory paragraph text"
            >
              <FileText className="w-3 h-3 text-emerald-600 group-hover:scale-110 transition-transform" />
              <span>Paragraph</span>
            </button>
          </div>

          {/* Row 2: List, Note, Image / Diagram */}
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleAddElement('list')}
              className="py-2 px-2 bg-white hover:bg-gray-50 hover:border-gray-300 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 shadow-2xs transition-all flex items-center justify-center gap-1 active:scale-[0.98] group"
              title="Add bulleted or numbered checklist"
            >
              <List className="w-3 h-3 text-indigo-600 group-hover:scale-110 transition-transform" />
              <span>List</span>
            </button>

            <button
              type="button"
              onClick={() => handleAddElement('note')}
              className="py-2 px-2 bg-white hover:bg-gray-50 hover:border-gray-300 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 shadow-2xs transition-all flex items-center justify-center gap-1 active:scale-[0.98] group"
              title="Add technician warning or caution note"
            >
              <AlertTriangle className="w-3 h-3 text-amber-500 group-hover:scale-110 transition-transform" />
              <span>Note</span>
            </button>

            <button
              type="button"
              onClick={() => handleAddElement('image')}
              className="py-2 px-2 bg-white hover:bg-gray-50 hover:border-gray-300 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 shadow-2xs transition-all flex items-center justify-center gap-1 active:scale-[0.98] group"
              title="Add technical schematic diagram with caption"
            >
              <ImageIcon className="w-3 h-3 text-purple-600 group-hover:scale-110 transition-transform" />
              <span>Diagram</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2.5 ADDED CONTENT ELEMENTS LIST / REORDER MANAGER */}
      {contentElements.length > 0 && (
        <div className="bg-slate-50/80 border border-slate-200 rounded-xl p-2.5 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
              Section Elements ({contentElements.length})
            </span>
            <span className="text-[10px] text-slate-500">Click to focus & edit</span>
          </div>

          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {contentElements.map((el, idx) => {
              const isActive = selectedElement?.itemId === el.id || selectedElement?.fieldId === `content-el-${el.id}`;
              return (
                <div
                  key={el.id}
                  onClick={() => onSelectElement({
                    blockId: block.id,
                    fieldId: `content-el-${el.id}`,
                    elementType: el.type,
                    label: `${el.type.toUpperCase()} ELEMENT`,
                    text: el.text,
                    isBold: el.isBold,
                    textCase: el.textCase,
                    isBullet: el.isBullet,
                    listType: el.listType,
                    noteType: el.noteType,
                    imageUrl: el.imageUrl,
                    imageCaption: el.imageCaption,
                    itemId: el.id,
                  })}
                  className={`flex items-center justify-between p-2 rounded-lg border text-xs cursor-pointer transition-all ${
                    isActive
                      ? 'bg-blue-50/90 border-blue-500 ring-1 ring-blue-500 text-blue-900 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase font-mono shrink-0 ${
                      el.type === 'heading' ? 'bg-blue-100 text-blue-800' :
                      el.type === 'paragraph' ? 'bg-emerald-100 text-emerald-800' :
                      el.type === 'list' ? 'bg-indigo-100 text-indigo-800' :
                      el.type === 'note' ? 'bg-amber-100 text-amber-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {el.type}
                    </span>
                    <span className="truncate text-xs font-medium">
                      {el.text || (el.type === 'image' ? 'Diagram' : 'Empty')}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 ml-2" onClick={e => e.stopPropagation()}>
                    {/* Move Up */}
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveElement(idx, 'up')}
                      className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded hover:bg-slate-100"
                      title="Move Up"
                    >
                      <ChevronUp className="w-3 h-3" />
                    </button>

                    {/* Move Down */}
                    <button
                      type="button"
                      disabled={idx === contentElements.length - 1}
                      onClick={() => handleMoveElement(idx, 'down')}
                      className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded hover:bg-slate-100"
                      title="Move Down"
                    >
                      <ChevronDown className="w-3 h-3" />
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => handleDeleteElementById(el.id)}
                      className="p-1 text-slate-400 hover:text-red-600 rounded hover:bg-red-50"
                      title="Delete Element"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Interactive selection helper badge */}
      {selectedElement && (
        <div className="flex items-center justify-between px-3 py-1.5 bg-blue-50/80 border border-blue-200 rounded-lg text-blue-900 text-[11px]">
          <div className="flex items-center gap-1.5 font-medium truncate">
            <MousePointerClick className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="truncate">Active: <strong>{selectedElement.label}</strong></span>
          </div>
          <button
            type="button"
            onClick={() => onSelectElement({
              blockId: block.id,
              fieldId: 'title',
              elementType: 'title',
              label: 'Title Text',
              text: block.title,
              isBold: true,
            })}
            className="text-[10px] font-bold text-blue-700 hover:text-blue-900 hover:underline shrink-0 ml-2"
          >
            Reset to Title
          </button>
        </div>
      )}

      {/* 3. BOTTOM CARD: ACTIVE ELEMENT EDITOR */}
      <div className="bg-white rounded-2xl border-2 border-gray-900 p-4 shadow-xs space-y-3">
        {/* Top Header of Card: Red Dot + EDITING TITLE TEXT + Trash Can */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#f87171] inline-block shrink-0 shadow-2xs animate-pulse" />
            <span className="text-xs font-black text-gray-900 tracking-wider font-mono truncate max-w-[200px]">
              {getEditingHeader()}
            </span>
          </div>

          <button
            type="button"
            onClick={onDeleteSelectedElement}
            className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Delete or clear this field"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Field Label & Black Active Field Badge */}
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-black text-gray-800 uppercase tracking-wider truncate max-w-[160px]">
            {getFieldLabel()}
          </label>
          <span className="px-2.5 py-0.5 bg-black text-white text-[10px] font-bold rounded-full tracking-wide shrink-0">
            Active Field
          </span>
        </div>

        {/* TABLE MATRIX CONTROLS IF EDITING A TABLE */}
        {(selectedElement?.elementType === 'table' || activeCustomElement?.type === 'table') && (
          <div className="space-y-3 bg-blue-50/40 p-3 rounded-xl border border-blue-200">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
                <TableIcon className="w-3.5 h-3.5 text-blue-700" />
                Table Columns & Rows
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleAddTableColumn}
                  className="px-2 py-1 bg-white hover:bg-blue-50 border border-blue-300 text-blue-800 text-[10px] font-bold rounded shadow-2xs flex items-center gap-1"
                  title="Add new column to table"
                >
                  <Plus className="w-3 h-3" /> Add Col
                </button>
                <button
                  type="button"
                  onClick={handleAddTableRow}
                  className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold rounded shadow-2xs flex items-center gap-1"
                  title="Add new row to table"
                >
                  <Plus className="w-3 h-3" /> Add Row
                </button>
              </div>
            </div>

            {/* Column Headers Editor */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-wider">
                Column Headers ({currentTableColumns.length})
              </label>
              <div className="space-y-1">
                {currentTableColumns.map((col, cIdx) => (
                  <div key={cIdx} className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono font-bold text-gray-500 w-4">{cIdx + 1}</span>
                    <input
                      type="text"
                      value={col}
                      onChange={e => handleUpdateColumnTitle(cIdx, e.target.value)}
                      placeholder={`Column ${cIdx + 1}`}
                      className="flex-1 px-2 py-1 text-xs rounded border border-gray-300 bg-white font-bold text-gray-800 focus:border-black outline-none"
                    />
                    {currentTableColumns.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveTableColumn(cIdx)}
                        className="p-1 text-gray-400 hover:text-red-600 rounded"
                        title="Delete Column"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Table Rows Quick Cell Editor */}
            <div className="space-y-1.5 pt-2 border-t border-blue-200/80">
              <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-wider">
                Table Rows ({currentTableRows.length})
              </label>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {currentTableRows.map((row, rIdx) => (
                  <div key={row.id || rIdx} className="p-2 bg-white rounded-lg border border-gray-200 shadow-2xs space-y-1.5">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-1">
                      <span className="text-[10px] font-mono font-bold text-gray-600">Row #{rIdx + 1}</span>
                      <div className="flex items-center gap-0.5">
                        <button
                          type="button"
                          disabled={rIdx === 0}
                          onClick={() => handleReorderTableRow(rIdx, 'up')}
                          className="p-0.5 text-gray-400 hover:text-gray-700 disabled:opacity-20 rounded"
                          title="Move row up"
                        >
                          <ChevronUp className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          disabled={rIdx === currentTableRows.length - 1}
                          onClick={() => handleReorderTableRow(rIdx, 'down')}
                          className="p-0.5 text-gray-400 hover:text-gray-700 disabled:opacity-20 rounded"
                          title="Move row down"
                        >
                          <ChevronDown className="w-3 h-3" />
                        </button>
                        {currentTableRows.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveTableRow(rIdx)}
                            className="p-0.5 text-gray-400 hover:text-red-600 rounded"
                            title="Delete Row"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-1">
                      {currentTableColumns.map((col, cIdx) => (
                        <div key={cIdx} className="flex items-center gap-1.5">
                          <span className="text-[9px] font-semibold text-gray-500 w-16 truncate" title={col}>{col}:</span>
                          <input
                            type="text"
                            value={row[`col-${cIdx}`] || (row as any)[col] || ''}
                            onChange={e => handleUpdateTableCellValue(rIdx, cIdx, e.target.value)}
                            placeholder={`Enter ${col}...`}
                            className="flex-1 px-2 py-0.5 text-xs rounded border border-gray-200 bg-gray-50/50 text-gray-800 focus:bg-white focus:border-black outline-none"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* NOTE STYLE SELECTOR IF EDITING A NOTE */}
        {selectedElement && (selectedElement.elementType === 'note' || activeCustomElement?.type === 'note') && (
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">
              Note Callout Style
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { type: 'warning', label: 'Caution', icon: AlertTriangle, color: 'bg-amber-100 text-amber-800 border-amber-300' },
                { type: 'danger', label: 'Danger', icon: AlertOctagon, color: 'bg-red-100 text-red-800 border-red-300' },
                { type: 'info', label: 'Info', icon: Info, color: 'bg-blue-100 text-blue-800 border-blue-300' },
                { type: 'success', label: 'Pass', icon: CheckCircle2, color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
              ].map(opt => (
                <button
                  key={opt.type}
                  type="button"
                  onClick={() => onUpdateSelectedElementText(activeText, { noteType: opt.type as any })}
                  className={`py-1 px-1.5 rounded-lg border text-[10px] font-bold flex items-center justify-center gap-1 transition-all ${
                    currentNoteType === opt.type
                      ? `${opt.color} ring-2 ring-black/20 font-black`
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <opt.icon className="w-3 h-3 shrink-0" />
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* LIST STYLE TOGGLE IF EDITING A LIST */}
        {selectedElement && (selectedElement.elementType === 'list' || activeCustomElement?.type === 'list') && (
          <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-200">
            <span className="text-[10px] font-bold text-slate-700 uppercase">List Format</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onUpdateSelectedElementText(activeText, { listType: 'bullet', isBullet: true })}
                className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 ${
                  currentListType === 'bullet' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-700 border border-slate-200'
                }`}
              >
                <List className="w-3 h-3" /> Bulleted
              </button>
              <button
                type="button"
                onClick={() => onUpdateSelectedElementText(activeText, { listType: 'numbered', isBullet: false })}
                className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 ${
                  currentListType === 'numbered' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-700 border border-slate-200'
                }`}
              >
                <ListOrdered className="w-3 h-3" /> Numbered (1, 2, 3)
              </button>
            </div>
          </div>
        )}

        {/* IMAGE CONTROLS IF EDITING AN IMAGE / DIAGRAM */}
        {selectedElement && (selectedElement.elementType === 'image' || activeCustomElement?.type === 'image') && (
          <div className="space-y-3 bg-slate-50/80 p-3 rounded-xl border border-slate-200">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-slate-700 uppercase">Diagram Image Source</label>
                <button
                  type="button"
                  onClick={() => setShowPresets(!showPresets)}
                  className="text-[10px] font-semibold text-blue-600 hover:text-blue-800"
                >
                  {showPresets ? 'Hide Presets' : 'Choose Preset Schematic'}
                </button>
              </div>

              {/* Preset Schematics Picker */}
              {showPresets && (
                <div className="grid grid-cols-2 gap-2 p-2 bg-white rounded-lg border border-slate-200 mb-2">
                  {PRESET_DIAGRAMS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        onUpdateSelectedElementText(activeText, { imageUrl: preset.url, imageCaption: preset.caption });
                        setShowPresets(false);
                      }}
                      className="text-left p-1.5 rounded border border-slate-200 hover:border-blue-500 hover:bg-blue-50/40 text-[10px] transition-colors"
                    >
                      <img src={preset.url} alt={preset.name} className="h-12 w-full object-cover rounded mb-1" referrerPolicy="no-referrer" />
                      <p className="font-bold text-slate-800 truncate">{preset.name}</p>
                    </button>
                  ))}
                </div>
              )}

              {/* URL input and File upload */}
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={currentImageUrl}
                  onChange={e => {
                    const url = e.target.value;
                    onUpdateSelectedElementText(activeText, { imageUrl: url });
                  }}
                  placeholder="Paste image URL (https://...)"
                  className="flex-1 px-2.5 py-1.5 text-xs rounded-md border border-gray-200 bg-white font-mono text-gray-800 focus:border-black focus:ring-1 focus:ring-black outline-none"
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-md flex items-center gap-1 shrink-0 shadow-2xs"
                  title="Upload local diagram image"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload</span>
                </button>
              </div>
            </div>

            {/* Image Preview thumbnail */}
            {currentImageUrl && (
              <div className="w-full h-28 rounded-lg overflow-hidden border border-gray-200 bg-white flex items-center justify-center p-1 relative group">
                <img
                  src={currentImageUrl}
                  alt="Diagram Preview"
                  className="max-h-full max-w-full object-contain rounded"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}

            {/* Caption text */}
            <div>
              <label className="block text-[10px] font-bold text-slate-700 uppercase mb-0.5">
                Figure Caption / Label
              </label>
              <input
                type="text"
                value={currentImageCaption}
                onChange={e => onUpdateSelectedElementText(activeText, { imageCaption: e.target.value })}
                placeholder="e.g. Fig 1.2: Exploded view of driver chamber"
                className="w-full px-2.5 py-1.5 text-xs rounded-md border border-gray-200 bg-white text-gray-800 focus:border-black outline-none"
              />
            </div>
          </div>
        )}

        {/* Main Textarea for active field */}
        <div className="relative">
          <AutoResizeTextarea
            minRows={4}
            value={activeText}
            onChange={e => handleActiveTextChange(e.target.value)}
            placeholder={
              selectedElement?.elementType === 'image' ? 'Enter diagram title or notes...' :
              selectedElement?.elementType === 'list' ? 'Enter list items (one per line)...' :
              'Type text content here...'
            }
            className={`w-full p-3 text-xs sm:text-sm rounded-lg border border-gray-200 bg-white text-gray-900 focus:border-black focus:ring-2 focus:ring-black/10 focus:border-black outline-none leading-relaxed transition-all ${
              isCurrentBold ? 'font-bold' : 'font-medium'
            }`}
          />
        </div>

        {/* Bottom Toolbar: Bold, Case, Bullet */}
        <div className="flex items-center gap-2 pt-0.5">
          {/* Bold Button */}
          <button
            type="button"
            onClick={handleToggleBold}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs ${
              isCurrentBold
                ? 'bg-gray-100 border-gray-300 text-gray-900 font-bold'
                : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-700'
            }`}
            title="Toggle Bold Style"
          >
            <span className="font-serif font-black text-sm">B</span>
            <span>Bold</span>
          </button>

          {/* Case Button */}
          <button
            type="button"
            onClick={handleCycleCase}
            className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
            title="Cycle Case (UPPERCASE, Title Case, lowercase)"
          >
            <span className="font-serif text-sm">T</span>
            <span>Case</span>
          </button>

          {/* Bullet Button */}
          <button
            type="button"
            onClick={handleToggleBullet}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs ${
              isCurrentBullet
                ? 'bg-gray-100 border-gray-300 text-gray-900'
                : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-700'
            }`}
            title="Toggle Bullet List formatting"
          >
            <List className="w-3.5 h-3.5 text-gray-600" />
            <span>Bullet</span>
          </button>
        </div>
      </div>
    </div>
  );
};
