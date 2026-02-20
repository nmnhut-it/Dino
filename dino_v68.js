/**
 * DINO Seminar v6.8 - Master's Class Edition
 * 24 slides, 30 minutes, rigorous mathematical content
 */

const pptxgen = require("pptxgenjs");
const pres = new pptxgen();

// ═══════════════════════════════════════════════════════════
// Design System v6.8
// ═══════════════════════════════════════════════════════════
const C = {
  // Version colors
  v1: "1565C0",      // Blue - DINOv1
  v2: "FF6D00",      // Orange - DINOv2
  v3: "2E7D32",      // Green - DINOv3

  // Semantic colors
  accent: "C62828",  // Red - emphasis, problems
  success: "008000", // Green - solutions, titles

  // Neutrals
  black: "1A1A1A",
  gray: "555555",
  medGray: "888888",
  lightGray: "E0E0E0",
  white: "FFFFFF",

  // Backgrounds
  bg: "FFFFFF",
  cream: "FFF8F0",
  tableAlt: "F5F5F5",
  formulaBg: "F8F8F8",
};

const FONT = "Arial";
const FONT_MONO = "Consolas";
const W = 13.33;
const H = 7.5;
const M = 0.5;
const CW = W - 2 * M;
const MIN_FONT = 24;

// Section definitions
const SECTIONS = [
  { name: "Hook", color: C.black, slides: [1, 2] },
  { name: "DINOv1", color: C.v1, slides: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
  { name: "DINOv2", color: C.v2, slides: [13, 14, 15, 16, 17, 18] },
  { name: "DINOv3", color: C.v3, slides: [19, 20, 21, 22] },
  { name: "Tổng hợp", color: C.success, slides: [23, 24] },
];

// ═══════════════════════════════════════════════════════════
// Presentation Setup
// ═══════════════════════════════════════════════════════════
pres.defineLayout({ name: "WIDE", width: W, height: H });
pres.layout = "WIDE";
pres.title = "DINO Seminar - Master's Class";
pres.author = "DINO Seminar v6.8";

// ═══════════════════════════════════════════════════════════
// Helper Functions
// ═══════════════════════════════════════════════════════════

function getSectionForSlide(slideNum) {
  for (let i = 0; i < SECTIONS.length; i++) {
    if (SECTIONS[i].slides.includes(slideNum)) {
      return { index: i, section: SECTIONS[i] };
    }
  }
  return { index: 0, section: SECTIONS[0] };
}

function addProgress(slide, slideNum) {
  const y = H - 0.25;
  const totalW = 11;
  const gap = 0.1;
  const barW = (totalW - (SECTIONS.length - 1) * gap) / SECTIONS.length;
  let x = (W - totalW) / 2;

  const { index: activeIdx } = getSectionForSlide(slideNum);

  SECTIONS.forEach((sec, i) => {
    const isActive = i === activeIdx;
    slide.addShape(pres.shapes.RECTANGLE, {
      x, y, w: barW, h: 0.1,
      fill: { color: isActive ? sec.color : C.lightGray },
    });
    x += barW + gap;
  });

  // Slide number
  slide.addText(`${slideNum}/24`, {
    x: W - 1.2, y: H - 0.35, w: 1, h: 0.3,
    fontFace: FONT, fontSize: 11, color: C.medGray, align: "right",
  });
}

function addTitle(slide, title, versionColor = null) {
  slide.addText(title, {
    x: M, y: 0.25, w: CW, h: 0.7,
    fontFace: FONT, fontSize: 32, bold: true,
    color: versionColor || C.success,
  });
}

function addSubtitle(slide, text) {
  slide.addText(text, {
    x: M, y: 0.85, w: CW, h: 0.4,
    fontFace: FONT, fontSize: 18, italic: true, color: C.gray,
  });
}

function addFormula(slide, formula, x, y, w, h, versionColor = C.v1) {
  // Background box
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w, h,
    fill: { color: C.formulaBg },
    line: { color: versionColor, dashType: "dash", pt: 1.5 },
  });
  // Formula text
  slide.addText(formula, {
    x: x + 0.15, y: y + 0.1, w: w - 0.3, h: h - 0.2,
    fontFace: FONT_MONO, fontSize: 20, color: C.black,
    valign: "middle",
  });
}

function addBullets(slide, bullets, x, y, w, h, fontSize = MIN_FONT) {
  const textItems = bullets.map(b => ({
    text: b,
    options: { bullet: { type: "bullet" }, breakLine: true }
  }));

  slide.addText(textItems, {
    x, y, w, h,
    fontFace: FONT, fontSize, color: C.black,
    valign: "top", lineSpacingMultiple: 1.3,
  });
}

function addTable(slide, headers, rows, x, y, w, options = {}) {
  const colW = w / headers.length;
  const tableData = [];

  // Header row
  tableData.push(headers.map(h => ({
    text: h,
    options: {
      bold: true, fill: { color: C.success }, color: C.white,
      fontFace: FONT, fontSize: 18, align: "center", valign: "middle",
    }
  })));

  // Data rows
  rows.forEach((row, idx) => {
    tableData.push(row.map((cell, colIdx) => ({
      text: cell,
      options: {
        fill: { color: idx % 2 === 0 ? C.white : C.tableAlt },
        color: C.black,
        fontFace: FONT, fontSize: 16, align: colIdx === 0 ? "left" : "center", valign: "middle",
        bold: colIdx === 0,
      }
    })));
  });

  slide.addTable(tableData, {
    x, y, w, colW: Array(headers.length).fill(colW),
    border: { pt: 0.5, color: C.lightGray },
    ...options,
  });
}

function addPlaceholder(slide, x, y, w, h, label, versionColor = C.v1) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w, h,
    fill: { color: C.tableAlt },
    line: { color: versionColor, dashType: "dash", pt: 2 },
  });
  slide.addText(`[${label}]`, {
    x, y: y + h / 2 - 0.2, w, h: 0.4,
    fontFace: FONT, fontSize: 14, italic: true, color: C.medGray, align: "center",
  });
}

// ═══════════════════════════════════════════════════════════
// ACT 1: HOOK & PROBLEM (Slides 1-2)
// ═══════════════════════════════════════════════════════════

// SLIDE 1: Demo - Attention Maps
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };

  addTitle(s, "DINO: Tự Phân Đoạn Không Cần Nhãn");
  addSubtitle(s, "\"Điều này không nên xảy ra được...\"");

  // Image placeholder
  addPlaceholder(s, M, 1.4, 6, 4.5, "Attention maps con cá: Đầu (đỏ), Thân (xanh lá), Nền (xanh dương)", C.v1);

  // Key points
  s.addText([
    { text: "Điều Kỳ Lạ:", options: { bold: true, color: C.accent } },
  ], { x: 6.8, y: 1.5, w: 6, h: 0.5, fontFace: FONT, fontSize: 22 });

  addBullets(s, [
    "Head 1: Focus vào ĐẦU (đỏ)",
    "Head 2: Focus vào THÂN + VÂY (xanh lá)",
    "Head 3: Focus vào NỀN (xanh dương)",
    "",
    "Model tự động segment vật thể",
    "Nhưng KHÔNG AI dạy nó!",
    "Không có nhãn 'đầu', 'vây', 'nền'",
  ], 6.8, 2.0, 6, 4, 20);

  s.addText("Làm sao có thể?", {
    x: 6.8, y: 5.5, w: 6, h: 0.6,
    fontFace: FONT, fontSize: 24, bold: true, color: C.accent,
  });

  addProgress(s, 1);
  s.addNotes(`Nhìn vào attention maps này. Các heads khác nhau tự động focus vào phần khác nhau: đầu, thân, nền. Điều này giống như model đã "học" được khái niệm "object" và "background". Nhưng đây là self-supervised - không ai dạy model đâu là đầu, đâu là vây. Model tự học điều này. Hôm nay chúng ta sẽ tìm hiểu: làm sao để train một model như vậy?`);
})();

