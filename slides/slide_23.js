/**
 * Slide 23: Key Takeaways
 */

const {
  C, FONT, M, CW,
  addTitle, addProgress
, SHAPES } = require('./config');

function create(pres) {
  const s = pres.addSlide();
  s.background = { color: C.bg };

  addTitle(s, "5 Bài Học", C.success);

  // 5 lessons as boxes
  const lessons = [
    "SSL có thể VƯỢT Supervised",
    "Ngăn collapse là TỐI QUAN TRỌNG",
    "Chất lượng data > Số lượng",
    "Dense tasks cần patch-level learning",
    "Scale lớn cần stability tricks",
  ];

  lessons.forEach((lesson, i) => {
    const y = 1.4 + i * 1;

    s.addShape(SHAPES.RECTANGLE, {
      x: M, y, w: CW, h: 0.8,
      fill: { color: i === 0 ? "E8F5E9" : C.cream },
    });

    s.addText(`${i + 1}. ${lesson}`, {
      x: M + 0.3, y: y + 0.15, w: CW - 0.6, h: 0.5,
      fontFace: FONT, fontSize: 22, color: C.black,
    });
  });

  addProgress(s, 5);

  s.addNotes(`5 bài học từ DINO:

1. SSL vượt supervised - 88.4% không cần label
2. Collapse prevention critical - thiếu 1 là chết
3. Data quality > quantity - 142M thắng 1.2B
4. Dense tasks cần iBOT - CLS không đủ
5. Scale lớn cần Gram Anchoring

Key insight: Không cần labels, cần ĐÚNG learning signal.`);

  return s;
}

module.exports = { create };
