/**
 * DINO Seminar - Shared Configuration
 * Design system, colors, fonts, helpers
 */

const pptxgen = require("pptxgenjs");

// Get shapes from pptxgen
const SHAPES = new pptxgen().shapes;

// Color palette
const C = {
  green: "2E7D32",
  accent: "C62828",
  cream: "FFF8E1",
  bg: "FFFFFF",
  black: "212121",
  gray: "424242",
  medGray: "757575",
  lightGray: "BDBDBD",
  success: "388E3C",
  v1: "1565C0",
  v2: "7B1FA2",
  v3: "00695C",
};

// Fonts
const FONT = "Roboto";
const FONT_TITLE = "Roboto";
const FONT_MONO = "Consolas";

// Layout
const W = 13.33;
const H = 7.5;
const M = 0.5;
const CW = W - 2 * M;

// Sections for progress bar
const SECTIONS = [
  "Hook",
  "DINOv1",
  "DINOv2",
  "DINOv3",
  "Tổng hợp"
];

/**
 * Create new presentation instance
 */
function createPresentation() {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE";
  pres.author = "DINO Seminar";
  pres.title = "DINO: Self-Supervised Vision Learning";
  return pres;
}

/**
 * Add title bar
 */
function addTitle(slide, text, color = C.green) {
  slide.addShape(SHAPES.RECTANGLE, {
    x: 0, y: 0, w: W, h: 0.9,
    fill: { color },
  });
  slide.addText(text, {
    x: M, y: 0.15, w: W - 2 * M, h: 0.6,
    fontFace: FONT_TITLE, fontSize: 32, bold: true, italic: true,
    color: "FFFFFF",
  });
}

/**
 * Add subtitle below title
 */
function addSubtitle(slide, text) {
  slide.addText(text, {
    x: M, y: 1.0, w: CW, h: 0.5,
    fontFace: FONT, fontSize: 24, italic: true, color: C.gray,
  });
}

/**
 * Add progress bar
 */
function addProgress(slide, activeSection) {
  const barY = H - 0.35;
  const barH = 0.25;
  const totalW = CW;
  const sectionW = totalW / SECTIONS.length;

  SECTIONS.forEach((name, i) => {
    const isActive = i + 1 === activeSection;
    slide.addShape(SHAPES.RECTANGLE, {
      x: M + i * sectionW, y: barY, w: sectionW - 0.05, h: barH,
      fill: { color: isActive ? C.accent : C.lightGray },
    });
    slide.addText(name, {
      x: M + i * sectionW, y: barY, w: sectionW - 0.05, h: barH,
      fontFace: FONT, fontSize: 10, color: isActive ? "FFFFFF" : C.gray,
      align: "center", valign: "middle",
    });
  });
}

/**
 * Add formula box
 */
function addFormula(slide, text, x, y, w, h, color = C.v1) {
  slide.addShape(SHAPES.RECTANGLE, {
    x, y, w, h,
    fill: { color: "F5F5F5" },
    line: { color, pt: 1 },
  });
  slide.addText(text, {
    x: x + 0.2, y: y + 0.1, w: w - 0.4, h: h - 0.2,
    fontFace: FONT_MONO, fontSize: 16, color: C.black,
  });
}

/**
 * Add placeholder for images
 */
function addPlaceholder(slide, x, y, w, h, label, color = C.gray) {
  slide.addShape(SHAPES.RECTANGLE, {
    x, y, w, h,
    fill: { color: "F0F0F0" },
    line: { color, pt: 2, dashType: "dash" },
  });
  slide.addText(`[${label}]`, {
    x, y, w, h,
    fontFace: FONT, fontSize: 14, color: C.medGray,
    align: "center", valign: "middle",
  });
}

/**
 * Add bullet points
 */
function addBullets(slide, items, x, y, w, h, fontSize = 18) {
  const text = items.map(item => ({ text: item ? `• ${item}\n` : "\n", options: {} }));
  slide.addText(text, {
    x, y, w, h,
    fontFace: FONT, fontSize, color: C.black, valign: "top",
  });
}

/**
 * Add table
 */
function addTable(slide, headers, rows, x, y, w) {
  const headerRow = headers.map(h => ({
    text: h, options: { fill: { color: C.green }, color: "FFFFFF", bold: true, align: "center" }
  }));

  const dataRows = rows.map((row, idx) =>
    row.map(cell => ({
      text: cell,
      options: { fill: { color: idx % 2 === 0 ? "F5F5F5" : "FFFFFF" }, color: C.black }
    }))
  );

  slide.addTable([headerRow, ...dataRows], {
    x, y, w,
    fontFace: FONT, fontSize: 14,
    border: { pt: 0.5, color: C.lightGray },
  });
}

module.exports = {
  C, FONT, FONT_TITLE, FONT_MONO,
  W, H, M, CW, SECTIONS, SHAPES,
  createPresentation,
  addTitle, addSubtitle, addProgress,
  addFormula, addPlaceholder, addBullets, addTable,
};
