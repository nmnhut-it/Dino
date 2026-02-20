const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.33 x 7.5
pres.author = "DINO Seminar";
pres.title = "DINO: Self-Distillation with NO Labels";

// ═══════════════════════════════════════
// DESIGN SYSTEM v6.1
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
const MIN_FONT = 28; // absolute minimum

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

// Helper: progress bar
function addProgress(slide, activeSection) {
  const sections = ["Vấn đề", "ViT", "DINOv1", "DINOv2", "DINOv3", "Tổng hợp"];
  const barY = H - 0.18;
  const barW = CW / sections.length;
  for (let i = 0; i < sections.length; i++) {
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

// Helper: table with green headers, min 28pt (but tables need smaller for fit — we'll use 15pt header minimum for readability)
// Actually user said min 28 for all text. Tables will need to be simplified.
// For tables: we'll keep content minimal so 28pt fits.

function makeTableHeader(texts) {
  return texts.map(t => ({
    text: t,
    options: { bold: true, color: C.white, fill: { color: C.green }, fontSize: 28, fontFace: FONT, align: "center", valign: "middle" },
  }));
}

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

  // Group members
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

  s.addNotes(`Chào mọi người. Hôm nay nhóm mình trình bày về DINO — viết tắt của "self-DIstillation with NO labels", tức là tự chưng cất tri thức mà không cần nhãn gì cả. Đây là dòng nghiên cứu của Meta AI, trước đây là Facebook AI Research.

Có 3 phiên bản: v1 năm 2021, v2 năm 2023, v3 năm 2025. Mỗi bản lớn hơn và mạnh hơn bản trước. Đọc là "đai-nô".

Mục tiêu: train model nhìn ảnh mà không cần ai gán nhãn, nhưng kết quả ngang hoặc vượt supervised learning. Nghe có vẻ "quá đẹp để là thật", nhưng cuối buổi mọi người sẽ thấy nó thật sự hoạt động.`);
})();

// ═══════════════════════════════════════
// SLIDE 2 — Mục lục
// ═══════════════════════════════════════
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addTitle(s, "Nội dung");

  const items = [
    ["01", "Chi phí gán nhãn"],
    ["02", "Vision Transformer"],
    ["03", "DINOv1 (2021)"],
    ["04", "DINOv2 (2023)"],
    ["05", "DINOv3 (2025)"],
    ["06", "Tổng hợp"],
  ];

  for (let i = 0; i < items.length; i++) {
    const yy = 1.3 + i * 0.85;
    s.addText(items[i][0], {
      x: M, y: yy, w: 0.9, h: 0.6,
      fontFace: FONT_TITLE, fontSize: 32, bold: true,
      color: C.red, align: "left", margin: 0,
    });
    s.addText(items[i][1], {
      x: M + 1.0, y: yy, w: 8, h: 0.6,
      fontFace: FONT, fontSize: 30,
      color: C.black, align: "left", margin: 0,
    });
  }

  s.addNotes(`6 phần. Phần 1 nói tại sao supervised learning tốn kém — cần người gán nhãn, tốn tiền, tốn thời gian.

Phần 2 giới thiệu nhanh Vision Transformer vì DINO dựa trên kiến trúc này. Mình nói vừa đủ để hiểu DINO.

Phần 3, 4, 5 là trọng tâm: 3 phiên bản DINO. Cuối cùng tổng hợp so sánh.`);
})();

// ═══════════════════════════════════════
// SECTION 1 DIVIDER
// ═══════════════════════════════════════
addSectionDivider(1, "Chi phí gán nhãn");

// ═══════════════════════════════════════
// SLIDE 3 — Chi phí gán nhãn (big numbers)
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

Và đó mới chỉ là 1 dataset cho 1000 class. Mỗi bài toán mới — y tế, vệ tinh, nông nghiệp — lại cần gán nhãn lại từ đầu. Gán nhãn y tế còn đắt hơn vì cần bác sĩ chuyên khoa. Câu hỏi tự nhiên: có cách nào học mà không cần nhãn không? Đó là self-supervised learning.`);
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

Thay vì thuê người gán nhãn, để model tự tạo tín hiệu giám sát từ dữ liệu thô. Ví dụ: che một phần ảnh rồi bắt model đoán phần bị che. Hoặc xoay ảnh rồi bắt đoán góc xoay. Qua đó model buộc phải hiểu cấu trúc ảnh, học được đặc trưng hữu ích.

3 hướng chính: contrastive learning (SimCLR, MoCo) — so sánh cặp ảnh; masked image modeling (MAE) — che rồi đoán; distillation (BYOL, DINO) — teacher-student. DINO thuộc nhóm thứ ba, đặc biệt là không cần negative pairs.

Pretrain bằng SSL trên hàng triệu ảnh không nhãn, rồi fine-tune với rất ít nhãn cũng cho kết quả tốt. Tiếp theo mình giới thiệu backbone mà DINO dùng: Vision Transformer.`);
})();

// ═══════════════════════════════════════
// SECTION 2 DIVIDER
// ═══════════════════════════════════════
addSectionDivider(2, "Vision Transformer");

// ═══════════════════════════════════════
// SLIDE 5 — ViT pipeline
// ═══════════════════════════════════════
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addTitle(s, "Vision Transformer");
  addProgress(s, 2);

  const steps = [
    { label: "Ảnh\n224×224", x: M + 0.1 },
    { label: "Patch\n16×16", x: M + 2.5 },
    { label: "Vector\n768-d", x: M + 4.9 },
    { label: "Vị trí", x: M + 7.3 },
    { label: "Transformer", x: M + 9.7 },
  ];

  for (const st of steps) {
    s.addShape(pres.shapes.RECTANGLE, {
      x: st.x, y: 1.8, w: 2.1, h: 1.6,
      fill: { color: C.tableAlt }, line: { color: C.lightGray, width: 1 },
    });
    s.addText(st.label, {
      x: st.x, y: 1.8, w: 2.1, h: 1.6,
      fontFace: FONT, fontSize: 28, bold: true,
      color: C.black, align: "center", valign: "middle",
    });
  }

  for (let i = 0; i < 4; i++) {
    s.addText("→", {
      x: M + 0.1 + 2.1 + i * 2.4, y: 2.0, w: 0.4, h: 1.2,
      fontFace: FONT, fontSize: 32, color: C.red, align: "center", valign: "middle",
    });
  }

  s.addText("14×14 = 196 patches + 1 token CLS", {
    x: M, y: 4.0, w: CW, h: 0.6,
    fontFace: FONT, fontSize: 28, bold: true,
    color: C.black, align: "left", margin: 0,
  });

  addSource(s, "Dosovitskiy et al. ICLR 2021");

  s.addNotes(`Vision Transformer (ViT) do Dosovitskiy và nhóm Google Brain đề xuất năm 2021.

Ý tưởng: cắt ảnh thành mảnh nhỏ, mỗi mảnh xử lý như 1 "từ" trong câu, rồi đưa vào Transformer giống xử lý ngôn ngữ. Ảnh 224×224 chia thành patch 16×16, được 14×14 = 196 patch. Mỗi patch qua linear layer thành vector 768 chiều — giống word embedding.

Thêm positional embedding để model biết patch nào ở đâu. Thêm 1 token đặc biệt gọi là CLS ở đầu chuỗi. CLS là gì, mình giải thích slide tiếp.`);
})();

