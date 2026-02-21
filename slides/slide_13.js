/**
 * Slide 13: DINOv2 - What's New
 * Combined: Data curation pipeline + 3 Losses
 */

const {
  C, FONT, M, CW,
  addTitle, addProgress, SHAPES
} = require('./config');

function create(pres) {
  const s = pres.addSlide();
  s.background = { color: C.bg };

  addTitle(s, "DINOv2: What's New", C.v2);

  // LEFT: Data Pipeline (compact funnel)
  s.addText("Data Curation", {
    x: M, y: 1.3, w: 4, h: 0.5,
    fontFace: FONT, fontSize: 22, bold: true, color: C.v2,
  });

  // Funnel boxes
  const stages = [
    { count: "1.2B", w: 3.2, color: "FFCDD2" },
    { count: "142M", w: 2.0, color: "C8E6C9" },
  ];

  stages.forEach((stage, i) => {
    const y = 1.8 + i * 1.1;
    const x = M + (3.2 - stage.w) / 2;

    s.addShape(SHAPES.RECTANGLE, {
      x, y, w: stage.w, h: 0.8,
      fill: { color: stage.color },
      line: { color: C.v2, pt: 1 },
    });

    s.addText(stage.count, {
      x, y: y + 0.1, w: stage.w, h: 0.6,
      fontFace: FONT, fontSize: 28, bold: true, color: C.black, align: "center",
    });
  });

  s.addText("↓", {
    x: M, y: 2.6, w: 3.2, h: 0.5,
    fontFace: FONT, fontSize: 20, color: C.v2, align: "center",
  });

  // Result badge
  s.addText("Ít 8x, tốt hơn!", {
    x: M, y: 3.9, w: 3.2, h: 0.5,
    fontFace: FONT, fontSize: 18, bold: true, color: C.success, align: "center",
  });

  // RIGHT: 3 Losses
  s.addText("3 Losses = 3 Tasks", {
    x: 4.5, y: 1.3, w: 8, h: 0.5,
    fontFace: FONT, fontSize: 22, bold: true, color: C.v2,
  });

  const losses = [
    { name: "DINO", target: "CLS token", task: "Classification", color: C.v1 },
    { name: "iBOT", target: "Patches", task: "Segmentation", color: C.v2 },
    { name: "KoLeo", target: "Diversity", task: "Retrieval", color: C.success },
  ];

  losses.forEach((loss, i) => {
    const x = 4.5 + i * 2.8;
    const y = 1.8;

    // Box
    s.addShape(SHAPES.RECTANGLE, {
      x, y, w: 2.6, h: 2.4,
      fill: { color: C.bg },
      line: { color: loss.color, pt: 2 },
    });

    // Name
    s.addText(loss.name, {
      x, y: y + 0.15, w: 2.6, h: 0.6,
      fontFace: FONT, fontSize: 24, bold: true, color: loss.color, align: "center",
    });

    // Target
    s.addText(loss.target, {
      x, y: y + 0.75, w: 2.6, h: 0.45,
      fontFace: FONT, fontSize: 16, color: C.gray, align: "center",
    });

    // Arrow
    s.addText("↓", {
      x, y: y + 1.2, w: 2.6, h: 0.4,
      fontFace: FONT, fontSize: 20, color: C.medGray, align: "center",
    });

    // Task
    s.addText(loss.task, {
      x, y: y + 1.6, w: 2.6, h: 0.45,
      fontFace: FONT, fontSize: 17, bold: true, color: C.black, align: "center",
    });
  });

  // Bottom: Key insight
  s.addShape(SHAPES.RECTANGLE, {
    x: M, y: 4.6, w: CW, h: 1.3,
    fill: { color: "FFF3E0" },
    line: { color: C.v2, pt: 2 },
  });

  s.addText("v1 → v2: 3 thay đổi chính", {
    x: M + 0.3, y: 4.75, w: CW - 0.6, h: 0.45,
    fontFace: FONT, fontSize: 20, bold: true, color: C.v2,
  });

  s.addText("1. Data: 1.28M → 142M curated  •  2. Losses: 1 → 3  •  3. Scale: ViT-B → ViT-g", {
    x: M + 0.3, y: 5.2, w: CW - 0.6, h: 0.5,
    fontFace: FONT, fontSize: 18, color: C.black,
  });

  addProgress(s, 3);

  s.addNotes(`DINOv2 có 3 thay đổi chính so với v1.
[pause]

THỨ NHẤT — Data curation:
V1 chỉ dùng ImageNet 1.28M ảnh.
V2 crawl 1.2 tỷ ảnh từ web, rồi lọc xuống 142M.
[pause]

Kết quả BẤT NGỜ: 142M curated THẮNG 1.2B uncurated.
Ít hơn 8 lần mà tốt hơn — Quality > Quantity.
[pause]

THỨ HAI — 3 Losses thay vì 1:
- DINO loss: học CLS token → tốt cho classification
- iBOT loss: học patches (như BERT cho ảnh) → tốt cho segmentation
- KoLeo loss: đẩy embeddings xa nhau → tốt cho retrieval
[pause]

Tại sao cần 3 losses?
V1 chỉ có DINO loss → chỉ tốt cho classification.
V2 muốn làm foundation model → cần tốt cho MỌI task.
[pause]

THỨ BA — Scale:
V1: ViT-B (86M params)
V2: ViT-g (1.1B params)
Scale 13x nhưng vẫn ổn định training.
[pause]

Slide tiếp: kết quả của những thay đổi này.`);

  return s;
}

module.exports = { create };
