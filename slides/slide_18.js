/**
 * Slide 18: Section divider - DINOv3
 */

const {
  C, FONT, M, CW,
  addProgress
} = require('./config');

function create(pres) {
  const s = pres.addSlide();
  s.background = { color: C.cream };

  // Version number
  s.addText("DINOv3", {
    x: M, y: 2.2, w: CW, h: 1,
    fontFace: FONT, fontSize: 64, bold: true, color: C.v3, align: "center",
  });

  s.addText("2025", {
    x: M, y: 3.2, w: CW, h: 0.6,
    fontFace: FONT, fontSize: 24, color: C.gray, align: "center",
  });

  // Key question
  s.addText("Vấn đề: Scale lên 7B → training bất ổn\n\nGiải pháp: Gram Anchoring", {
    x: M, y: 4.2, w: CW, h: 1.5,
    fontFace: FONT, fontSize: 22, color: C.black, align: "center",
  });

  addProgress(s, 4);

  s.addNotes(`Chuyển sang DINOv3 (2025).

Vấn đề mới: scale lên 7B parameters gây bất ổn training.
- Dense features bị degrade sau ~200k iterations
- CLS token dominates, patches mất diversity

Giải pháp: Gram Anchoring
- Giữ correlation structure từ checkpoint tốt
- Ngăn dense feature degradation`);

  return s;
}

module.exports = { create };