// ═══════════════════════════════════════
// SLIDE 6 — Token CLS
// ═══════════════════════════════════════
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addTitle(s, "Token CLS");
  addProgress(s, 2);

  // Diagram: 196 patches + CLS → Transformer → CLS output
  s.addShape(pres.shapes.RECTANGLE, {
    x: M + 0.2, y: 1.5, w: 3.5, h: 2.2,
    fill: { color: C.tableAlt }, line: { color: C.lightGray, width: 1 },
  });
  s.addText("[CLS] + 196 patches", {
    x: M + 0.2, y: 1.5, w: 3.5, h: 2.2,
    fontFace: FONT, fontSize: 28, bold: true,
    color: C.black, align: "center", valign: "middle",
  });

  s.addText("→ Transformer →", {
    x: M + 3.7, y: 2.0, w: 3.5, h: 1.2,
    fontFace: FONT, fontSize: 28, color: C.red, align: "center", valign: "middle",
  });

  s.addShape(pres.shapes.RECTANGLE, {
    x: M + 7.2, y: 1.5, w: 4.5, h: 2.2,
    fill: { color: C.tableAlt }, line: { color: C.green, width: 2 },
  });
  s.addText("Output CLS\n= đặc trưng cả bức ảnh", {
    x: M + 7.2, y: 1.5, w: 4.5, h: 2.2,
    fontFace: FONT, fontSize: 28, bold: true,
    color: C.green, align: "center", valign: "middle",
  });

  s.addText("CLS không mang pixel, chỉ \"lắng nghe\"\ntất cả 196 patch qua attention rồi tổng hợp", {
    x: M, y: 4.2, w: CW, h: 1.2,
    fontFace: FONT, fontSize: 28, italic: true,
    color: C.gray, align: "center", margin: 0,
  });

  s.addNotes(`CLS viết tắt của Classification token. Đây là 1 vector học được (learnable), không gắn với pixel nào trong ảnh. Nó được đặt ở vị trí đầu tiên trong chuỗi input, cùng với 196 patch tokens.

Khi đi qua Transformer, CLS "lắng nghe" tất cả 196 patch qua cơ chế attention — mỗi layer, CLS cập nhật bản thân bằng cách tổng hợp thông tin từ tất cả các patch. Sau nhiều layer, output của CLS trở thành đặc trưng đại diện cho toàn bộ bức ảnh.

Tại sao cần CLS thay vì average pool tất cả patch? Vì CLS linh hoạt hơn — nó tự học cách tổng hợp thông tin, không bị ép lấy trung bình đều. Trong DINO, output CLS chính là thứ Teacher và Student so sánh với nhau.

Giờ mình nói nhanh cơ chế attention rồi so sánh ViT với CNN.`);
})();

// ═══════════════════════════════════════
// SLIDE 7 — Self-attention
// ═══════════════════════════════════════
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addTitle(s, "Self-attention");
  addProgress(s, 2);

  s.addText("Attention(Q, K, V) = softmax(QKᵀ / √dₖ) · V", {
    x: M, y: 1.6, w: CW, h: 0.8,
    fontFace: "Consolas", fontSize: 28, bold: true,
    color: C.black, align: "center", margin: 0,
  });

  const cols = [
    { title: "QKᵀ", sub: "Ai giống ai?" },
    { title: "÷ √dₖ", sub: "Giữ ổn định" },
    { title: "softmax", sub: "Chọn trọng số" },
  ];

  for (let i = 0; i < 3; i++) {
    const xx = M + 0.3 + i * (CW / 3);
    s.addText(cols[i].title, {
      x: xx, y: 3.0, w: 3.5, h: 0.7,
      fontFace: "Consolas", fontSize: 32, bold: true,
      color: C.red, align: "center", margin: 0,
    });
    s.addText(cols[i].sub, {
      x: xx, y: 3.7, w: 3.5, h: 0.7,
      fontFace: FONT, fontSize: 28,
      color: C.gray, align: "center", margin: 0,
    });
  }

  s.addText("12 heads × 64 chiều = 768 tổng", {
    x: M, y: 5.0, w: CW, h: 0.6,
    fontFace: FONT, fontSize: 28, italic: true,
    color: C.gray, align: "left", margin: 0,
  });

  addSource(s, "Vaswani et al. NeurIPS 2017");

  s.addNotes(`Self-attention là cơ chế cốt lõi của Transformer. Mỗi patch tạo 3 vector: Query, Key, Value. Q nhân K transpose đo 2 patch giống nhau bao nhiêu. Chia căn dₖ (=64) để không quá lớn, tránh softmax bão hoà. Softmax chuyển thành xác suất, tổng bằng 1. Nhân với Value lấy output.

ViT-B có 12 attention head, mỗi head 64 chiều, ghép lại 768. Mỗi head học nhìn 1 khía cạnh: texture, đường viền, màu, hình dáng.

Phát hiện quan trọng từ DINO: khi train self-supervised, các head tự học cách tách vật thể khỏi nền mà không ai dạy — mình sẽ quay lại điểm này khi nói kết quả.

So sánh ViT với CNN: CNN nhìn cục bộ, ViT nhìn toàn cục ngay. DINO cho thấy ViT phù hợp hơn cho SSL: 80.1% so với 75.3% của ResNet-50. Giờ vào phần chính: DINO.`);
})();

// ═══════════════════════════════════════
// SECTION 3 DIVIDER
// ═══════════════════════════════════════
addSectionDivider(3, "DINOv1 (2021)");

// ═══════════════════════════════════════
// SLIDE 8 — Knowledge distillation
// ═══════════════════════════════════════
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addTitle(s, "Knowledge distillation");
  addProgress(s, 3);

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
    { text: "DINO: self-distillation", options: { bold: true, fontSize: 30, color: C.red, breakLine: true } },
    { text: "Cùng kiến trúc, khác tham số", options: { fontSize: 28, color: C.black, breakLine: true } },
    { text: "Teacher tạo từ Student qua EMA", options: { fontSize: 28, color: C.gray } },
  ], {
    x: M + 0.5, y: 3.8, w: CW - 1, h: 2.0,
    fontFace: FONT, align: "left", margin: 0,
  });

  s.addNotes(`Trước khi vào DINO, cần hiểu knowledge distillation. Ý tưởng từ Hinton 2015: model lớn (Teacher) đã train xong, nén tri thức sang model nhỏ (Student). Student không học nhãn cứng mà học output mềm — phân bố xác suất — từ Teacher.

Ví dụ: thay vì "đây là mèo" (nhãn cứng [1,0,0]), Teacher nói "80% mèo, 15% chó, 5% hổ". Student học được rằng mèo giống chó hơn giống ô tô. Hinton gọi đây là "dark knowledge".

DINO đặc biệt: Teacher và Student cùng kiến trúc, cùng kích thước. Teacher không train sẵn mà tạo từ Student qua EMA. Gọi là self-distillation — tự chưng cất. Không có nhãn, tín hiệu giám sát lấy từ đâu? Từ Teacher. Teacher chính là "nguồn đáp án". Mình xem cụ thể.`);
})();

