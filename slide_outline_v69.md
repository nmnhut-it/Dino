# DINO Seminar v6.9 - Master's Class Edition

> **Duration**: 30 minutes (~1.25 min/slide)
> **Audience**: Master's students with ML background (know ViT, loss functions, gradients)
> **Slides**: 24 (rigorous technical depth)
> **Framework**: Problem -> Attempt -> Failure -> Solution (PAFS)
> **Philosophy**: Build DINO from scratch, encounter problems, solve them with mathematical rigor
> **Language**: Vietnamese

---

## Changes from v68

Based on updated DINO_Foundation.md with detailed paper content:
- Added exact loss formulas with all terms (P_s, P_t derivations)
- Added ViT-7B architecture specs (Axial RoPE, 4096 embed dim)
- Clarified dense degradation (NOT divergence - CLS/patch similarity increases)
- Added training details (256 H100, 61k GPU hours)
- Added High-Resolution Gram Loss (L_HRef)
- Enhanced ablation tables with exact numbers

---

## Act 1: Hook & Problem (2 slides, 2.5 min)

### Slide 1: Demo - "Điều này không thể xảy ra"
**Time**: 1 min | **Purpose**: Tạo sự tò mò

**Visual**: Attention maps of the fish (tench) - 3 heads focus on different parts

**Content**:
- Head 1: Focus vào **đầu** (đỏ)
- Head 2: Focus vào **thân + vây** (xanh lá)
- Head 3: Focus vào **nền** (xanh dương)

**Bí ẩn**:
> "Model tự động segment vật thể khỏi nền.
> Nhưng KHÔNG AI dạy nó!
> Không có labels cho 'đây là đầu', 'đây là vây'.
> **Làm sao điều này có thể?**"

**Speaker Notes** (75 words):
Nhìn vào attention maps này. Các heads tự động focus vào các phần khác nhau: đầu, thân, nền. Model như đã "học" được khái niệm "vật thể" và "nền". Nhưng đây là self-supervised - không ai dạy model đâu là đầu, đâu là vây. Model tự học điều này. Hôm nay chúng ta sẽ khám phá: làm thế nào để train một model như vậy?

---

### Slide 2: Mục tiêu - Học từ Ảnh Không Có Nhãn
**Time**: 1.5 min | **Purpose**: Định nghĩa vấn đề rõ ràng

**Visual**:
```
Left: ImageNet pipeline (con người gán nhãn -> $500K -> 2 năm)
Right: Ảnh internet (không giới hạn, miễn phí, không nhãn)
Center: Dấu ? lớn
```

**Content**:

| | Supervised | Mục tiêu của chúng ta |
|---|-----------|----------------------|
| **Data** | 14M ảnh có nhãn | Hàng tỷ ảnh không nhãn |
| **Chi phí** | $500K + 2 năm | $0 |
| **Khả năng mở rộng** | Bottleneck | Không giới hạn |

**Câu hỏi**:
> "Có thể train một model **tốt như** supervised, nhưng **không cần labels** không?"

**Tại sao điều này quan trọng**:
- Dữ liệu không nhãn: Vô hạn (internet)
- Dữ liệu có nhãn: Đắt, chậm, giới hạn
- Nếu giải quyết được -> Scale vô hạn

**Speaker Notes** (75 words):
ImageNet: 14 triệu ảnh, $500K, 2 năm để gán nhãn. Đó là bottleneck lớn nhất của supervised learning. Trong khi đó, ảnh trên internet thì vô hạn và miễn phí - nhưng không có labels. Câu hỏi: có thể train model chỉ dùng ảnh không nhãn, nhưng vẫn đạt chất lượng supervised không? Đây là vấn đề DINO giải quyết.

---

## Act 2: Building DINOv1 (10 slides, 13 min)

### Slide 3: Ý tưởng đầu tiên - Teacher-Student Framework
**Time**: 1 min | **Purpose**: Trực quan ban đầu

**Visual**:
```
Ảnh gốc -> 2 views khác nhau (augmentation)
                    |           |
                 Teacher     Student
                    |           |
                 Output      Output
                    `--- Match? ---'
```

**Trực quan**:
> "Một người nhìn con cá từ bất kỳ góc nào đều biết đó là cá.
> -> Model phải cho **cùng output** cho các views khác nhau."

**Design Choices**:
1. **Tại sao 2 networks?** Không có labels -> cần tự tạo "đáp án"
2. **Vai trò Teacher?** Tạo pseudo-labels (đáp án)
3. **Vai trò Student?** Học dự đoán như Teacher
4. **Loss?** Cross-entropy (chi tiết slide tiếp)

**Nhưng khoan... Có vấn đề!**

**Speaker Notes** (75 words):
Ý tưởng đầu tiên: Dùng 2 networks - Teacher và Student. Từ 1 ảnh, tạo 2 views khác nhau (crop, color jitter...). Teacher xử lý view 1, Student xử lý view 2. Mục tiêu: Student phải dự đoán như Teacher. Trực quan: Nếu 2 views đến từ cùng 1 ảnh, chúng phải có cùng representation. Có lý! Nhưng có một vấn đề nghiêm trọng...

---

### Slide 4: Kiến trúc Network
**Time**: 1.5 min | **Purpose**: Hiểu kiến trúc chính xác

**Visual**:
```
Image -> ViT Backbone (f) -> Features -> Projection Head (h) -> Output
                                                |
                                      3-layer MLP (2048 hidden)
                                                |
                                      K = 65,536 dimensions
                                      (weight normalized)
```

**Network Structure**: `g = h ∘ f`
```
Input Image -> ViT Backbone (f) -> CLS token -> Projection Head (h) -> Output
                 |                   |              |
                 |                   |              `-> 3-layer MLP
                 |                   |                  2048 hidden dim
                 |                   |                  K output dims
                 |                   |                  Weight normalized
                 |                   |                  L2 normalized
                 |                   |
                 |                   `-> 768-dim (ViT-B)
                 |
                 `-> 12 Transformer blocks
                     12 attention heads
                     **KHÔNG có Batch Normalization**
```

**Projection Head Design**:
| Layer | Dimension | Notes |
|-------|-----------|-------|
| Input | d (ViT output) | VD: 768 cho ViT-B |
| Hidden 1 | 2048 | + GELU |
| Hidden 2 | 2048 | + GELU |
| Output | K = 65,536 | Weight normalized |

**Đặc điểm quan trọng**:
- **No predictor** (khác BYOL) -> Student và Teacher cùng kiến trúc
- **No batch normalization** trong ViT -> Toàn bộ hệ thống BN-free
- **Tại sao BN-free quan trọng?** Loại bỏ dependency vào batch statistics

