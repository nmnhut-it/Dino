/**
 * Slide 6: Teacher - Teacher Network Architecture
 */

const {
  C, FONT, M, CW,
  addTitle, addProgress
, SHAPES } = require('./config');

function create(pres) {
  const s = pres.addSlide();
  s.background = { color: C.bg };

  addTitle(s, "Teacher", C.v1);

  // Architecture diagram
  s.addShape(SHAPES.RECTANGLE, {
    x: M, y: 1.4, w: CW, h: 2.8,
    fill: { color: "F5F5F5" },
    line: { color: C.green, pt: 1 },
  });

  // Flow: Input → Backbone → Head → Centering → Output
  const flowY = 2.6;
  const boxW = 2.2;
  const boxH = 1;

  // Input
  s.addShape(SHAPES.RECTANGLE, {
    x: 0.8, y: flowY, w: boxW, h: boxH,
    fill: { color: C.cream },
    line: { color: C.gray, pt: 1 },
  });
  s.addText("Global crops\n224×224", {
    x: 0.8, y: flowY, w: boxW, h: boxH,
    fontFace: FONT, fontSize: 15, color: C.black, align: "center", valign: "middle",
  });

  // Arrow 1
  s.addText("→", {
    x: 3, y: flowY, w: 0.6, h: boxH,
    fontFace: FONT, fontSize: 28, color: C.gray, align: "center", valign: "middle",
  });

  // Backbone
  s.addShape(SHAPES.RECTANGLE, {
    x: 3.6, y: flowY, w: boxW, h: boxH,
    fill: { color: C.green },
  });
  s.addText("ViT\nBackbone f", {
    x: 3.6, y: flowY, w: boxW, h: boxH,
    fontFace: FONT, fontSize: 15, bold: true, color: "FFFFFF", align: "center", valign: "middle",
  });

  // Arrow 2
  s.addText("→", {
    x: 5.8, y: flowY, w: 0.6, h: boxH,
    fontFace: FONT, fontSize: 28, color: C.gray, align: "center", valign: "middle",
  });

  // Head
  s.addShape(SHAPES.RECTANGLE, {
    x: 6.4, y: flowY, w: boxW, h: boxH,
    fill: { color: C.green },
  });
  s.addText("MLP Head h\n3 layers", {
    x: 6.4, y: flowY, w: boxW, h: boxH,
    fontFace: FONT, fontSize: 15, bold: true, color: "FFFFFF", align: "center", valign: "middle",
  });

  // Arrow 3
  s.addText("→", {
    x: 8.6, y: flowY, w: 0.6, h: boxH,
    fontFace: FONT, fontSize: 28, color: C.gray, align: "center", valign: "middle",
  });

  // Centering
  s.addShape(SHAPES.RECTANGLE, {
    x: 9.2, y: flowY, w: 1.8, h: boxH,
    fill: { color: C.accent },
  });
  s.addText("Centering\n- c", {
    x: 9.2, y: flowY, w: 1.8, h: boxH,
    fontFace: FONT, fontSize: 15, bold: true, color: "FFFFFF", align: "center", valign: "middle",
  });

  // Arrow 4
  s.addText("→", {
    x: 11, y: flowY, w: 0.6, h: boxH,
    fontFace: FONT, fontSize: 28, color: C.gray, align: "center", valign: "middle",
  });

  // Output
  s.addShape(SHAPES.RECTANGLE, {
    x: 11.6, y: flowY, w: 1.2, h: boxH,
    fill: { color: C.cream },
    line: { color: C.gray, pt: 1 },
  });
  s.addText("P_t\nK dims", {
    x: 11.6, y: flowY, w: 1.2, h: boxH,
    fontFace: FONT, fontSize: 15, color: C.black, align: "center", valign: "middle",
  });

  // Key differences
  s.addText("Khác với Student:", {
    x: M, y: 4.5, w: 4, h: 0.5,
    fontFace: FONT, fontSize: 22, bold: true, color: C.green,
  });

  s.addText("• Input: Global crops (224×224) - thấy nhiều hơn\n• Có thêm Centering: output ← output - c\n• KHÔNG train trực tiếp - dùng EMA", {
    x: M, y: 5.1, w: CW, h: 1.3,
    fontFace: FONT, fontSize: 20, color: C.black,
  });

  addProgress(s, 2);

  s.addNotes(`Teacher network architecture:

Cùng kiến trúc với Student nhưng:

1. Input khác:
   - Teacher: global crops 224×224
   - Student: local crops 96×96
   - Teacher thấy toàn cảnh, Student thấy chi tiết

2. Thêm Centering:
   - output ← output - c
   - c = trung bình output của batch
   - Ngăn collapse

3. Cập nhật khác:
   - KHÔNG dùng gradient descent
   - Dùng EMA từ Student weights
   - Sẽ giải thích chi tiết ở slide EMA`);

  return s;
}

module.exports = { create };