// ═══════════════════════════════════════
// SLIDE 9 — DINO tổng quan
// ═══════════════════════════════════════
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addTitle(s, "DINO: tổng quan");
  addProgress(s, 3);

  // Simplified diagram with larger text
  s.addShape(pres.shapes.RECTANGLE, {
    x: M, y: 1.5, w: 2.2, h: 3.8,
    fill: { color: C.tableAlt }, line: { color: C.lightGray, width: 1 },
  });
  s.addText("Ảnh\ngốc", { x: M, y: 2.5, w: 2.2, h: 1.0, fontFace: FONT, fontSize: 28, bold: true, color: C.black, align: "center", valign: "middle" });

  // Teacher
  s.addText("global →", { x: M + 2.2, y: 1.6, w: 1.8, h: 0.8, fontFace: FONT, fontSize: 28, italic: true, color: C.gray, align: "center" });
  s.addShape(pres.shapes.RECTANGLE, { x: M + 4.0, y: 1.3, w: 3.5, h: 1.8, fill: { color: C.tableAlt }, line: { color: C.green, width: 2 } });
  s.addText("Teacher ViT", { x: M + 4.0, y: 1.3, w: 3.5, h: 1.8, fontFace: FONT, fontSize: 28, bold: true, color: C.green, align: "center", valign: "middle" });

  // Student
  s.addText("local →", { x: M + 2.2, y: 3.9, w: 1.8, h: 0.8, fontFace: FONT, fontSize: 28, italic: true, color: C.gray, align: "center" });
  s.addShape(pres.shapes.RECTANGLE, { x: M + 4.0, y: 3.6, w: 3.5, h: 1.8, fill: { color: C.tableAlt }, line: { color: C.lightGray, width: 1 } });
  s.addText("Student ViT", { x: M + 4.0, y: 3.6, w: 3.5, h: 1.8, fontFace: FONT, fontSize: 28, bold: true, color: C.black, align: "center", valign: "middle" });

  // EMA
  s.addText("EMA ↑", { x: M + 4.5, y: 3.1, w: 2.5, h: 0.5, fontFace: FONT, fontSize: 28, bold: true, color: C.red, align: "center" });

  // Loss
  s.addShape(pres.shapes.RECTANGLE, { x: M + 8.5, y: 2.2, w: 3.5, h: 2.0, fill: { color: C.white }, line: { color: C.red, width: 2 } });
  s.addText("L = −Σ Pₜ·log Pₛ", { x: M + 8.5, y: 2.2, w: 3.5, h: 2.0, fontFace: "Consolas", fontSize: 28, bold: true, color: C.red, align: "center", valign: "middle" });

  addSource(s, "Caron et al. ICCV 2021");

  s.addNotes(`Toàn bộ pipeline DINO trong 1 slide. Từ 1 ảnh, tạo crop lớn cho Teacher, crop nhỏ cho Student. Cả hai qua ViT, lấy output CLS, softmax thành phân bố. Loss là cross-entropy.

Student cập nhật gradient bình thường. Teacher không train gradient, chỉ cập nhật chậm từ Student qua EMA. Ý tưởng: Student nhìn 1 góc nhỏ nhưng phải output giống Teacher đang nhìn toàn bộ. Buộc Student hiểu toàn cục từ cục bộ.

Bây giờ mình đi vào từng thành phần: tại sao cần 2 network, EMA là gì, multi-crop, softmax, cross-entropy, chống collapse.`);
})();

// ═══════════════════════════════════════
// SLIDE 10 — Tại sao self-distillation?
// ═══════════════════════════════════════
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addTitle(s, "Tại sao self-distillation?");
  addProgress(s, 3);

  const pts = [
    ["1", "Không nhãn → cần Teacher làm đáp án"],
    ["2", "Teacher ổn định → Student có mục tiêu rõ"],
    ["3", "Teacher cải thiện dần qua EMA"],
  ];

  for (let i = 0; i < 3; i++) {
    const yy = 1.5 + i * 1.4;
    s.addText(pts[i][0], { x: M + 0.2, y: yy, w: 0.7, h: 0.7, fontFace: FONT_TITLE, fontSize: 36, bold: true, color: C.red, align: "center", valign: "middle", margin: 0 });
    s.addText(pts[i][1], { x: M + 1.2, y: yy, w: CW - 1.5, h: 0.7, fontFace: FONT, fontSize: 28, color: C.black, align: "left", valign: "middle", margin: 0 });
  }

  s.addShape(pres.shapes.RECTANGLE, {
    x: M + 0.5, y: 5.6, w: CW - 1, h: 0.7,
    fill: { color: "FFF0F0" }, line: { color: C.red, width: 1 },
  });
  s.addText("Cả hai train gradient → collapse", {
    x: M + 0.5, y: 5.6, w: CW - 1, h: 0.7,
    fontFace: FONT, fontSize: 28, italic: true, color: C.red, align: "center", valign: "middle",
  });

  s.addNotes(`Tại sao 2 network thay vì 1? Không có nhãn nên cần tín hiệu giám sát từ đâu đó — Teacher chính là nguồn đó. Teacher ổn định nên Student có mục tiêu rõ. Teacher cải thiện dần nhờ EMA.

Nếu cả hai cùng train gradient → đuổi theo nhau → mọi ảnh cho ra cùng 1 output = collapse. EMA giải quyết bằng cách cho Teacher đổi cực chậm. Giờ mình xem EMA cụ thể.`);
})();

// ═══════════════════════════════════════
// SLIDE 11 — EMA
// ═══════════════════════════════════════
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addTitle(s, "EMA");
  addProgress(s, 3);

  s.addText("θ_T ← λ·θ_T + (1−λ)·θ_S", {
    x: M, y: 1.6, w: CW, h: 0.8,
    fontFace: "Consolas", fontSize: 32, bold: true, color: C.black, align: "center", margin: 0,
  });

  s.addText("λ = 0.996 → 1.0", {
    x: M, y: 2.8, w: CW, h: 0.6,
    fontFace: FONT, fontSize: 32, bold: true, color: C.red, align: "center", margin: 0,
  });

  s.addText("Teacher giữ 99.6% cũ, lấy 0.4% từ Student", {
    x: M, y: 3.8, w: CW, h: 0.6,
    fontFace: FONT, fontSize: 28, color: C.black, align: "center", margin: 0,
  });

  s.addText("Cosine schedule: λ tăng dần → cuối training\nTeacher gần như không đổi", {
    x: M, y: 4.6, w: CW, h: 1.0,
    fontFace: FONT, fontSize: 28, italic: true, color: C.gray, align: "center", margin: 0,
  });

  addSource(s, "Grill et al. NeurIPS 2020 (BYOL) · Caron et al. ICCV 2021");

  s.addNotes(`EMA — Exponential Moving Average. Mỗi bước training, Teacher giữ 99.6% giá trị cũ, lấy 0.4% từ Student. Lambda tăng từ 0.996 lên 1.0 theo cosine schedule — cuối training Teacher gần như không đổi.

0.996 từ đâu? BYOL (Grill et al. NeurIPS 2020) thử nhiều giá trị, 0.996 tốt nhất. DINO kế thừa. Hình dung: thầy giáo kinh nghiệm — không đổi theo từng câu hỏi mà tích luỹ dần.

Tại sao không fix Teacher luôn? Vì ban đầu Teacher là random, fix thì Student bị giới hạn. EMA cho Teacher tốt dần nhưng đủ chậm để không collapse. Giờ xem multi-crop.`);
})();

