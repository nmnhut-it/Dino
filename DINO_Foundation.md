# DINO: Self-Distillation with NO Labels
## Tài liệu tham khảo toàn diện

> **Đối tượng**: CS students có kiến thức ML cơ bản (neural network, loss function, gradient descent)
> **Phương pháp**: Examples first, theory second

---

# Part 0: DINO Làm Được Gì?

## 0.1 Demo: Attention Maps Tự Segment Vật Thể

Trước khi đi vào lý thuyết, hãy xem DINO làm được gì.

**Ví dụ 1: Attention map trên ảnh con chó**
```
[INPUT]                    [ATTENTION MAPS]
┌─────────────┐           ┌─────────┐ ┌─────────┐ ┌─────────┐
│             │           │ Head 1  │ │ Head 2  │ │ Head 3  │
│   🐕 Dog    │    →      │  Đầu    │ │  Thân   │ │  Nền    │
│             │           │ (sáng)  │ │ (sáng)  │ │ (sáng)  │
└─────────────┘           └─────────┘ └─────────┘ └─────────┘
```

Không ai dạy model "đây là đầu", "đây là thân" — nó tự học phân biệt!

**Ví dụ 2: Semantic segmentation không cần annotation**
- Input: Ảnh xe hơi trên đường
- Output: Tự động tách xe, đường, bầu trời thành các vùng riêng biệt
- Không cần 1 pixel annotation nào

## 0.2 So Sánh Chi Phí

| Phương pháp | Labels cần | Chi phí ước tính | Thời gian |
|-------------|------------|------------------|-----------|
| **ImageNet Supervised** | 14M ảnh × 3 người kiểm tra | $500K+ | 2 năm |
| **OpenCLIP** | 400M text-image pairs | Cần crawl + filter | Tháng |
| **DINO** | 0 | Chỉ cần ảnh raw | Tuần |

## 0.3 Tóm Tắt 1 Phút

DINO = **D**istillation with **NO** labels

**Ý tưởng cốt lõi**:
1. Tạo 2 phiên bản của cùng 1 model: Teacher và Student
2. Teacher nhìn toàn cảnh, Student nhìn cục bộ
3. Student phải đoán output giống Teacher
4. Không cần nhãn — Teacher chính là "đáp án"

**Kết quả**: 88.4% ImageNet accuracy, vượt supervised learning (85.7%)

---

# Part 1: Prerequisites

## 1.1 Từ Ảnh Đến Patches

### Ví dụ trước

Hãy tưởng tượng bạn có một bức ảnh 224×224 pixels. Thay vì xử lý từng pixel một (224×224 = 50,176 pixels — quá nhiều!), ta "cắt" ảnh thành các mảnh nhỏ hơn.

```
Ảnh gốc 224×224
┌────┬────┬────┬─...─┬────┐
│ P1 │ P2 │ P3 │     │P14 │  ← Hàng 1: 14 patches
├────┼────┼────┼─...─┼────┤
│P15 │P16 │P17 │     │P28 │  ← Hàng 2: 14 patches
├────┼────┼────┼─...─┼────┤
│... │    │    │     │... │
├────┼────┼────┼─...─┼────┤
│    │    │    │     │P196│  ← Hàng 14: 14 patches
└────┴────┴────┴─...─┴────┘

Mỗi patch: 16×16 pixels
Tổng: 14×14 = 196 patches
```

### Tại sao 16×16?

- Quá nhỏ (4×4): 3,136 patches → sequence quá dài
- Quá lớn (32×32): 49 patches → mất chi tiết
- 16×16: Balance giữa chi tiết và độ dài sequence

### Từ Patch Đến Vector

Mỗi patch 16×16×3 (RGB) = 768 số → **Linear projection** → Vector 768 chiều

```python
# Pseudocode
patch = image[0:16, 0:16, :]  # 16×16×3 = 768 numbers
embedding = linear_layer(patch.flatten())  # → 768-dim vector
```

**Thuật ngữ**:
- **Patch**: Một mảnh nhỏ của ảnh (16×16 pixels)
- **Embedding**: Vector số đại diện cho patch
- **Positional encoding**: Cho model biết patch ở vị trí nào (thêm vào embedding)

## 1.2 Attention Mechanism

### Ví dụ: Tìm thông tin trong thư viện

Bạn muốn tìm sách về "machine learning". Quá trình:

1. **Query (Q)**: Câu hỏi của bạn — "machine learning"
2. **Key (K)**: Tiêu đề/tag của mỗi cuốn sách
3. **Value (V)**: Nội dung thực sự của mỗi cuốn sách

```
Bạn hỏi: "machine learning" (Query)
                    ↓
         So sánh với mỗi Key
                    ↓
┌─────────────────────────────────────────┐
│ Sách 1: "Deep Learning" → Match cao    │ → Lấy nhiều nội dung
│ Sách 2: "Statistics"    → Match vừa    │ → Lấy ít nội dung
│ Sách 3: "Cooking"       → Match thấp   │ → Gần như bỏ qua
└─────────────────────────────────────────┘
                    ↓
         Tổng hợp nội dung (Values)
                    ↓
              Câu trả lời
```

### Công thức Attention

```
Attention(Q, K, V) = softmax(QK^T / √d) × V
```

Giải thích từng phần:

| Phần | Ý nghĩa | Ví dụ |
|------|---------|-------|
| `QK^T` | Đo độ tương tự giữa Q và K | "machine learning" khớp với "Deep Learning" bao nhiêu? |
| `√d` | Chia để ổn định (d=64 trong ViT-B) | Không cho số quá lớn trước softmax |
| `softmax` | Chuyển thành xác suất (tổng = 1) | [0.7, 0.2, 0.1] thay vì [5.2, 1.3, 0.5] |
| `× V` | Lấy nội dung theo trọng số | 70% từ sách 1, 20% từ sách 2, 10% từ sách 3 |

### Multi-Head Attention

Thay vì 1 góc nhìn, dùng nhiều góc nhìn (heads) cùng lúc:

```
Head 1: Focus vào texture (lông, vảy)
Head 2: Focus vào shape (hình dáng tổng thể)
Head 3: Focus vào color (màu sắc)
...
Head 12: Focus vào context (background)
```

ViT-B: 12 heads × 64 chiều/head = 768 chiều tổng

## 1.3 CLS Token

### Vấn đề

Sau khi xử lý 196 patches qua Transformer, ta có 196 output vectors. Nhưng ta cần **1 vector duy nhất** đại diện cho toàn bộ ảnh.

### Giải pháp: CLS Token

Thêm 1 token đặc biệt ở đầu sequence:

```
Input:  [CLS] [P1] [P2] [P3] ... [P196]
         ↓
    Transformer (12 layers)
         ↓
Output: [CLS'] [P1'] [P2'] [P3'] ... [P196']
         ↑
    Lấy vector này làm đại diện
```

**Tại sao CLS hoạt động?**

CLS không gắn với pixel nào. Qua attention, nó "lắng nghe" tất cả 196 patches và tự học cách tổng hợp thông tin quan trọng nhất.

```
CLS: "Tôi không biết gì, nhưng tôi sẽ hỏi tất cả các patches"
     ↓
Layer 1: CLS attention đến P1, P2, P3...
Layer 2: CLS tinh chỉnh dựa trên layer 1
...
Layer 12: CLS đã "hiểu" toàn bộ ảnh
```

**Trong DINO**: Output CLS của Teacher và Student được so sánh với nhau.

## 1.4 Knowledge Distillation

### Ý tưởng từ Hinton (2015)

Model lớn đã train xong (Teacher) → "dạy" cho model nhỏ (Student)

**Tại sao không chỉ dùng nhãn cứng?**

```
Nhãn cứng:  [1, 0, 0]  = "Đây là mèo"
Nhãn mềm:   [0.8, 0.15, 0.05] = "80% mèo, 15% chó, 5% hổ"
```

Nhãn mềm chứa thông tin hữu ích: "Mèo giống chó hơn giống ô tô"

### Self-Distillation trong DINO

DINO đặc biệt: Teacher và Student **cùng kiến trúc, cùng kích thước**. Teacher không train sẵn mà được tạo từ Student qua EMA.

```
                    ┌─────────────┐
                    │   Student   │
                    └──────┬──────┘
                           │ EMA (copy chậm)
                           ↓
                    ┌─────────────┐
                    │   Teacher   │
                    └─────────────┘
```

---

# Part 2: DINOv1 (2021)

## 2.1 Core Insight: Local → Global

### Ví dụ

Bạn thấy một cái vây cá. Bạn biết đó là con cá, dù chỉ thấy một phần nhỏ.

DINO áp dụng ý tưởng này:
- **Teacher** nhìn toàn bộ ảnh (global crop, >50% ảnh)
- **Student** nhìn một góc nhỏ (local crop, <50% ảnh)
- **Mục tiêu**: Student phải output giống Teacher

```
┌───────────────────┐     ┌─────────┐
│                   │     │ Local   │
│   Global crop     │     │ crop    │
│   (Teacher nhìn)  │     │(Student)│
│                   │     └─────────┘
└───────────────────┘
        ↓                      ↓
   Output: P_t              Output: P_s
        ↓                      ↓
        └──────── Loss ────────┘
           P_s phải ≈ P_t
```

**Tại sao điều này hoạt động?**

Student chỉ thấy cái vây, nhưng phải đoán "đây là cá" (giống Teacher đang thấy cả con cá). Buộc Student phải **hiểu ngữ cảnh**, không chỉ copy pixel.

## 2.2 Kiến Trúc DINO

```
┌──────────────────────────────────────────────────────────────┐
│                         DINO Pipeline                        │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Ảnh gốc                                                     │
│    │                                                         │
│    ├──→ Global crops (2 cái, 224×224) ──→ Teacher ViT       │
│    │                                          │              │
│    │                                     Projection Head     │
│    │                                          │              │
│    │                                     softmax(τ=0.04)     │
│    │                                          │              │
│    │                                         P_t             │
│    │                                          │              │
│    │                      ┌───────────────────┘              │
│    │                      │                                  │
│    │                      ▼                                  │
│    │              Loss = -Σ P_t · log(P_s)                   │
│    │                      ▲                                  │
│    │                      │                                  │
│    │                     P_s                                 │
│    │                      │                                  │
│    │                 softmax(τ=0.1)                          │
│    │                      │                                  │
│    │                Projection Head                          │
│    │                      │                                  │
│    └──→ Local crops (6 cái, 96×96) ───→ Student ViT         │
│                                                              │
│    [EMA: θ_T ← 0.996·θ_T + 0.004·θ_S]                       │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Kiến trúc chi tiết

**Network Structure**: `g = h ∘ f` (backbone f + projection head h)

```
Input Image → ViT Backbone (f) → CLS token → Projection Head (h) → Output
                 │                   │              │
                 │                   │              └─→ 3-layer MLP
                 │                   │                  2048 hidden dim
                 │                   │                  K output dims
                 │                   │                  Weight normalized
                 │                   │                  L2 normalized
                 │                   │
                 │                   └─→ 768-dim (ViT-B)
                 │
                 └─→ 12 Transformer blocks
                     12 attention heads
                     **Hoàn toàn KHÔNG có Batch Normalization**
