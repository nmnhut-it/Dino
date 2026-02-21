/**
 * Slide 4: Network Architecture
 */

const {
  C, FONT, M, CW,
  addTitle, addProgress, addFormula, addTable, addBullets
, SHAPES } = require('./config');

function create(pres) {
  const s = pres.addSlide();
  s.background = { color: C.bg };

  addTitle(s, "Cấu Trúc Mạng", C.v1);

  // Công thức chính
  addFormula(s, "g = h ∘ f\n\nf = ViT (phần chính, dùng cho task thật)\nh = Projection Head (chỉ dùng khi train)", M, 1.3, 6, 1.8, C.v1);

  // Chi tiết projection head
  s.addText("Projection Head:", {
    x: M, y: 3.4, w: 6, h: 0.4,
    fontFace: FONT, fontSize: 20, bold: true, color: C.v1,
  });

  addTable(s,
    ["Lớp", "Kích thước", "Ghi chú"],
    [
      ["Input", "d (từ ViT)", "768 với ViT-B"],
      ["Hidden 1", "2048", "+ GELU"],
      ["Hidden 2", "2048", "+ GELU"],
      ["Output", "K = 65,536", "Weight normalized"],
    ],
    M, 3.8, 6
  );

  // Thiết kế quan trọng
  s.addText("Điểm thiết kế quan trọng:", {
    x: 7, y: 1.3, w: 5.8, h: 0.4,
    fontFace: FONT, fontSize: 20, bold: true, color: C.black,
  });

  addBullets(s, [
    "KHÔNG có predictor (khác BYOL)",
    "Student = Teacher (cùng kiến trúc)",
    "KHÔNG dùng Batch Normalization",
    "→ Toàn bộ hệ thống BN-free!",
  ], 7, 1.7, 5.8, 2, 18);

  // Giải thích BN-free
  s.addShape(SHAPES.RECTANGLE, {
    x: 7, y: 4, w: 5.8, h: 1.5,
    fill: { color: C.cream },
  });
  s.addText("Tại sao không dùng Batch Norm?\n\nBN tạo ra sự phụ thuộc ngầm giữa các sample trong batch. Self-supervised learning hoạt động tốt hơn khi không có BN.", {
    x: 7.2, y: 4.1, w: 5.4, h: 1.4,
    fontFace: FONT, fontSize: 15, color: C.gray,
  });

  addProgress(s, 2);

  s.addNotes(`[KIẾN TRÚC]

Network g gồm 2 phần:
- f: ViT backbone - phần này sẽ dùng cho các task thật sau này
- h: Projection head - 3 lớp MLP, chỉ dùng khi training

Projection head có hidden dimension 2048, output K = 65,536.
Số K lớn này có thể hiểu như số "category ẩn" mà model học.

Điểm quan trọng:
- Không có predictor như BYOL - Teacher và Student cùng kiến trúc
- Không dùng Batch Normalization trong toàn bộ hệ thống

Tại sao không BN? Vì BN tạo dependencies ngầm - mỗi sample phụ thuộc vào các sample khác trong batch. Self-supervised cần tránh điều này.`);

  return s;
}

module.exports = { create };