// SLIDE 2: The Goal
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };

  addTitle(s, "Mục Tiêu: Học Từ Ảnh Không Nhãn");

  // Comparison table
  addTable(s,
    ["", "Supervised", "Mục tiêu"],
    [
      ["Dữ liệu", "14M ảnh có nhãn", "Hàng tỷ ảnh không nhãn"],
      ["Chi phí", "$500K + 2 năm", "$0"],
      ["Khả năng mở rộng", "Bottleneck", "Không giới hạn"],
    ],
    M, 1.4, CW * 0.6
  );

  // Key question box
  s.addShape(pres.shapes.RECTANGLE, {
    x: M, y: 4.2, w: CW, h: 1.2,
    fill: { color: C.cream },
    line: { color: C.accent, pt: 2 },
  });
  s.addText("Có thể train model TỐT NHƯ supervised, nhưng KHÔNG CẦN nhãn?", {
    x: M + 0.3, y: 4.35, w: CW - 0.6, h: 1,
    fontFace: FONT, fontSize: 26, bold: true, color: C.accent, align: "center", valign: "middle",
  });

  // Why it matters
  s.addText("Tại sao quan trọng:", {
    x: M, y: 5.6, w: 3, h: 0.4,
    fontFace: FONT, fontSize: 20, bold: true, color: C.black,
  });
  addBullets(s, [
    "Ảnh không nhãn: Vô hạn (internet)",
    "Ảnh có nhãn: Đắt, chậm, giới hạn",
    "Nếu giải được → Scale vô hạn",
  ], M, 5.9, CW, 1.2, 18);

  addProgress(s, 2);
  s.addNotes(`ImageNet: 14 triệu ảnh, $500K, 2 năm để gán nhãn. Đó là bottleneck lớn nhất của supervised learning. Trong khi đó, ảnh trên internet thì vô hạn và free - nhưng không có nhãn. Câu hỏi: liệu chúng ta có thể train model bằng ảnh không nhãn, mà vẫn đạt chất lượng như supervised? Đây là bài toán DINO giải quyết.`);
})();

// ═══════════════════════════════════════════════════════════
// ACT 2: BUILDING DINOv1 (Slides 3-12)
// ═══════════════════════════════════════════════════════════

// SLIDE 3: Teacher-Student Framework
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };

  addTitle(s, "Ý Tưởng Đầu Tiên: Mô Hình Teacher-Student", C.v1);

  // Diagram placeholder
  addPlaceholder(s, M, 1.3, 6.5, 4, "Sơ đồ kiến trúc Teacher-Student", C.v1);

  // The intuition
  s.addText("Trực Giác:", {
    x: 7.2, y: 1.3, w: 5.5, h: 0.5,
    fontFace: FONT, fontSize: 20, bold: true, color: C.v1,
  });

  s.addText("\"Con người nhìn cá từ góc nào cũng biết đó là cá.\n→ Model nên cho CÙNG output cho các góc nhìn khác nhau.\"", {
    x: 7.2, y: 1.8, w: 5.5, h: 1.2,
    fontFace: FONT, fontSize: 18, italic: true, color: C.gray,
  });

  // Design choices
  s.addText("Lựa Chọn Thiết Kế:", {
    x: 7.2, y: 3.2, w: 5.5, h: 0.5,
    fontFace: FONT, fontSize: 20, bold: true, color: C.black,
  });

  addBullets(s, [
    "Tại sao 2 mạng? Không nhãn → tự tạo \"đáp án\"",
    "Teacher: Tạo pseudo-labels",
    "Student: Học predict giống Teacher",
    "Loss: Cross-entropy (chi tiết sau)",
  ], 7.2, 3.6, 5.5, 2.5, 18);

  // Warning
  s.addText("⚠ Nhưng khoan... Có vấn đề!", {
    x: 7.2, y: 5.8, w: 5.5, h: 0.5,
    fontFace: FONT, fontSize: 20, bold: true, color: C.accent,
  });

  addProgress(s, 3);
  s.addNotes(`Ý tưởng đầu tiên: Dùng 2 networks - Teacher và Student. Từ 1 ảnh, tạo 2 views khác nhau (crop, color jitter...). Teacher xử lý view 1, Student xử lý view 2. Mục tiêu: Student phải predict giống Teacher. Intuition: Nếu 2 views từ cùng 1 ảnh, chúng nên có cùng representation. Nghe hợp lý! Nhưng có một vấn đề nghiêm trọng...`);
})();

// SLIDE 4: Network Architecture
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };

  addTitle(s, "Kiến Trúc Mạng", C.v1);

  // Architecture formula
  addFormula(s, "g = h ∘ f\n\nf = ViT Backbone (output cho downstream)\nh = Projection Head (chỉ khi training)", M, 1.3, 6, 1.8, C.v1);

  // Projection head details
  s.addText("Thiết Kế Projection Head:", {
    x: M, y: 3.4, w: 6, h: 0.4,
    fontFace: FONT, fontSize: 20, bold: true, color: C.v1,
  });

  addTable(s,
    ["Lớp", "Chiều", "Ghi chú"],
    [
      ["Input", "d (ViT output)", "VD: 768 cho ViT-B"],
      ["Hidden 1", "2048", "+ GELU"],
      ["Hidden 2", "2048", "+ GELU"],
      ["Output", "K = 65,536", "Weight normalized"],
    ],
    M, 3.8, 6
  );

  // Key design decisions
  s.addText("Quyết Định Thiết Kế Quan Trọng:", {
    x: 7, y: 1.3, w: 5.8, h: 0.4,
    fontFace: FONT, fontSize: 20, bold: true, color: C.black,
  });

  addBullets(s, [
    "Không có predictor (khác BYOL)",
    "Student = Teacher architecture",
    "Không Batch Normalization trong ViT",
    "→ Toàn hệ thống BN-free!",
  ], 7, 1.7, 5.8, 2, 18);

  // Why BN-free
  s.addShape(pres.shapes.RECTANGLE, {
    x: 7, y: 4, w: 5.8, h: 1.5,
    fill: { color: C.cream },
  });
  s.addText("Tại sao BN-free quan trọng:\nBN tạo dependencies ngầm trên batch.\nSSL hoạt động tốt hơn khi không có BN.", {
    x: 7.2, y: 4.1, w: 5.4, h: 1.4,
    fontFace: FONT, fontSize: 16, color: C.gray,
  });

  addProgress(s, 4);
  s.addNotes(`Network g gồm backbone f và projection head h. Backbone là ViT - dùng cho downstream tasks. Projection head là 3-layer MLP với hidden dim 2048, output K=65536. Không có predictor như BYOL - Student và Teacher cùng architecture. Quan trọng: toàn bộ system không dùng batch normalization. Điều này quan trọng vì BN tạo dependencies ngầm trên batch statistics.`);
})();

// SLIDE 5: Loss Function
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };

  addTitle(s, "Hàm Loss - Phân Tích Chi Tiết", C.v1);

  // Main loss formula
  s.addText("Cross-Entropy Loss:", {
    x: M, y: 1.2, w: CW, h: 0.4,
    fontFace: FONT, fontSize: 20, bold: true, color: C.v1,
  });

  addFormula(s, "L = -Σₖ Pₜ(x)[k] · log Pₛ(x')[k]", M, 1.6, CW, 0.8, C.v1);

  // Student probability
  s.addText("Xác Suất Student (softmax chuẩn):", {
    x: M, y: 2.6, w: 6, h: 0.4,
    fontFace: FONT, fontSize: 18, bold: true, color: C.black,
  });
  addFormula(s, "Pₛ(x)[k] = exp(gθₛ(x)[k] / τₛ) / Σₖ' exp(gθₛ(x)[k'] / τₛ)\n\nτₛ = 0.1 (nhiệt độ student)", M, 3.0, 6.2, 1.3, C.v1);

  // Teacher probability
  s.addText("Xác Suất Teacher (có centering):", {
    x: 6.8, y: 2.6, w: 6, h: 0.4,
    fontFace: FONT, fontSize: 18, bold: true, color: C.black,
  });
  addFormula(s, "Pₜ(x)[k] = exp((gθₜ(x)[k] - c[k]) / τₜ) / Σₖ' exp(...)\n\nτₜ = 0.04 (nhiệt độ teacher)\nc = vector centering", 6.8, 3.0, 6, 1.5, C.v1);

  // Why cross-entropy
  s.addText("Tại Sao Cross-Entropy?", {
    x: M, y: 4.8, w: CW, h: 0.4,
    fontFace: FONT, fontSize: 18, bold: true, color: C.black,
  });
  addBullets(s, [
    "Đo divergence giữa hai phân phối",
    "Minimize → Student tiệm cận phân phối Teacher",
    "Bất đối xứng: Teacher là \"target\", Student là \"prediction\"",
  ], M, 5.2, CW, 1.5, 18);

  addProgress(s, 5);
  s.addNotes(`Loss là cross-entropy giữa Teacher và Student outputs. Student dùng softmax chuẩn với temperature τ_s = 0.1. Teacher dùng softmax với centering (trừ c) và temperature τ_t = 0.04. Tại sao temperatures khác nhau? Slide 9 sẽ giải thích. Tại sao centering? Slide 8. K=65536 output có thể hiểu như soft assignment cho K prototypes - tương tự clustering nhưng differentiable.`);
})();