// ═══════════════════════════════════════
// SLIDE 12 — Multi-crop
// ═══════════════════════════════════════
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addTitle(s, "Multi-crop");
  addProgress(s, 3);

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

  s.addText("Nhìn 1 góc nhỏ → phải hiểu toàn bộ ảnh", {
    x: M, y: 5.6, w: CW, h: 0.6,
    fontFace: FONT, fontSize: 28, italic: true, color: C.gray, align: "center", margin: 0,
  });

  addSource(s, "Caron et al. ICCV 2021 · SwAV (Caron 2020)");

  s.addNotes(`Multi-crop: từ 1 ảnh tạo 2 global crop (>50% ảnh, Teacher nhận) và 6 local crop (<50%, Student nhận). Ý tưởng: nhìn cái vây cá thôi cũng phải biết là con cá — local-to-global.

Tại sao không chỉ 2 global crop? Overlap quá lớn, model chỉ copy chứ không hiểu. Local crop buộc Student suy luận từ cục bộ ra toàn cục. Chi phí: local crop 96² chỉ 18% pixel so với global 224², nên 6 local ≈ 1 global thêm. 8 góc nhìn thay vì 2, compute chỉ +50%.

Kiểm chứng: bỏ local crop giảm 2-3% ImageNet. Trade-off rất tốt. Giờ mình cần hiểu Teacher và Student so sánh output bằng cách nào — trước hết là softmax.`);
})();

// ═══════════════════════════════════════
// SLIDE 13 — Softmax
// ═══════════════════════════════════════
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addTitle(s, "Softmax");
  addProgress(s, 3);

  s.addText("P(xᵢ) = exp(zᵢ/τ) / Σⱼ exp(zⱼ/τ)", {
    x: M, y: 1.6, w: CW, h: 0.8,
    fontFace: "Consolas", fontSize: 30, bold: true, color: C.black, align: "center", margin: 0,
  });

  s.addText([
    { text: "Input: ", options: { bold: true } },
    { text: "logits (số thô)", options: {} },
  ], { x: M + 0.5, y: 2.8, w: CW - 1, h: 0.6, fontFace: FONT, fontSize: 28, color: C.black, align: "left", margin: 0 });

  s.addText([
    { text: "Output: ", options: { bold: true } },
    { text: "phân bố xác suất (tổng = 1)", options: {} },
  ], { x: M + 0.5, y: 3.5, w: CW - 1, h: 0.6, fontFace: FONT, fontSize: 28, color: C.black, align: "left", margin: 0 });

  s.addText([
    { text: "τ (temperature): ", options: { bold: true, color: C.red } },
    { text: "kiểm soát độ sắc nét", options: {} },
  ], { x: M + 0.5, y: 4.2, w: CW - 1, h: 0.6, fontFace: FONT, fontSize: 28, color: C.black, align: "left", margin: 0 });

  s.addNotes(`Output ViT qua projection head cho ra logits — số thô, có thể âm dương bất kỳ. Softmax chuyển thành phân bố xác suất: exp mỗi phần tử rồi chia tổng. Kết quả: mỗi giá trị ∈ [0,1], tổng = 1.

Temperature τ kiểm soát sắc nét: τ nhỏ → gần one-hot; τ lớn → đều hơn. DINO dùng τ=0.04 cho Teacher (sắc nét), τ=0.1 cho Student (mềm hơn). Con số từ Table 7, Caron et al. — hyperparameter tuning.

Tại sao cần softmax? Vì bước tiếp dùng cross-entropy, cần input là phân bố xác suất. Slide tiếp mình minh hoạ temperature.`);
})();

// ═══════════════════════════════════════
// SLIDE 14 — Temperature
// ═══════════════════════════════════════
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addTitle(s, "Temperature");
  addProgress(s, 3);

  // Bar charts
  const lx = M + 0.3;
  s.addText("Teacher · τ = 0.04", { x: lx, y: 1.3, w: 5.2, h: 0.5, fontFace: FONT, fontSize: 28, bold: true, color: C.green, align: "center", margin: 0 });

  const tBars = [0.92, 0.03, 0.02, 0.02, 0.01];
  const barW = 0.75;
  const barMaxH = 2.8;
  for (let i = 0; i < tBars.length; i++) {
    const bh = Math.max(tBars[i] * barMaxH, 0.08);
    s.addShape(pres.shapes.RECTANGLE, {
      x: lx + 0.3 + i * (barW + 0.15), y: 2.0 + (barMaxH - bh), w: barW, h: bh,
      fill: { color: C.red },
    });
  }

  const rrx = M + 6.3;
  s.addText("Student · τ = 0.1", { x: rrx, y: 1.3, w: 5.2, h: 0.5, fontFace: FONT, fontSize: 28, bold: true, color: C.black, align: "center", margin: 0 });

  const sBars = [0.45, 0.20, 0.15, 0.12, 0.08];
  for (let i = 0; i < sBars.length; i++) {
    const bh = Math.max(sBars[i] * barMaxH, 0.08);
    s.addShape(pres.shapes.RECTANGLE, {
      x: rrx + 0.3 + i * (barW + 0.15), y: 2.0 + (barMaxH - bh), w: barW, h: bh,
      fill: { color: C.black },
    });
  }

  s.addText("τ = 0.04 / 0.1 — chọn qua thử nghiệm (Table 7)", {
    x: M, y: 5.3, w: CW, h: 0.6,
    fontFace: FONT, fontSize: 28, italic: true, color: C.gray, align: "center", margin: 0,
  });

  addSource(s, "Caron et al. ICCV 2021, Table 7");

  s.addNotes(`Minh hoạ: cùng 1 vector logits, temperature khác nhau → phân bố khác nhau hoàn toàn.

Teacher τ=0.04: 1 class chiếm 92%, gần one-hot. Teacher "chắc chắn". Student τ=0.1: class cao nhất chỉ 45%, còn lại vẫn đáng kể. Student "đang học, cần linh hoạt".

Tại sao Teacher τ nhỏ hơn? Teacher nhìn global crop (nhiều thông tin), cập nhật chậm (ổn định) → output đáng tin, có quyền chắc chắn. Student nhận local crop (ít thông tin) → cần τ lớn để gradient chảy đều.

Con số 0.04 và 0.1: tác giả thử nhiều cặp, cặp này tốt nhất. Không có công thức lý thuyết.

Giờ có 2 phân bố, cần đo khoảng cách → cross-entropy.`);
})();

