/**
 * Slide 8: Centering
 */

const {
  C, FONT, M, CW,
  addTitle, addProgress, addFormula, addTable
, SHAPES } = require('./config');

function create(pres) {
  const s = pres.addSlide();
  s.background = { color: C.bg };

  addTitle(s, "Trick 2: Centering - Trừ Đi Trung Bình", C.v1);

  // Công thức
  addFormula(s, "c ← m·c + (1-m) · (1/B) · Σᵢ gθₜ(xᵢ)\n\nm = 0.9 (momentum)\nB = batch size", M, 1.3, 7, 1.6, C.v1);

  // Cách áp dụng
  s.addText("Áp dụng thế nào:", {
    x: M, y: 3.2, w: 6.5, h: 0.4,
    fontFace: FONT, fontSize: 20, bold: true, color: C.black,
  });
  addFormula(s, "gₜ(x) ← gₜ(x) - c\n\nTrừ center TRƯỚC KHI qua softmax", M, 3.6, 5, 1, C.v1);

  // Tại sao ngăn collapse
  s.addText("Tại sao ngăn được Mode Collapse:", {
    x: M, y: 5.0, w: 6, h: 0.4,
    fontFace: FONT, fontSize: 18, bold: true, color: C.v1,
  });

  addTable(s,
    ["Nếu Teacher collapse...", "Sau centering"],
    [
      ["Mọi ảnh → output v", "c hội tụ về v"],
      ["", "v - c = 0 → vô nghĩa"],
      ["", "BUỘC phải output khác nhau!"],
    ],
    M, 5.4, 6
  );

  // Cảnh báo
  s.addShape(SHAPES.RECTANGLE, {
    x: 7.5, y: 1.3, w: 5.3, h: 2,
    fill: { color: "FFF0F0" },
    line: { color: C.accent, pt: 1 },
  });
  s.addText("⚠ Nhưng mà...\n\nCentering một mình lại khuyến khích UNIFORM collapse!\n\n→ Cần thêm sharpening", {
    x: 7.7, y: 1.4, w: 5, h: 1.9,
    fontFace: FONT, fontSize: 16, color: C.accent,
  });

  // Ưu điểm
  s.addText("Ưu điểm: Chỉ dùng mean → hoạt động với mọi batch size", {
    x: 7.5, y: 4, w: 5.3, h: 0.8,
    fontFace: FONT, fontSize: 15, italic: true, color: C.gray,
  });

  addProgress(s, 2);

  s.addNotes(`[CENTERING]

Centering = trừ đi trung bình của Teacher outputs.

c là EMA của mean output trên nhiều batches.
Trước softmax, trừ c từ Teacher output.

Tại sao ngăn collapse?

Giả sử Teacher collapse: mọi ảnh đều output vector v.
- Batch mean = v
- c hội tụ về v
- Sau centering: v - c = 0

Teacher không thể output constant được nữa!
BUỘC phải output khác nhau cho các ảnh khác nhau.

Nhưng có side effect:
Centering một mình lại khuyến khích uniform collapse - output trải đều.
Cần sharpening để cân bằng.`);

  return s;
}

module.exports = { create };
