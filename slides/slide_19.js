/**
 * Slide 19: 7B Challenge
 */

const {
  C, FONT, M, CW,
  addTitle, addProgress, addPlaceholder, addBullets
} = require('./config');

function create(pres) {
  const s = pres.addSlide();
  s.background = { color: C.bg };

  addTitle(s, "Scale Lên 7B: Vấn Đề Không Ngờ", C.v3);

  // Đồ thị
  addPlaceholder(s, M, 1.3, 7, 3.5,
    "Đồ thị: ImageNet tăng đều | ADE20k đỉnh ở 200k rồi GIẢM", C.v3);

  // Vấn đề
  s.addText("Vấn đề (KHÔNG phải loss explode!):", {
    x: 8, y: 1.3, w: 4.8, h: 0.4,
    fontFace: FONT, fontSize: 18, bold: true, color: C.accent,
  });

  addBullets(s, [
    "Classification tiếp tục lên",
    "Segmentation đỉnh ở ~200k",
    "Rồi BẮT ĐẦU GIẢM!",
    "Patches \"chết\" dần",
  ], 8, 1.7, 4.8, 2.5, 16);

  // Nguyên nhân
  s.addText("Nguyên nhân gốc:", {
    x: M, y: 5.0, w: CW, h: 0.4,
    fontFace: FONT, fontSize: 18, bold: true, color: C.v3,
  });
  s.addText("• CLS token và patch outputs trở nên QUÁ GIỐNG nhau\n• Patches mất tính đặc trưng không gian\n• DINO global loss \"nuốt\" mất iBOT local loss", {
    x: M, y: 5.4, w: CW, h: 1.2,
    fontFace: FONT, fontSize: 18, color: C.gray,
  });

  addProgress(s, 4);

  s.addNotes(`[THÁCH THỨC 7B]

Scale lên 7B gặp vấn đề BẤT NGỜ.

Không phải training diverge - loss vẫn giảm, ImageNet vẫn lên.

Nhưng segmentation (ADE20k) đỉnh ở ~200k iterations rồi BẮT ĐẦU GIẢM!

Nguyên nhân:
- CLS token và patch outputs trở nên quá giống nhau
- Patches "sụp đổ" về phía global summary
- Mất local specificity
- DINO global loss dominate, iBOT bị yếu

Vấn đề không phải "không converge" mà là "converge SAI"!

Dense features bị degrade trong quá trình training.`);

  return s;
}

module.exports = { create };
