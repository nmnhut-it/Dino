/**
 * Slide 21: Text Alignment
 */

const {
  C, FONT, M,
  addTitle, addProgress, addPlaceholder, addTable
} = require('./config');

function create(pres) {
  const s = pres.addSlide();
  s.background = { color: C.bg };

  addTitle(s, "Text Alignment: Học Nhìn Trước, Học Nói Sau", C.v3);

  // Minh họa
  addPlaceholder(s, M, 1.3, 6, 3,
    "CLIP: train chung | DINOv3: Phase 1 (SSL), Phase 2 (freeze + text)", C.v3);

  // So sánh
  s.addText("CLIP vs DINOv3:", {
    x: 7, y: 1.3, w: 5.8, h: 0.4,
    fontFace: FONT, fontSize: 18, bold: true, color: C.black,
  });

  addTable(s,
    ["", "CLIP", "DINOv3"],
    [
      ["Vision encoder", "Train chung", "ĐÓNG BĂNG"],
      ["Train gì?", "Cả 2 encoders", "Chỉ text + 2 layers"],
      ["Features dùng", "Chỉ CLS", "CLS + patches"],
      ["Dense tasks", "Kém", "Xuất sắc"],
    ],
    7, 1.7, 5.8
  );

  // Kết quả
  s.addText("Kết quả segmentation:", {
    x: M, y: 4.8, w: 6, h: 0.4,
    fontFace: FONT, fontSize: 18, bold: true, color: C.v3,
  });

  addTable(s,
    ["Model", "ADE20k mIoU"],
    [
      ["CLIP ViT-L", "6.0"],
      ["EVA-02-CLIP", "10.9"],
      ["DINOv3", "24.7 (tốt gấp 4!)"],
    ],
    M, 5.2, 5
  );

  addProgress(s, 4);

  s.addNotes(`[TEXT ALIGNMENT]

CLIP train vision và text CHUNG → vision features bị degrade cho dense tasks.

DINOv3 dùng decoupled training:
- Phase 1: Train SSL backbone (1M iterations, không text)
- Phase 2: ĐÓNG BĂNG vision, chỉ train text encoder

Ưu điểm:
- Vision features = pure visual understanding
- Thêm text KHÔNG làm hỏng vision
- Dense features PRESERVED

Kết quả:
DINOv3 đạt 24.7 mIoU vs CLIP 6.0 → tốt gấp 4 lần!

"Học nhìn trước, học nói sau" - không để language bias ảnh hưởng vision.`);

  return s;
}

module.exports = { create };
