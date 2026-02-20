const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.33 x 7.5
pres.author = "DINO Seminar";
pres.title = "DINO: Self-Distillation with NO Labels";

// ═══════════════════════════════════════
// DESIGN SYSTEM v6.2
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
};
const FONT = "Roboto";
const FONT_TITLE = "Roboto";
const W = 13.33;
const H = 7.5;
const M = 0.7;
const CW = W - 2 * M;
const MIN_FONT = 28;

// Section names for progress bar (5 sections - removed ViT)
const SECTIONS = ["Vấn đề", "DINOv1", "DINOv2", "DINOv3", "Tổng hợp"];

// Helper: title bar
function addTitle(slide, text) {
  slide.addText(text, {
    x: M, y: 0.3, w: CW, h: 0.7,
    fontFace: FONT_TITLE, fontSize: 36, bold: true, italic: true,
    color: C.green, align: "left", margin: 0,
  });
}

// Helper: source footer
function addSource(slide, text) {
  slide.addText(text, {
    x: M, y: H - 0.55, w: CW, h: 0.35,
    fontFace: FONT, fontSize: 10, italic: true,
    color: C.medGray, align: "left", margin: 0,
  });
}

// Helper: progress bar (5 sections)
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

// Helper: section divider slide
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

// Helper: table header row
function makeTableHeader(texts) {
  return texts.map(t => ({
    text: t,
    options: { bold: true, color: C.white, fill: { color: C.green }, fontSize: 28, fontFace: FONT, align: "center", valign: "middle" },
  }));
}

// Helper: table data row
function makeTableRow(texts, rowIdx, highlights) {
  return texts.map((t, c) => {
    const hl = highlights && highlights[c];
    return {
      text: t,
      options: {
        fontSize: 28, fontFace: FONT,
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
    fontFace: FONT, fontSize: 28, italic: true,
    color: C.gray, align: "left", margin: 0,
  });

  s.addText([
    { text: "v1 · 2021", options: { fontSize: 28 } },
    { text: "    ", options: { fontSize: 28 } },
    { text: "v2 · 2023", options: { fontSize: 28 } },
    { text: "    ", options: { fontSize: 28 } },
    { text: "v3 · 2025", options: { fontSize: 28 } },
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
    fontFace: FONT, fontSize: 28, color: C.black, align: "left", margin: 0,
    lineSpacingMultiple: 1.3,
  });

  s.addNotes(`Chào mọi người. Hôm nay nhóm mình trình bày về DINO — viết tắt của "self-DIstillation with NO labels", tức là tự chưng cất tri thức mà không cần nhãn gì cả. Đây là dòng nghiên cứu của Meta AI.

Có 3 phiên bản: v1 năm 2021, v2 năm 2023, v3 năm 2025. Mỗi bản lớn hơn và mạnh hơn bản trước. Đọc là "đai-nô".

Mục tiêu: train model nhìn ảnh mà không cần ai gán nhãn, nhưng kết quả ngang hoặc vượt supervised learning.`);
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
    ["02", "DINOv1 (2021): Ý tưởng nền tảng"],
    ["03", "DINOv2 (2023): Scale & Dense tasks"],
    ["04", "DINOv3 (2025): Foundation model"],
    ["05", "Tổng hợp & So sánh"],
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

  s.addNotes(`5 phần. Phần 1 nói tại sao supervised learning tốn kém — cần người gán nhãn, tốn tiền, tốn thời gian.

Phần 2, 3, 4 là trọng tâm: 3 phiên bản DINO với cấu trúc và lý do thiết kế. Cuối cùng tổng hợp so sánh.`);
})();

// ═══════════════════════════════════════
// SECTION 1 DIVIDER
// ═══════════════════════════════════════
addSectionDivider(1, "Vấn đề: Chi phí gán nhãn");

// ═══════════════════════════════════════
// SLIDE 3 — Chi phí gán nhãn
// ═══════════════════════════════════════
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
        fontFace: FONT, fontSize: 28,
        color: C.gray, align: "left", margin: 0,
      });
    }
  }

  addSource(s, "Deng et al. CVPR 2009 · Li & Deng 2017");

  s.addNotes(`Trước khi vào DINO, mình muốn mọi người cảm nhận supervised learning tốn kém cỡ nào.

Đây là số liệu thật của ImageNet — dataset phổ biến nhất trong computer vision. Để gán nhãn 14 triệu ảnh, nhóm của giáo sư Fei-Fei Li ở Stanford phải thuê 49 nghìn người từ 167 nước qua Amazon Mechanical Turk. Mỗi ảnh kiểm tra 3 lần bởi 3 người khác nhau. Tổng chi phí hơn nửa triệu đô, mất 2 năm.

Và đó mới chỉ là 1 dataset cho 1000 class. Mỗi bài toán mới — y tế, vệ tinh, nông nghiệp — lại cần gán nhãn lại từ đầu. Câu hỏi tự nhiên: có cách nào học mà không cần nhãn không?`);
})();

// ═══════════════════════════════════════
// SLIDE 4 — Self-supervised learning
// ═══════════════════════════════════════
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
      fontFace: FONT, fontSize: 28, bold: true,
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
    fontFace: FONT, fontSize: 28, italic: true,
    color: C.gray, align: "center", margin: 0,
  });

  s.addNotes(`Giải pháp: self-supervised learning — gọi tắt SSL.

Thay vì thuê người gán nhãn, để model tự tạo tín hiệu giám sát từ dữ liệu thô. Ví dụ: che một phần ảnh rồi bắt model đoán phần bị che. Hoặc xoay ảnh rồi bắt đoán góc xoay. Qua đó model buộc phải hiểu cấu trúc ảnh.

3 hướng chính: contrastive learning (SimCLR, MoCo) — so sánh cặp ảnh; masked image modeling (MAE) — che rồi đoán; distillation (BYOL, DINO) — teacher-student. DINO thuộc nhóm thứ ba, đặc biệt là không cần negative pairs.`);
})();

// ═══════════════════════════════════════
// SECTION 2 DIVIDER — DINOv1
// ═══════════════════════════════════════
addSectionDivider(2, "DINOv1 (2021)");

// ═══════════════════════════════════════
// SLIDE 5 — Core Intuition
// ═══════════════════════════════════════
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

  // Two perspectives diagram
  const leftX = M + 0.3;
  const rightX = M + 6.5;

  s.addShape(pres.shapes.RECTANGLE, {
    x: leftX, y: 2.3, w: 5.2, h: 3.2,
    fill: { color: C.tableAlt }, line: { color: C.green, width: 2 },
  });
  s.addText("Teacher", {
    x: leftX, y: 2.4, w: 5.2, h: 0.6,
    fontFace: FONT, fontSize: 30, bold: true, color: C.green, align: "center", margin: 0,
  });
  s.addText("Nhìn toàn cảnh (global)\nỔn định, cập nhật chậm\n→ \"Đáp án\" cho Student", {
    x: leftX + 0.2, y: 3.1, w: 4.8, h: 2.2,
    fontFace: FONT, fontSize: 28, color: C.black, align: "center", valign: "middle", margin: 0,
  });

  s.addShape(pres.shapes.RECTANGLE, {
    x: rightX, y: 2.3, w: 5.2, h: 3.2,
    fill: { color: C.tableAlt }, line: { color: C.lightGray, width: 1 },
  });
  s.addText("Student", {
    x: rightX, y: 2.4, w: 5.2, h: 0.6,
    fontFace: FONT, fontSize: 30, bold: true, color: C.black, align: "center", margin: 0,
  });
  s.addText("Nhìn cục bộ (local)\nHọc bắt chước Teacher\n→ Buộc hiểu ngữ cảnh", {
    x: rightX + 0.2, y: 3.1, w: 4.8, h: 2.2,
    fontFace: FONT, fontSize: 28, color: C.black, align: "center", valign: "middle", margin: 0,
  });

  s.addText("dạy →", {
    x: M + 5.5, y: 3.5, w: 1.0, h: 0.8,
    fontFace: FONT, fontSize: 28, bold: true, color: C.red, align: "center", valign: "middle",
  });

  addSource(s, "Caron et al. ICCV 2021");

  s.addNotes(`Câu hỏi cốt lõi: không có nhãn thì lấy tín hiệu học từ đâu?

DINO trả lời: dùng chính model làm nguồn tín hiệu. Tạo 2 phiên bản của cùng 1 model: Teacher và Student, cùng kiến trúc nhưng khác tham số.

Teacher nhìn toàn cảnh (global crop), cập nhật chậm → ổn định → output đáng tin cậy → làm "đáp án".

Student nhìn cục bộ (local crop), học bắt chước output của Teacher. Nhìn 1 góc nhỏ nhưng phải đoán được toàn bộ → buộc hiểu ngữ cảnh, không chỉ copy pixel.

Đây là self-distillation: Teacher không train sẵn, mà được tạo từ Student. Cả hai cùng tiến bộ.`);
})();

