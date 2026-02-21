/**
 * Slide 11: Loss - Final DINO Loss Formula
 */

const {
  C, FONT, M, CW,
  addTitle, addProgress, addFormula
, SHAPES } = require('./config');

function create(pres) {
  const s = pres.addSlide();
  s.background = { color: C.bg };

  addTitle(s, "Loss", C.v1);

  // Main loss formula
  addFormula(s, "L = - Σₖ P_t(x)[k] · log P_s(x')[k]", M, 1.4, CW, 0.8, C.v1);

  // Explanation
  s.addText("Cross-entropy: Student output phải giống Teacher", {
    x: M, y: 2.4, w: CW, h: 0.5,
    fontFace: FONT, fontSize: 20, color: C.gray, align: "center",
  });

  // P_s and P_t formulas
  s.addShape(SHAPES.RECTANGLE, {
    x: M, y: 3.1, w: 6, h: 1.6,
    fill: { color: "F5F5F5" },
    line: { color: C.v1, pt: 1 },
  });

  s.addText("Student:", {
    x: M + 0.2, y: 3.3, w: 2, h: 0.4,
    fontFace: FONT, fontSize: 16, bold: true, color: C.v1,
  });

  s.addText("P_s = softmax(g_s(x') / τ_s)", {
    x: M + 0.2, y: 3.7, w: 5.6, h: 0.4,
    fontFace: "Consolas", fontSize: 16, color: C.black,
  });

  s.addText("τ_s = 0.1", {
    x: M + 0.2, y: 4.2, w: 5.6, h: 0.4,
    fontFace: "Consolas", fontSize: 14, color: C.gray,
  });

  s.addShape(SHAPES.RECTANGLE, {
    x: 6.9, y: 3.1, w: 6, h: 1.6,
    fill: { color: "F5F5F5" },
    line: { color: C.green, pt: 1 },
  });

  s.addText("Teacher:", {
    x: 7.1, y: 3.3, w: 2, h: 0.4,
    fontFace: FONT, fontSize: 16, bold: true, color: C.green,
  });

  s.addText("P_t = softmax((g_t(x) - c) / τ_t)", {
    x: 7.1, y: 3.7, w: 5.6, h: 0.4,
    fontFace: "Consolas", fontSize: 16, color: C.black,
  });

  s.addText("τ_t = 0.04, c = centering", {
    x: 7.1, y: 4.2, w: 5.6, h: 0.4,
    fontFace: "Consolas", fontSize: 14, color: C.gray,
  });

  // Summary
  s.addText("x = global crop (Teacher)    x' = local/global crop (Student)", {
    x: M, y: 5.0, w: CW, h: 0.4,
    fontFace: FONT, fontSize: 16, color: C.gray, align: "center",
  });

  s.addText("K = 65536 dimensions (prototypes)", {
    x: M, y: 5.5, w: CW, h: 0.4,
    fontFace: FONT, fontSize: 18, bold: true, color: C.black, align: "center",
  });

  addProgress(s, 2);

  s.addNotes(`DINO Loss Function:

L = -Σₖ P_t(x)[k] · log P_s(x')[k]

Đây là cross-entropy loss giữa:
- P_t: Teacher probability (target)
- P_s: Student probability (prediction)

Student probability:
P_s[k] = exp(g_s(x')[k] / τ_s) / Σ exp(...)
τ_s = 0.1 (soft)

Teacher probability:
P_t[k] = exp((g_t(x)[k] - c[k]) / τ_t) / Σ exp(...)
τ_t = 0.04 (sharp), c = centering vector

Với multi-crop:
- x = global crop cho Teacher
- x' = tất cả crops cho Student
- Loss = sum over all (x, x') pairs với x ≠ x'`);

  return s;
}

module.exports = { create };
