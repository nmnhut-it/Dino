const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.author = "DINO Seminar";
pres.title = "DINO: Self-Distillation with NO Labels";

// ═══════════════════════════════════════
// DESIGN SYSTEM v6.3
// ═══════════════════════════════════════
const C = {
  red: "FF0000",
  green: "008000",
  black: "1A1A1A",
  white: "FFFFFF",
  bg: "FFFFFF",
  cream: "FFF8F0",
  creamDark: "F5EDE0",
  gray: "555555",
  lightGray: "E0E0E0",
  medGray: "888888",
  tableAlt: "F5F5F5",
  lightGreen: "E8F5E9",
  lightRed: "FFF0F0",
};
const FONT = "Roboto";
const FONT_TITLE = "Roboto";
const FONT_MONO = "Consolas";
const W = 13.33;
const H = 7.5;
const M = 0.7;
const CW = W - 2 * M;
const MIN_FONT = 28;

// Section names (5 sections)
const SECTIONS = ["Vấn đề", "DINOv1", "DINOv2", "DINOv3", "Tổng hợp"];

// ═══════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════

function addTitle(slide, text) {
  slide.addText(text, {
    x: M, y: 0.3, w: CW, h: 0.7,
    fontFace: FONT_TITLE, fontSize: 36, bold: true, italic: true,
    color: C.green, align: "left", margin: 0,
  });
}

function addSource(slide, text) {
  slide.addText(text, {
    x: M, y: H - 0.55, w: CW, h: 0.35,
    fontFace: FONT, fontSize: 10, italic: true,
    color: C.medGray, align: "left", margin: 0,
  });
}

function addProgress(slide, activeSection) {
  const barY = H - 0.18;
  const barW = CW / SECTIONS.length;
  for (let i = 0; i < SECTIONS.length; i++) {
    const isActive = i + 1 === activeSection;
    slide.addShape(pres.shapes.RECTANGLE, {
      x: M + i * barW, y: barY, w: barW - 0.03, h: 0.08,
      fill: { color: isActive ? C.red : C.lightGray },
    });
  }
}

function addSectionDivider(sectionNum, sectionTitle) {
  const s = pres.addSlide();
  s.background = { color: C.cream };
  s.addText(("0" + sectionNum).slice(-2), {
    x: M, y: 1.5, w: CW, h: 1.5,
    fontFace: FONT_TITLE, fontSize: 72, bold: true,
    color: C.red, align: "left", margin: 0,
  });
  s.addText(sectionTitle, {
    x: M, y: 3.2, w: CW, h: 1.0,
    fontFace: FONT_TITLE, fontSize: 44, bold: true, italic: true,
    color: C.green, align: "left", margin: 0,
  });
  addProgress(s, sectionNum);
  return s;
}

function makeTableHeader(texts) {
  return texts.map(t => ({
    text: t,
    options: { bold: true, color: C.white, fill: { color: C.green }, fontSize: MIN_FONT, fontFace: FONT, align: "center", valign: "middle" },
  }));
}

function makeTableRow(texts, rowIdx, highlights) {
  return texts.map((t, c) => {
    const hl = highlights && highlights[c];
    return {
      text: t,
      options: {
        fontSize: MIN_FONT, fontFace: FONT,
        fill: { color: rowIdx % 2 === 0 ? C.tableAlt : C.white },
        color: hl ? C.red : C.black,
        bold: hl || c === 0,
        align: c === 0 ? "left" : "center", valign: "middle",
      },
    };
  });
}

// ═══════════════════════════════════════
// SLIDE 1 — Title
// ═══════════════════════════════════════
(() => {
  const s = pres.addSlide();
  s.background = { color: C.cream };

  s.addText("DINO", {
    x: M, y: 0.6, w: CW, h: 1.6,
    fontFace: FONT_TITLE, fontSize: 80, bold: true,
    color: C.green, align: "left", margin: 0,
  });

  s.addText("self-DIstillation with NO labels", {
    x: M, y: 2.2, w: CW, h: 0.6,
    fontFace: FONT, fontSize: MIN_FONT, italic: true,
    color: C.gray, align: "left", margin: 0,
  });

  s.addText([
    { text: "v1 · 2021", options: { fontSize: MIN_FONT } },
    { text: "    ", options: { fontSize: MIN_FONT } },
    { text: "v2 · 2023", options: { fontSize: MIN_FONT } },
    { text: "    ", options: { fontSize: MIN_FONT } },
    { text: "v3 · 2025", options: { fontSize: MIN_FONT } },
  ], {
    x: M, y: 3.1, w: CW, h: 0.5,
    fontFace: FONT, color: C.black, align: "left", margin: 0,
  });

  s.addText([
    { text: "Nguyễn Minh Nhựt – 25C15019", options: { breakLine: true } },
    { text: "Nguyễn Phước Thiện – 25C15060", options: { breakLine: true } },
    { text: "Nguyễn Thiện Thuật – 25C15025", options: { breakLine: true } },
    { text: "Trương Thế Khải – 25C15042", options: {} },
  ], {
    x: M, y: 4.3, w: CW, h: 2.5,
    fontFace: FONT, fontSize: MIN_FONT, color: C.black, align: "left", margin: 0,
    lineSpacingMultiple: 1.3,
  });

  s.addNotes(`Chào mọi người. Hôm nay nhóm mình trình bày về DINO — viết tắt của "self-DIstillation with NO labels".

Có 3 phiên bản: v1 (2021), v2 (2023), v3 (2025). Mỗi bản scale lớn hơn và mạnh hơn.

Mục tiêu: train model nhìn ảnh mà không cần ai gán nhãn, nhưng kết quả vượt supervised learning.`);
})();

// ═══════════════════════════════════════
// SLIDE 2 — Mục lục
// ═══════════════════════════════════════
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addTitle(s, "Nội dung");

  const items = [
    ["01", "Vấn đề: Chi phí gán nhãn"],
    ["02", "DINOv1: Ý tưởng nền tảng"],
    ["03", "DINOv2: Scale & Dense tasks"],
    ["04", "DINOv3: Foundation model"],
    ["05", "Tổng hợp"],
  ];

  for (let i = 0; i < items.length; i++) {
    const yy = 1.3 + i * 1.0;
    s.addText(items[i][0], {
      x: M, y: yy, w: 0.9, h: 0.7,
      fontFace: FONT_TITLE, fontSize: 32, bold: true,
      color: C.red, align: "left", margin: 0,
    });
    s.addText(items[i][1], {
      x: M + 1.0, y: yy, w: 10, h: 0.7,
      fontFace: FONT, fontSize: 30,
      color: C.black, align: "left", margin: 0,
    });
  }

  s.addNotes(`5 phần chính. Phần 1 về vấn đề chi phí gán nhãn. Phần 2-4 đi sâu vào 3 phiên bản DINO với cấu trúc và lý do thiết kế. Phần 5 tổng hợp so sánh.`);
})();

// ═══════════════════════════════════════
// SECTION 1 — Vấn đề
// ═══════════════════════════════════════
addSectionDivider(1, "Vấn đề: Chi phí gán nhãn");

// SLIDE 3 — Chi phí gán nhãn
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addTitle(s, "Chi phí gán nhãn");
  addProgress(s, 1);

  const nums = [
    ["49,000", "người gán nhãn"],
    ["14M", "ảnh có nhãn"],
    ["$500K+", "ước tính chi phí"],
    ["167", "quốc gia"],
    ["3×", "kiểm tra mỗi ảnh"],
    ["2 năm", "thời gian"],
  ];

  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 3; c++) {
      const idx = r * 3 + c;
      const xx = M + c * (CW / 3) + 0.1;
      const yy = 1.3 + r * 2.4;
      s.addText(nums[idx][0], {
        x: xx, y: yy, w: 3.5, h: 1.0,
        fontFace: FONT_TITLE, fontSize: 48, bold: true,
        color: C.red, align: "left", margin: 0,
      });
      s.addText(nums[idx][1], {
        x: xx, y: yy + 1.0, w: 3.5, h: 0.5,
        fontFace: FONT, fontSize: MIN_FONT,
        color: C.gray, align: "left", margin: 0,
      });
    }
  }

  addSource(s, "Deng et al. CVPR 2009 · Li & Deng 2017");

  s.addNotes(`Đây là số liệu thật của ImageNet. Để gán nhãn 14 triệu ảnh, nhóm của giáo sư Fei-Fei Li phải thuê 49 nghìn người từ 167 nước. Mỗi ảnh kiểm tra 3 lần. Tổng chi phí hơn nửa triệu đô, mất 2 năm.

Và đó mới chỉ là 1 dataset cho 1000 class. Mỗi bài toán mới cần gán nhãn lại từ đầu. Câu hỏi: có cách nào học mà không cần nhãn không?`);
})();