// ═══════════════════════════════════════
// SLIDE 15 — Cross-entropy loss
// ═══════════════════════════════════════
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addTitle(s, "Cross-entropy loss");
  addProgress(s, 3);

  s.addText("L = −Σ Pₜ · log Pₛ", {
    x: M, y: 1.5, w: CW, h: 0.8,
    fontFace: "Consolas", fontSize: 34, bold: true, color: C.black, align: "center", margin: 0,
  });

  const cases = [
    { sc: "Pₜ≈1, Pₛ≈0", res: "−log(0) → ∞", mean: "Phạt nặng", color: C.red },
    { sc: "Pₜ≈1, Pₛ≈1", res: "−log(1) = 0", mean: "Hoàn hảo", color: C.green },
    { sc: "Pₜ≈0", res: "0 × … ≈ 0", mean: "Bỏ qua", color: C.gray },
  ];

  for (let i = 0; i < 3; i++) {
    const yy = 2.8 + i * 1.1;
    s.addText((i + 1).toString(), { x: M + 0.3, y: yy, w: 0.6, h: 0.7, fontFace: FONT_TITLE, fontSize: 32, bold: true, color: cases[i].color, align: "center", valign: "middle", margin: 0 });
    s.addText(cases[i].sc, { x: M + 1.2, y: yy, w: 3.5, h: 0.7, fontFace: "Consolas", fontSize: 28, color: C.black, align: "left", valign: "middle", margin: 0 });
    s.addText(cases[i].res, { x: M + 4.7, y: yy, w: 3.5, h: 0.7, fontFace: "Consolas", fontSize: 28, color: C.black, align: "center", valign: "middle", margin: 0 });
    s.addText(cases[i].mean, { x: M + 8.2, y: yy, w: 3.5, h: 0.7, fontFace: FONT, fontSize: 28, bold: true, color: cases[i].color, align: "left", valign: "middle", margin: 0 });
  }

  s.addNotes(`Cross-entropy: −Σ Pₜ·log Pₛ. Tại sao log? Vì −log(p) đo "sự bất ngờ". 3 trường hợp:

1) Teacher chắc (Pₜ≈1), Student sai (Pₛ≈0): −log(0)→∞, phạt cực nặng. Đây là tính chất quan trọng nhất.
2) Cả hai đồng ý: −log(1)=0, hoàn hảo.
3) Teacher không chắc (Pₜ≈0): nhân bất kỳ ≈ 0, Student không bị phạt.

Nghĩa là Student chỉ bị ép học chỗ Teacher tự tin nhất — hiệu quả.

Tại sao không MSE? MSE phạt đều mọi sai lệch. Cross-entropy phạt nặng nhất ở class Teacher chắc, bỏ qua class Teacher không biết. Student tập trung học chỗ quan trọng.

Gốc information theory: cross-entropy đo lượng thông tin cần mã hoá P bằng Q. Giờ mình nói chống collapse.`);
})();

// ═══════════════════════════════════════
// SLIDE 16 — Chống collapse
// ═══════════════════════════════════════
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addTitle(s, "Chống collapse");
  addProgress(s, 3);

  const cx = M + 0.3, cy = 1.4, cw = 5.3, ch = 3.5;
  s.addShape(pres.shapes.RECTANGLE, { x: cx, y: cy, w: cw, h: ch, fill: { color: C.tableAlt }, line: { color: C.lightGray, width: 1 } });
  s.addText("Centering", { x: cx, y: cy + 0.2, w: cw, h: 0.6, fontFace: FONT, fontSize: 32, bold: true, italic: true, color: C.green, align: "center", margin: 0 });
  s.addText("g(x) − c", { x: cx, y: cy + 1.0, w: cw, h: 0.6, fontFace: "Consolas", fontSize: 30, bold: true, color: C.red, align: "center", margin: 0 });
  s.addText("Trừ trung bình\nKhông cho 1 chiều\nchiếm ưu thế", { x: cx + 0.2, y: cy + 1.8, w: cw - 0.4, h: 1.4, fontFace: FONT, fontSize: 28, color: C.gray, align: "center", margin: 0 });

  const dx = M + 6.3;
  s.addShape(pres.shapes.RECTANGLE, { x: dx, y: cy, w: cw, h: ch, fill: { color: C.tableAlt }, line: { color: C.lightGray, width: 1 } });
  s.addText("Sharpening", { x: dx, y: cy + 0.2, w: cw, h: 0.6, fontFace: FONT, fontSize: 32, bold: true, italic: true, color: C.green, align: "center", margin: 0 });
  s.addText("τ = 0.04", { x: dx, y: cy + 1.0, w: cw, h: 0.6, fontFace: "Consolas", fontSize: 30, bold: true, color: C.red, align: "center", margin: 0 });
  s.addText("Temperature thấp\nBuộc Teacher\nchọn rõ ràng", { x: dx + 0.2, y: cy + 1.8, w: cw - 0.4, h: 1.4, fontFace: FONT, fontSize: 28, color: C.gray, align: "center", margin: 0 });

  s.addText("Bỏ 1 trong 2 → collapse", {
    x: M, y: 5.5, w: CW, h: 0.6,
    fontFace: FONT, fontSize: 28, italic: true, bold: true, color: C.red, align: "center", margin: 0,
  });

  addSource(s, "Caron et al. ICCV 2021, Section 3.1");

  s.addNotes(`Collapse: mọi ảnh cho ra cùng 1 output. EMA giúp nhưng chưa đủ. DINO thêm 2 cơ chế:

Centering: trừ running mean c khỏi output Teacher. Không có → 1 chiều dominate → mọi output giống nhau → collapse.

Sharpening: τ=0.04 rất thấp. Không có → phân bố đều → Teacher nói "không biết" → Student cũng đều → collapse kiểu khác.

Kiểm chứng: bỏ centering → collapse sau 1 epoch. Bỏ sharpening → collapse chậm hơn nhưng vẫn xảy ra. Cần cả 2 cùng lúc. Đây là đóng góp kỹ thuật quan trọng nhất.

Giờ đã đủ thành phần. Xem kết quả.`);
})();

