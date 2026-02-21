/**
 * Slide 1: Demo - Attention Maps
 * Hook slide - gây tò mò
 */

const {
  C, FONT, M, CW,
  addTitle, addSubtitle, addProgress, addPlaceholder, addBullets
} = require('./config');

function create(pres) {
  const s = pres.addSlide();
  s.background = { color: C.bg };

  addTitle(s, "DINO: Model Tự Học Phân Biệt Vật Thể");
  addSubtitle(s, "\"Lạ thật... Không ai dạy mà nó biết!\"");

  // Hình attention maps
  addPlaceholder(s, M, 1.4, 6, 4.5,
    "Attention maps: Đầu cá (đỏ), Thân (xanh lá), Nền nước (xanh dương)", C.v1);

  // Giải thích
  s.addText("Chuyện gì đang xảy ra?", {
    x: 6.8, y: 1.5, w: 6, h: 0.5,
    fontFace: FONT, fontSize: 22, bold: true, color: C.accent,
  });

  addBullets(s, [
    "Head 1 chỉ nhìn vào ĐẦU cá",
    "Head 2 chỉ nhìn THÂN và VÂY",
    "Head 3 chỉ nhìn NỀN nước",
    "",
    "Model tự biết tách vật thể!",
    "Nhưng chẳng ai dạy nó cả",
    "Không có nhãn \"đầu\", \"vây\", \"nền\"",
  ], 6.8, 2.0, 6, 4, 20);

  s.addText("Làm sao nó học được vậy?", {
    x: 6.8, y: 5.5, w: 6, h: 0.6,
    fontFace: FONT, fontSize: 24, bold: true, color: C.accent,
  });

  addProgress(s, 1);

  s.addNotes(`[MỞ ĐẦU - tạo tò mò]

Nhìn ảnh này đi. Đây là con cá, và đây là cách model "nhìn" nó.

Mỗi màu là một attention head khác nhau:
- Đỏ: chỉ focus vào đầu
- Xanh lá: chỉ nhìn thân và vây
- Xanh dương: chỉ nhìn nước xung quanh

Lạ chưa? Model tự động biết tách: đâu là cá, đâu là nền.

Nhưng mà... không ai dạy nó đâu là đầu, đâu là vây cả. Không có label nào hết.

Vậy nó học kiểu gì? Đó là câu hỏi hôm nay mình sẽ trả lời.`);

  return s;
}

module.exports = { create };
