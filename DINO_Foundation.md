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

### Các thành phần chính

| Thành phần | Mô tả | Tham số |
|------------|-------|---------|
| **ViT backbone** | Vision Transformer | ViT-B: 86M params |
| **Projection head** | MLP 3 layers | 768 → 2048 → 2048 → K |
| **K (prototypes)** | Số "categories" ẩn | 65,536 |
| **τ (temperature)** | Độ sắc nét softmax | Teacher: 0.04, Student: 0.1 |
| **λ (EMA)** | Tỷ lệ giữ Teacher | 0.996 → 1.0 |

## 2.3 EMA: Exponential Moving Average

### Công thức

```
θ_T ← λ · θ_T + (1-λ) · θ_S
```

Với λ = 0.996:
- Teacher giữ 99.6% giá trị cũ
- Teacher lấy 0.4% từ Student

### Tại sao cần EMA?

**Vấn đề**: Nếu cả Teacher và Student cùng train bằng gradient:
- Cả hai đuổi theo nhau
- Cuối cùng mọi ảnh → cùng 1 output (collapse)

**Giải pháp**: Teacher thay đổi cực chậm
- Teacher ổn định → Student có mục tiêu rõ ràng
- Như thầy giáo kinh nghiệm: không đổi ý kiến theo từng câu hỏi

### Cosine Schedule

λ tăng từ 0.996 → 1.0 theo cosine schedule:
- Đầu training: Teacher học nhanh hơn (0.996)
- Cuối training: Teacher gần như không đổi (≈1.0)

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

## 2.5 Centering và Sharpening

### Collapse là gì?

Collapse = mọi ảnh cho ra cùng 1 output

Có 2 loại:
1. **Mode collapse**: Tất cả output = 1 vector cố định
2. **Uniform collapse**: Tất cả output = phân bố đều [1/K, 1/K, ...]

### Centering (chống mode collapse)

```
g(x) = f(x) - c
```

Trong đó c là running mean của output Teacher:
```
c ← m · c + (1-m) · mean(f(x))  (m = 0.9)
```

Trừ đi mean → không cho 1 chiều dominate.

### Sharpening (chống uniform collapse)

Temperature τ = 0.04 rất thấp:
- Softmax output gần one-hot
- Teacher buộc phải "chọn" rõ ràng

```
Không sharpening: [0.2, 0.2, 0.2, 0.2, 0.2] → Teacher nói "không biết"
Có sharpening:    [0.9, 0.03, 0.03, 0.02, 0.02] → Teacher nói "đây!"
```

### Ablation

| Setting | Kết quả |
|---------|---------|
| Bỏ centering | Collapse sau 1 epoch |
| Bỏ sharpening | Collapse chậm hơn, vẫn xảy ra |
| Cả hai | Ổn định |

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

## 3.2 LVD-142M: Data Curation

### Pipeline

```
Crawl 1.2B ảnh từ internet
         │
         ▼
    Lọc NSFW, low-quality
         │
         ▼
    Loại trùng bằng SSCD
    (Self-Supervised Copy Detection)
         │
         ▼
    Chọn qua Faiss nearest neighbor
    (embed ảnh, so với ImageNet embedding)
         │
         ▼
    142M ảnh curated
```

### Key insight: Quality > Quantity

| Data | ImageNet Linear |
|------|-----------------|
| Raw 1.2B | 84.2% |
| Curated 142M | **86.5%** |

Ít hơn 8 lần nhưng kết quả tốt hơn!

**Tại sao?**
- Raw data: trùng lặp, NSFW, logo, watermark, phân bố lệch
- Curated: đa dạng, sạch, cân bằng

## 3.3 Three Losses

### DINO Loss (kế thừa từ v1)

```
L_DINO = -Σ P_t · log(P_s)
```

Dùng CLS token → hiểu toàn cục.

### iBOT Loss (mới)

**Ý tưởng**: Che một số patches, bắt Student đoán token từ Teacher.

```
Input:     [CLS] [P1] [MASK] [P3] [MASK] [P5] ...
                       ↓           ↓
                  Đoán token    Đoán token
                  từ Teacher    từ Teacher
```

**Khác MAE thế nào?**

| Aspect | MAE | iBOT |
|--------|-----|------|
| Đoán gì? | Pixel RGB | Semantic token |
| Level | Low-level | High-level |
| Ví dụ | "Pixel màu xanh" | "Đây là phần tai" |

**Tại sao quan trọng?**
- DINO loss: Chỉ hiểu global (CLS)
- iBOT loss: Hiểu local (từng patch)
- Cần cả hai cho dense tasks (segmentation)

### KoLeo Loss (mới)

**Vấn đề**: Embeddings có thể tụ lại thành clusters → mất đa dạng.