// ═══════════════════════════════════════
// SLIDE 6 — Knowledge distillation background
// ═══════════════════════════════════════
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addTitle(s, "Knowledge distillation");
  addProgress(s, 2);

  s.addShape(pres.shapes.RECTANGLE, {
    x: M + 0.3, y: 1.5, w: 4.8, h: 1.5,
    fill: { color: C.tableAlt }, line: { color: C.lightGray, width: 1 },
  });
  s.addText("Teacher (lớn, mạnh)", {
    x: M + 0.3, y: 1.5, w: 4.8, h: 1.5,
    fontFace: FONT, fontSize: 28, bold: true,
    color: C.black, align: "center", valign: "middle",
  });

  s.addText("dạy →", {
    x: M + 5.1, y: 1.7, w: 1.8, h: 1.0,
    fontFace: FONT, fontSize: 32, color: C.red, align: "center", valign: "middle",
  });

  s.addShape(pres.shapes.RECTANGLE, {
    x: M + 6.9, y: 1.5, w: 4.8, h: 1.5,
    fill: { color: C.tableAlt }, line: { color: C.lightGray, width: 1 },
  });
  s.addText("Student (nhỏ, nhanh)", {
    x: M + 6.9, y: 1.5, w: 4.8, h: 1.5,
    fontFace: FONT, fontSize: 28, bold: true,
    color: C.black, align: "center", valign: "middle",
  });

  s.addShape(pres.shapes.LINE, {
    x: M + 1, y: 3.5, w: CW - 2, h: 0,
    line: { color: C.lightGray, width: 1 },
  });

  s.addText([
    { text: "Hinton 2015: ", options: { bold: true, fontSize: 28, color: C.black } },
    { text: "\"Dark knowledge\"", options: { italic: true, fontSize: 28, color: C.gray, breakLine: true } },
    { text: "Thay vì nhãn cứng [1,0,0]", options: { fontSize: 28, color: C.black, breakLine: true } },
    { text: "→ Học phân bố mềm [0.8, 0.15, 0.05]", options: { fontSize: 28, color: C.black, breakLine: true } },
    { text: "\"Mèo giống chó hơn giống ô tô\"", options: { fontSize: 28, italic: true, color: C.green } },
  ], {
    x: M + 0.5, y: 3.8, w: CW - 1, h: 2.5,
    fontFace: FONT, align: "left", margin: 0,
  });

  s.addNotes(`Knowledge distillation — ý tưởng từ Hinton 2015: model lớn (Teacher) đã train xong, nén tri thức sang model nhỏ (Student).

Điểm quan trọng: Student không học nhãn cứng mà học output mềm — phân bố xác suất. Thay vì "đây là mèo" (nhãn cứng [1,0,0]), Teacher nói "80% mèo, 15% chó, 5% hổ". Student học được rằng mèo giống chó hơn giống ô tô. Hinton gọi đây là "dark knowledge".

DINO đặc biệt: Teacher và Student cùng kiến trúc, cùng kích thước. Teacher không train sẵn mà tạo từ Student qua EMA. Gọi là self-distillation — tự chưng cất.`);
})();

// ═══════════════════════════════════════
// SLIDE 7 — DINO Architecture Overview
// ═══════════════════════════════════════
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addTitle(s, "Cấu trúc DINO");
  addProgress(s, 2);

  // Image box
  s.addShape(pres.shapes.RECTANGLE, {
    x: M, y: 1.5, w: 2.0, h: 3.8,
    fill: { color: C.tableAlt }, line: { color: C.lightGray, width: 1 },
  });
  s.addText("Ảnh\ngốc", { x: M, y: 2.5, w: 2.0, h: 1.0, fontFace: FONT, fontSize: 28, bold: true, color: C.black, align: "center", valign: "middle" });

  // Teacher branch
  s.addText("global →", { x: M + 2.0, y: 1.6, w: 1.5, h: 0.8, fontFace: FONT, fontSize: 24, italic: true, color: C.gray, align: "center" });
  s.addShape(pres.shapes.RECTANGLE, { x: M + 3.5, y: 1.3, w: 2.8, h: 1.6, fill: { color: C.tableAlt }, line: { color: C.green, width: 2 } });
  s.addText("Teacher\nViT", { x: M + 3.5, y: 1.3, w: 2.8, h: 1.6, fontFace: FONT, fontSize: 28, bold: true, color: C.green, align: "center", valign: "middle" });

  // Projection head Teacher
  s.addText("→", { x: M + 6.3, y: 1.7, w: 0.5, h: 0.8, fontFace: FONT, fontSize: 28, color: C.red, align: "center" });
  s.addShape(pres.shapes.RECTANGLE, { x: M + 6.8, y: 1.3, w: 2.2, h: 1.6, fill: { color: C.white }, line: { color: C.green, width: 1 } });
  s.addText("Proj\nHead", { x: M + 6.8, y: 1.3, w: 2.2, h: 1.6, fontFace: FONT, fontSize: 24, color: C.green, align: "center", valign: "middle" });

  // Pₜ
  s.addText("→ Pₜ", { x: M + 9.0, y: 1.7, w: 1.2, h: 0.8, fontFace: "Consolas", fontSize: 28, bold: true, color: C.green, align: "center" });

  // Student branch
  s.addText("local →", { x: M + 2.0, y: 4.0, w: 1.5, h: 0.8, fontFace: FONT, fontSize: 24, italic: true, color: C.gray, align: "center" });
  s.addShape(pres.shapes.RECTANGLE, { x: M + 3.5, y: 3.7, w: 2.8, h: 1.6, fill: { color: C.tableAlt }, line: { color: C.lightGray, width: 1 } });
  s.addText("Student\nViT", { x: M + 3.5, y: 3.7, w: 2.8, h: 1.6, fontFace: FONT, fontSize: 28, bold: true, color: C.black, align: "center", valign: "middle" });

  // Projection head Student
  s.addText("→", { x: M + 6.3, y: 4.1, w: 0.5, h: 0.8, fontFace: FONT, fontSize: 28, color: C.red, align: "center" });
  s.addShape(pres.shapes.RECTANGLE, { x: M + 6.8, y: 3.7, w: 2.2, h: 1.6, fill: { color: C.white }, line: { color: C.lightGray, width: 1 } });
  s.addText("Proj\nHead", { x: M + 6.8, y: 3.7, w: 2.2, h: 1.6, fontFace: FONT, fontSize: 24, color: C.black, align: "center", valign: "middle" });

  // Pₛ
  s.addText("→ Pₛ", { x: M + 9.0, y: 4.1, w: 1.2, h: 0.8, fontFace: "Consolas", fontSize: 28, bold: true, color: C.black, align: "center" });

  // EMA arrow
  s.addText("EMA ↑", { x: M + 4.2, y: 2.9, w: 1.5, h: 0.7, fontFace: FONT, fontSize: 24, bold: true, color: C.red, align: "center" });

  // Loss box
  s.addShape(pres.shapes.RECTANGLE, { x: M + 10.3, y: 2.3, w: 2.0, h: 2.0, fill: { color: C.white }, line: { color: C.red, width: 2 } });
  s.addText("Loss\n−Σ Pₜ log Pₛ", { x: M + 10.3, y: 2.3, w: 2.0, h: 2.0, fontFace: "Consolas", fontSize: 20, bold: true, color: C.red, align: "center", valign: "middle" });

  addSource(s, "Caron et al. ICCV 2021");

  s.addNotes(`Cấu trúc DINO gồm các thành phần:

1. Ảnh gốc → tạo 2 loại crop: global (>50% ảnh) cho Teacher, local (<50%) cho Student

2. Cả hai qua Vision Transformer (ViT) — cùng kiến trúc, khác tham số. ViT chia ảnh thành patches, xử lý như sequence.

3. Output ViT (CLS token) qua Projection Head — MLP 3 layer (256→2048→K). K là số prototype (65536 trong DINO).

4. Softmax ra phân bố Pₜ và Pₛ, tính cross-entropy loss.

5. Student cập nhật gradient. Teacher cập nhật từ Student qua EMA — không train trực tiếp.

Giờ đi sâu vào từng thành phần.`);
})();

