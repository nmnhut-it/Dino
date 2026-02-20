# DINO Seminar v6.3 - Slide Outline

> **Mục đích**: Chi tiết từng slide trước khi generate code
> **Đối tượng**: CS students có ML cơ bản (biết neural network, loss, gradient descent)
> **Tổng số slides**: 32

---

## Section 0: Mở đầu (2 slides)

### Slide 1: Title
**Style**: Full-screen title, gradient background
**Layout**: Centered text, large title

**Nội dung**:
- Title: "DINO: Self-Distillation with NO Labels"
- Subtitle: "Từ v1 đến v3: Hành trình Foundation Model"
- Author/Date info

**Speaker Notes**:
"Chào mừng các bạn đến với seminar về DINO. Hôm nay chúng ta sẽ đi qua toàn bộ lịch sử phát triển của DINO - từ ý tưởng ban đầu năm 2021 đến phiên bản mới nhất 2025. Đây là một trong những dòng model quan trọng nhất trong self-supervised learning hiện tại."

---

### Slide 2: Vấn đề với Supervised Learning
**Style**: Two-column comparison
**Layout**: Left = problem, Right = solution hint

**Nội dung**:
- Left column: "Supervised Learning"
  - ImageNet: 14 triệu ảnh
  - 3 người kiểm tra mỗi ảnh
  - Chi phí: $500K+, 2 năm
  - Bottleneck: Human annotation

- Right column: "Còn cách nào khác?"
  - Ảnh raw: Vô hạn trên internet
  - Mục tiêu: Học mà KHÔNG cần nhãn

**Speaker Notes**:
"Vấn đề lớn nhất của supervised learning là chi phí annotation. ImageNet tốn hơn 2 năm và nửa triệu đô chỉ để gán nhãn. Trong khi đó, ảnh raw trên internet thì vô hạn. Câu hỏi đặt ra: liệu model có thể tự học từ ảnh không gán nhãn?"

---

## Section 1: DINOv1 - Foundation (9 slides)

### Slide 3: DINO Demo - Attention Maps
**Style**: Visual-heavy, before/after
**Layout**: 3-column (Input | Attention Heads | Insight)

**Nội dung**:
- Ảnh con chó (input)
- 3 attention maps:
  - Head 1: Highlight đầu
  - Head 2: Highlight thân
  - Head 3: Highlight nền
- Text: "Không ai dạy - model TỰ HỌC phân biệt!"

**Speaker Notes**:
"Trước khi đi vào lý thuyết, hãy xem DINO làm được gì. Đây là attention maps từ các heads khác nhau. Điều kỳ lạ là không ai dạy model 'đây là đầu', 'đây là thân' - nó tự học cách tách vật thể khỏi nền. Đây là emerging property rất thú vị."

---

### Slide 4: Core Insight - Local → Global
**Style**: Diagram with arrows
**Layout**: Top = analogy, Bottom = DINO application

**Nội dung**:
- Analogy: "Thấy vây cá → Biết là con cá"
- Diagram:
  ```
  Global crop (Teacher nhìn) ←──── So sánh ────→ Local crop (Student nhìn)
       [Cả con cá]                                    [Chỉ vây]
  ```
- Key insight: "Student phải đoán toàn cảnh từ góc nhỏ"

**Speaker Notes**:
"Ý tưởng cốt lõi của DINO cực kỳ đơn giản: nếu bạn thấy một cái vây cá, bạn biết đó là con cá. DINO áp dụng nguyên lý này - Teacher nhìn toàn bộ ảnh, Student chỉ nhìn một góc nhỏ, và Student phải đoán output giống Teacher. Điều này buộc Student phải HIỂU ngữ cảnh, không chỉ copy pixel."

---

### Slide 5: Prerequisites - Patches & Embeddings
**Style**: Step-by-step diagram
**Layout**: Left-to-right flow

**Nội dung**:
```
Ảnh 224×224 → Cắt thành patches → Linear projection → Embeddings
             14×14 = 196 patches   16×16×3 → 768d     + Position encoding
```
- Mỗi patch 16×16 pixels
- Tổng 196 patches + 1 CLS token

