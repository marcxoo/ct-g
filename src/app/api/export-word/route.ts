import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  Document, Packer, Paragraph, TextRun, ImageRun,
  AlignmentType, BorderStyle, PageNumber, Header, Footer,
  ShadingType, LineRuleType, HeadingLevel, TableOfContents, TabStopType,
  Table, TableRow, TableCell, WidthType, VerticalAlign,
} from 'docx';
import { SESSION_COOKIE, verifySessionToken } from '@/lib/auth';
import { type Category, type Item } from '@/data/coffee-data';
import { BRAND_LOGO_FULL_PNG_BASE64 } from '@/lib/brandLogoFull';
import { BIZ, TYPE_LABEL, loadManualData, fmtPrice, todayStr, manualStats, parseIngredient } from '@/lib/manualContent';

export const runtime = 'nodejs';

// ─── Paleta de marca Coffee Time ───────────────────────────────────────────────
const GREEN = '144639';
const GREEN_SOFT = 'E7EEEB'; // verde claro para las celdas de ingredientes
const GOLD = 'B79A4B'; // dorado un poco más oscuro = legible en blanco
const DARK = '1C1917';
const GREY = '6B6560';
const RULE = 'DED9D2';
const FONT = 'Calibri';
const RIGHT_TAB = 10240; // ancho útil (twips) para tabular a la derecha

// ─── Bloques reutilizables ──────────────────────────────────────────────────────
function subTitle(text: string): Paragraph {
  return new Paragraph({
    spacing: { before: 180, after: 70 },
    keepNext: true,
    children: [
      new TextRun({ text: text.toUpperCase(), bold: true, color: GOLD, size: 17, font: FONT, characterSpacing: 14 }),
    ],
  });
}

function bullet(text: string): Paragraph {
  return new Paragraph({
    spacing: { after: 50 },
    indent: { left: 380, hanging: 210 },
    alignment: AlignmentType.JUSTIFIED,
    children: [
      new TextRun({ text: '•  ', bold: true, color: GREEN, font: FONT, size: 22 }),
      new TextRun({ text, color: DARK, font: FONT, size: 22 }),
    ],
  });
}

function numbered(n: number, text: string): Paragraph {
  return new Paragraph({
    spacing: { after: 60 },
    indent: { left: 460, hanging: 320 },
    alignment: AlignmentType.JUSTIFIED,
    children: [
      new TextRun({ text: `${n}.`, bold: true, color: GREEN, font: FONT, size: 22 }),
      new TextRun({ text: `   ${text}`, color: DARK, font: FONT, size: 22 }),
    ],
  });
}

type Align = (typeof AlignmentType)[keyof typeof AlignmentType];

// Ingredientes como tabla de 3 columnas: Ingrediente | Cantidad | Unidad
function ingredientsTable(ings: string[]): Table {
  const NAME_W = 6700, QTY_W = 1740, UNIT_W = 1800; // suma ≈ 10240
  const line = { style: BorderStyle.SINGLE, size: 4, color: 'D9D6D1' };
  const cellBorders = { top: line, bottom: line, left: line, right: line };

  const headCell = (text: string, w: number, align: Align) =>
    new TableCell({
      width: { size: w, type: WidthType.DXA },
      shading: { type: ShadingType.CLEAR, color: 'auto', fill: GREEN },
      margins: { top: 60, bottom: 60, left: 130, right: 130 },
      verticalAlign: VerticalAlign.CENTER,
      borders: cellBorders,
      children: [new Paragraph({ alignment: align, children: [new TextRun({ text, bold: true, color: 'FFFFFF', size: 17, font: FONT, characterSpacing: 6 })] })],
    });

  const bodyCell = (text: string, w: number, align: Align, zebra: boolean, opts?: { bold?: boolean; color?: string }) =>
    new TableCell({
      width: { size: w, type: WidthType.DXA },
      shading: { type: ShadingType.CLEAR, color: 'auto', fill: zebra ? GREEN_SOFT : 'FFFFFF' },
      margins: { top: 50, bottom: 50, left: 130, right: 130 },
      verticalAlign: VerticalAlign.CENTER,
      borders: cellBorders,
      children: [new Paragraph({ alignment: align, children: [new TextRun({ text, bold: opts?.bold, color: opts?.color ?? DARK, size: 21, font: FONT })] })],
    });

  const rows: TableRow[] = [
    new TableRow({
      tableHeader: true,
      children: [
        headCell('INGREDIENTE', NAME_W, AlignmentType.LEFT),
        headCell('CANT.', QTY_W, AlignmentType.CENTER),
        headCell('UNIDAD', UNIT_W, AlignmentType.CENTER),
      ],
    }),
    ...ings.map((ing, idx) => {
      const p = parseIngredient(ing);
      const z = idx % 2 === 1;
      return new TableRow({
        children: [
          bodyCell(p.name, NAME_W, AlignmentType.LEFT, z, { bold: true, color: GREEN }),
          bodyCell(p.qty, QTY_W, AlignmentType.CENTER, z),
          bodyCell(p.unit, UNIT_W, AlignmentType.CENTER, z, { color: GREY }),
        ],
      });
    }),
  ];

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    columnWidths: [NAME_W, QTY_W, UNIT_W],
    layout: 'fixed',
    rows,
  });
}