**Speaker Notes** (100 words):
Network g gồm backbone f và projection head h. Backbone là ViT - đây là phần dùng cho downstream tasks. Projection head là 3-layer MLP với hidden dimension 2048, output K=65536 dimensions. Khác với BYOL, không có predictor - Student và Teacher có cùng kiến trúc. Quan trọng: khi dùng ViT, toàn bộ hệ thống không có batch-normalization. Điều này quan trọng vì BN tạo implicit dependencies vào batch statistics, gây vấn đề trong self-supervised learning. Weight normalization trên output layer theo design của SwAV.

---

### Slide 5: Loss Function - Chi tiết
**Time**: 1.5 min | **Purpose**: Hiểu toán học chặt chẽ

**Visual**: Flow diagram showing softmax with temperature

**Loss Function**:
```
L = -Σₖ P_t(x)[k] · log P_s(x')[k]
```

**Student Probability** (standard softmax):
```
P_s(x')[k] = exp(g_θs(x')[k] / τ_s) / Σ_{k'} exp(g_θs(x')[k'] / τ_s)

với τ_s = 0.1 (student temperature)
```

**Teacher Probability** (với centering):
```
P_t(x)[k] = exp((g_θt(x)[k] - c[k]) / τ_t) / Σ_{k'} exp((g_θt(x)[k'] - c[k']) / τ_t)

với τ_t = 0.04 (teacher temperature)
     c = centering vector (giải thích Slide 8)
```

**Trực quan**:
```
Teacher output (τ=0.04):    Student output (τ=0.1):
[0.95, 0.02, 0.01, ...]    [0.60, 0.20, 0.10, ...]
       |                           |
    Rất sắc                    Mềm hơn
    (confident)               (uncertain)
```

**Tại sao Cross-Entropy?**
- Đo divergence giữa hai phân bố
- Minimize -> Student distribution tiến đến Teacher distribution
- Asymmetric: Teacher là "target", Student là "prediction"

**Speaker Notes** (100 words):
Loss là cross-entropy giữa Teacher và Student outputs. Nhưng chú ý chi tiết: Student dùng softmax tiêu chuẩn với temperature τ_s = 0.1. Teacher dùng softmax với centering (trừ c) và temperature τ_t = 0.04. Tại sao temperatures khác nhau? Sẽ thấy ở Slide 9. Tại sao centering? Slide 8. Output K=65536 có thể hiểu như soft assignment đến K prototypes - tương tự clustering nhưng differentiable. Cross-entropy đảm bảo Student học produce cùng "cluster assignment" như Teacher cho cùng image viewed differently.

---

### Slide 6: Vấn đề Collapse
**Time**: 1.5 min | **Purpose**: Hiểu tại sao naive approach fails

**Visual**:
```
Mode Collapse:                    Uniform Collapse:
┌─────────────────┐              ┌─────────────────┐
│       ●         │              │ ● ● ● ● ● ● ● ● │
│      ●●●        │              │ ● ● ● ● ● ● ● ● │
│      ●●●        │              │ ● ● ● ● ● ● ● ● │
│       ●         │              │ ● ● ● ● ● ● ● ● │
└─────────────────┘              └─────────────────┘
Tất cả -> 1 điểm                  Trải đều -> không phân biệt
```

**Tại sao điều này xảy ra?**

| Loại Collapse | Nguyên nhân | Kết quả |
|--------------|-------------|---------|
| **Mode Collapse** | Teacher và Student "âm mưu" output một giá trị | Loss = 0, nhưng vô nghĩa |
| **Uniform Collapse** | Output trải đều, không phân biệt | Loss thấp, nhưng vô dụng |

**Dilemma**:
> "Không labels -> Không gì **ngăn cản** Teacher output constant.
> Teacher output constant -> Student học constant -> Loss = 0.
> **Model đã học được gì? Không gì cả!**"

**Các phương pháp khác giải quyết thế nào**:
- **Contrastive (SimCLR, MoCo)**: Negative samples (nhưng cần batch lớn 4096+)
- **Clustering (SwAV)**: Sinkhorn-Knopp (nhưng tính toán nặng)
- **DINO's approach**: Không cần negatives! -> Làm thế nào?

**Speaker Notes** (100 words):
Đây là vấn đề lớn nhất trong self-supervised learning: collapse. Mode collapse: Teacher và Student "âm mưu" - cả hai output cùng một vector cho TẤT CẢ ảnh. Loss = 0, nhưng model không học được gì. Uniform collapse: Output trải đều như phân bố uniform - cũng vô nghĩa.

Contrastive learning (SimCLR, MoCo) giải quyết với negative samples: "ảnh này KHÁC ảnh kia". Nhưng cần batches rất lớn (4096+).

DINO có approach khác: không cần negatives. Làm thế nào? Ba tricks hoạt động cùng nhau.

---

### Slide 7: EMA Teacher - Cơ chế đầy đủ
**Time**: 1.5 min | **Purpose**: Hiểu EMA chặt chẽ

**Visual**:
```
Training step t:
┌─────────────────────────────────────────────┐
│  θ_t^(new) <- λ·θ_t^(old) + (1-λ)·θ_s      │
│                                             │
│  λ = 0.996 -> 1.0 (cosine schedule)        │
└─────────────────────────────────────────────┘
```

**EMA Update Rule**:
```
θ_T <- λ·θ_T + (1-λ)·θ_S

với:
- θ_T = Teacher parameters
- θ_S = Student parameters
- λ = momentum coefficient
```

**Cosine Schedule cho λ**:
```
λ(t) = 1 - (1 - λ_base) × (1 + cos(πt/T)) / 2

λ_base = 0.996
t = current step
T = total steps

Bắt đầu: λ ≈ 0.996 (Teacher cập nhật 0.4% từ Student mỗi step)
Kết thúc: λ -> 1.0 (Teacher gần như đóng băng)
```

**Tại sao EMA hoạt động?**
| Insight | Giải thích |
|---------|------------|
| **Polyak-Ruppert averaging** | EMA là model ensembling với exponential decay |
| **Teacher > Student** | Teacher performance TỐT HƠN Student suốt training |
| **Stable targets** | Teacher thay đổi chậm -> tín hiệu học ổn định |
| **No "conspiracy"** | Nếu Teacher và Student update cùng tốc độ -> collapse cùng |

**Key Observation từ Paper**:
> "Teacher có performance tốt hơn Student suốt quá trình training,
> và do đó guides training bằng cách cung cấp target features chất lượng cao hơn."

**Speaker Notes** (125 words):
EMA Teacher là critical. Update rule: Teacher giữ 99.6% weights cũ và lấy 0.4% từ Student. λ theo cosine schedule từ 0.996 đến 1.0 - nên Teacher updates chậm dần theo thời gian.

