/**
 * Slide 2: DINO đạt được gì?
 */

const {
  C, FONT, M, CW,
  addTitle, addProgress
} = require('./config');

function create(pres) {
  const s = pres.addSlide();
  s.background = { color: C.bg };

  addTitle(s, "DINO Đạt Được Gì?");

  // 4 achievements - layout 2x2 đơn giản
  const items = [
    { num: "88.4%", desc: "ImageNet (không nhãn)" },
    { num: "SOTA", desc: "Segmentation, Depth" },
    { num: "6.7B", desc: "parameters (v3)" },
    { num: "1st", desc: "SSL ≈ Weakly-supervised" },
  ];

  items.forEach((item, i) => {
    const x = M + (i % 2) * 6.2;
    const y = 1.5 + Math.floor(i / 2) * 2.5;

    s.addText(item.num, {
      x, y, w: 3, h: 1,
      fontFace: FONT, fontSize: 48, bold: true, color: C.green,
    });

    s.addText(item.desc, {
      x, y: y + 1, w: 5.5, h: 0.5,
      fontFace: FONT, fontSize: 20, color: C.black,
    });
  });

  // Source
  s.addText("Nguồn: DINOv3 (Siméoni et al., arXiv 2025)", {
    x: M, y: 6.5, w: CW, h: 0.4,
    fontFace: FONT, fontSize: 12, italic: true, color: C.medGray,
  });

  addProgress(s, 1);

  s.addNotes(`4 thành tựu chính của DINO:

1. 88.4% ImageNet accuracy - không dùng nhãn
   (DINOv3 với ViT-6.7B, linear probe)

2. SOTA nhiều dense tasks: segmentation, depth estimation
   Với frozen backbone, chỉ train linear head

3. Scale lên 6.7B parameters (DINOv3)
   Lớn nhất cho self-supervised vision

4. Lần đầu SSL xấp xỉ weakly-supervised (88.5%)
   Supervised chỉ đạt 85.7%

Nguồn: Siméoni et al., arXiv 2025`);

  return s;
}

module.exports = { create };