// ═══════════════════════════════════════
// SLIDE 8 — Multi-crop strategy
// ═══════════════════════════════════════
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addTitle(s, "Multi-crop: Local → Global");
  addProgress(s, 2);

  s.addShape(pres.shapes.RECTANGLE, {
    x: M + 0.2, y: 1.4, w: 5.0, h: 3.8,
    fill: { color: C.tableAlt }, line: { color: C.lightGray, width: 1 },
  });
  s.addText("Ảnh gốc\n(2 global + 6 local)", {
    x: M + 0.2, y: 2.4, w: 5.0, h: 1.5,
    fontFace: FONT, fontSize: 28, color: C.gray, align: "center", valign: "middle",
  });

  const rx = M + 5.8;
  s.addText([
    { text: "Global: 224×224, >50% ảnh", options: { bold: true, fontSize: 28, color: C.green, breakLine: true } },
    { text: "→ Teacher nhận", options: { fontSize: 28, color: C.gray, breakLine: true } },
    { text: "", options: { fontSize: 14, breakLine: true } },
    { text: "Local: 96×96, <50% ảnh", options: { bold: true, fontSize: 28, color: C.red, breakLine: true } },
    { text: "→ Student nhận cả 2 loại", options: { fontSize: 28, color: C.gray } },
  ], {
    x: rx, y: 1.6, w: 5.5, h: 3.5,
    fontFace: FONT, align: "left", margin: 0,
  });

  s.addText("Thấy cái vây → phải biết là con cá", {
    x: M, y: 5.6, w: CW, h: 0.6,
    fontFace: FONT, fontSize: 28, italic: true, color: C.gray, align: "center", margin: 0,
  });

  addSource(s, "Caron et al. ICCV 2021 · SwAV (Caron 2020)");

  s.addNotes(`Multi-crop: từ 1 ảnh tạo 2 global crop (>50% ảnh, Teacher nhận) và 6 local crop (<50%, Student nhận). Ý tưởng: nhìn cái vây cá thôi cũng phải biết là con cá — local-to-global.

Tại sao không chỉ 2 global crop? Overlap quá lớn, model chỉ copy chứ không hiểu. Local crop buộc Student suy luận từ cục bộ ra toàn cục.

Chi phí: local crop 96² chỉ 18% pixel so với global 224², nên 6 local ≈ 1 global thêm. 8 góc nhìn thay vì 2, compute chỉ +50%.

Kiểm chứng: bỏ local crop giảm 2-3% ImageNet. Trade-off rất tốt.`);
})();

// ═══════════════════════════════════════
// SLIDE 9 — EMA mechanism
// ═══════════════════════════════════════
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addTitle(s, "EMA: Teacher ổn định");
  addProgress(s, 2);

  s.addText("θ_T ← λ·θ_T + (1−λ)·θ_S", {
    x: M, y: 1.5, w: CW, h: 0.8,
    fontFace: "Consolas", fontSize: 34, bold: true, color: C.black, align: "center", margin: 0,
  });

  s.addText("λ = 0.996 → 1.0", {
    x: M, y: 2.6, w: CW, h: 0.6,
    fontFace: FONT, fontSize: 32, bold: true, color: C.red, align: "center", margin: 0,
  });

  const points = [
    "Teacher giữ 99.6% cũ, lấy 0.4% từ Student",
    "Cosine schedule: λ tăng dần đến 1.0",
    "Cuối training → Teacher gần như không đổi",
  ];

  for (let i = 0; i < points.length; i++) {
    s.addText((i + 1).toString(), {
      x: M + 0.3, y: 3.6 + i * 0.9, w: 0.6, h: 0.6,
      fontFace: FONT_TITLE, fontSize: 28, bold: true, color: C.red, align: "center", valign: "middle",
    });
    s.addText(points[i], {
      x: M + 1.1, y: 3.6 + i * 0.9, w: CW - 1.5, h: 0.6,
      fontFace: FONT, fontSize: 28, color: C.black, align: "left", valign: "middle",
    });
  }

  addSource(s, "Grill et al. NeurIPS 2020 (BYOL) · Caron et al. ICCV 2021");

  s.addNotes(`EMA — Exponential Moving Average. Mỗi bước training, Teacher giữ 99.6% giá trị cũ, lấy 0.4% từ Student. Lambda tăng từ 0.996 lên 1.0 theo cosine schedule — cuối training Teacher gần như không đổi.

Tại sao cần EMA? Nếu cả Teacher và Student cùng train gradient → đuổi theo nhau → mọi ảnh cho ra cùng 1 output = collapse. EMA giải quyết bằng cách cho Teacher đổi cực chậm.

0.996 từ đâu? BYOL (Grill et al. NeurIPS 2020) thử nhiều giá trị, 0.996 tốt nhất. DINO kế thừa. Hình dung: thầy giáo kinh nghiệm — không đổi theo từng câu hỏi mà tích luỹ dần.

Tại sao không fix Teacher luôn? Vì ban đầu Teacher là random, fix thì Student bị giới hạn. EMA cho Teacher tốt dần nhưng đủ chậm để không collapse.`);
})();

// ═══════════════════════════════════════
// SLIDE 10 — Softmax & Temperature
// ═══════════════════════════════════════
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addTitle(s, "Temperature sharpening");
  addProgress(s, 2);

  s.addText("P(xᵢ) = exp(zᵢ/τ) / Σⱼ exp(zⱼ/τ)", {
    x: M, y: 1.4, w: CW, h: 0.7,
    fontFace: "Consolas", fontSize: 28, bold: true, color: C.black, align: "center", margin: 0,
  });

  // Bar charts
  const lx = M + 0.3;
  s.addText("Teacher · τ = 0.04", { x: lx, y: 2.2, w: 5.2, h: 0.5, fontFace: FONT, fontSize: 28, bold: true, color: C.green, align: "center", margin: 0 });

  const tBars = [0.92, 0.03, 0.02, 0.02, 0.01];
  const barW = 0.75;
  const barMaxH = 2.2;
  for (let i = 0; i < tBars.length; i++) {
    const bh = Math.max(tBars[i] * barMaxH, 0.08);
    s.addShape(pres.shapes.RECTANGLE, {
      x: lx + 0.3 + i * (barW + 0.15), y: 2.9 + (barMaxH - bh), w: barW, h: bh,
      fill: { color: C.green },
    });
  }

  const rrx = M + 6.3;
  s.addText("Student · τ = 0.1", { x: rrx, y: 2.2, w: 5.2, h: 0.5, fontFace: FONT, fontSize: 28, bold: true, color: C.black, align: "center", margin: 0 });

  const sBars = [0.45, 0.20, 0.15, 0.12, 0.08];
  for (let i = 0; i < sBars.length; i++) {
    const bh = Math.max(sBars[i] * barMaxH, 0.08);
    s.addShape(pres.shapes.RECTANGLE, {
      x: rrx + 0.3 + i * (barW + 0.15), y: 2.9 + (barMaxH - bh), w: barW, h: bh,
      fill: { color: C.black },
    });
  }

  s.addText("τ nhỏ → sắc nét (Teacher chắc chắn)    τ lớn → mềm (Student linh hoạt)", {
    x: M, y: 5.5, w: CW, h: 0.6,
    fontFace: FONT, fontSize: 28, italic: true, color: C.gray, align: "center", margin: 0,
  });

  addSource(s, "Caron et al. ICCV 2021, Table 7");

  s.addNotes(`Temperature τ kiểm soát độ sắc nét của phân bố. Cùng 1 vector logits, temperature khác → phân bố khác hoàn toàn.

Teacher τ=0.04: 1 class chiếm 92%, gần one-hot. Teacher "chắc chắn". Student τ=0.1: class cao nhất chỉ 45%, còn lại vẫn đáng kể. Student "đang học, cần linh hoạt".

Tại sao Teacher τ nhỏ hơn? Teacher nhìn global crop (nhiều thông tin), cập nhật chậm (ổn định) → output đáng tin, có quyền chắc chắn. Student nhận local crop (ít thông tin) → cần τ lớn để gradient chảy đều.

Con số 0.04 và 0.1: tác giả thử nhiều cặp (Table 7), cặp này tốt nhất. Không có công thức lý thuyết.`);
})();

