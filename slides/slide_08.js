/**
 * Slide 8: EMA - Teacher Update Mechanism
 * Updated: Added ablation table showing EMA vs alternatives
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
    x: M, y: 2.5, w: CW, h: 0.5,
    fontFace: FONT, fontSize: 22, bold: true, color: C.black, align: "center",
  });

  // Left column: Why it works
  s.addShape(SHAPES.RECTANGLE, {
    x: M, y: 3.2, w: 5.8, h: 2.6,
    fill: { color: C.cream },
  });

  s.addText("Tại sao hoạt động?", {
    x: M + 0.2, y: 3.35, w: 5.4, h: 0.4,
    fontFace: FONT, fontSize: 18, bold: true, color: C.v1,
  });

  s.addText("• Teacher ≠ Student → không thông đồng\n• Teacher = trung bình nhiều versions\n• Teacher luôn giỏi hơn Student!", {
    x: M + 0.2, y: 3.8, w: 5.4, h: 1.8,
    fontFace: FONT, fontSize: 17, color: C.black,
  });

  // Right column: Ablation table
  s.addShape(SHAPES.RECTANGLE, {
    x: 6.6, y: 3.2, w: 6.2, h: 2.6,
    fill: { color: "F5F5F5" },
    line: { color: C.v1, pt: 1 },
  });

  s.addText("Paper đã thử các phương pháp khác:", {
    x: 6.8, y: 3.35, w: 5.8, h: 0.4,
    fontFace: FONT, fontSize: 16, bold: true, color: C.v1,
  });

  // Ablation table
  const ablationData = [
    [{ text: "Phương pháp", options: { fill: { color: C.v1 }, color: "FFFFFF", bold: true } },
     { text: "Kết quả", options: { fill: { color: C.v1 }, color: "FFFFFF", bold: true } }],
    [{ text: "Copy weights (cùng tốc độ)", options: { fill: { color: "FFEBEE" } } },
     { text: "✗ Không hội tụ", options: { fill: { color: "FFEBEE" }, color: C.accent } }],
    [{ text: "Freeze Teacher/epoch", options: { fill: { color: "FFF8E1" } } },
     { text: "○ OK", options: { fill: { color: "FFF8E1" }, color: C.gray } }],
    [{ text: "EMA (momentum)", options: { fill: { color: "E8F5E9" } } },
     { text: "✓ TỐT NHẤT", options: { fill: { color: "E8F5E9" }, color: C.success, bold: true } }],
  ];

  s.addTable(ablationData, {
    x: 6.8, y: 3.85, w: 5.8,
    fontFace: FONT, fontSize: 14,
    border: { pt: 0.5, color: C.lightGray },
  });

  addProgress(s, 2);

  s.addNotes(`EMA = Exponential Moving Average.

Mỗi bước training:
- Teacher giữ 99.6% weights hiện tại
- Chỉ lấy 0.4% từ Student

λ theo cosine schedule: 0.996 → 1 trong training.

ABLATION STUDY (từ paper):
1. Copy student weights (cùng tốc độ update): FAILS TO CONVERGE
   - Teacher = Student → collapse cùng nhau
2. Freeze teacher over epoch: Works OK nhưng kém hơn EMA
3. EMA (momentum encoder): TỐT NHẤT
   - Bỏ EMA → training collapse, accuracy gần random

Tại sao ngăn collapse?
- 2 bên update khác tốc độ → không thể thông đồng
- Teacher như trung bình của nhiều models → ổn định

Key finding từ paper:
- Teacher performance luôn tốt hơn Student suốt training
- Đây là Polyak-Ruppert averaging effect
- BYOL (Grill et al. 2020) thử nhiều giá trị, 0.996 tốt nhất
- DINO kế thừa con số này

Source: Caron et al. ICCV 2021, Table 5 & Section 4.2`);

  return s;
}

module.exports = { create };
