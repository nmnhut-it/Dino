/**
 * Slide 19: 7B Challenge
 */

const {
  C, FONT, M, CW,
  addTitle, addProgress, addPlaceholder
, SHAPES } = require('./config');

function create(pres) {
  const s = pres.addSlide();
  s.background = { color: C.bg };

  addTitle(s, "Scale Lên 7B: Vấn Đề Không Ngờ", C.v3);

  // Chart placeholder
  addPlaceholder(s, M, 1.4, CW, 2.8,
    "[Classification: lên đều | Segmentation: đỉnh 200k rồi GIẢM]", C.v3);

  // Problem box
  s.addShape(SHAPES.RECTANGLE, {
    x: M, y: 4.5, w: CW, h: 1.8,
    fill: { color: "FFF5F5" },
    line: { color: C.accent, pt: 2 },
  });

  s.addText("Vấn đề:", {
    x: M + 0.2, y: 4.7, w: 3, h: 0.4,
    fontFace: FONT, fontSize: 20, bold: true, color: C.accent,
  });

  s.addText("• Dense features bị degrade\n• Patches \"chết\" dần, mất local info\n• DINO loss dominates, iBOT bị yếu", {
    x: M + 0.2, y: 5.1, w: CW - 0.4, h: 1.1,
    fontFace: FONT, fontSize: 18, color: C.black,
  });

  addProgress(s, 4);

  s.addNotes(`Scale lên 7B gặp vấn đề BẤT NGỜ.

Không phải training diverge - loss vẫn giảm.
Classification vẫn lên.

Nhưng segmentation đỉnh ở ~200k rồi BẮT ĐẦU GIẢM!

Nguyên nhân:
- CLS token và patch outputs quá giống nhau
- Patches "sụp đổ" về global summary
- DINO global loss dominate

Không phải "không converge" mà là "converge SAI".`);

  return s;
}

module.exports = { create };
