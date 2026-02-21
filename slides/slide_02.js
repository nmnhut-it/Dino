/**
 * Slide 2: The Goal - Bài toán cần giải
 */

const {
  C, FONT, M, CW,
  addTitle, addProgress, addTable, addBullets
, SHAPES } = require('./config');

function create(pres) {
  const s = pres.addSlide();
  s.background = { color: C.bg };

  addTitle(s, "Bài Toán: Dạy Máy Mà Không Cần Gán Nhãn");

  // So sánh
  addTable(s,
    ["", "Cách truyền thống", "Cái mình muốn"],
    [
      ["Dữ liệu", "14 triệu ảnh CÓ nhãn", "Tỉ ảnh KHÔNG nhãn"],
      ["Chi phí", "500 nghìn đô + 2 năm", "Gần như 0 đồng"],
      ["Giới hạn", "Phụ thuộc người gán", "Vô hạn (internet)"],
    ],
    M, 1.4, CW * 0.6
  );

  // Câu hỏi chính
  s.addShape(SHAPES.RECTANGLE, {
    x: M, y: 4.2, w: CW, h: 1.2,
    fill: { color: C.cream },
    line: { color: C.accent, pt: 2 },
  });
  s.addText("Liệu có thể train model GIỎI như có nhãn, mà KHÔNG CẦN nhãn?", {
    x: M + 0.3, y: 4.35, w: CW - 0.6, h: 1,
    fontFace: FONT, fontSize: 26, bold: true, color: C.accent,
    align: "center", valign: "middle",
  });

  // Tại sao quan trọng
  s.addText("Tại sao phải làm vậy?", {
    x: M, y: 5.6, w: 3, h: 0.4,
    fontFace: FONT, fontSize: 20, bold: true, color: C.black,
  });
  addBullets(s, [
    "Ảnh trên mạng: VÔ HẠN, miễn phí",
    "Ảnh có nhãn: ĐẮT, chậm, có giới hạn",
    "Giải được → scale lên vô tận",
  ], M, 5.9, CW, 1.2, 18);

  addProgress(s, 1);

  s.addNotes(`[VẤN ĐỀ CẦN GIẢI]

ImageNet - bộ dữ liệu nổi tiếng nhất - có 14 triệu ảnh.
Gán nhãn tốn 500 nghìn đô, mất 2 năm.

Đó là cái "nút cổ chai" lớn nhất của deep learning bây giờ.

Trong khi đó, ảnh trên internet thì vô hạn. Facebook có hàng tỉ ảnh. Nhưng không có nhãn.

Câu hỏi đặt ra: Có cách nào train model mà không cần nhãn, nhưng vẫn giỏi như có nhãn không?

Nếu làm được, mình có thể scale lên vô hạn - không còn phụ thuộc vào việc gán nhãn nữa.

Đó chính là bài toán DINO giải quyết.`);

  return s;
}

module.exports = { create };
