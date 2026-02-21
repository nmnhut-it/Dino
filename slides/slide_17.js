/**
 * Slide 17: DINOv2 Results
 */

const {
  C, FONT, M, CW,
  addTitle, addProgress
, SHAPES } = require('./config');

function create(pres) {
  const s = pres.addSlide();
  s.background = { color: C.bg };

  addTitle(s, "Kết Quả DINOv2", C.v2);

  // Big numbers
  const results = [
    { num: "86.5%", task: "ImageNet", prev: "82.3%" },
    { num: "49.0", task: "ADE20k mIoU", prev: "44.6" },
    { num: "+41%", task: "Retrieval vs SSL", prev: "" },
  ];

  results.forEach((r, i) => {
    const x = M + i * 4;

    s.addText(r.num, {
      x, y: 1.6, w: 3.5, h: 0.9,
      fontFace: FONT, fontSize: 48, bold: true, color: C.v2,
    });

    s.addText(r.task, {
      x, y: 2.5, w: 3.5, h: 0.5,
      fontFace: FONT, fontSize: 16, color: C.gray,
    });
  });

  // Foundation Model box
  s.addShape(SHAPES.RECTANGLE, {
    x: M, y: 3.5, w: CW, h: 1.3,
    fill: { color: "FFF3E0" },
    line: { color: C.v2, pt: 2 },
  });

  s.addText("Foundation Model thực sự:", {
    x: M + 0.2, y: 3.7, w: CW - 0.4, h: 0.4,
    fontFace: FONT, fontSize: 20, bold: true, color: C.v2,
  });

  s.addText("1 backbone FROZEN + linear head → SOTA nhiều tasks", {
    x: M + 0.2, y: 4.1, w: CW - 0.4, h: 0.5,
    fontFace: FONT, fontSize: 20, color: C.black,
  });

  // vs CLIP
  s.addText("Thắng OpenCLIP mà KHÔNG cần text!", {
    x: M, y: 5.3, w: CW, h: 0.5,
    fontFace: FONT, fontSize: 22, bold: true, color: C.accent, align: "center",
  });

  addProgress(s, 3);

  s.addNotes(`DINOv2 đạt Foundation Model status:

Results:
- 86.5% ImageNet (từ 82.3%)
- 49.0 mIoU ADE20k (từ 44.6)
- +41% retrieval vs prior SSL

1 backbone, FROZEN, chỉ thêm linear head → SOTA.

Thắng OpenCLIP dù không dùng text!
Pure visual SSL với đúng losses và data = đủ mạnh.`);

  return s;
}

module.exports = { create };