// SLIDE 6: Collapse Problem
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };

  addTitle(s, "Vấn Đề Sụp Đổ (Collapse)", C.accent);

  // Diagram placeholder
  addPlaceholder(s, M, 1.3, CW, 3.2, "Mode Collapse (tất cả điểm tụ 1 chỗ) vs Uniform Collapse (lưới đều)", C.accent);

  // Explanation table
  addTable(s,
    ["Loại Collapse", "Nguyên nhân", "Kết quả"],
    [
      ["Mode Collapse", "Teacher & Student output cùng giá trị", "Loss = 0, nhưng vô nghĩa"],
      ["Uniform Collapse", "Output trải đều", "Loss thấp, nhưng vô dụng"],
    ],
    M, 4.7, CW * 0.7
  );

  // The dilemma
  s.addText("Tình Huống Khó:", {
    x: 9, y: 4.7, w: 3.8, h: 0.4,
    fontFace: FONT, fontSize: 18, bold: true, color: C.accent,
  });
  s.addText("Không nhãn → Không gì ngăn Teacher output hằng số.\n\nCách DINO: Không cần negatives!", {
    x: 9, y: 5.1, w: 3.8, h: 1.5,
    fontFace: FONT, fontSize: 16, color: C.gray,
  });

  addProgress(s, 6);
  s.addNotes(`Đây là vấn đề lớn nhất của self-supervised: collapse. Mode collapse: Teacher và Student "thông đồng" - cả 2 output cùng 1 vector cho MỌI ảnh. Loss = 0, nhưng model không học được gì. Uniform collapse: Output trải đều như uniform distribution - cũng vô nghĩa. Contrastive learning giải quyết bằng negative samples. DINO có cách khác: không cần negatives. 3 tricks sau đây.`);
})();

// SLIDE 7: EMA Teacher
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };

  addTitle(s, "EMA Teacher - Cơ Chế Đầy Đủ", C.v1);

  // Main formula
  addFormula(s, "θₜ ← λ·θₜ + (1-λ)·θₛ\n\nλ: cosine schedule 0.996 → 1.0 trong quá trình training", M, 1.3, 7, 1.4, C.v1);

  // Explanation
  s.addText("Ý nghĩa:", {
    x: M, y: 3.0, w: 6.5, h: 0.4,
    fontFace: FONT, fontSize: 20, bold: true, color: C.black,
  });
  addBullets(s, [
    "Teacher giữ 99.6% weights cũ",
    "Chỉ lấy 0.4% từ Student mỗi bước",
    "λ tăng dần (Teacher càng \"đóng băng\")",
  ], M, 3.4, 6.5, 1.8, 18);

  // Why it works
  s.addText("Tại Sao EMA Hoạt Động:", {
    x: 8, y: 1.3, w: 4.8, h: 0.4,
    fontFace: FONT, fontSize: 20, bold: true, color: C.v1,
  });

  addTable(s,
    ["Insight", "Giải thích"],
    [
      ["Polyak-Ruppert", "Model ensembling với decay"],
      ["Teacher > Student", "Targets chất lượng cao hơn"],
      ["Targets ổn định", "Di chuyển chậm = tín hiệu ổn định"],
      ["Không \"thông đồng\"", "Tốc độ update khác nhau"],
    ],
    8, 1.8, 4.8
  );

  // Key observation
  s.addShape(pres.shapes.RECTANGLE, {
    x: M, y: 5.3, w: CW, h: 1,
    fill: { color: C.cream },
  });
  s.addText("Quan sát quan trọng: \"Teacher có performance tốt hơn Student suốt quá trình training, do đó hướng dẫn training bằng cách cung cấp target features chất lượng cao hơn.\"", {
    x: M + 0.2, y: 5.4, w: CW - 0.4, h: 0.9,
    fontFace: FONT, fontSize: 16, italic: true, color: C.gray, valign: "middle",
  });

  addProgress(s, 7);
  s.addNotes(`EMA Teacher là critical. Update rule: Teacher giữ 99.6% weights cũ và lấy 0.4% từ Student. λ theo cosine schedule từ 0.996 lên 1.0. Tại sao hoạt động? Đây là Polyak-Ruppert averaging - model ensembling với decay. Teacher performs better than Student throughout training - cung cấp targets chất lượng cao hơn. Nếu Teacher và Student update cùng tốc độ, chúng sẽ "đồng lõa" collapse.`);
})();

// SLIDE 8: Centering
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };

  addTitle(s, "Centering - Công Thức Chi Tiết", C.v1);

  // Formula
  addFormula(s, "c ← m·c + (1-m) · (1/B) · Σᵢ gθₜ(xᵢ)\n\nm = tham số tốc độ (VD: 0.9)\nB = batch size", M, 1.3, 7, 1.6, C.v1);

  // How applied
  s.addText("Cách Áp Dụng Centering:", {
    x: M, y: 3.2, w: 6.5, h: 0.4,
    fontFace: FONT, fontSize: 20, bold: true, color: C.black,
  });
  addFormula(s, "gₜ(x) ← gₜ(x) - c\n\nTrừ center trước softmax", M, 3.6, 5, 1, C.v1);

  // Why it prevents collapse
  s.addText("Tại Sao Centering Ngăn Mode Collapse:", {
    x: M, y: 5.0, w: 6, h: 0.4,
    fontFace: FONT, fontSize: 18, bold: true, color: C.v1,
  });

  addTable(s,
    ["Tình huống", "Sau Centering"],
    [
      ["Teacher output hằng số v", "c → v, thì v - c = 0"],
      ["Buộc output đa dạng!", "Không thể collapse về hằng số"],
    ],
    M, 5.4, 6
  );

  // Side effect warning
  s.addShape(pres.shapes.RECTANGLE, {
    x: 7.5, y: 1.3, w: 5.3, h: 2,
    fill: { color: "FFF0F0" },
    line: { color: C.accent, pt: 1 },
  });
  s.addText("⚠ Tác Dụng Phụ:\n\nCentering đơn lẻ khuyến khích UNIFORM collapse!\n\n→ Cần sharpening để cân bằng", {
    x: 7.7, y: 1.4, w: 5, h: 1.9,
    fontFace: FONT, fontSize: 16, color: C.accent,
  });

  // Key insight
  s.addText("Quan trọng: Chỉ dùng first-order batch stats → hoạt động với mọi batch size", {
    x: 7.5, y: 4, w: 5.3, h: 0.8,
    fontFace: FONT, fontSize: 16, italic: true, color: C.gray,
  });

  addProgress(s, 8);
  s.addNotes(`Centering ngăn mode collapse. Center c là EMA của Teacher outputs trên batches. Trừ c từ Teacher output trước softmax. Nếu Teacher collapse và output constant v cho MỌI ảnh, thì batch mean = v, c hội tụ về v. Sau centering: v - c = 0. BUỘC Teacher phải output khác nhau. Centering chỉ dùng first-order statistics, hoạt động tốt với nhiều batch sizes. Nhưng centering có side effect: khuyến khích uniform collapse. Cần sharpening để balance.`);
})();

