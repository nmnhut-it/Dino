/**
 * Slide 9: Sharpening
 */

const {
  C, FONT, M, CW,
  addTitle, addProgress, addFormula, addPlaceholder, addTable
, SHAPES } = require('./config');

function create(pres) {
  const s = pres.addSlide();
  s.background = { color: C.bg };

  addTitle(s, "Trick 3: Sharpening - Làm Phân Bố Nhọn Hơn", C.v1);

  // Minh họa
  addPlaceholder(s, M, 1.3, 6, 3,
    "τ=1.0: phân bố phẳng | τ=0.1: hơi nhọn | τ=0.04: rất nhọn", C.v1);

  // Công thức
  s.addText("Temperature trong Softmax:", {
    x: 7, y: 1.3, w: 5.8, h: 0.4,
    fontFace: FONT, fontSize: 18, bold: true, color: C.black,
  });
  addFormula(s, "P[k] = exp(z[k]/τ) / Σₖ' exp(z[k']/τ)\n\nτ → 0: one-hot (1 đỉnh)\nτ → ∞: uniform (đều)", 7, 1.7, 5.8, 1.6, C.v1);

  // DINO choice
  s.addText("DINO chọn:", {
    x: 7, y: 3.6, w: 5.8, h: 0.4,
    fontFace: FONT, fontSize: 18, bold: true, color: C.v1,
  });

  addTable(s,
    ["Mạng", "τ", "Nghĩa là"],
    [
      ["Teacher", "0.04", "Rất nhọn, tự tin"],
      ["Student", "0.1", "Mềm hơn, dễ học"],
    ],
    7, 4.0, 5.8
  );

  // Cân bằng
  s.addShape(SHAPES.RECTANGLE, {
    x: M, y: 4.8, w: CW, h: 1.5,
    fill: { color: C.cream },
  });
  s.addText("Centering + Sharpening = Cân Bằng:", {
    x: M + 0.2, y: 4.9, w: CW - 0.4, h: 0.4,
    fontFace: FONT, fontSize: 18, bold: true, color: C.success,
  });
  s.addText("• Centering một mình → uniform collapse (trải đều)\n• Sharpening một mình → mode collapse (1 đỉnh)\n• KẾT HỢP → cân bằng, training ổn định!", {
    x: M + 0.2, y: 5.3, w: CW - 0.4, h: 1,
    fontFace: FONT, fontSize: 16, color: C.black,
  });

  addProgress(s, 2);

  s.addNotes(`[SHARPENING]

Temperature τ kiểm soát độ "nhọn" của softmax:
- τ thấp → phân bố nhọn, 1 category chiếm gần hết
- τ cao → phân bố phẳng, các categories đều nhau

DINO dùng:
- Teacher: τ = 0.04 (rất nhọn, tự tin)
- Student: τ = 0.1 (mềm hơn, dễ học)

Tại sao Teacher nhọn hơn?
- Ngăn uniform collapse - không để output trải đều
- Student được phép "mềm" hơn vì học từ target quá nhọn sẽ khó

KEY INSIGHT:
- Centering khuyến khích uniform (trải đều)
- Sharpening khuyến khích peaked (nhọn)
- Hai cái CÂN BẰNG nhau → training ổn định!`);

  return s;
}

module.exports = { create };
