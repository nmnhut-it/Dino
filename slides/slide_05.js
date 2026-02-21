/**
 * Slide 5: Student - Flowchart với Input/Output từng bước
 */

const {
  C, FONT, M, CW,
  addTitle, addProgress
, SHAPES } = require('./config');

function create(pres) {
  const s = pres.addSlide();
  s.background = { color: C.bg };

  addTitle(s, "Student", C.v1);

  // Flowchart: INPUT → PROCESS → OUTPUT for each step
  const steps = [
    {
      input: "RGB image\n96×96×3",
      process: "Patch\nEmbedding",
      output: "36 vectors\n(768-dim each)",
      detail: "Chia 6×6 patches → Linear projection → Add position",
    },
    {
      input: "36 vectors\n+ CLS token",
      process: "ViT\nBackbone",
      output: "CLS token\n(768-dim)",
      detail: "Self-attention: patches học quan hệ với nhau",
    },
    {
      input: "CLS token\n(768-dim)",
      process: "MLP\nHead",
      output: "Logits\n(65536-dim)",
      detail: "768 → 2048 → 2048 → 65536 (bảo vệ backbone)",
    },
    {
      input: "Logits\n(65536-dim)",
      process: "Softmax\n(τ=0.1)",
      output: "P_s\n(xác suất)",
      detail: "Chuyển scores thành probability distribution",
    },
  ];

  const startY = 1.15;
  const rowH = 1.15;
  const inputW = 2;
  const processW = 2;
  const outputW = 2;
  const arrowW = 0.6;
  const detailW = 5.5;

  // Header
  s.addText("INPUT", {
    x: M, y: startY, w: inputW, h: 0.3,
    fontFace: FONT, fontSize: 11, bold: true, color: C.gray, align: "center",
  });
  s.addText("XỬ LÝ", {
    x: M + inputW + arrowW, y: startY, w: processW, h: 0.3,
    fontFace: FONT, fontSize: 11, bold: true, color: C.v1, align: "center",
  });
  s.addText("OUTPUT", {
    x: M + inputW + arrowW + processW + arrowW, y: startY, w: outputW, h: 0.3,
    fontFace: FONT, fontSize: 11, bold: true, color: C.gray, align: "center",
  });
  s.addText("CHI TIẾT", {
    x: M + inputW + arrowW + processW + arrowW + outputW + 0.3, y: startY, w: detailW, h: 0.3,
    fontFace: FONT, fontSize: 11, bold: true, color: C.medGray, align: "left",
  });

  // Each step
  steps.forEach((step, i) => {
    const y = startY + 0.35 + i * rowH;
    let x = M;

    // Input box
    s.addShape(SHAPES.RECTANGLE, {
      x, y, w: inputW, h: rowH - 0.1,
      fill: { color: C.cream },
      line: { color: C.lightGray, pt: 1 },
    });
    s.addText(step.input, {
      x, y, w: inputW, h: rowH - 0.1,
      fontFace: FONT, fontSize: 11, color: C.black, align: "center", valign: "middle",
    });

    x += inputW;

    // Arrow
    s.addText("→", {
      x, y, w: arrowW, h: rowH - 0.1,
      fontFace: FONT, fontSize: 22, color: C.lightGray, align: "center", valign: "middle",
    });

    x += arrowW;

    // Process box (blue)
    s.addShape(SHAPES.RECTANGLE, {
      x, y, w: processW, h: rowH - 0.1,
      fill: { color: C.v1 },
    });
    s.addText(step.process, {
      x, y, w: processW, h: rowH - 0.1,
      fontFace: FONT, fontSize: 12, bold: true, color: "FFFFFF", align: "center", valign: "middle",
    });

    x += processW;

    // Arrow
    s.addText("→", {
      x, y, w: arrowW, h: rowH - 0.1,
      fontFace: FONT, fontSize: 22, color: C.lightGray, align: "center", valign: "middle",
    });

    x += arrowW;

    // Output box
    s.addShape(SHAPES.RECTANGLE, {
      x, y, w: outputW, h: rowH - 0.1,
      fill: { color: C.cream },
      line: { color: C.lightGray, pt: 1 },
    });
    s.addText(step.output, {
      x, y, w: outputW, h: rowH - 0.1,
      fontFace: FONT, fontSize: 11, color: C.black, align: "center", valign: "middle",
    });

    x += outputW + 0.3;

    // Detail text
    s.addText(step.detail, {
      x, y, w: detailW, h: rowH - 0.1,
      fontFace: FONT, fontSize: 10, italic: true, color: C.medGray, valign: "middle",
    });
  });

  // Connection note: output of step i = input of step i+1
  s.addShape(SHAPES.RECTANGLE, {
    x: M, y: 5.55, w: CW, h: 1,
    fill: { color: "F5F5F5" },
  });

  s.addText("Output của bước trước = Input của bước sau", {
    x: M + 0.2, y: 5.65, w: 6, h: 0.35,
    fontFace: FONT, fontSize: 14, bold: true, color: C.v1,
  });

  s.addText("Training: Student được train bằng gradient descent. Loss = CrossEntropy(P_s, P_t)", {
    x: M + 0.2, y: 6.05, w: CW - 0.4, h: 0.35,
    fontFace: FONT, fontSize: 13, color: C.accent,
  });

  addProgress(s, 2);

  s.addNotes(`STUDENT NETWORK - GIẢI THÍCH CHI TIẾT TỪNG BƯỚC

═══════════════════════════════════════════════════════════════
BƯỚC 1: PATCH EMBEDDING (Tokenize ảnh)
═══════════════════════════════════════════════════════════════
Input: Ảnh RGB 96×96×3 pixels (local crop - chỉ 1 phần nhỏ của ảnh gốc)

Quá trình:
1. Chia ảnh thành patches: 96÷16 = 6, nên có 6×6 = 36 patches
   - Mỗi patch là 16×16 pixels × 3 channels = 768 values

2. Linear projection: Nhân mỗi patch với ma trận W
   - Input: 768 values (flattened patch)
   - Output: 768 dimensions (giữ nguyên kích thước)
   - Đây chính là "tokenization" - biến ảnh thành sequence giống NLP

3. Add position embedding: Cộng thêm vector vị trí
   - Vì Transformer không biết thứ tự, cần thêm position info
   - Mỗi patch có 1 position embedding riêng (learnable)

4. Prepend CLS token: Thêm 1 token đặc biệt ở đầu
   - CLS = Classification token
   - Là vector learnable, dùng để tổng hợp thông tin cả ảnh

Output: 37 vectors (1 CLS + 36 patches), mỗi vector 768-dim

TẠI SAO LÀM VẬY?
- Transformer (ViT) được thiết kế cho sequences (như câu văn)
- Ảnh là 2D grid, cần chuyển thành 1D sequence
- Giống NLP: "Hello world" → ["Hello", "world"] → embeddings

═══════════════════════════════════════════════════════════════
BƯỚC 2: ViT BACKBONE (Học quan hệ giữa patches)
═══════════════════════════════════════════════════════════════
Input: 37 vectors (CLS + 36 patches)

Quá trình: Self-attention trong Transformer
- Mỗi patch "nhìn" tất cả patches khác
- Tính attention weight: patch này quan trọng bao nhiêu với patch kia?
- Cập nhật mỗi patch dựa trên weighted sum của các patches liên quan

Cấu trúc ViT-S/16:
- 12 Transformer blocks (layers)
- Mỗi block có: Multi-head attention → MLP → LayerNorm
- 12 attention heads trong mỗi block (mỗi head học 1 pattern khác)

Output: CLS token (768-dim)
- Sau 12 layers, CLS token đã "hấp thụ" thông tin từ tất cả patches
- CLS token = đại diện (representation) của cả ảnh

TẠI SAO DÙNG CLS TOKEN?
- 36 patches = 36 vectors, cần tóm thành 1 vector
- CLS token được thiết kế để làm việc này
- Nó "attend" đến tất cả patches và tổng hợp information

CHÚ Ý: Attention heads ở đây KHÁC với MLP Head!
- Attention heads: NẰM TRONG ViT, học quan hệ giữa patches
- MLP Head: NẰM SAU ViT, project features

═══════════════════════════════════════════════════════════════
BƯỚC 3: MLP HEAD (Projection head - RẤT QUAN TRỌNG!)
═══════════════════════════════════════════════════════════════
Input: CLS token (768-dim)

Quá trình: 3-layer MLP (Multi-Layer Perceptron)
- Layer 1: Linear(768 → 2048) + ReLU
- Layer 2: Linear(2048 → 2048) + ReLU
- Layer 3: Linear(2048 → 65536)

Output: Logits vector (65536-dim)

⚠️ TẠI SAO CẦN MLP HEAD? (QUAN TRỌNG!)

Lý do KHÔNG PHẢI chỉ để tăng chiều!

Lý do chính: BẢO VỆ BACKBONE
- Nếu không có MLP Head: gradient từ loss đi thẳng vào backbone
- Backbone sẽ bị "ô nhiễm" bởi SSL task-specific information
- Features sẽ kém khi dùng cho downstream tasks (classification, detection...)

Với MLP Head:
- MLP "hấp thụ" task-specific information
- Backbone giữ được general features
- Features TRƯỚC MLP tốt hơn features SAU MLP

THỰC NGHIỆM CHỨNG MINH (từ paper SimCLR và DINO):
- Có MLP Head (3 layers): 80.1% ImageNet
- Bỏ MLP Head (chỉ linear): ~70% (-10%!)
- Dùng features SAU MLP: ~65% (tệ nhất!)

KẾT LUẬN:
- MLP Head chỉ dùng để TRAIN
- Sau khi train xong → BỎ MLP Head đi
- Dùng CLS token (768-dim) cho downstream tasks

═══════════════════════════════════════════════════════════════
BƯỚC 4: SOFTMAX (Chuyển thành xác suất)
═══════════════════════════════════════════════════════════════
Input: Logits (65536 raw scores)

Quá trình: Softmax với temperature τ = 0.1
- P_s[k] = exp(logits[k] / τ) / Σ exp(logits[i] / τ)
- τ = 0.1 là temperature (Student dùng τ cao hơn Teacher)

Output: P_s - probability distribution (65536-dim, sum = 1)

TẠI SAO τ = 0.1?
- τ thấp → distribution nhọn (confident)
- τ cao → distribution phẳng (uncertain)
- Student dùng τ = 0.1 (mềm hơn Teacher τ = 0.04)
- Giúp Student dễ học hơn từ soft targets

═══════════════════════════════════════════════════════════════
TRAINING
═══════════════════════════════════════════════════════════════
- Student được train bằng GRADIENT DESCENT bình thường
- Loss = Cross-entropy giữa P_s (Student) và P_t (Teacher)
- Gradient chỉ backprop qua Student, KHÔNG qua Teacher
- Teacher được update bằng EMA (sẽ giải thích ở slide sau)`);

  return s;
}

module.exports = { create };