// ═══════════════════════════════════════
// SLIDE 11 — Centering & Avoiding Collapse
// ═══════════════════════════════════════
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addTitle(s, "Chống collapse");
  addProgress(s, 2);

  s.addText("Collapse = mọi ảnh → cùng 1 output", {
    x: M, y: 1.3, w: CW, h: 0.6,
    fontFace: FONT, fontSize: 28, bold: true, color: C.red, align: "center", margin: 0,
  });

  const cx = M + 0.3, cy = 2.0, cw = 5.3, ch = 3.0;
  s.addShape(pres.shapes.RECTANGLE, { x: cx, y: cy, w: cw, h: ch, fill: { color: C.tableAlt }, line: { color: C.green, width: 2 } });
  s.addText("Centering", { x: cx, y: cy + 0.2, w: cw, h: 0.6, fontFace: FONT, fontSize: 30, bold: true, italic: true, color: C.green, align: "center", margin: 0 });
  s.addText("g(x) − c", { x: cx, y: cy + 0.9, w: cw, h: 0.5, fontFace: "Consolas", fontSize: 28, bold: true, color: C.red, align: "center", margin: 0 });
  s.addText("Trừ running mean\nKhông cho 1 chiều\nchiếm ưu thế", { x: cx + 0.2, y: cy + 1.5, w: cw - 0.4, h: 1.3, fontFace: FONT, fontSize: 26, color: C.gray, align: "center", margin: 0 });

  const dx = M + 6.3;
  s.addShape(pres.shapes.RECTANGLE, { x: dx, y: cy, w: cw, h: ch, fill: { color: C.tableAlt }, line: { color: C.green, width: 2 } });
  s.addText("Sharpening", { x: dx, y: cy + 0.2, w: cw, h: 0.6, fontFace: FONT, fontSize: 30, bold: true, italic: true, color: C.green, align: "center", margin: 0 });
  s.addText("τ = 0.04", { x: dx, y: cy + 0.9, w: cw, h: 0.5, fontFace: "Consolas", fontSize: 28, bold: true, color: C.red, align: "center", margin: 0 });
  s.addText("Temperature thấp\nBuộc Teacher\nchọn rõ ràng", { x: dx + 0.2, y: cy + 1.5, w: cw - 0.4, h: 1.3, fontFace: FONT, fontSize: 26, color: C.gray, align: "center", margin: 0 });

  s.addText("Bỏ centering → collapse sau 1 epoch", {
    x: M, y: 5.4, w: CW, h: 0.5,
    fontFace: FONT, fontSize: 28, italic: true, color: C.red, align: "center", margin: 0,
  });

  addSource(s, "Caron et al. ICCV 2021, Section 3.1");

  s.addNotes(`Collapse: mọi ảnh cho ra cùng 1 output — model "lười", không phân biệt. EMA giúp nhưng chưa đủ. DINO thêm 2 cơ chế:

Centering: trừ running mean c khỏi output Teacher. Không có centering → 1 chiều dominate → mọi output giống nhau → collapse.

Sharpening: τ=0.04 rất thấp. Không có → phân bố đều → Teacher nói "không biết" → Student cũng đều → collapse kiểu khác (uniform collapse).

Kiểm chứng: bỏ centering → collapse sau 1 epoch. Bỏ sharpening → collapse chậm hơn nhưng vẫn xảy ra. Cần cả 2 cùng lúc. Đây là đóng góp kỹ thuật quan trọng nhất của DINO.`);
})();

// ═══════════════════════════════════════
// SLIDE 12 — Emerging Properties
// ═══════════════════════════════════════
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addTitle(s, "Emerging properties");
  addProgress(s, 2);

  s.addText("Attention map tự segment vật thể", {
    x: M, y: 1.3, w: CW, h: 0.7,
    fontFace: FONT, fontSize: 32, bold: true, color: C.green, align: "center", margin: 0,
  });

  // Diagram of attention heads
  const heads = ["Head 1\nĐầu", "Head 2\nThân", "Head 3\nChân", "Head 4\nNền"];
  for (let i = 0; i < 4; i++) {
    const xx = M + 0.5 + i * 3.0;
    s.addShape(pres.shapes.RECTANGLE, {
      x: xx, y: 2.3, w: 2.6, h: 2.0,
      fill: { color: i < 3 ? "E8F5E9" : C.tableAlt }, line: { color: i < 3 ? C.green : C.lightGray, width: 1 },
    });
    s.addText(heads[i], {
      x: xx, y: 2.3, w: 2.6, h: 2.0,
      fontFace: FONT, fontSize: 26, bold: true, color: i < 3 ? C.green : C.gray, align: "center", valign: "middle",
    });
  }

  s.addText([
    { text: "Tại sao? ", options: { bold: true, fontSize: 28, color: C.red } },
    { text: "Local-to-global buộc model hiểu vùng nào quan trọng", options: { fontSize: 28, color: C.black } },
  ], {
    x: M, y: 4.8, w: CW, h: 0.7,
    fontFace: FONT, align: "center", margin: 0,
  });

  s.addText("Supervised: chỉ cần biết \"đây là chó\" → không tự segment", {
    x: M, y: 5.6, w: CW, h: 0.5,
    fontFace: FONT, fontSize: 26, italic: true, color: C.gray, align: "center", margin: 0,
  });

  addSource(s, "Caron et al. ICCV 2021, Figure 1");

  s.addNotes(`Phát hiện nổi bật nhất của DINOv1: attention map của CLS token ở layer cuối tự động segment vật thể khỏi nền. Mỗi head focus 1 phần khác nhau: head 1 nhìn đầu, head 2 nhìn thân, head 3 nhìn chân, head 4 nhìn nền.

Chỉ xảy ra với ViT + DINO, không xảy ra supervised hay CNN. Gọi là emerging property — tính chất nổi lên mà không được lập trình trực tiếp.

Tại sao? Supervised chỉ cần biết "đây là chó" → không cần biết đâu là đầu, đâu là thân. DINO so sánh crop lớn/nhỏ, buộc hiểu vùng nào quan trọng → tự segment.

Ứng dụng: dùng attention map làm pseudo-segmentation mask, không cần annotation.`);
})();

// ═══════════════════════════════════════
// SLIDE 13 — DINOv1 Results
// ═══════════════════════════════════════
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addTitle(s, "Kết quả DINOv1");
  addProgress(s, 2);

  const tbl = [];
  tbl.push(["Model", "Linear probe"].map(t => ({ text: t, options: { bold: true, color: C.white, fill: { color: C.green }, fontSize: 28, fontFace: FONT, align: "center", valign: "middle" } })));
  const rows = [["ViT-S/8", "79.7%"], ["ViT-B/8", "80.1%"], ["ResNet-50 (DINO)", "75.3%"], ["ResNet-50 (Supervised)", "76.5%"]];
  for (let r = 0; r < rows.length; r++) {
    tbl.push(rows[r].map((t, c) => ({
      text: t,
      options: {
        fontSize: 28, fontFace: FONT,
        fill: { color: r === 1 ? "FFF0F0" : (r % 2 === 0 ? C.tableAlt : C.white) },
        color: r === 1 ? C.red : C.black,
        bold: r === 1 || c === 0, align: c === 0 ? "left" : "center", valign: "middle",
      },
    })));
  }
  s.addTable(tbl, { x: M + 0.5, y: 1.3, w: 7, h: 3.2, colW: [4.0, 3.0], border: { pt: 0.5, color: C.lightGray } });

  s.addText("80.1%", { x: M + 8, y: 1.5, w: 3.5, h: 1.2, fontFace: FONT_TITLE, fontSize: 60, bold: true, color: C.red, align: "center", margin: 0 });
  s.addText("vượt supervised\nkhông cần nhãn", { x: M + 8, y: 2.8, w: 3.5, h: 1.0, fontFace: FONT, fontSize: 28, italic: true, color: C.gray, align: "center", margin: 0 });

  s.addText("Milestone: lần đầu self-supervised vượt supervised", { x: M, y: 5.0, w: CW, h: 0.6, fontFace: FONT, fontSize: 28, bold: true, color: C.green, align: "center", margin: 0 });

  addSource(s, "Caron et al. ICCV 2021, Table 2");

  s.addNotes(`80.1% ImageNet linear probe với ViT-B/8 — vượt supervised ResNet-50 (76.5%) mà không cần nhãn. Đây là milestone: lần đầu self-supervised vượt supervised trên ImageNet.

So sánh: ViT (80.1%) mạnh hơn ResNet-50 (75.3%) khi train với DINO → ViT phù hợp hơn cho SSL.

Hạn chế v1: chỉ 1.28M ảnh ImageNet, chỉ test classification, model 86M params. v2 giải quyết cả 3.`);
})();

// ═══════════════════════════════════════
// SLIDE 14 — DINOv1 Summary
// ═══════════════════════════════════════
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
    ["Phát hiện:", "Attention tự segment vật thể"],
  ];

  for (let i = 0; i < pts.length; i++) {
    s.addText(pts[i][0], {
      x: M + 0.3, y: 1.4 + i * 1.0, w: 2.5, h: 0.7,
      fontFace: FONT, fontSize: 28, bold: true, color: C.red, align: "left", valign: "middle", margin: 0,
    });
    s.addText(pts[i][1], {
      x: M + 2.8, y: 1.4 + i * 1.0, w: CW - 3.0, h: 0.7,
      fontFace: FONT, fontSize: 28, color: C.black, align: "left", valign: "middle", margin: 0,
    });
  }

  s.addNotes(`Tóm tắt DINOv1: Self-distillation với Teacher-Student cùng kiến trúc. EMA giữ Teacher ổn định. Multi-crop buộc hiểu local→global. Centering+Sharpening chống collapse. 80.1% ImageNet vượt supervised. Attention map tự segment.

Hạn chế: data 1.28M, model 86M, chỉ classification. DINOv2 giải quyết: data ×110, model ×13, test dense tasks.`);
})();

// ═══════════════════════════════════════
// SECTION 3 DIVIDER — DINOv2
// ═══════════════════════════════════════
addSectionDivider(3, "DINOv2 (2023)");

