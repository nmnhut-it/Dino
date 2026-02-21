/**
 * Slide 14: iBOT Loss
 */

const {
  C, FONT, M, CW,
  addTitle, addProgress, addPlaceholder
, SHAPES } = require('./config');

function create(pres) {
  const s = pres.addSlide();
  s.background = { color: C.bg };

  addTitle(s, "iBOT: Che → Đoán Ý Nghĩa", C.v2);

  // Visual
  addPlaceholder(s, M, 1.4, CW, 2.5,
    "[Student: ảnh bị che patches] ← [Teacher: ảnh đầy đủ]", C.v2);

  // Key difference
  s.addShape(SHAPES.RECTANGLE, {
    x: M, y: 4.2, w: 5.5, h: 1.8,
    fill: { color: C.cream },
  });

  s.addText("Khác MAE:", {
    x: M + 0.2, y: 4.4, w: 5, h: 0.4,
    fontFace: FONT, fontSize: 18, bold: true, color: C.v2,
  });

  s.addText("MAE đoán pixels\niBOT đoán semantic tokens\n\n→ High-level meaning!", {
    x: M + 0.2, y: 4.8, w: 5, h: 1.2,
    fontFace: FONT, fontSize: 18, color: C.black,
  });

  // Why it matters
  s.addShape(SHAPES.RECTANGLE, {
    x: 7, y: 4.2, w: 5.8, h: 1.8,
    fill: { color: "E8F5E9" },
  });

  s.addText("Tại sao quan trọng:", {
    x: 7.2, y: 4.4, w: 5.4, h: 0.4,
    fontFace: FONT, fontSize: 18, bold: true, color: C.success,
  });

  s.addText("Học patch-level features\n→ Tốt cho segmentation, depth\n\nBỏ iBOT: -2.9 mIoU", {
    x: 7.2, y: 4.8, w: 5.4, h: 1.2,
    fontFace: FONT, fontSize: 18, color: C.black,
  });

  addProgress(s, 3);

  s.addNotes(`iBOT = image BERT.

Ý tưởng:
- Che một số patches
- Student đoán semantic token (không phải pixel)

Khác MAE:
- MAE: đoán "pixel này màu gì"
- iBOT: đoán "đây là phần gì của object"

Kết quả:
- Frozen iBOT features tốt như fine-tuned MAE
- Bỏ iBOT: mất 2.9 mIoU trên segmentation`);

  return s;
}

module.exports = { create };