// ═══════════════════════════════════════
// SLIDE 17 — Kết quả v1 + Attention map
// ═══════════════════════════════════════
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addTitle(s, "Kết quả DINOv1");
  addProgress(s, 3);

  // Simplified table - fewer rows, bigger font
  const tbl = [];
  tbl.push(["Model", "Linear"].map(t => ({ text: t, options: { bold: true, color: C.white, fill: { color: C.green }, fontSize: 28, fontFace: FONT, align: "center", valign: "middle" } })));
  const rows = [["ViT-S/8", "79.7%"], ["ViT-B/8", "80.1% ★"], ["ResNet-50", "75.3%"]];
  for (let r = 0; r < rows.length; r++) {
    tbl.push(rows[r].map((t, c) => ({
      text: t,
      options: {
        fontSize: 28, fontFace: FONT,
        fill: { color: r % 2 === 0 ? C.tableAlt : C.white },
        color: r === 1 && c === 1 ? C.red : C.black,
        bold: r === 1 && c === 1, align: c === 0 ? "left" : "center", valign: "middle",
      },
    })));
  }
  s.addTable(tbl, { x: M + 0.5, y: 1.3, w: 7, h: 3.0, colW: [3.5, 3.5], border: { pt: 0.5, color: C.lightGray } });

  s.addText("80.1%", { x: M + 8, y: 1.5, w: 3.5, h: 1.0, fontFace: FONT_TITLE, fontSize: 56, bold: true, color: C.red, align: "center", margin: 0 });
  s.addText("vượt supervised\nResNet-50 (76.5%)", { x: M + 8, y: 2.6, w: 3.5, h: 1.0, fontFace: FONT, fontSize: 28, italic: true, color: C.gray, align: "center", margin: 0 });

  s.addText("Attention map tự segment vật thể — emerging property", { x: M, y: 5.0, w: CW, h: 0.6, fontFace: FONT, fontSize: 28, italic: true, color: C.green, align: "center", margin: 0 });

  addSource(s, "Caron et al. ICCV 2021, Table 2 & Figure 1");

  s.addNotes(`80.1% ImageNet linear probe với ViT-B/8 — vượt supervised ResNet-50 (76.5%) mà không cần nhãn. Milestone: lần đầu self-supervised vượt supervised.

Phát hiện nổi bật: attention map CLS token ở layer cuối tự segment vật thể khỏi nền. Head khác focus đầu, thân, nền con chó. Chỉ xảy ra với ViT + DINO, không xảy ra supervised hay CNN. Gọi là emerging property.

Tại sao? Supervised chỉ cần biết "đây là chó". DINO so sánh crop lớn/nhỏ, buộc hiểu vùng nào quan trọng → tự segment. Có thể dùng làm pseudo-segmentation.

Tóm tắt v1: self-distillation, EMA, multi-crop, centering+sharpening, 80.1%. Hạn chế: chỉ 1.28M ảnh, chỉ classification, ViT-B 86M params. v2 giải quyết cả 3.`);
})();

// ═══════════════════════════════════════
// SLIDE 18 — Tóm tắt v1 (cream)
// ═══════════════════════════════════════
(() => {
  const s = pres.addSlide();
  s.background = { color: C.cream };

  s.addText("DINOv1 — tóm tắt", {
    x: M, y: 0.4, w: CW, h: 0.7,
    fontFace: FONT_TITLE, fontSize: 36, bold: true, italic: true, color: C.green, align: "left", margin: 0,
  });

  const pts = [
    "Self-distillation: Student bắt chước Teacher",
    "EMA: Teacher cập nhật chậm, tránh collapse",
    "Multi-crop: cục bộ → toàn cục",
    "Centering + Sharpening: chống collapse",
    "80.1% ImageNet — vượt supervised",
  ];

  for (let i = 0; i < pts.length; i++) {
    s.addText((i + 1) + ".  " + pts[i], {
      x: M + 0.3, y: 1.5 + i * 1.0, w: CW - 0.5, h: 0.7,
      fontFace: FONT, fontSize: 28,
      color: i === 4 ? C.red : C.black, align: "left", valign: "middle", margin: 0,
    });
  }

  s.addNotes(`5 điểm chính DINOv1. Hạn chế: data 1.28M, chỉ classification, model 86M. DINOv2 giải quyết cả 3: data ×110, model ×13, test nhiều task. Chuyển sang v2.`);
})();

// ═══════════════════════════════════════
// SECTION 4 DIVIDER
// ═══════════════════════════════════════
addSectionDivider(4, "DINOv2 (2023)");

// ═══════════════════════════════════════
// SLIDE 19 — LVD-142M
// ═══════════════════════════════════════
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addTitle(s, "LVD-142M");
  addProgress(s, 4);

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
      fontFace: FONT, fontSize: 28, bold: true,
      color: isLast ? C.red : C.black, align: "center", valign: "middle",
    });
    if (i < 4) {
      s.addText("→", { x: xx + 2.1, y: 2.0, w: 0.3, h: 1.0, fontFace: FONT, fontSize: 28, color: C.red, align: "center", valign: "middle" });
    }
  }

  s.addText("Gấp 110× ImageNet — không dùng nhãn", {
    x: M, y: 4.0, w: CW, h: 0.6,
    fontFace: FONT, fontSize: 30, bold: true, color: C.red, align: "center", margin: 0,
  });

  s.addText("Chất lượng > số lượng: 142M curated thắng 1.2B raw", {
    x: M, y: 4.8, w: CW, h: 0.6,
    fontFace: FONT, fontSize: 28, italic: true, color: C.gray, align: "center", margin: 0,
  });

  addSource(s, "Oquab et al. TMLR 2024, Section 3");

  s.addNotes(`LVD pipeline: crawl 1.2 tỷ ảnh → lọc NSFW/chất lượng → loại trùng bằng SSCD → chọn qua Faiss nearest neighbor (embed ảnh, so với ImageNet embedding, không dùng nhãn) → 142M sạch.

Tại sao không dùng luôn 1.2B? Ảnh internet nhiễu: trùng lặp, NSFW, logo, phân bố lệch. Train trên raw 1.2B thua curated 142M khoảng 2-3%. Chất lượng > số lượng.

Giờ xem v2 cải tiến gì về loss.`);
})();

// ═══════════════════════════════════════
// SLIDE 20 — 3 loss v2
// ═══════════════════════════════════════
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addTitle(s, "Ba loss của v2");
  addProgress(s, 4);

  const losses = [
    { name: "DINO loss", desc: "CLS token → toàn cục", y: 1.3 },
    { name: "iBOT loss", desc: "Masked patches → cục bộ", y: 3.0 },
    { name: "KoLeo", desc: "Trải đều embedding", y: 4.7 },
  ];

  for (const l of losses) {
    s.addShape(pres.shapes.RECTANGLE, {
      x: M + 0.3, y: l.y, w: 5.5, h: 1.3,
      fill: { color: C.tableAlt }, line: { color: C.lightGray, width: 1 },
    });
    s.addText(l.name, { x: M + 0.5, y: l.y + 0.1, w: 5.1, h: 0.5, fontFace: FONT, fontSize: 28, bold: true, color: C.red, align: "left", margin: 0 });
    s.addText(l.desc, { x: M + 0.5, y: l.y + 0.6, w: 5.1, h: 0.5, fontFace: FONT, fontSize: 28, color: C.gray, align: "left", margin: 0 });
  }

  s.addText([
    { text: "Bỏ iBOT → ADE20k −4.2 mIoU", options: { breakLine: true, fontSize: 28 } },
    { text: "Bỏ KoLeo → ImageNet −0.5%", options: { breakLine: true, fontSize: 28 } },
    { text: "", options: { fontSize: 14, breakLine: true } },
    { text: "Cả 3 đều cần thiết", options: { fontSize: 30, bold: true, color: C.red } },
  ], {
    x: M + 6.5, y: 1.8, w: 5, h: 3.5,
    fontFace: FONT, color: C.black, align: "left", margin: 0,
  });

  addSource(s, "Oquab et al. TMLR 2024 · Zhou et al. ICLR 2022");

  s.addNotes(`v2 kết hợp 3 loss. DINO loss giống v1: CLS token, hiểu toàn cục. iBOT (Zhou et al. ICLR 2022): che patch rồi đoán token từ Teacher — khác MAE (đoán pixel), iBOT đoán ở mức semantic. Giúp hiểu cục bộ, cần cho segmentation. KoLeo: đẩy embedding trải đều, tránh collapse.

Kiểm chứng: bỏ iBOT giảm 4.2 mIoU ADE20k — rất nhiều. Bỏ KoLeo giảm 0.5% ImageNet. Cả 3 cần thiết, không thừa.

Thêm: Sinkhorn-Knopp cân bằng cluster, untied head, fine-tune 518px, FlashAttention. Xem kết quả.`);
})();