// SLIDE 4 — Self-supervised learning
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addTitle(s, "Self-supervised learning");
  addProgress(s, 1);

  const boxes = [
    { label: "Ảnh\nkhông nhãn", x: M + 0.2 },
    { label: "Self-Supervised\nLearning", x: M + 4.3 },
    { label: "Đặc trưng\ncó ý nghĩa", x: M + 8.4 },
  ];

  for (const b of boxes) {
    s.addShape(pres.shapes.RECTANGLE, {
      x: b.x, y: 2.0, w: 3.3, h: 2.0,
      fill: { color: C.tableAlt }, line: { color: C.lightGray, width: 1 },
    });
    s.addText(b.label, {
      x: b.x, y: 2.0, w: 3.3, h: 2.0,
      fontFace: FONT, fontSize: MIN_FONT, bold: true,
      color: C.black, align: "center", valign: "middle",
    });
  }

  for (const ax of [M + 3.5, M + 7.6]) {
    s.addText("→", {
      x: ax, y: 2.3, w: 0.8, h: 1.4,
      fontFace: FONT, fontSize: 40, color: C.red, align: "center", valign: "middle",
    });
  }

  s.addText("Model tự đặt bài tập cho chính nó", {
    x: M, y: 4.6, w: CW, h: 0.6,
    fontFace: FONT, fontSize: MIN_FONT, italic: true,
    color: C.gray, align: "center", margin: 0,
  });

  s.addNotes(`Self-supervised learning: model tự tạo tín hiệu giám sát từ dữ liệu thô.

3 hướng chính:
1. Contrastive learning (SimCLR, MoCo): so sánh cặp ảnh
2. Masked image modeling (MAE): che rồi đoán
3. Distillation (BYOL, DINO): teacher-student

DINO thuộc nhóm thứ ba, đặc biệt là không cần negative pairs.`);
})();

// ═══════════════════════════════════════
// SECTION 2 — DINOv1
// ═══════════════════════════════════════
addSectionDivider(2, "DINOv1 (2021)");

// SLIDE 5 — Core Intuition
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addTitle(s, "Ý tưởng cốt lõi");
  addProgress(s, 2);

  s.addText("Không có nhãn → Lấy tín hiệu từ đâu?", {
    x: M, y: 1.3, w: CW, h: 0.7,
    fontFace: FONT, fontSize: 32, bold: true,
    color: C.red, align: "center", margin: 0,
  });

  // Two perspectives
  const leftX = M + 0.3;
  const rightX = M + 6.5;

  s.addShape(pres.shapes.RECTANGLE, {
    x: leftX, y: 2.3, w: 5.2, h: 3.0,
    fill: { color: C.tableAlt }, line: { color: C.green, width: 2 },
  });
  s.addText("Teacher", {
    x: leftX, y: 2.4, w: 5.2, h: 0.6,
    fontFace: FONT, fontSize: 30, bold: true, color: C.green, align: "center", margin: 0,
  });
  s.addText("Nhìn toàn cảnh (global)\nỔn định, cập nhật chậm\n→ \"Đáp án\"", {
    x: leftX + 0.2, y: 3.1, w: 4.8, h: 2.0,
    fontFace: FONT, fontSize: 26, color: C.black, align: "center", valign: "middle", margin: 0,
  });

  s.addShape(pres.shapes.RECTANGLE, {
    x: rightX, y: 2.3, w: 5.2, h: 3.0,
    fill: { color: C.tableAlt }, line: { color: C.lightGray, width: 1 },
  });
  s.addText("Student", {
    x: rightX, y: 2.4, w: 5.2, h: 0.6,
    fontFace: FONT, fontSize: 30, bold: true, color: C.black, align: "center", margin: 0,
  });
  s.addText("Nhìn cục bộ (local)\nHọc bắt chước Teacher\n→ Buộc hiểu ngữ cảnh", {
    x: rightX + 0.2, y: 3.1, w: 4.8, h: 2.0,
    fontFace: FONT, fontSize: 26, color: C.black, align: "center", valign: "middle", margin: 0,
  });

  s.addText("dạy →", {
    x: M + 5.5, y: 3.3, w: 1.0, h: 0.8,
    fontFace: FONT, fontSize: MIN_FONT, bold: true, color: C.red, align: "center", valign: "middle",
  });

  addSource(s, "Caron et al. ICCV 2021");

  s.addNotes(`Câu hỏi cốt lõi: không có nhãn thì lấy tín hiệu học từ đâu?

DINO trả lời: dùng chính model làm nguồn tín hiệu. Tạo 2 phiên bản: Teacher và Student.

Teacher nhìn toàn cảnh (global crop), cập nhật chậm → ổn định → làm "đáp án".
Student nhìn cục bộ (local crop), học bắt chước Teacher. Buộc hiểu ngữ cảnh, không chỉ copy pixel.

Đây là self-distillation: Teacher không train sẵn, mà được tạo từ Student.`);
})();

// SLIDE 6 — Architecture
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addTitle(s, "Cấu trúc DINO");
  addProgress(s, 2);

  // Simplified pipeline diagram
  s.addShape(pres.shapes.RECTANGLE, {
    x: M, y: 1.5, w: 2.0, h: 3.5,
    fill: { color: C.tableAlt }, line: { color: C.lightGray, width: 1 },
  });
  s.addText("Ảnh\ngốc", { x: M, y: 2.5, w: 2.0, h: 1.0, fontFace: FONT, fontSize: MIN_FONT, bold: true, color: C.black, align: "center", valign: "middle" });

  // Teacher
  s.addText("global →", { x: M + 2.0, y: 1.6, w: 1.3, h: 0.6, fontFace: FONT, fontSize: 22, italic: true, color: C.gray, align: "center" });
  s.addShape(pres.shapes.RECTANGLE, { x: M + 3.3, y: 1.3, w: 2.5, h: 1.4, fill: { color: C.lightGreen }, line: { color: C.green, width: 2 } });
  s.addText("Teacher", { x: M + 3.3, y: 1.3, w: 2.5, h: 1.4, fontFace: FONT, fontSize: MIN_FONT, bold: true, color: C.green, align: "center", valign: "middle" });

  s.addText("→ Pₜ", { x: M + 5.8, y: 1.6, w: 1.0, h: 0.8, fontFace: FONT_MONO, fontSize: MIN_FONT, bold: true, color: C.green, align: "center" });

  // Student
  s.addText("local →", { x: M + 2.0, y: 3.8, w: 1.3, h: 0.6, fontFace: FONT, fontSize: 22, italic: true, color: C.gray, align: "center" });
  s.addShape(pres.shapes.RECTANGLE, { x: M + 3.3, y: 3.5, w: 2.5, h: 1.4, fill: { color: C.tableAlt }, line: { color: C.lightGray, width: 1 } });
  s.addText("Student", { x: M + 3.3, y: 3.5, w: 2.5, h: 1.4, fontFace: FONT, fontSize: MIN_FONT, bold: true, color: C.black, align: "center", valign: "middle" });

  s.addText("→ Pₛ", { x: M + 5.8, y: 3.8, w: 1.0, h: 0.8, fontFace: FONT_MONO, fontSize: MIN_FONT, bold: true, color: C.black, align: "center" });

  // EMA
  s.addText("EMA ↑", { x: M + 4.0, y: 2.7, w: 1.3, h: 0.6, fontFace: FONT, fontSize: 24, bold: true, color: C.red, align: "center" });

  // Loss
  s.addShape(pres.shapes.RECTANGLE, { x: M + 7.2, y: 2.0, w: 4.5, h: 2.2, fill: { color: C.white }, line: { color: C.red, width: 2 } });
  s.addText("Loss = −Σ Pₜ · log Pₛ", { x: M + 7.2, y: 2.2, w: 4.5, h: 0.8, fontFace: FONT_MONO, fontSize: 26, bold: true, color: C.red, align: "center", valign: "middle" });
  s.addText("Student học bắt chước\noutput của Teacher", { x: M + 7.2, y: 3.0, w: 4.5, h: 1.0, fontFace: FONT, fontSize: 24, color: C.gray, align: "center", valign: "middle" });

  addSource(s, "Caron et al. ICCV 2021");

  s.addNotes(`Pipeline DINO:
1. Từ 1 ảnh, tạo global crop cho Teacher, local crop cho Student
2. Cả hai qua ViT backbone cùng kiến trúc
3. Output qua projection head → softmax → phân bố Pₜ và Pₛ
4. Loss là cross-entropy giữa Pₜ và Pₛ
5. Student train bằng gradient, Teacher cập nhật từ Student qua EMA`);
})();

