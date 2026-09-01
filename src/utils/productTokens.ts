import { ServicePlanDocument } from '../types';

// Blank means null/undefined/empty/whitespace-only — never overrides real values.
const orDefault = (value: string | undefined | null): string =>
  value && value.trim() ? value : 'default';

const firstColourVariantName = (doc: ServicePlanDocument): string | undefined =>
  doc.blocks.find(b => b.type === 'colour_variants')?.content.colourVariants?.[0]?.name;

// Template tokens like <$productname$> resolved against the live document.
const TOKEN_PATTERNS: [RegExp, (doc: ServicePlanDocument) => string][] = [
  [/<\$\s*productname\s*\$>/gi, doc => orDefault(doc.productName)],
  [/<\$\s*productcolor\s*\$>/gi, doc => orDefault(firstColourVariantName(doc))],
  [/<\$\s*modelcode\s*\$>/gi, doc => doc.modelCode],
  [/<\$\s*brand\s*\$>/gi, doc => doc.brand],
];

// Preset literals baked into template content — longest first so the
// "boAt "-prefixed forms never produce a double prefix.
const KNOWN_PRODUCT_LITERALS = [
  'boAt Airdopes Prime 800D',
  'Airdopes Prime 800D',
  'boAt Airdopes 141 (Gen 3)',
  'Airdopes 141 (Gen 3)',
  'boAt Airdopes 141',
  'Airdopes 141',
  'Rockerz 330 Pro Max',
  'Nirvana 751 ANC',
].sort((a, b) => b.length - a.length);

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const LITERALS_PATTERN = new RegExp(KNOWN_PRODUCT_LITERALS.map(escapeRegExp).join('|'), 'g');

export function resolveTokens(text: string | undefined | null, doc: ServicePlanDocument): string {
  if (!text) return '';
  let out = text;
  for (const [pattern, getValue] of TOKEN_PATTERNS) {
    out = out.replace(pattern, getValue(doc) || '');
  }
  // Rebind preset literals so a manually renamed product reflects everywhere.
  if (doc.productName && doc.productName.trim()) {
    out = out.replace(LITERALS_PATTERN, doc.productName);
  }
  return out;
}

// Keys whose string values are identifiers/colors/URLs and must never be rewritten.
const SKIP_KEYS = new Set(['id', 'type', 'archetype', 'imageUrl', 'colorHex', 'secondaryHex', 'accentColor', 'themeColor', 'hex', 'link', 'ean', 'asin', 'fsn']);

function resolveDeep<T>(value: T, doc: ServicePlanDocument): T {
  if (typeof value === 'string') return resolveTokens(value, doc) as unknown as T;
  if (Array.isArray(value)) return value.map(v => resolveDeep(v, doc)) as unknown as T;
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = SKIP_KEYS.has(k) ? v : resolveDeep(v, doc);
    }
    return out as unknown as T;
  }
  return value;
}

// Returns a copy of the document with all tokens/preset literals in block
// content and titles resolved to the manually entered product name.
export function resolveDocumentTokens(doc: ServicePlanDocument): ServicePlanDocument {
  return {
    ...doc,
    watermark: resolveTokens(doc.watermark, doc),
    blocks: doc.blocks.map(b => resolveBlockTokens(b, doc)),
  };
}

// Resolves a single block for display in editors.
export function resolveBlockTokens<T extends { title: string; subtitle?: string; content: unknown }>(block: T, doc: ServicePlanDocument): T {
  return {
    ...block,
    title: resolveTokens(block.title, doc),
    subtitle: resolveTokens(block.subtitle, doc),
    content: resolveDeep(block.content, doc),
  };
}

// Inverse: canonicalizes concrete product-name text back to the token so
// future renames keep propagating after the user edits resolved text.
export function unresolveTokens(text: string | undefined | null, doc: ServicePlanDocument): string {
  if (!text) return '';
  // Short names would over-match ordinary words; only canonicalize real names.
  if (!doc.productName || doc.productName.trim().length < 4) return text;
  return text.split(doc.productName).join('<$productname$>');
}

function unresolveDeep<T>(value: T, doc: ServicePlanDocument): T {
  if (typeof value === 'string') return unresolveTokens(value, doc) as unknown as T;
  if (Array.isArray(value)) return value.map(v => unresolveDeep(v, doc)) as unknown as T;
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = SKIP_KEYS.has(k) ? v : unresolveDeep(v, doc);
    }
    return out as unknown as T;
  }
  return value;
}

export function unresolveBlockTokens<T extends { title: string; subtitle?: string; content: unknown }>(block: T, doc: ServicePlanDocument): T {
  return {
    ...block,
    title: unresolveTokens(block.title, doc),
    subtitle: unresolveTokens(block.subtitle, doc),
    content: unresolveDeep(block.content, doc),
  };
}