**Speaker Notes**:
"Trước tiên cần hiểu cách ViT xử lý ảnh. Ảnh được cắt thành các mảnh 16×16 pixels, tổng cộng 196 patches. Mỗi patch được chuyển thành vector 768 chiều. Thêm 1 CLS token đặc biệt ở đầu - token này sẽ đại diện cho toàn bộ ảnh."

---

### Slide 6: Prerequisites - Attention Mechanism
**Style**: Analogy-based explanation
**Layout**: Library lookup analogy

**Nội dung**:
- Analogy: "Tìm sách trong thư viện"
  - Query (Q): Câu hỏi của bạn - "machine learning"
  - Key (K): Tiêu đề mỗi cuốn sách
  - Value (V): Nội dung thực sự
- Formula: `Attention(Q,K,V) = softmax(QK^T/√d) × V`
- Simplified: "Tìm K giống Q nhất, lấy V tương ứng"

**Speaker Notes**:
"Attention hoạt động như việc tìm sách trong thư viện. Query là câu hỏi của bạn, Key là tiêu đề sách, Value là nội dung. Softmax chuyển độ tương tự thành xác suất - sách nào khớp nhất sẽ đóng góp nhiều nhất vào câu trả lời."

---

### Slide 7: DINO Architecture
**Style**: Full architecture diagram
**Layout**: Pipeline flowchart

**Nội dung**:
```
Ảnh gốc
  ├── Global crops (2×224²) → Teacher ViT → Proj Head → softmax(τ=0.04) → P_t
  │                                                                        │
  │                                    Loss = -Σ P_t · log(P_s) ←─────────┤
  │                                                                        │
  └── Local crops (6×96²) → Student ViT → Proj Head → softmax(τ=0.1) → P_s

     Teacher update: θ_T ← 0.996·θ_T + 0.004·θ_S (EMA)
```

**Speaker Notes**:
"Đây là toàn bộ kiến trúc DINO. Từ 1 ảnh, tạo 2 global crops và 6 local crops. Teacher xử lý global, Student xử lý cả hai. Điểm then chốt là Teacher cập nhật qua EMA - chỉ lấy 0.4% từ Student mỗi bước, nên Teacher thay đổi cực chậm."

---

### Slide 8: EMA - Tại sao Teacher cập nhật chậm?
**Style**: Problem-solution format
**Layout**: Two rows

**Nội dung**:
- Problem: "Nếu cả hai train bằng gradient?"
  - Cả hai đuổi theo nhau → Collapse (mọi ảnh = 1 output)

- Solution: "EMA: θ_T ← λ·θ_T + (1-λ)·θ_S"
  - λ = 0.996 → Teacher giữ 99.6% cũ
  - Như thầy giáo kinh nghiệm: không đổi ý theo từng câu hỏi

**Speaker Notes**:
"Tại sao Teacher không train bằng gradient? Vì nếu cả hai cùng thay đổi nhanh, chúng sẽ đuổi theo nhau và collapse. EMA giữ Teacher ổn định - như một thầy giáo kinh nghiệm không đổi ý theo từng câu hỏi của học sinh."

---

### Slide 9: Multi-crop Strategy
**Style**: Visual comparison
**Layout**: Grid showing crops

**Nội dung**:
- 2 Global crops: 224×224, >50% ảnh → Teacher
- 6 Local crops: 96×96, <50% ảnh → Student
- Chi phí: 6 local ≈ 1 global (96² × 6 ≈ 224²)
- Benefit: 8 views, chỉ +50% compute

**Speaker Notes**:
"Multi-crop là trick thông minh về compute. Local crop nhỏ hơn nhiều nên 6 cái chỉ tốn bằng 1 global crop. Kết quả là ta có 8 góc nhìn khác nhau với chi phí tăng rất ít. Teacher chỉ nhận global vì nó cần nhìn toàn cảnh để làm 'đáp án'."

---

### Slide 10: Collapse Prevention - Centering & Sharpening
**Style**: Two-column with before/after
**Layout**: Problem | Solution

