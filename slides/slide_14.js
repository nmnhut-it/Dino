/**
 * Slide 14: Data Curation Pipeline
 */

const {
  C, FONT, FONT_MONO, M, CW,
  addTitle, addProgress, addPlaceholder
, SHAPES } = require('./config');

function create(pres) {
  const s = pres.addSlide();
  s.background = { color: C.bg };

  addTitle(s, "Data Curation: Chất Lượng Quan Trọng Hơn Số Lượng", C.v2);

  // Pipeline
  addPlaceholder(s, M, 1.3, 5.5, 4.5,
    "Phễu lọc: 1.2B → 1.1B → 744M → 142M", C.v2);

  // Các bước
  s.addText("Pipeline xử lý:", {
    x: 6.2, y: 1.3, w: 6.6, h: 0.4,
    fontFace: FONT, fontSize: 18, bold: true, color: C.v2,
  });

  const steps = [
    "1.2B ảnh raw (crawl từ web)",
    "  ↓ Lọc NSFW, domains bị cấm",
    "1.1B",
    "  ↓ Loại trùng bằng PCA hash",
    "  ↓ Copy-detection (sim > 0.6)",
    "744M",
    "  ↓ Loại ảnh giống test sets",
    "  ↓ K-means sampling (100k clusters)",
    "142M đã curate",
  ];

  s.addText(steps.join("\n"), {
    x: 6.2, y: 1.7, w: 6.6, h: 3,
    fontFace: FONT_MONO, fontSize: 14, color: C.black,
  });

  // Implementation
  s.addText("Triển khai: Faiss (GPU), 20 nodes × 8 V100", {
    x: 6.2, y: 4.8, w: 6.6, h: 0.4,
    fontFace: FONT, fontSize: 14, italic: true, color: C.medGray,
  });

  // Key finding
  s.addShape(SHAPES.RECTANGLE, {
    x: M, y: 5.8, w: CW, h: 0.7,
    fill: { color: "FFF3E0" },
    line: { color: C.v2, pt: 2 },
  });
  s.addText("Kết quả bất ngờ: 142M curated THẮNG 1.2B uncurated trên MỌI benchmark!", {
    x: M + 0.2, y: 5.9, w: CW - 0.4, h: 0.6,
    fontFace: FONT, fontSize: 20, bold: true, color: C.v2, valign: "middle",
  });

  addProgress(s, 3);

  s.addNotes(`[DATA CURATION]

Từ 1.2 tỉ ảnh raw, filter xuống còn 142 triệu.

Các bước:
1. Lọc NSFW, restricted domains
2. Loại trùng bằng PCA hash
3. Copy-detection với cosine similarity > 0.6
4. Loại ảnh quá giống test benchmarks (tránh data leak)
5. K-means clustering + sampling

Kết quả BẤT NGỜ:
142M curated THẮNG 1.2B uncurated trên TẤT CẢ benchmarks!
Ít hơn 8 lần mà tốt hơn.

Quality > Quantity.

Data xấu (duplicates, NSFW, biased) làm hại training.
Curated data = diverse + clean + balanced.`);

  return s;
}

module.exports = { create };
