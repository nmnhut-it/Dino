/**
 * Slide 16: Results Summary - v1 → v2 → v3 Evolution
 */

const {
  C, FONT, M, CW,
  addTitle, addProgress, SHAPES
} = require('./config');

function create(pres) {
  const s = pres.addSlide();
  s.background = { color: C.bg };

  addTitle(s, "Kết Quả: v1 → v2 → v3", C.green);

  // Evolution bars - Classification
  s.addText("Classification (ImageNet)", {
    x: M, y: 1.3, w: CW, h: 0.5,
    fontFace: FONT, fontSize: 20, bold: true, color: C.gray,
  });

  const classResults = [
    { ver: "v1", score: "80.1%", w: 8.0, color: C.v1 },
    { ver: "v2", score: "86.5%", w: 8.65, color: C.v2 },
    { ver: "v3", score: "88.4%", w: 8.84, color: C.v3 },
  ];

  classResults.forEach((r, i) => {
    const y = 1.75 + i * 0.65;

    // Version label
    s.addText(r.ver, {
      x: M, y, w: 0.8, h: 0.55,
      fontFace: FONT, fontSize: 18, bold: true, color: r.color,
    });

    // Bar
    s.addShape(SHAPES.RECTANGLE, {
      x: M + 0.9, y: y + 0.1, w: r.w, h: 0.4,
      fill: { color: r.color },
    });

    // Score
    s.addText(r.score, {
      x: M + 1 + r.w, y, w: 1.5, h: 0.55,
      fontFace: FONT, fontSize: 18, bold: true, color: r.color,
    });
  });

  // Evolution bars - Dense (Segmentation)
  s.addText("Dense Tasks (ADE20k mIoU)", {
    x: M, y: 3.8, w: CW, h: 0.5,
    fontFace: FONT, fontSize: 20, bold: true, color: C.gray,
  });

  const denseResults = [
    { ver: "v1", score: "—", w: 0, color: C.v1 },
    { ver: "v2", score: "49.0", w: 4.9, color: C.v2 },
    { ver: "v3", score: "55.9", w: 5.59, color: C.v3 },
  ];

  denseResults.forEach((r, i) => {
    const y = 4.3 + i * 0.65;

    s.addText(r.ver, {
      x: M, y, w: 0.8, h: 0.55,
      fontFace: FONT, fontSize: 18, bold: true, color: r.color,
    });

    if (r.w > 0) {
      s.addShape(SHAPES.RECTANGLE, {
        x: M + 0.9, y: y + 0.1, w: r.w, h: 0.4,
        fill: { color: r.color },
      });
    }

    s.addText(r.score, {
      x: r.w > 0 ? M + 1 + r.w : M + 0.9, y, w: 1.5, h: 0.55,
      fontFace: FONT, fontSize: 18, bold: true, color: r.color,
    });
  });

  // Key achievements box
  s.addShape(SHAPES.RECTANGLE, {
    x: M, y: 6.0, w: CW, h: 0.9,
    fill: { color: "E8F5E9" },
    line: { color: C.success, pt: 2 },
  });

  s.addText("v3: SSL ĐẦU TIÊN ngang weakly-supervised  •  SOTA với FROZEN backbone  •  7B params", {
    x: M + 0.3, y: 6.15, w: CW - 0.6, h: 0.6,
    fontFace: FONT, fontSize: 18, bold: true, color: C.success, align: "center",
  });

  addProgress(s, 5);

  s.addNotes(`Đây là slide tổng hợp kết quả qua 3 versions.
[pause]

CLASSIFICATION (ImageNet):
- v1: 80.1% — đã vượt supervised với 0 labels
- v2: 86.5% — tăng 6.4%, vượt OpenCLIP dù không dùng text
- v3: 88.4% — tăng thêm 1.9%, ngang weakly-supervised
[pause]

DENSE TASKS (ADE20k segmentation):
- v1: không có số này — v1 chỉ focus classification
- v2: 49.0 mIoU — lần đầu test dense với frozen backbone
- v3: 55.9 mIoU — tăng 6.9, nhờ Gram Anchoring
[pause]

Để ý: Dense tăng NHIỀU HƠN classification (6.9 vs 1.9).
Gram Anchoring đặc biệt hiệu quả cho dense tasks.
[pause]

Thành tựu lịch sử của v3:
- SSL ĐẦU TIÊN đạt ngang weakly-supervised (Instagram hashtags)
- SOTA trên COCO, ADE20k với FROZEN backbone
- Scale 7B params mà không degrade
[pause]

Đây là lý do DINO được gọi là "foundation model cho vision".
1 backbone cho mọi task, không cần fine-tune.
[pause]

Slide cuối: key takeaways cho audience.`);

  return s;
}

module.exports = { create };
