/**
 * Slide 20: Gram Anchoring
 */

const {
  C, FONT, M, CW,
  addTitle, addProgress, addFormula
, SHAPES } = require('./config');

function create(pres) {
  const s = pres.addSlide();
  s.background = { color: C.bg };

  addTitle(s, "Gram Anchoring: Giữ Cấu Trúc Tương Quan", C.v3);

  // Gram matrix
  s.addText("Gram Matrix là gì:", {
    x: M, y: 1.2, w: 6, h: 0.4,
    fontFace: FONT, fontSize: 18, bold: true, color: C.v3,
  });
  addFormula(s, "G = X · Xᵀ    (ma trận P × P)\n\nG[i,j] = cosine similarity\n        giữa patch i và patch j", M, 1.6, 6, 1.6, C.v3);

  // Loss
  s.addText("Gram Anchoring Loss:", {
    x: M, y: 3.5, w: 6, h: 0.4,
    fontFace: FONT, fontSize: 18, bold: true, color: C.v3,
  });
  addFormula(s, "L_Gram = ||G_student - G_anchor||²\n\nAnchor = checkpoint từ 200k\n(khi dense features còn tốt)", M, 3.9, 6.5, 1.5, C.v3);

  // Key insight
  s.addShape(SHAPES.RECTANGLE, {
    x: 7.5, y: 1.2, w: 5.3, h: 2.5,
    fill: { color: "E8F5E9" },
    line: { color: C.v3, pt: 2 },
  });
  s.addText("Insight quan trọng:", {
    x: 7.7, y: 1.3, w: 5, h: 0.4,
    fontFace: FONT, fontSize: 18, bold: true, color: C.v3,
  });
  s.addText("Ràng buộc CẤU TRÚC TƯƠNG TỰ, không phải giá trị cụ thể.\n\nFeatures có thể xoay/scale/shift - chỉ cần giữ quan hệ giữa các patches!\n\n\"Tai gần mắt hơn nền\" → GIỮ NGUYÊN", {
    x: 7.7, y: 1.7, w: 5, h: 2,
    fontFace: FONT, fontSize: 15, color: C.black,
  });

  // Refinement loss
  s.addText("Loss tổng hợp:", {
    x: 7.5, y: 4, w: 5.3, h: 0.4,
    fontFace: FONT, fontSize: 18, bold: true, color: C.black,
  });
  addFormula(s, "L = DINO + iBOT + KoLeo + 2×Gram", 7.5, 4.4, 5.3, 0.8, C.v3);

  // Hiệu quả
  s.addText("Hiệu quả: Cải thiện sau chỉ 10k iterations!", {
    x: M, y: 5.8, w: CW, h: 0.4,
    fontFace: FONT, fontSize: 18, bold: true, color: C.v3,
  });

  addProgress(s, 4);

  s.addNotes(`[GRAM ANCHORING]

Gram matrix G = X·Xᵀ encode pairwise similarities.
G[i,j] = cosine similarity giữa patch i và patch j.

Gram Anchoring:
- Lấy checkpoint từ 200k (khi dense features còn tốt)
- Ràng buộc Student's Gram matrix phải gần Anchor's Gram matrix

KEY INSIGHT:
Đây là SOFT constraint - chỉ giữ structure, không giữ giá trị.
Features có thể xoay, scale, shift - chỉ cần preserve relations.

Ví dụ: "patch tai gần patch mắt hơn patch nền" → phải giữ nguyên

Hiệu quả gần như tức thì - improvement sau chỉ 10k iterations.`);

  return s;
}

module.exports = { create };