// SLIDE 7 — Multi-crop
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addTitle(s, "Multi-crop: Local → Global");
  addProgress(s, 2);

  s.addShape(pres.shapes.RECTANGLE, {
    x: M + 0.2, y: 1.4, w: 4.8, h: 3.6,
    fill: { color: C.tableAlt }, line: { color: C.lightGray, width: 1 },
  });
  s.addText("Ảnh gốc\n(2 global + 6 local)", {
    x: M + 0.2, y: 2.4, w: 4.8, h: 1.5,
    fontFace: FONT, fontSize: MIN_FONT, color: C.gray, align: "center", valign: "middle",
  });

  const rx = M + 5.5;
  s.addText([
    { text: "Global: 224×224, >50% ảnh", options: { bold: true, fontSize: MIN_FONT, color: C.green, breakLine: true } },
    { text: "→ Teacher nhận", options: { fontSize: 26, color: C.gray, breakLine: true } },
    { text: "", options: { fontSize: 14, breakLine: true } },
    { text: "Local: 96×96, <50% ảnh", options: { bold: true, fontSize: MIN_FONT, color: C.red, breakLine: true } },
    { text: "→ Student nhận cả 2 loại", options: { fontSize: 26, color: C.gray } },
  ], {
    x: rx, y: 1.6, w: 6.0, h: 3.5,
    fontFace: FONT, align: "left", margin: 0,
  });

  s.addText("Thấy cái vây → phải biết là con cá", {
    x: M, y: 5.5, w: CW, h: 0.6,
    fontFace: FONT, fontSize: MIN_FONT, italic: true, color: C.gray, align: "center", margin: 0,
  });

  addSource(s, "Caron et al. ICCV 2021 · SwAV (Caron 2020)");

  s.addNotes(`Multi-crop: từ 1 ảnh tạo 2 global crop và 6 local crop.

Ý tưởng: nhìn cái vây cá thôi cũng phải biết là con cá — local-to-global.

Chi phí: local crop 96² chỉ 18% pixel so với global 224². 6 local ≈ 1 global thêm. 8 góc nhìn thay vì 2, compute chỉ +50%.

Kiểm chứng: bỏ local crop giảm 2-3% ImageNet.`);
})();

// SLIDE 8 — EMA
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addTitle(s, "EMA: Teacher ổn định");
  addProgress(s, 2);

  s.addText("θ_T ← λ·θ_T + (1−λ)·θ_S", {
    x: M, y: 1.5, w: CW, h: 0.8,
    fontFace: FONT_MONO, fontSize: 34, bold: true, color: C.black, align: "center", margin: 0,
  });

  s.addText("λ = 0.996 → 1.0", {
    x: M, y: 2.5, w: CW, h: 0.6,
    fontFace: FONT, fontSize: 32, bold: true, color: C.red, align: "center", margin: 0,
  });

  const points = [
    "Teacher giữ 99.6% cũ, lấy 0.4% từ Student",
    "Cosine schedule: λ tăng dần đến 1.0",
    "Cuối training → Teacher gần như không đổi",
  ];

  for (let i = 0; i < points.length; i++) {
    s.addText((i + 1).toString(), {
      x: M + 0.3, y: 3.5 + i * 0.9, w: 0.6, h: 0.6,
      fontFace: FONT_TITLE, fontSize: MIN_FONT, bold: true, color: C.red, align: "center", valign: "middle",
    });
    s.addText(points[i], {
      x: M + 1.1, y: 3.5 + i * 0.9, w: CW - 1.5, h: 0.6,
      fontFace: FONT, fontSize: MIN_FONT, color: C.black, align: "left", valign: "middle",
    });
  }

  addSource(s, "Grill et al. NeurIPS 2020 (BYOL) · Caron et al. ICCV 2021");

  s.addNotes(`EMA = Exponential Moving Average.

Mỗi bước training, Teacher giữ 99.6% giá trị cũ, lấy 0.4% từ Student. Lambda tăng từ 0.996 lên 1.0 theo cosine schedule.

Tại sao cần? Nếu cả hai train gradient → đuổi theo nhau → collapse. EMA cho Teacher đổi cực chậm.

Hình dung: thầy giáo kinh nghiệm, không đổi ý theo từng câu hỏi.`);
})();

// SLIDE 9 — Centering & Sharpening
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addTitle(s, "Chống collapse");
  addProgress(s, 2);

  s.addText("Collapse = mọi ảnh → cùng 1 output", {
    x: M, y: 1.3, w: CW, h: 0.6,
    fontFace: FONT, fontSize: MIN_FONT, bold: true, color: C.red, align: "center", margin: 0,
  });

  const cx = M + 0.3, cy = 2.0, cw = 5.3, ch = 2.8;

  s.addShape(pres.shapes.RECTANGLE, { x: cx, y: cy, w: cw, h: ch, fill: { color: C.tableAlt }, line: { color: C.green, width: 2 } });
  s.addText("Centering", { x: cx, y: cy + 0.2, w: cw, h: 0.5, fontFace: FONT, fontSize: 30, bold: true, italic: true, color: C.green, align: "center", margin: 0 });
  s.addText("g(x) − c", { x: cx, y: cy + 0.8, w: cw, h: 0.5, fontFace: FONT_MONO, fontSize: MIN_FONT, bold: true, color: C.red, align: "center", margin: 0 });
  s.addText("Trừ running mean\nKhông cho 1 chiều\nchiếm ưu thế", { x: cx + 0.2, y: cy + 1.4, w: cw - 0.4, h: 1.2, fontFace: FONT, fontSize: 24, color: C.gray, align: "center", margin: 0 });

  const dx = M + 6.3;
  s.addShape(pres.shapes.RECTANGLE, { x: dx, y: cy, w: cw, h: ch, fill: { color: C.tableAlt }, line: { color: C.green, width: 2 } });
  s.addText("Sharpening", { x: dx, y: cy + 0.2, w: cw, h: 0.5, fontFace: FONT, fontSize: 30, bold: true, italic: true, color: C.green, align: "center", margin: 0 });
  s.addText("τ = 0.04", { x: dx, y: cy + 0.8, w: cw, h: 0.5, fontFace: FONT_MONO, fontSize: MIN_FONT, bold: true, color: C.red, align: "center", margin: 0 });
  s.addText("Temperature thấp\nBuộc Teacher\nchọn rõ ràng", { x: dx + 0.2, y: cy + 1.4, w: cw - 0.4, h: 1.2, fontFace: FONT, fontSize: 24, color: C.gray, align: "center", margin: 0 });

  s.addText("Bỏ centering → collapse sau 1 epoch", {
    x: M, y: 5.2, w: CW, h: 0.5,
    fontFace: FONT, fontSize: MIN_FONT, italic: true, color: C.red, align: "center", margin: 0,
  });

  addSource(s, "Caron et al. ICCV 2021, Section 3.1");

  s.addNotes(`Collapse: mọi ảnh cho ra cùng 1 output. EMA giúp nhưng chưa đủ. DINO thêm 2 cơ chế:

Centering: trừ running mean khỏi output Teacher → không cho 1 chiều dominate.

Sharpening: τ=0.04 rất thấp → phân bố gần one-hot → Teacher buộc phải "chọn" rõ ràng.

Kiểm chứng: bỏ centering → collapse sau 1 epoch. Cần cả 2 cùng lúc.`);
})();

