/**
 * Slide 9: Collapse - The Problem
 */

const {
  C, FONT, M, CW,
  addTitle, addProgress, addPlaceholder
, SHAPES } = require('./config');

function create(pres) {
  const s = pres.addSlide();
  s.background = { color: C.bg };

  addTitle(s, "Collapse", C.accent);

  // Visual illustration
  addPlaceholder(s, M, 1.4, 5.5, 2.8,
    "[Mọi ảnh khác nhau → cùng 1 output vector]", C.accent);

  // Explanation box
  s.addShape(SHAPES.RECTANGLE, {
    x: 7, y: 1.4, w: 5.8, h: 2.8,
    fill: { color: "FFF5F5" },
    line: { color: C.accent, pt: 2 },
  });

  s.addText("Nếu không cẩn thận:", {
    x: 7.2, y: 1.6, w: 5.4, h: 0.5,
    fontFace: FONT, fontSize: 20, bold: true, color: C.accent,
  });

  s.addText("Ảnh mèo → [0.5, 0.5, ...]\nẢnh chó → [0.5, 0.5, ...]\nẢnh xe  → [0.5, 0.5, ...]\n\nLoss = 0 nhưng vô nghĩa!", {
    x: 7.2, y: 2.1, w: 5.4, h: 2,
    fontFace: FONT, fontSize: 18, color: C.black,
  });

  // Two types
  s.addText("2 loại collapse:", {
    x: M, y: 4.6, w: CW, h: 0.5,
    fontFace: FONT, fontSize: 20, bold: true, color: C.black,
  });

  s.addText("• Mode collapse: mọi output giống nhau\n• Uniform collapse: output trải đều (không có peak)", {
    x: M, y: 5.1, w: CW, h: 1,
    fontFace: FONT, fontSize: 20, color: C.black,
  });

  addProgress(s, 2);

  s.addNotes(`Collapse là vấn đề LỚN NHẤT của self-supervised learning.

Teacher và Student có thể "thông đồng":
- Cả 2 đều output cùng 1 vector cho mọi ảnh
- Loss = 0, training "thành công"
- Nhưng model không học được gì!

2 loại collapse:
1. Mode collapse: tất cả → 1 vector
2. Uniform collapse: tất cả → uniform distribution

Contrastive learning (SimCLR, MoCo) giải quyết bằng negative samples.
DINO có cách khác - Centering + Sharpening.`);

  return s;
}

module.exports = { create };
