/**
 * Slide 15: DINOv3 - Solution (Gram Anchoring)
 */

const {
  C, FONT, FONT_MONO, M, CW,
  addTitle, addProgress, SHAPES
} = require('./config');

function create(pres) {
  const s = pres.addSlide();
  s.background = { color: C.bg };

  addTitle(s, "Gram Anchoring", C.v3);

  // Formula box
  s.addShape(SHAPES.RECTANGLE, {
    x: M, y: 1.3, w: CW, h: 0.9,
    fill: { color: "F5F5F5" },
    line: { color: C.v3, pt: 2 },
  });

  s.addText("L_Gram = ||X_S · X_S^T − X_G · X_G^T||²", {
    x: M + 0.3, y: 1.5, w: CW - 0.6, h: 0.6,
    fontFace: FONT_MONO, fontSize: 24, color: C.black, align: "center",
  });

  // Visual: Flow diagram
  s.addText("Ý tưởng:", {
    x: M, y: 2.4, w: CW, h: 0.45,
    fontFace: FONT, fontSize: 22, bold: true, color: C.v3,
  });

  // Step boxes - horizontal flow
  const steps = [
    { label: "1. Save\ncheckpoint tốt", w: 2.8, color: "E3F2FD" },
    { label: "2. Tính Gram\nmatrix (X·X^T)", w: 2.8, color: "FFF3E0" },
    { label: "3. So sánh với\nGram hiện tại", w: 2.8, color: "FCE4EC" },
    { label: "4. Minimize\ndifference", w: 2.8, color: "E8F5E9" },
  ];

  steps.forEach((step, i) => {
    const x = M + i * 3.1;
    const y = 2.9;

    s.addShape(SHAPES.RECTANGLE, {
      x, y, w: step.w, h: 1.2,
      fill: { color: step.color },
      line: { color: C.v3, pt: 1 },
    });

    s.addText(step.label, {
      x, y: y + 0.2, w: step.w, h: 0.8,
      fontFace: FONT, fontSize: 15, color: C.black, align: "center",
    });

    if (i < steps.length - 1) {
      s.addText("→", {
        x: x + step.w - 0.1, y: y + 0.35, w: 0.4, h: 0.5,
        fontFace: FONT, fontSize: 18, color: C.v3,
      });
    }
  });

  // Why Gram matrix?
  s.addShape(SHAPES.RECTANGLE, {
    x: M, y: 4.3, w: 6, h: 1.8,
    fill: { color: "FAFAFA" },
    line: { color: C.lightGray, pt: 1 },
  });

  s.addText("Tại sao Gram matrix?", {
    x: M + 0.2, y: 4.45, w: 5.6, h: 0.4,
    fontFace: FONT, fontSize: 18, bold: true, color: C.v3,
  });

  s.addText("• X·X^T = correlation giữa patches\n• Giữ correlation = giữ diversity\n• Không ép từng patch riêng lẻ\n• Tương tự style transfer!", {
    x: M + 0.2, y: 4.85, w: 5.6, h: 1.2,
    fontFace: FONT, fontSize: 16, color: C.black,
  });

  // Effect
  s.addShape(SHAPES.RECTANGLE, {
    x: 6.8, y: 4.3, w: 6, h: 1.8,
    fill: { color: "E8F5E9" },
    line: { color: C.success, pt: 2 },
  });

  s.addText("Kết quả:", {
    x: 7.0, y: 4.45, w: 5.6, h: 0.4,
    fontFace: FONT, fontSize: 18, bold: true, color: C.success,
  });

  s.addText("• Dense tasks KHÔNG còn degrade\n• Scale 7B ổn định\n• Cả CLS và patches đều tốt\n• +6.9 mIoU so với v2!", {
    x: 7.0, y: 4.85, w: 5.6, h: 1.2,
    fontFace: FONT, fontSize: 16, color: C.black,
  });

  addProgress(s, 4);

  s.addNotes(`Gram Anchoring — giải pháp của DINOv3.
[pause]

Ý tưởng cốt lõi:
1. Save checkpoint tại thời điểm dense tasks còn tốt (~200k iter)
2. Tính Gram matrix = X · X^T — correlation giữa các patch features
3. Trong training tiếp, so sánh Gram matrix hiện tại với "anchor"
4. Thêm loss để minimize sự khác biệt
[pause]

Tại sao Gram matrix?
Gram matrix cho biết mỗi patch liên quan đến patch khác thế nào.
Nếu giữ được correlation này, patches vẫn diverse.
[pause]

Một cách nghĩ khác:
Không ép "patch 1 phải giống checkpoint".
Mà ép "relationship giữa patch 1 và patch 2 phải giữ nguyên".
[pause]

Điều này tương tự style transfer trong Neural Style!
Gatys et al. 2015 dùng Gram matrix để capture style.
DINOv3 dùng để capture "dense feature structure".
[pause]

Kết quả:
- Dense tasks KHÔNG còn degrade khi scale
- 7B params training ổn định
- Cả classification và dense đều tăng
- Cụ thể: +6.9 mIoU segmentation so với v2
[pause]

Vậy là xong phần kỹ thuật. Slide tiếp sẽ tổng hợp kết quả từ v1 đến v3.`);

  return s;
}

module.exports = { create };