// SLIDE 10 — Emerging Properties
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addTitle(s, "Emerging properties");
  addProgress(s, 2);

  s.addText("Attention map tự segment vật thể", {
    x: M, y: 1.3, w: CW, h: 0.7,
    fontFace: FONT, fontSize: 32, bold: true, color: C.green, align: "center", margin: 0,
  });

  const heads = ["Head 1\nĐầu", "Head 2\nThân", "Head 3\nChân", "Head 4\nNền"];
  for (let i = 0; i < 4; i++) {
    const xx = M + 0.5 + i * 3.0;
    s.addShape(pres.shapes.RECTANGLE, {
      x: xx, y: 2.2, w: 2.6, h: 1.8,
      fill: { color: i < 3 ? C.lightGreen : C.tableAlt }, line: { color: i < 3 ? C.green : C.lightGray, width: 1 },
    });
    s.addText(heads[i], {
      x: xx, y: 2.2, w: 2.6, h: 1.8,
      fontFace: FONT, fontSize: 24, bold: true, color: i < 3 ? C.green : C.gray, align: "center", valign: "middle",
    });
  }

  s.addText([
    { text: "Tại sao? ", options: { bold: true, fontSize: MIN_FONT, color: C.red } },
    { text: "Local-to-global buộc hiểu vùng nào quan trọng", options: { fontSize: MIN_FONT, color: C.black } },
  ], {
    x: M, y: 4.5, w: CW, h: 0.7,
    fontFace: FONT, align: "center", margin: 0,
  });

  s.addText("Supervised: chỉ cần biết \"đây là chó\" → không tự segment", {
    x: M, y: 5.3, w: CW, h: 0.5,
    fontFace: FONT, fontSize: 26, italic: true, color: C.gray, align: "center", margin: 0,
  });

  addSource(s, "Caron et al. ICCV 2021, Figure 1");

  s.addNotes(`Phát hiện nổi bật: attention heads tự học cách tách vật thể khỏi nền. Mỗi head focus 1 phần khác nhau.

Chỉ xảy ra với ViT + DINO, không xảy ra supervised hay CNN. Gọi là emerging property.

Tại sao? Supervised chỉ cần biết "đây là chó". DINO so sánh local/global crop, buộc hiểu vùng nào quan trọng → tự segment.`);
})();

// SLIDE 11 — Results v1
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addTitle(s, "Kết quả DINOv1");
  addProgress(s, 2);

  const tbl = [];
  tbl.push(makeTableHeader(["Model", "Linear probe"]));
  const rows = [["ViT-S/8", "79.7%"], ["ViT-B/8", "80.1%"], ["ResNet-50 (DINO)", "75.3%"], ["ResNet-50 (Supervised)", "76.5%"]];
  for (let r = 0; r < rows.length; r++) {
    tbl.push(makeTableRow(rows[r], r, r === 1 ? [false, true] : null));
  }
  s.addTable(tbl, { x: M + 0.5, y: 1.3, w: 7, h: 3.2, colW: [4.0, 3.0], border: { pt: 0.5, color: C.lightGray } });

  s.addText("80.1%", { x: M + 8, y: 1.5, w: 3.5, h: 1.2, fontFace: FONT_TITLE, fontSize: 60, bold: true, color: C.red, align: "center", margin: 0 });
  s.addText("vượt supervised\nkhông cần nhãn", { x: M + 8, y: 2.8, w: 3.5, h: 1.0, fontFace: FONT, fontSize: MIN_FONT, italic: true, color: C.gray, align: "center", margin: 0 });

  s.addText("Milestone: lần đầu self-supervised vượt supervised", { x: M, y: 5.0, w: CW, h: 0.6, fontFace: FONT, fontSize: MIN_FONT, bold: true, color: C.green, align: "center", margin: 0 });

  addSource(s, "Caron et al. ICCV 2021, Table 2");

  s.addNotes(`80.1% ImageNet linear probe với ViT-B/8 — vượt supervised ResNet-50 (76.5%) mà không cần nhãn.

Milestone: lần đầu self-supervised vượt supervised trên ImageNet.

So sánh: ViT (80.1%) mạnh hơn ResNet-50 (75.3%) khi train với DINO → ViT phù hợp hơn cho SSL.`);
})();

// SLIDE 12 — v1 Summary
(() => {
  const s = pres.addSlide();
  s.background = { color: C.cream };

  s.addText("DINOv1 — tóm tắt", {
    x: M, y: 0.4, w: CW, h: 0.7,
    fontFace: FONT_TITLE, fontSize: 36, bold: true, italic: true, color: C.green, align: "left", margin: 0,
  });

  const pts = [
    ["Cấu trúc:", "Teacher-Student, cùng ViT, khác tham số"],
    ["Cơ chế:", "EMA + Multi-crop + Centering + Sharpening"],
    ["Ý tưởng:", "Local → Global, self-distillation"],
    ["Kết quả:", "80.1% ImageNet, vượt supervised"],
  ];

  for (let i = 0; i < pts.length; i++) {
    s.addText(pts[i][0], {
      x: M + 0.3, y: 1.5 + i * 1.2, w: 2.5, h: 0.8,
      fontFace: FONT, fontSize: MIN_FONT, bold: true, color: C.red, align: "left", valign: "middle", margin: 0,
    });
    s.addText(pts[i][1], {
      x: M + 2.8, y: 1.5 + i * 1.2, w: CW - 3.0, h: 0.8,
      fontFace: FONT, fontSize: MIN_FONT, color: C.black, align: "left", valign: "middle", margin: 0,
    });
  }

  s.addNotes(`Tóm tắt DINOv1. Hạn chế: data 1.28M, model 86M, chỉ classification. DINOv2 giải quyết: data ×110, model ×13, test dense tasks.`);
})();

// ═══════════════════════════════════════
// SECTION 3 — DINOv2
// ═══════════════════════════════════════
addSectionDivider(3, "DINOv2 (2023)");

// SLIDE 13 — Motivation v2
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addTitle(s, "Động lực DINOv2");
  addProgress(s, 3);

  s.addText("4 hạn chế của v1 → 4 giải pháp v2", {
    x: M, y: 1.2, w: CW, h: 0.6,
    fontFace: FONT, fontSize: 30, bold: true, color: C.red, align: "center", margin: 0,
  });

  const problems = [
    ["Data nhỏ (1.28M)", "LVD-142M (×110)"],
    ["Model nhỏ (86M)", "ViT-g (1.1B, ×13)"],
    ["Chỉ classification", "Dense tasks (seg, depth)"],
    ["Chỉ DINO loss", "DINO + iBOT + KoLeo"],
  ];

  for (let i = 0; i < problems.length; i++) {
    const yy = 2.0 + i * 1.0;
    s.addText(problems[i][0], {
      x: M + 0.3, y: yy, w: 4.5, h: 0.7,
      fontFace: FONT, fontSize: MIN_FONT, color: C.gray, align: "left", valign: "middle",
    });
    s.addText("→", {
      x: M + 4.8, y: yy, w: 0.8, h: 0.7,
      fontFace: FONT, fontSize: 32, bold: true, color: C.red, align: "center", valign: "middle",
    });
    s.addText(problems[i][1], {
      x: M + 5.6, y: yy, w: 6.0, h: 0.7,
      fontFace: FONT, fontSize: MIN_FONT, bold: true, color: C.green, align: "left", valign: "middle",
    });
  }

  addSource(s, "Oquab et al. TMLR 2024");

  s.addNotes(`DINOv2 giải quyết 4 hạn chế của v1:
1. Data: ImageNet 1.28M → LVD-142M (×110)
2. Model: ViT-B 86M → ViT-g 1.1B (×13)
3. Tasks: Chỉ classification → test dense tasks (segmentation, depth)
4. Loss: Chỉ DINO loss → thêm iBOT và KoLeo

Mục tiêu: tạo "foundation model" cho vision.`);
})();

// SLIDE 14 — LVD-142M
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addTitle(s, "LVD-142M: Data curation");
  addProgress(s, 3);

  const steps = ["Crawl\n1.2B", "Lọc\nNSFW", "Loại trùng\nSSCD", "Chọn\nFaiss", "142M\ncurated"];
  for (let i = 0; i < 5; i++) {
    const isLast = i === 4;
    const xx = M + i * 2.4;
    s.addShape(pres.shapes.RECTANGLE, {
      x: xx, y: 1.6, w: 2.1, h: 1.6,
      fill: { color: isLast ? C.lightRed : C.tableAlt },
      line: { color: isLast ? C.red : C.lightGray, width: isLast ? 2 : 1 },
    });
    s.addText(steps[i], {
      x: xx, y: 1.6, w: 2.1, h: 1.6,
      fontFace: FONT, fontSize: 24, bold: true,
      color: isLast ? C.red : C.black, align: "center", valign: "middle",
    });
    if (i < 4) {
      s.addText("→", { x: xx + 2.1, y: 2.0, w: 0.3, h: 0.8, fontFace: FONT, fontSize: MIN_FONT, color: C.red, align: "center", valign: "middle" });
    }
  }

  s.addText("Chất lượng > Số lượng", {
    x: M, y: 3.7, w: CW, h: 0.7,
    fontFace: FONT, fontSize: 32, bold: true, color: C.red, align: "center", margin: 0,
  });

  s.addText("142M curated thắng 1.2B raw (thua 2-3% khi dùng raw)", {
    x: M, y: 4.5, w: CW, h: 0.6,
    fontFace: FONT, fontSize: MIN_FONT, italic: true, color: C.gray, align: "center", margin: 0,
  });

  addSource(s, "Oquab et al. TMLR 2024, Section 3");

  s.addNotes(`LVD pipeline:
1. Crawl 1.2 tỷ ảnh từ internet
2. Lọc NSFW và ảnh chất lượng thấp
3. Loại trùng bằng SSCD (Self-Supervised Copy Detection)
4. Chọn qua Faiss nearest neighbor
5. Còn lại 142M sạch

Key insight: quality > quantity. Train trên raw 1.2B thua curated 142M khoảng 2-3%.`);
})();