Tại sao hoạt động? Ba lý do. Thứ nhất, đây là Polyak-Ruppert averaging với exponential decay - về cơ bản là model ensembling, được biết là cải thiện performance. Thứ hai, tác giả quan sát thấy Teacher perform tốt hơn Student suốt training - nó cung cấp targets chất lượng cao hơn. Thứ ba, nếu Teacher và Student update cùng tốc độ, chúng sẽ "âm mưu" và collapse cùng nhau. Teacher chậm như một giáo viên kinh nghiệm - thay đổi quan điểm chậm dựa trên kinh nghiệm tích lũy, trong khi Student học nhanh.

---

### Slide 8: Centering - Derivation
**Time**: 1.5 min | **Purpose**: Hiểu centering về mặt toán học

**Visual**:
```
Không có Centering:              Có Centering:
Teacher có thể output constant    Constant output -> mean = constant
-> Loss = 0 (collapse)           -> trừ mean -> output = 0
                                  -> Buộc phải diverse outputs!
```

**Centering Update** (mỗi batch):
```
c <- m·c + (1-m) · (1/B) · Σᵢ g_θt(xᵢ)

với:
- c = center vector (K dimensions)
- m = rate parameter (m = 0.9)
- B = batch size
- g_θt(xᵢ) = Teacher output cho image i
```

**Cách Centering được áp dụng**:
```
g_t(x) <- g_t(x) - c

Center c được trừ từ Teacher output trước khi softmax
```

**Tại sao Centering ngăn Mode Collapse**:

| Scenario | Teacher Output | Sau Centering |
|----------|---------------|---------------|
| Normal | Diverse outputs | Diverse (centered) |
| Mode Collapse | Constant v cho tất cả images | v - c = v - v = 0 |

**Trực quan toán học**:
- Nếu Teacher outputs constant v cho tất cả images
- Thì mean over batch = v
- c hội tụ đến v (EMA của means)
- Sau centering: v - c ≈ 0
- **Buộc Teacher phải output KHÁC NHAU cho các images khác nhau**

**Side Effect**:
> Centering alone khuyến khích **uniform collapse** (all dimensions equal)
> -> Cần sharpening để balance!

**Speaker Notes** (125 words):
Centering ngăn mode collapse. Center c là exponential moving average của Teacher outputs qua các batches. Chúng ta trừ c từ Teacher output trước khi áp dụng softmax.

Đây là lý do nó hoạt động: Giả sử Teacher collapse và output constant vector v cho TẤT CẢ images. Thì batch mean bằng v, nên c hội tụ đến v. Sau centering: v - c = v - v = 0. Teacher's effective output trở thành zero!

Điều này BUỘC Teacher phải output khác nhau cho các images khác nhau - nếu không output của nó bị nullified. Key insight: centering chỉ dùng first-order batch statistics (mean), làm nó lightweight và hoạt động tốt với các batch sizes khác nhau.

Nhưng centering có side effect: nó khuyến khích tất cả dimensions bằng nhau (uniform collapse). Cần sharpening để counter điều này.

---

### Slide 9: Sharpening - Phân tích Temperature
**Time**: 1 min | **Purpose**: Hiểu vai trò của temperature

**Visual**:
```
τ = 1.0 (no sharpening)     τ = 0.04 (sharp)
    ▁▂▃▄▅▅▄▃▂▁                 ▁▁▁▁█▁▁▁▁
  (soft, uncertain)          (peaked, confident)
```

**Temperature trong Softmax**:
```
softmax(x/τ) = exp(x/τ) / Σ exp(x/τ)

τ -> 0: Distribution trở thành one-hot (argmax)
τ -> ∞: Distribution trở thành uniform
```

**Ví dụ**:
```
Raw logits: [2.0, 1.5, 1.0, 0.5]

τ = 1.0:  [0.47, 0.28, 0.17, 0.08]  <- mềm
τ = 0.1:  [0.97, 0.02, 0.01, 0.00]  <- sắc (gần one-hot)
τ = 0.04: [0.99, 0.01, 0.00, 0.00]  <- rất sắc
```

**DINO's Temperature Choice**:
| Network | Temperature | Effect |
|---------|------------|--------|
| **Teacher** | τ_t = 0.04 | Sharp/confident output |
| **Student** | τ_s = 0.1 | Softer output (dễ học hơn) |

**Centering + Sharpening Balance**:
| Mechanism | Alone | Effect |
|-----------|-------|--------|
| Centering | Khuyến khích uniform | Ngăn mode collapse |
| Sharpening | Khuyến khích peaked | Ngăn uniform collapse |
| **Together** | Balanced | Stable training! |

**Speaker Notes** (100 words):
Temperature kiểm soát phân bố softmax "peaked" như thế nào. Low temperature (0.04 cho Teacher) có nghĩa sharp, confident output - một dimension dominate. High temperature có nghĩa soft, uncertain output.

Tại sao temperatures khác nhau? Teacher dùng τ=0.04 (rất sharp) để ngăn uniform collapse - nếu tất cả dimensions bằng nhau, low temperature vẫn tạo peaked distribution. Student dùng τ=0.1 (softer) vì học từ extremely sharp targets khó hơn - gradients vanish cho non-maximum dimensions.

Key insight: Centering khuyến khích uniform, Sharpening khuyến khích peaked. Cùng nhau chúng balance nhau, tạo stable training không collapse.

---

### Slide 10: Ablation - Chuyện gì xảy ra khi bỏ mỗi thành phần
**Time**: 1 min | **Purpose**: Chứng minh mỗi thành phần là cần thiết

**Visual**: Bảng showing ablation results

**Ablation Study Results**:

| Configuration | ImageNet | Status |
|--------------|----------|--------|
| Full DINO (EMA + Centering + Sharpening) | **80.1%** | ✓ Works |
| Remove EMA (copy Student weights to Teacher) | — | ✗ Fails to converge |
| Remove Centering | — | ✗ Mode collapse epoch 1 |
| Remove Sharpening (τ_t = τ_s = 0.1) | — | ✗ Uniform collapse |
| Remove Multi-crop | 72.3% | ✓ Stable but worse |

**Mỗi thành phần ngăn chặn gì**:

```
EMA         -> Ngăn Teacher-Student "conspiracy"
Centering   -> Ngăn mode collapse (constant output)
Sharpening  -> Ngăn uniform collapse (flat distribution)
```

**Key Finding từ Paper**:
> "Centering ngăn một dimension dominate nhưng khuyến khích collapse to
> the uniform distribution, trong khi sharpening có effect ngược lại.
> Áp dụng cả hai operations balance effects của chúng."

**Ba trụ cột**:
```
       ┌─────────────────────────────────────┐
       │         STABLE TRAINING             │
       └─────────────────────────────────────┘
              |           |           |
           ┌──┴──┐    ┌───┴───┐   ┌───┴───┐
           │ EMA │    │Center │   │ Sharp │
           └─────┘    └───────┘   └───────┘
```

**Speaker Notes** (100 words):
Ablation study chứng minh mỗi thành phần là essential. Remove EMA -> fails to converge vì Teacher và Student update cùng nhau và collapse. Remove centering -> mode collapse, mọi thứ map đến một điểm. Remove sharpening -> uniform collapse, mọi thứ trải đều.