**Nội dung**:
| Vấn đề | Giải pháp |
|--------|-----------|
| Mode collapse: Mọi output = 1 vector | Centering: g(x) = f(x) - running_mean |
| Uniform collapse: Output = [1/K, 1/K, ...] | Sharpening: τ = 0.04 rất thấp |

- Ablation: Bỏ centering → Collapse sau 1 epoch!

**Speaker Notes**:
"Collapse là vấn đề lớn nhất của self-supervised learning. Có 2 loại: mode collapse khi mọi output giống nhau, và uniform collapse khi output là phân bố đều. DINO dùng centering để chống mode collapse và temperature thấp để chống uniform collapse. Trong ablation, bỏ centering là collapse ngay sau 1 epoch."

---

### Slide 11: Kết quả DINOv1
**Style**: Results table with highlight
**Layout**: Table + key milestone

**Nội dung**:
| Model | ImageNet Linear Probe |
|-------|----------------------|
| ViT-S/8 (DINO) | 79.7% |
| ViT-B/8 (DINO) | **80.1%** |
| ResNet-50 (Supervised) | 76.5% |

**Milestone**: Lần đầu self-supervised VƯỢT supervised!

**Speaker Notes**:
"Kết quả v1 là một milestone quan trọng: lần đầu tiên self-supervised vượt supervised trên cùng backbone. 80.1% so với 76.5% của supervised ResNet-50. Và nhớ rằng DINO không dùng 1 label nào."

---

## Section 2: DINOv2 - Scaling (9 slides)

### Slide 12: Transition - Limitations của v1
**Style**: Problem list with arrows to solutions
**Layout**: Table format

**Nội dung**:
| Hạn chế v1 | Giải pháp v2 |
|------------|--------------|
| Data nhỏ (1.28M) | LVD-142M (×110) |
| Model nhỏ (86M) | ViT-g (1.1B, ×13) |
| Chỉ classification | Dense tasks (seg, depth) |
| Chỉ DINO loss | DINO + iBOT + KoLeo |

**Speaker Notes**:
"V1 thành công nhưng có 4 hạn chế chính: data nhỏ, model nhỏ, chỉ làm classification tốt, và chỉ có 1 loss. V2 giải quyết tất cả: data ×110, model ×13, thêm dense tasks, và kết hợp 3 losses."

---

### Slide 13: LVD-142M Data Curation
**Style**: Pipeline flowchart
**Layout**: Top-to-bottom flow

**Nội dung**:
```
Crawl 1.2B ảnh từ internet
         ↓
    Lọc NSFW, low-quality
         ↓
    Loại trùng (SSCD)
         ↓
    Nearest neighbor với ImageNet
         ↓
    142M ảnh curated
```
Key insight: Raw 1.2B → 84.2%, Curated 142M → **86.5%**

**Speaker Notes**:
"Data curation là innovation quan trọng nhất của v2. Họ crawl 1.2 tỷ ảnh nhưng sau khi lọc chỉ giữ 142 triệu - ít hơn 8 lần nhưng kết quả tốt hơn! Quality quan trọng hơn quantity."

---

### Slide 14: Three Losses - Overview
**Style**: Three-column comparison
**Layout**: DINO | iBOT | KoLeo

**Nội dung**:
| Loss | Mục đích | Level |
|------|----------|-------|
| DINO | Global understanding | CLS token |
| iBOT | Local understanding | Patch tokens |
| KoLeo | Diversity | Embedding space |

**Speaker Notes**:
"V2 dùng 3 losses. DINO loss cho global understanding qua CLS token. iBOT loss cho local understanding qua patch tokens. KoLeo đảm bảo embeddings trải đều, không tụ lại thành clusters."

---

### Slide 15: iBOT Loss Deep-Dive
**Style**: Diagram + comparison table
**Layout**: Top = diagram, Bottom = MAE comparison

**Nội dung**:
- Diagram: Masked patches → Predict Teacher's tokens
```
[CLS] [P1] [MASK] [P3] [MASK] [P5] ...
              ↓           ↓
         Đoán token từ Teacher (semantic level)
```

| Aspect | MAE | iBOT |
|--------|-----|------|
| Đoán gì? | Pixel RGB | Semantic token |
| Level | Low-level | High-level |

