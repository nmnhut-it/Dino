/**
 * Slide 17: Takeaways
 */

const {
  C, FONT, M, CW,
  addTitle, addProgress, SHAPES
} = require('./config');

function create(pres) {
  const s = pres.addSlide();
  s.background = { color: C.bg };

  addTitle(s, "Key Takeaways", C.green);

  // Takeaway boxes
  const takeaways = [
    {
      num: "1",
      title: "Self-Distillation Works",
      detail: "Teacher-Student + EMA = stable SSL without labels",
      color: C.v1,
    },
    {
      num: "2",
      title: "Quality > Quantity",
      detail: "142M curated > 1.2B uncurated",
      color: C.v2,
    },
    {
      num: "3",
      title: "Multiple Objectives",
      detail: "DINO + iBOT + KoLeo = foundation model",
      color: C.v2,
    },
    {
      num: "4",
      title: "Scaling Needs Care",
      detail: "Gram Anchoring prevents dense degradation",
      color: C.v3,
    },
  ];

  takeaways.forEach((t, i) => {
    const y = 1.3 + i * 1.3;

    // Number circle
    s.addShape(SHAPES.OVAL, {
      x: M, y: y + 0.15, w: 0.6, h: 0.6,
      fill: { color: t.color },
    });
    s.addText(t.num, {
      x: M, y: y + 0.15, w: 0.6, h: 0.6,
      fontFace: FONT, fontSize: 20, bold: true, color: "FFFFFF", align: "center", valign: "middle",
    });

    // Title
    s.addText(t.title, {
      x: M + 0.8, y, w: 6, h: 0.55,
      fontFace: FONT, fontSize: 24, bold: true, color: t.color,
    });

    // Detail
    s.addText(t.detail, {
      x: M + 0.8, y: y + 0.55, w: 11, h: 0.45,
      fontFace: FONT, fontSize: 18, color: C.gray,
    });
  });

  // Bottom: Call to action
  s.addShape(SHAPES.RECTANGLE, {
    x: M, y: 5.9, w: CW, h: 1.0,
    fill: { color: C.cream },
    line: { color: C.green, pt: 2 },
  });

  s.addText("DINO = Foundation Model cho Vision", {
    x: M + 0.3, y: 6.0, w: CW - 0.6, h: 0.5,
    fontFace: FONT, fontSize: 26, bold: true, color: C.green, align: "center",
  });

  s.addText("1 backbone, mọi task, không cần labels", {
    x: M + 0.3, y: 6.5, w: CW - 0.6, h: 0.4,
    fontFace: FONT, fontSize: 18, color: C.gray, align: "center",
  });

  addProgress(s, 5);

  s.addNotes(`4 takeaways chính từ DINO series:
[pause]

1. SELF-DISTILLATION WORKS
Teacher-Student với EMA tạo ra stable SSL.
Không cần negative samples, không cần contrastive loss.
Key: 2 networks update khác tốc độ → không collapse.
[pause]

2. QUALITY > QUANTITY
Data curation quan trọng hơn data quantity.
142M curated thắng 1.2B uncurated.
Bài học: đừng chỉ crawl nhiều, hãy lọc kỹ.
[pause]

3. MULTIPLE OBJECTIVES
Muốn làm foundation model → cần nhiều losses.
DINO (global) + iBOT (local) + KoLeo (diversity).
Mỗi loss lo một task, kết hợp = comprehensive.
[pause]

4. SCALING NEEDS CARE
Scale không free — cần techniques như Gram Anchoring.
Dense features dễ degrade khi model lớn.
Bài học: monitor các metrics khác nhau, không chỉ classification.
[pause]

Tổng kết:
DINO = Foundation Model cho Vision.
1 backbone frozen + linear head = SOTA nhiều tasks.
Không cần labels ở bất kỳ dạng nào.
[pause]

Cảm ơn các bạn đã lắng nghe!
Có câu hỏi gì không?`);

  return s;
}

module.exports = { create };
