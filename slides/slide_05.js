/**
 * Slide 5: Loss Function
 */

const {
  C, FONT, M, CW,
  addTitle, addProgress, addFormula, addBullets
} = require('./config');

function create(pres) {
  const s = pres.addSlide();
  s.background = { color: C.bg };

  addTitle(s, "Hàm Loss - Đo Sự Khác Biệt", C.v1);

  // Loss chính
  s.addText("Cross-Entropy Loss:", {
    x: M, y: 1.2, w: CW, h: 0.4,
    fontFace: FONT, fontSize: 20, bold: true, color: C.v1,
  });

  addFormula(s, "L = -Σₖ Pₜ(x)[k] · log Pₛ(x')[k]", M, 1.6, CW, 0.8, C.v1);

  // Student
  s.addText("Xác suất của Student:", {
    x: M, y: 2.6, w: 6, h: 0.4,
    fontFace: FONT, fontSize: 18, bold: true, color: C.black,
  });
  addFormula(s, "Pₛ(x)[k] = exp(gθₛ(x)[k] / τₛ) / Σₖ' exp(...)\n\nτₛ = 0.1 (nhiệt độ Student)", M, 3.0, 6.2, 1.3, C.v1);

  // Teacher
  s.addText("Xác suất của Teacher:", {
    x: 6.8, y: 2.6, w: 6, h: 0.4,
    fontFace: FONT, fontSize: 18, bold: true, color: C.black,
  });
  addFormula(s, "Pₜ(x)[k] = exp((gθₜ(x)[k] - c[k]) / τₜ) / Σₖ'...\n\nτₜ = 0.04, c = centering", 6.8, 3.0, 6, 1.5, C.v1);

  // Giải thích
  s.addText("Hiểu đơn giản:", {
    x: M, y: 4.8, w: CW, h: 0.4,
    fontFace: FONT, fontSize: 18, bold: true, color: C.black,
  });
  addBullets(s, [
    "Cross-entropy đo: 2 phân phối khác nhau bao nhiêu",
    "Minimize loss → Student tiến gần Teacher",
    "Teacher là \"đáp án\", Student là \"bài làm\"",
  ], M, 5.2, CW, 1.5, 18);

  addProgress(s, 2);

  s.addNotes(`[LOSS FUNCTION]

Loss dùng cross-entropy - đo sự khác biệt giữa 2 phân phối xác suất.

Student dùng softmax chuẩn với temperature τ_s = 0.1.
Teacher dùng softmax với centering (trừ c) và temperature τ_t = 0.04.

Tại sao temperature khác nhau? Slide sau sẽ giải thích.
Tại sao có centering? Cũng slide sau.

Hiểu đơn giản:
- Teacher cho "đáp án" - phân phối xác suất trên K categories
- Student phải học để output giống vậy
- K = 65,536 có thể hiểu như số "loại" ẩn mà model học

Minimize loss = Student càng giống Teacher.`);

  return s;
}

module.exports = { create };
