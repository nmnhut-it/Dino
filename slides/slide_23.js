/**
 * Slide 23: Evolution Timeline
 */

const {
  C, FONT, M, CW, W,
  addTitle, addProgress
, SHAPES } = require('./config');

function create(pres) {
  const s = pres.addSlide();
  s.background = { color: C.bg };

  addTitle(s, "Dòng Thời Gian: Vấn Đề → Giải Pháp → Vấn Đề Mới", C.success);

  const timelineY = 2.0;
  const startX = 1.5;
  const spacing = 4;

  // Timeline line
  s.addShape(SHAPES.LINE, {
    x: startX, y: timelineY + 0.8,
    w: 10.5, h: 0,
    line: { color: C.lightGray, width: 3 },
  });

  const versions = [
    { year: "2021", name: "DINOv1", acc: "80.1%", color: C.v1,
      problem: "Làm sao SSL work?", solution: "EMA + Centering + Sharpening" },
    { year: "2023", name: "DINOv2", acc: "86.5%", color: C.v2,
      problem: "Dense tasks yếu", solution: "iBOT + KoLeo + Data curation" },
    { year: "2025", name: "DINOv3", acc: "88.4%", color: C.v3,
      problem: "Scale gây suy giảm", solution: "Gram Anchoring + 7B params" },
  ];

  versions.forEach((v, i) => {
    const x = startX + i * spacing;

    // Year
    s.addText(v.year, {
      x, y: timelineY - 0.3, w: 1.5, h: 0.4,
      fontFace: FONT, fontSize: 14, color: C.medGray,
    });

    // Circle
    s.addShape(SHAPES.OVAL, {
      x: x + 0.3, y: timelineY + 0.6, w: 0.4, h: 0.4,
      fill: { color: v.color },
    });

    // Box
    s.addShape(SHAPES.RECTANGLE, {
      x, y: timelineY + 1.2, w: 3.5, h: 2.6,
      fill: { color: C.bg },
      line: { color: v.color, pt: 2 },
    });

    s.addText(v.name, {
      x: x + 0.1, y: timelineY + 1.3, w: 3.3, h: 0.4,
      fontFace: FONT, fontSize: 18, bold: true, color: v.color,
    });
    s.addText(v.acc, {
      x: x + 0.1, y: timelineY + 1.7, w: 3.3, h: 0.3,
      fontFace: FONT, fontSize: 14, color: C.medGray,
    });

    s.addText("Vấn đề:", {
      x: x + 0.1, y: timelineY + 2.1, w: 3.3, h: 0.3,
      fontFace: FONT, fontSize: 12, bold: true, color: C.accent,
    });
    s.addText(v.problem, {
      x: x + 0.1, y: timelineY + 2.4, w: 3.3, h: 0.5,
      fontFace: FONT, fontSize: 12, color: C.black,
    });

    s.addText("Giải pháp:", {
      x: x + 0.1, y: timelineY + 2.9, w: 3.3, h: 0.3,
      fontFace: FONT, fontSize: 12, bold: true, color: C.success,
    });
    s.addText(v.solution, {
      x: x + 0.1, y: timelineY + 3.2, w: 3.3, h: 0.5,
      fontFace: FONT, fontSize: 12, color: C.black,
    });
  });

  // Pattern
  s.addText("Mẫu hình: Tìm vấn đề → Giải quyết → Tìm vấn đề mới → Lặp lại", {
    x: M, y: 6.0, w: CW, h: 0.4,
    fontFace: FONT, fontSize: 18, italic: true, color: C.gray, align: "center",
  });

  addProgress(s, 5);

  s.addNotes(`[TIMELINE]

Evolution pattern rõ ràng:

v1 (2021): Làm sao SSL work?
→ EMA + Centering + Sharpening
→ 80.1% ImageNet (SOTA SSL)

v2 (2023): Dense tasks yếu
→ iBOT + KoLeo + Data curation
→ 86.5% ImageNet, Foundation Model

v3 (2025): Scale gây degradation
→ Gram Anchoring
→ 88.4% ImageNet, SOTA everywhere

Pattern này là cách research hoạt động:
Giải quyết vấn đề → Phát hiện vấn đề mới → Lặp lại.`);

  return s;
}

module.exports = { create };