**Speaker Notes**:
"iBOT là masked prediction nhưng khác MAE. MAE đoán pixel RGB - đây là low-level. iBOT đoán semantic token từ Teacher - high-level. Ví dụ: MAE đoán 'pixel màu xám', iBOT đoán 'đây là tai con chó'."

---

### Slide 16: KoLeo Regularization
**Style**: Visual before/after + formula
**Layout**: Left = problem, Center = formula, Right = solution

**Nội dung**:
- Before KoLeo: Embeddings tụ lại (cluster)
- Formula: `L_KoLeo = -1/n Σᵢ log(min_{j≠i} ||zᵢ - zⱼ||)`
- After KoLeo: Embeddings trải đều
- Intuition: "Đẩy nearest neighbors ra xa"

**Speaker Notes**:
"KoLeo giải quyết vấn đề embeddings tụ lại thành clusters. Công thức đơn giản: với mỗi embedding, tìm nearest neighbor và đẩy nó ra xa. Kết quả là embeddings trải đều trong không gian."

---

### Slide 17: Why iBOT Matters - Ablation
**Style**: Ablation table with highlight
**Layout**: Table + insight box

**Nội dung**:
| Bỏ loss nào? | ImageNet | ADE20k (seg) |
|--------------|----------|--------------|
| Full | 86.5% | 49.0 |
| Bỏ iBOT | 86.3% | **44.8** (−4.2) |
| Bỏ KoLeo | 86.0% | 48.5 |

**Insight**: iBOT quan trọng nhất cho dense tasks!

**Speaker Notes**:
"Ablation này rất quan trọng. Bỏ iBOT chỉ giảm 0.2% ImageNet nhưng giảm 4.2 mIoU trên segmentation. Điều này cho thấy DINO loss chỉ học global, còn dense tasks cần iBOT để hiểu từng patch."

---

### Slide 18: Register Tokens
**Style**: Problem-solution with diagram
**Layout**: Top = problem, Bottom = solution

**Nội dung**:
- Problem: Attention artifacts khi scale lớn
- Solution: Thêm 4-8 learnable tokens
```
[CLS] [REG1] [REG2] [REG3] [REG4] [P1] [P2] ... [P196]
       ↑      ↑      ↑      ↑
    "Bãi đỗ xe" cho attention thừa
```
- Kết quả: Attention map sạch hơn

**Speaker Notes**:
"Khi scale ViT lên lớn, xuất hiện attention artifacts - một số vùng nhận attention không hợp lý. Giải pháp là thêm register tokens - những tokens không gắn với pixel nào, đóng vai trò 'bãi đỗ xe' hút attention thừa."

---

### Slide 19: Model Scaling - ViT-g
**Style**: Comparison table
**Layout**: v1 vs v2 specs

**Nội dung**:
| Spec | ViT-B (v1) | ViT-g (v2) | Scale |
|------|------------|------------|-------|
| Params | 86M | 1.1B | ×13 |
| Heads | 12 | 16 | ×1.3 |
| Dim | 768 | 1536 | ×2 |
| Layers | 12 | 40 | ×3.3 |

**Speaker Notes**:
"V2 scale model lên đáng kể: từ 86M lên 1.1 tỷ parameters. Số layers tăng từ 12 lên 40, dimension tăng gấp đôi. Đây là bước nhảy lớn về compute."

---

### Slide 20: Kết quả DINOv2
**Style**: Results table with multi-task comparison
**Layout**: Table + Foundation model badge

**Nội dung**:
| Benchmark | DINOv2 | iBOT | MAE | OpenCLIP |
|-----------|--------|------|-----|----------|
| ImageNet | **86.5%** | 82.3% | 73.5% | 83.5% |
| ADE20k | **49.0** | 44.8 | — | — |
| DAVIS | **76.6** | — | — | — |

**Badge**: "Foundation Model cho Vision"
- 1 backbone, nhiều tasks
- Frozen features, không cần fine-tune