// ═══════════════════════════════════════
// SLIDE 21 — Kết quả v2
// ═══════════════════════════════════════
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addTitle(s, "Kết quả DINOv2");
  addProgress(s, 4);

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
  tbl.push(["Phương pháp", "ImageNet"].map(t => ({ text: t, options: { bold: true, color: C.white, fill: { color: C.green }, fontSize: 28, fontFace: FONT, align: "center", valign: "middle" } })));
  const rows = [["DINOv2", "86.5%"], ["iBOT", "82.3%"], ["MAE", "73.5%"], ["OpenCLIP", "83.5%"]];
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
  s.addTable(tbl, { x: M + 1.5, y: 3.2, w: 9, h: 3.0, colW: [4.5, 4.5], border: { pt: 0.5, color: C.lightGray } });

  addSource(s, "Oquab et al. TMLR 2024, Table 4");

  s.addNotes(`86.5% ImageNet linear probe, ViT-g 1.1B params. 49.0 mIoU ADE20k frozen features. Vượt tất cả: iBOT 82.3%, MAE 73.5%, OpenCLIP 83.5% (cần 400M text-image pairs).

DINOv2 là general-purpose: 1 backbone dùng cho classification, segmentation, depth, video. So v1: +6.4% ImageNet, lần đầu test dense prediction. Còn scale thêm? v3 trả lời.`);
})();

// ═══════════════════════════════════════
// SLIDE 22 — Tóm tắt v2 (cream)
// ═══════════════════════════════════════
(() => {
  const s = pres.addSlide();
  s.background = { color: C.cream };
  s.addText("DINOv2 — tóm tắt", { x: M, y: 0.4, w: CW, h: 0.7, fontFace: FONT_TITLE, fontSize: 36, bold: true, italic: true, color: C.green, align: "left", margin: 0 });

  const pts = ["LVD-142M: 1.2B → 142M sạch", "DINO + iBOT + KoLeo", "ViT-g: 1.1B params", "86.5% ImageNet, 49.0 ADE20k"];
  for (let i = 0; i < pts.length; i++) {
    s.addText((i + 1) + ".  " + pts[i], {
      x: M + 0.3, y: 1.5 + i * 1.1, w: CW - 0.5, h: 0.7,
      fontFace: FONT, fontSize: 28, color: i === 3 ? C.red : C.black, align: "left", valign: "middle", margin: 0,
    });
  }

  s.addNotes(`So v1: data ×110, model ×13, thêm 2 loss. Kết quả +6.4% ImageNet. DINOv2 thành foundation model phổ biến nhất cho vision. Scale thêm? Chuyển v3.`);
})();

// ═══════════════════════════════════════
// SECTION 5 DIVIDER
// ═══════════════════════════════════════
addSectionDivider(5, "DINOv3 (2025)");

// ═══════════════════════════════════════
// SLIDE 23 — DINOv3 scale
// ═══════════════════════════════════════
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addTitle(s, "DINOv3: scale tiếp");
  addProgress(s, 5);

  const items = [
    { num: "7B", label: "params", desc: "40 blocks, dim 4096" },
    { num: "1.69B", label: "ảnh curated", desc: "Gấp 12× DINOv2" },
  ];

  for (let i = 0; i < 2; i++) {
    const xx = M + 0.3 + i * 6.2;
    s.addShape(pres.shapes.RECTANGLE, { x: xx, y: 1.4, w: 5.5, h: 3.0, fill: { color: C.tableAlt }, line: { color: C.lightGray, width: 1 } });
    s.addText(items[i].num, { x: xx, y: 1.6, w: 5.5, h: 1.0, fontFace: FONT_TITLE, fontSize: 52, bold: true, color: C.red, align: "center", margin: 0 });
    s.addText(items[i].label, { x: xx, y: 2.6, w: 5.5, h: 0.6, fontFace: FONT, fontSize: 28, bold: true, color: C.black, align: "center", margin: 0 });
    s.addText(items[i].desc, { x: xx, y: 3.3, w: 5.5, h: 0.6, fontFace: FONT, fontSize: 28, color: C.gray, align: "center", margin: 0 });
  }

  s.addText("+ Gram Anchoring    + Text Alignment", {
    x: M, y: 5.0, w: CW, h: 0.6,
    fontFace: FONT, fontSize: 30, bold: true, color: C.red, align: "center", margin: 0,
  });

  addSource(s, "Siméoni et al. arXiv Aug 2025");

  s.addNotes(`v3 scale mạnh. Model: ViT-7B — 7 tỷ params, 40 blocks, dim 4096, dùng RoPE + SwiGLU. Data: LVD-1.69B, gấp 12× v2.

2 kỹ thuật mới: Gram Anchoring — dùng Gram matrix (tích chéo features) làm "mỏ neo" giữ ổn định khi train model rất lớn, không có thì loss bùng nổ. Text Alignment — thêm text encoder, align vision/text embedding, mở rộng multimodal mà không ảnh hưởng vision features gốc.

Xem kết quả.`);
})();

// ═══════════════════════════════════════
// SLIDE 24 — Kết quả v3
// ═══════════════════════════════════════
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addTitle(s, "Kết quả DINOv3");
  addProgress(s, 5);

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
    fontFace: FONT, fontSize: 28, italic: true, color: C.gray, align: "center", margin: 0,
  });

  addSource(s, "Siméoni et al. arXiv Aug 2025");

  s.addNotes(`ImageNet +1.9%, ADE20k +6.9 mIoU (rất lớn), DAVIS video +6.7. Dense tasks được lợi nhất từ scaling — classification ở mức cao khó tăng thêm, segmentation cần hiểu chi tiết nên scale giúp nhiều.

Tóm v3: ViT-7B, LVD-1.69B, Gram Anchoring, Text Alignment, 88.4% ImageNet, 55.9 ADE20k.`);
})();

// ═══════════════════════════════════════
// SECTION 6 DIVIDER
// ═══════════════════════════════════════
addSectionDivider(6, "Tổng hợp");

