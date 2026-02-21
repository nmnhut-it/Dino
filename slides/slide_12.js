/**
 * Slide 12: Kết Quả v1 - DINOv1 Results
 * Updated: Corrected numbers from Table 2 of paper
 */

const {
  C, FONT, M, CW,
  addTitle, addProgress
, SHAPES } = require('./config');

function create(pres) {
  const s = pres.addSlide();
  s.background = { color: C.bg };

  addTitle(s, "Kết Quả v1", C.v1);

  // Left: Big numbers
  s.addText("80.1%", {
    x: M, y: 1.3, w: 3.5, h: 0.9,
    fontFace: FONT, fontSize: 60, bold: true, color: C.v1,
  });

  s.addText("Linear probe", {
    x: M, y: 2.15, w: 3.5, h: 0.4,
    fontFace: FONT, fontSize: 16, color: C.gray,
  });

  s.addText("77.4%", {
    x: M, y: 2.6, w: 3.5, h: 0.7,
    fontFace: FONT, fontSize: 44, bold: true, color: C.v1,
  });

  s.addText("k-NN (không cần train!)", {
    x: M, y: 3.25, w: 3.5, h: 0.4,
    fontFace: FONT, fontSize: 16, color: C.gray,
  });

  s.addText("ViT-B/8 · ImageNet · 0 labels", {
    x: M, y: 3.75, w: 3.5, h: 0.4,
    fontFace: FONT, fontSize: 14, italic: true, color: C.medGray,
  });

  // Right: Comparison table
  s.addShape(SHAPES.RECTANGLE, {
    x: 4.3, y: 1.2, w: 8.5, h: 2.9,
    fill: { color: "F5F5F5" },
    line: { color: C.v1, pt: 1 },
  });

  s.addText("So sánh với các phương pháp khác (Table 2):", {
    x: 4.5, y: 1.35, w: 8.1, h: 0.4,
    fontFace: FONT, fontSize: 16, bold: true, color: C.v1,
  });

  // Results table
  const resultsData = [
    [{ text: "Method", options: { fill: { color: C.v1 }, color: "FFFFFF", bold: true } },
     { text: "Arch", options: { fill: { color: C.v1 }, color: "FFFFFF", bold: true } },
     { text: "Linear", options: { fill: { color: C.v1 }, color: "FFFFFF", bold: true } },
     { text: "k-NN", options: { fill: { color: C.v1 }, color: "FFFFFF", bold: true } }],
    [{ text: "DINO", options: { fill: { color: "E8F5E9" }, bold: true } },
     { text: "ViT-B/8", options: { fill: { color: "E8F5E9" } } },
     { text: "80.1%", options: { fill: { color: "E8F5E9" }, color: C.success, bold: true } },
     { text: "77.4%", options: { fill: { color: "E8F5E9" }, color: C.success, bold: true } }],
    [{ text: "Supervised", options: { fill: { color: "FFFFFF" } } },
     { text: "RN50", options: { fill: { color: "FFFFFF" } } },
     { text: "79.3%", options: { fill: { color: "FFFFFF" } } },
     { text: "79.3%", options: { fill: { color: "FFFFFF" } } }],
    [{ text: "SwAV", options: { fill: { color: "F5F5F5" } } },
     { text: "RN50", options: { fill: { color: "F5F5F5" } } },
     { text: "75.3%", options: { fill: { color: "F5F5F5" } } },
     { text: "65.7%", options: { fill: { color: "F5F5F5" } } }],
    [{ text: "BYOL", options: { fill: { color: "FFFFFF" } } },
     { text: "RN50", options: { fill: { color: "FFFFFF" } } },
     { text: "74.4%", options: { fill: { color: "FFFFFF" } } },
     { text: "64.8%", options: { fill: { color: "FFFFFF" } } }],
  ];

  s.addTable(resultsData, {
    x: 4.5, y: 1.85, w: 8.1,
    fontFace: FONT, fontSize: 14,
    border: { pt: 0.5, color: C.lightGray },
  });

  // Key insight box
  s.addShape(SHAPES.RECTANGLE, {
    x: M, y: 4.4, w: CW, h: 1.1,
    fill: { color: "E3F2FD" },
    line: { color: C.v1, pt: 2 },
  });

  s.addText("Key insight: k-NN gần bằng Linear → features tự nhiên tốt, không cần train classifier!", {
    x: M + 0.3, y: 4.6, w: CW - 0.6, h: 0.7,
    fontFace: FONT, fontSize: 18, bold: true, color: C.v1, align: "center",
  });

  // Limitations teaser
  s.addText("Hạn chế: chỉ ImageNet (1.28M), chỉ classification, 1 loss → v2 giải quyết", {
    x: M, y: 5.7, w: CW, h: 0.5,
    fontFace: FONT, fontSize: 16, italic: true, color: C.gray, align: "center",
  });

  // Source
  s.addText("Source: Caron et al. ICCV 2021, Table 2", {
    x: M, y: 6.3, w: CW, h: 0.3,
    fontFace: FONT, fontSize: 11, italic: true, color: C.medGray,
  });

  addProgress(s, 2);

  s.addNotes(`DINOv1 Results - SỐ LIỆU TỪ TABLE 2:

DINO ViT-B/8:
- Linear probe: 80.1% (SOTA cho SSL)
- k-NN: 77.4% (không cần train classifier!)

So sánh cùng architecture (ViT-S):
- DINO: 77.0% linear, 74.5% k-NN
- BYOL*: 71.4% linear, 66.6% k-NN (+5.6% / +7.9%)
- MoCov2*: 72.7% linear, 64.4% k-NN
- SwAV*: 73.5% linear, 66.3% k-NN

KEY INSIGHT:
- DINO's k-NN gần bằng Linear (gap ~3%)
- Các SSL methods khác: gap lớn hơn nhiều (8-10%)
- Nghĩa là DINO features tự nhiên tốt, không cần train thêm

So với Supervised:
- Supervised RN50: 79.3% (cần 14M labels)
- Supervised ViT-S: 79.8%
- DINO ViT-B/8: 80.1% (0 labels!) → vượt supervised!

Emerging properties (sẽ nói slide tiếp):
- Attention heads tự segment objects
- Không cần segmentation labels

Source: Caron et al. ICCV 2021, Table 2`);

  return s;
}

module.exports = { create };
