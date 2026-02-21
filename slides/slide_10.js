/**
 * Slide 10: Ablation Study
 */

const {
  C, FONT, M, CW,
  addTitle, addProgress, addTable, addPlaceholder
, SHAPES } = require('./config');

function create(pres) {
  const s = pres.addSlide();
  s.background = { color: C.bg };

  addTitle(s, "Thử Bỏ Từng Thành Phần Xem Sao?", C.v1);

  // Bảng ablation
  addTable(s,
    ["Cấu hình", "Kết quả"],
    [
      ["DINO đầy đủ (EMA + Centering + Sharpening)", "✓ 80.1% ImageNet"],
      ["Bỏ EMA (copy weights)", "✗ Không hội tụ được"],
      ["Bỏ Centering", "✗ Mode collapse ngay"],
      ["Bỏ Sharpening (τ_t = τ_s = 0.1)", "✗ Uniform collapse"],
      ["Bỏ cả Centering và Sharpening", "✗ Collapse tức thì"],
    ],
    M, 1.3, CW * 0.75
  );

  // Minh họa 3 trụ cột
  addPlaceholder(s, 9.5, 1.3, 3.3, 2.5,
    "3 trụ cột đỡ mái nhà \"Training Ổn Định\"", C.v1);

  // Trích dẫn paper
  s.addShape(SHAPES.RECTANGLE, {
    x: M, y: 4.6, w: CW, h: 1.2,
    fill: { color: C.cream },
  });
  s.addText("\"Centering ngăn 1 dimension chiếm ưu thế nhưng khuyến khích uniform collapse. Sharpening có tác dụng ngược. Áp dụng CẢ HAI để cân bằng.\"", {
    x: M + 0.2, y: 4.7, w: CW - 0.4, h: 1.1,
    fontFace: FONT, fontSize: 16, italic: true, color: C.gray, valign: "middle",
  });

  // Kết luận
  s.addText("Kết luận: CẢ BA đều cần thiết. Bỏ bất kỳ cái nào → collapse.", {
    x: M, y: 6.0, w: CW, h: 0.5,
    fontFace: FONT, fontSize: 22, bold: true, color: C.accent, align: "center",
  });

  addProgress(s, 2);

  s.addNotes(`[ABLATION]

Ablation study = thử bỏ từng thành phần xem có quan trọng không.

Kết quả:
- Bỏ EMA: không converge - Teacher và Student đuổi theo nhau
- Bỏ Centering: mode collapse - mọi ảnh cùng output
- Bỏ Sharpening: uniform collapse - output trải đều

Paper nói rõ: "centering ngăn 1 dimension dominate nhưng khuyến khích uniform collapse, sharpening có tác dụng ngược."

Đây không phải optional tricks - đây là CORE của DINO.
CẢ BA đều cần thiết.

Bỏ bất kỳ cái nào → collapse.`);

  return s;
}

module.exports = { create };
