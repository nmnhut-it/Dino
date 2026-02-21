/**
 * Slide 10: Anti-Collapse - Centering + Sharpening
 */

const {
  C, FONT, M, CW,
  addTitle, addProgress, addFormula
, SHAPES } = require('./config');

function create(pres) {
  const s = pres.addSlide();
  s.background = { color: C.bg };

  addTitle(s, "Anti-Collapse", C.v1);

  // Two columns
  // Centering
  s.addShape(SHAPES.RECTANGLE, {
    x: M, y: 1.4, w: 5.9, h: 3.2,
    fill: { color: "F5F5F5" },
    line: { color: C.v1, pt: 1 },
  });

  s.addText("Centering", {
    x: M + 0.2, y: 1.6, w: 5.5, h: 0.5,
    fontFace: FONT, fontSize: 22, bold: true, color: C.v1,
  });

  s.addText("output ← output - c", {
    x: M + 0.2, y: 2.2, w: 5.5, h: 0.4,
    fontFace: "Consolas", fontSize: 18, color: C.black,
  });

  s.addText("c = trung bình batch\n\n→ Ngăn mode collapse\n(1 dim không thể dominate)", {
    x: M + 0.2, y: 2.7, w: 5.5, h: 1.8,
    fontFace: FONT, fontSize: 18, color: C.black,
  });

  // Sharpening
  s.addShape(SHAPES.RECTANGLE, {
    x: 6.9, y: 1.4, w: 5.9, h: 3.2,
    fill: { color: "F5F5F5" },
    line: { color: C.v1, pt: 1 },
  });

  s.addText("Sharpening", {
    x: 7.1, y: 1.6, w: 5.5, h: 0.5,
    fontFace: FONT, fontSize: 22, bold: true, color: C.v1,
  });

  s.addText("τ_teacher = 0.04 (nhọn)", {
    x: 7.1, y: 2.2, w: 5.5, h: 0.4,
    fontFace: "Consolas", fontSize: 18, color: C.black,
  });

  s.addText("τ_student = 0.1 (mềm)\n\n→ Ngăn uniform collapse\n(output phải có peak)", {
    x: 7.1, y: 2.7, w: 5.5, h: 1.8,
    fontFace: FONT, fontSize: 18, color: C.black,
  });

  // Balance
  s.addShape(SHAPES.RECTANGLE, {
    x: M, y: 5.0, w: CW, h: 1.2,
    fill: { color: "E8F5E9" },
    line: { color: C.success, pt: 2 },
  });

  s.addText("Centering + Sharpening = Cân bằng hoàn hảo!", {
    x: M + 0.2, y: 5.3, w: CW - 0.4, h: 0.6,
    fontFace: FONT, fontSize: 24, bold: true, color: C.success, align: "center",
  });

  addProgress(s, 2);

  s.addNotes(`2 kỹ thuật chống collapse:

CENTERING:
- Trừ đi trung bình của Teacher outputs
- c ← m·c + (1-m)·mean(batch)
- Ngăn 1 dimension dominate → anti mode collapse

SHARPENING:
- Temperature thấp → phân bố nhọn
- Teacher: τ = 0.04 (rất nhọn, tự tin)
- Student: τ = 0.1 (mềm hơn, dễ học)
- Ngăn output trải đều → anti uniform collapse

KEY INSIGHT:
- Centering → khuyến khích uniform (để cân bằng)
- Sharpening → khuyến khích peaked (để có meaning)
- Hai cái CÂN BẰNG nhau → training ổn định!`);

  return s;
}

module.exports = { create };
