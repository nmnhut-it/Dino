/**
 * Slide 12: DINOv1 Results
 */

const {
  C, FONT, M,
  addTitle, addProgress, addTable, addBullets
, SHAPES } = require('./config');

function create(pres) {
  const s = pres.addSlide();
  s.background = { color: C.bg };

  addTitle(s, "Kết Quả DINOv1 - Lần Đầu SSL Thắng Supervised", C.v1);

  // Bảng kết quả
  addTable(s,
    ["Phương pháp", "ImageNet", "Nhãn", "Năm"],
    [
      ["DINO v1", "80.1%", "0", "2021"],
      ["Supervised ViT", "76.5%", "14M", "-"],
      ["SimCLR", "69.3%", "0", "2020"],
      ["BYOL", "74.3%", "0", "2020"],
      ["MoCo v3", "76.7%", "0", "2021"],
    ],
    M, 1.3, 7
  );

  // Milestone
  s.addShape(SHAPES.RECTANGLE, {
    x: M, y: 4.0, w: 7, h: 0.8,
    fill: { color: "E8F5E9" },
    line: { color: C.success, pt: 2 },
  });
  s.addText("🎯 Lần ĐẦU TIÊN self-supervised VƯỢT supervised trên ImageNet!", {
    x: M + 0.2, y: 4.1, w: 6.6, h: 0.7,
    fontFace: FONT, fontSize: 20, bold: true, color: C.success, valign: "middle",
  });

  // Hạn chế
  s.addText("Nhưng còn hạn chế:", {
    x: 8, y: 1.3, w: 4.8, h: 0.4,
    fontFace: FONT, fontSize: 18, bold: true, color: C.accent,
  });

  addTable(s,
    ["Hạn chế", "Ảnh hưởng"],
    [
      ["Chỉ 1.28M ảnh", "Đa dạng hạn chế"],
      ["Chỉ classification", "Segmentation? Depth?"],
      ["Chỉ CLS token", "Patch-level features?"],
    ],
    8, 1.8, 4.8
  );

  // Câu hỏi v2
  s.addText("Câu hỏi đặt ra cho v2:", {
    x: 8, y: 4.0, w: 4.8, h: 0.4,
    fontFace: FONT, fontSize: 18, bold: true, color: C.v2,
  });
  addBullets(s, [
    "Nhiều data hơn có tốt hơn?",
    "Làm sao để làm dense tasks?",
    "Có thể thành Foundation Model?",
  ], 8, 4.4, 4.8, 2, 16);

  addProgress(s, 2);

  s.addNotes(`[KẾT QUẢ V1]

DINOv1 đạt milestone quan trọng:
80.1% ImageNet với 0 labels - LẦN ĐẦU SSL vượt supervised!

Emerging properties: attention heads TỰ ĐỘNG segment objects mà không ai dạy.

Nhưng còn hạn chế:
- Chỉ train trên ImageNet (1.28M ảnh)
- Chỉ làm tốt classification
- Dùng 1 loss (CLS token)

Câu hỏi cho v2:
- Nhiều data hơn có tốt không? Curation như thế nào?
- Dense tasks (segmentation, depth) cần gì?
- Có thể làm Foundation Model - 1 backbone cho mọi task?`);

  return s;
}

module.exports = { create };
