/**
 * Slide 12: Kết Quả v1 - DINOv1 Results
 */

const {
  C, FONT, M, CW,
  addTitle, addProgress
, SHAPES } = require('./config');

function create(pres) {
  const s = pres.addSlide();
  s.background = { color: C.bg };

  addTitle(s, "Kết Quả v1", C.v1);

  // Big number
  s.addText("80.1%", {
    x: M, y: 1.4, w: 4, h: 1.2,
    fontFace: FONT, fontSize: 72, bold: true, color: C.v1,
  });

  s.addText("ImageNet (không nhãn)", {
    x: M, y: 2.6, w: 4, h: 0.5,
    fontFace: FONT, fontSize: 20, color: C.gray,
  });

  // Comparison
  s.addShape(SHAPES.RECTANGLE, {
    x: 5.5, y: 1.4, w: 7, h: 2,
    fill: { color: C.cream },
  });

  s.addText("So sánh:", {
    x: 5.7, y: 1.5, w: 6.6, h: 0.4,
    fontFace: FONT, fontSize: 18, bold: true, color: C.black,
  });

  s.addText("• Supervised ViT: 76.5% (cần 14M nhãn)\n• SimCLR: 69.3%\n• BYOL: 74.3%", {
    x: 5.7, y: 1.9, w: 6.6, h: 1.4,
    fontFace: FONT, fontSize: 18, color: C.black,
  });

  // Milestone
  s.addShape(SHAPES.RECTANGLE, {
    x: M, y: 4.0, w: CW, h: 1,
    fill: { color: "E8F5E9" },
    line: { color: C.success, pt: 2 },
  });

  s.addText("Lần ĐẦU TIÊN: SSL vượt Supervised!", {
    x: M + 0.2, y: 4.2, w: CW - 0.4, h: 0.6,
    fontFace: FONT, fontSize: 24, bold: true, color: C.success, align: "center",
  });

  // Limitations teaser
  s.addText("Nhưng: chỉ classification, data nhỏ, 1 loss → v2 sẽ giải quyết", {
    x: M, y: 5.5, w: CW, h: 0.5,
    fontFace: FONT, fontSize: 18, italic: true, color: C.gray, align: "center",
  });

  // Source
  s.addText("Nguồn: Caron et al., ICCV 2021", {
    x: M, y: 6.2, w: CW, h: 0.3,
    fontFace: FONT, fontSize: 11, italic: true, color: C.medGray,
  });

  addProgress(s, 2);

  s.addNotes(`DINOv1 milestone:

80.1% ImageNet với 0 labels.
Lần đầu SSL vượt supervised!

So sánh:
- Supervised ViT: 76.5% (nhưng cần 14M nhãn)
- SimCLR: 69.3%
- BYOL: 74.3%

Emerging properties:
- Attention maps tự động focus đúng objects
- Nearest neighbor tìm semantically similar images

Hạn chế của v1:
- Chỉ ImageNet (1.28M ảnh)
- Chỉ classification
- Chỉ CLS token loss

→ v2 sẽ giải quyết những hạn chế này.

Nguồn: Caron et al., ICCV 2021`);

  return s;
}

module.exports = { create };