// SLIDE 9: Sharpening
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };

  addTitle(s, "Sharpening - Phân Tích Temperature", C.v1);

  // Temperature effect placeholder
  addPlaceholder(s, M, 1.3, 6, 3, "Hiệu ứng temperature: τ=1.0 (phẳng) → τ=0.04 (nhọn)", C.v1);

  // Formula
  s.addText("Temperature trong Softmax:", {
    x: 7, y: 1.3, w: 5.8, h: 0.4,
    fontFace: FONT, fontSize: 18, bold: true, color: C.black,
  });
  addFormula(s, "P[k] = exp(z[k]/τ) / Σₖ' exp(z[k']/τ)\n\nτ → 0: one-hot (argmax)\nτ → ∞: uniform", 7, 1.7, 5.8, 1.6, C.v1);

  // DINO's choice
  s.addText("Lựa Chọn Temperature của DINO:", {
    x: 7, y: 3.6, w: 5.8, h: 0.4,
    fontFace: FONT, fontSize: 18, bold: true, color: C.v1,
  });

  addTable(s,
    ["Mạng", "τ", "Hiệu ứng"],
    [
      ["Teacher", "0.04", "Sharp/tự tin"],
      ["Student", "0.1", "Mềm hơn (dễ học)"],
    ],
    7, 4.0, 5.8
  );

  // Balance explanation
  s.addShape(pres.shapes.RECTANGLE, {
    x: M, y: 4.8, w: CW, h: 1.5,
    fill: { color: C.cream },
  });
  s.addText("Cân Bằng Centering + Sharpening:", {
    x: M + 0.2, y: 4.9, w: CW - 0.4, h: 0.4,
    fontFace: FONT, fontSize: 18, bold: true, color: C.success,
  });
  s.addText("• Centering đơn lẻ → khuyến khích UNIFORM collapse\n• Sharpening đơn lẻ → khuyến khích output NHỌN\n• Kết hợp → CÂN BẰNG, training ổn định!", {
    x: M + 0.2, y: 5.3, w: CW - 0.4, h: 1,
    fontFace: FONT, fontSize: 16, color: C.black,
  });

  addProgress(s, 9);
  s.addNotes(`Temperature kiểm soát độ "nhọn" của softmax. τ thấp (0.04 cho Teacher) = sharp, confident output. τ cao = soft, uncertain. Tại sao khác nhau? Teacher dùng τ=0.04 (rất sharp) để ngăn uniform collapse. Student dùng τ=0.1 (softer) vì học từ targets quá sharp khó hơn. Key insight: Centering khuyến khích uniform, Sharpening khuyến khích peaked. Cùng nhau chúng balance, tạo stable training.`);
})();

// SLIDE 10: Ablation
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };

  addTitle(s, "Ablation: Bỏ Từng Thành Phần Thì Sao?", C.v1);

  // Ablation table
  addTable(s,
    ["Cấu hình", "Kết quả"],
    [
      ["DINO đầy đủ (EMA + Centering + Sharpening)", "✓ Hoạt động (80.1% ImageNet)"],
      ["Bỏ EMA (copy weights)", "✗ Không hội tụ"],
      ["Bỏ Centering", "✗ Mode collapse"],
      ["Bỏ Sharpening (τ_t = τ_s = 0.1)", "✗ Uniform collapse"],
      ["Bỏ cả Centering và Sharpening", "✗ Collapse ngay lập tức"],
    ],
    M, 1.3, CW * 0.75
  );

  // Three pillars diagram placeholder
  addPlaceholder(s, 9.5, 1.3, 3.3, 2.5, "Ba trụ cột hỗ trợ Training ổn định", C.v1);

  // Key finding quote
  s.addShape(pres.shapes.RECTANGLE, {
    x: M, y: 4.6, w: CW, h: 1.2,
    fill: { color: C.cream },
  });
  s.addText("\"Centering ngăn một dimension chiếm ưu thế nhưng khuyến khích collapse về uniform distribution, trong khi sharpening có hiệu ứng ngược lại. Áp dụng cả hai cân bằng hiệu ứng của nhau.\"", {
    x: M + 0.2, y: 4.7, w: CW - 0.4, h: 1.1,
    fontFace: FONT, fontSize: 16, italic: true, color: C.gray, valign: "middle",
  });

  // Summary
  s.addText("Cả BA đều cần thiết. Bỏ bất kỳ → collapse.", {
    x: M, y: 6.0, w: CW, h: 0.5,
    fontFace: FONT, fontSize: 22, bold: true, color: C.accent, align: "center",
  });

  addProgress(s, 10);
  s.addNotes(`Ablation study chứng minh mỗi component là essential. Bỏ EMA → fails to converge vì Teacher và Student update cùng nhau collapse. Bỏ centering → mode collapse. Bỏ sharpening → uniform collapse. Paper nói rõ: "centering ngăn 1 dimension dominate nhưng khuyến khích uniform collapse, sharpening có hiệu ứng ngược lại." Không phải optional tricks - đây là core của DINO.`);
})();

// SLIDE 11: Multi-crop
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };

  addTitle(s, "Chiến Lược Multi-Crop: Local-to-Global", C.v1);

  // Diagram placeholder
  addPlaceholder(s, M, 1.3, 6.5, 4, "Multi-crop: 2 global (224²) + 6 local (96²)", C.v1);

  // The insight
  s.addText("Insight Quan Trọng:", {
    x: 7.2, y: 1.3, w: 5.6, h: 0.4,
    fontFace: FONT, fontSize: 20, bold: true, color: C.v1,
  });
  s.addText("\"Thấy VÂY CÁ (local)\n→ phải biết đó là CON CÁ (global)\"", {
    x: 7.2, y: 1.7, w: 5.6, h: 0.8,
    fontFace: FONT, fontSize: 20, italic: true, color: C.accent,
  });

  // Table
  addTable(s,
    ["Loại Crop", "Kích thước", "Độ phủ", "→"],
    [
      ["Global 1-2", "224×224", ">50%", "Teacher"],
      ["Local 1-6", "96×96", "<50%", "Student"],
    ],
    7.2, 2.8, 5.6
  );

  // Effect
  s.addText("Tại Sao Buộc Hiểu Ngữ Nghĩa:", {
    x: 7.2, y: 4.2, w: 5.6, h: 0.4,
    fontFace: FONT, fontSize: 18, bold: true, color: C.black,
  });
  s.addText("Student chỉ thấy cánh → phải predict \"đây là con chim\"\n\n→ Phải học KHÁI NIỆM NGỮ NGHĨA, không chỉ copy pixels!", {
    x: 7.2, y: 4.6, w: 5.6, h: 1.2,
    fontFace: FONT, fontSize: 16, color: C.gray,
  });

  // Compute cost
  s.addText("Tính toán: ~2.4× chi phí, nhưng cho phép hiểu ngữ nghĩa", {
    x: M, y: 5.8, w: CW, h: 0.4,
    fontFace: FONT, fontSize: 16, italic: true, color: C.medGray,
  });

  addProgress(s, 11);
  s.addNotes(`Đây là insight quan trọng nhất của DINO. Teacher nhìn global (>50% ảnh), Student nhìn local (<50% ảnh). Student phải predict output của Teacher. Ví dụ: Student chỉ thấy vây cá, nhưng phải output giống Teacher (thấy cả con cá). Điều này BUỘC Student hiểu: "vây này thuộc về con cá". Đây là lý do DINO học được semantic concepts mà không cần labels.`);
})();

