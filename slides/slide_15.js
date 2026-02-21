/**
 * Slide 15: KoLeo Loss
 */

const {
  C, FONT, M, CW,
  addTitle, addProgress, addPlaceholder
, SHAPES } = require('./config');

function create(pres) {
  const s = pres.addSlide();
  s.background = { color: C.bg };

  addTitle(s, "KoLeo: Đẩy Ra Xa Nhau", C.v2);

  // Visual
  addPlaceholder(s, M, 1.4, CW, 2.5,
    "[Không KoLeo: tụm cục] → [Có KoLeo: trải đều trên sphere]", C.v2);

  // Simple explanation
  s.addText("Ý tưởng đơn giản:", {
    x: M, y: 4.2, w: CW, h: 0.5,
    fontFace: FONT, fontSize: 20, bold: true, color: C.v2,
  });

  s.addText("Đẩy mỗi embedding ra xa neighbor gần nhất\n→ Embeddings trải đều, không cluster", {
    x: M, y: 4.7, w: CW, h: 0.8,
    fontFace: FONT, fontSize: 20, color: C.black,
  });

  // Impact
  s.addShape(SHAPES.RECTANGLE, {
    x: M, y: 5.6, w: CW, h: 0.9,
    fill: { color: "FFF5F5" },
  });

  s.addText("Bỏ KoLeo: Classification -0.5%, Retrieval -8.3%!", {
    x: M + 0.2, y: 5.75, w: CW - 0.4, h: 0.6,
    fontFace: FONT, fontSize: 20, bold: true, color: C.accent, align: "center",
  });

  addProgress(s, 3);

  s.addNotes(`KoLeo = Kozachenko-Leonenko entropy.

Ý tưởng: tối đa khoảng cách đến neighbor gần nhất.
→ Embeddings trải đều, không bị cluster.

Ablation:
- Bỏ KoLeo: Classification chỉ tụt 0.5%
- Nhưng Retrieval tụt 8.3%!

Tại sao?
- Classification chỉ cần linearly separable
- Retrieval cần fine-grained distances

Weight = 0.1 (nhẹ nhàng nhưng quan trọng).`);

  return s;
}

module.exports = { create };
