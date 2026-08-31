import {
  Document,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  HeadingLevel,
  BorderStyle,
  Packer,
  PageOrientation,
  TableLayoutType,
  ImageRun,
} from 'docx';
import { saveAs } from 'file-saver';
import { ServicePlanDocument, ServicePlanBlock, AnnexureItem } from '../types';
import { validateDocumentIsolation } from '../data/defaultPlans';

// Total usable table width inside A4 with 1" margins ≈ 9026 dxa. Use 9000 for safety.
const TABLE_TOTAL_WIDTH_DXA = 9000;

const BORDER_STYLE = {
  style: BorderStyle.SINGLE,
  size: 4, // 0.5pt (size is in eighths of a point) — visible in Word & Google Docs
  color: '000000',
};

const TABLE_BORDERS = {
  top: BORDER_STYLE,
  bottom: BORDER_STYLE,
  left: BORDER_STYLE,
  right: BORDER_STYLE,
  insideHorizontal: BORDER_STYLE,
  insideVertical: BORDER_STYLE,
};

// Per-cell borders — Google Docs ignores table-level inside borders, so every cell
// must declare its own full border set for the grid to render everywhere.
const CELL_BORDERS = {
  top: BORDER_STYLE,
  bottom: BORDER_STYLE,
  left: BORDER_STYLE,
  right: BORDER_STYLE,
};

/** Convert a percentage (0-100) into absolute DXA width of the printable area. */
function pctToDxa(pct: number): number {
  return Math.floor(TABLE_TOTAL_WIDTH_DXA * (pct / 100));
}

/**
 * Build a table with an explicit column grid (tblGrid) and FIXED layout.
 * Google Docs requires tblGrid + fixed layout to render column widths correctly —
 * without them, columns collapse to minimal width and text wraps one character per line.
 */
function buildTable(colPercents: number[], rows: TableRow[]): Table {
  return new Table({
    width: { size: TABLE_TOTAL_WIDTH_DXA, type: WidthType.DXA },
    columnWidths: colPercents.map(pctToDxa),
    layout: TableLayoutType.FIXED,
    borders: TABLE_BORDERS,
    rows,
  });
}

/** Split text on newlines into separate paragraphs so multi-line cell content renders cleanly. */
function cellParagraphs(text: string, opts: { bold?: boolean; size?: number } = {}): Paragraph[] {
  const lines = (text || '-').split('\n');
  return lines.map(
    (line, idx) =>
      new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: idx < lines.length - 1 ? { after: 40 } : undefined,
        children: [
          new TextRun({
            text: line === '' ? ' ' : line,
            bold: opts.bold ?? false,
            color: '000000',
            size: opts.size ?? 19, // 9.5pt
            font: 'Calibri',
          }),
        ],
      })
  );
}

function createHeaderCell(text: string, widthPercent?: number): TableCell {
  return new TableCell({
    width: widthPercent ? { size: pctToDxa(widthPercent), type: WidthType.DXA } : undefined,
    borders: CELL_BORDERS,
    shading: {
      fill: 'FFFFFF',
    },
    margins: {
      top: 100,
      bottom: 100,
      left: 140,
      right: 140,
    },
    children: [
      new Paragraph({
        alignment: AlignmentType.LEFT,
        children: [
          new TextRun({
            text,
            bold: true,
            color: '000000',
            size: 20, // 10pt
            font: 'Calibri',
          }),
        ],
      }),
    ],
  });
}

function createBodyCell(text: string, isBold = false, widthPercent?: number, shadingFill?: string): TableCell {
  return new TableCell({
    width: widthPercent ? { size: pctToDxa(widthPercent), type: WidthType.DXA } : undefined,
    borders: CELL_BORDERS,
    shading: shadingFill
      ? {
          fill: shadingFill,
        }
      : undefined,
    margins: {
      top: 90,
      bottom: 90,
      left: 140,
      right: 140,
    },
    children: cellParagraphs(text, { bold: isBold }),
  });
}

// Decode a base64 data URL into raw bytes for embedding in the DOCX.
// Render ANY image source (base64 data URL of png/jpg/gif/bmp/webp/svg, or a same-origin URL)
// into PNG bytes via a canvas. This guarantees a valid, Word-embeddable image regardless of the
// original upload format, and also yields the natural pixel dimensions for aspect-ratio scaling.
function imageToPngBytes(src: string): Promise<{ bytes: Uint8Array; width: number; height: number } | null> {
  return new Promise(resolve => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const w = img.naturalWidth || 480;
        const h = img.naturalHeight || 300;
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(null);
        ctx.drawImage(img, 0, 0, w, h);
        const pngUrl = canvas.toDataURL('image/png');
        const b64 = pngUrl.split(',')[1] || '';
        const binary = atob(b64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        resolve({ bytes, width: w, height: h });
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

// Build a centered image paragraph (with optional caption) from any image source.
async function buildImageParagraphs(src: string, caption?: string, maxWidth = 480): Promise<Paragraph[]> {
  const decoded = await imageToPngBytes(src);
  if (!decoded) return [];
  const { bytes, width: natW, height: natH } = decoded;
  const MAX_WIDTH = maxWidth; // px
  const scale = natW > MAX_WIDTH ? MAX_WIDTH / natW : 1;
  const width = Math.round(natW * scale);
  const height = Math.round(natH * scale);

  const paras: Paragraph[] = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 120, after: caption ? 40 : 140 },
      children: [
        new ImageRun({
          type: 'png',
          data: bytes,
          transformation: { width, height },
        }),
      ],
    }),
  ];

  if (caption) {
    paras.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 140 },
        children: [
          new TextRun({ text: caption, italics: true, size: 18, color: '64748B', font: 'Calibri' }),
        ],
      })
    );
  }

  return paras;
}