// SLIDE 12: DINOv1 Results
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };

  addTitle(s, "Kết Quả DINOv1", C.v1);

  // Results table
  addTable(s,
    ["Phương pháp", "ImageNet Acc", "Nhãn", "Năm"],
    [
      ["DINO v1", "80.1%", "0", "2021"],
      ["Supervised ViT", "76.5%", "14M", "-"],
      ["SimCLR", "69.3%", "0", "2020"],
      ["BYOL", "74.3%", "0", "2020"],
      ["MoCo v3", "76.7%", "0", "2021"],
    ],
    M, 1.3, 7
  );

  // Milestone
  s.addShape(pres.shapes.RECTANGLE, {
    x: M, y: 4.0, w: 7, h: 0.8,
    fill: { color: "E8F5E9" },
    line: { color: C.success, pt: 2 },
  });
  s.addText("🎯 Lần đầu SSL VƯỢT Supervised trên ImageNet!", {
    x: M + 0.2, y: 4.1, w: 6.6, h: 0.7,
    fontFace: FONT, fontSize: 20, bold: true, color: C.success, valign: "middle",
  });

  // Limitations
  s.addText("Nhưng... Còn Hạn Chế:", {
    x: 8, y: 1.3, w: 4.8, h: 0.4,
    fontFace: FONT, fontSize: 18, bold: true, color: C.accent,
  });

  addTable(s,
    ["Hạn chế", "Ảnh hưởng"],
    [
      ["Data nhỏ (1.28M)", "Đa dạng hạn chế"],
      ["Chỉ classification", "Dense tasks?"],
      ["Một loss (CLS)", "Patch-level?"],
    ],
    8, 1.8, 4.8
  );

  // Questions for v2
  s.addText("Câu hỏi cho v2:", {
    x: 8, y: 4.0, w: 4.8, h: 0.4,
    fontFace: FONT, fontSize: 18, bold: true, color: C.v2,
  });
  addBullets(s, [
    "Nhiều data hơn = tốt hơn?",
    "Dense tasks cần gì?",
    "Có thể xây Foundation Model?",
  ], 8, 4.4, 4.8, 2, 16);

  addProgress(s, 12);
  s.addNotes(`DINOv1 đạt milestone quan trọng: 80.1% ImageNet với 0 labels - lần đầu SSL vượt supervised! Emerging properties: attention heads tự động segment objects. Nhưng còn hạn chế: chỉ train trên ImageNet (1.28M ảnh), chỉ làm tốt classification, dùng 1 loss (CLS token). Câu hỏi cho v2: Nhiều data hơn có tốt hơn? Dense tasks cần gì thêm? Có thể tạo Foundation Model không?`);
})();

// ═══════════════════════════════════════════════════════════
// ACT 3: EVOLUTION TO v2 (Slides 13-18)
// ═══════════════════════════════════════════════════════════

// SLIDE 13: v1 Limitations
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };

  addTitle(s, "Hạn Chế v1 → Câu Hỏi v2", C.v2);

  addTable(s,
    ["Khía cạnh", "v1 Hiện tại", "Câu hỏi cho v2"],
    [
      ["Dữ liệu", "1.28M (ImageNet)", "Nhiều data hơn có tốt? Cách curate?"],
      ["Tasks", "Chỉ Classification", "Có thể segmentation, depth?"],
      ["Loss", "Chỉ CLS token", "Có thể học patch-level features?"],
      ["Scale", "ViT-B/S", "Có thể scale lên 1B+ params?"],
    ],
    M, 1.3, CW
  );

  // Foundation Model definition
  s.addShape(pres.shapes.RECTANGLE, {
    x: M, y: 4.0, w: CW, h: 1.2,
    fill: { color: C.cream },
    line: { color: C.v2, pt: 2 },
  });
  s.addText("Định nghĩa Foundation Model:", {
    x: M + 0.2, y: 4.1, w: CW - 0.4, h: 0.4,
    fontFace: FONT, fontSize: 18, bold: true, color: C.v2,
  });
  s.addText("\"1 backbone pretrained → nhiều tasks → frozen features + simple head\"", {
    x: M + 0.2, y: 4.5, w: CW - 0.4, h: 0.6,
    fontFace: FONT, fontSize: 20, italic: true, color: C.black,
  });

  // Three innovations preview
  s.addText("Ba Đổi Mới của v2:", {
    x: M, y: 5.5, w: CW, h: 0.4,
    fontFace: FONT, fontSize: 20, bold: true, color: C.v2,
  });
  s.addText("1. Data Curation (LVD-142M)    2. Ba Losses (DINO + iBOT + KoLeo)    3. Scale (ViT-g 1.1B)", {
    x: M, y: 5.9, w: CW, h: 0.5,
    fontFace: FONT, fontSize: 18, color: C.gray,
  });

  addProgress(s, 13);
  s.addNotes(`DINOv1 groundbreaking nhưng limited. Chỉ train trên ImageNet - nếu có billions images thì sao? Chỉ classification - segmentation, depth estimation? Chỉ CLS token - patches? v2 asks: Có thể tạo Foundation Model không? Một backbone cho mọi thứ - classification, segmentation, depth, retrieval - không cần task-specific training.`);
})();

// SLIDE 14: Data Curation
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };

  addTitle(s, "Quy Trình Xử Lý Dữ Liệu - LVD-142M", C.v2);

  // Pipeline placeholder
  addPlaceholder(s, M, 1.3, 5.5, 4.5, "Phễu lọc: 1.2B → 1.1B → 744M → 142M curated", C.v2);

  // Pipeline steps
  s.addText("Các Bước Xử Lý:", {
    x: 6.2, y: 1.3, w: 6.6, h: 0.4,
    fontFace: FONT, fontSize: 18, bold: true, color: C.v2,
  });

  const steps = [
    "1.2B raw (thu thập web)",
    "→ Lọc an toàn (NSFW, bị cấm)",
    "→ Loại trùng PCA hash",
    "1.1B",
    "→ Copy-detection (sim > 0.6, k=64)",
    "744M",
    "→ Loại rò rỉ benchmark (sim > 0.45)",
    "→ SSL retrieval (k-means 100k)",
    "142M đã curate",
  ];

  s.addText(steps.join("\n"), {
    x: 6.2, y: 1.7, w: 6.6, h: 3,
    fontFace: FONT_MONO, fontSize: 14, color: C.black,
  });

  // Implementation note
  s.addText("Triển khai: Faiss (GPU), 20×8 V100, <2 ngày", {
    x: 6.2, y: 4.8, w: 6.6, h: 0.4,
    fontFace: FONT, fontSize: 14, italic: true, color: C.medGray,
  });

  // Key finding
  s.addShape(pres.shapes.RECTANGLE, {
    x: M, y: 5.8, w: CW, h: 0.7,
    fill: { color: "FFF3E0" },
    line: { color: C.v2, pt: 2 },
  });
  s.addText("Phát hiện quan trọng: 142M curated > 1.2B uncurated trên MỌI benchmark!", {
    x: M + 0.2, y: 5.9, w: CW - 0.4, h: 0.6,
    fontFace: FONT, fontSize: 20, bold: true, color: C.v2, valign: "middle",
  });

  addProgress(s, 14);
  s.addNotes(`Data curation là critical cho v2. Từ 1.2B raw web images, filter xuống 142M qua nhiều stages. Safety filtering, deduplication bằng PCA hashes, copy-detection với k=64 neighbors, loại bỏ images quá giống evaluation benchmarks, cuối cùng retrieval bằng ViT-H embeddings. Ablation quan trọng: 142M curated beats 1.2B uncurated trên mọi benchmark. Quality > quantity.`);
})();

// SLIDE 15: iBOT Loss
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };

  addTitle(s, "iBOT Loss - Dự Đoán Masked Patch", C.v2);

  // Diagram placeholder
  addPlaceholder(s, M, 1.3, 6, 3, "Student (masked) vs Teacher (đầy đủ) → predict semantic tokens", C.v2);

  // Formula
  s.addText("Công Thức iBOT Loss:", {
    x: 7, y: 1.3, w: 5.8, h: 0.4,
    fontFace: FONT, fontSize: 18, bold: true, color: C.v2,
  });
  addFormula(s, "L_iBOT = -Σᵢ pₜᵢ · log(pₛᵢ)\n\ni = chỉ số masked patch\npₜ = teacher (Sinkhorn-Knopp)\npₛ = student (softmax)", 7, 1.7, 5.8, 1.8, C.v2);

  // Comparison table
  s.addText("iBOT vs MAE:", {
    x: M, y: 4.6, w: CW, h: 0.4,
    fontFace: FONT, fontSize: 18, bold: true, color: C.black,
  });

  addTable(s,
    ["Khía cạnh", "MAE", "iBOT"],
    [
      ["Target", "Giá trị pixel", "Semantic tokens từ Teacher"],
      ["Loss", "MSE reconstruction", "Cross-entropy"],
      ["Features", "Cần finetuning", "Hoạt động FROZEN"],
    ],
    M, 5.0, CW * 0.7
  );

  // Key note
  s.addText("Ở scale lớn: UNTIED heads tốt hơn (tách riêng DINO và iBOT heads)", {
    x: 9, y: 5.5, w: 4, h: 0.6,
    fontFace: FONT, fontSize: 14, italic: true, color: C.medGray,
  });

  addProgress(s, 15);
  s.addNotes(`iBOT thêm patch-level learning. Student nhận masked patches, Teacher nhận full image. Student predict Teacher's output tại masked positions. Quan trọng: iBOT predict semantic tokens, không phải pixels như MAE. MAE reconstruct raw pixels - học texture và low-level patterns. iBOT predict representation của Teacher - học semantic meaning. Kết quả: frozen iBOT features work gần như finetuned MAE trên segmentation.`);
})();

