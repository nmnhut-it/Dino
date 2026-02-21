/**
 * Slide 22: DINOv3 Results
 */

const {
  C, FONT, M, CW,
  addTitle, addProgress, addTable
, SHAPES } = require('./config');

function create(pres) {
  const s = pres.addSlide();
  s.background = { color: C.bg };

  addTitle(s, "Kết Quả DINOv3 - SOTA Mọi Nơi", C.v3);

  // Bảng kết quả
  addTable(s,
    ["Benchmark", "DINOv2", "DINOv3", "Cải thiện"],
    [
      ["ImageNet", "87.3%", "88.4%", "+1.1%"],
      ["ObjectNet", "66.0%", "79.0%", "+13%!"],
      ["ADE20k", "49.5", "55.9", "+6.4 mIoU"],
      ["COCO det", "62.5", "66.1", "+3.6 mAP"],
      ["DAVIS track", "76.6", "83.3", "+6.7"],
    ],
    M, 1.3, CW * 0.65
  );

  // Thành tựu
  s.addShape(SHAPES.RECTANGLE, {
    x: M, y: 4.0, w: CW, h: 1.2,
    fill: { color: "E8F5E9" },
    line: { color: C.v3, pt: 2 },
  });
  s.addText("Thành tựu lịch sử:", {
    x: M + 0.2, y: 4.1, w: CW - 0.4, h: 0.4,
    fontFace: FONT, fontSize: 18, bold: true, color: C.v3,
  });
  s.addText("• SSL ĐẦU TIÊN ngang bằng weakly-supervised trên ImageNet\n• SOTA COCO detection với backbone ĐÓNG BĂNG\n• SOTA ADE20k với frozen backbone", {
    x: M + 0.2, y: 4.5, w: CW - 0.4, h: 0.7,
    fontFace: FONT, fontSize: 16, color: C.black,
  });

  // Specs
  s.addText("Specs: ViT-7B (6.7B params), Axial RoPE, SwiGLU, 256k prototypes", {
    x: M, y: 5.5, w: CW, h: 0.4,
    fontFace: FONT, fontSize: 14, color: C.medGray,
  });
  s.addText("Training: 256 H100 GPUs, 61k GPU hours, ~18 tấn CO₂", {
    x: M, y: 5.9, w: CW, h: 0.4,
    fontFace: FONT, fontSize: 14, color: C.medGray,
  });

  addProgress(s, 4);

  s.addNotes(`[KẾT QUẢ V3]

DINOv3 đạt SOTA với frozen backbone:
- 88.4% ImageNet - SSL đầu tiên ngang weakly-supervised!
- +13% ObjectNet (out-of-distribution)
- +6.4 mIoU segmentation
- +6.7 video tracking

Gram Anchoring giải quyết dense feature degradation.

Scale lợi nhất cho DENSE tasks:
- Classification gần bão hòa (88% khó tăng)
- Segmentation/tracking còn nhiều room

Training cost: 256 H100, 61k GPU hours (~18 tấn CO2).
Nhưng model released = cộng đồng dùng miễn phí.`);

  return s;
}

module.exports = { create };
