/**
 * Slide 7: So Sánh - Student vs Teacher Comparison
 */

const {
  C, FONT, M, CW,
  addTitle, addProgress, addTable
} = require('./config');

function create(pres) {
  const s = pres.addSlide();
  s.background = { color: C.bg };

  addTitle(s, "So Sánh", C.v1);

  // Comparison table
  const headers = ["", "Student", "Teacher"];
  const rows = [
    ["Kiến trúc", "g = h ∘ f", "g = h ∘ f (giống)"],
    ["Input", "Local crops 96²", "Global crops 224²"],
    ["Centering", "Không", "Có (- c)"],
    ["Temperature", "τ = 0.1 (soft)", "τ = 0.04 (sharp)"],
    ["Training", "Gradient descent", "EMA từ Student"],
  ];

  addTable(s, headers, rows, M, 1.4, CW);

  // Key insight
  s.addText("Teacher thấy nhiều hơn + output sharp hơn", {
    x: M, y: 4.8, w: CW, h: 0.6,
    fontFace: FONT, fontSize: 24, bold: true, color: C.green, align: "center",
  });

  s.addText("→ Student học \"tóm tắt\" từ cái nhìn toàn cục của Teacher", {
    x: M, y: 5.5, w: CW, h: 0.5,
    fontFace: FONT, fontSize: 20, color: C.black, align: "center",
  });

  addProgress(s, 2);

  s.addNotes(`So sánh Student vs Teacher:

1. Kiến trúc: GIỐNG NHAU
   - Cùng ViT backbone
   - Cùng MLP head

2. Input: KHÁC
   - Student: local crops nhỏ (96×96)
   - Teacher: global crops lớn (224×224)
   - Teacher "thấy" nhiều context hơn

3. Processing: KHÁC
   - Teacher có centering (- c)
   - Teacher dùng temperature thấp hơn (0.04 vs 0.1)

4. Training: KHÁC
   - Student: gradient descent bình thường
   - Teacher: EMA copy từ Student

Key insight: Student học cách "tóm tắt" scene từ Teacher.
Local patch → phải đoán được global context.`);

  return s;
}

module.exports = { create };
