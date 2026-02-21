/**
 * Slide 24: Thank You + References
 */

const {
  C, FONT, M, CW,
  addProgress
} = require('./config');

function create(pres) {
  const s = pres.addSlide();
  s.background = { color: C.cream };

  // Thank you
  s.addText("Cảm Ơn!", {
    x: M, y: 1.8, w: CW, h: 1,
    fontFace: FONT, fontSize: 56, bold: true, color: C.success, align: "center",
  });

  // Key message
  s.addText("\"Không cần labels, cần ĐÚNG learning signal\"", {
    x: M, y: 3.0, w: CW, h: 0.6,
    fontFace: FONT, fontSize: 24, italic: true, color: C.gray, align: "center",
  });

  // References
  s.addText("Tài liệu:", {
    x: M, y: 4.2, w: CW, h: 0.4,
    fontFace: FONT, fontSize: 18, bold: true, color: C.black,
  });

  s.addText("• v1: Caron et al., ICCV 2021\n• v2: Oquab et al., TMLR 2024\n• v3: Darcet et al., arXiv 2025\n• Code: github.com/facebookresearch/dinov2", {
    x: M, y: 4.6, w: CW, h: 1.5,
    fontFace: FONT, fontSize: 16, color: C.gray,
  });

  addProgress(s, 5);

  s.addNotes(`Cảm ơn đã lắng nghe!

Key message: DINO chứng minh không cần labels, cần đúng learning signal.

References:
- v1: Caron et al., "Emerging Properties in Self-Supervised Vision Transformers", ICCV 2021
- v2: Oquab et al., "DINOv2: Learning Robust Visual Features", TMLR 2024
- v3: Darcet et al., arXiv 2025

Code available: github.com/facebookresearch/dinov2

Questions?`);

  return s;
}

module.exports = { create };
