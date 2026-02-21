/**
 * Slide 16: KoLeo Loss
 */

const {
  C, FONT, M,
  addTitle, addProgress, addFormula, addPlaceholder, addTable
} = require('./config');

function create(pres) {
  const s = pres.addSlide();
  s.background = { color: C.bg };

  addTitle(s, "KoLeo: Đẩy Các Embeddings Ra Xa Nhau", C.v2);

  // Minh họa
  addPlaceholder(s, M, 1.3, 5.5, 3,
    "Không KoLeo: tụm cục | Có KoLeo: trải đều trên hypersphere", C.v2);

  // Công thức
  s.addText("Công thức KoLeo:", {
    x: 6.5, y: 1.3, w: 6.3, h: 0.4,
    fontFace: FONT, fontSize: 18, bold: true, color: C.v2,
  });
  addFormula(s, "L_KoLeo = -(1/n) Σᵢ log(d_{n,i})\n\nd_{n,i} = min_{j≠i} ||xᵢ - xⱼ||\n= khoảng cách đến neighbor gần nhất", 6.5, 1.7, 6.3, 1.8, C.v2);

  // Trực giác
  s.addText("Hiểu đơn giản:", {
    x: 6.5, y: 3.7, w: 6.3, h: 0.4,
    fontFace: FONT, fontSize: 18, bold: true, color: C.black,
  });
  s.addText("• Tối đa hóa khoảng cách đến hàng xóm gần nhất\n• → Embeddings trải đều, không tụm cục\n• Weight = 0.1 (nhẹ nhàng thôi)", {
    x: 6.5, y: 4.1, w: 6.3, h: 1.5,
    fontFace: FONT, fontSize: 16, color: C.gray,
  });

  // Ablation
  s.addText("Bỏ KoLeo thì sao?", {
    x: M, y: 4.6, w: 5.5, h: 0.4,
    fontFace: FONT, fontSize: 18, bold: true, color: C.accent,
  });

  addTable(s,
    ["Cấu hình", "ImageNet", "Retrieval"],
    [
      ["Đầy đủ", "85.8%", "63.9%"],
      ["Bỏ KoLeo", "85.3% (-0.5)", "55.6% (-8.3!)"],
    ],
    M, 5.0, 5.5
  );

  addProgress(s, 3);

  s.addNotes(`[KOLEO LOSS]

KoLeo từ Kozachenko-Leonenko entropy estimator.

Ý tưởng: đẩy mỗi embedding ra xa neighbor gần nhất của nó.
→ Embeddings trải đều trên hypersphere, không cluster.

Công thức: maximize log của min distance to nearest neighbor.

Ablation rất striking:
- Bỏ KoLeo chỉ hurt ImageNet nhẹ (-0.5%)
- Nhưng DESTROY retrieval (-8.3%)!

Tại sao?
- Classification chỉ cần linearly separable
- Retrieval cần preserve fine-grained distances

KoLeo applied với weight 0.1, chỉ trên CLS tokens.`);

  return s;
}

module.exports = { create };
