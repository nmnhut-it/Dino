/**
 * Slide 4: Tổng Quan - DINO Architecture Overview
 */

const {
  C, FONT, M, CW,
  addTitle, addProgress, addPlaceholder
} = require('./config');

function create(pres) {
  const s = pres.addSlide();
  s.background = { color: C.bg };

  addTitle(s, "Tổng Quan", C.v1);

  // Paper figure placeholder
  addPlaceholder(s, M, 1.3, CW, 4.5,
    "[Hình: Figure 2 từ paper - Teacher-Student framework]", C.v1);

  // Key components list
  s.addText("2 networks  •  2 views  •  1 loss", {
    x: M, y: 6.0, w: CW, h: 0.5,
    fontFace: FONT, fontSize: 24, bold: true, color: C.black, align: "center",
  });

  addProgress(s, 2);

  s.addNotes(`Tổng quan kiến trúc DINO:

Từ paper Figure 2:
- 1 ảnh được crop thành nhiều views
- Student nhận local crops (nhỏ)
- Teacher nhận global crops (lớn)
- Cả 2 dùng cùng kiến trúc nhưng weights khác

Core idea: Student học bắt chước output của Teacher.
Không cần labels!

Slide sau sẽ chi tiết từng network.`);

  return s;
}

module.exports = { create };
