import { ServicePlanDocument, ColourVariant } from '../types';

// Palette presets cycled when appending new variants via the count selector.
const VARIANT_PALETTE = [
  { name: 'Active Black', colorHex: '#0f172a', secondaryHex: '#38bdf8' },
  { name: 'Pure White', colorHex: '#f8fafc', secondaryHex: '#94a3b8' },
  { name: 'Deep Navy', colorHex: '#1e3a8a', secondaryHex: '#60a5fa' },
  { name: 'Sage Green', colorHex: '#365314', secondaryHex: '#a3e635' },
  { name: 'Sunset Amber', colorHex: '#b45309', secondaryHex: '#fbbf24' },
  { name: 'Vivid Rose', colorHex: '#9f1239', secondaryHex: '#fb7185' },
  { name: 'Slate Grey', colorHex: '#334155', secondaryHex: '#cbd5e1' },
  { name: 'Ocean Teal', colorHex: '#0f766e', secondaryHex: '#5eead4' },
  { name: 'Royal Purple', colorHex: '#5b21b6', secondaryHex: '#c4b5fd' },
  { name: 'Crimson Red', colorHex: '#991b1b', secondaryHex: '#fca5a5' },
];

export const MAX_VARIANTS = 10;

const findVariantsBlock = (doc: ServicePlanDocument) =>
  doc.blocks.find(b => b.type === 'colour_variants');

const findReturnCodesBlock = (doc: ServicePlanDocument) =>
  doc.blocks.find(b => b.type === 'return_codes');

// Authoritative variants[] — the colour_variants block content.
export function getVariants(doc: ServicePlanDocument): ColourVariant[] {
  return findVariantsBlock(doc)?.content.colourVariants || [];
}

export interface ReturnRow {
  id: string;
  productDesc: string;
  ean: string;
  asin: string;
  fsn: string;
}

// Return-codes table rows derived from the authoritative variants.
// Falls back to the legacy independent returnCodes[] when no variants exist.
export function getReturnRows(doc: ServicePlanDocument): ReturnRow[] {
  const variants = getVariants(doc);
  if (variants.length > 0) {
    const legacy = findReturnCodesBlock(doc)?.content.returnCodes || [];
    return variants.map((v, idx) => {
      // Seed missing EAN/ASIN/FSN from a legacy row matching by name or position.
      const legacyMatch = legacy.find(rc => rc.productDesc?.includes(v.name)) || legacy[idx];
      return {
        id: v.id,
        productDesc: `${doc.productName} – ${v.name}`,
        ean: v.eanNumber ?? legacyMatch?.ean ?? '',
        asin: v.asin ?? legacyMatch?.asin ?? '',
        fsn: v.fsn ?? legacyMatch?.fsn ?? '',
      };
    });
  }
  return findReturnCodesBlock(doc)?.content.returnCodes || [];
}

// Returns a new document with the variant list resized to `count` (1–10).
// Increasing appends palette-preset variants; decreasing slices from the end.
// Callers must confirm with the user before decreasing.
export function setVariantCount(doc: ServicePlanDocument, count: number): ServicePlanDocument {
  const clamped = Math.max(1, Math.min(MAX_VARIANTS, Math.floor(count)));
  const current = getVariants(doc);
  let next: ColourVariant[];
  if (clamped === current.length) return doc;
  if (clamped > current.length) {
    const additions: ColourVariant[] = [];
    for (let i = current.length; i < clamped; i++) {
      const preset = VARIANT_PALETTE[i % VARIANT_PALETTE.length];
      additions.push({
        id: `cv-${Date.now()}-${i}`,
        name: preset.name,
        colorHex: preset.colorHex,
        secondaryHex: preset.secondaryHex,
        eanNumber: '',
        isSmartVariant: false,
      });
    }
    next = [...current, ...additions];
  } else {
    next = current.slice(0, clamped);
  }
  return updateVariants(doc, next);
}

// Returns a new document with the variants array replaced in the colour_variants block.
export function updateVariants(doc: ServicePlanDocument, variants: ColourVariant[]): ServicePlanDocument {
  return {
    ...doc,
    blocks: doc.blocks.map(b =>
      b.type === 'colour_variants'
        ? { ...b, content: { ...b.content, colourVariants: variants } }
        : b
    ),
  };
}

// Returns a new document with a single variant field updated by id.
export function updateVariantField(
  doc: ServicePlanDocument,
  variantId: string,
  patch: Partial<ColourVariant>
): ServicePlanDocument {
  const next = getVariants(doc).map(v => (v.id === variantId ? { ...v, ...patch } : v));
  return updateVariants(doc, next);
}