// Banner de categoría = Heading1 (entra en el índice) + barra verde a todo el ancho
function categoryBanner(cat: Category): Paragraph {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    pageBreakBefore: true,
    shading: { type: ShadingType.CLEAR, color: 'auto', fill: GREEN },
    spacing: { before: 40, after: 240, line: 400, lineRule: LineRuleType.AT_LEAST },
    children: [
      new TextRun({ text: '  ', size: 30, font: FONT, color: 'FFFFFF' }),
      new TextRun({ text: `${cat.icon}  `, size: 30, font: FONT }),
      new TextRun({ text: cat.name, bold: true, color: 'FFFFFF', size: 30, font: FONT }),
    ],
  });
}

// Encabezado de ítem: nombre + precio + regla inferior
function itemHeader(item: Item): Paragraph {
  const runs: TextRun[] = [
    new TextRun({ text: item.name, bold: true, color: GREEN, size: 25, font: FONT }),
  ];
  const price = fmtPrice(item.price);
  if (price) runs.push(new TextRun({ text: `\t${price}`, bold: true, color: GOLD, size: 25, font: FONT }));
  return new Paragraph({
    spacing: { before: 240, after: 30 },
    keepNext: true,
    tabStops: [{ type: TabStopType.RIGHT, position: RIGHT_TAB }],
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: RULE, space: 4 } },
    children: runs,
  });
}

function itemBlock(item: Item): (Paragraph | Table)[] {
  const out: (Paragraph | Table)[] = [];
  out.push(itemHeader(item));

  out.push(new Paragraph({
    spacing: { after: 80 },
    children: [new TextRun({ text: TYPE_LABEL[item.type], bold: true, color: GREY, size: 13, font: FONT, characterSpacing: 10 })],
  }));

  if (item.description) {
    out.push(new Paragraph({
      spacing: { after: 80 },
      alignment: AlignmentType.JUSTIFIED,
      children: [new TextRun({ text: item.description, color: DARK, size: 22, font: FONT })],
    }));
  }
  if (item.ingredients?.length) {
    out.push(subTitle('Ingredientes'));
    out.push(ingredientsTable(item.ingredients));
    out.push(new Paragraph({ spacing: { after: 40 } }));
  }
  if (item.steps?.length) {
    out.push(subTitle('Preparación'));
    item.steps.forEach((s, i) => out.push(numbered(i + 1, s)));
  }
  if (item.notes?.length) {
    out.push(subTitle('Notas'));
    item.notes.forEach((nt) => out.push(bullet(nt)));
  }
  return out;
}