// ═══════════════════════════════════════
// SLIDE 15 — DINOv2 Motivation
// ═══════════════════════════════════════
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addTitle(s, "Động lực DINOv2");
  addProgress(s, 3);

  s.addText("Hạn chế của v1 → Giải pháp v2", {
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
    const yy = 2.0 + i * 1.1;
    s.addText(problems[i][0], {
      x: M + 0.3, y: yy, w: 4.5, h: 0.8,
      fontFace: FONT, fontSize: 28, color: C.gray, align: "left", valign: "middle",
    });
    s.addText("→", {
      x: M + 4.8, y: yy, w: 0.8, h: 0.8,
      fontFace: FONT, fontSize: 32, bold: true, color: C.red, align: "center", valign: "middle",
    });
    s.addText(problems[i][1], {
      x: M + 5.6, y: yy, w: 6.0, h: 0.8,
      fontFace: FONT, fontSize: 28, bold: true, color: C.green, align: "left", valign: "middle",
    });
  }

  addSource(s, "Oquab et al. TMLR 2024");

  s.addNotes(`DINOv2 ra đời để giải quyết 4 hạn chế của v1:

1. Data nhỏ: ImageNet chỉ 1.28M ảnh, bias về 1000 class. v2 dùng LVD-142M, gấp 110 lần.

2. Model nhỏ: ViT-B 86M params. v2 dùng ViT-g 1.1B params, gấp 13 lần.

3. Chỉ test classification: v1 chỉ đo linear probe ImageNet. v2 test dense tasks: segmentation, depth estimation.

4. Chỉ DINO loss: v2 thêm iBOT (masked prediction) và KoLeo (đẩy embedding trải đều).

Mục tiêu: tạo "foundation model" cho vision — 1 backbone dùng được cho mọi task.`);
})();

// ═══════════════════════════════════════
// SLIDE 16 — LVD-142M Data Curation
// ═══════════════════════════════════════
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
      x: xx, y: 1.6, w: 2.1, h: 1.8,
      fill: { color: isLast ? "FFF0F0" : C.tableAlt },
      line: { color: isLast ? C.red : C.lightGray, width: isLast ? 2 : 1 },
    });
    s.addText(steps[i], {
      x: xx, y: 1.6, w: 2.1, h: 1.8,
      fontFace: FONT, fontSize: 26, bold: true,
      color: isLast ? C.red : C.black, align: "center", valign: "middle",
    });
    if (i < 4) {
      s.addText("→", { x: xx + 2.1, y: 2.0, w: 0.3, h: 1.0, fontFace: FONT, fontSize: 28, color: C.red, align: "center", valign: "middle" });
    }
  }

  s.addText("Chất lượng > Số lượng", {
    x: M, y: 4.0, w: CW, h: 0.7,
    fontFace: FONT, fontSize: 32, bold: true, color: C.red, align: "center", margin: 0,
  });

  s.addText("142M curated thắng 1.2B raw (−2-3% khi dùng raw)", {
    x: M, y: 4.8, w: CW, h: 0.6,
    fontFace: FONT, fontSize: 28, italic: true, color: C.gray, align: "center", margin: 0,
  });

  addSource(s, "Oquab et al. TMLR 2024, Section 3");

  s.addNotes(`LVD pipeline: crawl 1.2 tỷ ảnh từ internet → lọc NSFW và ảnh chất lượng thấp → loại trùng bằng SSCD (Self-Supervised Copy Detection) → chọn qua Faiss nearest neighbor (embed ảnh, so với ImageNet embedding, không dùng nhãn) → 142M sạch.

Điểm quan trọng: không dùng nhãn ở bất kỳ bước nào. Chỉ dùng visual similarity.

Tại sao không dùng luôn 1.2B? Ảnh internet nhiễu: trùng lặp, NSFW, logo, phân bố lệch. Train trên raw 1.2B thua curated 142M khoảng 2-3%.

Bài học: quality > quantity. Đây là insight quan trọng nhất của v2.`);
})();

// ═══════════════════════════════════════
// SLIDE 17 — Three Losses
// ═══════════════════════════════════════
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addTitle(s, "Ba loss của v2");
  addProgress(s, 3);

  const losses = [
    { name: "DINO loss", desc: "CLS token → hiểu toàn cục", reason: "Kế thừa từ v1", y: 1.3 },
    { name: "iBOT loss", desc: "Masked patches → hiểu cục bộ", reason: "Cần cho dense tasks", y: 2.8 },
    { name: "KoLeo", desc: "Trải đều embedding space", reason: "Tránh collapse", y: 4.3 },
  ];

  for (const l of losses) {
    s.addShape(pres.shapes.RECTANGLE, {
      x: M + 0.3, y: l.y, w: 7.0, h: 1.2,
      fill: { color: C.tableAlt }, line: { color: C.lightGray, width: 1 },
    });
    s.addText(l.name, { x: M + 0.5, y: l.y + 0.1, w: 2.5, h: 0.5, fontFace: FONT, fontSize: 28, bold: true, color: C.red, align: "left", margin: 0 });
    s.addText(l.desc, { x: M + 0.5, y: l.y + 0.6, w: 6.5, h: 0.5, fontFace: FONT, fontSize: 26, color: C.gray, align: "left", margin: 0 });

    s.addText(l.reason, { x: M + 7.8, y: l.y + 0.3, w: 4.0, h: 0.6, fontFace: FONT, fontSize: 26, italic: true, color: C.green, align: "left", valign: "middle", margin: 0 });
  }

  s.addText("Bỏ iBOT → ADE20k −4.2 mIoU    Bỏ KoLeo → ImageNet −0.5%", {
    x: M, y: 5.8, w: CW, h: 0.5,
    fontFace: FONT, fontSize: 26, italic: true, color: C.red, align: "center", margin: 0,
  });

  addSource(s, "Oquab et al. TMLR 2024 · Zhou et al. ICLR 2022");

  s.addNotes(`v2 kết hợp 3 loss, mỗi loss có mục đích riêng:

DINO loss: giống v1, dùng CLS token để hiểu toàn cục. Kế thừa nguyên.

iBOT loss (Zhou et al. ICLR 2022): che 1 số patch, bắt Student đoán token từ Teacher. Khác MAE (đoán pixel), iBOT đoán ở mức semantic. Giúp hiểu cục bộ, cần cho segmentation.

KoLeo: đẩy embedding trải đều trong không gian, tránh collapse. Bổ sung cho centering.

Kiểm chứng: bỏ iBOT giảm 4.2 mIoU ADE20k — rất nhiều. Bỏ KoLeo giảm 0.5% ImageNet. Cả 3 cần thiết.`);
})();

// ═══════════════════════════════════════
// SLIDE 18 — iBOT Explanation
// ═══════════════════════════════════════
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addTitle(s, "iBOT: Masked prediction");
  addProgress(s, 3);

  // Diagram
  s.addShape(pres.shapes.RECTANGLE, {
    x: M + 0.3, y: 1.5, w: 3.5, h: 2.5,
    fill: { color: C.tableAlt }, line: { color: C.lightGray, width: 1 },
  });
  s.addText("Ảnh\n(một số patch\nbị che)", {
    x: M + 0.3, y: 1.5, w: 3.5, h: 2.5,
    fontFace: FONT, fontSize: 26, color: C.black, align: "center", valign: "middle",
  });

  s.addText("→", { x: M + 3.8, y: 2.3, w: 0.8, h: 1.0, fontFace: FONT, fontSize: 32, color: C.red, align: "center", valign: "middle" });

  s.addShape(pres.shapes.RECTANGLE, {
    x: M + 4.6, y: 1.5, w: 3.0, h: 2.5,
    fill: { color: C.tableAlt }, line: { color: C.lightGray, width: 1 },
  });
  s.addText("Student\nViT", {
    x: M + 4.6, y: 1.5, w: 3.0, h: 2.5,
    fontFace: FONT, fontSize: 26, bold: true, color: C.black, align: "center", valign: "middle",
  });

  s.addText("→", { x: M + 7.6, y: 2.3, w: 0.8, h: 1.0, fontFace: FONT, fontSize: 32, color: C.red, align: "center", valign: "middle" });

  s.addShape(pres.shapes.RECTANGLE, {
    x: M + 8.4, y: 1.5, w: 3.5, h: 2.5,
    fill: { color: "E8F5E9" }, line: { color: C.green, width: 2 },
  });
  s.addText("Đoán token\ncủa patch bị che\n(từ Teacher)", {
    x: M + 8.4, y: 1.5, w: 3.5, h: 2.5,
    fontFace: FONT, fontSize: 26, bold: true, color: C.green, align: "center", valign: "middle",
  });

  s.addText([
    { text: "MAE: đoán pixel    ", options: { fontSize: 28, color: C.gray } },
    { text: "iBOT: đoán semantic token", options: { fontSize: 28, bold: true, color: C.green } },
  ], {
    x: M, y: 4.5, w: CW, h: 0.6,
    fontFace: FONT, align: "center", margin: 0,
  });

  s.addText("→ Hiểu ý nghĩa, không chỉ copy texture", {
    x: M, y: 5.3, w: CW, h: 0.6,
    fontFace: FONT, fontSize: 28, italic: true, color: C.gray, align: "center", margin: 0,
  });

  addSource(s, "Zhou et al. ICLR 2022");

  s.addNotes(`iBOT (Image BERT): che ngẫu nhiên 1 số patch, bắt Student đoán.

Khác MAE quan trọng: MAE đoán pixel (màu sắc, texture) → học low-level features. iBOT đoán semantic token từ Teacher → học high-level meaning.

Ví dụ: MAE thấy patch bị che → đoán "pixel xanh, texture lông". iBOT → đoán "đây là phần tai con chó".

Tại sao quan trọng cho v2? DINO loss chỉ dùng CLS token (global). iBOT học từng patch (local). Khi cần segmentation — cần biết từng pixel thuộc class nào — local features quan trọng.

Kiểm chứng: bỏ iBOT, ADE20k giảm 4.2 mIoU. Classification không ảnh hưởng nhiều, nhưng dense tasks cần iBOT.`);
})();

