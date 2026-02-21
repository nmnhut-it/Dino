/**
 * Slide 8: EMA - Teacher Update Mechanism
 */

const {
  C, FONT, M, CW,
  addTitle, addProgress, addFormula
, SHAPES } = require('./config');

function create(pres) {
  const s = pres.addSlide();
  s.background = { color: C.bg };

  addTitle(s, "EMA", C.v1);

  // Main formula
  addFormula(s, "θ_t ← 0.996 × θ_t + 0.004 × θ_s", M, 1.5, CW, 0.8, C.v1);

  // Visual explanation
  s.addText("Teacher cập nhật CỰC CHẬM từ Student", {
    x: M, y: 2.6, w: CW, h: 0.6,
    fontFace: FONT, fontSize: 26, bold: true, color: C.black, align: "center",
  });

  // Key insight box
  s.addShape(SHAPES.RECTANGLE, {
    x: M, y: 3.5, w: CW, h: 2.3,
    fill: { color: C.cream },
  });

  s.addText("Tại sao hoạt động?", {
    x: M + 0.3, y: 3.7, w: 5, h: 0.5,
    fontFace: FONT, fontSize: 20, bold: true, color: C.v1,
  });

  s.addText("• Teacher ≠ Student → không \"thông đồng\" được\n• Teacher = trung bình nhiều versions → ổn định\n• Phát hiện: Teacher luôn giỏi hơn Student!", {
    x: M + 0.3, y: 4.3, w: CW - 0.6, h: 1.4,
    fontFace: FONT, fontSize: 20, color: C.black,
  });

  addProgress(s, 2);

  s.addNotes(`EMA = Exponential Moving Average.

Mỗi bước training:
- Teacher giữ 99.6% weights hiện tại
- Chỉ lấy 0.4% từ Student

λ theo cosine schedule: 0.996 → 1 trong training.

Tại sao ngăn collapse?
- 2 bên update khác tốc độ → không thể thông đồng
- Teacher như trung bình của nhiều models → ổn định

Phát hiện thú vị từ paper:
Teacher performance luôn tốt hơn Student trong suốt training!
Đây là Polyak-Ruppert averaging effect.`);

  return s;
}

module.exports = { create };
