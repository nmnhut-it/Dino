/**
 * Slide 14: DINOv3 - The Problem
 * Dense feature degradation at scale
 */

const {
  C, FONT, M, CW,
  addTitle, addProgress, SHAPES
} = require('./config');

function create(pres) {
  const s = pres.addSlide();
  s.background = { color: C.bg };

  addTitle(s, "DINOv3: Vấn Đề Khi Scale", C.v3);

  // Problem statement
  s.addText("Scale lên 7B params → Dense tasks BỊ GIẢM", {
    x: M, y: 1.3, w: CW, h: 0.6,
    fontFace: FONT, fontSize: 26, bold: true, color: C.accent, align: "center",
  });

  // Visual: Training timeline with degradation
  s.addShape(SHAPES.RECTANGLE, {
    x: M, y: 2.0, w: CW, h: 2.8,
    fill: { color: "FAFAFA" },
    line: { color: C.lightGray, pt: 1 },
  });

  // Timeline arrow
  s.addText("Training iterations →", {
    x: M + 0.3, y: 4.5, w: CW - 0.6, h: 0.3,
    fontFace: FONT, fontSize: 12, italic: true, color: C.gray, align: "center",
  });

  // CLS token line (goes up)
  s.addText("CLS (classification)", {
    x: M + 0.5, y: 2.2, w: 3.5, h: 0.4,
    fontFace: FONT, fontSize: 16, color: C.success,
  });

  s.addShape(SHAPES.RECTANGLE, {
    x: M + 0.5, y: 2.6, w: 5, h: 0.15,
    fill: { color: C.success },
  });
  s.addText("↗ tăng", {
    x: 5.8, y: 2.5, w: 1.5, h: 0.4,
    fontFace: FONT, fontSize: 15, bold: true, color: C.success,
  });

  // Patch tokens line (goes down after 200k)
  s.addText("Patches (dense tasks)", {
    x: M + 0.5, y: 3.1, w: 3.5, h: 0.4,
    fontFace: FONT, fontSize: 16, color: C.accent,
  });

  s.addShape(SHAPES.RECTANGLE, {
    x: M + 0.5, y: 3.5, w: 2.5, h: 0.15,
    fill: { color: C.success },
  });

  s.addShape(SHAPES.RECTANGLE, {
    x: 3.0, y: 3.5, w: 2.5, h: 0.15,
    fill: { color: C.accent },
  });

  s.addText("↘ GIẢM", {
    x: 5.8, y: 3.4, w: 1.5, h: 0.4,
    fontFace: FONT, fontSize: 15, bold: true, color: C.accent,
  });

  s.addText("~200k iter", {
    x: 2.5, y: 3.9, w: 1.5, h: 0.35,
    fontFace: FONT, fontSize: 14, color: C.gray, align: "center",
  });

  // Right side: Why it happens
  s.addShape(SHAPES.RECTANGLE, {
    x: 7.5, y: 2.1, w: 5.3, h: 2.6,
    fill: { color: "FFF3E0" },
    line: { color: C.v3, pt: 1 },
  });

  s.addText("Tại sao xảy ra?", {
    x: 7.7, y: 2.3, w: 4.9, h: 0.45,
    fontFace: FONT, fontSize: 20, bold: true, color: C.v3,
  });

  s.addText("• CLS token \"ăn\" hết capacity\n• Patches mất diversity\n• Correlation structure bị phá\n• Model lớn → vấn đề rõ hơn", {
    x: 7.7, y: 2.8, w: 4.9, h: 1.6,
    fontFace: FONT, fontSize: 18, color: C.black,
  });

  // Bottom: The solution teaser
  s.addShape(SHAPES.RECTANGLE, {
    x: M, y: 5.0, w: CW, h: 1.0,
    fill: { color: "E8F5E9" },
    line: { color: C.v3, pt: 2 },
  });

  s.addText("Giải pháp: Gram Anchoring — giữ correlation structure từ checkpoint tốt", {
    x: M + 0.3, y: 5.2, w: CW - 0.6, h: 0.6,
    fontFace: FONT, fontSize: 22, bold: true, color: C.v3, align: "center",
  });

  addProgress(s, 4);

  s.addNotes(`DINOv2 đã rất tốt — vậy tại sao cần v3?
[pause]

Vấn đề: khi scale từ 1B lên 7B parameters, dense tasks BỊ GIẢM.
Classification vẫn tăng, nhưng segmentation, depth lại tệ hơn.
[pause]

Điều này xảy ra sau khoảng 200k training iterations.
Ban đầu mọi thứ ok, nhưng càng train càng tệ.
[pause]

Tại sao xảy ra?
Khi model lớn, CLS token có quá nhiều capacity.
Nó "ăn" hết thông tin, patches trở nên redundant.
[pause]

Nói cách khác:
- CLS: học tốt global features → classification ok
- Patches: mất diversity, correlation bị phá → dense tasks fail
[pause]

Đây là vấn đề NGHIÊM TRỌNG vì:
- Muốn scale thêm → vấn đề tệ hơn
- Dense tasks là killer feature của DINOv2
- Không giải quyết được → không scale được
[pause]

Giải pháp của v3: Gram Anchoring.
Ý tưởng: "đóng băng" correlation structure từ checkpoint còn tốt.
Slide tiếp sẽ giải thích cách hoạt động.`);

  return s;
}

module.exports = { create };