// ═══════════════════════════════════════
// SLIDE 19 — DINOv2 Results
// ═══════════════════════════════════════
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
    s.addText(bigs[i].label, { x: xx, y: 2.3, w: 3.7, h: 0.5, fontFace: FONT, fontSize: 28, color: C.gray, align: "center", margin: 0 });
  }

  const tbl = [];
  tbl.push(["Phương pháp", "ImageNet", "ADE20k"].map(t => ({ text: t, options: { bold: true, color: C.white, fill: { color: C.green }, fontSize: 26, fontFace: FONT, align: "center", valign: "middle" } })));
  const rows = [["DINOv2", "86.5%", "49.0"], ["iBOT", "82.3%", "44.8"], ["MAE", "73.5%", "—"], ["OpenCLIP", "83.5%", "—"]];
  for (let r = 0; r < rows.length; r++) {
    tbl.push(rows[r].map((t, c) => ({
      text: t,
      options: {
        fontSize: 26, fontFace: FONT,
        fill: { color: r === 0 ? "FFF0F0" : (r % 2 === 0 ? C.tableAlt : C.white) },
        color: r === 0 ? C.red : C.black, bold: r === 0 || c === 0,
        align: c === 0 ? "left" : "center", valign: "middle",
      },
    })));
  }
  s.addTable(tbl, { x: M + 1.5, y: 3.0, w: 9, h: 3.0, colW: [3.5, 2.75, 2.75], border: { pt: 0.5, color: C.lightGray } });

  addSource(s, "Oquab et al. TMLR 2024, Table 4");

  s.addNotes(`86.5% ImageNet linear probe, ViT-g 1.1B params. 49.0 mIoU ADE20k frozen features (không fine-tune). Vượt tất cả: iBOT 82.3%, MAE 73.5%, OpenCLIP 83.5% (cần 400M text-image pairs).

So v1: +6.4% ImageNet. Lần đầu test dense prediction với kết quả tốt.

DINOv2 là general-purpose: 1 backbone dùng cho classification, segmentation, depth, video. Chính thức trở thành "foundation model" cho vision.`);
})();

// ═══════════════════════════════════════
// SLIDE 20 — DINOv2 Summary
// ═══════════════════════════════════════
(() => {
  const s = pres.addSlide();
  s.background = { color: C.cream };
  s.addText("DINOv2 — tóm tắt", { x: M, y: 0.4, w: CW, h: 0.7, fontFace: FONT_TITLE, fontSize: 36, bold: true, italic: true, color: C.green, align: "left", margin: 0 });

  const pts = [
    ["Data:", "LVD-142M (curated > raw)"],
    ["Model:", "ViT-g 1.1B params"],
    ["Loss:", "DINO + iBOT + KoLeo"],
    ["Kết quả:", "86.5% ImageNet (+6.4%), 49.0 ADE20k"],
    ["Vai trò:", "Foundation model cho vision"],
  ];

  for (let i = 0; i < pts.length; i++) {
    s.addText(pts[i][0], {
      x: M + 0.3, y: 1.4 + i * 1.0, w: 2.0, h: 0.7,
      fontFace: FONT, fontSize: 28, bold: true, color: C.red, align: "left", valign: "middle", margin: 0,
    });
    s.addText(pts[i][1], {
      x: M + 2.3, y: 1.4 + i * 1.0, w: CW - 2.5, h: 0.7,
      fontFace: FONT, fontSize: 28, color: C.black, align: "left", valign: "middle", margin: 0,
    });
  }

  s.addNotes(`So v1: data ×110, model ×13, thêm 2 loss. Kết quả +6.4% ImageNet, mở rộng sang dense tasks. DINOv2 thành foundation model phổ biến nhất cho vision.

Câu hỏi: scale thêm có được không? v3 trả lời.`);
})();

// ═══════════════════════════════════════
// SECTION 4 DIVIDER — DINOv3
// ═══════════════════════════════════════
addSectionDivider(4, "DINOv3 (2025)");

// ═══════════════════════════════════════
// SLIDE 21 — DINOv3 Motivation
// ═══════════════════════════════════════
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addTitle(s, "Động lực DINOv3");
  addProgress(s, 4);

  s.addText("Câu hỏi: Scale có giới hạn không?", {
    x: M, y: 1.2, w: CW, h: 0.6,
    fontFace: FONT, fontSize: 30, bold: true, color: C.red, align: "center", margin: 0,
  });

  const items = [
    { num: "7B", label: "params", desc: "vs 1.1B (×6.4)" },
    { num: "1.69B", label: "ảnh curated", desc: "vs 142M (×12)" },
  ];

  for (let i = 0; i < 2; i++) {
    const xx = M + 0.3 + i * 6.2;
    s.addShape(pres.shapes.RECTANGLE, { x: xx, y: 2.0, w: 5.5, h: 2.6, fill: { color: C.tableAlt }, line: { color: C.lightGray, width: 1 } });
    s.addText(items[i].num, { x: xx, y: 2.2, w: 5.5, h: 0.9, fontFace: FONT_TITLE, fontSize: 48, bold: true, color: C.red, align: "center", margin: 0 });
    s.addText(items[i].label, { x: xx, y: 3.1, w: 5.5, h: 0.5, fontFace: FONT, fontSize: 28, bold: true, color: C.black, align: "center", margin: 0 });
    s.addText(items[i].desc, { x: xx, y: 3.7, w: 5.5, h: 0.5, fontFace: FONT, fontSize: 26, color: C.gray, align: "center", margin: 0 });
  }

  s.addText("Thách thức: train 7B model ổn định + thêm text alignment", {
    x: M, y: 5.2, w: CW, h: 0.6,
    fontFace: FONT, fontSize: 28, italic: true, color: C.gray, align: "center", margin: 0,
  });

  addSource(s, "Siméoni et al. arXiv Aug 2025");

  s.addNotes(`DINOv3 đặt câu hỏi: scaling law có giới hạn không?

Scale: ViT-7B — 7 tỷ params (gấp 6.4× v2), 40 blocks, dim 4096. Data: LVD-1.69B (gấp 12× v2).

Thách thức kỹ thuật: train model 7B không dễ — loss dễ bùng nổ, gradient không ổn định. DINO thêm kỹ thuật mới để giải quyết.

Thêm nữa: v3 muốn kết nối vision với language (multimodal) nhưng không làm hỏng vision features gốc.`);
})();

// ═══════════════════════════════════════
// SLIDE 22 — Gram Anchoring
// ═══════════════════════════════════════
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addTitle(s, "Gram Anchoring");
  addProgress(s, 4);

  s.addText("Vấn đề: Model lớn → Loss bùng nổ", {
    x: M, y: 1.2, w: CW, h: 0.6,
    fontFace: FONT, fontSize: 28, bold: true, color: C.red, align: "center", margin: 0,
  });

  s.addText("G = FFᵀ (Gram matrix)", {
    x: M, y: 2.2, w: CW, h: 0.6,
    fontFace: "Consolas", fontSize: 32, bold: true, color: C.black, align: "center", margin: 0,
  });

  s.addShape(pres.shapes.RECTANGLE, {
    x: M + 1.5, y: 3.0, w: 9, h: 2.0,
    fill: { color: C.tableAlt }, line: { color: C.green, width: 2 },
  });
  s.addText("Gram matrix đo correlation giữa features\n→ Dùng làm \"mỏ neo\" giữ ổn định khi train", {
    x: M + 1.5, y: 3.0, w: 9, h: 2.0,
    fontFace: FONT, fontSize: 28, color: C.black, align: "center", valign: "middle",
  });

  s.addText("Không có Gram Anchoring → training diverge sau vài nghìn steps", {
    x: M, y: 5.5, w: CW, h: 0.5,
    fontFace: FONT, fontSize: 26, italic: true, color: C.red, align: "center", margin: 0,
  });

  addSource(s, "Siméoni et al. arXiv Aug 2025");

  s.addNotes(`Vấn đề: train model 7B params không ổn định. Loss dễ bùng nổ, gradient explode.

Gram matrix G = FFᵀ: tích chéo của feature matrix. Đo correlation giữa các features — feature A có tương quan với feature B bao nhiêu.

Gram Anchoring: dùng Gram matrix làm "mỏ neo" — khi train, enforce Gram matrix của Student gần với Teacher. Giữ cấu trúc correlation ổn định, không cho model "chạy lung tung".

Kiểm chứng: không có Gram Anchoring → training diverge sau vài nghìn steps. Có → train ổn định đến 1M+ steps.

Đây là đóng góp kỹ thuật chính của v3 để scale model lớn.`);
})();

