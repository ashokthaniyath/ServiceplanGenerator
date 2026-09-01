export type AudioCategory = 'TWS' | 'Neckband' | 'Headphones' | 'Wireless Speaker' | 'Smart Audio';

export type DeviceType = 'SDK' | 'Non-SDK';

export type BlockArchetype = 'text_heavy' | 'table_heavy' | 'image_heavy' | 'matrix_step' | 'troubleshooting' | 'app_showcase';

export type BlockType = 
  | 'header_overview'
  | 'technical_definitions'
  | 'specifications_table'
  | 'packaging_contents'
  | 'colour_variants'
  | 'product_functionalities'
  | 'led_indications'
  | 'charging_guidelines'
  | 'weight_matrix'
  | 'hearables_app'
  | 'diagnostics_troubleshooting'
  | 'return_codes'
  | 'annexure'
  | 'custom_section';

export interface KeyValueItem {
  id: string;
  key: string;
  value: string;
  highlight?: boolean;
}

export interface TableRowItem {
  id: string;
  [key: string]: string | boolean | undefined;
}

export interface ColourVariant {
  id: string;
  name: string;
  colorHex: string;
  secondaryHex?: string;
  eanNumber?: string;
  asin?: string;
  fsn?: string;
  imageDesc?: string;
  imageUrl?: string;
  isSmartVariant?: boolean;
}

export interface AnnexureItem {
  id: string;
  sopTitle: string;
  protocols: string;
  resourceLink?: string;
  additionalLink?: string;
  category?: 'QA Testing' | 'Tutorial Video' | 'Service Flowchart' | 'Warranty Portal' | 'General' | string;
}

export interface TroubleshootingItem {
  id: string;
  issue: string;
  instructions: string[];
  finalResolution: string;
  appDiagnosticsNote?: string;
  category?: 'Bluetooth' | 'Charging' | 'Sound Quality' | 'Controls' | 'App' | 'General' | string;
}

export interface FunctionalityItem {
  id: string;
  functionName: string;
  process: string;
  steps?: string[];
  note?: string;
}

export interface LedIndicationItem {
  id: string;
  scenario: string;
  chargingState?: string;
  normalState?: string;
  result?: string;
}

export interface AppTabShowcase {
  id: string;
  tabName: string;
  features: string[];
  description: string;
  accentColor: string;
  mockupType: 'sound' | 'touch' | 'system';
  imageUrl?: string;
}

export interface WeightMatrixRow {
  id: string;
  product: string;
  length: string;
  breadth: string;
  height: string;
  earbudsWeight: string;
  caseWeight: string;
}

export interface ContentElement {
  id: string;
  type: 'title' | 'heading' | 'paragraph' | 'list' | 'note' | 'image' | 'table';
  text: string;
  isBold?: boolean;
  textCase?: 'uppercase' | 'capitalize' | 'lowercase' | 'normal';
  isBullet?: boolean;
  listType?: 'bullet' | 'numbered';
  noteType?: 'warning' | 'danger' | 'info' | 'success';
  listItems?: string[];
  imageUrl?: string;
  imageCaption?: string;
  tableColumns?: string[];
  tableRows?: { id: string; [colKey: string]: string }[];
}

export interface SelectedDocElement {
  blockId: string;
  fieldId: string; // e.g. 'title', 'subtitle', 'objective', 'spec-row-key-1', 'content-el-xxx', 'header-brand', etc.
  elementType: 'title' | 'subtitle' | 'paragraph' | 'heading' | 'list' | 'note' | 'image' | 'table' | 'table-cell' | 'definition' | 'brand' | 'product-meta';
  label: string;
  text: string;
  isBold?: boolean;
  textCase?: 'uppercase' | 'capitalize' | 'lowercase' | 'normal';
  isBullet?: boolean;
  listType?: 'bullet' | 'numbered';
  noteType?: 'warning' | 'danger' | 'info' | 'success';
  imageUrl?: string;
  imageCaption?: string;
  tableColumns?: string[];
  tableRows?: { id: string; [colKey: string]: string }[];
  // Specific data pointers if needed
  subKey?: string;
  itemId?: string;
}

export interface BlockCustomization {
  accentColor?: string;
  fontSize?: 'sm' | 'base' | 'lg';
  layoutStyle?: 'table' | 'cards' | 'compact' | 'split' | 'grid';
  showNote?: boolean;
  noteText?: string;
  noteTitle?: string;
  tableBorder?: boolean;
  zebraStriping?: boolean;
  showSectionNumber?: boolean;
  columnWidths?: Record<string, string>;
  imageDisplayMode?: 'grid' | 'carousel' | 'cards';
  pageBreakBefore?: boolean;
  isLinkedToTitle?: boolean;
  sectionName?: string;
}

export interface ServicePlanBlock {
  id: string;
  sectionNumber: string;
  title: string;
  subtitle?: string;
  type: BlockType;
  archetype: BlockArchetype;
  enabled: boolean;
  customization: BlockCustomization;
  content: {
    contentElements?: ContentElement[];
    objective?: string;
    documentOwner?: string;
    featureHighlights?: string[];
    definitions?: { term: string; definition: string; id: string }[];
    specifications?: KeyValueItem[];
    packagingList?: string[];
    colourVariants?: ColourVariant[];
    functionalities?: FunctionalityItem[];
    caseLedIndications?: LedIndicationItem[];
    earbudsLedIndications?: LedIndicationItem[];
    factoryResetLed?: LedIndicationItem[];
    chargingGuidelines?: { statement: string; information: string; id: string }[];
    chargingNotes?: string[];
    weightMatrix?: {
      product: string;
      length: string;
      breadth: string;
      height: string;
      earbudsWeight: string;
      caseWeight: string;
    };
    weightMatrixRows?: WeightMatrixRow[];
    hearablesAppTabs?: AppTabShowcase[];
    hearablesGuideSteps?: { functionName: string; process: string; id: string }[];
    serviceChannels?: { channelName: string; details: string; id: string }[];
    troubleshootingItems?: TroubleshootingItem[];
    returnCodes?: { productDesc: string; ean: string; asin: string; fsn: string; id: string }[];
    annexureItems?: AnnexureItem[];
    annexureTestingSop?: string;
    annexureTutorialLinks?: string;
    customHtml?: string;
    customTableColumns?: string[];
    customTableRows?: TableRowItem[];
    // Column customization for typed tables — keyed by semantic column key
    columnTitles?: Record<string, string>;
    hiddenColumns?: string[];
    // User-added columns for typed tables; cell values keyed by row id then column id
    extraColumns?: { id: string; title: string }[];
    extraCellValues?: Record<string, Record<string, string>>;
  };
}

export interface ServicePlanDocument {
  id: string;
  productName: string;
  category: AudioCategory;
  deviceType: DeviceType;
  brand: string;
  modelCode: string;
  docOwner: string;
  version: string;
  lastUpdated: string;
  themeColor: string;
  watermark: string;
  showHeaderFooter: boolean;
  fontSize: 'compact' | 'normal' | 'spacious';
  blocks: ServicePlanBlock[];
}

export interface GrammarIssue {
  id: string;
  blockId: string;
  blockTitle: string;
  field: string;
  originalText: string;
  suggestedText: string;
  explanation: string;
  type: 'spelling' | 'grammar' | 'clarity' | 'technical_tone' | 'formatting';
  applied?: boolean;
}
