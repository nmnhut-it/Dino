/**
 * Slide 3: Teacher-Student Framework
 * Ý tưởng đầu tiên
 */

const {
  C, FONT, M,
  addTitle, addProgress, addPlaceholder, addBullets
} = require('./config');

function create(pres) {
  const s = pres.addSlide();
  s.background = { color: C.bg };

  addTitle(s, "Ý Tưởng: Hai Mạng - Thầy và Trò", C.v1);

  // Sơ đồ
  addPlaceholder(s, M, 1.3, 6.5, 4,
    "Sơ đồ: Ảnh → 2 views → Teacher xử lý view 1, Student xử lý view 2", C.v1);

  // Giải thích
  s.addText("Logic đằng sau:", {
    x: 7.2, y: 1.3, w: 5.5, h: 0.5,
    fontFace: FONT, fontSize: 20, bold: true, color: C.v1,
  });

  s.addText("\"Nhìn con cá từ góc nào, mình cũng biết đó là cá.\n\n→ Model cũng phải cho CÙNG kết quả khi nhìn các góc khác nhau.\"", {
    x: 7.2, y: 1.8, w: 5.5, h: 1.4,
    fontFace: FONT, fontSize: 18, italic: true, color: C.gray,
  });

  // Cách làm
  s.addText("Cách triển khai:", {
    x: 7.2, y: 3.4, w: 5.5, h: 0.5,
    fontFace: FONT, fontSize: 20, bold: true, color: C.black,
  });

  addBullets(s, [
    "Không có nhãn → tự tạo \"đáp án\"",
    "Teacher: Tạo pseudo-label",
    "Student: Học sao cho giống Teacher",
    "Loss: So sánh output hai bên",
  ], 7.2, 3.8, 5.5, 2.5, 18);

  // Cảnh báo
  s.addText("⚠ Nhưng khoan... có vấn đề!", {
    x: 7.2, y: 5.8, w: 5.5, h: 0.5,
    fontFace: FONT, fontSize: 20, bold: true, color: C.accent,
  });

  addProgress(s, 2);

  s.addNotes(`[Ý TƯỞNG ĐẦU TIÊN]

Ý tưởng rất đơn giản:

Mình nhìn con cá từ góc trước, góc sau, góc nghiêng - đều biết đó là cá.
Model cũng phải như vậy.

Cách làm:
- Lấy 1 ảnh, tạo 2 phiên bản khác nhau (crop, xoay, đổi màu...)
- Đưa vào 2 network: Teacher và Student
- Yêu cầu: Output của Student phải giống Teacher

Nghe hợp lý đúng không?

Nhưng mà... có một vấn đề rất lớn. Để slide sau mình nói.`);

  return s;
}

module.exports = { create };
