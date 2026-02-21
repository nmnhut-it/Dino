/**
 * Slide 7: EMA Teacher
 */

const {
  C, FONT, M, CW,
  addTitle, addProgress, addFormula, addTable, addBullets
, SHAPES } = require('./config');

function create(pres) {
  const s = pres.addSlide();
  s.background = { color: C.bg };

  addTitle(s, "Trick 1: EMA - Teacher Cập Nhật Cực Chậm", C.v1);

  // Công thức
  addFormula(s, "θₜ ← λ·θₜ + (1-λ)·θₛ\n\nλ = 0.996 → 1.0 (tăng dần theo thời gian)", M, 1.3, 7, 1.4, C.v1);

  // Giải thích
  s.addText("Hiểu đơn giản:", {
    x: M, y: 3.0, w: 6.5, h: 0.4,
    fontFace: FONT, fontSize: 20, bold: true, color: C.black,
  });
  addBullets(s, [
    "Teacher giữ 99.6% weights cũ",
    "Chỉ lấy 0.4% từ Student",
    "λ tăng dần → Teacher càng \"đóng băng\"",
  ], M, 3.4, 6.5, 1.8, 18);

  // Tại sao hoạt động
  s.addText("Tại sao trick này hoạt động:", {
    x: 8, y: 1.3, w: 4.8, h: 0.4,
    fontFace: FONT, fontSize: 20, bold: true, color: C.v1,
  });

  addTable(s,
    ["Lý do", "Giải thích"],
    [
      ["Không \"thông đồng\"", "2 bên update khác tốc độ"],
      ["Teacher > Student", "EMA = trung bình nhiều models"],
      ["Target ổn định", "Teacher thay đổi chậm"],
    ],
    8, 1.8, 4.8
  );

  // Insight quan trọng
  s.addShape(SHAPES.RECTANGLE, {
    x: M, y: 5.3, w: CW, h: 1,
    fill: { color: C.cream },
  });
  s.addText("Phát hiện thú vị: Teacher luôn GIỎI HƠN Student trong suốt quá trình training! Vì EMA = trung bình của nhiều versions → ổn định hơn từng cá thể.", {
    x: M + 0.2, y: 5.4, w: CW - 0.4, h: 0.9,
    fontFace: FONT, fontSize: 16, italic: true, color: C.gray, valign: "middle",
  });

  addProgress(s, 2);

  s.addNotes(`[EMA TEACHER]

EMA = Exponential Moving Average.

Mỗi bước training:
- Teacher giữ 99.6% weights hiện tại
- Lấy 0.4% từ Student

Tại sao hoạt động?
1. Teacher và Student update KHÁC tốc độ → không thể "thông đồng"
2. EMA như trung bình của nhiều models → ổn định hơn
3. Teacher performance tốt hơn Student suốt training!

Đây là Polyak-Ruppert averaging - kỹ thuật từ optimization theory.
Teacher = "ensemble" của tất cả phiên bản Student trước đó.
Trung bình thường tốt hơn từng cá thể.

Nếu Teacher và Student update cùng tốc độ → chúng sẽ đồng lõa collapse.`);

  return s;
}

module.exports = { create };