// SLIDE 15 — Three Losses Overview
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addTitle(s, "Ba loss của v2");
  addProgress(s, 3);

  const losses = [
    { name: "DINO loss", desc: "CLS token → hiểu toàn cục", reason: "Kế thừa từ v1", y: 1.3 },
    { name: "iBOT loss", desc: "Masked patches → hiểu cục bộ", reason: "Cần cho dense tasks", y: 2.7 },
    { name: "KoLeo", desc: "Trải đều embedding space", reason: "Tránh collapse", y: 4.1 },
  ];

  for (const l of losses) {
    s.addShape(pres.shapes.RECTANGLE, {
      x: M + 0.3, y: l.y, w: 7.0, h: 1.1,
      fill: { color: C.tableAlt }, line: { color: C.lightGray, width: 1 },
    });
    s.addText(l.name, { x: M + 0.5, y: l.y + 0.1, w: 2.5, h: 0.5, fontFace: FONT, fontSize: MIN_FONT, bold: true, color: C.red, align: "left", margin: 0 });
    s.addText(l.desc, { x: M + 0.5, y: l.y + 0.55, w: 6.5, h: 0.45, fontFace: FONT, fontSize: 24, color: C.gray, align: "left", margin: 0 });

    s.addText(l.reason, { x: M + 7.8, y: l.y + 0.3, w: 4.0, h: 0.5, fontFace: FONT, fontSize: 24, italic: true, color: C.green, align: "left", valign: "middle", margin: 0 });
  }

  s.addText("Bỏ iBOT → ADE20k −4.2 mIoU    Bỏ KoLeo → ImageNet −0.5%", {
    x: M, y: 5.6, w: CW, h: 0.5,
    fontFace: FONT, fontSize: 24, italic: true, color: C.red, align: "center", margin: 0,
  });

  addSource(s, "Oquab et al. TMLR 2024 · Zhou et al. ICLR 2022");

  s.addNotes(`v2 kết hợp 3 loss, mỗi loss có mục đích riêng:

DINO loss: giống v1, dùng CLS token để hiểu toàn cục.

iBOT loss: che patch rồi đoán token từ Teacher. Khác MAE (đoán pixel), iBOT đoán semantic. Cần cho segmentation.

KoLeo: đẩy embedding trải đều, tránh collapse.

Ablation: bỏ iBOT giảm 4.2 mIoU ADE20k. Cả 3 cần thiết.`);
})();

// SLIDE 16 — iBOT Deep Dive
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addTitle(s, "iBOT: Masked prediction");
  addProgress(s, 3);

  // Diagram
  s.addShape(pres.shapes.RECTANGLE, {
    x: M + 0.3, y: 1.5, w: 3.2, h: 2.2,
    fill: { color: C.tableAlt }, line: { color: C.lightGray, width: 1 },
  });
  s.addText("Ảnh\n(patches\nbị che)", {
    x: M + 0.3, y: 1.5, w: 3.2, h: 2.2,
    fontFace: FONT, fontSize: 24, color: C.black, align: "center", valign: "middle",
  });

  s.addText("→", { x: M + 3.5, y: 2.2, w: 0.6, h: 1.0, fontFace: FONT, fontSize: 32, color: C.red, align: "center", valign: "middle" });

  s.addShape(pres.shapes.RECTANGLE, {
    x: M + 4.1, y: 1.5, w: 2.5, h: 2.2,
    fill: { color: C.tableAlt }, line: { color: C.lightGray, width: 1 },
  });
  s.addText("Student\nViT", {
    x: M + 4.1, y: 1.5, w: 2.5, h: 2.2,
    fontFace: FONT, fontSize: 24, bold: true, color: C.black, align: "center", valign: "middle",
  });

  s.addText("→", { x: M + 6.6, y: 2.2, w: 0.6, h: 1.0, fontFace: FONT, fontSize: 32, color: C.red, align: "center", valign: "middle" });

  s.addShape(pres.shapes.RECTANGLE, {
    x: M + 7.2, y: 1.5, w: 4.5, h: 2.2,
    fill: { color: C.lightGreen }, line: { color: C.green, width: 2 },
  });
  s.addText("Đoán token\ncủa patch bị che\n(từ Teacher)", {
    x: M + 7.2, y: 1.5, w: 4.5, h: 2.2,
    fontFace: FONT, fontSize: 24, bold: true, color: C.green, align: "center", valign: "middle",
  });

  // Comparison table
  const tbl = [];
  tbl.push(makeTableHeader(["", "MAE", "iBOT"]));
  tbl.push(makeTableRow(["Đoán gì?", "Pixel RGB", "Semantic token"], 0, null));
  tbl.push(makeTableRow(["Level", "Low-level", "High-level"], 1, null));
  tbl.push(makeTableRow(["Ví dụ", "\"Màu xanh\"", "\"Phần tai\""], 0, [false, false, true]));
  s.addTable(tbl, { x: M + 1.5, y: 4.0, w: 9, h: 2.0, colW: [2.5, 3.25, 3.25], border: { pt: 0.5, color: C.lightGray } });

  addSource(s, "Zhou et al. ICLR 2022");

  s.addNotes(`iBOT: che ngẫu nhiên 1 số patch, bắt Student đoán semantic token từ Teacher.

Khác MAE: MAE đoán pixel (low-level), iBOT đoán semantic (high-level).

Ví dụ: MAE → "pixel màu xanh". iBOT → "đây là phần tai con chó".

Tại sao quan trọng? DINO loss chỉ hiểu global (CLS). iBOT hiểu local (từng patch). Cần cả hai cho dense tasks.`);
})();

// SLIDE 17 — KoLeo
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addTitle(s, "KoLeo: Trải đều embedding");
  addProgress(s, 3);

  s.addText("L = −1/n Σᵢ log(min_{j≠i} ||zᵢ − zⱼ||)", {
    x: M, y: 1.4, w: CW, h: 0.7,
    fontFace: FONT_MONO, fontSize: 30, bold: true, color: C.black, align: "center", margin: 0,
  });

  // Before/After diagram
  const bx = M + 1.0;
  s.addText("Before KoLeo", { x: bx, y: 2.3, w: 4.5, h: 0.5, fontFace: FONT, fontSize: MIN_FONT, bold: true, color: C.gray, align: "center", margin: 0 });
  s.addShape(pres.shapes.RECTANGLE, {
    x: bx, y: 2.9, w: 4.5, h: 2.0,
    fill: { color: C.tableAlt }, line: { color: C.lightGray, width: 1 },
  });
  s.addText("●●●\n●●●●●\n●●●", { x: bx, y: 2.9, w: 4.5, h: 2.0, fontFace: FONT, fontSize: 32, color: C.red, align: "center", valign: "middle" });
  s.addText("(tụ lại)", { x: bx, y: 4.9, w: 4.5, h: 0.4, fontFace: FONT, fontSize: 22, italic: true, color: C.gray, align: "center" });

  s.addText("→", { x: M + 5.5, y: 3.5, w: 1.0, h: 1.0, fontFace: FONT, fontSize: 40, bold: true, color: C.red, align: "center", valign: "middle" });

  const ax = M + 6.5;
  s.addText("After KoLeo", { x: ax, y: 2.3, w: 4.5, h: 0.5, fontFace: FONT, fontSize: MIN_FONT, bold: true, color: C.green, align: "center", margin: 0 });
  s.addShape(pres.shapes.RECTANGLE, {
    x: ax, y: 2.9, w: 4.5, h: 2.0,
    fill: { color: C.lightGreen }, line: { color: C.green, width: 2 },
  });
  s.addText("●      ●\n  ●  ●\n●      ●", { x: ax, y: 2.9, w: 4.5, h: 2.0, fontFace: FONT, fontSize: 32, color: C.green, align: "center", valign: "middle" });
  s.addText("(trải đều)", { x: ax, y: 4.9, w: 4.5, h: 0.4, fontFace: FONT, fontSize: 22, italic: true, color: C.gray, align: "center" });

  s.addText("Đẩy nearest neighbors ra xa → không mất đa dạng", {
    x: M, y: 5.6, w: CW, h: 0.5,
    fontFace: FONT, fontSize: MIN_FONT, italic: true, color: C.black, align: "center", margin: 0,
  });

  addSource(s, "Oquab et al. TMLR 2024");

  s.addNotes(`KoLeo (Kozachenko-Leonenko entropy estimator):

Công thức: L = −1/n Σᵢ log(min_{j≠i} ||zᵢ − zⱼ||)

Ý tưởng: Tìm nearest neighbor của mỗi embedding. Nếu quá gần → phạt → đẩy ra xa.

Kết quả: Embeddings trải đều trong không gian, không tụ lại thành clusters.

Tác dụng: Giữ đa dạng thông tin, tránh collapse kiểu khác.`);
})();

