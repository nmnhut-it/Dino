/**
 * Slide Emerging Properties - Attention Maps = Segmentation
 * DINOv1's key discovery: self-attention heads learn to segment objects
 */

const {
  C, FONT, M, CW,
  addTitle, addProgress, addPlaceholder
, SHAPES } = require('./config');

function create(pres) {
  const s = pres.addSlide();
  s.background = { color: C.bg };

  addTitle(s, "Emerging Properties", C.v1);

  // Subtitle
  s.addText("Attention Maps = Segmentation (không cần labels!)", {
    x: M, y: 1.1, w: CW, h: 0.5,
    fontFace: FONT, fontSize: 22, italic: true, color: C.gray, align: "center",
  });

  // Left: Original image placeholder
  addPlaceholder(s, M, 1.8, 3.8, 2.8, "Ảnh gốc\n(con khỉ/cá)", C.v1);

  // Right: Attention map placeholder
  addPlaceholder(s, M + 4.1, 1.8, 3.8, 2.8, "Attention map\n(heatmap)", C.accent);

  // Arrow between
  s.addText("→", {
    x: M + 3.8, y: 2.8, w: 0.5, h: 0.8,
    fontFace: FONT, fontSize: 36, bold: true, color: C.v1, align: "center",
  });

  // Key points box
  s.addShape(SHAPES.RECTANGLE, {
    x: 8.5, y: 1.8, w: 4.3, h: 2.8,
    fill: { color: C.cream },
  });

  s.addText("Phát hiện:", {
    x: 8.7, y: 1.95, w: 3.9, h: 0.4,
    fontFace: FONT, fontSize: 18, bold: true, color: C.v1,
  });

  s.addText("• Heads tự segment objects\n• Không cần segmentation labels\n• Head khác → part khác\n  (đầu, thân, nền)\n• Chỉ ViT + DINO có!", {
    x: 8.7, y: 2.4, w: 3.9, h: 2.0,
    fontFace: FONT, fontSize: 15, color: C.black,
  });

  // Bottom explanation box
  s.addShape(SHAPES.RECTANGLE, {
    x: M, y: 4.9, w: CW, h: 1.2,
    fill: { color: "E3F2FD" },
    line: { color: C.v1, pt: 1 },
  });

  s.addText("Tại sao xảy ra?", {
    x: M + 0.3, y: 5.05, w: 3, h: 0.35,
    fontFace: FONT, fontSize: 16, bold: true, color: C.v1,
  });

  s.addText("Supervised chỉ cần biết \"đây là chó\". DINO so sánh local/global crops → buộc model hiểu VÙNG NÀO quan trọng → tự học segment!", {
    x: M + 0.3, y: 5.45, w: CW - 0.6, h: 0.5,
    fontFace: FONT, fontSize: 15, color: C.black,
  });

  // Source
  s.addText("Source: Caron et al. ICCV 2021, Figure 1", {
    x: M, y: 6.3, w: CW, h: 0.3,
    fontFace: FONT, fontSize: 11, italic: true, color: C.medGray,
  });

  addProgress(s, 2);

  s.addNotes(`EMERGING PROPERTIES - Đây là phát hiện quan trọng nhất của paper!

Attention map của CLS token ở layer cuối tự động segment vật thể khỏi nền.
- Head 1: focus vào đầu
- Head 2: focus vào thân
- Head 3: focus vào nền
→ Như semantic segmentation nhưng KHÔNG AI DẠY!

Tại sao xảy ra?
- Supervised learning: chỉ cần output đúng class, không cần hiểu spatial
- DINO: Student nhìn local crop (chỉ vây cá) nhưng phải match Teacher
  nhìn global crop (cả con cá)
- Buộc model hiểu: "vùng này thuộc về object", "vùng này là background"
- Multi-crop strategy tạo ra spatial understanding tự nhiên

Điều này CHỈ xảy ra với:
- ViT + DINO: ✓ Có
- ViT + Supervised: ✗ Không có
- CNN + DINO: ✗ Không có
→ Sự kết hợp của ViT architecture + DINO training tạo ra emerging property này

Ứng dụng:
- Pseudo-segmentation masks
- Video object tracking (DAVIS benchmark)
- Không cần train segmentation model riêng

Source: Caron et al. ICCV 2021, Figure 1 & Section 5.1`);

  return s;
}

module.exports = { create };