async function appendCustomContentElements(children: (Paragraph | Table)[], block: ServicePlanBlock) {
  if (!block?.content?.contentElements || block.content.contentElements.length === 0) return;

  for (const el of block.content.contentElements) {
    if (el.type === 'heading') {
      children.push(
        new Paragraph({
          spacing: { before: 140, after: 60 },
          children: [
            new TextRun({
              text: el.text || '',
              bold: true,
              size: 22,
              font: 'Calibri',
              color: '1E293B',
            }),
          ],
        })
      );
    } else if (el.type === 'paragraph') {
      children.push(
        new Paragraph({
          spacing: { after: 80 },
          children: [
            new TextRun({
              text: el.text || '',
              bold: el.isBold ?? false,
              size: 20,
              font: 'Calibri',
            }),
          ],
        })
      );
    } else if (el.type === 'list') {
      const items = el.listItems || (el.text ? el.text.split('\n') : []);
      items.forEach((item, idx) => {
        children.push(
          new Paragraph({
            spacing: { after: 40 },
            bullet: el.listType === 'numbered' ? undefined : { level: 0 },
            children: [
              new TextRun({
                text: el.listType === 'numbered' ? `${idx + 1}. ${item}` : item,
                size: 20,
                font: 'Calibri',
              }),
            ],
          })
        );
      });
    } else if (el.type === 'note') {
      children.push(
        new Paragraph({
          spacing: { before: 80, after: 80 },
          children: [
            new TextRun({
              text: `[${el.noteType?.toUpperCase() || 'CAUTION'}]: `,
              bold: true,
              color: el.noteType === 'danger' ? 'DC2626' : 'D97706',
              size: 20,
              font: 'Calibri',
            }),
            new TextRun({
              text: el.text || '',
              size: 20,
              font: 'Calibri',
            }),
          ],
        })
      );
    } else if (el.type === 'table') {
      const cols = el.tableColumns || ['Parameter', 'Specification Standard', 'Acceptance Value'];
      const rows = el.tableRows || [];
      const colWidthPct = Math.floor(100 / Math.max(cols.length, 1));

      const tableRows: TableRow[] = [
        new TableRow({
          tableHeader: true,
          children: cols.map(c => createHeaderCell(c, colWidthPct)),
        }),
      ];

      rows.forEach((r, rIdx) => {
        const isZebra = rIdx % 2 === 1;
        tableRows.push(
          new TableRow({
            children: cols.map((_, cIdx) =>
              createBodyCell(r[`col-${cIdx}`] || (r as any)[cols[cIdx]] || '', false, colWidthPct, isZebra ? 'F8FAFC' : undefined)
            ),
          })
        );
      });

      if (el.text) {
        children.push(
          new Paragraph({
            spacing: { before: 120, after: 40 },
            children: [
              new TextRun({
                text: el.text,
                bold: true,
                size: 20,
                color: '1E293B',
                font: 'Calibri',
              }),
            ],
          })
        );
      }

      children.push(
        buildTable(cols.map(() => colWidthPct), tableRows)
      );
    } else if (el.type === 'image') {
      if (el.imageUrl) {
        const imgParas = await buildImageParagraphs(el.imageUrl, el.imageCaption || el.text);
        imgParas.forEach(p => children.push(p));
      }
    }
  }
}

