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

  addTitle(s, "Giải Pháp: Gram Anchoring", C.v3);

  // Simple formula
  addFormula(s, "L_Gram = ||G_student - G_anchor||²", M, 1.5, CW, 0.8, C.v3);

  // Explanation
  s.addShape(SHAPES.RECTANGLE, {
    x: M, y: 2.6, w: 5.5, h: 2.5,
    fill: { color: C.cream },
  });

  s.addText("G = ma trận tương quan", {
    x: M + 0.2, y: 2.8, w: 5, h: 0.5,
    fontFace: FONT, fontSize: 18, bold: true, color: C.v3,
  });

  s.addText("• G[i,j] = similarity giữa patch i và j\n• Anchor = checkpoint 200k\n• Giữ CẤU TRÚC, không giữ giá trị", {
    x: M + 0.2, y: 3.3, w: 5, h: 1.6,
    fontFace: FONT, fontSize: 18, color: C.black,
  });

  // Key insight
  s.addShape(SHAPES.RECTANGLE, {
    x: 7, y: 2.6, w: 5.8, h: 2.5,
    fill: { color: "E8F5E9" },
    line: { color: C.success, pt: 2 },
  });

  s.addText("Key insight:", {
    x: 7.2, y: 2.8, w: 5.4, h: 0.5,
    fontFace: FONT, fontSize: 18, bold: true, color: C.success,
  });

  s.addText("\"Tai gần mắt hơn nền\"\n→ Quan hệ này phải GIỮ NGUYÊN\n\nFeatures có thể biến đổi\nnhưng structure phải stable", {
    x: 7.2, y: 3.3, w: 5.4, h: 1.6,
    fontFace: FONT, fontSize: 18, color: C.black,
  });

  // Effect
  s.addText("Hiệu quả sau chỉ 10k iterations!", {
    x: M, y: 5.5, w: CW, h: 0.5,
    fontFace: FONT, fontSize: 22, bold: true, color: C.v3, align: "center",
  });

  addProgress(s, 4);

  s.addNotes(`Gram Anchoring giải quyết vấn đề.

Gram matrix G = ma trận pairwise similarity.
G[i,j] = cosine similarity giữa patch i và j.

Anchor = checkpoint từ 200k (khi dense features còn tốt).

KEY INSIGHT:
Ràng buộc STRUCTURE, không phải values.
Features có thể xoay/scale - chỉ cần giữ relations.

Ví dụ: "tai gần mắt hơn nền" → phải giữ nguyên.

Hiệu quả gần như tức thì - 10k iterations đã thấy improvement.`);

  return s;
}

module.exports = { create };