// ═══════════════════════════════════════
// SLIDE 25 — So sánh 3 phiên bản
// ═══════════════════════════════════════
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addTitle(s, "Ba phiên bản");
  addProgress(s, 6);

  const tbl = [];
  tbl.push(["", "v1", "v2", "v3"].map(t => ({ text: t, options: { bold: true, color: C.white, fill: { color: C.green }, fontSize: 28, fontFace: FONT, align: "center", valign: "middle" } })));
  const rows = [["Data", "1.28M", "142M", "1.69B"], ["Model", "86M", "1.1B", "7B"], ["ImageNet", "80.1%", "86.5%", "88.4%"], ["ADE20k", "—", "49.0", "55.9"]];
  for (let r = 0; r < rows.length; r++) {
    tbl.push(rows[r].map((t, c) => ({
      text: t,
      options: {
        fontSize: 28, fontFace: FONT,
        fill: { color: r % 2 === 0 ? C.tableAlt : C.white },
        color: c === 3 && r >= 2 ? C.red : C.black,
        bold: c === 0 || (c === 3 && r >= 2), align: c === 0 ? "left" : "center", valign: "middle",
      },
    })));
  }
  s.addTable(tbl, { x: M + 0.3, y: 1.3, w: 11.5, h: 3.5, colW: [2.8, 2.9, 2.9, 2.9], border: { pt: 0.5, color: C.lightGray } });

  s.addText("Data ×1300 · Model ×81 · +8.3%", {
    x: M, y: 5.3, w: CW, h: 0.6,
    fontFace: FONT, fontSize: 30, bold: true, color: C.red, align: "center", margin: 0,
  });

  s.addNotes(`4 năm: data ×1300, model ×81, ImageNet +8.3%. Mỗi phiên bản giải quyết hạn chế trước đó. Xu hướng chưa bão hoà.`);
})();

// ═══════════════════════════════════════
// SLIDE 26 — DINO vs others
// ═══════════════════════════════════════
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addTitle(s, "So sánh phương pháp");
  addProgress(s, 6);

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

  s.addNotes(`DINOv3 88.4% không nhãn, vượt supervised 85.7% (1.28M nhãn), OpenCLIP 83.5% (400M text pairs), MAE 73.5%. Self-supervised đã thắng.`);
})();

// ═══════════════════════════════════════
// SLIDE 27 — Ứng dụng + Hạn chế
// ═══════════════════════════════════════
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addTitle(s, "Ứng dụng và hạn chế");
  addProgress(s, 6);

  // Left: apps
  s.addText("Ứng dụng", { x: M, y: 1.2, w: 5.5, h: 0.5, fontFace: FONT, fontSize: 30, bold: true, color: C.green, align: "left", margin: 0 });
  const apps = ["Y tế: X-quang, CT scan", "Viễn thám: ảnh vệ tinh", "Nông nghiệp: bệnh cây trồng", "Robot: ước lượng độ sâu"];
  for (let i = 0; i < apps.length; i++) {
    s.addText(apps[i], { x: M + 0.2, y: 1.9 + i * 0.9, w: 5.5, h: 0.7, fontFace: FONT, fontSize: 28, color: C.black, align: "left", valign: "middle", margin: 0 });
  }

  // Right: limits
  s.addText("Hạn chế", { x: M + 6.5, y: 1.2, w: 5.5, h: 0.5, fontFace: FONT, fontSize: 30, bold: true, color: C.red, align: "left", margin: 0 });
  const lims = ["61,000 GPU-hours", "~18 tấn CO₂", "Chưa hiểu temporal"];
  for (let i = 0; i < lims.length; i++) {
    s.addText(lims[i], { x: M + 6.7, y: 1.9 + i * 0.9, w: 5.5, h: 0.7, fontFace: FONT, fontSize: 28, color: C.black, align: "left", valign: "middle", margin: 0 });
  }

  s.addNotes(`Ứng dụng: y tế (ít nhãn, DINO pretrained giúp), viễn thám, nông nghiệp, robotics. Tất cả dùng 1 model pretrained, fine-tune nhẹ.

Hạn chế: 61K GPU-hours (~$120K+ compute), 18 tấn CO₂ (≈ 9 chuyến HN-NYC), chỉ lab lớn train được. Xử lý frame-by-frame, chưa hiểu temporal/chuyển động — hướng nghiên cứu mở.`);
})();

// ═══════════════════════════════════════
// SLIDE 28 — Tổng kết (cream)
// ═══════════════════════════════════════
(() => {
  const s = pres.addSlide();
  s.background = { color: C.cream };

  s.addText("Từ 0 nhãn đến 88.4%\ntrong 4 năm", {
    x: M, y: 0.5, w: CW, h: 1.8,
    fontFace: FONT_TITLE, fontSize: 44, bold: true, italic: true, color: C.green, align: "left", margin: 0,
  });

  const lessons = [
    "Self-distillation + EMA = tín hiệu không nhãn",
    "Data sạch quan trọng hơn data nhiều",
    "Scale chưa bão hoà",
  ];

  for (let i = 0; i < 3; i++) {
    s.addText((i + 1).toString(), { x: M + 0.2, y: 3.0 + i * 1.2, w: 0.7, h: 0.6, fontFace: FONT_TITLE, fontSize: 36, bold: true, color: C.red, align: "center", margin: 0 });
    s.addText(lessons[i], { x: M + 1.1, y: 3.0 + i * 1.2, w: CW - 1.5, h: 0.6, fontFace: FONT, fontSize: 28, color: C.black, align: "left", valign: "middle", margin: 0 });
  }

  s.addNotes(`3 bài học: (1) self-distillation+EMA tạo tín hiệu từ chính model; (2) chất lượng data > số lượng; (3) scaling law vẫn đúng, chưa bão hoà. Self-supervised đã vượt supervised. Tương lai vision có thể không cần gán nhãn nữa.`);
})();

// ═══════════════════════════════════════
// SLIDE 29 — Tài liệu
// ═══════════════════════════════════════
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addTitle(s, "Tài liệu tham khảo");

  const refs = [
    "[1] Caron et al. ICCV 2021 — DINOv1",
    "[2] Oquab et al. TMLR 2024 — DINOv2",
    "[3] Siméoni et al. arXiv 2025 — DINOv3",
    "[4] Dosovitskiy et al. ICLR 2021 — ViT",
    "[5] Vaswani et al. NeurIPS 2017 — Attention",
    "[6] Deng et al. CVPR 2009 — ImageNet",
    "[7] Zhou et al. ICLR 2022 — iBOT",
    "[8] He et al. CVPR 2022 — MAE",
  ];

  for (let i = 0; i < refs.length; i++) {
    s.addText(refs[i], {
      x: M + 0.3, y: 1.2 + i * 0.7, w: CW - 0.5, h: 0.55,
      fontFace: FONT, fontSize: 28, color: C.black, align: "left", valign: "middle", margin: 0,
    });
  }
})();

// ═══════════════════════════════════════
// SLIDE 30 — Cảm ơn (cream)
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
pres.writeFile({ fileName: "/home/claude/DINO_Seminar_v6.1.pptx" })
  .then(() => console.log("Done!"))
  .catch(err => console.error(err));