**Speaker Notes**:
"DINOv2 vượt tất cả các phương pháp khác trên mọi benchmark. Quan trọng nhất: đây là foundation model - 1 backbone dùng cho nhiều tasks mà không cần fine-tune. Chỉ cần frozen features + linear head."

---

## Section 3: DINOv3 - 7B Scale (8 slides)

### Slide 21: Transition - Scaling Challenge
**Style**: Scale comparison + problem statement
**Layout**: Top = scale, Bottom = challenge

**Nội dung**:
| Aspect | v2 | v3 | Scale |
|--------|-----|-----|-------|
| Model | 1.1B | 7B | ×6.4 |
| Data | 142M | 1.69B | ×12 |

**Challenge**: Model 7B không dễ train!
- Loss explode
- Gradient không ổn định
- Diverge sau vài nghìn steps

**Speaker Notes**:
"V3 scale lên 7 tỷ parameters - gấp 6 lần v2. Nhưng scale không dễ: model lớn có vấn đề training instability. Loss bùng nổ, gradient không ổn định, diverge sau vài nghìn steps. Cần kỹ thuật mới."

---

### Slide 22: Gram Matrix - Khái niệm
**Style**: Step-by-step explanation
**Layout**: Left = matrix, Right = interpretation

**Nội dung**:
- Feature matrix F: mỗi cột là 1 feature
- Gram matrix: G = F × Fᵀ
- G[i,j] = dot product = correlation giữa feature i và j

```
F:                    G = F × Fᵀ:
[f1, f2, f3, f4]  →   [f1·f1, f1·f2, ...]
                       [f2·f1, f2·f2, ...]
```

**Speaker Notes**:
"Gram matrix là ma trận đo correlation giữa các features. Nếu G[i,j] cao nghĩa là feature i và j thường xuất hiện cùng nhau. Gram matrix capture 'cấu trúc' của features."

---

### Slide 23: Gram Anchoring
**Style**: Problem-solution with ablation
**Layout**: Top = intuition, Bottom = ablation

**Nội dung**:
- Problem: Features thay đổi nhanh → correlation thay đổi → unstable
- Solution: Enforce G_student ≈ G_teacher
```
L_Gram = ||G_student - G_teacher||²
```
- Intuition: "Neo cấu trúc correlation ổn định"

| Setting | Kết quả |
|---------|---------|
| Without Gram Anchoring | Diverge ~5K steps |
| With Gram Anchoring | Stable to 1M+ steps |

**Speaker Notes**:
"Gram Anchoring là innovation chính của v3. Thay vì để features chạy lung tung, chúng ta giữ cấu trúc correlation ổn định bằng cách enforce Gram matrix của Student gần với Teacher. Kết quả: từ diverge 5K steps thành stable 1M+ steps."

---

### Slide 24: Text Alignment - So sánh với CLIP
**Style**: Two-column comparison
**Layout**: CLIP vs DINOv3

**Nội dung**:
| Aspect | CLIP | DINOv3 |
|--------|------|--------|
| Training | Joint (vision + text cùng lúc) | Decoupled (vision trước, text sau) |
| Data | 400M image-text pairs | Images only, text optional |
| Vision bias | Bias về text | Pure visual |
| Khi thêm text | — | Không làm hỏng vision |

**Slogan**: "Learn to see first, learn to talk later"

**Speaker Notes**:
"CLIP train vision và text cùng lúc, nên vision bị bias về những gì text có thể mô tả. DINOv3 train vision trước với DINO, sau đó mới thêm text alignment. Vision features vẫn pure visual, thêm text không làm hỏng vision performance."

---

### Slide 25: Decoupled Training Pipeline
**Style**: Two-phase diagram
**Layout**: Phase 1 → Phase 2

**Nội dung**:
```
Phase 1: Train Vision Encoder (DINO)
├── No text supervision
├── Pure visual understanding
└── Output: Strong vision features

         ↓ Freeze vision

Phase 2: Train Text Alignment
├── Vision frozen
├── Only train text projection
└── Output: Shared embedding space
```

**Speaker Notes**:
"Đây là pipeline 2 pha của DINOv3. Pha 1 train vision thuần túy với DINO losses. Pha 2 freeze vision và chỉ train text alignment. Cách này đảm bảo vision không bị ảnh hưởng bởi text supervision."