Paper nói rõ: "centering ngăn một dimension dominate nhưng khuyến khích collapse to the uniform distribution, trong khi sharpening có effect ngược lại." Đây không phải optional tricks - chúng là core của tại sao DINO hoạt động. Bất kỳ implementation nghiêm túc nào cũng phải bao gồm cả ba, với exact parameters (λ=0.996, τ_t=0.04, τ_s=0.1).

---

### Slide 11: Local-to-Global Multi-Crop Strategy
**Time**: 1.5 min | **Purpose**: Key insight cho semantic learning

**Visual**:
```
Original image
    |
    |-- Global crop 1 (224×224, >50% image) --> Teacher only
    |-- Global crop 2 (224×224, >50% image) --> Teacher only
    |
    |-- Local crop 1 (96×96, <50% image) --> Student only
    |-- Local crop 2 (96×96, <50% image) --> Student only
    |-- Local crop 3 (96×96, <50% image) --> Student only
    `-- ... (6 local crops tổng cộng)
```

**Key Insight**:
> "Thấy **vây cá** (local) -> phải biết đó là **cá** (global)"

**Tại sao điều này buộc Semantic Understanding**:

| Student thấy gì | Student phải predict gì |
|-----------------|-------------------------|
| Chỉ vây cá (96×96) | "Đây là con cá" (whole picture context) |
| Chỉ bánh xe | "Đây là ô tô" |
| Chỉ mắt | "Đây là khuôn mặt" |

**Phân tích Compute**:
```
Global: 2 × (224/14)² = 2 × 256 = 512 patches
Local:  6 × (96/14)²  = 6 × 49  = 294 patches
Total: 806 patches ≈ 2.4× cost của chỉ 2 global crops
```

**Emerging Property**:
- Model học **semantic concepts** không cần labels
- Các attention heads khác nhau chuyên về các object parts khác nhau
- Đây là lý do fish attention maps trông như segmentation!

**Speaker Notes** (100 words):
Đây là insight quan trọng nhất của DINO. Teacher thấy global crops (>50% of image), Student thấy local crops (<50%). Student phải predict Teacher's output.

Ví dụ: Student chỉ thấy vây cá, nhưng phải output giống Teacher đang thấy cả con cá. Điều này BUỘC Student phải hiểu: "vây này thuộc về con cá". Model phải học semantic concepts - không chỉ copy pixels.

Compute cost khoảng 2.4× so với chỉ dùng global crops, nhưng semantic understanding gained rất đáng. Đây là lý do DINO học segment objects mà không cần segmentation labels.

---

### Slide 12: DINOv1 Results
**Time**: 1 min | **Purpose**: Establish milestone

**Visual**: Bar chart comparing methods

**Results** (k-NN evaluation, ViT-B/8):

| Method | ImageNet Acc | Labels Used | Year |
|--------|-------------|-------------|------|
| **DINO v1** | **80.1%** | 0 | 2021 |
| Supervised ViT | 76.5% | 14M | - |
| SimCLR | 69.3% | 0 | 2020 |
| BYOL | 74.3% | 0 | 2020 |
| MoCo v3 | 76.7% | 0 | 2021 |

**Historic Milestone**:
> "Lần đầu tiên SSL **vượt qua** Supervised trên ImageNet!"

**Emerging Properties Observed**:
- Attention heads tự nhiên segment objects
- Features transfer tốt sang các tasks khác
- k-NN hoạt động gần như tốt bằng linear probe

**Nhưng... Limitations vẫn còn**:

| Limitation | Details | Impact |
|------------|---------|--------|
| **Data nhỏ** | 1.28M images (chỉ ImageNet) | Hạn chế diversity |
| **Classification focus** | Đánh giá chủ yếu k-NN, linear probe | Dense tasks? |
| **Single loss** | Chỉ DINO loss (CLS token) | Patch-level learning? |

**Speaker Notes** (75 words):
DINOv1 đạt historic milestone: 80.1% trên ImageNet với zero labels - lần đầu SSL beats supervised! Emerging properties rất remarkable: attention heads tự nhiên segment objects, features transfer tốt.

Nhưng limitations vẫn còn: chỉ train trên ImageNet (1.28M images), đánh giá chủ yếu classification, chỉ dùng một loss targeting CLS token. Còn dense tasks như segmentation thì sao? Nếu muốn patch-level understanding thì sao? Điều này setup DINOv2.

---

## Act 3: Evolution to DINOv2 (6 slides, 8 min)

### Slide 13: v1 Limitations -> v2 Questions
**Time**: 1 min | **Purpose**: Motivate v2 improvements

**Visual**: Ba dấu hỏi với icons

**DINOv1's Limitations**:

| Aspect | v1 Status | Câu hỏi cho v2 |
|--------|-----------|----------------|
| **Data** | 1.28M (ImageNet) | Nhiều data hơn có giúp không? Curate thế nào? |
| **Tasks** | Classification only | Có thể làm segmentation, depth không? |
| **Loss** | CLS token only | Có thể học patch-level features không? |
| **Scale** | ViT-B/S | Có thể scale đến 1B+ parameters không? |

**Các câu hỏi nghiên cứu v2**:

1. **Data scaling**: More data = better? Hay quality quan trọng hơn?
2. **Dense tasks**: Thiếu gì để segmentation/depth hoạt động?
3. **Foundation Model**: Một backbone có thể làm TẤT CẢ tốt không?

**Foundation Model Definition**:
> "1 pretrained backbone -> multiple tasks -> frozen features + simple head"

**Speaker Notes** (75 words):
DINOv1 là groundbreaking nhưng limited. Chỉ train trên ImageNet - nếu có hàng tỷ images thì sao? Chỉ evaluate classification - còn segmentation, depth estimation? Chỉ dùng CLS token - còn understanding individual patches?

v2 hỏi: Có thể tạo true Foundation Model không? Một backbone hoạt động cho mọi thứ - classification, segmentation, depth, retrieval - mà không cần task-specific training. Câu trả lời cần innovations trong data, losses, và scale.

---

### Slide 14: Data Curation Pipeline - LVD-142M
**Time**: 1.5 min | **Purpose**: Hiểu data quality vs quantity

**Visual**: Funnel diagram showing filtering pipeline

**Curation Pipeline** với số liệu cụ thể:
```
┌─────────────────────────────────────────────────────────────────┐
│                     DATA CURATION PIPELINE                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1.2B raw images (web crawl)                                    │
│         |                                                        │
│         v  Safety filtering                                      │
│         |  • NSFW classifier                                     │
│         |  • Restricted domains blacklist                        │
│         |                                                        │
│  1.1B images                                                     │
│         |                                                        │
│         v  PCA hash deduplication                                │
│         |  • Exact & near-exact duplicates                       │
│         |                                                        │
│  744M images                                                     │
│         |                                                        │
│         v  Copy-detection deduplication                          │
│         |  • Cosine similarity > 0.6                             │
│         |  • k=64 nearest neighbors checked                      │
│         |                                                        │
│         v  Benchmark leak removal                                │
│         |  • Cosine similarity > 0.45                            │
│         |                                                        │
│         v  Self-supervised retrieval                             │
│         |  • ViT-H/16 pretrained features                        │
│         |  • k-means: 100,000 clusters                           │
│         |                                                        │
│  142M curated images (LVD-142M)                                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

