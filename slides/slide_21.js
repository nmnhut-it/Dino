/**
 * Slide 21: DINOv3 Results
 */

const {
  C, FONT, M, CW,
  addTitle, addProgress
, SHAPES } = require('./config');

function create(pres) {
  const s = pres.addSlide();
  s.background = { color: C.bg };

  addTitle(s, "Kết Quả DINOv3", C.v3);

  // Big numbers
  const results = [
    { num: "88.4%", task: "ImageNet", delta: "+2.0%" },
    { num: "55.9", task: "ADE20k mIoU", delta: "+6.4" },
    { num: "7B", task: "parameters", delta: "" },
  ];

  results.forEach((r, i) => {
    const x = M + i * 4;

    s.addText(r.num, {
      x, y: 1.6, w: 3.5, h: 0.9,
      fontFace: FONT, fontSize: 48, bold: true, color: C.v3,
    });

    s.addText(r.task, {
      x, y: 2.5, w: 3.5, h: 0.4,
      fontFace: FONT, fontSize: 16, color: C.gray,
    });

    if (r.delta) {
      s.addText(r.delta, {
        x, y: 2.9, w: 3.5, h: 0.4,
        fontFace: FONT, fontSize: 16, color: C.success,
      });
    }
  });

  // Achievement box
  s.addShape(SHAPES.RECTANGLE, {
    x: M, y: 3.8, w: CW, h: 1.5,
    fill: { color: "E8F5E9" },
    line: { color: C.v3, pt: 2 },
  });

  s.addText("Thành tựu lịch sử:", {
    x: M + 0.2, y: 4.0, w: CW - 0.4, h: 0.4,
    fontFace: FONT, fontSize: 20, bold: true, color: C.v3,
  });

  s.addText("• SSL ĐẦU TIÊN ngang weakly-supervised\n• SOTA trên COCO, ADE20k với FROZEN backbone", {
    x: M + 0.2, y: 4.4, w: CW - 0.4, h: 0.8,
    fontFace: FONT, fontSize: 18, color: C.black,
  });

  addProgress(s, 4);

  s.addNotes(`DINOv3 đạt kết quả ấn tượng:

- 88.4% ImageNet (từ 86.5%)
- 55.9 mIoU ADE20k (từ 49.0)
- 7B parameters

Thành tựu lịch sử:
- SSL đầu tiên ngang weakly-supervised trên ImageNet
- SOTA COCO detection với frozen backbone
- SOTA ADE20k segmentation với frozen backbone

Gram Anchoring giải quyết dense feature degradation.`);

  return s;
}

module.exports = { create };
