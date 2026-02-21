/**
 * Slide 13: v1 Limitations → v2 Questions
 */

const {
  C, FONT, M, CW,
  addTitle, addProgress, addTable
, SHAPES } = require('./config');

function create(pres) {
  const s = pres.addSlide();
  s.background = { color: C.bg };

  addTitle(s, "Từ v1 Sang v2: Những Gì Cần Cải Thiện?", C.v2);

  addTable(s,
    ["Khía cạnh", "v1 có gì", "v2 cần trả lời"],
    [
      ["Dữ liệu", "1.28M ảnh (ImageNet)", "Tỉ ảnh? Curate thế nào?"],
      ["Tasks", "Chỉ Classification", "Segmentation, depth được không?"],
      ["Loss", "Chỉ CLS token", "Patch-level features?"],
      ["Model size", "ViT-B/S (86M)", "Tỉ parameters?"],
    ],
    M, 1.3, CW
  );

  // Foundation Model
  s.addShape(SHAPES.RECTANGLE, {
    x: M, y: 4.0, w: CW, h: 1.2,
    fill: { color: C.cream },
    line: { color: C.v2, pt: 2 },
  });
  s.addText("Mục tiêu lớn: Foundation Model", {
    x: M + 0.2, y: 4.1, w: CW - 0.4, h: 0.4,
    fontFace: FONT, fontSize: 18, bold: true, color: C.v2,
  });
  s.addText("\"1 backbone pretrained → dùng cho MỌI tasks → chỉ cần thêm linear head\"", {
    x: M + 0.2, y: 4.5, w: CW - 0.4, h: 0.6,
    fontFace: FONT, fontSize: 20, italic: true, color: C.black,
  });

  // 3 đổi mới
  s.addText("Ba thay đổi chính của v2:", {
    x: M, y: 5.5, w: CW, h: 0.4,
    fontFace: FONT, fontSize: 20, bold: true, color: C.v2,
  });
  s.addText("1. Data Curation (LVD-142M)    2. Ba Losses (DINO + iBOT + KoLeo)    3. Scale lên ViT-g (1.1B)", {
    x: M, y: 5.9, w: CW, h: 0.5,
    fontFace: FONT, fontSize: 18, color: C.gray,
  });

  addProgress(s, 3);

  s.addNotes(`[TỪ V1 SANG V2]

DINOv1 hay nhưng còn hạn chế.

Nếu có TỈ ảnh thì sao? Nhưng data nhiều chưa chắc tốt - cần curate.

Classification thì được, nhưng segmentation, depth estimation thì sao?

CLS token cho global understanding, nhưng patches thì chưa học.

Mục tiêu v2: Foundation Model
- 1 backbone cho tất cả
- Classification, segmentation, depth, retrieval
- Không cần fine-tune - frozen features + simple head

3 đổi mới chính:
1. Data curation pipeline (LVD-142M)
2. 3 losses: DINO + iBOT + KoLeo
3. Scale lên 1.1B parameters`);

  return s;
}

module.exports = { create };
