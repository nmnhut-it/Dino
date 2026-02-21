/**
 * Slide 13: Data Curation
 */

const {
  C, FONT, M, CW,
  addTitle, addProgress, addPlaceholder
, SHAPES } = require('./config');

function create(pres) {
  const s = pres.addSlide();
  s.background = { color: C.bg };

  addTitle(s, "Data Curation: Ít Mà Chất", C.v2);

  // Visual pipeline
  addPlaceholder(s, M, 1.4, CW, 2.5,
    "[Phễu: 1.2B → 744M → 142M ảnh]", C.v2);

  // Key steps
  s.addText("Lọc gì?", {
    x: M, y: 4.2, w: 3, h: 0.5,
    fontFace: FONT, fontSize: 20, bold: true, color: C.v2,
  });

  s.addText("• NSFW, domains xấu\n• Ảnh trùng lặp\n• Ảnh giống test sets", {
    x: M, y: 4.7, w: 5, h: 1.2,
    fontFace: FONT, fontSize: 18, color: C.black,
  });

  // Key result
  s.addShape(SHAPES.RECTANGLE, {
    x: 7, y: 4.2, w: 5.8, h: 1.7,
    fill: { color: "FFF3E0" },
    line: { color: C.v2, pt: 2 },
  });

  s.addText("Kết quả bất ngờ:", {
    x: 7.2, y: 4.4, w: 5.4, h: 0.4,
    fontFace: FONT, fontSize: 18, bold: true, color: C.v2,
  });

  s.addText("142M curated\nTHẮNG 1.2B uncurated\ntrên MỌI benchmark!", {
    x: 7.2, y: 4.8, w: 5.4, h: 1,
    fontFace: FONT, fontSize: 20, bold: true, color: C.black,
  });

  addProgress(s, 3);

  s.addNotes(`Data curation: từ 1.2 tỉ → 142 triệu ảnh.

Các bước lọc:
- NSFW, restricted domains
- Ảnh trùng lặp (PCA hash, copy-detection)
- Ảnh giống test benchmarks (tránh data leak)

Kết quả BẤT NGỜ:
142M curated THẮNG 1.2B uncurated!
Ít hơn 8 lần mà tốt hơn.

Quality > Quantity.`);

  return s;
}

module.exports = { create };
