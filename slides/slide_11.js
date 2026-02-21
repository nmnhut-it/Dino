/**
 * Slide 11: Multi-crop Strategy
 */

const {
  C, FONT, M, CW,
  addTitle, addProgress, addPlaceholder, addTable
} = require('./config');

function create(pres) {
  const s = pres.addSlide();
  s.background = { color: C.bg };

  addTitle(s, "Multi-crop: Từ Chi Tiết Suy Ra Toàn Cảnh", C.v1);

  // Minh họa
  addPlaceholder(s, M, 1.3, 6.5, 4,
    "Ảnh gốc → 2 global crops lớn + 6 local crops nhỏ", C.v1);

  // Insight
  s.addText("Ý tưởng hay nhất của DINO:", {
    x: 7.2, y: 1.3, w: 5.6, h: 0.4,
    fontFace: FONT, fontSize: 20, bold: true, color: C.v1,
  });
  s.addText("\"Chỉ thấy VÂY CÁ thôi\n→ phải đoán được đây là CON CÁ\"", {
    x: 7.2, y: 1.7, w: 5.6, h: 0.8,
    fontFace: FONT, fontSize: 20, italic: true, color: C.accent,
  });

  // Bảng
  addTable(s,
    ["Loại Crop", "Kích thước", "Phủ bao nhiêu ảnh", "Đưa vào"],
    [
      ["Global (2 cái)", "224×224", "> 50%", "Teacher"],
      ["Local (6 cái)", "96×96", "< 50%", "Student"],
    ],
    7.2, 2.8, 5.6
  );

  // Tại sao buộc hiểu
  s.addText("Tại sao buộc học semantic:", {
    x: 7.2, y: 4.2, w: 5.6, h: 0.4,
    fontFace: FONT, fontSize: 18, bold: true, color: C.black,
  });
  s.addText("Student chỉ thấy cánh chim → phải predict \"đây là con chim\"\n\n→ BUỘC phải hiểu KHÁI NIỆM, không thể chỉ copy pixels!", {
    x: 7.2, y: 4.6, w: 5.6, h: 1.2,
    fontFace: FONT, fontSize: 16, color: C.gray,
  });

  // Chi phí
  s.addText("Chi phí: ~2.4× compute, nhưng đáng giá vì học được semantics", {
    x: M, y: 5.8, w: CW, h: 0.4,
    fontFace: FONT, fontSize: 15, italic: true, color: C.medGray,
  });

  addProgress(s, 2);

  s.addNotes(`[MULTI-CROP]

Đây là insight HAY NHẤT của DINO.

Teacher nhìn global view (>50% ảnh) - thấy cả con cá.
Student nhìn local view (<50% ảnh) - chỉ thấy vây, hoặc mắt.

Student phải predict giống Teacher.

Nghĩa là: Student chỉ thấy vây cá, nhưng phải output giống Teacher (thấy cả con cá).

Điều này BUỘC Student hiểu: "cái vây này thuộc về con cá"
→ Học được semantic concepts mà KHÔNG cần labels!

Không thể chỉ copy pixels - phải thực sự hiểu ngữ nghĩa.

Chi phí tính toán tăng ~2.4×, nhưng xứng đáng.`);

  return s;
}

module.exports = { create };
