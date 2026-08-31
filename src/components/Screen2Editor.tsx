import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Copy, 
  ArrowUp, 
  ArrowDown, 
  Eye, 
  Layers, 
  Columns, 
  Sparkles, 
  Sliders, 
  CheckCircle2, 
  Search, 
  FileText, 
  Settings2, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Palette,
  Check,
  CheckCheck,
  ChevronRight,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  PanelLeft,
  PanelRight,
  GripVertical,
  Shield,
  ChevronDown
} from 'lucide-react';
import { 
  ServicePlanDocument, 
  ServicePlanBlock, 
  SelectedDocElement 
} from '../types';
import { BlockEditors } from './BlockEditors';
import { DocumentPDFView } from './DocumentPDFView';
import { AddBlockModal } from './AddBlockModal';
import { SectionCustomizerPanel } from './SectionCustomizerPanel';

interface Screen2EditorProps {
  document: ServicePlanDocument;
  setDocument: React.Dispatch<React.SetStateAction<ServicePlanDocument>>;
  viewMode: 'single_block' | 'full_pdf' | 'split';
  setViewMode: (mode: 'single_block' | 'full_pdf' | 'split') => void;
  activeBlockId: string;
  setActiveBlockId: (id: string) => void;
}

export const Screen2Editor: React.FC<Screen2EditorProps> = ({
  document,
  setDocument,
  viewMode,
  setViewMode,
  activeBlockId,
  setActiveBlockId,
}) => {
  const [searchFilter, setSearchFilter] = useState('');
  const [rightTab, setRightTab] = useState<'customize' | 'doc_settings'>('customize');
  const [isAddBlockOpen, setIsAddBlockOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [syncSuccessMsg, setSyncSuccessMsg] = useState<string | null>(null);

  const ACCENT_PALETTE_PRESETS = [
    { hex: '#1e40af', label: 'boAt Royal Navy' },
    { hex: '#0f172a', label: 'Obsidian Slate' },
    { hex: '#0284c7', label: 'Azure Sky' },
    { hex: '#0f766e', label: 'Ocean Teal' },
    { hex: '#059669', label: 'Emerald Forest' },
    { hex: '#dc2626', label: 'Crimson Red' },
    { hex: '#ea580c', label: 'Sunset Amber' },
    { hex: '#7c3aed', label: 'Royal Purple' },
    { hex: '#e11d48', label: 'Vivid Rose' },
    { hex: '#4b5563', label: 'Graphite Slate' },
    { hex: '#111827', label: 'Pure Onyx' },
    { hex: '#4338ca', label: 'Deep Indigo' },
  ];

  // --- Flexible Panel Layout State (Figma Style) ---
  const [leftPanelWidth, setLeftPanelWidth] = useState<number>(290);
  const [isLeftCollapsed, setIsLeftCollapsed] = useState<boolean>(false);
  const [isDraggingLeft, setIsDraggingLeft] = useState<boolean>(false);

  const [rightPanelWidth, setRightPanelWidth] = useState<number>(350);
  const [isRightCollapsed, setIsRightCollapsed] = useState<boolean>(false);
  const [isDraggingRight, setIsDraggingRight] = useState<boolean>(false);

  const dragStartXRef = useRef<number>(0);
  const dragStartWidthRef = useRef<number>(0);

  // Resize mouse listeners
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingLeft) {
        const delta = e.clientX - dragStartXRef.current;
        const newWidth = Math.max(220, Math.min(480, dragStartWidthRef.current + delta));
        setLeftPanelWidth(newWidth);
      } else if (isDraggingRight) {
        const delta = dragStartXRef.current - e.clientX;
        const newWidth = Math.max(280, Math.min(560, dragStartWidthRef.current + delta));
        setRightPanelWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsDraggingLeft(false);
      setIsDraggingRight(false);
      if (typeof window !== 'undefined' && window.document && window.document.body) {
        window.document.body.style.cursor = '';
        window.document.body.style.userSelect = '';
      }
    };

    if (isDraggingLeft || isDraggingRight) {
      if (typeof window !== 'undefined' && window.document && window.document.body) {
        window.document.body.style.cursor = 'col-resize';
        window.document.body.style.userSelect = 'none';
      }
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      if (typeof window !== 'undefined' && window.document && window.document.body) {
        window.document.body.style.cursor = '';
        window.document.body.style.userSelect = '';
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingLeft, isDraggingRight]);

  // Keyboard shortcut listener (Alt+1 / Alt+2 or Ctrl+\)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when user is typing inside an input or textarea
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }

      if (e.altKey && (e.key === '1' || e.code === 'Digit1')) {
        e.preventDefault();
        setIsLeftCollapsed(prev => !prev);
      } else if (e.altKey && (e.key === '2' || e.code === 'Digit2')) {
        e.preventDefault();
        setIsRightCollapsed(prev => !prev);
      } else if ((e.metaKey || e.ctrlKey) && e.key === '\\') {
        e.preventDefault();
        setIsLeftCollapsed(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLeftResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDraggingLeft(true);
    dragStartXRef.current = e.clientX;
    dragStartWidthRef.current = leftPanelWidth;
  };

  const handleRightResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDraggingRight(true);
    dragStartXRef.current = e.clientX;
    dragStartWidthRef.current = rightPanelWidth;
  };

  // Active Block
  const activeBlock = document.blocks.find(b => b.id === activeBlockId) || document.blocks[0];

  // Selected document element for live document clicking & customizer synchronization
  const [selectedElement, setSelectedElement] = useState<SelectedDocElement | null>({
    blockId: activeBlock?.id || '',
    fieldId: 'title',
    elementType: 'title',
    label: 'Title Text',
    text: activeBlock?.title || '',
    isBold: true,
    textCase: activeBlock?.title === activeBlock?.title?.toUpperCase() ? 'uppercase' : 'capitalize',
  });

  // When activeBlock changes from Lane 1, sync selectedElement if needed
  const handleSelectBlockFromLane1 = (blockId: string) => {
    setActiveBlockId(blockId);
    const target = document.blocks.find(b => b.id === blockId);
    if (target) {
      setSelectedElement({
        blockId: target.id,
        fieldId: 'title',
        elementType: 'title',
        label: `Title (${target.title})`,
        text: target.title,
        isBold: true,
        textCase: target.title === target.title.toUpperCase() ? 'uppercase' : 'capitalize',
      });
    }
  };

  // Handler when user clicks ANY element on the PDF or editor
  const handleSelectDocElement = (element: SelectedDocElement | null) => {
    setSelectedElement(element);
    if (element && element.blockId && element.blockId !== 'doc-root') {
      setActiveBlockId(element.blockId);
    }
    // Automatically reveal right panel if it was collapsed so user can customize seamlessly
    if (isRightCollapsed) {
      setIsRightCollapsed(false);
    }
    // Switch to Customizer tab automatically so user can edit right away
    setRightTab('customize');
  };

  // Real-time updater when user types or formats the selected element
  const handleUpdateSelectedElementText = (newText: string, updates?: Partial<SelectedDocElement>) => {
    if (!selectedElement) return;

    const nextSelected = {
      ...selectedElement,
      text: newText,
      ...updates,
    };
    setSelectedElement(nextSelected);

    const targetBlockId = selectedElement.blockId;

    // 1. If it's a global document property (e.g. brand, watermark, productName, modelCode)
    if (targetBlockId === 'doc-root') {
      const field = selectedElement.fieldId as keyof ServicePlanDocument;
      setDocument(prev => ({
        ...prev,
        [field]: newText,
      }));
      return;
    }

    // 2. Otherwise update the specific block and field
    setDocument(prev => {
      const updatedBlocks = prev.blocks.map(block => {
        if (block.id !== targetBlockId) return block;

        const updated = JSON.parse(JSON.stringify(block)) as ServicePlanBlock;

        // Title
        if (selectedElement.fieldId === 'title') {
          updated.title = newText;
          if (updated.customization.isLinkedToTitle !== false) {
            updated.customization.sectionName = newText;
          }
          return updated;
        }

        // Section Number
        if (selectedElement.fieldId === 'sectionNumber') {
          updated.sectionNumber = newText;
          return updated;
        }

        // Subtitle
        if (selectedElement.fieldId === 'subtitle') {
          updated.subtitle = newText;
          return updated;
        }

        // Customization Note Text
        if (selectedElement.fieldId === 'customization-noteText' || selectedElement.fieldId === 'noteText') {
          updated.customization.noteText = newText;
          return updated;
        }

        // Custom contentElements
        if (selectedElement.fieldId.startsWith('content-el-')) {
          const elId = selectedElement.itemId;
          if (updated.content.contentElements) {
            updated.content.contentElements = updated.content.contentElements.map(el => {
              if (el.id === elId) {
                return {
                  ...el,
                  text: newText,
                  isBold: updates?.isBold !== undefined ? updates.isBold : el.isBold,
                  textCase: updates?.textCase !== undefined ? updates.textCase : el.textCase,
                  isBullet: updates?.isBullet !== undefined ? updates.isBullet : el.isBullet,
                  listType: updates?.listType !== undefined ? updates.listType : el.listType,
                  noteType: updates?.noteType !== undefined ? updates.noteType : el.noteType,
                  imageUrl: updates?.imageUrl !== undefined ? updates.imageUrl : el.imageUrl,
                  imageCaption: updates?.imageCaption !== undefined ? updates.imageCaption : el.imageCaption,
                  tableColumns: updates?.tableColumns !== undefined ? updates.tableColumns : el.tableColumns,
                  tableRows: updates?.tableRows !== undefined ? updates.tableRows : el.tableRows,
                  listItems: el.type === 'list' || el.isBullet || updates?.isBullet ? newText.split('\n').filter(Boolean) : undefined,
                };
              }
              return el;
            });
          }
          return updated;
        }

        // Objective
        if (selectedElement.fieldId === 'objective') {
          updated.content.objective = newText;
          return updated;
        }

        // Document Owner
        if (selectedElement.fieldId === 'documentOwner') {
          updated.content.documentOwner = newText;
          return updated;
        }

        // Feature highlight item
        if (selectedElement.fieldId.startsWith('feature-')) {
          const idx = parseInt(selectedElement.itemId || '0', 10);
          if (updated.content.featureHighlights) {
            updated.content.featureHighlights[idx] = newText;
          }
          return updated;
        }

        // Packaging item
        if (selectedElement.fieldId.startsWith('pkg-')) {
          const idx = parseInt(selectedElement.itemId || '0', 10);
          if (updated.content.packagingList) {
            updated.content.packagingList[idx] = newText;
          }
          return updated;
        }

        // Charging notes item
        if (selectedElement.fieldId.startsWith('cg-note-')) {
          const idx = parseInt(selectedElement.itemId || '0', 10);
          if (updated.content.chargingNotes) {
            updated.content.chargingNotes[idx] = newText;
          }
          return updated;
        }

        // Definitions
        if (selectedElement.fieldId.startsWith('def-') && selectedElement.itemId) {
          if (updated.content.definitions) {
            updated.content.definitions = updated.content.definitions.map(d => {
              if (d.id === selectedElement.itemId) {
                return {
                  ...d,
                  [selectedElement.subKey || 'term']: newText,
                };
              }
              return d;
            });
          }
          return updated;
        }

        // Specifications
        if (selectedElement.fieldId.startsWith('spec-') && selectedElement.itemId) {
          if (updated.content.specifications) {
            updated.content.specifications = updated.content.specifications.map(s => {
              if (s.id === selectedElement.itemId) {
                return {
                  ...s,
                  [selectedElement.subKey || 'value']: newText,
                };
              }
              return s;
            });
          }
          return updated;
        }

        // Colour Variants
        if (selectedElement.fieldId.startsWith('variant-') && selectedElement.itemId) {
          if (updated.content.colourVariants) {
            updated.content.colourVariants = updated.content.colourVariants.map(v => {
              if (v.id === selectedElement.itemId) {
                return {
                  ...v,
                  name: newText,
                };
              }
              return v;
            });
          }
          return updated;
        }

        // Functionalities
        if (selectedElement.fieldId.startsWith('fn-') && selectedElement.itemId) {
          if (updated.content.functionalities) {
            updated.content.functionalities = updated.content.functionalities.map(f => {
              if (f.id === selectedElement.itemId) {
                return {
                  ...f,
                  [selectedElement.subKey || 'functionName']: newText,
                };
              }
              return f;
            });
          }
          return updated;
        }

        // Case / Earbuds / Reset LED
        if (selectedElement.fieldId.startsWith('case-led-') && selectedElement.itemId) {
          if (updated.content.caseLedIndications) {
            updated.content.caseLedIndications = updated.content.caseLedIndications.map(l => {
              if (l.id === selectedElement.itemId) {
                return { ...l, [selectedElement.subKey || 'scenario']: newText };
              }
              return l;
            });
          }
          return updated;
        }
        if (selectedElement.fieldId.startsWith('ear-led-') && selectedElement.itemId) {
          if (updated.content.earbudsLedIndications) {
            updated.content.earbudsLedIndications = updated.content.earbudsLedIndications.map(l => {
              if (l.id === selectedElement.itemId) {
                return { ...l, [selectedElement.subKey || 'scenario']: newText };
              }
              return l;
            });
          }
          return updated;
        }
        if (selectedElement.fieldId.startsWith('reset-led-') && selectedElement.itemId) {
          if (updated.content.factoryResetLed) {
            updated.content.factoryResetLed = updated.content.factoryResetLed.map(l => {
              if (l.id === selectedElement.itemId) {
                return { ...l, [selectedElement.subKey || 'scenario']: newText };
              }
              return l;
            });
          }
          return updated;
        }

        // Charging guidelines
        if (selectedElement.fieldId.startsWith('cg-') && selectedElement.itemId) {
          if (updated.content.chargingGuidelines) {
            updated.content.chargingGuidelines = updated.content.chargingGuidelines.map(c => {
              if (c.id === selectedElement.itemId) {
                return { ...c, [selectedElement.subKey || 'statement']: newText };
              }
              return c;
            });
          }
          return updated;
        }

        // Weight Matrix
        if (selectedElement.fieldId.startsWith('wm-') && selectedElement.subKey) {
          if (updated.content.weightMatrixRows && selectedElement.itemId) {
            updated.content.weightMatrixRows = updated.content.weightMatrixRows.map(r => {
              if (r.id === selectedElement.itemId) {
                return { ...r, [selectedElement.subKey!]: newText };
              }
              return r;
            });
            if (updated.content.weightMatrixRows[0]) {
              updated.content.weightMatrix = { ...updated.content.weightMatrixRows[0] };
            }
          } else if (updated.content.weightMatrix) {
            // @ts-ignore
            updated.content.weightMatrix[selectedElement.subKey] = newText;
          }
          return updated;
        }

        // Hearables App tabs & guide steps
        if (selectedElement.fieldId.startsWith('app-tab-') && selectedElement.itemId) {
          if (updated.content.hearablesAppTabs) {
            updated.content.hearablesAppTabs = updated.content.hearablesAppTabs.map(t => {
              if (t.id === selectedElement.itemId) {
                return { ...t, tabName: newText };
              }
              return t;
            });
          }
          return updated;
        }
        if (selectedElement.fieldId.startsWith('app-') && selectedElement.itemId) {
          if (updated.content.hearablesGuideSteps) {
            updated.content.hearablesGuideSteps = updated.content.hearablesGuideSteps.map(s => {
              if (s.id === selectedElement.itemId) {
                return { ...s, [selectedElement.subKey || 'functionName']: newText };
              }
              return s;
            });
          }
          return updated;
        }

        // Service Channels & Troubleshooting
        if (selectedElement.fieldId.startsWith('srv-chan-') && selectedElement.itemId) {
          if (updated.content.serviceChannels) {
            updated.content.serviceChannels = updated.content.serviceChannels.map(c => {
              if (c.id === selectedElement.itemId) {
                return { ...c, details: newText };
              }
              return c;
            });
          }
          return updated;
        }

        if (selectedElement.fieldId.startsWith('tb-') && selectedElement.itemId) {
          if (updated.content.troubleshootingItems) {
            updated.content.troubleshootingItems = updated.content.troubleshootingItems.map(item => {
              if (item.id === selectedElement.itemId) {
                if (selectedElement.fieldId.startsWith('tb-step-')) {
                  const stepIdx = parseInt(selectedElement.fieldId.split('-').pop() || '0', 10);
                  const inst = [...item.instructions];
                  inst[stepIdx] = newText;
                  return { ...item, instructions: inst };
                }
                return { ...item, [selectedElement.subKey || 'issue']: newText };
              }
              return item;
            });
          }
          return updated;
        }

        // Return codes
        if (selectedElement.fieldId.startsWith('rc-') && selectedElement.itemId) {
          if (updated.content.returnCodes) {
            updated.content.returnCodes = updated.content.returnCodes.map(r => {
              if (r.id === selectedElement.itemId) {
                return { ...r, [selectedElement.subKey || 'productDesc']: newText };
              }
              return r;
            });
          }
          return updated;
        }

        // Annexure
        if (selectedElement.fieldId === 'annexureTestingSop') {
          updated.content.annexureTestingSop = newText;
          return updated;
        }
        if (selectedElement.fieldId === 'annexureTutorialLinks') {
          updated.content.annexureTutorialLinks = newText;
          return updated;
        }

        return updated;
      });

      return { ...prev, blocks: updatedBlocks };
    });
  };

  // Handler to delete or reset selected element
  const handleDeleteSelectedElement = () => {
    if (!selectedElement) return;

    if (selectedElement.fieldId.startsWith('content-el-') && selectedElement.itemId) {
      const targetElId = selectedElement.itemId;
      setDocument(prev => {
        const updatedBlocks = prev.blocks.map(block => {
          if (block.id !== selectedElement.blockId) return block;
          const remainingElements = (block.content.contentElements || []).filter(el => el.id !== targetElId);
          return {
            ...block,
            content: {
              ...block.content,
              contentElements: remainingElements,
            },
          };
        });
        return { ...prev, blocks: updatedBlocks };
      });
      // reset to title
      setSelectedElement({
        blockId: activeBlock.id,
        fieldId: 'title',
        elementType: 'title',
        label: 'Title Text',
        text: activeBlock.title,
        isBold: true,
      });
    } else if (selectedElement.fieldId.startsWith('feature-') && selectedElement.itemId) {
      const idx = parseInt(selectedElement.itemId, 10);
      setDocument(prev => {
        const updatedBlocks = prev.blocks.map(block => {
          if (block.id !== selectedElement.blockId) return block;
          const list = [...(block.content.featureHighlights || [])];
          if (list.length > 1) {
            list.splice(idx, 1);
          } else {
            list[0] = '';
          }
          return {
            ...block,
            content: {
              ...block.content,
              featureHighlights: list,
            },
          };
        });
        return { ...prev, blocks: updatedBlocks };
      });
      setSelectedElement(null);
    } else if (selectedElement.fieldId.startsWith('pkg-') && selectedElement.itemId) {
      const idx = parseInt(selectedElement.itemId, 10);
      setDocument(prev => {
        const updatedBlocks = prev.blocks.map(block => {
          if (block.id !== selectedElement.blockId) return block;
          const list = [...(block.content.packagingList || [])];
          if (list.length > 1) {
            list.splice(idx, 1);
          } else {
            list[0] = '';
          }
          return {
            ...block,
            content: {
              ...block.content,
              packagingList: list,
            },
          };
        });
        return { ...prev, blocks: updatedBlocks };
      });
      setSelectedElement(null);
    } else if (selectedElement.fieldId.startsWith('cg-note-') && selectedElement.itemId) {
      const idx = parseInt(selectedElement.itemId, 10);
      setDocument(prev => {
        const updatedBlocks = prev.blocks.map(block => {
          if (block.id !== selectedElement.blockId) return block;
          const list = [...(block.content.chargingNotes || [])];
          if (list.length > 1) {
            list.splice(idx, 1);
          } else {
            list[0] = '';
          }
          return {
            ...block,
            content: {
              ...block.content,
              chargingNotes: list,
            },
          };
        });
        return { ...prev, blocks: updatedBlocks };
      });
      setSelectedElement(null);
    } else {
      // Clear text
      handleUpdateSelectedElementText('');
    }
  };

  // Filtered blocks in Lane 1
  const filteredBlocks = document.blocks.filter(b =>
    b.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
    b.sectionNumber.toLowerCase().includes(searchFilter.toLowerCase()) ||
    b.archetype.toLowerCase().includes(searchFilter.toLowerCase())
  );

  // Update active block
  const handleUpdateBlock = (updatedBlock: ServicePlanBlock) => {
    setDocument(prev => ({
      ...prev,
      blocks: prev.blocks.map(b => (b.id === updatedBlock.id ? updatedBlock : b)),
    }));
  };

  // Apply accent color to single section or globally across all sections
  const handleApplyAccentColor = (colorHex: string, applyToAll: boolean = false) => {
    setDocument(prev => ({
      ...prev,
      themeColor: applyToAll ? colorHex : prev.themeColor,
      blocks: prev.blocks.map(b => {
        if (applyToAll || (activeBlock && b.id === activeBlock.id)) {
          return {
            ...b,
            customization: {
              ...b.customization,
              accentColor: colorHex,
            },
          };
        }
        return b;
      }),
    }));

    if (applyToAll) {
      setSyncSuccessMsg(`Accent applied to all ${document.blocks.length} sections & doc theme!`);
      setTimeout(() => setSyncSuccessMsg(null), 3500);
    }
  };

  // Reordering helpers
  const handleMoveBlock = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= document.blocks.length) return;

    const newBlocks = [...document.blocks];
    const [moved] = newBlocks.splice(index, 1);
    newBlocks.splice(targetIndex, 0, moved);

    setDocument(prev => ({ ...prev, blocks: newBlocks }));
  };

  const handleDuplicateBlock = (block: ServicePlanBlock) => {
    const duplicated: ServicePlanBlock = {
      ...JSON.parse(JSON.stringify(block)),
      id: `block-${Date.now()}`,
      title: `${block.title} (Copy)`,
      sectionNumber: `${block.sectionNumber}.1`,
    };

    setDocument(prev => {
      const idx = prev.blocks.findIndex(b => b.id === block.id);
      const newBlocks = [...prev.blocks];
      newBlocks.splice(idx + 1, 0, duplicated);
      return { ...prev, blocks: newBlocks };
    });
    setActiveBlockId(duplicated.id);
  };

  const handleDeleteBlock = (blockId: string) => {
    if (document.blocks.length <= 1) return;
    setDocument(prev => {
      const remaining = prev.blocks.filter(b => b.id !== blockId);
      if (activeBlockId === blockId) {
        setActiveBlockId(remaining[0]?.id || '');
      }
      return { ...prev, blocks: remaining };
    });
  };

  const handleToggleBlockEnabled = (blockId: string) => {
    setDocument(prev => ({
      ...prev,
      blocks: prev.blocks.map(b => (b.id === blockId ? { ...b, enabled: !b.enabled } : b)),
    }));
  };

  const handleAddBlock = (newBlock: ServicePlanBlock) => {
    setDocument(prev => ({
      ...prev,
      blocks: [...prev.blocks, newBlock],
    }));
    setActiveBlockId(newBlock.id);
  };

  return (
    <div className="h-[calc(100vh-3.8rem)] flex overflow-hidden bg-[#F9FAFB] text-[#111827] relative">
      {/* Accent Color Sync Toast Notification */}
      {syncSuccessMsg && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-50 bg-black/90 text-white px-4 py-2 rounded-full text-xs font-semibold shadow-xl backdrop-blur-xs flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{syncSuccessMsg}</span>
        </div>
      )}
      {/* ========================================================================= */}
      {/* LANE 1 (LEFT): Sections List & Block Tree (Figma Style Resizable/Collapsible) */}
      {/* ========================================================================= */}
      {isLeftCollapsed ? (
        <aside 
          className="w-11 shrink-0 bg-white border-r border-[#E5E7EB] flex flex-col items-center py-2.5 h-full z-20 transition-all select-none shadow-2xs justify-between group"
          id="lane1-sections-collapsed"
        >
          {/* Top collapsed controls */}
          <div className="flex flex-col items-center gap-2 w-full px-1">
            <button
              type="button"
              onClick={() => setIsLeftCollapsed(false)}
              className="p-2 text-gray-500 hover:text-black hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              title="Expand Sections Panel (Alt + 1)"
            >
              <PanelLeftOpen className="w-4 h-4" />
            </button>

            {/* Quick Section Count Pill */}
            <div 
              className="px-1.5 py-0.5 bg-gray-100 text-gray-700 font-mono font-bold text-[10px] rounded-full border border-gray-200 text-center cursor-pointer hover:bg-gray-200 transition-colors"
              title={`${document.blocks.filter(b => b.enabled).length} of ${document.blocks.length} sections active. Click to expand.`}
              onClick={() => setIsLeftCollapsed(false)}
            >
              {document.blocks.filter(b => b.enabled).length}
            </div>

            {/* Quick Add Block Button */}
            <button
              type="button"
              onClick={() => setIsAddBlockOpen(true)}
              className="p-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-md transition-colors cursor-pointer shadow-2xs"
              title="Add Block"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Middle Vertical Label */}
          <button
            type="button"
            onClick={() => setIsLeftCollapsed(false)}
            className="flex items-center justify-center [writing-mode:vertical-rl] rotate-180 text-[10px] font-bold tracking-widest text-gray-400 hover:text-gray-900 transition-colors py-4 uppercase cursor-pointer select-none"
            title="Click to expand Sections panel"
          >
            Sections
          </button>

          {/* Bottom Expand Tab Icon */}
          <button
            type="button"
            onClick={() => setIsLeftCollapsed(false)}
            className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
            title="Expand Sections Panel"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </aside>
      ) : (
        <aside 
          style={{ width: `${leftPanelWidth}px` }}
          className="shrink-0 bg-white border-r border-[#E5E7EB] flex flex-col h-full z-20 relative select-text"
          id="lane1-sections-expanded"
        >
          {/* Lane 1 Header */}
          <div className="p-3 border-b border-[#E5E7EB] space-y-2 bg-gray-50/50">
            <div className="flex items-center justify-between gap-1">
              <div className="flex items-center gap-1.5 min-w-0">
                <Layers className="w-3.5 h-3.5 text-gray-700 shrink-0" />
                <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider truncate">
                  Sections ({document.blocks.filter(b => b.enabled).length}/{document.blocks.length})
                </span>
              </div>
              
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsAddBlockOpen(true)}
                  className="flex items-center gap-1 px-2 py-1 bg-blue-700 hover:bg-blue-800 text-white rounded text-xs font-medium transition-colors"
                  title="Add New Document Block"
                >
                  <Plus className="w-3 h-3" />
                  <span className="hidden sm:inline">Add Block</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsLeftCollapsed(true)}
                  className="p-1 text-gray-400 hover:text-gray-900 hover:bg-gray-200/70 rounded transition-colors"
                  title="Collapse Sections Panel"
                >
                  <PanelLeftClose className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchFilter}
                onChange={e => setSearchFilter(e.target.value)}
                placeholder="Search sections..."
                className="w-full pl-8 pr-3 py-1 text-xs rounded-md border border-gray-200 bg-white text-gray-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
              />
            </div>
          </div>

          {/* Lane 1 Blocks List */}
          <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
            {filteredBlocks.map((block) => {
              const isActive = activeBlockId === block.id;
              const originalIndex = document.blocks.findIndex(b => b.id === block.id);

              return (
                <div
                  key={block.id}
                  onClick={() => handleSelectBlockFromLane1(block.id)}
                  className={`group relative flex items-start gap-2.5 p-3 transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-blue-50 border-l-3 border-blue-700 text-gray-900 font-medium'
                      : block.enabled
                      ? 'bg-white hover:bg-blue-50/50 text-gray-700'
                      : 'bg-gray-50/50 opacity-50'
                  }`}
                >
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={block.enabled}
                    onChange={e => {
                      e.stopPropagation();
                      handleToggleBlockEnabled(block.id);
                    }}
                    className="mt-0.5 w-3.5 h-3.5 rounded text-blue-700 focus:ring-blue-600 cursor-pointer border-gray-300 accent-blue-700"
                    title="Toggle section visibility in export"
                  />

                  {/* Section Content Summary — inline editable number & title */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-mono text-gray-500 font-bold shrink-0">§</span>
                      <input
                        type="text"
                        value={block.sectionNumber}
                        onClick={e => e.stopPropagation()}
                        onChange={e =>
                          setDocument(prev => ({
                            ...prev,
                            blocks: prev.blocks.map(b => (b.id === block.id ? { ...b, sectionNumber: e.target.value } : b)),
                          }))
                        }
                        className="w-9 shrink-0 px-1 py-0.5 text-[11px] font-mono font-bold text-gray-600 bg-transparent border border-transparent hover:border-gray-200 focus:border-blue-500 focus:bg-white rounded outline-none transition-colors"
                        title="Edit section number"
                      />
                      <input
                        type="text"
                        value={block.title}
                        onClick={e => e.stopPropagation()}
                        onFocus={() => handleSelectBlockFromLane1(block.id)}
                        onChange={e =>
                          setDocument(prev => ({
                            ...prev,
                            blocks: prev.blocks.map(b => (b.id === block.id ? { ...b, title: e.target.value } : b)),
                          }))
                        }
                        className="flex-1 min-w-0 px-1 py-0.5 text-xs font-semibold text-gray-900 bg-transparent border border-transparent hover:border-gray-200 focus:border-blue-500 focus:bg-white rounded outline-none transition-colors truncate"
                        title="Edit section title"
                      />
                    </div>

                    {block.customization.pageBreakBefore && (
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[9px] text-gray-600 font-mono bg-gray-100 px-1 rounded">
                          Page Break
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Hover Reorder & Actions */}
                  <div className="flex flex-col items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        handleMoveBlock(originalIndex, 'up');
                      }}
                      disabled={originalIndex === 0}
                      className="p-1 text-gray-400 hover:text-gray-900 disabled:opacity-20"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        handleMoveBlock(originalIndex, 'down');
                      }}
                      disabled={originalIndex === document.blocks.length - 1}
                      className="p-1 text-gray-400 hover:text-gray-900 disabled:opacity-20"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Lane 1 Footer */}
          <div className="p-3 border-t border-[#E5E7EB] bg-gray-50/50">
            <button
              type="button"
              onClick={() => setIsAddBlockOpen(true)}
              className="w-full py-2 border border-dashed border-gray-300 rounded-md text-xs font-medium text-gray-600 hover:border-gray-400 hover:text-gray-900 transition-colors cursor-pointer"
            >
              + Add Custom Section
            </button>
          </div>

          {/* Left Panel Resizer Handle (Figma Style) */}
          <div
            onMouseDown={handleLeftResizeStart}
            onDoubleClick={() => setLeftPanelWidth(290)}
            className={`absolute right-0 top-0 bottom-0 w-2 -mr-1 cursor-col-resize hover:bg-blue-500/40 transition-all z-30 group flex items-center justify-center ${
              isDraggingLeft ? 'bg-blue-600' : 'bg-transparent'
            }`}
            title="Drag to resize Sections panel (Double click to reset)"
          >
            <div className="w-0.5 h-6 bg-gray-300 group-hover:bg-blue-600 rounded-full transition-colors opacity-0 group-hover:opacity-100" />
          </div>
        </aside>
      )}

      {/* ========================================================================= */}
      {/* LANE 2 (CENTER): Visual Editor & Live PDF Preview (Auto Expanding)        */}
      {/* ========================================================================= */}
      <main className="flex-1 min-w-0 flex flex-col h-full overflow-hidden bg-[#F3F4F6] relative">
        {/* Lane 2 Top Action Toolbar */}
        <div className="h-11 bg-white border-b border-[#E5E7EB] px-3 sm:px-5 flex items-center justify-between shrink-0 z-10 gap-2">
          {/* Active Block Breadcrumb + Left Panel Quick Toggle if collapsed */}
          <div className="flex items-center gap-2 min-w-0">
            {isLeftCollapsed && (
              <button
                type="button"
                onClick={() => setIsLeftCollapsed(false)}
                className="p-1.5 text-gray-500 hover:text-black hover:bg-gray-100 rounded-md transition-colors shrink-0"
                title="Expand Sections Panel"
              >
                <PanelLeftOpen className="w-4 h-4" />
              </button>
            )}

            <div className="flex items-center gap-1.5 text-xs text-gray-500 min-w-0">
              <span className="font-mono font-bold text-gray-400 shrink-0">§ {activeBlock?.sectionNumber}</span>
              <span className="shrink-0">/</span>
              <span className="text-gray-900 font-semibold truncate">
                {activeBlock?.title}
              </span>
            </div>

            {/* View Mode Toggle (Block Editor | Split | Full Document) */}
            <div className="flex items-center bg-[#F3F4F6] rounded-full p-1 border border-[#E5E7EB] shrink-0 ml-2">
              <button
                onClick={() => setViewMode('single_block')}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full transition-all cursor-pointer ${
                  viewMode === 'single_block'
                    ? 'bg-white text-gray-900 shadow-sm font-semibold'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Edit single block"
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Block Editor</span>
              </button>
              <button
                onClick={() => setViewMode('split')}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full transition-all cursor-pointer ${
                  viewMode === 'split'
                    ? 'bg-white text-gray-900 shadow-sm font-semibold'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Split View: Editor & Live Preview"
              >
                <Columns className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Split</span>
              </button>
              <button
                onClick={() => setViewMode('full_pdf')}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full transition-all cursor-pointer ${
                  viewMode === 'full_pdf'
                    ? 'bg-white text-gray-900 shadow-sm font-semibold'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Full Document Preview"
              >
                <Eye className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Full Document</span>
              </button>
            </div>
          </div>

          {/* Zoom Controls, Block Actions & Right Panel Quick Toggle if collapsed */}
          <div className="flex items-center gap-1.5 shrink-0">
            {(viewMode === 'full_pdf' || viewMode === 'split') && (
              <div className="flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-200 text-xs">
                <button
                  onClick={() => setZoomLevel(prev => Math.max(0.6, prev - 0.1))}
                  className="p-0.5 text-gray-500 hover:text-gray-900"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3 h-3" />
                </button>
                <span className="font-mono text-[11px] font-bold text-gray-700 w-8 text-center">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  onClick={() => setZoomLevel(prev => Math.min(1.4, prev + 0.1))}
                  className="p-0.5 text-gray-500 hover:text-gray-900"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3 h-3" />
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => handleDuplicateBlock(activeBlock)}
              className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              title="Duplicate Block"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => handleDeleteBlock(activeBlock.id)}
              disabled={document.blocks.length <= 1}
              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-20 rounded-md transition-colors"
              title="Delete Block"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>

            {isRightCollapsed && (
              <div className="h-4 w-px bg-gray-200 mx-0.5" />
            )}

            {isRightCollapsed && (
              <button
                type="button"
                onClick={() => setIsRightCollapsed(false)}
                className="flex items-center gap-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded text-xs font-semibold transition-colors"
                title="Expand Customizer Panel"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Customizer</span>
              </button>
            )}
          </div>
        </div>

        {/* Lane 2 View Body */}
        <div className="flex-1 overflow-hidden relative">
          {/* Mode 1: Single Block WYSIWYG Editor */}
          {viewMode === 'single_block' && (
            <div className="h-full overflow-y-auto p-6 max-w-4xl mx-auto">
              <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-xs space-y-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded">
                      SECTION § {activeBlock.sectionNumber}
                    </span>
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      {activeBlock.archetype.replace('_', ' ')}
                    </span>
                  </div>

                  <span className="text-[11px] text-gray-400 font-mono">Live Auto-saved</span>
                </div>

                {/* Render Dedicated Block Editor */}
                <BlockEditors
                  block={activeBlock}
                  onChange={handleUpdateBlock}
                  selectedElement={selectedElement}
                  onSelectDocElement={handleSelectDocElement}
                />
              </div>
            </div>
          )}

          {/* Mode 2: Full Document Multi-Page PDF Preview */}
          {viewMode === 'full_pdf' && (
            <div className="h-full overflow-y-auto p-2 sm:p-4 flex justify-center bg-gray-50">
              <DocumentPDFView
                document={document}
                scale={zoomLevel}
                isSingleBlockPreview={false}
                selectedElement={selectedElement}
                onSelectDocElement={handleSelectDocElement}
              />
            </div>
          )}

          {/* Mode 3: Split View (Side-by-Side Editor + Live PDF) */}
          {viewMode === 'split' && (
            <div className="h-full grid grid-cols-1 lg:grid-cols-2 divide-x divide-[#E5E7EB]">
              {/* Left Half: Block Editor */}
              <div className="h-full overflow-y-auto p-4 bg-[#F9FAFB]">
                <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-xs">
                  <BlockEditors
                    block={activeBlock}
                    onChange={handleUpdateBlock}
                    selectedElement={selectedElement}
                    onSelectDocElement={handleSelectDocElement}
                  />
                </div>
              </div>

              {/* Right Half: Live Document Page Render */}
              <div className="h-full overflow-y-auto p-2 bg-gray-50 flex justify-center">
                <DocumentPDFView
                  document={document}
                  activeBlockId={activeBlockId}
                  scale={zoomLevel * 0.9}
                  isSingleBlockPreview={false}
                  hideLayoutControls
                  selectedElement={selectedElement}
                  onSelectDocElement={handleSelectDocElement}
                />
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ========================================================================= */}
      {/* LANE 3 (RIGHT): Customization Options & AI Tools (Figma Style Resizable/Collapsible) */}
      {/* ========================================================================= */}
      {isRightCollapsed ? (
        <aside 
          className="w-11 shrink-0 bg-white border-l border-[#E5E7EB] flex flex-col items-center py-2.5 h-full z-20 transition-all select-none shadow-2xs justify-between group"
          id="lane3-customizer-collapsed"
        >
          {/* Top collapsed controls */}
          <div className="flex flex-col items-center gap-2 w-full px-1">
            <button
              type="button"
              onClick={() => setIsRightCollapsed(false)}
              className="p-2 text-gray-500 hover:text-black hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              title="Expand Customizer Panel (Alt + 2)"
            >
              <PanelRightOpen className="w-4 h-4" />
            </button>

            <div className="w-6 h-px bg-gray-200 my-1" />

            {/* Quick Tab Switcher 1: Customizer */}
            <button
              type="button"
              onClick={() => {
                setRightTab('customize');
                setIsRightCollapsed(false);
              }}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                rightTab === 'customize' ? 'bg-gray-100 text-gray-900 font-bold' : 'text-gray-400 hover:text-gray-800 hover:bg-gray-50'
              }`}
              title="Open Customizer"
            >
              <Sliders className="w-4 h-4" />
            </button>

            {/* Quick Tab Switcher 2: Doc Settings */}
            <button
              type="button"
              onClick={() => {
                setRightTab('doc_settings');
                setIsRightCollapsed(false);
              }}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                rightTab === 'doc_settings' ? 'bg-gray-100 text-gray-900 font-bold' : 'text-gray-400 hover:text-gray-800 hover:bg-gray-50'
              }`}
              title="Open Document Settings"
            >
              <Palette className="w-4 h-4" />
            </button>
          </div>

          {/* Middle Vertical Label */}
          <button
            type="button"
            onClick={() => setIsRightCollapsed(false)}
            className="flex items-center justify-center [writing-mode:vertical-rl] text-[10px] font-bold tracking-widest text-gray-400 hover:text-gray-900 transition-colors py-4 uppercase cursor-pointer select-none"
            title="Click to expand Customizer panel"
          >
            Customizer
          </button>

          {/* Bottom Expand Tab Icon */}
          <button
            type="button"
            onClick={() => setIsRightCollapsed(false)}
            className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
            title="Expand Customizer Panel"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </aside>
      ) : (
        <aside 
          style={{ width: `${rightPanelWidth}px` }}
          className="shrink-0 bg-white border-l border-[#E5E7EB] flex flex-col h-full z-20 relative select-text"
          id="lane3-customizer-expanded"
        >
          {/* Right Panel Resizer Handle (Figma Style) */}
          <div
            onMouseDown={handleRightResizeStart}
            onDoubleClick={() => setRightPanelWidth(350)}
            className={`absolute left-0 top-0 bottom-0 w-2 -ml-1 cursor-col-resize hover:bg-blue-500/40 transition-all z-30 group flex items-center justify-center ${
              isDraggingRight ? 'bg-blue-600' : 'bg-transparent'
            }`}
            title="Drag to resize Customizer panel (Double click to reset)"
          >
            <div className="w-0.5 h-6 bg-gray-300 group-hover:bg-blue-600 rounded-full transition-colors opacity-0 group-hover:opacity-100" />
          </div>

          {/* Lane 3 Tab Switcher + Collapse Header */}
          <div className="p-2 border-b border-[#E5E7EB] flex items-center gap-1 bg-gray-50/50">
            <div className="grid grid-cols-2 gap-1 flex-1">
              <button
                onClick={() => setRightTab('customize')}
                className={`py-1.5 text-xs font-semibold rounded-md transition-all ${
                  rightTab === 'customize'
                    ? 'bg-white text-gray-900 shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Customizer
              </button>
              <button
                onClick={() => setRightTab('doc_settings')}
                className={`py-1.5 text-xs font-semibold rounded-md transition-all ${
                  rightTab === 'doc_settings'
                    ? 'bg-white text-gray-900 shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Doc Settings
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsRightCollapsed(true)}
              className="p-1 text-gray-400 hover:text-gray-900 hover:bg-gray-200/70 rounded transition-colors shrink-0"
              title="Collapse Customizer Panel"
            >
              <PanelRightClose className="w-4 h-4" />
            </button>
          </div>

          {/* Lane 3 Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs">
            {/* TAB 1: BLOCK CUSTOMIZATION */}
            {rightTab === 'customize' && (
              <div className="space-y-5">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wider">
                      Customization
                    </h3>
                    <p className="text-gray-500 text-[11px]">§ {activeBlock.sectionNumber} parameters</p>
                  </div>
                  <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded font-medium">
                    Active Block
                  </span>
                </div>

                {/* Exact Section & Content Element Customizer (from user mockup) */}
                <SectionCustomizerPanel
                  block={activeBlock}
                  onChange={handleUpdateBlock}
                  selectedElement={selectedElement}
                  onSelectElement={setSelectedElement}
                  onUpdateSelectedElementText={handleUpdateSelectedElementText}
                  onDeleteSelectedElement={handleDeleteSelectedElement}
                />

                {/* Section Numbering & Subtitle */}
                <div className="space-y-3 p-3.5 bg-gray-50 rounded-lg border border-gray-200">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">
                      Section Number
                    </label>
                    <input
                      type="text"
                      value={activeBlock.sectionNumber}
                      onChange={e =>
                        handleUpdateBlock({
                          ...activeBlock,
                          sectionNumber: e.target.value,
                        })
                      }
                      className="w-full px-2.5 py-1.5 text-xs rounded border border-gray-200 font-mono font-bold bg-white text-gray-900 focus:border-black focus:ring-1 focus:ring-black outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">
                      Section Subtitle / Description
                    </label>
                    <input
                      type="text"
                      value={activeBlock.subtitle || ''}
                      onChange={e =>
                        handleUpdateBlock({
                          ...activeBlock,
                          subtitle: e.target.value,
                        })
                      }
                      className="w-full px-2.5 py-1.5 text-xs rounded border border-gray-200 bg-white text-gray-900 focus:border-black focus:ring-1 focus:ring-black outline-none"
                      placeholder="Optional sub-heading"
                    />
                  </div>
                </div>

                {/* Theme Accent Colors */}
                <div className="space-y-3 p-3 bg-white rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <label className="block text-[11px] font-bold text-gray-700 uppercase flex items-center gap-1.5">
                      <Palette className="w-3.5 h-3.5 text-gray-500" />
                      Accent Palette
                    </label>
                    <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-gray-100 text-gray-700">
                      {activeBlock.customization.accentColor || document.themeColor || '#1e40af'}
                    </span>
                  </div>

                  {/* Preset Swatches */}
                  <div className="grid grid-cols-6 gap-1.5">
                    {ACCENT_PALETTE_PRESETS.map(color => {
                      const isSelected = (activeBlock.customization.accentColor || document.themeColor) === color.hex;
                      return (
                        <button
                          key={color.hex}
                          type="button"
                          onClick={() => handleApplyAccentColor(color.hex, false)}
                          className="h-7 rounded-md border transition-all flex items-center justify-center relative hover:scale-105"
                          style={{
                            backgroundColor: color.hex,
                            borderColor: isSelected ? '#000000' : 'rgba(0,0,0,0.1)',
                            boxShadow: isSelected ? '0 0 0 2px white, 0 0 0 3px #000' : 'none'
                          }}
                          title={color.label}
                        >
                          {isSelected && (
                            <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom Hex Color Picker */}
                  <div className="flex items-center gap-2 pt-1 border-t border-gray-100">
                    <div className="relative flex items-center">
                      <input
                        type="color"
                        value={activeBlock.customization.accentColor || document.themeColor || '#1e40af'}
                        onChange={e => handleApplyAccentColor(e.target.value, false)}
                        className="w-7 h-7 rounded border border-gray-200 cursor-pointer p-0 overflow-hidden"
                        title="Pick custom accent color"
                      />
                    </div>
                    <input
                      type="text"
                      value={activeBlock.customization.accentColor || document.themeColor || '#1e40af'}
                      onChange={e => {
                        const val = e.target.value;
                        if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
                          handleApplyAccentColor(val, false);
                        }
                      }}
                      placeholder="#1e40af"
                      className="flex-1 px-2 py-1 text-xs font-mono rounded border border-gray-200 uppercase text-gray-800 focus:border-black focus:ring-1 focus:ring-black outline-none"
                    />
                  </div>

                  {/* Scope Actions: Current Section vs Apply to All */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleApplyAccentColor(activeBlock.customization.accentColor || document.themeColor || '#1e40af', false)}
                      className="py-1.5 px-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-[11px] font-semibold rounded border border-gray-200 transition-colors flex items-center justify-center gap-1"
                    >
                      <span>This Section</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyAccentColor(activeBlock.customization.accentColor || document.themeColor || '#1e40af', true)}
                      className="py-1.5 px-2 bg-black hover:bg-gray-800 text-white text-[11px] font-semibold rounded transition-colors flex items-center justify-center gap-1 shadow-xs"
                      title="Apply this accent palette to all sections and document theme"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>Apply to All</span>
                    </button>
                  </div>
                </div>

                {/* PDF Pagination & Formatting Toggles */}
                <div className="space-y-2.5 p-3.5 bg-gray-50 rounded-lg border border-gray-200">
                  <h4 className="font-bold text-gray-600 uppercase tracking-wider text-[10px]">
                    PDF Page Layout
                  </h4>

                  <label className="flex items-center gap-2 cursor-pointer text-gray-700">
                    <input
                      type="checkbox"
                      checked={!!activeBlock.customization.pageBreakBefore}
                      onChange={e =>
                        handleUpdateBlock({
                          ...activeBlock,
                          customization: {
                            ...activeBlock.customization,
                            pageBreakBefore: e.target.checked,
                          },
                        })
                      }
                      className="rounded text-black focus:ring-black accent-black"
                    />
                    <span>Force Page Break Before Section</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-gray-700">
                    <input
                      type="checkbox"
                      checked={activeBlock.customization.showSectionNumber !== false}
                      onChange={e =>
                        handleUpdateBlock({
                          ...activeBlock,
                          customization: {
                            ...activeBlock.customization,
                            showSectionNumber: e.target.checked,
                          },
                        })
                      }
                      className="rounded text-black focus:ring-black accent-black"
                    />
                    <span>Show Section Number in Heading</span>
                  </label>
                </div>

                {/* Callout Note Box Toggle */}
                <div className="space-y-2 p-3.5 bg-gray-50 rounded-lg border border-gray-200">
                  <label className="flex items-center gap-2 font-bold text-gray-900 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!activeBlock.customization.showNote}
                      onChange={e =>
                        handleUpdateBlock({
                          ...activeBlock,
                          customization: {
                            ...activeBlock.customization,
                            showNote: e.target.checked,
                          },
                        })
                      }
                      className="rounded text-black focus:ring-black accent-black"
                    />
                    <span>Technician Note / Warning Box</span>
                  </label>

                  {activeBlock.customization.showNote && (
                    <textarea
                      rows={3}
                      value={activeBlock.customization.noteText || ''}
                      onChange={e =>
                        handleUpdateBlock({
                          ...activeBlock,
                          customization: {
                            ...activeBlock.customization,
                            noteText: e.target.value,
                          },
                        })
                      }
                      placeholder="Enter official testing note or technician warning..."
                      className="w-full p-2 text-xs rounded border border-gray-300 bg-white text-gray-900 focus:border-black focus:ring-1 focus:ring-black outline-none"
                    />
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: DOCUMENT SETTINGS */}
            {rightTab === 'doc_settings' && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wider">
                    Document Settings
                  </h3>
                  <p className="text-gray-500 text-[11px]">Global headers, confidentiality, and theme</p>
                </div>

                <div className="space-y-3 p-3.5 bg-gray-50 rounded-lg border border-gray-200">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">
                      Product Full Model Name
                    </label>
                    <input
                      type="text"
                      value={document.productName}
                      onChange={e => setDocument(prev => ({ ...prev, productName: e.target.value }))}
                      className="w-full px-2.5 py-1.5 text-xs rounded border border-gray-200 bg-white font-bold text-gray-900 focus:border-black focus:ring-1 focus:ring-black outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">
                      Model SKU Code
                    </label>
                    <input
                      type="text"
                      value={document.modelCode}
                      onChange={e => setDocument(prev => ({ ...prev, modelCode: e.target.value }))}
                      className="w-full px-2.5 py-1.5 text-xs rounded border border-gray-200 bg-white font-mono text-gray-900 focus:border-black focus:ring-1 focus:ring-black outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">
                      Confidentiality Watermark
                    </label>
                    <input
                      type="text"
                      value={document.watermark}
                      onChange={e => setDocument(prev => ({ ...prev, watermark: e.target.value }))}
                      placeholder="e.g. OFFICIAL SERVICE PLAN"
                      className="w-full px-2.5 py-1.5 text-xs rounded border border-gray-200 bg-white uppercase font-bold text-gray-700 focus:border-black focus:ring-1 focus:ring-black outline-none font-mono"
                    />
                  </div>

                  {/* Global Theme & Accent Palette */}
                  <div className="pt-2 border-t border-gray-200 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-[11px] font-bold text-gray-700 uppercase flex items-center gap-1.5">
                        <Palette className="w-3.5 h-3.5 text-gray-500" />
                        Global Brand Accent Palette
                      </label>
                      <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-gray-200 text-gray-800">
                        {document.themeColor || '#1e40af'}
                      </span>
                    </div>

                    <div className="grid grid-cols-6 gap-1.5">
                      {ACCENT_PALETTE_PRESETS.map(color => {
                        const isSelected = document.themeColor === color.hex;
                        return (
                          <button
                            key={color.hex}
                            type="button"
                            onClick={() => handleApplyAccentColor(color.hex, true)}
                            className="h-7 rounded-md border transition-all flex items-center justify-center relative hover:scale-105"
                            style={{
                              backgroundColor: color.hex,
                              borderColor: isSelected ? '#000000' : 'rgba(0,0,0,0.1)',
                              boxShadow: isSelected ? '0 0 0 2px white, 0 0 0 3px #000' : 'none'
                            }}
                            title={`Set ${color.label} for entire document`}
                          >
                            {isSelected && (
                              <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="color"
                        value={document.themeColor || '#1e40af'}
                        onChange={e => handleApplyAccentColor(e.target.value, true)}
                        className="w-7 h-7 rounded border border-gray-200 cursor-pointer p-0 overflow-hidden"
                        title="Pick custom global accent"
                      />
                      <input
                        type="text"
                        value={document.themeColor || '#1e40af'}
                        onChange={e => {
                          const val = e.target.value;
                          if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
                            handleApplyAccentColor(val, true);
                          }
                        }}
                        placeholder="#1e40af"
                        className="flex-1 px-2 py-1 text-xs font-mono rounded border border-gray-200 uppercase text-gray-800 focus:border-black focus:ring-1 focus:ring-black outline-none"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => handleApplyAccentColor(document.themeColor || '#1e40af', true)}
                      className="w-full py-2 bg-blue-700 hover:bg-blue-800 text-white rounded font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>Sync Theme Across All {document.blocks.length} Sections</span>
                    </button>
                  </div>

                  <label className="flex items-center gap-2 pt-2 border-t border-gray-200 cursor-pointer font-semibold text-gray-700">
                    <input
                      type="checkbox"
                      checked={document.showHeaderFooter}
                      onChange={e => setDocument(prev => ({ ...prev, showHeaderFooter: e.target.checked }))}
                      className="rounded text-black focus:ring-black accent-black"
                    />
                    <span>Include Header Branding in PDF</span>
                  </label>
                </div>
              </div>
            )}
          </div>
        </aside>
      )}

      {/* Modal to Add Blocks */}
      <AddBlockModal
        isOpen={isAddBlockOpen}
        onClose={() => setIsAddBlockOpen(false)}
        onAddBlock={handleAddBlock}
        nextSectionNumber={`${document.blocks.length + 1}`}
      />
    </div>
  );
};
