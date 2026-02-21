/**
 * Slide 21: DINOv3 Results
 */

const {
  C, FONT, M, CW,
  addTitle, addProgress
, SHAPES } = require('./config');

function create(pres) {
  const s = pres.addSlide();
  s.background = { color: C.bg };

  addTitle(s, "Kết Quả DINOv3", C.v3);

  // Big numbers
  const results = [
    { num: "88.4%", task: "ImageNet", delta: "+2.0%" },
    { num: "55.9", task: "ADE20k mIoU", delta: "+6.4" },
    { num: "7B", task: "parameters", delta: "" },
  ];

  results.forEach((r, i) => {
    const x = M + i * 4;

    s.addText(r.num, {
      x, y: 1.6, w: 3.5, h: 0.9,
      fontFace: FONT, fontSize: 48, bold: true, color: C.v3,
    });

    s.addText(r.task, {
      x, y: 2.5, w: 3.5, h: 0.4,
      fontFace: FONT, fontSize: 16, color: C.gray,
    });

    if (r.delta) {
      s.addText(r.delta, {
        x, y: 2.9, w: 3.5, h: 0.4,
        fontFace: FONT, fontSize: 16, color: C.success,
      });
    }
  });

  // Achievement box
  s.addShape(SHAPES.RECTANGLE, {
    x: M, y: 3.8, w: CW, h: 1.5,
    fill: { color: "E8F5E9" },
    line: { color: C.v3, pt: 2 },
  });

  s.addText("Thành tựu lịch sử:", {
    x: M + 0.2, y: 4.0, w: CW - 0.4, h: 0.4,
    fontFace: FONT, fontSize: 20, bold: true, color: C.v3,
  });

  s.addText("• SSL ĐẦU TIÊN ngang weakly-supervised\n• SOTA trên COCO, ADE20k với FROZEN backbone", {
    x: M + 0.2, y: 4.4, w: CW - 0.4, h: 0.8,
    fontFace: FONT, fontSize: 18, color: C.black,
  });

  addProgress(s, 4);

  s.addNotes(`Gram Anchoring giải quyết vấn đề dense degradation — kết quả thế nào?
[pause]

88.4% ImageNet — tăng 1.9% so với v2 (86.5%).
Con số tưởng nhỏ, nhưng ở mức này, 1% là rất khó.
Từ 86% lên 88% khó hơn nhiều từ 70% lên 75%.
[pause]

Nhưng số ẤN TƯỢNG NHẤT là dense tasks:
55.9 mIoU ADE20k — tăng 6.9 so với v2 (49.0)!
Dense tasks được lợi NHIỀU NHẤT từ scaling.
[pause]

Tại sao dense tăng nhiều hơn classification?
- Classification: model lớn hơn, đã gần saturate (~88%)
- Dense: cần spatial understanding — đây là thế mạnh của larger models
- Gram Anchoring giữ được dense quality khi scale
[pause]

Thành tựu lịch sử — các bạn nghe kỹ nhé:
SSL ĐẦU TIÊN ngang weakly-supervised trên ImageNet.
[pause]

Weakly-supervised dùng HashTag từ Instagram — 1 tỷ ảnh với text.
DINOv3 không dùng text nào, chỉ ảnh, mà bằng được.
Đây là milestone của SSL: không cần labels DƯỚI BẤT KỲ HÌNH THỨC NÀO.
[pause]

7B parameters — scale này comparable với LLMs.
Nhưng DINOv3 cho thấy visual SSL cũng scale được.
Cùng scaling law như language models.
[pause]

SOTA COCO detection và ADE20k segmentation — cả hai với FROZEN backbone.
Nghĩa là chỉ train detection/segmentation head, backbone giữ nguyên.
Foundation model đích thực — 1 backbone cho mọi task.`);

  return s;
}

module.exports = { create };