// SLIDE 16: KoLeo Loss
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };

  addTitle(s, "KoLeo Loss - Embeddings Đều", C.v2);

  // Diagram placeholder
  addPlaceholder(s, M, 1.3, 5.5, 3, "Không có KoLeo (tụ cụm) vs Có KoLeo (trải đều)", C.v2);

  // Formula
  s.addText("Công Thức KoLeo Loss:", {
    x: 6.5, y: 1.3, w: 6.3, h: 0.4,
    fontFace: FONT, fontSize: 18, bold: true, color: C.v2,
  });
  addFormula(s, "L_KoLeo = -(1/n) Σᵢ log(d_{n,i})\n\nd_{n,i} = min_{j≠i} ||xᵢ - xⱼ||\n\n(features chuẩn hóa L2)", 6.5, 1.7, 6.3, 1.8, C.v2);

  // Intuition
  s.addText("Trực giác:", {
    x: 6.5, y: 3.7, w: 6.3, h: 0.4,
    fontFace: FONT, fontSize: 18, bold: true, color: C.black,
  });
  s.addText("• Từ Kozachenko-Leonenko entropy estimator\n• Tối đa hóa khoảng cách đến nearest neighbor\n• → Embeddings trải đều trên hypersphere\n• Áp dụng weight 0.1, chỉ CLS tokens", {
    x: 6.5, y: 4.1, w: 6.3, h: 1.5,
    fontFace: FONT, fontSize: 16, color: C.gray,
  });

  // Ablation
  s.addText("Tại Sao KoLeo Quan Trọng:", {
    x: M, y: 4.6, w: 5.5, h: 0.4,
    fontFace: FONT, fontSize: 18, bold: true, color: C.accent,
  });

  addTable(s,
    ["Cấu hình", "ImageNet", "Retrieval"],
    [
      ["Model đầy đủ", "85.8%", "63.9%"],
      ["Không KoLeo", "85.3%", "55.6% (-8.3%)"],
    ],
    M, 5.0, 5.5
  );

  addProgress(s, 16);
  s.addNotes(`KoLeo ngăn embeddings cluster quá chặt. Formula maximize log của min distance đến nearest neighbor - đẩy mỗi embedding ra xa neighbor gần nhất. Tên từ Kozachenko-Leonenko entropy estimator. Ablation striking: bỏ KoLeo chỉ hurt ImageNet nhẹ (-0.5%), nhưng destroy retrieval (-8.3%). Classification chỉ cần linearly separable. Retrieval cần preserve fine-grained distances. Applied với weight 0.1 trên CLS tokens.`);
})();

// SLIDE 17: Three Losses
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };

  addTitle(s, "Ba Losses Kết Hợp", C.v2);

  // Architecture placeholder
  addPlaceholder(s, M, 1.3, 6, 3.5, "ViT → CLS (DINO) + Patches (iBOT) + KoLeo", C.v2);

  // Total loss
  addFormula(s, "L_total = L_DINO + L_iBOT + 0.1 × L_KoLeo", 7, 1.3, 5.8, 0.8, C.v2);

  // What each provides
  s.addText("Mỗi Loss Cung Cấp Gì:", {
    x: 7, y: 2.3, w: 5.8, h: 0.4,
    fontFace: FONT, fontSize: 18, bold: true, color: C.black,
  });

  addTable(s,
    ["Loss", "Target", "Quan trọng cho"],
    [
      ["L_DINO", "CLS token", "Classification, retrieval"],
      ["L_iBOT", "Masked patches", "Segmentation, depth"],
      ["L_KoLeo", "Batch diversity", "Độ chính xác retrieval"],
    ],
    7, 2.7, 5.8
  );

  // Ablation summary
  s.addText("Tóm Tắt Ablation:", {
    x: M, y: 5.0, w: CW, h: 0.4,
    fontFace: FONT, fontSize: 18, bold: true, color: C.accent,
  });

  addTable(s,
    ["Bỏ đi", "ImageNet", "ADE20k mIoU", "Retrieval"],
    [
      ["Model đầy đủ", "85.8%", "47.1", "63.9%"],
      ["- KoLeo", "85.3%", "47.2", "55.6% (-8.3)"],
      ["- iBOT", "85.3%", "44.2 (-2.9)", "64.3%"],
    ],
    M, 5.4, CW * 0.8
  );

  addProgress(s, 17);
  s.addNotes(`Ba losses work together, mỗi cái handle một aspect khác. DINO học global semantics từ CLS token - tốt cho classification. iBOT học local understanding từ patches - essential cho dense tasks. KoLeo đảm bảo diversity - critical cho retrieval. Ablation chứng minh mỗi cái necessary: Bỏ KoLeo → retrieval drop 8%. Bỏ iBOT → segmentation drop 3 mIoU. Not small effects.`);
})();

// SLIDE 18: DINOv2 Results
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };

  addTitle(s, "Kết Quả DINOv2", C.v2);

  // Results table
  addTable(s,
    ["Benchmark", "DINOv2", "Tốt nhất trước", "Task"],
    [
      ["ImageNet", "86.5%", "82.3% (iBOT)", "Classification"],
      ["ADE20k", "49.0 mIoU", "44.6 (iBOT)", "Segmentation"],
      ["Oxford-M", "64.6%", "39.0% (iBOT)", "Retrieval"],
      ["NYUd", "0.279 RMSE", "0.358 (iBOT)", "Depth"],
    ],
    M, 1.3, CW * 0.75
  );

  // Foundation Model achieved
  s.addShape(pres.shapes.RECTANGLE, {
    x: M, y: 3.8, w: CW, h: 1,
    fill: { color: "FFF3E0" },
    line: { color: C.v2, pt: 2 },
  });
  s.addText("Foundation Model Đạt Được:\n1 backbone (frozen) + simple linear head → SOTA trên nhiều tasks", {
    x: M + 0.2, y: 3.9, w: CW - 0.4, h: 0.9,
    fontFace: FONT, fontSize: 20, bold: true, color: C.v2, valign: "middle",
  });

  // Comparison with text-supervised
  s.addText("So Sánh với Text-Supervised:", {
    x: M, y: 5.1, w: CW, h: 0.4,
    fontFace: FONT, fontSize: 18, bold: true, color: C.black,
  });

  addTable(s,
    ["Model", "ImageNet", "ADE20k", "Dùng Text?"],
    [
      ["OpenCLIP ViT-G", "86.2%", "46.0", "Có (LAION-2B)"],
      ["DINOv2 ViT-g", "86.5%", "49.0", "KHÔNG"],
    ],
    M, 5.5, CW * 0.7
  );

  addProgress(s, 18);
  s.addNotes(`DINOv2 achieves Foundation Model status. Một frozen backbone, simple linear heads, state-of-the-art across classification, segmentation, retrieval, depth. 86.5% ImageNet với frozen features. Impressive nhất: DINOv2 beats OpenCLIP và EVA-CLIP which use billions of image-text pairs. DINOv2 không dùng text supervision. Pure visual self-supervision with right losses and data curation matches text-supervised methods.`);
})();

// ═══════════════════════════════════════════════════════════
// ACT 4: EVOLUTION TO v3 (Slides 19-22)
// ═══════════════════════════════════════════════════════════

