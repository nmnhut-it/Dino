/**
 * Slide 22: Evolution Summary
 */

const {
  C, FONT, M, CW,
  addTitle, addProgress
, SHAPES } = require('./config');

function create(pres) {
  const s = pres.addSlide();
  s.background = { color: C.bg };

  addTitle(s, "Hành Trình v1 → v2 → v3", C.success);

  // Timeline
  const versions = [
    { name: "v1", year: "2021", acc: "80%", key: "EMA + Centering", color: C.v1 },
    { name: "v2", year: "2023", acc: "86%", key: "3 Losses + Curation", color: C.v2 },
    { name: "v3", year: "2025", acc: "88%", key: "Gram Anchoring", color: C.v3 },
  ];

  // Timeline line
  s.addShape(SHAPES.LINE, {
    x: 1.5, y: 2.8, w: 10.5, h: 0,
    line: { color: C.lightGray, width: 3 },
  });

  versions.forEach((v, i) => {
    const x = 1.5 + i * 4;

    // Circle
    s.addShape(SHAPES.OVAL, {
      x: x + 0.8, y: 2.6, w: 0.4, h: 0.4,
      fill: { color: v.color },
    });

    // Box
    s.addShape(SHAPES.RECTANGLE, {
      x, y: 3.2, w: 3.5, h: 2.5,
      fill: { color: C.bg },
      line: { color: v.color, pt: 2 },
    });

    s.addText(v.name, {
      x: x + 0.1, y: 3.4, w: 3.3, h: 0.5,
      fontFace: FONT, fontSize: 24, bold: true, color: v.color,
    });

    s.addText(v.year, {
      x: x + 0.1, y: 3.9, w: 3.3, h: 0.3,
      fontFace: FONT, fontSize: 14, color: C.gray,
    });

    s.addText(v.acc, {
      x: x + 0.1, y: 4.3, w: 3.3, h: 0.5,
      fontFace: FONT, fontSize: 28, bold: true, color: C.black,
    });

    s.addText(v.key, {
      x: x + 0.1, y: 4.9, w: 3.3, h: 0.6,
      fontFace: FONT, fontSize: 14, color: C.gray,
    });
  });

  // Pattern
  s.addText("Mẫu hình: Vấn đề → Giải pháp → Vấn đề mới → Lặp lại", {
    x: M, y: 6.0, w: CW, h: 0.5,
    fontFace: FONT, fontSize: 18, italic: true, color: C.gray, align: "center",
  });

  addProgress(s, 5);

  s.addNotes(`Hành trình DINO:

v1 (2021): 80%
- Vấn đề: Làm sao SSL work?
- Giải pháp: EMA + Centering + Sharpening

v2 (2023): 86%
- Vấn đề: Dense tasks yếu
- Giải pháp: 3 Losses + Data curation

v3 (2025): 88%
- Vấn đề: Scale gây degradation
- Giải pháp: Gram Anchoring

Pattern nghiên cứu: giải quyết → phát hiện mới → lặp lại.`);

  return s;
}

module.exports = { create };