// ═══════════════════════════════════════
// SLIDE 23 — Text Alignment
// ═══════════════════════════════════════
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addTitle(s, "Text Alignment");
  addProgress(s, 4);

  s.addText("Mục tiêu: Vision + Language, không làm hỏng vision", {
    x: M, y: 1.2, w: CW, h: 0.6,
    fontFace: FONT, fontSize: 28, bold: true, color: C.red, align: "center", margin: 0,
  });

  // Diagram
  s.addShape(pres.shapes.RECTANGLE, {
    x: M + 0.5, y: 2.0, w: 4.0, h: 2.0,
    fill: { color: C.tableAlt }, line: { color: C.green, width: 2 },
  });
  s.addText("Vision\nEncoder", {
    x: M + 0.5, y: 2.0, w: 4.0, h: 2.0,
    fontFace: FONT, fontSize: 28, bold: true, color: C.green, align: "center", valign: "middle",
  });

  s.addShape(pres.shapes.RECTANGLE, {
    x: M + 0.5, y: 4.3, w: 4.0, h: 1.5,
    fill: { color: C.tableAlt }, line: { color: C.lightGray, width: 1 },
  });
  s.addText("Text\nEncoder", {
    x: M + 0.5, y: 4.3, w: 4.0, h: 1.5,
    fontFace: FONT, fontSize: 28, bold: true, color: C.black, align: "center", valign: "middle",
  });

  s.addText("→", { x: M + 4.5, y: 2.5, w: 1.0, h: 1.0, fontFace: FONT, fontSize: 40, color: C.red, align: "center", valign: "middle" });
  s.addText("→", { x: M + 4.5, y: 4.5, w: 1.0, h: 1.0, fontFace: FONT, fontSize: 40, color: C.red, align: "center", valign: "middle" });

  s.addShape(pres.shapes.RECTANGLE, {
    x: M + 5.5, y: 2.8, w: 5.5, h: 2.5,
    fill: { color: "E8F5E9" }, line: { color: C.green, width: 2 },
  });
  s.addText("Shared\nEmbedding Space\n(align qua contrastive)", {
    x: M + 5.5, y: 2.8, w: 5.5, h: 2.5,
    fontFace: FONT, fontSize: 26, bold: true, color: C.green, align: "center", valign: "middle",
  });

  s.addText("Decoupled training: vision trước, thêm text sau", {
    x: M, y: 6.0, w: CW, h: 0.5,
    fontFace: FONT, fontSize: 26, italic: true, color: C.gray, align: "center", margin: 0,
  });

  addSource(s, "Siméoni et al. arXiv Aug 2025");

  s.addNotes(`Mục tiêu: kết nối vision với language mà không làm hỏng vision features đã học.

Chiến lược: decoupled training. Train vision encoder trước bằng DINO. Sau đó thêm text encoder, align 2 embedding space qua contrastive loss.

Quan trọng: không train lại vision encoder khi thêm text. Chỉ thêm projection layer nhẹ. Vision features giữ nguyên, không bị "quên" visual knowledge.

So với CLIP: CLIP train vision+text cùng lúc → vision bias về text. DINOv3: vision học pure visual trước → thêm text alignment sau.

Kết quả: giữ được visual performance, thêm được multimodal capability.`);
})();

// ═══════════════════════════════════════
// SLIDE 24 — DINOv3 Results
// ═══════════════════════════════════════
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addTitle(s, "Kết quả DINOv3");
  addProgress(s, 4);

  const tbl = [];
  tbl.push(["Benchmark", "v3", "v2", "Δ"].map(t => ({ text: t, options: { bold: true, color: C.white, fill: { color: C.green }, fontSize: 28, fontFace: FONT, align: "center", valign: "middle" } })));
  const rows = [["ImageNet", "88.4%", "86.5%", "+1.9"], ["ADE20k", "55.9", "49.0", "+6.9"], ["DAVIS", "83.3", "76.6", "+6.7"]];
  for (let r = 0; r < rows.length; r++) {
    tbl.push(rows[r].map((t, c) => ({
      text: t,
      options: {
        fontSize: 28, fontFace: FONT,
        fill: { color: r % 2 === 0 ? C.tableAlt : C.white },
        color: (c === 1 || c === 3) ? C.red : C.black,
        bold: c === 1 || c === 3 || c === 0,
        align: c === 0 ? "left" : "center", valign: "middle",
      },
    })));
  }
  s.addTable(tbl, { x: M + 1, y: 1.3, w: 10, h: 3.0, colW: [2.5, 2.5, 2.5, 2.5], border: { pt: 0.5, color: C.lightGray } });

  s.addText("Dense tasks được lợi nhiều nhất từ scaling", {
    x: M, y: 4.8, w: CW, h: 0.6,
    fontFace: FONT, fontSize: 28, bold: true, color: C.green, align: "center", margin: 0,
  });

  s.addText("Classification gần bão hoà (+1.9%), Segmentation còn nhiều room (+6.9)", {
    x: M, y: 5.5, w: CW, h: 0.5,
    fontFace: FONT, fontSize: 26, italic: true, color: C.gray, align: "center", margin: 0,
  });

  addSource(s, "Siméoni et al. arXiv Aug 2025");

  s.addNotes(`ImageNet +1.9% (86.5→88.4%), ADE20k +6.9 mIoU (49.0→55.9), DAVIS video +6.7 (76.6→83.3).

Insight quan trọng: Dense tasks được lợi nhất từ scaling. Classification ở mức cao khó tăng thêm (gần 90% rồi). Segmentation cần hiểu chi tiết từng pixel nên scale giúp nhiều.

Hướng đi tương lai: không cần scale classification nữa, tập trung vào dense/video/3D tasks.`);
})();

// ═══════════════════════════════════════
// SLIDE 25 — DINOv3 Summary
// ═══════════════════════════════════════
(() => {
  const s = pres.addSlide();
  s.background = { color: C.cream };
  s.addText("DINOv3 — tóm tắt", { x: M, y: 0.4, w: CW, h: 0.7, fontFace: FONT_TITLE, fontSize: 36, bold: true, italic: true, color: C.green, align: "left", margin: 0 });

  const pts = [
    ["Scale:", "7B params, 1.69B ảnh"],
    ["Kỹ thuật:", "Gram Anchoring (ổn định), Text Alignment"],
    ["Kết quả:", "88.4% ImageNet, 55.9 ADE20k"],
    ["Insight:", "Dense tasks lợi nhiều nhất từ scaling"],
  ];

  for (let i = 0; i < pts.length; i++) {
    s.addText(pts[i][0], {
      x: M + 0.3, y: 1.5 + i * 1.2, w: 2.3, h: 0.8,
      fontFace: FONT, fontSize: 28, bold: true, color: C.red, align: "left", valign: "middle", margin: 0,
    });
    s.addText(pts[i][1], {
      x: M + 2.6, y: 1.5 + i * 1.2, w: CW - 2.8, h: 0.8,
      fontFace: FONT, fontSize: 28, color: C.black, align: "left", valign: "middle", margin: 0,
    });
  }

  s.addNotes(`Tóm v3: ViT-7B, LVD-1.69B, Gram Anchoring giữ ổn định, Text Alignment thêm multimodal. 88.4% ImageNet, 55.9 ADE20k. Scaling chưa bão hoà cho dense tasks.`);
})();

// ═══════════════════════════════════════
// SECTION 5 DIVIDER — Summary
// ═══════════════════════════════════════
addSectionDivider(5, "Tổng hợp");

// ═══════════════════════════════════════
// SLIDE 26 — Three Versions Comparison
// ═══════════════════════════════════════
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addTitle(s, "Ba phiên bản");
  addProgress(s, 5);

  const tbl = [];
  tbl.push(["", "v1 (2021)", "v2 (2023)", "v3 (2025)"].map(t => ({ text: t, options: { bold: true, color: C.white, fill: { color: C.green }, fontSize: 26, fontFace: FONT, align: "center", valign: "middle" } })));
  const rows = [
    ["Data", "1.28M", "142M", "1.69B"],
    ["Model", "86M", "1.1B", "7B"],
    ["Loss", "DINO", "+iBOT +KoLeo", "+Gram +Text"],
    ["ImageNet", "80.1%", "86.5%", "88.4%"],
    ["ADE20k", "—", "49.0", "55.9"],
  ];
  for (let r = 0; r < rows.length; r++) {
    tbl.push(rows[r].map((t, c) => ({
      text: t,
      options: {
        fontSize: 26, fontFace: FONT,
        fill: { color: r % 2 === 0 ? C.tableAlt : C.white },
        color: c === 3 && r >= 3 ? C.red : C.black,
        bold: c === 0 || (c === 3 && r >= 3), align: c === 0 ? "left" : "center", valign: "middle",
      },
    })));
  }
  s.addTable(tbl, { x: M + 0.3, y: 1.2, w: 11.5, h: 4.2, colW: [2.5, 3.0, 3.0, 3.0], border: { pt: 0.5, color: C.lightGray } });

  s.addText("Data ×1300 · Model ×81 · ImageNet +8.3%", {
    x: M, y: 5.8, w: CW, h: 0.6,
    fontFace: FONT, fontSize: 30, bold: true, color: C.red, align: "center", margin: 0,
  });

  s.addNotes(`4 năm: data ×1300, model ×81, ImageNet +8.3%. Mỗi phiên bản giải quyết hạn chế trước đó. Xu hướng chưa bão hoà.`);
})();