// ─── GET → descarga del Word ────────────────────────────────────────────────────
export async function GET() {
  const store = await cookies();
  const session = await verifySessionToken(store.get(SESSION_COOKIE)?.value);
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  const data = await loadManualData();
  const logo = Buffer.from(BRAND_LOGO_FULL_PNG_BASE64, 'base64');
  const { items: totalItems } = manualStats(data);

  // ── Portada ──────────────────────────────────────────────────────────────────
  const coverLine = (text: string, opts: { size: number; color: string; bold?: boolean; before?: number; after?: number; spacing?: number }) =>
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: opts.before ?? 0, after: opts.after ?? 0 },
      children: [new TextRun({ text, size: opts.size, color: opts.color, bold: opts.bold, font: FONT, characterSpacing: opts.spacing })],
    });

  const cover: Paragraph[] = [
    new Paragraph({ spacing: { before: 1500 } }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new ImageRun({ data: logo, type: 'png', transformation: { width: 360, height: 184 } })],
    }),
    coverLine('Manual de Operaciones', { size: 50, color: GREEN, bold: true, before: 520, after: 60 }),
    coverLine('Instructivo general de procedimientos', { size: 26, color: DARK, after: 40 }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 14, color: GOLD, space: 14 } },
      children: [new TextRun({ text: 'SPECIALTY COFFEE', color: GOLD, size: 18, bold: true, font: FONT, characterSpacing: 34 })],
    }),
    coverLine(`${BIZ.name} · ${BIZ.tagline}`, { size: 24, color: GREEN, bold: true, before: 220, after: 40 }),
    coverLine(BIZ.address, { size: 17, color: GREY, after: 260 }),
    coverLine(`Responsable: ${BIZ.responsable}`, { size: 18, color: DARK, after: 30 }),
    coverLine(`Área: ${BIZ.area}     ·     Código: ${BIZ.code}`, { size: 18, color: GREY, after: 30 }),
    coverLine(`Generado el ${todayStr()}  ·  ${data.length} categorías · ${totalItems} ítems`, { size: 18, color: GREY, after: 0 }),
  ];

  // ── Índice (TOC real, se actualiza al abrir en Word) ───────────────────────────
  const toc: (Paragraph | TableOfContents)[] = [
    new Paragraph({
      pageBreakBefore: true,
      spacing: { after: 200 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 14, color: GREEN, space: 6 } },
      children: [new TextRun({ text: 'Contenido', bold: true, color: GREEN, size: 40, font: FONT })],
    }),
    new TableOfContents('Contenido', { hyperlink: true, headingStyleRange: '1-1' }),
  ];

  // ── Contenido ──────────────────────────────────────────────────────────────────
  const body: (Paragraph | Table)[] = [];
  data.forEach((cat) => {
    body.push(categoryBanner(cat));
    if (cat.items.length === 0) {
      body.push(new Paragraph({
        children: [new TextRun({ text: 'Sin elementos en esta categoría.', italics: true, color: GREY, size: 22, font: FONT })],
      }));
    }
    cat.items.forEach((item) => itemBlock(item).forEach((b) => body.push(b)));
  });

  // ── Header de control (estilo instructivo) ──────────────────────────────────────
  const header = new Header({
    children: [
      new Paragraph({
        tabStops: [{ type: TabStopType.RIGHT, position: RIGHT_TAB }],
        spacing: { after: 0 },
        children: [
          new TextRun({ text: BIZ.name.toUpperCase(), bold: true, color: GREEN, size: 16, font: FONT }),
          new TextRun({ text: '  ·  Instructivo General de Procedimientos', color: GREY, size: 16, font: FONT }),
          new TextRun({ text: `\t${BIZ.code}`, bold: true, color: GREEN, size: 16, font: FONT }),
        ],
      }),
      new Paragraph({
        tabStops: [{ type: TabStopType.RIGHT, position: RIGHT_TAB }],
        border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: GREEN, space: 3 } },
        children: [
          new TextRun({ text: BIZ.area, color: GREY, size: 15, font: FONT }),
          new TextRun({ text: `\tFecha: ${todayStr()}`, color: GREY, size: 15, font: FONT }),
        ],
      }),
    ],
  });

  const footer = new Footer({
    children: [
      new Paragraph({
        tabStops: [{ type: TabStopType.RIGHT, position: RIGHT_TAB }],
        border: { top: { style: BorderStyle.SINGLE, size: 8, color: RULE, space: 4 } },
        children: [
          new TextRun({ text: `${BIZ.name} — ${BIZ.tagline}`, color: GREY, size: 15, font: FONT }),
          new TextRun({ text: '\tPágina ', color: GREY, size: 15, font: FONT }),
          new TextRun({ children: [PageNumber.CURRENT], color: GREY, size: 15, font: FONT }),
          new TextRun({ text: ' de ', color: GREY, size: 15, font: FONT }),
          new TextRun({ children: [PageNumber.TOTAL_PAGES], color: GREY, size: 15, font: FONT }),
        ],
      }),
    ],
  });

  const emptyHeader = new Header({ children: [new Paragraph({})] });
  const emptyFooter = new Footer({ children: [new Paragraph({})] });

  const doc = new Document({
    creator: 'Coffee Time',
    title: 'Manual de Operaciones — Coffee Time',
    description: 'Instructivo general de procedimientos · recetas y procesos',
    features: { updateFields: true },
    styles: {
      default: {
        document: { run: { font: FONT, color: DARK } },
      },
    },
    sections: [
      {
        properties: { titlePage: true, page: { margin: { top: 1300, bottom: 1100, left: 1000, right: 1000 } } },
        headers: { default: header, first: emptyHeader },
        footers: { default: footer, first: emptyFooter },
        children: [...cover, ...toc, ...body],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const today = new Date().toISOString().slice(0, 10);
  const filename = `Manual-Coffee-Time-${today}.docx`;

  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  });
}