**Giải pháp**: Đẩy nearest neighbors ra xa.

```
L_KoLeo = -1/n Σᵢ log(min_{j≠i} ||zᵢ - zⱼ||)
```

**Trực quan**:
```
Before KoLeo:          After KoLeo:
    ●●●                    ●      ●
   ●●●●●      →              ●  ●
    ●●●                  ●      ●
(tụ lại)              (trải đều)
```

### Ablation

| Bỏ loss nào? | ImageNet | ADE20k (seg) |
|--------------|----------|--------------|
| Baseline | 86.5% | 49.0 |
| Bỏ iBOT | 86.3% | **44.8** (−4.2) |
| Bỏ KoLeo | 86.0% | 48.5 |

iBOT quan trọng nhất cho dense tasks!

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

## 3.5 Kết Quả v2

| Benchmark | DINOv2 | iBOT | MAE | OpenCLIP |
|-----------|--------|------|-----|----------|
| ImageNet | **86.5%** | 82.3% | 73.5% | 83.5% |
| ADE20k | **49.0** | 44.8 | — | — |

**DINOv2 = Foundation model cho vision**
- 1 backbone dùng cho nhiều tasks
- Không cần fine-tune (frozen features)
- Vượt tất cả phương pháp khác

---

# Part 4: DINOv3 (2025)

## 4.1 Scaling Challenges

### Câu hỏi: Scale có giới hạn không?

| Aspect | v2 | v3 | Scale |
|--------|-----|-----|-------|
| Model | 1.1B | 7B | ×6.4 |
| Data | 142M | 1.69B | ×12 |

### Vấn đề: Training Instability

Model 7B params không dễ train:
- Loss bùng nổ (explode)
- Gradient không ổn định
- Diverge sau vài nghìn steps

## 4.2 Gram Anchoring

### Gram Matrix là gì?

Cho feature matrix F (mỗi cột là 1 feature):

```
G = F × Fᵀ
```

G[i,j] = dot product giữa feature i và feature j = **correlation**

```
Feature matrix F:          Gram matrix G:
┌─────────────────┐        ┌─────────────────┐
│ f1  f2  f3  f4  │        │ f1·f1  f1·f2 ...│
│ │   │   │   │   │   →    │ f2·f1  f2·f2 ...│
│ │   │   │   │   │        │ ...           │
└─────────────────┘        └─────────────────┘
```

### Tại sao Gram Anchoring ổn định training?

**Vấn đề**: Model lớn → features thay đổi nhanh → correlation thay đổi nhanh → unstable

**Giải pháp**: Enforce G_student ≈ G_teacher

```
L_Gram = ||G_student - G_teacher||²
```

Giữ cấu trúc correlation ổn định, features không "chạy lung tung".

### Ablation

| Setting | Kết quả |
|---------|---------|
| Without Gram Anchoring | Diverge at ~5K steps |
| With Gram Anchoring | Stable to 1M+ steps |

## 4.3 Text Alignment vs CLIP

### So sánh hai approaches

| Aspect | CLIP | DINOv3 |
|--------|------|--------|
| Training | Joint (vision+text cùng lúc) | Decoupled (vision trước, text sau) |
| Data | 400M image-text pairs | Images only, text optional |
| Vision bias | Bias về text | Pure visual |
| Khi thêm text | — | Không làm hỏng vision |

### DINOv3 Strategy

```
Phase 1: Train vision encoder (DINO)
              ↓
Phase 2: Freeze vision, train text alignment
              ↓
         Shared embedding space
```

**Ưu điểm**:
- Vision features học pure visual understanding
- Thêm text không ảnh hưởng vision performance
- "Learn to see first, learn to talk later"

## 4.4 When Does Scaling Help?

### Kết quả

| Benchmark | v2 | v3 | Δ |
|-----------|-----|-----|-----|
| ImageNet | 86.5% | 88.4% | +1.9 |
| ADE20k | 49.0 | 55.9 | **+6.9** |
| DAVIS | 76.6 | 83.3 | **+6.7** |

### Key Insight

**Dense tasks được lợi nhiều nhất từ scaling!**

- Classification: Gần bão hòa (88% → khó tăng thêm)
- Segmentation: Cần hiểu từng pixel → scale giúp nhiều
- Video: Temporal understanding → scale giúp nhiều

### Hướng đi tương lai

Không cần scale classification nữa. Focus vào:
- Dense prediction (segmentation, depth)
- Video understanding
- 3D vision
- Multimodal

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
| τ | Temperature |
| λ | EMA coefficient |
| K | Số prototypes (65,536 trong DINO) |
| d | Dimension (768 trong ViT-B) |
| Q, K, V | Query, Key, Value trong attention |
| G | Gram matrix |
| L | Loss function |

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
