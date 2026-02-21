/**
 * Slide 17: Three Losses Combined
 */

const {
  C, FONT, M, CW,
  addTitle, addProgress, addFormula, addPlaceholder, addTable
} = require('./config');

function create(pres) {
  const s = pres.addSlide();
  s.background = { color: C.bg };

  addTitle(s, "Ba Losses Kết Hợp - Mỗi Cái Một Việc", C.v2);

  // Minh họa
  addPlaceholder(s, M, 1.3, 6, 3.5,
    "ViT → CLS (DINO) + Patches (iBOT) + Diversity (KoLeo)", C.v2);

  // Công thức
  addFormula(s, "L_total = L_DINO + L_iBOT + 0.1 × L_KoLeo", 7, 1.3, 5.8, 0.8, C.v2);

  // Mỗi loss làm gì
  s.addText("Mỗi loss phụ trách gì:", {
    x: 7, y: 2.3, w: 5.8, h: 0.4,
    fontFace: FONT, fontSize: 18, bold: true, color: C.black,
  });

  addTable(s,
    ["Loss", "Nhìn vào", "Tốt cho task"],
    [
      ["DINO", "CLS token", "Classification, retrieval"],
      ["iBOT", "Masked patches", "Segmentation, depth"],
      ["KoLeo", "Batch diversity", "Retrieval precision"],
    ],
    7, 2.7, 5.8
  );

  // Ablation
  s.addText("Bỏ từng cái thì sao:", {
    x: M, y: 5.0, w: CW, h: 0.4,
    fontFace: FONT, fontSize: 18, bold: true, color: C.accent,
  });

  addTable(s,
    ["Bỏ đi", "ImageNet", "ADE20k mIoU", "Retrieval"],
    [
      ["Không bỏ gì", "85.8%", "47.1", "63.9%"],
      ["Bỏ KoLeo", "85.3%", "47.2", "55.6%"],
      ["Bỏ iBOT", "85.3%", "44.2 (-2.9)", "64.3%"],
    ],
    M, 5.4, CW * 0.8
  );

  addProgress(s, 3);

  s.addNotes(`[BA LOSSES]

Ba losses, mỗi cái lo một việc:

DINO: CLS token → global understanding → classification
iBOT: Patches → local understanding → segmentation
KoLeo: Diversity → không cluster → retrieval

Ablation:
- Bỏ KoLeo → retrieval tụt 8%
- Bỏ iBOT → segmentation tụt 3 mIoU

Không phải small effects. Mỗi loss đều cần thiết.

DINO + iBOT + KoLeo = comprehensive learning signal
- Global + Local + Diversity`);

  return s;
}

module.exports = { create };
