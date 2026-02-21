/**
 * Slide 6: Teacher - Flowchart với Input/Output, highlight khác biệt
 */

const {
  C, FONT, M, CW,
  addTitle, addProgress
, SHAPES } = require('./config');

function create(pres) {
  const s = pres.addSlide();
  s.background = { color: C.bg };

  addTitle(s, "Teacher", C.green);

  // Flowchart: same structure, highlight differences
  const steps = [
    {
      input: "RGB image\n224×224×3",
      process: "Patch\nEmbedding",
      output: "196 vectors\n(768-dim each)",
      detail: "Chia 14×14 patches (lớn hơn Student)",
      diff: true,
    },
    {
      input: "196 vectors\n+ CLS token",
      process: "ViT\nBackbone",
      output: "CLS token\n(768-dim)",
      detail: "Giống Student (cùng kiến trúc)",
      diff: false,
    },
    {
      input: "CLS token\n(768-dim)",
      process: "MLP\nHead",
      output: "Logits\n(65536-dim)",
      detail: "Giống Student (768 → 2048 → 2048 → 65536)",
      diff: false,
    },
    {
      input: "Logits\n(65536-dim)",
      process: "Centering\n(- c)",
      output: "Centered\n(65536-dim)",
      detail: "c = mean(batch). CHỐNG MODE COLLAPSE",
      diff: true,
    },
    {
      input: "Centered\n(65536-dim)",
      process: "Softmax\n(τ=0.04)",
      output: "P_t\n(xác suất)",
      detail: "τ thấp hơn → output SHARP hơn",
      diff: true,
    },
  ];

  const startY = 1.1;
  const rowH = 0.95;
  const inputW = 1.8;
  const processW = 1.8;
  const outputW = 1.8;
  const arrowW = 0.5;
  const detailW = 5.8;

  // Header
  s.addText("INPUT", {
    x: M, y: startY, w: inputW, h: 0.25,
    fontFace: FONT, fontSize: 10, bold: true, color: C.gray, align: "center",
  });
  s.addText("XỬ LÝ", {
    x: M + inputW + arrowW, y: startY, w: processW, h: 0.25,
    fontFace: FONT, fontSize: 10, bold: true, color: C.green, align: "center",
  });
  s.addText("OUTPUT", {
    x: M + inputW + arrowW + processW + arrowW, y: startY, w: outputW, h: 0.25,
    fontFace: FONT, fontSize: 10, bold: true, color: C.gray, align: "center",
  });
  s.addText("CHI TIẾT (█ = khác Student)", {
    x: M + inputW + arrowW + processW + arrowW + outputW + 0.2, y: startY, w: detailW, h: 0.25,
    fontFace: FONT, fontSize: 10, bold: true, color: C.medGray, align: "left",
  });

  // Each step
  steps.forEach((step, i) => {
    const y = startY + 0.3 + i * rowH;
    let x = M;

    const borderColor = step.diff ? C.green : C.lightGray;

    // Input box
    s.addShape(SHAPES.RECTANGLE, {
      x, y, w: inputW, h: rowH - 0.1,
      fill: { color: step.diff ? "E8F5E9" : C.cream },
      line: { color: borderColor, pt: step.diff ? 2 : 1 },
    });
    s.addText(step.input, {
      x, y, w: inputW, h: rowH - 0.1,
      fontFace: FONT, fontSize: 10, color: C.black, align: "center", valign: "middle",
    });

    x += inputW;

    // Arrow
    s.addText("→", {
      x, y, w: arrowW, h: rowH - 0.1,
      fontFace: FONT, fontSize: 18, color: C.lightGray, align: "center", valign: "middle",
    });

    x += arrowW;

    // Process box
    s.addShape(SHAPES.RECTANGLE, {
      x, y, w: processW, h: rowH - 0.1,
      fill: { color: step.diff ? C.green : C.v1 },
      line: { color: step.diff ? C.green : C.v1, pt: step.diff ? 2 : 1 },
    });
    s.addText(step.process, {
      x, y, w: processW, h: rowH - 0.1,
      fontFace: FONT, fontSize: 11, bold: true, color: "FFFFFF", align: "center", valign: "middle",
    });

    x += processW;

    // Arrow
    s.addText("→", {
      x, y, w: arrowW, h: rowH - 0.1,
      fontFace: FONT, fontSize: 18, color: C.lightGray, align: "center", valign: "middle",
    });

    x += arrowW;

    // Output box
    s.addShape(SHAPES.RECTANGLE, {
      x, y, w: outputW, h: rowH - 0.1,
      fill: { color: step.diff ? "E8F5E9" : C.cream },
      line: { color: borderColor, pt: step.diff ? 2 : 1 },
    });
    s.addText(step.output, {
      x, y, w: outputW, h: rowH - 0.1,
      fontFace: FONT, fontSize: 10, color: C.black, align: "center", valign: "middle",
    });

    x += outputW + 0.2;

    // Detail text
    s.addText(step.detail, {
      x, y, w: detailW, h: rowH - 0.1,
      fontFace: FONT, fontSize: 10, italic: true, color: step.diff ? C.green : C.medGray, valign: "middle",
    });
  });

  // Summary section
  s.addShape(SHAPES.RECTANGLE, {
    x: M, y: 5.65, w: CW, h: 1,
    fill: { color: "F5F5F5" },
  });

  s.addText("3 điểm khác Student:", {
    x: M + 0.2, y: 5.75, w: 3, h: 0.35,
    fontFace: FONT, fontSize: 13, bold: true, color: C.green,
  });

  s.addText("① Input lớn hơn (224² vs 96²) → thấy toàn cảnh    ② Centering → chống collapse    ③ τ thấp hơn → output rõ ràng", {
    x: 3.3, y: 5.75, w: 9.5, h: 0.35,
    fontFace: FONT, fontSize: 11, color: C.black,
  });

  s.addText("Training: KHÔNG dùng gradient. Dùng EMA copy từ Student (θ_t ← 0.996×θ_t + 0.004×θ_s)", {
    x: M + 0.2, y: 6.2, w: CW - 0.4, h: 0.35,
    fontFace: FONT, fontSize: 12, color: C.accent,
  });

  addProgress(s, 2);

  s.addNotes(`TEACHER NETWORK - GIẢI THÍCH CHI TIẾT SỰ KHÁC BIỆT VỚI STUDENT

Teacher có CÙNG KIẾN TRÚC với Student, nhưng khác ở 4 điểm quan trọng:
1. Input size lớn hơn (224×224 vs 96×96)
2. Thêm bước Centering (Student không có)
3. Temperature thấp hơn (0.04 vs 0.1)
4. KHÔNG train bằng gradient (dùng EMA)

═══════════════════════════════════════════════════════════════
BƯỚC 1: PATCH EMBEDDING [KHÁC STUDENT]
═══════════════════════════════════════════════════════════════
Input: Ảnh RGB 224×224×3 pixels (global crop - thấy TOÀN BỘ ảnh)

So sánh với Student:
- Student: 96×96 (local crop, chỉ thấy 1 phần)
- Teacher: 224×224 (global crop, thấy toàn cảnh)

Quá trình: Giống Student
- Chia thành patches: 224÷16 = 14, nên có 14×14 = 196 patches
- Linear projection + Position embedding + CLS token

Output: 197 vectors (1 CLS + 196 patches), mỗi vector 768-dim

TẠI SAO TEACHER NHẬN ẢNH LỚN HƠN?
Đây là ý tưởng cốt lõi của DINO:
- Teacher thấy toàn cảnh → biết context đầy đủ → output đáng tin
- Student chỉ thấy 1 phần → phải "đoán" toàn cảnh
- Student học: "nhìn 1 phần phải biết được cả ảnh"

Ví dụ: Nếu ảnh là con chó
- Teacher thấy cả con chó → output "chó" confident
- Student chỉ thấy cái tai → phải học rằng "tai này = chó"
- Đây là cách DINO học semantic understanding!

═══════════════════════════════════════════════════════════════
BƯỚC 2: ViT BACKBONE [GIỐNG STUDENT]
═══════════════════════════════════════════════════════════════
Input: 197 vectors (nhiều hơn Student 37 vectors)

Quá trình: GIỐNG Student
- Cùng kiến trúc ViT-S/16
- Cùng weights (shared architecture)
- Chỉ khác số lượng patches đầu vào (196 vs 36)

Output: CLS token (768-dim)

CHÚ Ý QUAN TRỌNG:
- Teacher và Student dùng CÙNG kiến trúc
- Nhưng KHÁC weights (Teacher weights = EMA của Student weights)
- Đây là điểm khác với Knowledge Distillation truyền thống

═══════════════════════════════════════════════════════════════
BƯỚC 3: MLP HEAD [GIỐNG STUDENT]
═══════════════════════════════════════════════════════════════
Input: CLS token (768-dim)

Quá trình: GIỐNG Student
- 3-layer MLP: 768 → 2048 → 2048 → 65536
- Cùng kiến trúc, khác weights

Output: Logits (65536-dim)

VAI TRÒ CỦA MLP HEAD (nhắc lại):
- Bảo vệ backbone khỏi task-specific information
- Sau khi train: bỏ MLP Head, chỉ dùng CLS token
- Features tốt nhất là TRƯỚC MLP Head, không phải sau

═══════════════════════════════════════════════════════════════
BƯỚC 4: CENTERING [MỚI - STUDENT KHÔNG CÓ]
═══════════════════════════════════════════════════════════════
Input: Logits (65536-dim)

Quá trình: Trừ đi trung bình của batch
- centered_output = output - c
- c được cập nhật: c ← m×c + (1-m)×mean(batch_outputs)
- m = 0.9 (momentum), giữ 90% giá trị cũ

Output: Centered logits (65536-dim)

⚠️ TẠI SAO CẦN CENTERING? (CHỐNG MODE COLLAPSE)

Vấn đề Mode Collapse:
- Nếu Teacher output GIỐNG NHAU cho mọi ảnh (ví dụ: luôn output [0.5, 0.5, ...])
- Student cũng học output giống vậy
- Loss = 0, nhưng model không học được gì!
- Gọi là "trivial solution" hoặc "mode collapse"

Centering giải quyết thế nào?
- Nếu mọi output giống nhau → mean = output đó
- Sau khi trừ: output - mean = 0 (vector zero)
- Vector zero thì vô nghĩa → Loss rất cao!
- Buộc Teacher phải output KHÁC NHAU cho mỗi ảnh

Ví dụ số:
- Collapse: mọi ảnh → [0.5, 0.5, 0.5]
- Mean = [0.5, 0.5, 0.5]
- Sau centering: [0.5, 0.5, 0.5] - [0.5, 0.5, 0.5] = [0, 0, 0]
- Output toàn 0 → softmax sẽ có vấn đề → model buộc phải thay đổi

TẠI SAO CHỈ TEACHER CÓ CENTERING?
- Teacher là "target" cho Student học
- Nếu Teacher collapse → Student cũng collapse
- Centering đảm bảo Teacher luôn cho output có ý nghĩa

═══════════════════════════════════════════════════════════════
BƯỚC 5: SOFTMAX [KHÁC TEMPERATURE]
═══════════════════════════════════════════════════════════════
Input: Centered logits (65536-dim)

Quá trình: Softmax với temperature τ = 0.04
- P_t[k] = exp(logits[k] / τ) / Σ exp(logits[i] / τ)
- τ = 0.04 (THẤP hơn Student τ = 0.1)

Output: P_t - probability distribution (65536-dim, sum = 1)

TẠI SAO τ THẤP HƠN STUDENT?

Temperature ảnh hưởng đến độ "nhọn" của distribution:
- τ thấp (0.04) → distribution rất nhọn (1 peak dominant)
- τ cao (0.1) → distribution phẳng hơn (nhiều peaks)

Lý do Teacher dùng τ thấp:
- Teacher output = "câu trả lời đúng" cho Student
- Câu trả lời cần RÕ RÀNG, TỰ TIN
- τ thấp → output sharp → Student biết rõ cần học gì

Lý do Student dùng τ cao hơn:
- Student đang học, cần "mềm" hơn để dễ optimize
- Soft targets (từ Teacher với τ thấp) + Soft predictions (τ cao)
- Gradient smoother, training ổn định hơn

⚠️ CENTERING + SHARPENING CÂN BẰNG NHAU:
- Centering khuyến khích uniform distribution (tránh mode collapse)
- Sharpening (τ thấp) khuyến khích peaked distribution (tránh uniform collapse)
- Hai cái này balance nhau → training ổn định

═══════════════════════════════════════════════════════════════
TRAINING: EMA (KHÔNG DÙNG GRADIENT!)
═══════════════════════════════════════════════════════════════
Teacher KHÔNG được train bằng gradient descent!

Thay vào đó, dùng EMA (Exponential Moving Average):
θ_teacher ← 0.996 × θ_teacher + 0.004 × θ_student

Nghĩa là:
- Mỗi step, Teacher giữ 99.6% weights hiện tại
- Chỉ lấy 0.4% từ Student weights
- Teacher update CỰC CHẬM

TẠI SAO KHÔNG TRAIN TEACHER BẰNG GRADIENT?
Nếu train cả 2 bằng gradient:
- Teacher và Student có thể "thông đồng"
- Cả 2 cùng collapse về trivial solution
- Loss = 0 nhưng không học được gì

EMA giải quyết thế nào?
- Teacher "đi sau" Student (update chậm hơn)
- 2 networks không thể thông đồng vì update khác tốc độ
- Teacher như "moving average" của nhiều versions của Student → ổn định hơn

PHÁT HIỆN THÚ VỊ:
- Teacher performance LUÔN TỐT HƠN Student trong suốt training!
- Đây gọi là Polyak-Ruppert averaging effect
- Trung bình của nhiều models thường tốt hơn 1 model đơn lẻ

COSINE SCHEDULE:
- λ (EMA coefficient) tăng dần: 0.996 → 1.0
- Đầu training: λ = 0.996 (Teacher update nhanh hơn)
- Cuối training: λ → 1.0 (Teacher gần như freeze)
- Giúp Teacher ổn định hơn khi training kết thúc`);

  return s;
}

module.exports = { create };
