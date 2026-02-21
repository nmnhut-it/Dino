/**
 * Slide 1: Title + Giới thiệu
 */

const {
  C, FONT, M, CW,
  addProgress
} = require('./config');

function create(pres) {
  const s = pres.addSlide();
  s.background = { color: C.bg };

  // Title lớn ở giữa
  s.addText("DINO", {
    x: M, y: 2.0, w: CW, h: 1.2,
    fontFace: FONT, fontSize: 72, bold: true, color: C.green,
    align: "center",
  });

  s.addText("Self-Supervised Vision Learning", {
    x: M, y: 3.2, w: CW, h: 0.6,
    fontFace: FONT, fontSize: 28, color: C.gray,
    align: "center",
  });

  // Tagline
  s.addText("\"Train model nhìn ảnh mà không cần nhãn\"", {
    x: M, y: 4.2, w: CW, h: 0.5,
    fontFace: FONT, fontSize: 22, italic: true, color: C.accent,
    align: "center",
  });

  // Meta info
  s.addText("Meta AI • 2021-2025 • v1 → v2 → v3", {
    x: M, y: 5.5, w: CW, h: 0.4,
    fontFace: FONT, fontSize: 16, color: C.medGray,
    align: "center",
  });

  addProgress(s, 1);

  s.addNotes(`Xin chào mọi người. Hôm nay mình sẽ nói về DINO - một chuỗi nghiên cứu của Meta AI.

DINO = self-DIstillation with NO labels.

Ý tưởng chính: train model nhìn ảnh mà KHÔNG cần người gán nhãn.

Có 3 phiên bản: v1 (2021), v2 (2023), v3 (2025). Mỗi version giải quyết một vấn đề mới.`);

  return s;
}

module.exports = { create };