---

### Slide 26: Scaling Analysis - When Does Scale Help?
**Style**: Chart showing diminishing returns
**Layout**: Line chart + insight box

**Nội dung**:
| Benchmark | v2 | v3 | Δ |
|-----------|-----|-----|-----|
| ImageNet | 86.5% | 88.4% | +1.9 |
| ADE20k | 49.0 | 55.9 | **+6.9** |
| DAVIS | 76.6 | 83.3 | **+6.7** |

**Insight**: Dense tasks được lợi nhiều nhất từ scaling!
- Classification: Gần bão hòa
- Segmentation/Video: Scale giúp nhiều

**Speaker Notes**:
"Nhìn vào kết quả: ImageNet chỉ tăng 1.9% nhưng ADE20k tăng 6.9 mIoU. Classification đã gần bão hòa - 88% khó tăng thêm. Nhưng dense tasks như segmentation và video vẫn được lợi nhiều từ scaling."

---

### Slide 27: Kết quả DINOv3
**Style**: Comprehensive results table
**Layout**: Multi-benchmark comparison

**Nội dung**:
| Benchmark | DINOv2 | DINOv3 | Δ |
|-----------|--------|--------|-----|
| ImageNet Linear | 86.5% | 88.4% | +1.9 |
| ImageNet Fine-tune | — | **89.9%** | — |
| ADE20k (seg) | 49.0 | 55.9 | +6.9 |
| DAVIS (video) | 76.6 | 83.3 | +6.7 |

**Record**: 88.4% ImageNet chỉ với linear probe!

**Speaker Notes**:
"DINOv3 đạt 88.4% ImageNet với chỉ linear probe - gần bằng supervised fine-tuned models. Trên dense tasks như ADE20k và DAVIS, improvement còn lớn hơn. Đây là state-of-the-art cho self-supervised vision."

---

### Slide 28: Future Directions
**Style**: Roadmap with arrows
**Layout**: Current → Future

**Nội dung**:
**Classification**: Gần bão hòa, không cần scale thêm

**Focus mới**:
- Dense prediction (segmentation, depth)
- Video understanding
- 3D vision
- Multimodal (vision + language + audio)

**Speaker Notes**:
"Classification đã gần trần, không cần invest thêm. Hướng đi tương lai là dense prediction, video, 3D, và multimodal. DINO là nền tảng tốt cho tất cả những hướng này vì pure visual features."

---

## Section 4: Tổng hợp (4 slides)

### Slide 29: Evolution Timeline
**Style**: Timeline with key innovations
**Layout**: Horizontal timeline

**Nội dung**:
```
2021 ──────────────── 2023 ──────────────── 2025
 │                     │                     │
DINOv1                DINOv2                DINOv3
 │                     │                     │
 ├─ Self-distillation  ├─ LVD-142M          ├─ Gram Anchoring
 ├─ Multi-crop         ├─ iBOT + KoLeo      ├─ Text Alignment
 ├─ Centering/Sharp    ├─ Register tokens   ├─ 7B scale
 └─ 80.1% ImageNet     └─ 86.5% ImageNet    └─ 88.4% ImageNet
```

**Speaker Notes**:
"Nhìn lại timeline: v1 đặt nền móng với self-distillation và multi-crop. V2 scale data và model, thêm losses và register tokens. V3 giải quyết training stability với Gram Anchoring và thêm text alignment."

---

### Slide 30: Key Takeaways
**Style**: Bullet points with icons
**Layout**: 4-5 key points

**Nội dung**:
1. **Self-supervised có thể vượt supervised**: 88.4% vs 85.7% ImageNet
2. **Quality > Quantity**: 142M curated > 1.2B raw
3. **Dense tasks cần local understanding**: iBOT quan trọng
4. **Scale cần stability techniques**: Gram Anchoring
5. **Decoupled > Joint**: Cho multimodal

**Speaker Notes**:
"5 takeaways chính: Self-supervised đã vượt supervised. Data curation quan trọng hơn số lượng. Dense tasks cần iBOT. Scale lớn cần Gram Anchoring. Và multimodal nên train decoupled để không bias vision."