// ═══════════════════════════════════════
// SLIDE 27 — Evolution of Ideas
// ═══════════════════════════════════════
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addTitle(s, "Tiến hoá ý tưởng");
  addProgress(s, 5);

  const evol = [
    { ver: "v1", idea: "Self-distillation + EMA", insight: "Teacher từ chính Student" },
    { ver: "v2", idea: "Quality data + Dense loss", insight: "Curated > Raw, iBOT cho local" },
    { ver: "v3", idea: "Stability + Multimodal", insight: "Gram Anchoring, decoupled text" },
  ];

  for (let i = 0; i < 3; i++) {
    const yy = 1.4 + i * 1.6;
    s.addText(evol[i].ver, {
      x: M + 0.3, y: yy, w: 1.2, h: 1.2,
      fontFace: FONT_TITLE, fontSize: 36, bold: true, color: C.red, align: "center", valign: "middle",
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: M + 1.7, y: yy, w: 10, h: 1.2,
      fill: { color: C.tableAlt }, line: { color: C.lightGray, width: 1 },
    });
    s.addText(evol[i].idea, {
      x: M + 1.9, y: yy + 0.1, w: 5.5, h: 0.5,
      fontFace: FONT, fontSize: 26, bold: true, color: C.green, align: "left", margin: 0,
    });
    s.addText(evol[i].insight, {
      x: M + 1.9, y: yy + 0.6, w: 9.5, h: 0.5,
      fontFace: FONT, fontSize: 26, italic: true, color: C.gray, align: "left", margin: 0,
    });
  }

  s.addText("Core: Teacher-Student với EMA luôn được giữ nguyên", {
    x: M, y: 5.8, w: CW, h: 0.5,
    fontFace: FONT, fontSize: 28, bold: true, color: C.black, align: "center", margin: 0,
  });

  s.addNotes(`Tiến hoá qua 3 phiên bản:

v1: Đặt nền tảng — self-distillation với EMA. Teacher tạo từ Student, không cần pretrained model.

v2: Mở rộng — data quality quan trọng hơn quantity. Thêm iBOT cho local understanding.

v3: Ổn định & multimodal — Gram Anchoring giải quyết training instability. Text alignment mở rộng sang language.

Điểm chung: core architecture (Teacher-Student + EMA) luôn giữ nguyên. Chỉ thêm kỹ thuật bổ trợ.`);
})();

// ═══════════════════════════════════════
// SLIDE 28 — DINO vs Others
// ═══════════════════════════════════════
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addTitle(s, "So sánh phương pháp");
  addProgress(s, 5);

  const tbl = [];
  tbl.push(["Phương pháp", "ImageNet", "Nhãn?"].map(t => ({ text: t, options: { bold: true, color: C.white, fill: { color: C.green }, fontSize: 28, fontFace: FONT, align: "center", valign: "middle" } })));
  const rows = [["DINOv3", "88.4%", "0"], ["Supervised", "85.7%", "1.28M"], ["OpenCLIP", "83.5%", "400M text"], ["MAE", "73.5%", "0"]];
  for (let r = 0; r < rows.length; r++) {
    tbl.push(rows[r].map((t, c) => ({
      text: t,
      options: {
        fontSize: 28, fontFace: FONT,
        fill: { color: r === 0 ? "FFF0F0" : (r % 2 === 0 ? C.tableAlt : C.white) },
        color: r === 0 ? C.red : C.black, bold: r === 0 || c === 0,
        align: c === 0 ? "left" : "center", valign: "middle",
      },
    })));
  }
  s.addTable(tbl, { x: M + 0.5, y: 1.3, w: 11, h: 3.5, colW: [3.5, 3.5, 4], border: { pt: 0.5, color: C.lightGray } });

  s.addText("Không nhãn, vượt cả có nhãn", {
    x: M, y: 5.3, w: CW, h: 0.7,
    fontFace: FONT, fontSize: 32, italic: true, bold: true, color: C.red, align: "center", margin: 0,
  });

  s.addNotes(`DINOv3 88.4% không nhãn, vượt supervised 85.7% (1.28M nhãn), OpenCLIP 83.5% (400M text pairs), MAE 73.5%. Self-supervised đã thắng supervised.`);
})();

// ═══════════════════════════════════════
// SLIDE 29 — Applications & Limitations
// ═══════════════════════════════════════
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addTitle(s, "Ứng dụng và hạn chế");
  addProgress(s, 5);

  s.addText("Ứng dụng", { x: M, y: 1.2, w: 5.5, h: 0.5, fontFace: FONT, fontSize: 30, bold: true, color: C.green, align: "left", margin: 0 });
  const apps = ["Y tế: X-quang, CT scan", "Viễn thám: ảnh vệ tinh", "Nông nghiệp: bệnh cây trồng", "Robot: ước lượng độ sâu"];
  for (let i = 0; i < apps.length; i++) {
    s.addText(apps[i], { x: M + 0.2, y: 1.9 + i * 0.85, w: 5.5, h: 0.7, fontFace: FONT, fontSize: 28, color: C.black, align: "left", valign: "middle", margin: 0 });
  }

  s.addText("Hạn chế", { x: M + 6.5, y: 1.2, w: 5.5, h: 0.5, fontFace: FONT, fontSize: 30, bold: true, color: C.red, align: "left", margin: 0 });
  const lims = ["61,000 GPU-hours", "~18 tấn CO₂", "Chưa hiểu temporal"];
  for (let i = 0; i < lims.length; i++) {
    s.addText(lims[i], { x: M + 6.7, y: 1.9 + i * 0.85, w: 5.5, h: 0.7, fontFace: FONT, fontSize: 28, color: C.black, align: "left", valign: "middle", margin: 0 });
  }

  s.addText("1 model pretrained → fine-tune nhẹ cho mọi domain", {
    x: M, y: 5.5, w: CW, h: 0.6,
    fontFace: FONT, fontSize: 28, italic: true, color: C.gray, align: "center", margin: 0,
  });

  s.addNotes(`Ứng dụng: y tế (ít nhãn, DINO pretrained giúp), viễn thám, nông nghiệp, robotics. Tất cả dùng 1 model pretrained, fine-tune nhẹ.

Hạn chế: 61K GPU-hours (~$120K+ compute), 18 tấn CO₂ (≈ 9 chuyến HN-NYC), chỉ lab lớn train được. Xử lý frame-by-frame, chưa hiểu temporal/chuyển động — hướng nghiên cứu mở.`);
})();

// ═══════════════════════════════════════
// SLIDE 30 — Key Takeaways
// ═══════════════════════════════════════
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
    fontFace: FONT, fontSize: 28, italic: true, color: C.gray, align: "center", margin: 0,
  });

  s.addNotes(`3 bài học: (1) self-distillation+EMA tạo tín hiệu từ chính model; (2) chất lượng data > số lượng; (3) scaling law vẫn đúng, chưa bão hoà. Self-supervised đã vượt supervised. Tương lai vision có thể không cần gán nhãn nữa.`);
})();

// ═══════════════════════════════════════
// SLIDE 31 — References
// ═══════════════════════════════════════
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addTitle(s, "Tài liệu tham khảo");

  const refs = [
    "[1] Caron et al. ICCV 2021 — DINOv1",
    "[2] Oquab et al. TMLR 2024 — DINOv2",
    "[3] Siméoni et al. arXiv 2025 — DINOv3",
    "[4] Hinton et al. arXiv 2015 — Knowledge Distillation",
    "[5] Zhou et al. ICLR 2022 — iBOT",
    "[6] Grill et al. NeurIPS 2020 — BYOL",
    "[7] He et al. CVPR 2022 — MAE",
  ];

  for (let i = 0; i < refs.length; i++) {
    s.addText(refs[i], {
      x: M + 0.3, y: 1.2 + i * 0.75, w: CW - 0.5, h: 0.6,
      fontFace: FONT, fontSize: 28, color: C.black, align: "left", valign: "middle", margin: 0,
    });
  }
})();

// ═══════════════════════════════════════
// SLIDE 32 — Thank you
// ═══════════════════════════════════════
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
pres.writeFile({ fileName: "./DINO_Seminar_v6.2.pptx" })
  .then(() => console.log("Done! Created DINO_Seminar_v6.2.pptx"))
  .catch(err => console.error(err));