Implementation: Faiss library, GPU-accelerated
Hardware: 20 nodes × 8 V100 GPUs
```

**Key Ablation** (ViT-g/14):

| Dataset | Size | ImageNet | ADE20k mIoU |
|---------|------|----------|-------------|
| Raw uncurated | 1.2B | 84.2% | 46.3 |
| **LVD-142M (curated)** | **142M** | **86.5%** | **49.0** |

**Key Finding**:
> "**Quality > Quantity**: 142M curated beats 1.2B raw trên TẤT CẢ benchmarks"

**Speaker Notes** (125 words):
Data curation là critical cho v2. Bắt đầu từ 1.2B raw web images, filter xuống 142M qua nhiều stages. Đầu tiên: safety filtering và deduplication dùng PCA hashes. Sau đó: copy-detection dùng learned embeddings với k=64 nearest neighbors - images với cosine similarity > 0.6 được group và deduplicated. Sau đó: remove images quá similar với evaluation benchmarks (ngăn data leakage). Cuối cùng: self-supervised retrieval dùng ViT-H model's embeddings để select images similar với curated seeds.

Ablation là crucial: 142M curated images beat 1.2B uncurated images trên every benchmark. Còn striking hơn: 142M curated gần match 14M ImageNet-22k trên ImageNet, trong khi crushing nó trên diverse domains như iNaturalist. Quality beats quantity.

---

### Slide 15: iBOT Loss - Masked Patch Prediction
**Time**: 1.5 min | **Purpose**: Hiểu patch-level learning

**Visual**:
```
┌─────────────────────────────────────────────────────────────┐
│                         iBOT Architecture                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Student input:    [CLS] [P1] [MASK] [P3] [MASK] [P5] ...   │
│                                 |           |                │
│  Student predicts:         p_s(i)       p_s(j)              │
│                                 |           |                │
│                           Cross-entropy loss                 │
│                                 ^           ^                │
│  Teacher targets:          p_t(i)       p_t(j)              │
│                                 ^           ^                │
│  Teacher input:    [CLS] [P1] [P2]  [P3] [P4]  [P5] ...     │
│                          (FULL image - no masking)           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**iBOT Loss Formula**:
```
L_iBOT = -Σᵢ∈M p_t(i) · log(p_s(i))

với:
- M = set of masked patch indices
- p_t = Sinkhorn-Knopp centered teacher probability
- p_s = Student softmax probability
```

**iBOT vs MAE**:

| Aspect | MAE | iBOT |
|--------|-----|------|
| **Target** | Pixel values (RGB) | Prototype scores từ teacher |
| **Loss** | MSE reconstruction | Cross-entropy |
| **Level** | Low-level (texture) | High-level (semantic) |
| **Features** | Cần finetuning | **Works frozen** |

**Tại sao Semantic > Pixel?**
- Pixels chứa noise, texture details
- Semantic tokens capture "what" không phải "how it looks"
- Frozen iBOT features match finetuned MAE trên segmentation

**At Scale**: UNTIED heads work better (separate DINO và iBOT projection heads)

**Speaker Notes** (125 words):
iBOT thêm patch-level learning vào DINO. Student receives masked patches, Teacher receives full image. Student phải predict Teacher's output tại masked positions.

Crucially, iBOT predicts semantic tokens, không phải pixels như MAE. MAE reconstructs raw pixel values - học texture và low-level patterns. iBOT predicts Teacher's representation nói gì về patch đó - học semantic meaning.

Kết quả: frozen iBOT features work gần tốt bằng finetuned MAE trên segmentation. Bạn không cần task-specific training.

Một finding quan trọng at scale: sharing projection head giữa DINO và iBOT works better at small scale, nhưng separate heads works better at large scale. DINOv2 dùng untied heads cho tất cả experiments.

---

### Slide 16: KoLeo Loss - Uniform Embeddings
**Time**: 1.5 min | **Purpose**: Hiểu diversity regularization

**Visual**:
```
Without KoLeo:                    With KoLeo:
   ●●●                              ●     ●
  ●●●●●                           ●   ●   ●
   ●●●                              ●     ●
(clustered embeddings)           (uniformly spread)
```

**KoLeo Loss Formula** (Kozachenko-Leonenko differential entropy estimator):
```
L_KoLeo = -(1/n) Σᵢ log(d_{n,i})

với:
- n = batch size
- d_{n,i} = min_{j≠i} ||xᵢ - xⱼ||  (distance to nearest neighbor)
- Features là L2-normalized trước khi compute
```

**Trực quan toán học**:
```
Maximizing L_KoLeo = Maximizing log(distance to nearest neighbor)
                   = Maximizing distance to nearest neighbor
                   = Pushing embeddings APART
                   = Uniform distribution trên hypersphere
```

**Application Details**:
- Weight: **0.1** (total loss = L_DINO + L_iBOT + 0.1 × L_KoLeo)
- Applied to: CLS tokens của first global crop only
- Gradient: Maximizes distance to nearest neighbor

**Tại sao KoLeo Critical** (Ablation):

| Configuration | ImageNet | Oxford Retrieval |
|--------------|----------|------------------|
| Full model | 85.8% | 63.9% |
| Without KoLeo | 85.3% | **55.6%** (-8.3%) |

> KoLeo gần như không ảnh hưởng classification nhưng **critical cho retrieval**!

**Speaker Notes** (125 words):
KoLeo ngăn một subtle form of collapse: embeddings clustering quá tight. Formula maximizes log của minimum distance to nearest neighbor - về cơ bản pushing mỗi embedding xa khỏi closest neighbor của nó.

Tên đến từ Kozachenko-Leonenko, một differential entropy estimator. Maximizing KoLeo khuyến khích embeddings spread uniformly across feature space hypersphere.

Ablation rất striking: removing KoLeo barely hurts ImageNet classification (85.8 -> 85.3, chỉ -0.5%), nhưng destroys retrieval performance (63.9 -> 55.6, -8.3%). Tại sao? Classification chỉ cần features linearly separable. Retrieval cần features preserve fine-grained distances. Without KoLeo, features cluster together, ruining nearest-neighbor search.

Applied với weight 0.1 trên CLS tokens only - một small regularization cho phép retrieval applications.

---

### Slide 17: Three Losses Together
**Time**: 1.5 min | **Purpose**: Thấy các losses complement nhau thế nào

