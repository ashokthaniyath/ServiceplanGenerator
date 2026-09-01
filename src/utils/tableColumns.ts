import { ServicePlanBlock } from '../types';

// Column title/visibility helpers for typed tables. Titles and hidden columns
// live on block.content so every surface (editor, preview, DOCX) reads the
// same authoritative structure.

export function colTitle(block: ServicePlanBlock, key: string, fallback: string): string {
  return block.content.columnTitles?.[key] ?? fallback;
}

export function isColHidden(block: ServicePlanBlock, key: string): boolean {
  return (block.content.hiddenColumns || []).includes(key);
}

export function renameColumnContent(
  block: ServicePlanBlock,
  key: string,
  title: string
): ServicePlanBlock['content'] {
  return {
    ...block.content,
    columnTitles: { ...(block.content.columnTitles || {}), [key]: title },
  };
}

export function hideColumnContent(
  block: ServicePlanBlock,
  key: string
): ServicePlanBlock['content'] {
  const hidden = block.content.hiddenColumns || [];
  if (hidden.includes(key)) return block.content;
  return {
    ...block.content,
    hiddenColumns: [...hidden, key],
  };
}