```

**Đặc điểm quan trọng**:
- **No predictor**: Student và Teacher dùng cùng kiến trúc (khác BYOL)
- **BN-free ViT**: Không dùng Batch Normalization → ổn định hơn
- **Weight normalization**: Áp dụng trên output layer của projection head
- **K = 65,536**: Số prototypes lớn, cho phép học representations phong phú

### Các thành phần chính

| Thành phần | Mô tả | Tham số chi tiết |
|------------|-------|------------------|
| **ViT backbone** | Vision Transformer | ViT-B: 86M params, 12 blocks, 12 heads |
| **Projection head** | MLP 3 layers | 768 → 2048 → 2048 → K (weight normalized) |
| **K (prototypes)** | Số "categories" ẩn | **65,536** dimensions |
| **τ (temperature)** | Độ sắc nét softmax | Teacher: **0.04**, Student: **0.1** |
| **λ (EMA)** | Tỷ lệ giữ Teacher | **0.996 → 1.0** (cosine schedule) |
| **Centering momentum** | Tốc độ cập nhật center | **m = 0.9** |

## 2.3 Loss Function - Công thức chi tiết

### Softmax với Temperature

**Student probability**:
```
P_s(x)[k] = exp(g_θs(x)[k] / τ_s) / Σ_k' exp(g_θs(x)[k'] / τ_s)
```

**Teacher probability** (với centering):
```
P_t(x)[k] = exp((g_θt(x)[k] - c[k]) / τ_t) / Σ_k' exp((g_θt(x)[k'] - c[k']) / τ_t)
```

**Cross-Entropy Loss**:
```
L = -Σ_k P_t(x)[k] · log P_s(x')[k]
```

Trong đó:
- `x` = global crop (Teacher nhìn)
- `x'` = local hoặc global crop (Student nhìn)
- `g_θ` = projection head output (K dimensions)
- `c` = running mean center
- `τ_t = 0.04`, `τ_s = 0.1`

### Trực quan

```
Teacher output (τ=0.04):    Student output (τ=0.1):
[0.95, 0.02, 0.01, ...]    [0.60, 0.20, 0.10, ...]
       ↓                           ↓
    Rất sắc                    Mềm hơn
    (confident)               (uncertain)
```

Student được phép "mềm" hơn, nhưng phải học theo hướng của Teacher.

## 2.4 EMA: Exponential Moving Average

### Công thức

```
θ_T ← λ · θ_T + (1-λ) · θ_S
```

**Cosine Schedule**:
```
λ(t) = 1 - (1 - λ_base) × (1 + cos(πt/T)) / 2

λ_base = 0.996
t = current step
T = total steps
```

Với λ_base = 0.996:
- **Bắt đầu**: λ ≈ 0.996 (Teacher cập nhật 0.4% từ Student mỗi step)
- **Kết thúc**: λ → 1.0 (Teacher gần như đóng băng)

### Tại sao cần EMA?

**Vấn đề**: Nếu cả Teacher và Student cùng train bằng gradient:
- Cả hai đuổi theo nhau
- Cuối cùng mọi ảnh → cùng 1 output (collapse)

**Giải pháp**: Teacher thay đổi cực chậm
- Teacher ổn định → Student có mục tiêu rõ ràng
- Như thầy giáo kinh nghiệm: không đổi ý kiến theo từng câu hỏi

### Key Insight từ Paper: Teacher > Student

**Quan sát quan trọng**: Teacher performance **tốt hơn** Student trong suốt quá trình training!

```
Training Progress:
Step        Student Acc    Teacher Acc
10K         45%            52%
50K         62%            68%
100K        70%            75%
Final       75%            80.1%  ← Dùng Teacher weights
```

**Tại sao?**
- Polyak-Ruppert averaging: EMA = ensemble của nhiều models
- Teacher = "trung bình" của tất cả Student versions
- Trung bình thường tốt hơn từng cá thể

## 2.4 Multi-crop Strategy

```
Từ 1 ảnh, tạo:
- 2 global crops: 224×224, cover >50% ảnh
- 6 local crops: 96×96, cover <50% ảnh

Teacher: chỉ nhận global crops
Student: nhận cả global và local crops
```

**Chi phí tính toán**:
- Local crop 96² = 9,216 pixels
- Global crop 224² = 50,176 pixels
- 6 local ≈ 1 global về compute

**Kết quả**: 8 góc nhìn khác nhau, chỉ +50% compute so với 2 crops.

## 2.6 Centering và Sharpening - Chống Collapse

### Collapse là gì?

Collapse = mọi ảnh cho ra cùng 1 output. Có 2 loại:

```
Mode Collapse:                    Uniform Collapse:
┌─────────────────┐              ┌─────────────────┐
│       ●         │              │ ● ● ● ● ● ● ● ● │
│      ●●●        │              │ ● ● ● ● ● ● ● ● │
│      ●●●        │              │ ● ● ● ● ● ● ● ● │
│       ●         │              │ ● ● ● ● ● ● ● ● │
└─────────────────┘              └─────────────────┘
Tất cả → 1 điểm                  Trải đều → không phân biệt
```

### Centering - Công thức chi tiết

**Update rule** (mỗi batch):
```
c ← m·c + (1-m) · (1/B) Σᵢ g_θt(xᵢ)

m = 0.9 (momentum)
B = batch size
g_θt(xᵢ) = teacher output cho sample i
```

**Áp dụng vào teacher**:
```
g_t(x) ← g_t(x) - c
```

**Tại sao hoạt động?**
- Trừ mean → zero-centered
- Không cho 1 dimension dominate (tất cả outputs ≈ cùng 1 giá trị)
- Chỉ dùng first-order batch statistics → hoạt động với mọi batch size

**Side effect**: Centering khuyến khích uniform collapse! (mean = 0 cho mọi ảnh)

### Sharpening - Công thức chi tiết

```
τ_teacher = 0.04  (rất thấp → phân bố sắc)
τ_student = 0.1   (cao hơn → phân bố mềm)
```

**Softmax với temperature**:
```
softmax(x/τ) = exp(x/τ) / Σ exp(x/τ)

τ nhỏ → exp(x/τ) lớn → winner-take-all
τ lớn → exp(x/τ) đều → phân bố đều
```

**Ví dụ**:
```
Raw logits: [2.0, 1.5, 1.0, 0.5]

τ = 1.0:  [0.47, 0.28, 0.17, 0.08]  ← mềm
τ = 0.1:  [0.97, 0.02, 0.01, 0.00]  ← sắc (gần one-hot)
τ = 0.04: [0.99, 0.01, 0.00, 0.00]  ← rất sắc
```

### Centering + Sharpening = Balance

| Chỉ có | Hậu quả |
|--------|---------|
| Centering alone | → Uniform collapse (mean=0 nhưng đều) |
| Sharpening alone | → Mode collapse (1 dimension dominate) |
| **Cả hai** | **Ổn định**: peaked nhưng diverse |

### Ablation từ Paper

| Setting | ImageNet | Status |
|---------|----------|--------|
| Full DINO | **80.1%** | ✓ Ổn định |
| Bỏ EMA (train cả Teacher) | — | ✗ Collapse ngay |
| Bỏ Centering | — | ✗ Collapse epoch 1 |
| Bỏ Sharpening (τ_t = τ_s = 0.1) | — | ✗ Collapse chậm |
| Bỏ Multi-crop | 72.3% | ✓ Ổn định nhưng kém |

## 2.6 Emerging Properties

### Attention Map Tự Segment

Phát hiện bất ngờ: attention heads tự học cách tách vật thể khỏi nền.

```
Head 1: Focus vào đầu con chó
Head 2: Focus vào thân con chó
Head 3: Focus vào nền (cỏ, trời)
```

**Tại sao xảy ra?**
- Supervised: Chỉ cần biết "đây là chó" → không cần hiểu đâu là đầu
- DINO: So sánh local/global crop → buộc phải hiểu vùng nào quan trọng

### Kết quả v1

| Model | ImageNet Linear Probe |
|-------|----------------------|
| ViT-S/8 | 79.7% |
| ViT-B/8 | **80.1%** |
| ResNet-50 (DINO) | 75.3% |
| ResNet-50 (Supervised) | 76.5% |

**Milestone**: Lần đầu self-supervised vượt supervised!

---

# Part 3: DINOv2 (2023)

## 3.1 Motivation: 4 Hạn Chế của v1

| Hạn chế v1 | Giải pháp v2 |
|------------|--------------|
| Data nhỏ (1.28M) | LVD-142M (×110) |
| Model nhỏ (86M) | ViT-g (1.1B, ×13) |
| Chỉ classification | Dense tasks (seg, depth) |
| Chỉ DINO loss | DINO + iBOT + KoLeo |

## 3.2 LVD-142M: Data Curation Pipeline Chi Tiết

### Pipeline với số liệu cụ thể

```
┌─────────────────────────────────────────────────────────────────┐
│                     DATA CURATION PIPELINE                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1.2B raw images (web crawl)                                    │
│         │                                                        │
│         ▼  Safety filtering                                      │
│         │  • NSFW classifier                                     │
│         │  • Restricted domains blacklist                        │
│         │                                                        │
│  1.1B images                                                     │
│         │                                                        │
│         ▼  PCA hash deduplication                                │
│         │  • Exact & near-exact duplicates                       │
│         │                                                        │
│  744M images                                                     │
│         │                                                        │
│         ▼  Copy-detection deduplication                          │
│         │  • SSCD model (Self-Supervised Copy Detection)         │
│         │  • Cosine similarity > 0.6                             │
│         │  • k=64 nearest neighbors checked                      │
│         │                                                        │
│         ▼  Benchmark leak removal                                │
│         │  • Remove images similar to test sets                  │
│         │  • Cosine similarity > 0.45                            │
│         │                                                        │
│         ▼  Self-supervised retrieval                             │
│         │  • ViT-H/16 pretrained features                        │
│         │  • k-means: 100,000 clusters                           │
│         │  • Sample from each cluster                            │
│         │                                                        │
│  142M curated images (LVD-142M)                                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

Implementation: Faiss library, GPU-accelerated
Hardware: 20 nodes × 8 V100 GPUs
```

### Key insight: Quality > Quantity

| Dataset | Size | ImageNet Linear | ADE20k mIoU |
|---------|------|-----------------|-------------|
| Raw uncurated | 1.2B | 84.2% | 46.3 |
| **LVD-142M** | **142M** | **86.5%** | **49.0** |
| Ratio | ×0.12 | +2.3% | +2.7 |

**Ít hơn 8× nhưng tốt hơn trên TẤT CẢ benchmarks!**

**Tại sao?**
```
Raw 1.2B data problems:          Curated 142M:
┌────────────────────┐          ┌────────────────────┐
│ ●●●●●●●●●●●● (dupes)│          │ ● ● ● ● ● ● ●      │
│ NSFW content       │    →      │ Clean, diverse     │
│ Logos, watermarks  │          │ Balanced classes   │
│ Biased distribution│          │ No benchmark leaks │
└────────────────────┘          └────────────────────┘
```

## 3.3 Three Losses - Chi tiết công thức

### DINO Loss (kế thừa từ v1)

```
L_DINO = -Σ_k P_t(x)[k] · log P_s(x')[k]
```

Áp dụng trên **CLS token** → hiểu global semantics.

### iBOT Loss - Masked Patch Prediction

**Ý tưởng cốt lõi**: Che patches, dự đoán **semantic token** (không phải pixel).

```
┌─────────────────────────────────────────────────────────────┐
│                         iBOT Architecture                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Student input:    [CLS] [P1] [MASK] [P3] [MASK] [P5] ...   │
│                                 ↓           ↓                │
│  Student predicts:         p_s(i)       p_s(j)              │
│                                 ↓           ↓                │
│                           Cross-entropy loss                 │
│                                 ↑           ↑                │
│  Teacher targets:          p_t(i)       p_t(j)              │
│                                 ↑           ↑                │
│  Teacher input:    [CLS] [P1] [P2]  [P3] [P4]  [P5] ...     │
│                          (FULL image - no masking)           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Công thức**:
```
L_iBOT = -Σᵢ∈M p_t(i) · log(p_s(i))

M = set of masked patch indices
p_t = Sinkhorn-Knopp centered teacher probability
p_s = Student softmax probability
```

**So sánh MAE vs iBOT**:

| Aspect | MAE | iBOT |
|--------|-----|------|
| **Target** | Pixel values (RGB) | Prototype scores from teacher |
| **Loss** | MSE reconstruction | Cross-entropy |
| **Level** | Low-level (texture) | High-level (semantic) |
| **Features** | Requires finetuning | **Works frozen** |
| **Ví dụ** | "Pixel màu xanh" | "Đây là phần tai chó" |

**Tại sao quan trọng?**
- DINO loss: Chỉ hiểu global (CLS token)
- iBOT loss: Hiểu local (từng patch)
- **Cần cả hai** cho dense tasks (segmentation)

**At scale**: UNTIED heads work better (separate DINO and iBOT projection heads)

### KoLeo Loss - Uniform Distribution

**Vấn đề**: Embeddings có thể tụ lại thành clusters → mất đa dạng.

**Công thức** (Kozachenko-Leonenko differential entropy estimator):
```
L_KoLeo = -(1/n) Σᵢ log(d_{n,i})

d_{n,i} = min_{j≠i} ||xᵢ - xⱼ||   (L2 distance to nearest neighbor)
xᵢ = L2-normalized CLS features
```

**Trực quan**:
```
Before KoLeo:          After KoLeo:
    ●●●                    ●      ●
   ●●●●●      →              ●  ●
    ●●●                  ●      ●
(clustering)          (uniformly spread)
```

**Implementation details**:
- Weight: **λ_KoLeo = 0.1**
- Applied on: CLS tokens only
- Global crop: First global crop only
- Gradient: Maximizes distance to nearest neighbor

### Combined Loss

```
L_total = L_DINO + L_iBOT + 0.1 × L_KoLeo
```

| Loss | Target | Purpose | Operates on |
|------|--------|---------|-------------|
| DINO | CLS token | Global semantics | CLS only |
| iBOT | Masked patches | Dense/local features | Patch tokens |
| KoLeo | Batch diversity | Prevent collapse | CLS only |

### Ablation Results

| Bỏ loss nào? | ImageNet Linear | ADE20k mIoU | Δ mIoU |
|--------------|-----------------|-------------|--------|
| **Full (baseline)** | **86.5%** | **49.0** | — |
| Bỏ iBOT | 86.3% | 44.8 | **−4.2** |
| Bỏ KoLeo | 86.0% | 48.5 | −0.5 |
| Bỏ cả iBOT+KoLeo | 85.8% | 42.1 | −6.9 |

**Key insight**: iBOT quan trọng nhất cho dense tasks!

## 3.4 Register Tokens

### Vấn đề: Attention Artifacts

Khi scale ViT lên lớn + high resolution:
- Một số positions nhận attention không hợp lý
- Attention map có "vùng chết"

### Giải pháp

Thêm 4-8 learnable tokens (không gắn với patch nào):

```
[CLS] [REG1] [REG2] [REG3] [REG4] [P1] [P2] ... [P196]
       ↑      ↑      ↑      ↑
    "Parking spots" cho extra attention
```

Register tokens đóng vai trò "bãi đỗ" — hút attention thừa, làm sạch attention map cho các patches thật.

## 3.5 Model Scaling

### ViT Variants

| Model | Params | Blocks | Embed Dim | FFN | Heads |
|-------|--------|--------|-----------|-----|-------|
| ViT-S/14 | 22M | 12 | 384 | MLP | 6 |
| ViT-B/14 | 86M | 12 | 768 | MLP | 12 |
| ViT-L/14 | 307M | 24 | 1024 | MLP | 16 |
| **ViT-g/14** | **1.1B** | **40** | **1536** | **SwiGLU** | **24** |

### Patch Size: 14 vs 16

| Patch | Resolution | Patches | Compute | Detail |
|-------|------------|---------|---------|--------|
| /16 | 224×224 | 196 | Lower | Less |
| **/14** | 224×224 | **256** | **Higher** | **More** |

DINOv2 chọn **/14** để có độ phân giải cao hơn cho dense tasks.

## 3.6 Kết Quả v2

### So sánh với các phương pháp khác

| Benchmark | DINOv2 (ViT-g) | iBOT | MAE | OpenCLIP |
|-----------|----------------|------|-----|----------|
| ImageNet Linear | **86.5%** | 82.3% | 73.5% | 83.5% |
| ADE20k mIoU (frozen) | **49.0** | 44.8 | — | — |
| ADE20k mIoU (Mask2Former) | **60.2** | — | — | — |
| Oxford Retrieval mAP | **+41%** | baseline | — | — |

### Scaling Law

| Model | Params | ImageNet | ADE20k |
|-------|--------|----------|--------|
| ViT-S | 22M | 81.1% | 42.5 |
| ViT-B | 86M | 84.5% | 45.8 |
| ViT-L | 307M | 86.3% | 48.2 |
| **ViT-g** | **1.1B** | **86.5%** | **49.0** |

**DINOv2 = Foundation model cho vision**
- 1 backbone dùng cho nhiều tasks
- **Không cần fine-tune** (frozen features)
- Vượt tất cả phương pháp SSL khác

---

# Part 4: DINOv3 (2025)

## 4.1 Scaling Challenge - Không Phải Divergence!

### Scale

| Aspect | v2 | v3 | Scale |
|--------|-----|-----|-------|
| Model | 1.1B | **6.7B** | ×6 |
| Data | 142M | **1.69B** | ×12 |

### Vấn đề thực sự: Dense Feature DEGRADATION

**KHÔNG phải** divergence hay loss explosion thông thường!

```
┌─────────────────────────────────────────────────────────────┐
│                  THE REAL PROBLEM                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Segmentation Performance (ADE20k mIoU):                    │
│                                                              │
│  mIoU ↑                                                      │
│   50 │        ●●●●                                          │
│   45 │      ●      ●●                                       │
│   40 │    ●            ●●                                   │
│   35 │  ●                  ●●●●●●                           │
│   30 │●                              ●●●●●                  │
│      └─────────────────────────────────────→ Training steps │
│         0     100k   200k   300k   400k   500k              │
│                  ↑                                           │
│           PEAK at ~200k, then DECLINES!                     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Nguyên nhân**:
1. CLS token và patch outputs trở nên **quá giống nhau**
2. Patches "sụp đổ" về phía global summary (CLS)
3. Mất **local specificity** → dense tasks suffer
4. DINO global loss **dominate** over iBOT patch-level loss

**Key insight**: Problem không phải training không hội tụ, mà là **hội tụ sai**!

## 4.2 Gram Anchoring - Derivation Chi Tiết

### Gram Matrix là gì?

**Định nghĩa**:
```
Cho X = P × d matrix (P patches, d dimensions)
Mỗi hàng = 1 patch feature (L2-normalized)

G = X · Xᵀ   (P × P matrix)

G[i,j] = cos_sim(patch_i, patch_j)
       = <xᵢ, xⱼ>  (vì đã L2-normalized)
```

**Trực quan**:
```
Feature matrix X:              Gram matrix G:
┌─────────────────┐           ┌─────────────────┐
│ patch1 features │           │ 1.0  0.8  0.3 ..│  ← patch1 sim với tất cả
│ patch2 features │    →      │ 0.8  1.0  0.5 ..│  ← patch2 sim với tất cả
│ patch3 features │           │ 0.3  0.5  1.0 ..│
│ ...             │           │ ...             │
└─────────────────┘           └─────────────────┘
    P × d                          P × P
                              (pairwise similarities)
```

### Gram Anchoring Loss

```
X_S = Student patch features (P × d, L2-normalized)
X_G = Gram teacher patch features (P × d, L2-normalized)

L_Gram = ||X_S · X_Sᵀ - X_G · X_Gᵀ||²_F

       = ||G_student - G_anchor||²_F
```

**Gram Teacher**: Checkpoint từ **200k iterations** (khi dense features tốt nhất)

### Tại sao Gram Anchoring hoạt động?

**Key Insight**: Constrain **similarity structure**, NOT specific values!

```
┌───────────────────────────────────────────────────────────┐
│  What Gram Loss ALLOWS:                                    │
│  • Feature rotation                                        │
│  • Feature scaling                                         │
│  • Feature translation                                     │
│                                                            │
│  What Gram Loss PRESERVES:                                 │
│  • Pairwise similarities                                   │
│  • Relative geometry                                       │
│  • "patch_eye similar to patch_ear more than patch_sky"   │
└───────────────────────────────────────────────────────────┘
```

### High-Resolution Gram (L_HRef)

```
┌─────────────────────────────────────────────────────────────┐
│                    HIGH-RES GRAM                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Input: 224×224                Input: 448×448 (2×)          │
│       ↓                             ↓                        │
│  Student ViT                   Gram Teacher ViT              │
│       ↓                             ↓                        │
│  14×14 feature map            28×28 feature map             │
│       ↓                             ↓                        │
│       │                      Bicubic downsample             │
│       │                             ↓                        │
│       │                       14×14 feature map             │
│       │                             │                        │
│       └─────── L_Gram Loss ─────────┘                       │
│                                                              │
└─────────────────────────────────────────────────────────────┘

Gain: +2 mIoU on ADE20k (high-res details!)
```

### Refinement Loss

```
L_Ref = w_D × L_DINO + L_iBOT + w_DK × L_DKoleo + w_Gram × L_Gram

w_Gram = 2.0
```

### Ablation

| Setting | ADE20k mIoU | Status |
|---------|-------------|--------|
| Without Gram Anchoring | Peaks at 200k, then **degrades** | ✗ |
| With Gram Anchoring | **Stable improvement** to 1M+ steps | ✓ |
| + High-Res Gram | **+2 mIoU** additional | ✓✓ |

**Effect is almost immediate**: Improvements within 10k iterations!

## 4.3 Text Alignment vs CLIP

### So sánh chi tiết

| Aspect | CLIP | DINOv3 |
|--------|------|--------|
| **Vision encoder** | Trained jointly with text | **FROZEN** (pretrained DINO) |
| **What's trained** | Both encoders | Text encoder + 2 adapter layers |
| **Features used** | CLS only | **CLS + mean-pooled patches** |
| **Dense capability** | Poor | **Excellent** |
| **Data needed** | 400M image-text pairs | Images only, text optional |
| **Vision bias** | Biased toward text | Pure visual |

### DINOv3 Two-Phase Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                   DECOUPLED TRAINING                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Phase 1: Pure Visual Learning                               │
│  ┌─────────────┐                                             │
│  │ DINO + iBOT │  ← No text, no language bias               │
│  │ + KoLeo     │  ← Pure visual understanding                │
│  │ + Gram      │                                             │
│  └─────────────┘                                             │
│         ↓                                                    │
│         ↓  FREEZE vision encoder                            │
│         ↓                                                    │
│  Phase 2: Text Alignment                                     │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Frozen DINO ViT → CLS + patch_mean → Adapter →     │    │
│  │                                           ↓          │    │
│  │  Text Encoder → Text embed → Contrastive Loss       │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  "Learn to see first, learn to talk later"                  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Ưu điểm**:
- Vision features = **pure visual understanding**
- Thêm text **không làm hỏng** vision performance
- Dense features **preserved** (CLIP loses them)

## 4.4 ViT-7B Architecture

### So sánh với DINOv2

| | DINOv2 (ViT-g) | DINOv3 (ViT-7B) |
|---|----------------|-----------------|
| **Parameters** | 1.1B | **6.7B** |
| **Patch size** | 14 | **16** |
| **Position embed** | Learnable | **Axial RoPE** |
| **Embed dimension** | 1536 | **4096** |
| **Blocks** | 40 | **48** |
| **FFN** | SwiGLU | SwiGLU |
| **Prototypes (DINO)** | 128k | **256k** |
| **Prototypes (iBOT)** | 128k | **96k** |

### Axial RoPE (Rotary Position Embedding)

```
Standard positional embedding:    Axial RoPE:
┌─────────────────────────┐      ┌─────────────────────────┐
│ Learned 2D grid         │      │ Factorized: row × col   │
│ Fixed resolution        │  →   │ Extrapolates to any res │
│ Doesn't generalize      │      │ Rotation-based          │
└─────────────────────────┘      └─────────────────────────┘
```

**Ưu điểm**: Generalizes to higher resolutions without retraining!

## 4.5 Training Details

### Hardware & Compute

| Resource | Value |
|----------|-------|
| GPUs | **256 × H100** |
| GPU Hours | **61,440** |
| CO2 Emission | ~18 tCO2eq |
| Training time | ~10 days |

### Hyperparameters

| Parameter | Value |
|-----------|-------|
| Learning rate | **0.0004** (constant, no cosine) |
| Batch size | **4096** images |
| Crops per image | 2 global + 8 local |
| Total crops | 40,960 crops/step |

### Dataset: LVD-1689M

```
Source: 17B Instagram images
    ↓  Safety + dedup + curation
LVD-1689M (×12 larger than v2)
```

| Dataset | Size | Source |
|---------|------|--------|
| LVD-142M (v2) | 142M | Web crawl |
| **LVD-1689M (v3)** | **1.69B** | **Instagram** |

## 4.6 Kết Quả DINOv3

### So sánh với DINOv2

| Benchmark | DINOv2 (ViT-g) | DINOv3 (ViT-7B) | Δ |
|-----------|----------------|-----------------|-----|
| ImageNet Linear | 86.5% | **88.4%** | +1.9 |
| ADE20k mIoU (linear) | 49.0 | **55.9** | **+6.9** |
| ADE20k mIoU (full) | 60.2 | **63.0** | +2.8 |
| COCO Detection mAP | 62.5 | **66.1** | +3.6 |
| DAVIS Tracking J&F | 76.6 | **83.3** | **+6.7** |
| ObjectNet | 66.0 | **79.0** | **+13.0** |

### Key Insight: Scaling Benefits Dense Tasks Most

```
┌────────────────────────────────────────────────────────────┐
│              WHERE SCALING HELPS MOST                       │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  Task           v2 → v3    Improvement                     │
│  ─────────────────────────────────────────                 │
│  Classification  86.5 → 88.4   +1.9%  ← Near saturation   │
│  Segmentation    49.0 → 55.9   +6.9   ← BIG GAIN          │
│  Video Tracking  76.6 → 83.3   +6.7   ← BIG GAIN          │
│  ObjectNet       66.0 → 79.0   +13.0  ← HUGE GAIN         │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

**Tại sao?**
- **Classification**: Gần bão hòa (88% → khó tăng thêm)
- **Segmentation**: Cần hiểu từng pixel → scale giúp nhiều
- **Video/Tracking**: Temporal understanding → scale giúp nhiều
- **ObjectNet**: Out-of-distribution → cần representations tốt hơn

### DINOv3 = First SSL at Weakly-Supervised Parity

```
ImageNet Accuracy:
┌────────────────────────────────────────────────┐
│                                                 │
│  Supervised (labels):           85.7%          │
│  Weakly-supervised (hashtags):  88.5%          │
│  DINOv3 (NO labels):           88.4%  ← WOW!  │
│                                                 │
└────────────────────────────────────────────────┘
```

### Hướng đi tương lai

**Không cần scale classification nữa**. Focus vào:
- Dense prediction (segmentation, depth)
- Video understanding
- 3D vision
- Multimodal (with preserved dense features)

---

# Appendices

## A. Vietnamese Glossary

| English | Vietnamese | Định nghĩa |
|---------|------------|------------|
| Attention | Cơ chế chú ý | Cách model quyết định nên "nhìn" vào đâu |
| Attention head | Đầu attention | Một góc nhìn độc lập trong multi-head attention |
| CLS token | Token phân loại | Vector đại diện cho toàn bộ ảnh |
| Collapse | Sụp đổ | Lỗi khi mọi ảnh cho ra cùng output |
| Contrastive | Tương phản | Phương pháp kéo giống gần, đẩy khác xa |
| Cross-entropy | Entropy chéo | Loss đo sự khác biệt giữa 2 phân bố |
| Dense prediction | Dự đoán dày | Dự đoán cho từng pixel (segmentation, depth) |
| Distillation | Chưng cất | Chuyển tri thức từ model lớn sang nhỏ |
| Embedding | Nhúng / Vector đặc trưng | Biểu diễn dữ liệu dưới dạng vector số |
| EMA | Trung bình động | Cách cập nhật Teacher từ Student |
| Foundation model | Model nền tảng | Model pretrained dùng cho nhiều tasks |
| Gram matrix | Ma trận Gram | FFᵀ, đo tương quan giữa features |
| iBOT | iBOT | Masked prediction ở mức semantic |
| KoLeo | KoLeo | Regularization đẩy embeddings trải đều |
| Linear probe | Đầu tuyến tính | Chỉ train 1 layer linear trên frozen features |
| mIoU | mIoU | Mean Intersection over Union (đo segmentation) |
| Multi-crop | Cắt nhiều góc | Tạo nhiều views từ 1 ảnh |
| Patch | Mảnh | Một phần nhỏ của ảnh (16×16 pixels) |
| Positional encoding | Mã hóa vị trí | Cho model biết patch ở đâu |
| Projection head | Đầu chiếu | MLP sau ViT, chuyển đổi features |
| Register token | Token đăng ký | Learnable tokens để "hút" extra attention |
| Self-supervised | Tự giám sát | Học không cần nhãn người gán |
| Sharpening | Làm sắc | Dùng temperature thấp cho phân bố sắc nét |
| Softmax | Softmax | Chuyển số thô thành xác suất (tổng = 1) |
| Temperature | Nhiệt độ | Kiểm soát độ sắc/mềm của phân bố |
| Transformer | Transformer | Kiến trúc dùng attention |
| ViT | Vision Transformer | Transformer cho ảnh |

## B. Math Notation Reference

| Notation | Meaning |
|----------|---------|
| θ_T, θ_S | Parameters của Teacher, Student |
| P_t, P_s | Output probability của Teacher, Student |
| τ | Temperature (τ_t=0.04, τ_s=0.1) |
| λ | EMA coefficient (0.996 → 1.0) |
| K | Số prototypes (65,536 trong v1, 256k trong v3) |
| d | Dimension (768 trong ViT-B, 4096 trong ViT-7B) |
| Q, K, V | Query, Key, Value trong attention |
| G | Gram matrix (G = X·Xᵀ) |
| L | Loss function |
| c | Centering vector (running mean) |
| m | Centering momentum (0.9) |
| M | Set of masked patch indices (iBOT) |
| d_{n,i} | Distance to nearest neighbor (KoLeo) |
| X_S, X_G | Student/Gram teacher features |
| P | Number of patches |
| B | Batch size |

## C. Further Reading

### Papers
1. Caron et al. ICCV 2021 — DINOv1
2. Oquab et al. TMLR 2024 — DINOv2
3. Siméoni et al. arXiv 2025 — DINOv3
4. Dosovitskiy et al. ICLR 2021 — ViT
5. Hinton et al. arXiv 2015 — Knowledge Distillation
6. Zhou et al. ICLR 2022 — iBOT
7. Darcet et al. ICLR 2024 — Register Tokens

### Code
- DINOv2: https://github.com/facebookresearch/dinov2
- ViT: https://github.com/google-research/vision_transformer

---

*Tài liệu này được thiết kế cho CS students có ML cơ bản. Mọi concept đều có ví dụ trước, lý thuyết sau.*