**Visual**:
```
┌─────────────────────────────────────────────────────────────┐
│                        Image                                 │
│                          |                                   │
│              ┌──────────────────────┐                       │
│              │      ViT Backbone     │                       │
│              └──────────────────────┘                       │
│                    |           |                            │
│               CLS token    Patch tokens                     │
│                    |           |                            │
│    ┌───────────────────┐  ┌───────────────────┐            │
│    │   DINO Head       │  │   iBOT Head       │            │
│    │   (untied)        │  │   (untied)        │            │
│    └───────────────────┘  └───────────────────┘            │
│           |                        |                        │
│        L_DINO                   L_iBOT                      │
│    (global semantics)      (local/dense)                    │
│                                                             │
│              + 0.1 × L_KoLeo (diversity)                    │
└─────────────────────────────────────────────────────────────┘
```

**Total Loss**:
```
L_total = L_DINO + L_iBOT + 0.1 × L_KoLeo
```

**Mỗi Loss cung cấp gì**:

| Loss | Target | Học gì | Critical cho |
|------|--------|--------|--------------|
| **L_DINO** | CLS token | Global image semantics | Classification, retrieval |
| **L_iBOT** | Masked patches | Local patch understanding | Segmentation, depth |
| **L_KoLeo** | Batch diversity | Uniform feature spread | Retrieval accuracy |

**Ablation Summary**:

| Removed | ImageNet | ADE20k mIoU | Retrieval mAP |
|---------|----------|-------------|---------------|
| Full model | 85.8% | 47.1 | 63.9% |
| - KoLeo | 85.3% (-0.5) | 47.2 (same) | 55.6% (**-8.3**) |
| - iBOT | 85.3% (-0.5) | **44.2** (**-2.9**) | 64.3% (+0.4) |

**Key Insight**:
> "Mỗi loss earns its place. Remove any -> lose a capability."

**Speaker Notes** (100 words):
Ba losses work together, mỗi cái handle một aspect khác nhau. DINO learns global semantics từ CLS token - good cho classification. iBOT learns local understanding từ patches - essential cho dense tasks. KoLeo ensures diversity - critical cho retrieval.

Ablation proves mỗi cái là necessary: Remove KoLeo -> retrieval drops 8%. Remove iBOT -> segmentation drops 3 mIoU. Đây không phải small effects.

Chú ý untied heads: ở DINOv2 scale, DINO và iBOT dùng separate projection heads. Điều này khác original iBOT paper shared heads - một ví dụ nữa về cách optimal design changes với scale.

---

### Slide 18: DINOv2 Results
**Time**: 1 min | **Purpose**: Establish Foundation Model status

**Visual**: Multi-benchmark comparison chart

**Key Results** (frozen backbone, ViT-g/14):

| Benchmark | DINOv2 | Previous Best | Task |
|-----------|--------|---------------|------|
| **ImageNet** | **86.5%** | 82.3% (iBOT) | Classification |
| **ADE20k** | **49.0 mIoU** | 44.6 (iBOT) | Segmentation |
| **Oxford-M** | **64.6%** | 39.0% (iBOT) | Retrieval |
| **NYUd** | **0.279 RMSE** | 0.358 (iBOT) | Depth |
| **iNat-2021** | **85.7%** | 76.0% (CLIP) | Fine-grained |

**Scaling Law**:

| Model | Params | ImageNet | ADE20k |
|-------|--------|----------|--------|
| ViT-S | 22M | 81.1% | 42.5 |
| ViT-B | 86M | 84.5% | 45.8 |
| ViT-L | 307M | 86.3% | 48.2 |
| **ViT-g** | **1.1B** | **86.5%** | **49.0** |

**Foundation Model Achieved**:
```
1 backbone (frozen) + simple linear head -> SOTA trên multiple tasks
```

**So sánh với Weakly-Supervised**:

| Model | ImageNet | ADE20k | Uses Text? |
|-------|----------|--------|------------|
| OpenCLIP ViT-G | 86.2% | 46.0 | Yes (LAION-2B) |
| EVA-CLIP ViT-g | 86.4% | - | Yes |
| **DINOv2 ViT-g** | **86.5%** | **49.0** | **No** |

> DINOv2 beats text-supervised models **mà không cần text**!

**Speaker Notes** (75 words):
DINOv2 achieves Foundation Model status. One frozen backbone, simple linear heads, state-of-the-art across classification, segmentation, retrieval, và depth. 86.5% ImageNet với frozen features - nearly matching supervised finetuning.

Impressive nhất: DINOv2 beats OpenCLIP và EVA-CLIP dùng billions image-text pairs. DINOv2 không dùng text supervision gì cả. Pure visual self-supervision với đúng losses và data curation matches hoặc exceeds text-supervised methods.

---

## Act 4: Evolution to DINOv3 (4 slides, 4.5 min)

### Slide 19: 7B Challenge - Dense Feature Degradation
**Time**: 1 min | **Purpose**: Hiểu scaling problem

**Visual**:
```
Training iterations ->
          0      200k     400k     600k     800k     1M
          |        |        |        |        |        |
ImageNet  |--------+--------+--------+--------+--------| ↗ keeps improving
          |        |        |        |        |        |
          |     peak|        |        |        |        |
ADE20k    |--------●--------+--------+--------+--------| ↘ degrades!
          |        ↘        ↘        ↘        ↘        |
```

**Vấn đề** (KHÔNG PHẢI traditional divergence!):
- Classification (ImageNet) keeps improving throughout training
- **Dense tasks (segmentation) peak at ~200k, sau đó DEGRADE**
- Với ViT-7B: segmentation falls **below early-training levels** by 1M iterations

**Root Cause Analysis**:
```
Cosine similarity giữa CLS token và patch tokens TĂNG over training
-> Patches "collapse" toward global summary
-> Mất local spatial specificity
-> Dense tasks suffer
```

**Tại sao điều này xảy ra**:
1. CLS token và patch outputs trở nên **quá giống nhau**
2. Patches "sụp đổ" về phía global summary (CLS)
3. Mất **local specificity** -> dense tasks suffer
4. DINO global loss **dominate** over iBOT patch-level loss

**Key insight**: Problem không phải training không hội tụ, mà là **hội tụ sai**!

**Speaker Notes** (100 words):
Scaling đến 7B reveals một vấn đề mới. Nó KHÔNG PHẢI training divergence - loss không explode. Thay vào đó, dense feature quality degrades. Classification keeps improving, nhưng segmentation peaks khoảng 200k iterations sau đó declines.

Nguyên nhân: CLS token và patch outputs trở nên quá similar over time. Patches "collapse" toward global summary, mất local distinctiveness của chúng. DINO global loss dominates over iBOT local loss khi training continues.

Visualization shows điều này rõ ràng: at 200k iterations, similarity maps giữa patches là crisp và localized. By 1M iterations, chúng noisy và smeared. Model forgets spatial structure.