// SLIDE 18 — Register Tokens
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addTitle(s, "Register Tokens");
  addProgress(s, 3);

  s.addText("Vấn đề: Attention artifacts ở ViT lớn + high resolution", {
    x: M, y: 1.3, w: CW, h: 0.6,
    fontFace: FONT, fontSize: MIN_FONT, bold: true, color: C.red, align: "center", margin: 0,
  });

  // Sequence diagram
  s.addText("[CLS]  [REG]  [REG]  [REG]  [P1]  [P2]  ...  [P196]", {
    x: M, y: 2.3, w: CW, h: 0.7,
    fontFace: FONT_MONO, fontSize: 26, color: C.black, align: "center", margin: 0,
  });

  s.addText("↑        ↑        ↑        ↑", {
    x: M + 0.4, y: 2.9, w: 7, h: 0.5,
    fontFace: FONT_MONO, fontSize: 26, color: C.green, align: "center", margin: 0,
  });

  s.addText("Learnable \"parking spots\" cho extra attention", {
    x: M, y: 3.3, w: CW, h: 0.5,
    fontFace: FONT, fontSize: MIN_FONT, italic: true, color: C.green, align: "center", margin: 0,
  });

  // Before/After
  const bx = M + 1.0, ax = M + 6.5;

  s.addShape(pres.shapes.RECTANGLE, { x: bx, y: 4.1, w: 4.5, h: 1.5, fill: { color: C.tableAlt }, line: { color: C.lightGray, width: 1 } });
  s.addText("Without registers:\nAttention noisy", { x: bx, y: 4.1, w: 4.5, h: 1.5, fontFace: FONT, fontSize: 24, color: C.gray, align: "center", valign: "middle" });

  s.addShape(pres.shapes.RECTANGLE, { x: ax, y: 4.1, w: 4.5, h: 1.5, fill: { color: C.lightGreen }, line: { color: C.green, width: 2 } });
  s.addText("With registers:\nAttention clean", { x: ax, y: 4.1, w: 4.5, h: 1.5, fontFace: FONT, fontSize: 24, bold: true, color: C.green, align: "center", valign: "middle" });

  addSource(s, "Darcet et al. ICLR 2024");

  s.addNotes(`Vấn đề: Khi scale ViT lên lớn + high resolution:
- Một số positions nhận attention không hợp lý
- Attention map có "vùng chết"

Giải pháp: Thêm 4-8 learnable tokens (không gắn với patch nào)

Register tokens đóng vai trò "bãi đỗ" — hút attention thừa, làm sạch attention map cho các patches thật.`);
})();

// SLIDE 19 — Results v2
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addTitle(s, "Kết quả DINOv2");
  addProgress(s, 3);

  const bigs = [
    { val: "86.5%", label: "ImageNet" },
    { val: "49.0", label: "ADE20k mIoU" },
    { val: "1.1B", label: "params" },
  ];

  for (let i = 0; i < 3; i++) {
    const xx = M + 0.2 + i * 4.1;
    s.addText(bigs[i].val, { x: xx, y: 1.3, w: 3.7, h: 1.0, fontFace: FONT_TITLE, fontSize: 48, bold: true, color: C.red, align: "center", margin: 0 });
    s.addText(bigs[i].label, { x: xx, y: 2.3, w: 3.7, h: 0.5, fontFace: FONT, fontSize: MIN_FONT, color: C.gray, align: "center", margin: 0 });
  }

  const tbl = [];
  tbl.push(makeTableHeader(["Phương pháp", "ImageNet", "ADE20k"]));
  const rows = [["DINOv2", "86.5%", "49.0"], ["iBOT", "82.3%", "44.8"], ["MAE", "73.5%", "—"], ["OpenCLIP", "83.5%", "—"]];
  for (let r = 0; r < rows.length; r++) {
    const hl = r === 0 ? [true, true, true] : null;
    tbl.push(makeTableRow(rows[r], r, hl));
  }
  s.addTable(tbl, { x: M + 1.5, y: 3.0, w: 9, h: 2.8, colW: [3.5, 2.75, 2.75], border: { pt: 0.5, color: C.lightGray } });

  addSource(s, "Oquab et al. TMLR 2024, Table 4");

  s.addNotes(`86.5% ImageNet linear probe, ViT-g 1.1B params. 49.0 mIoU ADE20k frozen features.

Vượt tất cả: iBOT 82.3%, MAE 73.5%, OpenCLIP 83.5% (cần 400M text-image pairs).

DINOv2 = foundation model cho vision: 1 backbone dùng cho nhiều tasks.`);
})();

// SLIDE 20 — v2 Summary
(() => {
  const s = pres.addSlide();
  s.background = { color: C.cream };
  s.addText("DINOv2 — tóm tắt", { x: M, y: 0.4, w: CW, h: 0.7, fontFace: FONT_TITLE, fontSize: 36, bold: true, italic: true, color: C.green, align: "left", margin: 0 });

  const pts = [
    ["Data:", "LVD-142M (curated > raw)"],
    ["Model:", "ViT-g 1.1B params"],
    ["Loss:", "DINO + iBOT + KoLeo"],
    ["New:", "Register tokens"],
    ["Kết quả:", "86.5% ImageNet, 49.0 ADE20k"],
  ];

  for (let i = 0; i < pts.length; i++) {
    s.addText(pts[i][0], {
      x: M + 0.3, y: 1.4 + i * 1.0, w: 2.0, h: 0.7,
      fontFace: FONT, fontSize: MIN_FONT, bold: true, color: C.red, align: "left", valign: "middle", margin: 0,
    });
    s.addText(pts[i][1], {
      x: M + 2.3, y: 1.4 + i * 1.0, w: CW - 2.5, h: 0.7,
      fontFace: FONT, fontSize: MIN_FONT, color: C.black, align: "left", valign: "middle", margin: 0,
    });
  }

  s.addNotes(`So v1: data ×110, model ×13, thêm 2 loss, thêm register tokens. Kết quả +6.4% ImageNet, foundation model cho vision.`);
})();

// ═══════════════════════════════════════
// SECTION 4 — DINOv3
// ═══════════════════════════════════════
addSectionDivider(4, "DINOv3 (2025)");

// SLIDE 21 — Motivation v3
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addTitle(s, "Động lực DINOv3");
  addProgress(s, 4);

  s.addText("Scale có giới hạn không?", {
    x: M, y: 1.2, w: CW, h: 0.6,
    fontFace: FONT, fontSize: 30, bold: true, color: C.red, align: "center", margin: 0,
  });

  const items = [
    { num: "7B", label: "params", desc: "×6.4 so với v2" },
    { num: "1.69B", label: "ảnh curated", desc: "×12 so với v2" },
  ];

  for (let i = 0; i < 2; i++) {
    const xx = M + 0.3 + i * 6.2;
    s.addShape(pres.shapes.RECTANGLE, { x: xx, y: 2.0, w: 5.5, h: 2.4, fill: { color: C.tableAlt }, line: { color: C.lightGray, width: 1 } });
    s.addText(items[i].num, { x: xx, y: 2.2, w: 5.5, h: 0.9, fontFace: FONT_TITLE, fontSize: 48, bold: true, color: C.red, align: "center", margin: 0 });
    s.addText(items[i].label, { x: xx, y: 3.1, w: 5.5, h: 0.5, fontFace: FONT, fontSize: MIN_FONT, bold: true, color: C.black, align: "center", margin: 0 });
    s.addText(items[i].desc, { x: xx, y: 3.6, w: 5.5, h: 0.5, fontFace: FONT, fontSize: 24, color: C.gray, align: "center", margin: 0 });
  }

  s.addText("Thách thức: Train 7B ổn định + Thêm text alignment", {
    x: M, y: 5.0, w: CW, h: 0.6,
    fontFace: FONT, fontSize: MIN_FONT, italic: true, color: C.gray, align: "center", margin: 0,
  });

  addSource(s, "Siméoni et al. arXiv Aug 2025");

  s.addNotes(`DINOv3 đặt câu hỏi: scaling law có giới hạn không?

Scale: ViT-7B (×6.4 so v2), LVD-1.69B (×12 so v2).

Thách thức kỹ thuật:
1. Train model 7B không ổn định — loss bùng nổ, gradient explode
2. Muốn thêm text alignment mà không làm hỏng vision`);
})();

