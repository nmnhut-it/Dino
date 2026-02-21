/**
 * Slide 5: Student - Student Network Architecture
 */

const {
  C, FONT, M, CW,
  addTitle, addProgress
, SHAPES } = require('./config');

function create(pres) {
  const s = pres.addSlide();
  s.background = { color: C.bg };

  addTitle(s, "Student", C.v1);

  // Architecture diagram
  s.addShape(SHAPES.RECTANGLE, {
    x: M, y: 1.4, w: CW, h: 2.8,
    fill: { color: "F5F5F5" },
    line: { color: C.v1, pt: 1 },
  });

  // Flow: Input → Backbone → Head → Output
  const flowY = 2.6;
  const boxW = 2.5;
  const boxH = 1;

  // Input
  s.addShape(SHAPES.RECTANGLE, {
    x: 1, y: flowY, w: boxW, h: boxH,
    fill: { color: C.cream },
    line: { color: C.gray, pt: 1 },
  });
  s.addText("Local crops\n96×96", {
    x: 1, y: flowY, w: boxW, h: boxH,
    fontFace: FONT, fontSize: 16, color: C.black, align: "center", valign: "middle",
  });

  // Arrow 1
  s.addText("→", {
    x: 3.5, y: flowY, w: 0.8, h: boxH,
    fontFace: FONT, fontSize: 32, color: C.gray, align: "center", valign: "middle",
  });

  // Backbone
  s.addShape(SHAPES.RECTANGLE, {
    x: 4.3, y: flowY, w: boxW, h: boxH,
    fill: { color: C.v1 },
  });
  s.addText("ViT\nBackbone f", {
    x: 4.3, y: flowY, w: boxW, h: boxH,
    fontFace: FONT, fontSize: 16, bold: true, color: "FFFFFF", align: "center", valign: "middle",
  });

  // Arrow 2
  s.addText("→", {
    x: 6.8, y: flowY, w: 0.8, h: boxH,
    fontFace: FONT, fontSize: 32, color: C.gray, align: "center", valign: "middle",
  });

  // Head
  s.addShape(SHAPES.RECTANGLE, {
    x: 7.6, y: flowY, w: boxW, h: boxH,
    fill: { color: C.v1 },
  });
  s.addText("MLP Head h\n3 layers", {
    x: 7.6, y: flowY, w: boxW, h: boxH,
    fontFace: FONT, fontSize: 16, bold: true, color: "FFFFFF", align: "center", valign: "middle",
  });

  // Arrow 3
  s.addText("→", {
    x: 10.1, y: flowY, w: 0.8, h: boxH,
    fontFace: FONT, fontSize: 32, color: C.gray, align: "center", valign: "middle",
  });

  // Output
  s.addShape(SHAPES.RECTANGLE, {
    x: 10.9, y: flowY, w: 1.8, h: boxH,
    fill: { color: C.cream },
    line: { color: C.gray, pt: 1 },
  });
  s.addText("P_s\nK dims", {
    x: 10.9, y: flowY, w: 1.8, h: boxH,
    fontFace: FONT, fontSize: 16, color: C.black, align: "center", valign: "middle",
  });

  // Key specs
  s.addText("g = h ∘ f", {
    x: M, y: 4.5, w: 3, h: 0.5,
    fontFace: "Consolas", fontSize: 24, bold: true, color: C.v1,
  });

  s.addText("• Backbone: ViT (Vision Transformer)\n• Head: 3-layer MLP, 2048 hidden, K=65536 output\n• Được train bằng gradient descent", {
    x: M, y: 5.1, w: CW, h: 1.3,
    fontFace: FONT, fontSize: 20, color: C.black,
  });

  addProgress(s, 2);

  s.addNotes(`Student network architecture:

g = h ∘ f nghĩa là:
- f = backbone (ViT)
- h = projection head (MLP)
- g = toàn bộ network

Specs:
- Backbone: ViT-S/16 hoặc lớn hơn
- Head: 3-layer MLP
  - Hidden dim: 2048
  - Output dim: K=65536
  - Weight normalization
  - No batch normalization

Student nhận LOCAL crops (96×96).
Được train trực tiếp bằng gradient descent.`);

  return s;
}

module.exports = { create };
