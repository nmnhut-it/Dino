/**
 * Slide 18: DINOv2 Results
 */

const {
  C, FONT, M, CW,
  addTitle, addProgress, addTable
, SHAPES } = require('./config');

function create(pres) {
  const s = pres.addSlide();
  s.background = { color: C.bg };

  addTitle(s, "Kết Quả DINOv2 - Foundation Model Đã Thành Hiện Thực", C.v2);

  // Bảng kết quả
  addTable(s,
    ["Benchmark", "DINOv2", "Trước đó tốt nhất", "Task"],
    [
      ["ImageNet", "86.5%", "82.3% (iBOT)", "Classification"],
      ["ADE20k", "49.0 mIoU", "44.6 (iBOT)", "Segmentation"],
      ["Oxford-M", "64.6%", "39.0% (iBOT)", "Retrieval"],
      ["NYUd", "0.279 RMSE", "0.358 (iBOT)", "Depth"],
    ],
    M, 1.3, CW * 0.75
  );

  // Foundation Model
  s.addShape(SHAPES.RECTANGLE, {
    x: M, y: 3.8, w: CW, h: 1,
    fill: { color: "FFF3E0" },
    line: { color: C.v2, pt: 2 },
  });
  s.addText("Foundation Model đã đạt được:\n1 backbone (FROZEN) + linear head đơn giản → SOTA trên nhiều tasks", {
    x: M + 0.2, y: 3.9, w: CW - 0.4, h: 0.9,
    fontFace: FONT, fontSize: 20, bold: true, color: C.v2, valign: "middle",
  });

  // So với CLIP
  s.addText("So với models dùng text:", {
    x: M, y: 5.1, w: CW, h: 0.4,
    fontFace: FONT, fontSize: 18, bold: true, color: C.black,
  });

  addTable(s,
    ["Model", "ImageNet", "ADE20k", "Dùng Text?"],
    [
      ["OpenCLIP ViT-G", "86.2%", "46.0", "CÓ (LAION-2B)"],
      ["DINOv2 ViT-g", "86.5%", "49.0", "KHÔNG"],
    ],
    M, 5.5, CW * 0.7
  );

  addProgress(s, 3);

  s.addNotes(`[KẾT QUẢ V2]

DINOv2 = Foundation Model thực sự.

1 backbone, FROZEN, chỉ thêm linear head đơn giản:
- 86.5% ImageNet (SOTA)
- 49.0 mIoU ADE20k (SOTA)
- 64.6% Oxford retrieval (SOTA)
- Depth estimation (SOTA)

So với OpenCLIP (dùng tỉ image-text pairs):
DINOv2 KHÔNG dùng text mà vẫn THẮNG!

Pure visual self-supervision với đúng losses và đúng data curation = đủ mạnh.`);

  return s;
}

module.exports = { create };