---

### Slide 20: Gram Anchoring - Full Derivation
**Time**: 1.5 min | **Purpose**: Hiểu giải pháp toán học

**Visual**:
```
Student patches:                    Gram Teacher patches (early checkpoint):
[p1, p2, p3, ..., pP]              [g1, g2, g3, ..., gP]
       |                                   |
    X_S (P×d)                           X_G (P×d)
       |                                   |
   X_S · X_S^T                        X_G · X_G^T
       |                                   |
    G_S (P×P)                          G_G (P×P)
       `---------- ||G_S - G_G||²_F ----------'
```

**Gram Matrix Definition**:
```
Cho P patches với d-dimensional L2-normalized features:
X = [x₁, x₂, ..., x_P]^T  (P × d matrix)

Gram matrix: G = X · X^T  (P × P matrix)

G[i,j] = xᵢ · xⱼ = cosine similarity giữa patch i và patch j
```

**Gram Anchoring Loss**:
```
L_Gram = ||X_S · X_S^T - X_G · X_G^T||²_F

với:
- X_S = Student patch features (L2-normalized)
- X_G = Gram Teacher patch features (từ early checkpoint)
- ||·||_F = Frobenius norm
```

**Tại sao điều này hoạt động - Key Insight**:
```
L_Gram constrains SIMILARITY STRUCTURE, không phải specific feature values

Student features có thể:
✓ Rotate
✓ Scale
✓ Shift

Miễn là:
"Patches nào similar với patches nào" stays the same
```

**Gram Teacher**: Checkpoint từ **100k-200k iterations** (khi dense features còn tốt)

**High-Resolution Gram (L_HRef)**:
```
Input: 224×224           Input: 448×448 (2×)
     |                        |
Student ViT              Gram Teacher ViT
     |                        |
14×14 feature map        28×28 feature map
     |                        |
     |                   Bicubic downsample
     |                        |
     |                   14×14 feature map
     |                        |
     `--- L_Gram Loss --------'

Gain: +2 mIoU on ADE20k (high-res details!)
```

**Refinement Loss**:
```
L_Ref = w_D × L_DINO + L_iBOT + w_DK × L_KoLeo + w_Gram × L_Gram

w_Gram = 2.0
```

**Speaker Notes** (125 words):
Gram Anchoring là elegant. Gram matrix G = X·X^T encodes pairwise cosine similarities giữa tất cả patches. G[i,j] cho biết patch i similar với patch j như thế nào.

Loss minimizes Frobenius norm giữa Student's Gram matrix và Gram Teacher's Gram matrix. Điều này preserves similarity structure - patches nào should similar với patches nào.

Key insight: đây là SOFT constraint. Features có thể rotate, scale, hoặc shift trong embedding space - chúng chỉ cần preserve relative similarities. Điều này decouples feature learning từ structural regularization.

Gram Teacher đến từ early checkpoint (100k-200k iterations) khi dense features vẫn còn tốt. Dùng late checkpoint không work - features đó đã degraded.

Effect gần như immediate: improvements xuất hiện trong 10k iterations.

---

### Slide 21: Text Alignment - Decoupled Training
**Time**: 1 min | **Purpose**: Hiểu vision-language connection

**Visual**:
```
CLIP approach:                     DINOv3 approach:
┌────────────────────┐            Phase 1: SSL Training
│ Image <-> Text     │            ┌────────────────────┐
│ (joint training)   │            │ Image-only (1M iter)│
│                    │            │ DINOv3 backbone     │
│ Vision learns      │            └────────────────────┘
│ from text signal   │                     | FREEZE
└────────────────────┘            Phase 2: Text Alignment
                                  ┌────────────────────┐
                                  │ Frozen vision +    │
                                  │ Train text encoder │
                                  └────────────────────┘
```

**So sánh chi tiết**:

| Aspect | CLIP | DINOv3 Text Alignment |
|--------|------|----------------------|
| **Vision encoder** | Trained jointly với text | **FROZEN** |
| **What's trained** | Both encoders | Text encoder + 2 transformer layers |
| **Visual features** | CLS token only | **CLS + mean-pooled patches** |
| **Dense capability** | Poor | **Excellent** |
| **Data needed** | 400M+ image-text pairs | Reuses SSL backbone |

**Tại sao Include Patches?**
- Standard CLIP: Chỉ CLS token aligned to text -> global-only
- DINOv3: CLS + mean-pooled patches -> cả global VÀ local aligned
- Kết quả: **Open-vocabulary segmentation works!**

**Results** (ViT-L):

| Task | CLIP | EVA-02-CLIP | DINOv3 |
|------|------|-------------|--------|
| ADE20k seg | 6.0 mIoU | 10.9 mIoU | **24.7 mIoU** |

**Speaker Notes** (100 words):
DINOv3 có thể aligned to text mà vẫn preserving dense capabilities. Khác với CLIP trains vision và text jointly (degrading spatial features), DINOv3 dùng decoupled training.

Phase 1: Train SSL backbone normally (1M iterations, no text). Phase 2: Freeze vision backbone, thêm 2 transformer layers, train text encoder from scratch.

Key enhancement: dùng cả CLS token VÀ mean-pooled patches cho alignment. Điều này aligns cả global và local features to text, enabling open-vocabulary segmentation.

Result: 24.7 mIoU trên ADE20k vs CLIP's 6.0 - 4× improvement trong dense vision-language tasks.

---

### Slide 22: DINOv3 Results
**Time**: 1 min | **Purpose**: Establish SOTA status

**Visual**: Comprehensive benchmark table

**Architecture**: ViT-7B (6.7B parameters)
| Aspect | DINOv2 (ViT-g) | DINOv3 (ViT-7B) |
|--------|----------------|-----------------|
| **Parameters** | 1.1B | **6.7B** |
| **Patch size** | 14 | **16** |
| **Position embed** | Learnable | **Axial RoPE** |
| **Embed dimension** | 1536 | **4096** |
| **Prototypes (DINO)** | 128k | **256k** |
| **Prototypes (iBOT)** | 128k | **96k** |

**Training Scale**:
- 256 H100 GPUs
- 61,440 GPU hours
- ~18 tons CO2 equivalent
- Dataset: LVD-1689M (1.7B curated images từ Instagram)

**Key Results** (frozen backbone):

| Benchmark | DINOv2-g | DINOv3-7B | Improvement |
|-----------|----------|-----------|-------------|
| **ImageNet** | 86.5% | **88.4%** | +1.9% |
| **ObjectNet** | 66.0% | **79.0%** | **+13%** |
| **ADE20k** | 49.0 mIoU | **55.9 mIoU** | **+6.9** |
| **COCO det** | 62.5 mAP | **66.1 mAP** | +3.6 |
| **DAVIS** | 76.6 J&F | **83.3 J&F** | **+6.7** |