export async function exportDocumentToDocx(doc: ServicePlanDocument): Promise<void> {
  // Validate that the exported document carries only the selected product's and mode's
  // content. Preview and DOCX are generated from this exact same document model.
  const isolationViolations = validateDocumentIsolation(doc);
  if (isolationViolations.length > 0) {
    isolationViolations.forEach(v => console.warn(`[Export validation] ${v}`));
  }

  const corporateBlue = '245598';
  const docChildren: (Paragraph | Table)[] = [];

  const bHeader = doc.blocks.find(b => b.type === 'header_overview') || doc.blocks[0];
  const bDefinitions = doc.blocks.find(b => b.type === 'technical_definitions') || doc.blocks[1];
  const bSpecs = doc.blocks.find(b => b.type === 'specifications_table') || doc.blocks[2];
  const bPackaging = doc.blocks.find(b => b.type === 'packaging_contents') || doc.blocks[3];
  const bVariants = doc.blocks.find(b => b.type === 'colour_variants') || doc.blocks[4];
  const bFunctionalities = doc.blocks.find(b => b.type === 'product_functionalities') || doc.blocks[5];
  const bLed = doc.blocks.find(b => b.type === 'led_indications') || doc.blocks[6];
  const bCharging = doc.blocks.find(b => b.type === 'charging_guidelines') || doc.blocks[7];
  const bWeight = doc.blocks.find(b => b.type === 'weight_matrix') || doc.blocks[8];
  const bHearables = doc.blocks.find(b => b.type === 'hearables_app') || doc.blocks[9];
  const bDiag = doc.blocks.find(b => b.type === 'diagnostics_troubleshooting') || doc.blocks[10];
  const bCodes = doc.blocks.find(b => b.type === 'return_codes') || doc.blocks[11];
  const bAnnexure = doc.blocks.find(b => b.type === 'annexure') || doc.blocks[12];

  // ==================== SECTION 1: HEADER & OVERVIEW ====================
  if (bHeader && bHeader.enabled) {
    docChildren.push(
      new Paragraph({
        spacing: { before: 120, after: 120 },
        children: [
          new TextRun({
            text: `${bHeader.sectionNumber ? `${bHeader.sectionNumber} ` : '1 '}${bHeader.title}`,
            bold: true,
            underline: { type: 'single' as any, color: corporateBlue },
            size: 26,
            color: corporateBlue,
            font: 'Calibri',
          }),
        ],
      })
    );

    if (bHeader.content.objective) {
      docChildren.push(
        new Paragraph({
          spacing: { after: 60 },
          children: [
            new TextRun({ text: 'Objective: ', bold: true, size: 20, font: 'Calibri', color: '000000' }),
            new TextRun({ text: bHeader.content.objective, size: 20, font: 'Calibri', color: '000000' }),
          ],
        })
      );
    }

    if (bHeader.content.documentOwner) {
      docChildren.push(
        new Paragraph({
          spacing: { after: 100 },
          children: [
            new TextRun({ text: 'Document Owner: ', bold: true, size: 20, font: 'Calibri', color: '000000' }),
            new TextRun({ text: bHeader.content.documentOwner, size: 20, font: 'Calibri', color: '000000' }),
          ],
        })
      );
    }

    if (bHeader.content.featureHighlights && bHeader.content.featureHighlights.length > 0) {
      bHeader.content.featureHighlights.forEach((f, idx) => {
        docChildren.push(
          new Paragraph({
            spacing: { after: 40 },
            children: [
              new TextRun({ text: `${idx + 1}. `, bold: true, size: 20, font: 'Calibri', color: '000000' }),
              new TextRun({ text: f, size: 20, font: 'Calibri', color: '000000' }),
            ],
          })
        );
      });
      docChildren.push(new Paragraph({ spacing: { after: 140 }, children: [] }));
    }
  }

  // ==================== SECTION 2: TECHNICAL DEFINITIONS ====================
  if (bDefinitions && bDefinitions.enabled) {
    docChildren.push(
      new Paragraph({
        spacing: { before: 200, after: 100 },
        children: [
          new TextRun({
            text: `${bDefinitions.sectionNumber ? `${bDefinitions.sectionNumber} ` : '2 '}${bDefinitions.title}`,
            bold: true,
            size: 24,
            color: corporateBlue,
            font: 'Calibri',
          }),
        ],
      })
    );

    if (bDefinitions.content.definitions && bDefinitions.content.definitions.length > 0) {
      const rows = [
        new TableRow({
          tableHeader: true,
          children: [
            createHeaderCell('Terms', 35),
            createHeaderCell('Definitions', 65),
          ],
        }),
        ...bDefinitions.content.definitions.map(def =>
          new TableRow({
            children: [
              createBodyCell(def.term, true, 35),
              createBodyCell(def.definition, false, 65),
            ],
          })
        ),
      ];

      docChildren.push(buildTable([35, 65], rows));
      docChildren.push(new Paragraph({ spacing: { after: 160 }, children: [] }));
    }
  }

  // ==================== SECTION 3: PRODUCT DETAILS ====================
  docChildren.push(
    new Paragraph({
      spacing: { before: 200, after: 100 },
      children: [
        new TextRun({
          text: '3 Product Details',
          bold: true,
          size: 24,
          color: corporateBlue,
          font: 'Calibri',
        }),
      ],
    })
  );

  // 3.1 Product Specifications
  if (bSpecs && bSpecs.enabled) {
    docChildren.push(
      new Paragraph({
        spacing: { before: 100, after: 80 },
        children: [
          new TextRun({
            text: `3.1 ${bSpecs.title}`,
            bold: true,
            size: 22,
            color: '000000',
            font: 'Calibri',
          }),
        ],
      })
    );

    if (bSpecs.content.specifications && bSpecs.content.specifications.length > 0) {
      const rows = [
        new TableRow({
          tableHeader: true,
          children: [
            createHeaderCell('Product Details', 45),
            createHeaderCell('Specification Values', 55),
          ],
        }),
        ...bSpecs.content.specifications.map(spec =>
          new TableRow({
            children: [
              createBodyCell(spec.key, true, 45),
              createBodyCell(spec.value, false, 55),
            ],
          })
        ),
      ];

      docChildren.push(buildTable([45, 55], rows));

      if (bSpecs.customization.noteText && bSpecs.customization.noteText.trim().length > 0) {
        docChildren.push(
          new Paragraph({
            spacing: { before: 80, after: 140 },
            children: [
              new TextRun({ text: 'Note: ', bold: true, color: '000000', size: 19, font: 'Calibri' }),
              new TextRun({
                text: bSpecs.customization.noteText,
                color: '000000',
                size: 19,
                font: 'Calibri',
              }),
            ],
          })
        );
      }
    }
  }

  // 3.2 Packaging Contents
  if (bPackaging && bPackaging.enabled) {
    docChildren.push(
      new Paragraph({
        spacing: { before: 120, after: 80 },
        children: [
          new TextRun({
            text: `3.2 ${bPackaging.title}`,
            bold: true,
            size: 22,
            color: '000000',
            font: 'Calibri',
          }),
        ],
      })
    );

    if (bPackaging.content.packagingList && bPackaging.content.packagingList.length > 0) {
      const pkgItems = bPackaging.content.packagingList;
      const rows = pkgItems.map((item, idx) =>
        new TableRow({
          children: [
            createBodyCell(`${idx + 1}.  ${item.replace(/^\d+\s*[X\.\-]?\s*/, '')}`, false, 100),
          ],
        })
      );

      docChildren.push(buildTable([100], rows));
      docChildren.push(new Paragraph({ spacing: { after: 140 }, children: [] }));
    }
  }

  // 3.3 Colour Variants — rendered only when the selected product defines variants.
  if (bVariants && bVariants.enabled && (bVariants.content.colourVariants || []).length > 0) {
    docChildren.push(
      new Paragraph({
        spacing: { before: 120, after: 80 },
        children: [
          new TextRun({
            text: `3.3 ${bVariants.title}`,
            bold: true,
            size: 22,
            color: '000000',
            font: 'Calibri',
          }),
        ],
      })
    );

    const variantsList = (bVariants.content.colourVariants || []).map(cv => cv.name);

    const rows = [
      new TableRow({
        tableHeader: true,
        children: [
          createHeaderCell('Product Name', 35),
          createHeaderCell('Colour Variants', 65),
        ],
      }),
      new TableRow({
        children: [
          createBodyCell(doc.productName, true, 35),
          createBodyCell(variantsList.join('\n'), false, 65),
        ],
      }),
    ];

    docChildren.push(buildTable([35, 65], rows));
    docChildren.push(new Paragraph({ spacing: { after: 140 }, children: [] }));
  }

  // 3.4 Product Functionalities
  if (bFunctionalities && bFunctionalities.enabled) {
    docChildren.push(
      new Paragraph({
        spacing: { before: 120, after: 80 },
        children: [
          new TextRun({
            text: `3.4 ${bFunctionalities.title}`,
            bold: true,
            size: 22,
            color: '000000',
            font: 'Calibri',
          }),
        ],
      })
    );

    if (bFunctionalities.content.functionalities && bFunctionalities.content.functionalities.length > 0) {
      const rows = [
        new TableRow({
          tableHeader: true,
          children: [
            createHeaderCell('Function', 35),
            createHeaderCell('Process', 65),
          ],
        }),
        ...bFunctionalities.content.functionalities.map(fn =>
          new TableRow({
            children: [
              createBodyCell(fn.functionName, true, 35),
              createBodyCell(fn.process, false, 65),
            ],
          })
        ),
      ];

      docChildren.push(buildTable([35, 65], rows));
      docChildren.push(new Paragraph({ spacing: { after: 140 }, children: [] }));
    }
  }

  // 3.5 Product LED Indications
  if (bLed && bLed.enabled) {
    docChildren.push(
      new Paragraph({
        spacing: { before: 120, after: 80 },
        children: [
          new TextRun({
            text: `3.5 ${bLed.title}`,
            bold: true,
            size: 22,
            color: '000000',
            font: 'Calibri',
          }),
        ],
      })
    );

    // 3.5.1 Remaining Case Battery
    if (bLed.content.caseLedIndications && bLed.content.caseLedIndications.length > 0) {
      docChildren.push(
        new Paragraph({
          spacing: { before: 80, after: 60 },
          children: [
            new TextRun({ text: '3.5.1 Remaining Case Battery LED Indications', bold: true, size: 20, font: 'Calibri', color: '000000' }),
          ],
        })
      );

      const rows = [
        new TableRow({
          tableHeader: true,
          children: [
            createHeaderCell('Case Remaining Battery', 34),
            createHeaderCell('Charging State', 33),
            createHeaderCell('Normal (Non-Charging) State', 33),
          ],
        }),
        ...bLed.content.caseLedIndications.map(row =>
          new TableRow({
            children: [
              createBodyCell(row.scenario, true, 34),
              createBodyCell(row.chargingState || '-', false, 33),
              createBodyCell(row.normalState || '-', false, 33),
            ],
          })
        ),
      ];

      docChildren.push(buildTable([34, 33, 33], rows));
      docChildren.push(new Paragraph({ spacing: { after: 100 }, children: [] }));
    }

    // 3.5.2 Earbuds LED
    if (bLed.content.earbudsLedIndications && bLed.content.earbudsLedIndications.length > 0) {
      docChildren.push(
        new Paragraph({
          spacing: { before: 80, after: 60 },
          children: [
            new TextRun({ text: '3.5.2 Earbuds LED Indications', bold: true, size: 20, font: 'Calibri', color: '000000' }),
          ],
        })
      );

      const rows = [
        new TableRow({
          tableHeader: true,
          children: [
            createHeaderCell('Scenario', 35),
            createHeaderCell('Charging / Operating State', 65),
          ],
        }),
        ...bLed.content.earbudsLedIndications.map(row =>
          new TableRow({
            children: [
              createBodyCell(row.scenario, true, 35),
              createBodyCell(row.chargingState || '-', false, 65),
            ],
          })
        ),
      ];

      docChildren.push(buildTable([35, 65], rows));
      docChildren.push(new Paragraph({ spacing: { after: 100 }, children: [] }));
    }

    // 3.5.3 Factory Reset LED
    if (bLed.content.factoryResetLed && bLed.content.factoryResetLed.length > 0) {
      docChildren.push(
        new Paragraph({
          spacing: { before: 80, after: 60 },
          children: [
            new TextRun({ text: '3.5.3 Factory Reset LED Indications', bold: true, size: 20, font: 'Calibri', color: '000000' }),
          ],
        })
      );

      const rows = [
        ...bLed.content.factoryResetLed.map(row =>
          new TableRow({
            children: [
              createBodyCell(row.scenario, true, 35),
              createBodyCell(row.result || '-', false, 65),
            ],
          })
        ),
      ];

      docChildren.push(buildTable([35, 65], rows));
      docChildren.push(new Paragraph({ spacing: { after: 140 }, children: [] }));
    }
  }

  // 3.6 Charging Procedure
  if (bCharging && bCharging.enabled) {
    docChildren.push(
      new Paragraph({
        spacing: { before: 120, after: 80 },
        children: [
          new TextRun({
            text: `3.6 ${bCharging.title}`,
            bold: true,
            size: 22,
            color: '000000',
            font: 'Calibri',
          }),
        ],
      })
    );

    if (bCharging.content.chargingGuidelines && bCharging.content.chargingGuidelines.length > 0) {
      const rows = [
        new TableRow({
          tableHeader: true,
          children: [
            createHeaderCell('Statement', 35),
            createHeaderCell('Information', 65),
          ],
        }),
        ...bCharging.content.chargingGuidelines.map(cg =>
          new TableRow({
            children: [
              createBodyCell(cg.statement, true, 35),
              createBodyCell(cg.information, false, 65),
            ],
          })
        ),
      ];

      docChildren.push(buildTable([35, 65], rows));
      docChildren.push(new Paragraph({ spacing: { after: 140 }, children: [] }));
    }
  }

  // Product Weight Matrix — rendered only when the selected product has real dimensions.
  if (bWeight && bWeight.enabled) {
    const wmRowsData = bWeight.content.weightMatrixRows && bWeight.content.weightMatrixRows.length > 0
      ? bWeight.content.weightMatrixRows
      : bWeight.content.weightMatrix
      ? [{ id: 'wm-1', ...bWeight.content.weightMatrix }]
      : [];

    const wmHasData = wmRowsData.some(wm =>
      [wm.length, wm.breadth, wm.height, wm.earbudsWeight, wm.caseWeight]
        .some(v => (v || '').toString().trim().length > 0)
    );

    if (wmHasData) {
      docChildren.push(
        new Paragraph({
          spacing: { before: 120, after: 80 },
          children: [
            new TextRun({
              text: `${bWeight.sectionNumber || '4'} ${bWeight.title}`,
              bold: true,
              size: 22,
              color: '000000',
              font: 'Calibri',
            }),
          ],
        })
      );

      const rows = [
        new TableRow({
          tableHeader: true,
          children: [
            createHeaderCell('Product', 28),
            createHeaderCell('Length', 14),
            createHeaderCell('Breadth', 14),
            createHeaderCell('Height', 14),
            createHeaderCell('Earbuds Weight', 16),
            createHeaderCell('Case Weight', 14),
          ],
        }),
        ...wmRowsData.map(wm =>
          new TableRow({
            children: [
              createBodyCell(wm.product, true, 28),
              createBodyCell(wm.length, false, 14),
              createBodyCell(wm.breadth, false, 14),
              createBodyCell(wm.height, false, 14),
              createBodyCell(wm.earbudsWeight, false, 16),
              createBodyCell(wm.caseWeight, false, 14),
            ],
          })
        ),
      ];

      docChildren.push(buildTable([28, 14, 14, 14, 16, 14], rows));
      docChildren.push(new Paragraph({ spacing: { after: 160 }, children: [] }));
    }
  }

  // ==================== SECTION 4: HEARABLES APP FUNCTIONALITIES ====================
  if (bHearables && bHearables.enabled) {
    docChildren.push(
      new Paragraph({
        spacing: { before: 200, after: 100 },
        children: [
          new TextRun({
            text: `${bHearables.sectionNumber || '5'} ${bHearables.title}`,
            bold: true,
            size: 24,
            color: corporateBlue,
            font: 'Calibri',
          }),
        ],
      })
    );

    // SDK / Non-SDK device classification note
    docChildren.push(
      new Paragraph({
        spacing: { after: 100 },
        children: [
          new TextRun({
            text: `Device Classification: ${doc.deviceType}. SDK devices support the full Hearables app feature set (EQ, touch remapping, OTA updates); Non-SDK devices support the reduced Sound / System app set only.`,
            size: 20,
            font: 'Calibri',
            color: '000000',
            italics: true,
          }),
        ],
      })
    );

    // App tab columns follow the block content (Non-SDK has Sound + System only)
    const appTabs = (bHearables.content.hearablesAppTabs && bHearables.content.hearablesAppTabs.length > 0)
      ? bHearables.content.hearablesAppTabs
      : [{ id: 't1', tabName: 'App - Sound Tab', description: '', imageUrl: undefined }, { id: 't2', tabName: 'App - System Tab', description: '', imageUrl: undefined }];
    const tabWidth = Math.floor(100 / appTabs.length);
    // Width available for a tab picture inside its column (dxa → px, minus cell margins)
    const tabImgMaxPx = Math.max(120, Math.floor(pctToDxa(tabWidth) / 15) - 32);

    // Build each tab's body cell: embed the user-uploaded picture if present, otherwise a
    // clean, content-accurate summary of the tab (description + feature list). This mirrors
    // the information shown in the on-screen app mockup for the selected product/mode.
    const tabBodyCells: TableCell[] = [];
    for (const tab of appTabs) {
      const imgUrl = (tab as { imageUrl?: string }).imageUrl;
      const description = (tab as { description?: string }).description;
      const features = (tab as { features?: string[] }).features || [];
      let paras: Paragraph[] = [];
      // 1) A user-uploaded picture always wins and is embedded as-is.
      if (imgUrl) {
        paras = await buildImageParagraphs(imgUrl, undefined, tabImgMaxPx);
      }
      // 2) Otherwise render a clean textual summary (never cropped, always product/mode-correct).
      if (paras.length === 0) {
        if (description) {
          paras.push(
            new Paragraph({
              spacing: { after: 60 },
              children: [
                new TextRun({ text: description, size: 19, font: 'Calibri', color: '000000', italics: true }),
              ],
            })
          );
        }
        for (const feature of features) {
          paras.push(
            new Paragraph({
              spacing: { after: 30 },
              children: [
                new TextRun({ text: `• ${feature}`, size: 19, font: 'Calibri', color: '000000' }),
              ],
            })
          );
        }
        if (paras.length === 0) {
          paras.push(
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: tab.tabName, size: 19, font: 'Calibri', color: '000000' }),
              ],
            })
          );
        }
      }
      tabBodyCells.push(
        new TableCell({
          width: { size: pctToDxa(tabWidth), type: WidthType.DXA },
          borders: CELL_BORDERS,
          margins: { top: 90, bottom: 90, left: 140, right: 140 },
          children: paras,
        })
      );
    }

    const tabHeaders = [
      new TableRow({
        tableHeader: true,
        children: appTabs.map(tab => createHeaderCell(tab.tabName, tabWidth)),
      }),
      new TableRow({ children: tabBodyCells }),
    ];

    docChildren.push(buildTable(appTabs.map(() => tabWidth), tabHeaders));
    docChildren.push(new Paragraph({ spacing: { after: 120 }, children: [] }));

    if (bHearables.content.hearablesGuideSteps && bHearables.content.hearablesGuideSteps.length > 0) {
      const guideRows = [
        new TableRow({
          tableHeader: true,
          children: [
            createHeaderCell('Function', 35),
            createHeaderCell('Process', 65),
          ],
        }),
        ...bHearables.content.hearablesGuideSteps.map(step =>
          new TableRow({
            children: [
              createBodyCell(step.functionName, true, 35),
              createBodyCell(step.process, false, 65),
            ],
          })
        ),
      ];

      docChildren.push(buildTable([35, 65], guideRows));
      docChildren.push(new Paragraph({ spacing: { after: 160 }, children: [] }));
    }
  }

  // ==================== SECTION 5: DIAGNOSTICS GUIDELINES ====================
  if (bDiag && bDiag.enabled) {
    docChildren.push(
      new Paragraph({
        spacing: { before: 200, after: 100 },
        children: [
          new TextRun({
            text: `${bDiag.sectionNumber || '6'} ${bDiag.title}`,
            bold: true,
            size: 24,
            color: corporateBlue,
            font: 'Calibri',
          }),
        ],
      })
    );

    const diagNum = bDiag.sectionNumber || '6';

    // Service Channels
    docChildren.push(
      new Paragraph({
        spacing: { before: 80, after: 60 },
        children: [
          new TextRun({ text: `${diagNum}.1 Service Channels`, bold: true, size: 22, font: 'Calibri', color: '000000' }),
        ],
      })
    );

    const serviceChannelSource = (bDiag.content.serviceChannels && bDiag.content.serviceChannels.length > 0)
      ? bDiag.content.serviceChannels
      : [{ id: 'sc-def', channelName: doc.productName, details: 'Door to Door Replacement (D2D)\nMulti-brand Service Centre (MSC)' }];

    const serviceChannelRows = [
      new TableRow({
        tableHeader: true,
        children: [
          createHeaderCell('Product Name', 35),
          createHeaderCell('Service Channels', 65),
        ],
      }),
      ...serviceChannelSource.map(sc =>
        new TableRow({
          children: [
            createBodyCell(sc.channelName, true, 35),
            createBodyCell(sc.details, false, 65),
          ],
        })
      ),
    ];

    docChildren.push(buildTable([35, 65], serviceChannelRows));
    docChildren.push(new Paragraph({ spacing: { after: 120 }, children: [] }));

    // Troubleshooting FAQs
    docChildren.push(
      new Paragraph({
        spacing: { before: 100, after: 80 },
        children: [
          new TextRun({
            text: `${diagNum}.2 Probable FAQs, Actionable Instructions and Resolutions for ${doc.productName}`,
            bold: true,
            size: 22,
            font: 'Calibri',
            color: '000000',
          }),
        ],
      })
    );

    if (bDiag.content.troubleshootingItems && bDiag.content.troubleshootingItems.length > 0) {
      const diagRows = [
        new TableRow({
          tableHeader: true,
          children: [
            createHeaderCell('Issues', 28),
            createHeaderCell('Instructions', 48),
            createHeaderCell('Final Resolution', 24),
          ],
        }),
        ...bDiag.content.troubleshootingItems.map(tb => {
          // Instructions with App - highlighting
          const instructionParagraphs: Paragraph[] = tb.instructions.map(inst =>
            new Paragraph({
              children: [
                new TextRun({ text: `• ${inst}`, size: 19, font: 'Calibri', color: '000000' }),
              ],
              spacing: { after: 40 },
            })
          );

          if (tb.appDiagnosticsNote) {
            instructionParagraphs.push(
              new Paragraph({
                spacing: { before: 60 },
                children: [
                  new TextRun({
                    text: 'App - ',
                    bold: true,
                    highlight: 'yellow',
                    size: 19,
                    font: 'Calibri',
                    color: '000000',
                  }),
                  new TextRun({
                    text: tb.appDiagnosticsNote,
                    size: 19,
                    font: 'Calibri',
                    color: '000000',
                  }),
                ],
              })
            );
          }

          return new TableRow({
            children: [
              new TableCell({
                width: { size: pctToDxa(28), type: WidthType.DXA },
                borders: CELL_BORDERS,
                margins: { top: 90, bottom: 90, left: 140, right: 140 },
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: tb.issue,
                        bold: true,
                        size: 19,
                        font: 'Calibri',
                        color: '000000',
                      }),
                    ],
                  }),
                ],
              }),
              new TableCell({
                width: { size: pctToDxa(48), type: WidthType.DXA },
                borders: CELL_BORDERS,
                margins: { top: 90, bottom: 90, left: 140, right: 140 },
                children: instructionParagraphs,
              }),
              new TableCell({
                width: { size: pctToDxa(24), type: WidthType.DXA },
                borders: CELL_BORDERS,
                margins: { top: 90, bottom: 90, left: 140, right: 140 },
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: tb.finalResolution,
                        size: 19,
                        font: 'Calibri',
                        color: '000000',
                      }),
                    ],
                  }),
                ],
              }),
            ],
          });
        }),
      ];

      docChildren.push(buildTable([28, 48, 24], diagRows));
      docChildren.push(new Paragraph({ spacing: { after: 160 }, children: [] }));
    }
  }

  // ==================== SECTION 6: ASIN / FSN CODES ====================
  // Rendered only when the selected product defines return codes.
  if (bCodes && bCodes.enabled && bCodes.content.returnCodes && bCodes.content.returnCodes.length > 0) {
    docChildren.push(
      new Paragraph({
        spacing: { before: 200, after: 100 },
        children: [
          new TextRun({
            text: `${bCodes.sectionNumber || '7'} ${bCodes.title}`,
            bold: true,
            size: 24,
            color: corporateBlue,
            font: 'Calibri',
          }),
        ],
      })
    );

    const codeRows = [
      new TableRow({
        tableHeader: true,
        children: [
          createHeaderCell('Product Description', 40),
          createHeaderCell('EAN Number', 24),
          createHeaderCell('ASIN', 18),
          createHeaderCell('FSN', 18),
        ],
      }),
      ...bCodes.content.returnCodes.map(rc =>
        new TableRow({
          children: [
            createBodyCell(rc.productDesc, true, 40),
            createBodyCell(rc.ean, false, 24),
            createBodyCell(rc.asin, false, 18),
            createBodyCell(rc.fsn, false, 18),
          ],
        })
      ),
    ];

    docChildren.push(buildTable([40, 24, 18, 18], codeRows));
    docChildren.push(new Paragraph({ spacing: { after: 160 }, children: [] }));
  }

  // ==================== SECTION 7: ANNEXURE ====================
  if (bAnnexure && bAnnexure.enabled) {
    docChildren.push(
      new Paragraph({
        spacing: { before: 200, after: 100 },
        children: [
          new TextRun({
            text: `${bAnnexure.sectionNumber || '8'} ${bAnnexure.title}`,
            bold: true,
            size: 24,
            color: corporateBlue,
            font: 'Calibri',
          }),
        ],
      })
    );

    const annexureItems: AnnexureItem[] = (bAnnexure.content.annexureItems && bAnnexure.content.annexureItems.length > 0)
      ? bAnnexure.content.annexureItems
      : [
          {
            id: 'ann-1',
            category: 'QA Testing',
            sopTitle: 'Testing Standard Operating Procedure',
            protocols: bAnnexure.content.annexureTestingSop || '● Step 1: Visual and cosmetic inspection for cracks or water damage.\n● Step 2: Battery terminal voltage verification.\n● Step 3: Audio spectrum sweep and microphone calibration.\n● Step 4: Bluetooth RF connectivity validation.',
            resourceLink: bAnnexure.content.annexureTutorialLinks || 'https://service-portal.internal.com/training/neo-anc',
          },
          {
            id: 'ann-2',
            category: 'Tutorial Video',
            sopTitle: 'Service & Tutorial Video Links',
            protocols: 'Complete technical video walkthrough illustrating charging case disassembly, ultrasonic cleaning of acoustic mesh filters, and battery replacement SOP.',
            resourceLink: bAnnexure.content.annexureTutorialLinks || 'https://service-portal.internal.com/training/neo-anc',
          },
        ];

    const annexureRows = [
      new TableRow({
        tableHeader: true,
        children: [
          createHeaderCell('S.No.', 10),
          createHeaderCell('SOP Title / Document', 25),
          createHeaderCell('Testing SOP Protocols & Procedures', 40),
          createHeaderCell('Service & Tutorial Video Links', 25),
        ],
      }),
      ...annexureItems.map((item, idx) => {
        const protocolParagraphs = item.protocols.split('\n').map(line => 
          new Paragraph({
            children: [
              new TextRun({ text: line, size: 19, font: 'Calibri', color: '000000' }),
            ],
            spacing: { after: 30 },
          })
        );

        return new TableRow({
          children: [
            createBodyCell(`${bAnnexure.sectionNumber || '8'}.${idx + 1}`, true, 10),
            createBodyCell(item.category ? `${item.sopTitle}\n[${item.category}]` : item.sopTitle, true, 25),
            new TableCell({
              width: { size: pctToDxa(40), type: WidthType.DXA },
              borders: CELL_BORDERS,
              margins: { top: 90, bottom: 90, left: 140, right: 140 },
              children: protocolParagraphs.length > 0 ? protocolParagraphs : [
                new Paragraph({ children: [new TextRun({ text: item.protocols, size: 19, font: 'Calibri', color: '000000' })] })
              ],
            }),
            createBodyCell(item.resourceLink || 'N/A', false, 25),
          ],
        });
      }),
    ];

    docChildren.push(buildTable([10, 25, 40, 25], annexureRows));
    docChildren.push(new Paragraph({ spacing: { after: 160 }, children: [] }));
  }

  // Append any custom content elements (custom tables, notes, paragraphs, uploaded images) attached to active blocks
  for (const b of doc.blocks) {
    if (b.enabled) {
      await appendCustomContentElements(docChildren, b);
    }
  }

  // Assemble the Word document
  const wordDoc = new Document({
    sections: [
      {
        properties: {
          page: {
            size: {
              width: 11906, // A4 width: 210mm (11906 dxa)
              height: 16838, // A4 height: 297mm (16838 dxa)
              orientation: PageOrientation.PORTRAIT,
            },
            margin: {
              top: 1440, // 1 inch = 1440 dxa
              bottom: 1440, // 1 inch = 1440 dxa
              left: 1440, // 1 inch = 1440 dxa
              right: 1440, // 1 inch = 1440 dxa
            },
          },
        },
        children: docChildren,
      },
    ],
  });

  const blob = await Packer.toBlob(wordDoc);
  // Filename nomenclature: "{Product Name}_{SDK|Non-SDK}.docx"
  const cleanProduct = (doc.productName || 'Service_Plan_Document')
    .trim()
    .replace(/\s+/g, '_')
    .replace(/[^\w-]/g, '');
  saveAs(blob, `${cleanProduct}_${doc.deviceType}.docx`);
}
