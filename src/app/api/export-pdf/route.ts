import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import PDFDocument from 'pdfkit';
import { SESSION_COOKIE, verifySessionToken } from '@/lib/auth';
import { type Category } from '@/data/coffee-data';
import { BRAND_LOGO_FULL_PNG_BASE64 } from '@/lib/brandLogoFull';
import { BIZ, TYPE_LABEL, loadManualData, fmtPrice, todayStr, manualStats, stripEmoji, parseIngredient } from '@/lib/manualContent';

export const runtime = 'nodejs';

// ─── Paleta de marca ────────────────────────────────────────────────────────────
const GREEN = '#144639';
const GREEN_SOFT = '#E7EEEB';
const GOLD = '#B79A4B';
const DARK = '#1C1917';
const GREY = '#6B6560';
const RULE = '#DED9D2';
const WHITE = '#FFFFFF';
const LOGO_RATIO = 1.9586; // 1892 / 966

// Geometría (puntos)
const M = { top: 92, bottom: 70, left: 56, right: 56 };
const PAGE_W = 612, PAGE_H = 792;
const CONTENT_W = PAGE_W - M.left - M.right;
const BOTTOM_Y = PAGE_H - M.bottom;

type Doc = InstanceType<typeof PDFDocument>;

function buildPdf(data: Category[]): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    // Copia de los márgenes: el loop de header/footer muta page.margins, y si
    // pasáramos el objeto M de módulo, la mutación se filtraría a la siguiente
    // petición (el contenido arrancaría en y=0 y se montaría con el encabezado).
    const doc = new PDFDocument({ size: 'LETTER', bufferPages: true, margins: { ...M }, autoFirstPage: false });
    const chunks: Buffer[] = [];
    doc.on('data', (c: Buffer) => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const logo = Buffer.from(BRAND_LOGO_FULL_PNG_BASE64, 'base64');
    const { categories, items } = manualStats(data);

    const B = 'Helvetica-Bold', R = 'Helvetica', I = 'Helvetica-Oblique';
    const center = (w: number) => M.left + (CONTENT_W - w) / 2;

    // ── Página 1: PORTADA ──────────────────────────────────────────────────────
    doc.addPage();
    const logoW = 300, logoH = logoW / LOGO_RATIO;
    doc.image(logo, center(logoW), 120, { width: logoW });
    let y = 120 + logoH + 46;
    doc.font(B).fontSize(30).fillColor(GREEN).text('Manual de Operaciones', M.left, y, { width: CONTENT_W, align: 'center' });
    y = doc.y + 6;
    doc.font(R).fontSize(14).fillColor(DARK).text('Instructivo general de procedimientos', M.left, y, { width: CONTENT_W, align: 'center' });
    y = doc.y + 18;
    doc.font(B).fontSize(10).fillColor(GOLD).text('S P E C I A L T Y   C O F F E E', M.left, y, { width: CONTENT_W, align: 'center', characterSpacing: 2 });
    y = doc.y + 8;
    doc.moveTo(center(220), y).lineTo(center(220) + 220, y).lineWidth(2).strokeColor(GOLD).stroke();
    y += 34;
    doc.font(B).fontSize(13).fillColor(GREEN).text(`${BIZ.name}  ·  ${BIZ.tagline}`, M.left, y, { width: CONTENT_W, align: 'center' });
    y = doc.y + 4;
    doc.font(R).fontSize(9).fillColor(GREY).text(BIZ.address, M.left, y, { width: CONTENT_W, align: 'center' });
    y = doc.y + 24;
    doc.font(R).fontSize(10).fillColor(DARK).text(`Responsable: ${BIZ.responsable}`, M.left, y, { width: CONTENT_W, align: 'center' });
    y = doc.y + 3;
    doc.font(R).fontSize(10).fillColor(GREY)
      .text(`Área: ${BIZ.area}     ·     Código: ${BIZ.code}`, M.left, y, { width: CONTENT_W, align: 'center' });
    y = doc.y + 3;
    doc.text(`Generado el ${todayStr()}   ·   ${categories} categorías · ${items} ítems`, M.left, y, { width: CONTENT_W, align: 'center' });

    // ── Página 2: reservada para el ÍNDICE (se rellena al final) ───────────────
    doc.addPage();
    const indexPageIndex = doc.bufferedPageRange().count - 1;

    // ── Contenido ───────────────────────────────────────────────────────────────
    const tocEntries: { name: string; page: number }[] = [];

    const ensure = (h: number) => {
      if (doc.y + h > BOTTOM_Y) doc.addPage();
    };
    const subTitle = (t: string) => {
      ensure(28);
      doc.font(B).fontSize(8).fillColor(GOLD).text(t.toUpperCase(), M.left, doc.y + 8, { width: CONTENT_W, characterSpacing: 1.5 });
      doc.moveDown(0.2);
    };
    const listItem = (prefix: string, text: string, indent: number) => {
      ensure(20);
      const x = M.left + indent;
      const py = doc.y;
      doc.font(B).fontSize(10.5).fillColor(GREEN).text(prefix, x, py, { width: 22, continued: false });
      doc.font(R).fontSize(10.5).fillColor(DARK).text(text, x + 22, py, { width: CONTENT_W - indent - 22, align: 'justify' });
      doc.moveDown(0.15);
    };
    // Ingredientes como tabla de 3 columnas: Ingrediente | Cant. | Unidad
    const QTY_W = 70, UNIT_W = 78;
    const NAME_W = CONTENT_W - QTY_W - UNIT_W;
    const COLS = [
      { x: M.left, w: NAME_W },
      { x: M.left + NAME_W, w: QTY_W },
      { x: M.left + NAME_W + QTY_W, w: UNIT_W },
    ];
    const ING_BORDER = '#D9D6D1';
    const drawRow = (cells: string[], h: number, top: number, opts: { head?: boolean; zebra?: boolean }) => {
      cells.forEach((txt, c) => {
        const col = COLS[c];
        if (opts.head) { doc.rect(col.x, top, col.w, h).fill(GREEN); }
        else if (opts.zebra) { doc.rect(col.x, top, col.w, h).fill(GREEN_SOFT); }
        doc.rect(col.x, top, col.w, h).lineWidth(0.6).strokeColor(ING_BORDER).stroke();
        const pad = 8;
        const align = c === 0 ? 'left' : 'center';
        if (opts.head) {
          doc.font(B).fontSize(8).fillColor('#FFFFFF').text(txt, col.x + pad, top + (h - 9) / 2, { width: col.w - 2 * pad, align, characterSpacing: 0.8, lineBreak: false });
        } else {
          const color = c === 0 ? GREEN : (c === 2 ? GREY : DARK);
          const fnt = c === 0 ? B : R;
          const th = doc.font(fnt).fontSize(9.5).heightOfString(txt || ' ', { width: col.w - 2 * pad });
          doc.font(fnt).fontSize(9.5).fillColor(color).text(txt, col.x + pad, top + (h - th) / 2, { width: col.w - 2 * pad, align });
        }
      });
    };
    const ingredientsTable = (ings: string[]) => {
      const pad = 8;
      // cabecera
      ensure(40);
      let top = doc.y;
      drawRow(['INGREDIENTE', 'CANT.', 'UNIDAD'], 18, top, { head: true });
      doc.y = top + 18;
      ings.forEach((ing, idx) => {
        const p = parseIngredient(ing);
        const nameH = doc.font(B).fontSize(9.5).heightOfString(p.name, { width: NAME_W - 2 * pad });
        const h = Math.max(20, nameH + 10);
        ensure(h + 2);
        top = doc.y;
        drawRow([p.name, p.qty, p.unit], h, top, { zebra: idx % 2 === 1 });
        doc.y = top + h;
      });
    };

    data.forEach((cat) => {
      doc.addPage();
      tocEntries.push({ name: stripEmoji(cat.name), page: doc.bufferedPageRange().count }); // 1-based display

      // Banner verde a todo el ancho
      const by = doc.y;
      doc.rect(M.left, by, CONTENT_W, 34).fill(GREEN);
      doc.font(B).fontSize(16).fillColor(WHITE).text(stripEmoji(cat.name), M.left + 14, by + 9, { width: CONTENT_W - 28 });
      doc.y = by + 34 + 16;

      if (cat.items.length === 0) {
        doc.font(I).fontSize(10.5).fillColor(GREY).text('Sin elementos en esta categoría.', M.left, doc.y);
      }

      cat.items.forEach((item) => {
        ensure(70);
        const hy = doc.y + 10;
        doc.font(B).fontSize(12.5).fillColor(GREEN).text(item.name, M.left, hy, { width: CONTENT_W - 70 });
        const price = fmtPrice(item.price);
        if (price) doc.font(B).fontSize(12.5).fillColor(GOLD).text(price, M.left, hy, { width: CONTENT_W, align: 'right' });
        // regla inferior
        const ry = doc.y + 3;
        doc.moveTo(M.left, ry).lineTo(M.left + CONTENT_W, ry).lineWidth(0.8).strokeColor(RULE).stroke();
        doc.y = ry + 6;
        // etiqueta de tipo
        doc.font(B).fontSize(7.5).fillColor(GREY).text(TYPE_LABEL[item.type], M.left, doc.y, { characterSpacing: 1.2 });
        doc.moveDown(0.3);

        if (item.description) {
          doc.font(R).fontSize(10.5).fillColor(DARK).text(item.description, M.left, doc.y, { width: CONTENT_W, align: 'justify' });
        }
        if (item.ingredients?.length) {
          subTitle('Ingredientes');
          doc.moveDown(0.2);
          ingredientsTable(item.ingredients);
          doc.moveDown(0.3);
        }
        if (item.steps?.length) {
          subTitle('Preparación');
          item.steps.forEach((s, i) => listItem(`${i + 1}.`, s, 8));
        }
        if (item.notes?.length) {
          subTitle('Notas');
          item.notes.forEach((nt) => listItem('•', nt, 8));
        }
        doc.moveDown(0.4);
      });
    });

    // ── Rellenar el ÍNDICE en la página reservada ───────────────────────────────
    doc.switchToPage(indexPageIndex);
    doc.font(B).fontSize(26).fillColor(GREEN).text('Contenido', M.left, M.top);
    let iy = doc.y + 6;
    doc.moveTo(M.left, iy).lineTo(M.left + CONTENT_W, iy).lineWidth(1.5).strokeColor(GREEN).stroke();
    iy += 18;
    tocEntries.forEach((e, idx) => {
      const label = `${idx + 1}.  ${e.name}`;
      doc.font(R).fontSize(12).fillColor(DARK).text(label, M.left, iy, { width: CONTENT_W - 40, continued: false });
      doc.font(R).fontSize(12).fillColor(GREY).text(String(e.page), M.left, iy, { width: CONTENT_W, align: 'right' });
      // línea de puntos guía
      iy = doc.y + 8;
    });

    // ── Header + Footer en todas las páginas excepto la portada ─────────────────
    // Dibujar en los márgenes sin que pdfkit pagine: anulamos los márgenes
    // sup/inf de cada página mientras escribimos cabecera y pie.
    const range = doc.bufferedPageRange();
    const total = range.count;
    for (let p = range.start; p < range.start + total; p++) {
      doc.switchToPage(p);
      if (p === 0) continue; // portada sin header/footer
      doc.page.margins.top = 0;
      doc.page.margins.bottom = 0;
      // Header
      doc.font(B).fontSize(8).fillColor(GREEN).text(BIZ.name.toUpperCase(), M.left, 40, { lineBreak: false, continued: true })
        .font(R).fillColor(GREY).text('   ·   Instructivo General de Procedimientos', { lineBreak: false, continued: false });
      doc.font(B).fontSize(8).fillColor(GREEN).text(BIZ.code, M.left, 40, { width: CONTENT_W, align: 'right', lineBreak: false });
      doc.font(R).fontSize(7.5).fillColor(GREY).text(BIZ.area, M.left, 52, { lineBreak: false });
      doc.text(`Fecha: ${todayStr()}`, M.left, 52, { width: CONTENT_W, align: 'right', lineBreak: false });
      doc.moveTo(M.left, 66).lineTo(M.left + CONTENT_W, 66).lineWidth(1).strokeColor(GREEN).stroke();
      // Footer
      doc.moveTo(M.left, BOTTOM_Y + 14).lineTo(M.left + CONTENT_W, BOTTOM_Y + 14).lineWidth(0.8).strokeColor(RULE).stroke();
      doc.font(R).fontSize(7.5).fillColor(GREY).text(`${BIZ.name} — ${BIZ.tagline}`, M.left, BOTTOM_Y + 20, { lineBreak: false });
      doc.font(R).fontSize(7.5).fillColor(GREY).text(`Página ${p + 1} de ${total}`, M.left, BOTTOM_Y + 20, { width: CONTENT_W, align: 'right', lineBreak: false });
    }

    doc.end();
  });
}

export async function GET() {
  const store = await cookies();
  const session = await verifySessionToken(store.get(SESSION_COOKIE)?.value);
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  const data = await loadManualData();
  const buffer = await buildPdf(data);
  const today = new Date().toISOString().slice(0, 10);

  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="Manual-Coffee-Time-${today}.pdf"`,
      'Cache-Control': 'no-store',
    },
  });
}