**Historic Achievements**:
- First SSL model at **weakly-supervised parity** trên ImageNet (88.4% vs 88.5%)
- **SOTA on COCO detection** với frozen backbone (chỉ 100M trainable decoder params)
- **SOTA on ADE20k** với frozen backbone (matches finetuned models)

**Speaker Notes** (75 words):
DINOv3 achieves SOTA everywhere với frozen backbone. 88.4% ImageNet - first SSL at weakly-supervised parity. 66.1 mAP trên COCO detection - matching finetuned models với chỉ 100M parameter decoder. 55.9 mIoU trên ADE20k - 6 points above DINOv2.

Dense task improvements đặc biệt notable: +13% on ObjectNet, +6.9 mIoU on segmentation, +6.7 on video tracking. Gram Anchoring solved dense feature degradation problem.

---

## Act 5: Synthesis (2 slides, 2 min)

### Slide 23: Evolution Timeline
**Time**: 1 min | **Purpose**: Visual summary of the journey

**Visual**: Horizontal timeline

```
2021                           2023                           2025
 |                              |                              |
DINOv1                        DINOv2                        DINOv3
80.1% ImageNet                86.5% ImageNet                88.4% ImageNet
 |                              |                              |
 | ┌─────────────────────┐      | ┌─────────────────────┐      | ┌─────────────────────┐
 | │ VẤN ĐỀ:            │      | │ VẤN ĐỀ:            │      | │ VẤN ĐỀ:            │
 | │ Học không labels   │      | │ Dense tasks yếu    │      | │ Dense features      │
 | │                     │      | │                     │      | │ degrade at scale    │
 | ├─────────────────────┤      | ├─────────────────────┤      | ├─────────────────────┤
 | │ GIẢI PHÁP:         │      | │ GIẢI PHÁP:         │      | │ GIẢI PHÁP:         │
 | │ • EMA Teacher       │      | │ • iBOT (patches)    │      | │ • Gram Anchoring    │
 | │ • Centering         │      | │ • KoLeo (diversity) │      | │ • Text Alignment    │
 | │ • Sharpening        │      | │ • Data curation     │      | │ • 7B scale          │
 | │ • Local->Global     │      | │ • 3 losses          │      | │ • Axial RoPE        │
 | └─────────────────────┘      | └─────────────────────┘      | └─────────────────────┘
 |                              |                              |
 `──────────────────────────────┴──────────────────────────────'
              Mỗi version giải quyết limitations của version trước
```

**Pattern**:

| Version | Vấn đề giải quyết | Key Innovation | Kết quả |
|---------|-------------------|----------------|---------|
| v1 (2021) | SSL không labels | Self-distillation + collapse prevention | SSL > Supervised |
| v2 (2023) | Dense tasks yếu | iBOT + KoLeo + data curation | Foundation Model |
| v3 (2025) | Dense degrades at scale | Gram Anchoring | SOTA everywhere |

**Research Process**:
> Identify problem -> Solve -> Find new problem -> Repeat

**Speaker Notes** (75 words):
Timeline shows evolution rõ ràng. Mỗi version giải quyết limitation của version trước. v1: làm sao SSL không collapse? v2: làm sao có dense task performance? v3: làm sao scale đến 7B mà không degradation?

Pattern này - identify problem, solve, find new problem - là essence của research progress. Hiểu journey này giúp bạn hiểu không chỉ DINO làm gì, mà TẠI SAO mỗi design choice exists.

---

### Slide 24: Key Takeaways + References
**Time**: 1 min | **Purpose**: Memorable insights và resources

**5 Bài học từ DINO**:

| # | Takeaway | Evidence |
|---|----------|----------|
| 1 | **SSL có thể beat Supervised** | 88.4% vs 85.7% (supervised ViT-H) |
| 2 | **Collapse prevention là CRITICAL** | EMA + Centering + Sharpening (tất cả required) |
| 3 | **Quality > Quantity trong data** | 142M curated > 1.2B raw |
| 4 | **Dense tasks cần patch-level learning** | iBOT: -2.9 mIoU without it |
| 5 | **Scale cần stability tricks** | Gram Anchoring ngăn dense degradation |

**Key Formulas Reference**:
```
EMA:        θ_T <- λθ_T + (1-λ)θ_S,  λ: 0.996 -> 1
Centering:  c <- mc + (1-m)(1/B)Σg_θt(xᵢ)
Loss:       L = -Σₖ P_t[k] · log(P_s[k])
KoLeo:      L = -(1/n) Σᵢ log(min_{j≠i} ||zᵢ - zⱼ||)
Gram:       G = X·X^T,  L = ||G_S - G_G||²_F
```

**Papers**:
- DINOv1: Caron et al., "Emerging Properties in Self-Supervised Vision Transformers", ICCV 2021
- DINOv2: Oquab et al., "DINOv2: Learning Robust Visual Features without Supervision", TMLR 2024
- DINOv3: Darcet et al., arXiv 2025

**Code**: github.com/facebookresearch/dinov2

**Speaker Notes** (75 words):
Năm key lessons từ DINO: SSL có thể exceed supervised learning. Collapse prevention là non-negotiable - mọi component matter. Data quality trumps quantity. Dense tasks require explicit patch-level objectives. Scale requires stability mechanisms.

Các formulas là reference cho implementation. Papers cung cấp complete details. Code là open-source.

Cảm ơn đã lắng nghe. Có câu hỏi nào không?

---

## Summary

| Act | Slides | Time | Purpose |
|-----|--------|------|---------|
| Hook & Problem | 1-2 | 2.5 min | Tạo tò mò + định nghĩa vấn đề |
| Building DINOv1 | 3-12 | 13 min | Architecture -> Collapse -> Solutions |
| Evolution to v2 | 13-18 | 8 min | Data + iBOT + KoLeo |
| Evolution to v3 | 19-22 | 4.5 min | Gram Anchoring + Text Alignment |
| Synthesis | 23-24 | 2 min | Timeline + Takeaways |
| **Total** | **24** | **30 min** | |

---

## Design Notes

### Changes from v68
- Full Vietnamese translation
- Added exact cosine schedule formula for EMA
- Enhanced centering formula explanation
- Added DINOv3 architecture comparison table (ViT-g vs ViT-7B)
- Clarified dense degradation is NOT divergence
- Added High-Resolution Gram Loss (L_HRef)
- Added training details (256 H100, 61k GPU hours)

### Mathematical Rigor Level
This is a Master's class version with:
- Full formulas for all key components
- Derivations explaining "why" not just "what"
- Ablation tables proving necessity of each component
- Implementation details (dimensions, hyperparameters)

### Narrative Structure
Each major concept follows PAFS:
1. **Problem**: What are we trying to solve?
2. **Attempt**: First intuition/approach
3. **Failure**: Why doesn't it work?
4. **Solution**: How DINO solves it (with math)
