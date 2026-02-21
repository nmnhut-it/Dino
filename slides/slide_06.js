/**
 * Slide 6: Collapse Problem
 * Vấn đề nghiêm trọng nhất
 */

const {
  C, FONT, M, CW,
  addTitle, addProgress, addPlaceholder, addTable
} = require('./config');

function create(pres) {
  const s = pres.addSlide();
  s.background = { color: C.bg };

  addTitle(s, "Vấn Đề: Collapse - Mọi Thứ Giống Hệt Nhau", C.accent);

  // Minh họa
  addPlaceholder(s, M, 1.3, CW, 3.2,
    "Mode Collapse: tất cả điểm tụ về 1 chỗ | Uniform Collapse: điểm trải đều như lưới", C.accent);

  // Giải thích
  addTable(s,
    ["Loại Collapse", "Chuyện gì xảy ra", "Hậu quả"],
    [
      ["Mode Collapse", "Mọi ảnh → cùng 1 output", "Loss = 0, nhưng vô nghĩa"],
      ["Uniform Collapse", "Output trải đều, không khác biệt", "Loss thấp, nhưng vô dụng"],
    ],
    M, 4.7, CW * 0.7
  );

  // Tại sao xảy ra
  s.addText("Tại sao lại thế?", {
    x: 9, y: 4.7, w: 3.8, h: 0.4,
    fontFace: FONT, fontSize: 18, bold: true, color: C.accent,
  });
  s.addText("Không có nhãn → không gì buộc Teacher phải output khác nhau cho các ảnh khác nhau.\n\nTeacher và Student \"thông đồng\" → collapse!", {
    x: 9, y: 5.1, w: 3.8, h: 1.5,
    fontFace: FONT, fontSize: 15, color: C.gray,
  });

  addProgress(s, 2);

  s.addNotes(`[VẤN ĐỀ COLLAPSE]

Đây là vấn đề LỚN NHẤT của self-supervised learning.

Mode collapse: Teacher và Student "thông đồng" - cả hai output cùng 1 vector cho MỌI ảnh.
- Ảnh mèo → [0.5, 0.5, ...]
- Ảnh chó → [0.5, 0.5, ...]
- Ảnh xe → [0.5, 0.5, ...]

Loss = 0, training "thành công" nhưng model không học được gì!

Uniform collapse: Output trải đều như uniform distribution - cũng không có ý nghĩa.

Contrastive learning (SimCLR, MoCo) giải quyết bằng negative samples.
DINO có cách khác - KHÔNG cần negatives.

3 tricks tiếp theo sẽ giải quyết vấn đề này.`);

  return s;
}

module.exports = { create };