// SLIDE 19: 7B Challenge
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };

  addTitle(s, "Thách Thức 7B - Dense Features Suy Giảm", C.v3);

  // Graph placeholder
  addPlaceholder(s, M, 1.3, 7, 3.5, "Đồ thị training: ImageNet tăng, ADE20k đỉnh ở 200k rồi GIẢM", C.v3);

  // The problem
  s.addText("Vấn Đề (KHÔNG phải divergence!):", {
    x: 8, y: 1.3, w: 4.8, h: 0.4,
    fontFace: FONT, fontSize: 18, bold: true, color: C.accent,
  });

  addBullets(s, [
    "Classification tiếp tục cải thiện",
    "Segmentation đỉnh ở ~200k",
    "Rồi GIẢM trong quá trình training!",
    "Patches \"collapse\" về CLS",
  ], 8, 1.7, 4.8, 2.5, 16);

  // Root cause
  s.addText("Nguyên Nhân Gốc:", {
    x: M, y: 5.0, w: CW, h: 0.4,
    fontFace: FONT, fontSize: 18, bold: true, color: C.v3,
  });
  s.addText("• CLS token và patch outputs trở nên quá giống nhau\n• Patches mất tính đặc trưng không gian cục bộ\n• DINO global loss áp đảo iBOT local loss", {
    x: M, y: 5.4, w: CW, h: 1.2,
    fontFace: FONT, fontSize: 18, color: C.gray,
  });

  addProgress(s, 19);
  s.addNotes(`Scaling lên 7B reveals vấn đề mới. Không phải training divergence - loss không explode. Thay vào đó, dense feature quality degrades. Classification keeps improving, nhưng segmentation peaks around 200k iterations rồi declines. Cause: CLS token và patch outputs become quá similar. Patches "collapse" toward global summary, mất local distinctiveness. DINO global loss dominates over iBOT local loss.`);
})();

// SLIDE 20: Gram Anchoring
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };

  addTitle(s, "Gram Anchoring - Công Thức Đầy Đủ", C.v3);

  // Gram matrix definition
  s.addText("Định Nghĩa Ma Trận Gram:", {
    x: M, y: 1.2, w: 6, h: 0.4,
    fontFace: FONT, fontSize: 18, bold: true, color: C.v3,
  });
  addFormula(s, "G = X · X^T    (ma trận P × P)\n\nG[i,j] = cosine similarity\n        giữa patch i và j", M, 1.6, 6, 1.6, C.v3);

  // Loss formula
  s.addText("Gram Anchoring Loss:", {
    x: M, y: 3.5, w: 6, h: 0.4,
    fontFace: FONT, fontSize: 18, bold: true, color: C.v3,
  });
  addFormula(s, "L_Gram = ||X_S · X_S^T - X_G · X_G^T||²_F\n\nX_S = Student features (chuẩn hóa L2)\nX_G = Gram Teacher (checkpoint sớm)", M, 3.9, 6.5, 1.5, C.v3);

  // Key insight
  s.addShape(pres.shapes.RECTANGLE, {
    x: 7.5, y: 1.2, w: 5.3, h: 2.5,
    fill: { color: "E8F5E9" },
    line: { color: C.v3, pt: 2 },
  });
  s.addText("Insight Quan Trọng:", {
    x: 7.7, y: 1.3, w: 5, h: 0.4,
    fontFace: FONT, fontSize: 18, bold: true, color: C.v3,
  });
  s.addText("Ràng buộc CẤU TRÚC TƯƠNG TỰ, không phải giá trị features cụ thể.\n\nFeatures có thể rotate/scale/shift - chỉ cần giữ hình học tương đối!\n\nGram Teacher: checkpoint từ 100k-200k (khi dense features còn tốt)", {
    x: 7.7, y: 1.7, w: 5, h: 2,
    fontFace: FONT, fontSize: 15, color: C.black,
  });

  // Refinement loss
  s.addText("Refinement Loss:", {
    x: 7.5, y: 4, w: 5.3, h: 0.4,
    fontFace: FONT, fontSize: 18, bold: true, color: C.black,
  });
  addFormula(s, "L_Ref = L_DINO + L_iBOT + L_KoLeo\n       + 2 × L_Gram", 7.5, 4.4, 5.3, 1, C.v3);

  // Effect
  s.addText("Hiệu quả: Cải thiện trong vòng 10k iterations!", {
    x: M, y: 5.8, w: CW, h: 0.4,
    fontFace: FONT, fontSize: 18, bold: true, color: C.v3,
  });

  addProgress(s, 20);
  s.addNotes(`Gram Anchoring elegant. Gram matrix G = X·X^T encode pairwise cosine similarities giữa patches. G[i,j] cho biết patch i giống patch j như thế nào. Loss minimize Frobenius norm giữa Student's Gram matrix và Gram Teacher's. Preserve similarity structure. Key insight: đây là SOFT constraint. Features có thể rotate, scale, shift - chỉ cần preserve relative similarities. Gram Teacher từ early checkpoint (100k-200k) khi dense features còn good.`);
})();

// SLIDE 21: Text Alignment
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };

  addTitle(s, "Căn Chỉnh Text - Training Tách Rời", C.v3);

  // Comparison placeholder
  addPlaceholder(s, M, 1.3, 6, 3, "CLIP (chung) vs DINOv3 (Giai đoạn 1: SSL, Giai đoạn 2: Frozen + Text)", C.v3);

  // Comparison table
  s.addText("CLIP vs DINOv3:", {
    x: 7, y: 1.3, w: 5.8, h: 0.4,
    fontFace: FONT, fontSize: 18, bold: true, color: C.black,
  });

  addTable(s,
    ["Khía cạnh", "CLIP", "DINOv3"],
    [
      ["Vision encoder", "Train chung", "FROZEN"],
      ["Được train", "Cả 2 encoders", "Text + 2 layers"],
      ["Features dùng", "Chỉ CLS", "CLS + patches"],
      ["Khả năng dense", "Kém", "Xuất sắc"],
    ],
    7, 1.7, 5.8
  );

  // Results
  s.addText("Kết quả (ADE20k segmentation):", {
    x: M, y: 4.8, w: CW, h: 0.4,
    fontFace: FONT, fontSize: 18, bold: true, color: C.v3,
  });

  addTable(s,
    ["Model", "ADE20k mIoU"],
    [
      ["CLIP ViT-L", "6.0"],
      ["EVA-02-CLIP", "10.9"],
      ["DINOv3", "24.7 (tốt hơn 4×!)"],
    ],
    M, 5.2, 5
  );

  addProgress(s, 21);
  s.addNotes(`DINOv3 có thể align với text trong khi preserve dense capabilities. Khác với CLIP train vision và text jointly (degrade spatial features), DINOv3 dùng decoupled training. Phase 1: Train SSL backbone (1M iterations, không text). Phase 2: Freeze vision backbone, thêm 2 transformer layers, train text encoder từ scratch. Key enhancement: dùng cả CLS token VÀ mean-pooled patches cho alignment. Result: 24.7 mIoU vs CLIP's 6.0 - 4× improvement.`);
})();

// SLIDE 22: DINOv3 Results
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };

  addTitle(s, "Kết Quả DINOv3 - SOTA Mọi Nơi", C.v3);

  // Results table
  addTable(s,
    ["Benchmark", "DINOv2-g", "DINOv3-7B", "Δ"],
    [
      ["ImageNet", "87.3%", "88.4%", "+1.1%"],
      ["ObjectNet", "66.0%", "79.0%", "+13%"],
      ["ADE20k", "49.5 mIoU", "55.9 mIoU", "+6.4"],
      ["COCO det", "~60 mAP", "66.1 mAP", "+6"],
      ["DAVIS", "76.6 J&F", "83.3 J&F", "+6.7"],
    ],
    M, 1.3, CW * 0.7
  );

  // Historic achievements
  s.addShape(pres.shapes.RECTANGLE, {
    x: M, y: 4.0, w: CW, h: 1.2,
    fill: { color: "E8F5E9" },
    line: { color: C.v3, pt: 2 },
  });
  s.addText("Thành Tựu Lịch Sử:", {
    x: M + 0.2, y: 4.1, w: CW - 0.4, h: 0.4,
    fontFace: FONT, fontSize: 18, bold: true, color: C.v3,
  });
  s.addText("• SSL đầu tiên ngang bằng weakly-supervised trên ImageNet\n• SOTA trên COCO detection với backbone FROZEN (chỉ 100M decoder trainable)\n• SOTA trên ADE20k với frozen backbone (ngang models finetuned)", {
    x: M + 0.2, y: 4.5, w: CW - 0.4, h: 0.7,
    fontFace: FONT, fontSize: 16, color: C.black,
  });

  // Architecture & Training
  s.addText("Kiến trúc: ViT-7B (6.7B params), Axial RoPE, SwiGLU, 256k prototypes", {
    x: M, y: 5.5, w: CW, h: 0.4,
    fontFace: FONT, fontSize: 14, color: C.medGray,
  });
  s.addText("Training: 256 H100 GPUs, 61k GPU hours, ~18 tấn CO₂", {
    x: M, y: 5.9, w: CW, h: 0.4,
    fontFace: FONT, fontSize: 14, color: C.medGray,
  });

  addProgress(s, 22);
  s.addNotes(`DINOv3 achieves SOTA everywhere với frozen backbone. 88.4% ImageNet - first SSL at weakly-supervised parity. 66.1 mAP trên COCO detection - matching finetuned models với just 100M parameter decoder. 55.9 mIoU trên ADE20k - 6 points above DINOv2. Dense task improvements đặc biệt notable: +13% ObjectNet, +6.4 mIoU segmentation, +6.7 video tracking. Gram Anchoring solved dense feature degradation problem.`);
})();

