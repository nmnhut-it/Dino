/**
 * Slide 3: Vấn đề cần giải quyết
 */

const {
  C, FONT, M, CW,
  addTitle, addProgress
} = require('./config');

function create(pres) {
  const s = pres.addSlide();
  s.background = { color: C.bg };

  addTitle(s, "Vấn Đề: Gán Nhãn Quá Đắt");

  // ImageNet stats
  s.addText("ImageNet:", {
    x: M, y: 1.6, w: 3, h: 0.5,
    fontFace: FONT, fontSize: 24, bold: true, color: C.accent,
  });

  s.addText("22K categories  •  15 triệu ảnh  •  2+ năm", {
    x: M, y: 2.2, w: CW, h: 0.6,
    fontFace: FONT, fontSize: 28, color: C.black,
  });

  // Arrow
  s.addText("↓", {
    x: M, y: 3.2, w: CW, h: 0.8,
    fontFace: FONT, fontSize: 48, color: C.medGray, align: "center",
  });

  // Goal
  s.addText("Mục tiêu:", {
    x: M, y: 4.2, w: 3, h: 0.5,
    fontFace: FONT, fontSize: 24, bold: true, color: C.green,
  });

  s.addText("Tỉ ảnh  •  $0  •  Tự động", {
    x: M, y: 4.8, w: CW, h: 0.6,
    fontFace: FONT, fontSize: 28, color: C.black,
  });

  // Key question
  s.addText("Train model TỐT mà KHÔNG cần nhãn?", {
    x: M, y: 6.0, w: CW, h: 0.5,
    fontFace: FONT, fontSize: 24, bold: true, color: C.accent,
    align: "center",
  });

  // Source
  s.addText("Nguồn: image-net.org, Deng et al. 2009, Russakovsky et al. 2015", {
    x: M, y: 6.6, w: CW, h: 0.3,
    fontFace: FONT, fontSize: 11, italic: true, color: C.medGray,
  });

  addProgress(s, 1);

  s.addNotes(`Vấn đề chính: gán nhãn tốn kém.

ImageNet dataset:
- 22K categories, 15 triệu ảnh
- Thời gian: 2+ năm (2007-2009)
- Dùng Amazon MTurk với 49K workers từ 167 quốc gia

Nguồn:
- image-net.org
- Deng et al. 2009
- Russakovsky et al. 2015

Ảnh trên internet thì vô hạn và free.

Câu hỏi: train model tốt mà không cần nhãn được không?`);

  return s;
}

module.exports = { create };
