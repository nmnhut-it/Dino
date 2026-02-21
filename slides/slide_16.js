/**
 * Slide 16: Three Losses Summary
 */

const {
  C, FONT, M, CW,
  addTitle, addProgress
, SHAPES } = require('./config');

function create(pres) {
  const s = pres.addSlide();
  s.background = { color: C.bg };

  addTitle(s, "3 Losses = 3 Việc", C.v2);

  // Three boxes
  const losses = [
    { name: "DINO", what: "CLS token", task: "Classification", color: C.v1 },
    { name: "iBOT", what: "Patches", task: "Segmentation", color: C.v2 },
    { name: "KoLeo", what: "Diversity", task: "Retrieval", color: C.success },
  ];

  losses.forEach((loss, i) => {
    const x = M + i * 4;

    s.addShape(SHAPES.RECTANGLE, {
      x, y: 1.6, w: 3.6, h: 3,
      fill: { color: C.bg },
      line: { color: loss.color, pt: 3 },
    });

    s.addText(loss.name, {
      x: x + 0.1, y: 1.8, w: 3.4, h: 0.6,
      fontFace: FONT, fontSize: 28, bold: true, color: loss.color, align: "center",
    });

    s.addText(loss.what, {
      x: x + 0.1, y: 2.6, w: 3.4, h: 0.5,
      fontFace: FONT, fontSize: 18, color: C.gray, align: "center",
    });

    s.addText("↓", {
      x: x + 0.1, y: 3.1, w: 3.4, h: 0.4,
      fontFace: FONT, fontSize: 24, color: C.medGray, align: "center",
    });

    s.addText(loss.task, {
      x: x + 0.1, y: 3.5, w: 3.4, h: 0.5,
      fontFace: FONT, fontSize: 18, bold: true, color: C.black, align: "center",
    });
  });

  // Combined result
  s.addText("Kết hợp: Global + Local + Diverse = Foundation Model", {
    x: M, y: 5.2, w: CW, h: 0.6,
    fontFace: FONT, fontSize: 22, bold: true, color: C.v2, align: "center",
  });

  addProgress(s, 3);

  s.addNotes(`3 losses, mỗi cái lo một việc:

DINO: học CLS token → classification
iBOT: học patches → segmentation, depth
KoLeo: đẩy diverse → retrieval

Kết hợp = comprehensive learning:
- Global understanding (DINO)
- Local understanding (iBOT)
- Diversity (KoLeo)

→ Foundation Model: 1 backbone cho mọi task.`);

  return s;
}

module.exports = { create };