// ═══════════════════════════════════════════════════════════
// ACT 5: SYNTHESIS (Slides 23-24)
// ═══════════════════════════════════════════════════════════

// SLIDE 23: Evolution Timeline
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };

  addTitle(s, "Dòng Thời Gian Tiến Hóa", C.success);

  // Timeline visual - using shapes
  const timelineY = 2.0;
  const startX = 1.5;
  const spacing = 4;

  // Timeline line
  s.addShape(pres.shapes.LINE, {
    x: startX, y: timelineY + 0.8,
    w: 10.5, h: 0,
    line: { color: C.lightGray, width: 3 },
  });

  // Version boxes
  const versions = [
    { year: "2021", name: "DINOv1", acc: "80.1%", color: C.v1, problem: "Học không cần nhãn", solution: "EMA + Centering + Sharpening" },
    { year: "2023", name: "DINOv2", acc: "86.5%", color: C.v2, problem: "Dense tasks yếu", solution: "iBOT + KoLeo + Data curation" },
    { year: "2025", name: "DINOv3", acc: "88.4%", color: C.v3, problem: "Scale gây suy giảm", solution: "Gram Anchoring + scale 7B" },
  ];

  versions.forEach((v, i) => {
    const x = startX + i * spacing;

    // Year
    s.addText(v.year, {
      x, y: timelineY - 0.3, w: 1.5, h: 0.4,
      fontFace: FONT, fontSize: 14, color: C.medGray, align: "center",
    });

    // Circle marker
    s.addShape(pres.shapes.OVAL, {
      x: x + 0.5, y: timelineY + 0.6, w: 0.4, h: 0.4,
      fill: { color: v.color },
    });

    // Box
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: timelineY + 1.2, w: 3.5, h: 2.8,
      fill: { color: C.bg },
      line: { color: v.color, pt: 2 },
    });

    // Name and accuracy
    s.addText(v.name, {
      x: x + 0.1, y: timelineY + 1.3, w: 3.3, h: 0.4,
      fontFace: FONT, fontSize: 18, bold: true, color: v.color,
    });
    s.addText(v.acc, {
      x: x + 0.1, y: timelineY + 1.7, w: 3.3, h: 0.3,
      fontFace: FONT, fontSize: 14, color: C.medGray,
    });

    // Problem
    s.addText("Vấn đề:", {
      x: x + 0.1, y: timelineY + 2.1, w: 3.3, h: 0.3,
      fontFace: FONT, fontSize: 12, bold: true, color: C.accent,
    });
    s.addText(v.problem, {
      x: x + 0.1, y: timelineY + 2.4, w: 3.3, h: 0.5,
      fontFace: FONT, fontSize: 12, color: C.black,
    });

    // Solution
    s.addText("Giải pháp:", {
      x: x + 0.1, y: timelineY + 2.9, w: 3.3, h: 0.3,
      fontFace: FONT, fontSize: 12, bold: true, color: C.success,
    });
    s.addText(v.solution, {
      x: x + 0.1, y: timelineY + 3.2, w: 3.3, h: 0.5,
      fontFace: FONT, fontSize: 12, color: C.black,
    });
  });

  // Pattern
  s.addText("Mẫu hình: Xác định vấn đề → Giải quyết → Tìm vấn đề mới → Lặp lại", {
    x: M, y: 6.0, w: CW, h: 0.4,
    fontFace: FONT, fontSize: 18, italic: true, color: C.gray, align: "center",
  });

  addProgress(s, 23);
  s.addNotes(`Timeline thể hiện evolution rõ ràng. Mỗi version giải quyết hạn chế của version trước. v1: làm sao SSL work? v2: làm sao cho dense tasks? v3: làm sao scale lên 7B? Pattern này cho thấy research process: identify problem → solve → find new problem → repeat.`);
})();

// SLIDE 24: Key Takeaways
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };

  addTitle(s, "Bài Học Chính + Tài Liệu Tham Khảo", C.success);

  // 5 Lessons
  s.addText("5 Bài Học Từ DINO:", {
    x: M, y: 1.2, w: 7, h: 0.4,
    fontFace: FONT, fontSize: 20, bold: true, color: C.success,
  });

  addTable(s,
    ["#", "Bài học", "Bằng chứng"],
    [
      ["1", "SSL có thể vượt Supervised", "88.4% vs 85.7%"],
      ["2", "Ngăn collapse là CỐT YẾU", "EMA + Centering + Sharpening"],
      ["3", "Chất lượng > Số lượng data", "142M curated > 1.2B raw"],
      ["4", "Dense cần patch-level learning", "iBOT: -2.9 mIoU nếu bỏ"],
      ["5", "Scale cần tricks ổn định", "Gram Anchoring cho 7B"],
    ],
    M, 1.6, 7.5
  );

  // Key formulas
  s.addText("Công Thức Chính:", {
    x: 8.5, y: 1.2, w: 4.3, h: 0.4,
    fontFace: FONT, fontSize: 18, bold: true, color: C.black,
  });
  s.addText(`EMA:      θₜ ← λθₜ + (1-λ)θₛ
Center:   c ← mc + (1-m)·mean
Loss:     L = -Σ Pₜ·log(Pₛ)
KoLeo:    L = -Σ log(min dist)
Gram:     L = ||G_s - G_t||²`, {
    x: 8.5, y: 1.6, w: 4.3, h: 2,
    fontFace: FONT_MONO, fontSize: 12, color: C.gray,
  });

  // Papers
  s.addText("Bài báo:", {
    x: M, y: 4.8, w: CW, h: 0.4,
    fontFace: FONT, fontSize: 18, bold: true, color: C.black,
  });
  s.addText(`• DINOv1: Caron et al., "Emerging Properties in Self-Supervised Vision Transformers", ICCV 2021
• DINOv2: Oquab et al., "DINOv2: Learning Robust Visual Features without Supervision", TMLR 2024
• DINOv3: Darcet et al., arXiv 2025`, {
    x: M, y: 5.2, w: CW, h: 1,
    fontFace: FONT, fontSize: 14, color: C.gray,
  });

  // Code
  s.addText("Mã nguồn: github.com/facebookresearch/dinov2", {
    x: M, y: 6.2, w: CW, h: 0.4,
    fontFace: FONT, fontSize: 16, color: C.v1,
  });

  addProgress(s, 24);
  s.addNotes(`5 bài học từ DINO: (1) SSL có thể vượt supervised. (2) Collapse prevention là critical - không có EMA/Centering thì không work. (3) Data quality > quantity. (4) Dense tasks cần iBOT để hiểu local. (5) Scale lớn cần stability tricks. DINO giờ là foundation model cho nhiều ứng dụng. Key insight: không cần labels, cần đúng learning signal.`);
})();

// ═══════════════════════════════════════════════════════════
// Save Presentation
// ═══════════════════════════════════════════════════════════
pres.writeFile({ fileName: "DINO_Seminar_v6.8.pptx" })
  .then(() => console.log("✓ Created: DINO_Seminar_v6.8.pptx (24 slides, 30 min)"))
  .catch(err => console.error("Error:", err));