// SLIDE 22 — Gram Anchoring
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addTitle(s, "Gram Anchoring");
  addProgress(s, 4);

  s.addText("Vấn đề: Model lớn → Training không ổn định", {
    x: M, y: 1.2, w: CW, h: 0.6,
    fontFace: FONT, fontSize: MIN_FONT, bold: true, color: C.red, align: "center", margin: 0,
  });

  // Gram matrix explanation
  s.addText("Gram Matrix: G = F × Fᵀ", {
    x: M, y: 2.0, w: CW, h: 0.6,
    fontFace: FONT_MONO, fontSize: 30, bold: true, color: C.black, align: "center", margin: 0,
  });

  s.addShape(pres.shapes.RECTANGLE, {
    x: M + 1.5, y: 2.8, w: 9, h: 1.6,
    fill: { color: C.tableAlt }, line: { color: C.green, width: 2 },
  });
  s.addText("G[i,j] = fᵢ · fⱼ = correlation giữa feature i và j\n→ Đo cấu trúc tương quan trong feature space", {
    x: M + 1.5, y: 2.8, w: 9, h: 1.6,
    fontFace: FONT, fontSize: MIN_FONT, color: C.black, align: "center", valign: "middle",
  });

  s.addText("Gram Anchoring: Enforce G_student ≈ G_teacher", {
    x: M, y: 4.6, w: CW, h: 0.6,
    fontFace: FONT, fontSize: MIN_FONT, bold: true, color: C.green, align: "center", margin: 0,
  });

  s.addText("Không có → Diverge after ~5K steps    Có → Stable to 1M+ steps", {
    x: M, y: 5.4, w: CW, h: 0.5,
    fontFace: FONT, fontSize: 26, italic: true, color: C.red, align: "center", margin: 0,
  });

  addSource(s, "Siméoni et al. arXiv Aug 2025");

  s.addNotes(`Vấn đề: train model 7B params không ổn định. Loss bùng nổ, gradient explode.

Gram Matrix G = FFᵀ: đo correlation giữa các features. G[i,j] = dot product của feature i và j.

Gram Anchoring: enforce G_student ≈ G_teacher. Giữ cấu trúc correlation ổn định, features không "chạy lung tung".

Kiểm chứng: không có → diverge sau ~5K steps. Có → stable đến 1M+ steps.`);
})();

// SLIDE 23 — Text Alignment vs CLIP
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addTitle(s, "Text Alignment vs CLIP");
  addProgress(s, 4);

  // Comparison table
  const tbl = [];
  tbl.push(makeTableHeader(["Aspect", "CLIP", "DINOv3"]));
  tbl.push(makeTableRow(["Training", "Joint (cùng lúc)", "Decoupled (tuần tự)"], 0, null));
  tbl.push(makeTableRow(["Data", "400M pairs", "Images + text optional"], 1, null));
  tbl.push(makeTableRow(["Vision bias", "Bias về text", "Pure visual"], 0, [false, false, true]));
  s.addTable(tbl, { x: M + 0.5, y: 1.3, w: 11, h: 2.5, colW: [3.0, 4.0, 4.0], border: { pt: 0.5, color: C.lightGray } });

  // Diagram
  s.addText("DINOv3 Strategy:", { x: M, y: 4.0, w: CW, h: 0.5, fontFace: FONT, fontSize: MIN_FONT, bold: true, color: C.green, align: "center", margin: 0 });

  s.addText("Phase 1: Train vision (DINO)  →  Phase 2: Add text alignment", {
    x: M, y: 4.6, w: CW, h: 0.6,
    fontFace: FONT, fontSize: MIN_FONT, color: C.black, align: "center", margin: 0,
  });

  s.addText("\"Learn to see first, learn to talk later\"", {
    x: M, y: 5.4, w: CW, h: 0.5,
    fontFace: FONT, fontSize: MIN_FONT, italic: true, color: C.gray, align: "center", margin: 0,
  });

  addSource(s, "Siméoni et al. arXiv Aug 2025");

  s.addNotes(`So sánh CLIP vs DINOv3:

CLIP: Train vision+text cùng lúc → vision bias về text, cần 400M image-text pairs.

DINOv3: Train vision trước (DINO), thêm text alignment sau. Vision features giữ nguyên khi thêm text.

Ưu điểm: "Learn to see first, learn to talk later" → pure visual understanding + multimodal capability.`);
})();

// SLIDE 24 — Scaling Analysis
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addTitle(s, "Scaling Analysis");
  addProgress(s, 4);

  s.addText("Dense tasks được lợi nhiều nhất từ scaling", {
    x: M, y: 1.2, w: CW, h: 0.6,
    fontFace: FONT, fontSize: 30, bold: true, color: C.green, align: "center", margin: 0,
  });

  // Two column comparison
  const lx = M + 0.5, rx = M + 6.5;

  s.addShape(pres.shapes.RECTANGLE, { x: lx, y: 2.0, w: 5.5, h: 2.5, fill: { color: C.tableAlt }, line: { color: C.lightGray, width: 1 } });
  s.addText("Classification", { x: lx, y: 2.1, w: 5.5, h: 0.5, fontFace: FONT, fontSize: MIN_FONT, bold: true, color: C.gray, align: "center", margin: 0 });
  s.addText("+1.9%", { x: lx, y: 2.7, w: 5.5, h: 0.7, fontFace: FONT_TITLE, fontSize: 40, bold: true, color: C.gray, align: "center", margin: 0 });
  s.addText("Gần bão hòa (~90%)", { x: lx, y: 3.5, w: 5.5, h: 0.5, fontFace: FONT, fontSize: 24, italic: true, color: C.gray, align: "center", margin: 0 });

  s.addShape(pres.shapes.RECTANGLE, { x: rx, y: 2.0, w: 5.5, h: 2.5, fill: { color: C.lightGreen }, line: { color: C.green, width: 2 } });
  s.addText("Segmentation", { x: rx, y: 2.1, w: 5.5, h: 0.5, fontFace: FONT, fontSize: MIN_FONT, bold: true, color: C.green, align: "center", margin: 0 });
  s.addText("+6.9 mIoU", { x: rx, y: 2.7, w: 5.5, h: 0.7, fontFace: FONT_TITLE, fontSize: 40, bold: true, color: C.red, align: "center", margin: 0 });
  s.addText("Còn nhiều room", { x: rx, y: 3.5, w: 5.5, h: 0.5, fontFace: FONT, fontSize: 24, italic: true, color: C.green, align: "center", margin: 0 });

  s.addText("Hướng đi: Dense prediction, Video, 3D — không cần scale classification", {
    x: M, y: 5.0, w: CW, h: 0.6,
    fontFace: FONT, fontSize: MIN_FONT, italic: true, color: C.black, align: "center", margin: 0,
  });

  addSource(s, "Siméoni et al. arXiv Aug 2025");

  s.addNotes(`Key insight từ v3: Dense tasks được lợi nhiều nhất từ scaling!

Classification: +1.9% (86.5→88.4%). Gần bão hòa, khó tăng thêm.

Segmentation: +6.9 mIoU (49.0→55.9). Cần hiểu từng pixel → scale giúp nhiều.

Hướng đi tương lai: Focus vào dense prediction, video, 3D. Không cần scale classification nữa.`);
})();

// SLIDE 25 — Results v3
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addTitle(s, "Kết quả DINOv3");
  addProgress(s, 4);

  const tbl = [];
  tbl.push(makeTableHeader(["Benchmark", "v3", "v2", "Δ"]));
  const rows = [["ImageNet", "88.4%", "86.5%", "+1.9"], ["ADE20k", "55.9", "49.0", "+6.9"], ["DAVIS", "83.3", "76.6", "+6.7"]];
  for (let r = 0; r < rows.length; r++) {
    const hl = [false, true, false, true];
    tbl.push(makeTableRow(rows[r], r, hl));
  }
  s.addTable(tbl, { x: M + 1, y: 1.3, w: 10, h: 2.8, colW: [2.5, 2.5, 2.5, 2.5], border: { pt: 0.5, color: C.lightGray } });

  s.addText("88.4% ImageNet — Không nhãn, vượt supervised", {
    x: M, y: 4.5, w: CW, h: 0.7,
    fontFace: FONT, fontSize: 32, bold: true, color: C.red, align: "center", margin: 0,
  });

  addSource(s, "Siméoni et al. arXiv Aug 2025");

  s.addNotes(`Kết quả v3:
- ImageNet: 88.4% (+1.9 so v2)
- ADE20k: 55.9 mIoU (+6.9)
- DAVIS video: 83.3 (+6.7)

Dense tasks cải thiện nhiều nhất. 88.4% ImageNet vượt supervised (85.7%).`);
})();