---

### Slide 31: Practical Applications
**Style**: Grid of use cases
**Layout**: 2×2 or 3×2 grid

**Nội dung**:
| Use Case | Benefit |
|----------|---------|
| Image Search | Semantic similarity |
| Object Detection | Pretrained backbone |
| Medical Imaging | Few-shot learning |
| Video Analysis | Temporal understanding |
| 3D Reconstruction | Dense features |
| Robotics | Visual perception |

**Speaker Notes**:
"DINO có nhiều ứng dụng thực tế. Image search dùng semantic similarity. Object detection dùng làm pretrained backbone. Medical imaging được lợi từ few-shot learning vì ít data gán nhãn. Video và robotics cũng là các ứng dụng quan trọng."

---

### Slide 32: Resources & Q&A
**Style**: Clean list with links
**Layout**: Two columns (Resources | Q&A)

**Nội dung**:
**Papers**:
- DINOv1: Caron et al. ICCV 2021
- DINOv2: Oquab et al. TMLR 2024
- DINOv3: Siméoni et al. arXiv 2025

**Code**:
- github.com/facebookresearch/dinov2

**Q&A**: Cảm ơn đã lắng nghe!

**Speaker Notes**:
"Đây là các tài liệu tham khảo. Các bạn có câu hỏi gì không?"

---

# Review Checklist (Từ góc nhìn người nghe)

## Cognitive Load

| Slide | Concepts | Status | Notes |
|-------|----------|--------|-------|
| 1-2 | Motivation | ✅ | Dễ hiểu |
| 3-4 | Demo + Core insight | ✅ | Example first |
| 5-6 | Patches, Attention | ⚠️ | Cần visual, analogy |
| 7-8 | Architecture, EMA | ⚠️ | Complex diagram |
| 9-10 | Multi-crop, Collapse | ✅ | Good pacing |
| 11 | Results | ✅ | Clear |
| 12-14 | v2 intro, losses | ✅ | Table format helps |
| 15-17 | iBOT, KoLeo, Ablation | ⚠️ | New math |
| 18-20 | Register, Scale, Results | ✅ | Visual helps |
| 21-24 | v3 challenges, Gram | ⚠️ | Most complex |
| 25-28 | Pipeline, Scaling | ✅ | Good analysis |
| 29-32 | Summary | ✅ | Clear wrap-up |

## Terminology Audit

| Term | First defined | Used again | OK? |
|------|--------------|------------|-----|
| Patch | Slide 5 | Throughout | ✅ |
| Attention | Slide 6 | Throughout | ✅ |
| CLS token | Slide 5 | Throughout | ✅ |
| EMA | Slide 8 | Throughout | ✅ |
| Cross-entropy | Slide 7 (implicit) | — | ⚠️ Need explicit |
| Linear probe | Slide 11 | — | ⚠️ Need define |
| mIoU | Slide 17 | — | ⚠️ Need define |
| Gram matrix | Slide 22 | Throughout | ✅ |

## Recommendations

1. **Slide 5-6**: Thêm visual animation cho patches/attention nếu có thể
2. **Slide 7**: Thêm note giải thích cross-entropy loss đơn giản
3. **Slide 11**: Định nghĩa "linear probe" trong speaker notes
4. **Slide 17**: Định nghĩa mIoU trong speaker notes hoặc slide
5. **Slide 15-16**: Math có thể overwhelming, cần simplify trong notes
6. **Slide 22-23**: Gram matrix cần step-by-step visual

## Math Complexity Check

| Formula | Slide | Simplified explanation provided? |
|---------|-------|----------------------------------|
| Attention(Q,K,V) | 6 | ✅ "Tìm K giống Q, lấy V" |
| EMA update | 8 | ✅ "99.6% cũ + 0.4% mới" |
| Cross-entropy | 7 | ⚠️ Need add |
| KoLeo | 16 | ✅ "Đẩy neighbors xa" |
| Gram | 22-23 | ✅ "Correlation matrix" |

---

*Outline version 1.0 — Ready for review*
