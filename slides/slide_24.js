/**
 * Slide 24: Key Takeaways
 */

const {
  C, FONT, FONT_MONO, M, CW,
  addTitle, addProgress, addTable
} = require('./config');

function create(pres) {
  const s = pres.addSlide();
  s.background = { color: C.bg };

  addTitle(s, "5 Bài Học + Tài Liệu Tham Khảo", C.success);

  // 5 lessons
  s.addText("5 Bài Học Từ DINO:", {
    x: M, y: 1.2, w: 7, h: 0.4,
    fontFace: FONT, fontSize: 20, bold: true, color: C.success,
  });

  addTable(s,
    ["#", "Bài học", "Bằng chứng"],
    [
      ["1", "SSL có thể VƯỢT Supervised", "88.4% vs 85.7%"],
      ["2", "Ngăn collapse là TỐI QUAN TRỌNG", "EMA + Centering + Sharpening"],
      ["3", "Chất lượng data > Số lượng", "142M > 1.2B"],
      ["4", "Dense tasks cần patch-level", "iBOT: -2.9 mIoU nếu bỏ"],
      ["5", "Scale lớn cần tricks ổn định", "Gram Anchoring cho 7B"],
    ],
    M, 1.6, 7.5
  );

  // Công thức
  s.addText("Công thức cốt lõi:", {
    x: 8.5, y: 1.2, w: 4.3, h: 0.4,
    fontFace: FONT, fontSize: 18, bold: true, color: C.black,
  });
  s.addText(`EMA:   θₜ ← λθₜ + (1-λ)θₛ
Center: c ← mc + (1-m)·mean
Loss:   L = -Σ Pₜ·log(Pₛ)
KoLeo:  L = -Σ log(min dist)
Gram:   L = ||Gs - Gt||²`, {
    x: 8.5, y: 1.6, w: 4.3, h: 2,
    fontFace: FONT_MONO, fontSize: 12, color: C.gray,
  });

  // Papers
  s.addText("Bài báo gốc:", {
    x: M, y: 4.8, w: CW, h: 0.4,
    fontFace: FONT, fontSize: 18, bold: true, color: C.black,
  });
  s.addText(`• v1: Caron et al., "Emerging Properties in Self-Supervised Vision Transformers", ICCV 2021
• v2: Oquab et al., "DINOv2: Learning Robust Visual Features", TMLR 2024
• v3: Darcet et al., arXiv 2025`, {
    x: M, y: 5.2, w: CW, h: 1,
    fontFace: FONT, fontSize: 14, color: C.gray,
  });

  // Code
  s.addText("Code: github.com/facebookresearch/dinov2", {
    x: M, y: 6.2, w: CW, h: 0.4,
    fontFace: FONT, fontSize: 16, color: C.v1,
  });

  addProgress(s, 5);

  s.addNotes(`[KẾT LUẬN]

5 bài học:
1. SSL có thể vượt supervised - 88.4% không cần label
2. Collapse prevention là critical - thiếu 1 trong 3 là chết
3. Data quality > quantity - 142M thắng 1.2B
4. Dense tasks cần iBOT - CLS không đủ
5. Scale lớn cần stability tricks - Gram Anchoring

DINO bây giờ là foundation model cho nhiều ứng dụng.

Key insight: Không cần labels, cần ĐÚNG learning signal.

Cảm ơn đã lắng nghe!`);

  return s;
}

module.exports = { create };