// SLIDE 26 — v3 Summary
(() => {
  const s = pres.addSlide();
  s.background = { color: C.cream };
  s.addText("DINOv3 — tóm tắt", { x: M, y: 0.4, w: CW, h: 0.7, fontFace: FONT_TITLE, fontSize: 36, bold: true, italic: true, color: C.green, align: "left", margin: 0 });

  const pts = [
    ["Scale:", "7B params, 1.69B ảnh"],
    ["Kỹ thuật:", "Gram Anchoring + Text Alignment"],
    ["Kết quả:", "88.4% ImageNet, 55.9 ADE20k"],
    ["Insight:", "Dense tasks lợi nhiều nhất từ scaling"],
  ];

  for (let i = 0; i < pts.length; i++) {
    s.addText(pts[i][0], {
      x: M + 0.3, y: 1.5 + i * 1.2, w: 2.3, h: 0.8,
      fontFace: FONT, fontSize: MIN_FONT, bold: true, color: C.red, align: "left", valign: "middle", margin: 0,
    });
    s.addText(pts[i][1], {
      x: M + 2.6, y: 1.5 + i * 1.2, w: CW - 2.8, h: 0.8,
      fontFace: FONT, fontSize: MIN_FONT, color: C.black, align: "left", valign: "middle", margin: 0,
    });
  }

  s.addNotes(`Tóm v3: ViT-7B, LVD-1.69B, Gram Anchoring giữ ổn định, Text Alignment thêm multimodal. Scaling chưa bão hoà cho dense tasks.`);
})();

// ═══════════════════════════════════════
// SECTION 5 — Summary
// ═══════════════════════════════════════
addSectionDivider(5, "Tổng hợp");

// SLIDE 27 — Three Versions Comparison
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addTitle(s, "Ba phiên bản");
  addProgress(s, 5);

  const tbl = [];
  tbl.push(makeTableHeader(["", "v1 (2021)", "v2 (2023)", "v3 (2025)"]));
  const rows = [
    ["Data", "1.28M", "142M", "1.69B"],
    ["Model", "86M", "1.1B", "7B"],
    ["Loss", "DINO", "+iBOT +KoLeo", "+Gram +Text"],
    ["ImageNet", "80.1%", "86.5%", "88.4%"],
  ];
  for (let r = 0; r < rows.length; r++) {
    const hl = r === 3 ? [false, false, false, true] : null;
    tbl.push(makeTableRow(rows[r], r, hl));
  }
  s.addTable(tbl, { x: M + 0.3, y: 1.2, w: 11.5, h: 3.5, colW: [2.5, 3.0, 3.0, 3.0], border: { pt: 0.5, color: C.lightGray } });

  s.addText("Data ×1300 · Model ×81 · ImageNet +8.3%", {
    x: M, y: 5.2, w: CW, h: 0.6,
    fontFace: FONT, fontSize: 30, bold: true, color: C.red, align: "center", margin: 0,
  });

  s.addNotes(`4 năm: data ×1300, model ×81, ImageNet +8.3%. Mỗi phiên bản giải quyết hạn chế trước đó. Xu hướng chưa bão hoà.`);
})();

// SLIDE 28 — DINO vs Others
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addTitle(s, "So sánh phương pháp");
  addProgress(s, 5);

  const tbl = [];
  tbl.push(makeTableHeader(["Phương pháp", "ImageNet", "Nhãn?"]));
  const rows = [["DINOv3", "88.4%", "0"], ["Supervised", "85.7%", "1.28M"], ["OpenCLIP", "83.5%", "400M text"], ["MAE", "73.5%", "0"]];
  for (let r = 0; r < rows.length; r++) {
    const hl = r === 0 ? [true, true, true] : null;
    tbl.push(makeTableRow(rows[r], r, hl));
  }
  s.addTable(tbl, { x: M + 0.5, y: 1.3, w: 11, h: 3.2, colW: [3.5, 3.5, 4], border: { pt: 0.5, color: C.lightGray } });

  s.addText("Không nhãn, vượt cả có nhãn", {
    x: M, y: 5.0, w: CW, h: 0.7,
    fontFace: FONT, fontSize: 32, italic: true, bold: true, color: C.red, align: "center", margin: 0,
  });

  s.addNotes(`DINOv3 88.4% không nhãn, vượt supervised 85.7% (1.28M nhãn), OpenCLIP 83.5% (400M text pairs), MAE 73.5%. Self-supervised đã thắng.`);
})();

// SLIDE 29 — Key Takeaways
(() => {
  const s = pres.addSlide();
  s.background = { color: C.cream };

  s.addText("Từ 0 nhãn đến 88.4%", {
    x: M, y: 0.5, w: CW, h: 1.0,
    fontFace: FONT_TITLE, fontSize: 44, bold: true, italic: true, color: C.green, align: "left", margin: 0,
  });

  const lessons = [
    "Self-distillation + EMA = tín hiệu không nhãn",
    "Data sạch quan trọng hơn data nhiều",
    "Scale chưa bão hoà (dense tasks)",
  ];

  for (let i = 0; i < 3; i++) {
    s.addText((i + 1).toString(), { x: M + 0.2, y: 2.0 + i * 1.4, w: 0.8, h: 0.8, fontFace: FONT_TITLE, fontSize: 40, bold: true, color: C.red, align: "center", valign: "middle", margin: 0 });
    s.addText(lessons[i], { x: M + 1.2, y: 2.0 + i * 1.4, w: CW - 1.5, h: 0.8, fontFace: FONT, fontSize: 30, color: C.black, align: "left", valign: "middle", margin: 0 });
  }

  s.addText("Tương lai vision có thể không cần gán nhãn nữa", {
    x: M, y: 6.0, w: CW, h: 0.6,
    fontFace: FONT, fontSize: MIN_FONT, italic: true, color: C.gray, align: "center", margin: 0,
  });

  s.addNotes(`3 bài học: (1) self-distillation+EMA tạo tín hiệu từ chính model; (2) chất lượng data > số lượng; (3) scaling law vẫn đúng, chưa bão hoà.

Self-supervised đã vượt supervised. Tương lai vision có thể không cần gán nhãn nữa.`);
})();

// SLIDE 30 — References
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addTitle(s, "Tài liệu tham khảo");

  const refs = [
    "[1] Caron et al. ICCV 2021 — DINOv1",
    "[2] Oquab et al. TMLR 2024 — DINOv2",
    "[3] Siméoni et al. arXiv 2025 — DINOv3",
    "[4] Zhou et al. ICLR 2022 — iBOT",
    "[5] Darcet et al. ICLR 2024 — Register Tokens",
    "[6] Hinton et al. 2015 — Knowledge Distillation",
  ];

  for (let i = 0; i < refs.length; i++) {
    s.addText(refs[i], {
      x: M + 0.3, y: 1.2 + i * 0.8, w: CW - 0.5, h: 0.65,
      fontFace: FONT, fontSize: MIN_FONT, color: C.black, align: "left", valign: "middle", margin: 0,
    });
  }
})();

// SLIDE 31 — Thank you
(() => {
  const s = pres.addSlide();
  s.background = { color: C.cream };

  s.addText("Cảm ơn", {
    x: 0, y: 2.0, w: W, h: 1.5,
    fontFace: FONT_TITLE, fontSize: 60, bold: true, italic: true,
    color: C.green, align: "center", margin: 0,
  });

  s.addText("Hỏi đáp", {
    x: 0, y: 3.8, w: W, h: 0.8,
    fontFace: FONT, fontSize: 32,
    color: C.gray, align: "center", margin: 0,
  });

  s.addNotes(`Cảm ơn mọi người đã lắng nghe. Mở phần hỏi đáp.`);
})();

// ═══════════════════════════════════════
// WRITE FILE
// ═══════════════════════════════════════
pres.writeFile({ fileName: "./DINO_Seminar_v6.3.pptx" })
  .then(() => console.log("Done! Created DINO_Seminar_v6.3.pptx"))
  .catch(err => console.error(err));
