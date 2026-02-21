/**
 * Slide 15: iBOT Loss
 */

const {
  C, FONT, M, CW,
  addTitle, addProgress, addFormula, addPlaceholder, addTable
} = require('./config');

function create(pres) {
  const s = pres.addSlide();
  s.background = { color: C.bg };

  addTitle(s, "iBOT: Che Patches, Đoán Ý Nghĩa", C.v2);

  // Minh họa
  addPlaceholder(s, M, 1.3, 6, 3,
    "Student thấy ảnh bị che | Teacher thấy ảnh đầy đủ", C.v2);

  // Công thức
  s.addText("Công thức iBOT:", {
    x: 7, y: 1.3, w: 5.8, h: 0.4,
    fontFace: FONT, fontSize: 18, bold: true, color: C.v2,
  });
  addFormula(s, "L_iBOT = -Σᵢ pₜᵢ · log(pₛᵢ)\n\ni = vị trí patches bị che\nStudent đoán semantic token\n(không phải đoán pixel)", 7, 1.7, 5.8, 1.8, C.v2);

  // So sánh với MAE
  s.addText("So sánh với MAE:", {
    x: M, y: 4.6, w: CW, h: 0.4,
    fontFace: FONT, fontSize: 18, bold: true, color: C.black,
  });

  addTable(s,
    ["", "MAE", "iBOT"],
    [
      ["Đoán gì?", "Pixel values", "Semantic tokens"],
      ["Loss", "MSE (L2)", "Cross-entropy"],
      ["Features", "Cần fine-tune", "FROZEN vẫn tốt"],
    ],
    M, 5.0, CW * 0.7
  );

  // Note
  s.addText("Ở scale lớn: Tách riêng DINO head và iBOT head cho kết quả tốt hơn", {
    x: 9, y: 5.5, w: 4, h: 0.6,
    fontFace: FONT, fontSize: 14, italic: true, color: C.medGray,
  });

  addProgress(s, 3);

  s.addNotes(`[iBOT LOSS]

iBOT = image BERT.

Ý tưởng như BERT: che một phần, đoán phần bị che.

Student nhận ảnh bị che (masked).
Teacher nhận ảnh đầy đủ.
Student phải predict Teacher output tại vị trí masked.

Khác MAE ở chỗ:
- MAE đoán pixel values → texture, low-level
- iBOT đoán semantic token từ Teacher → high-level meaning

Ví dụ:
- MAE: "pixel này màu xanh"
- iBOT: "đây là phần tai của con chó"

Kết quả: frozen iBOT features hoạt động gần như fine-tuned MAE trên segmentation.

Ở scale lớn, UNTIED heads (tách riêng DINO và iBOT heads) tốt hơn.`);

  return s;
}

module.exports = { create };
