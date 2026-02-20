# Audience Review - DINO Seminar v6.3

> **Vai trò**: CS student có ML cơ bản (biết neural network, loss function, gradient descent)
> **Mục tiêu**: Xác định các vấn đề có thể gây khó hiểu

---

## 1. Cognitive Load Analysis

### Slide 5-6: Prerequisites (Patches & Attention)
**Vấn đề**: Hai slide liên tiếp giới thiệu nhiều concept mới
- Patch, embedding, positional encoding (slide 5)
- Query, Key, Value, softmax, multi-head (slide 6)

**Đánh giá**: ⚠️ **Medium risk**
- Audience có ML cơ bản nên biết softmax
- Nhưng Q/K/V concept có thể mới

**Đề xuất**:
- Giữ nguyên structure
- Speaker notes cần có ví dụ cụ thể cho Q/K/V
- Analogy "thư viện" rất tốt, giữ lại

---

### Slide 7: DINO Architecture
**Vấn đề**: Diagram phức tạp với nhiều thành phần

**Đánh giá**: ⚠️ **Medium risk**
- Nhiều mũi tên và components
- Nhưng đây là slide quan trọng, cần chi tiết

**Đề xuất**:
- Build-up animation nếu PPTX cho phép
- Hoặc highlight từng phần khi nói
- Speaker notes đã đủ chi tiết

---

### Slide 15-16: iBOT & KoLeo
**Vấn đề**: Hai loss mới liên tiếp với math

**Đánh giá**: ⚠️ **Medium risk**
- iBOT công thức tương tự DINO nên OK
- KoLeo formula mới: `-1/n Σ log(min||z_i - z_j||)`

**Đề xuất**:
- KoLeo: Focus vào intuition "đẩy neighbors ra xa"
- Bỏ qua ký hiệu toán học trong speech, chỉ giữ visual
- Diagram before/after là đủ

---

### Slide 22-23: Gram Matrix & Anchoring
**Vấn đề**: Concept mới nhất và trừu tượng nhất

**Đánh giá**: ⚠️⚠️ **High risk**
- Gram matrix = F×Fᵀ có thể khó hình dung
- "Correlation giữa features" cần ví dụ cụ thể

**Đề xuất**:
1. Thêm ví dụ cụ thể vào speaker notes:
   - "Feature 1 detect cạnh, Feature 2 detect góc"
   - "Gram matrix cho biết cạnh và góc có xuất hiện cùng nhau không"
2. Hoặc dùng analogy:
   - "Như ma trận correlation trong statistics"
   - "Nếu 2 cổ phiếu có correlation cao, chúng tăng/giảm cùng nhau"

---

## 2. Terminology Gaps

### Phải định nghĩa rõ ràng:

| Term | Slide xuất hiện | Vấn đề | Giải pháp |
|------|-----------------|--------|-----------|
| **Linear probe** | 11, 20, 27 | Không định nghĩa | Thêm: "Chỉ train 1 layer linear trên frozen features" |
| **mIoU** | 17, 26, 27 | Không định nghĩa | Thêm: "Mean Intersection over Union - đo chất lượng segmentation" |
| **Cross-entropy** | 7 | Công thức có nhưng không giải thích | Thêm: "Phạt nặng khi Teacher chắc nhưng Student sai" |
| **Dense tasks** | 12, 14, 17 | Xuất hiện nhiều lần | Thêm lần đầu: "Dự đoán cho từng pixel (segmentation, depth)" |
| **Prototypes** | Architecture | K=65,536 nhưng không giải thích | Thêm: "Số 'categories' ẩn mà model tự học" |

### Đã định nghĩa tốt:
- Patch ✅ (Slide 5)
- Attention ✅ (Slide 6)
- CLS token ✅ (Slide 5)
- EMA ✅ (Slide 8)
- Collapse ✅ (Slide 10)
- Gram matrix ✅ (Slide 22)

---

## 3. Flow & Pacing Issues

### Transition Slide 2 → 3
**Vấn đề**: Từ "vấn đề supervised" nhảy thẳng vào "DINO demo"

**Đề xuất**: OK vì demo first là intentional - show trước, giải thích sau

---

### Transition Slide 11 → 12
**Vấn đề**: Từ "kết quả v1" sang "limitations v1"

**Đề xuất**: Thêm 1 câu transition trong speaker notes:
- "V1 đạt 80.1% - impressive! Nhưng vẫn có 4 hạn chế cần giải quyết..."

---

### Transition Slide 20 → 21
**Vấn đề**: Từ "kết quả v2" sang "scaling challenges v3"

**Đề xuất**: Tương tự, thêm transition:
- "V2 đã là foundation model. Nhưng liệu có thể scale thêm? V3 thử với 7B params..."

---

## 4. Math Complexity

### Acceptable Math (có simplified explanation):
| Formula | Slide | Simplified | OK? |
|---------|-------|------------|-----|
| `Attention(Q,K,V) = softmax(QK^T/√d)×V` | 6 | "Tìm K giống Q, lấy V" | ✅ |
| `θ_T ← λ·θ_T + (1-λ)·θ_S` | 8 | "99.6% cũ + 0.4% mới" | ✅ |
| `L_KoLeo = -1/n Σ log(min||z||)` | 16 | "Đẩy neighbors xa" | ✅ |
| `G = F×Fᵀ` | 22 | "Correlation matrix" | ✅ |

### Need More Explanation:
| Formula | Slide | Issue | Fix |
|---------|-------|-------|-----|
| `L = -Σ P_t · log(P_s)` | 7 | Không giải thích | Thêm: "Phạt nặng khi P_t cao nhưng P_s thấp" |

---

## 5. Visual Recommendations

### Slides cần animation/build-up:
1. **Slide 7** (Architecture): Build từng component
2. **Slide 9** (Multi-crop): Show global trước, local sau
3. **Slide 13** (Data pipeline): Từng bước filtering
4. **Slide 22** (Gram matrix): F → Fᵀ → G step by step

### Slides cần color coding:
1. **Slide 7**: Teacher = xanh, Student = cam
2. **Slide 14**: 3 losses = 3 màu khác nhau
3. **Slide 24**: CLIP = đỏ, DINO = xanh

### Slides cần before/after:
1. **Slide 3**: Input → Attention maps
2. **Slide 16**: Before KoLeo → After KoLeo
3. **Slide 18**: Attention artifacts → Clean attention

---

## 6. Speaker Notes Audit

### Missing context in notes:

**Slide 7**: Cần thêm
- "Projection head là gì? MLP 3 layers để chuyển features"
- "Tại sao τ_t < τ_s? Teacher cần sharp output, Student soft hơn để dễ học"

**Slide 9**: Cần thêm
- "96×96 chỉ bằng ~18% diện tích 224×224"

**Slide 12**: Cần thêm
- "Dense tasks là gì? Dự đoán per-pixel như segmentation, depth estimation"

**Slide 17**: Cần thêm
- "mIoU là gì? Mean Intersection over Union - đo overlap giữa prediction và ground truth"

**Slide 22**: Cần thêm
- Ví dụ cụ thể về features: "Feature 1 detect edges, Feature 2 detect corners..."

---

## 7. Audience Questions Prediction

### Questions có thể được hỏi:

1. **"Tại sao không dùng contrastive learning?"**
   - Đề xuất: Thêm 1 câu trong slide 4 hoặc 8
   - "DINO khác contrastive: không cần negative samples, không cần augmentation consistency"

2. **"K=65,536 từ đâu ra?"**
   - Đề xuất: Note trong slide 7
   - "K được chọn qua hyperparameter tuning, cần đủ lớn để capture diversity"

3. **"Register tokens học được gì?"**
   - Đề xuất: Note trong slide 18
   - "Register tokens tự học để 'hút' attention từ low-information patches"

4. **"Text alignment có cần nhiều data text-image không?"**
   - Đề xuất: Note trong slide 25
   - "Ít hơn CLIP nhiều vì chỉ train text projection, vision đã frozen"

5. **"Có thể dùng DINO cho video không?"**
   - Đề xuất: Đã có trong slide 31 (DAVIS benchmark)

---

## 8. Overall Assessment

### Strengths:
1. ✅ Example-first approach (Slide 3 demo trước theory)
2. ✅ Consistent terminology
3. ✅ Good use of analogies (thư viện, thầy giáo)
4. ✅ Clear ablation results
5. ✅ Balanced v1/v2/v3 (9/9/8 slides)

### Weaknesses to Fix:
1. ⚠️ Some undefined terms (linear probe, mIoU, dense tasks)
2. ⚠️ Gram matrix section needs more concrete examples
3. ⚠️ Missing transitions between sections
4. ⚠️ Cross-entropy loss not explained

### Priority Fixes:

**High Priority** (phải sửa):
1. Định nghĩa "linear probe" trong slide 11 speaker notes
2. Định nghĩa "mIoU" trong slide 17 speaker notes
3. Thêm ví dụ cụ thể cho Gram matrix slide 22
4. Giải thích cross-entropy slide 7

**Medium Priority** (nên sửa):
1. Transition notes giữa sections
2. Color coding cho Teacher/Student
3. Animation cho complex diagrams

**Low Priority** (có thể bỏ qua):
1. More analogies for iBOT
2. Extended Q&A preparation

---

## 9. Revised Speaker Notes (High Priority Items)

### Slide 7 - Thêm vào cuối notes:
```
"Cross-entropy loss hoạt động thế nào? Khi Teacher output [0.9, 0.05, 0.05]
(rất chắc chắn), nếu Student output [0.1, 0.45, 0.45] (không chắc),
loss sẽ rất cao. Công thức 'phạt' khi Teacher confident nhưng Student sai."
```

### Slide 11 - Thêm trước khi nói kết quả:
```
"Linear probe nghĩa là gì? Freeze toàn bộ backbone DINO, chỉ train 1 layer
linear classification head. Nếu features tốt, chỉ cần 1 layer linear cũng
đủ classify tốt. Đây là cách đánh giá quality của features."
```

### Slide 17 - Thêm trước khi đọc bảng:
```
"mIoU - Mean Intersection over Union - là metric cho segmentation.
Đo overlap giữa prediction mask và ground truth mask. 49.0 mIoU nghĩa là
trung bình prediction overlap 49% với ground truth. Cao hơn là tốt hơn."
```

### Slide 22 - Thêm ví dụ:
```
"Ví dụ cụ thể: giả sử có 4 features:
- f1: detect vertical edges
- f2: detect horizontal edges
- f3: detect corners
- f4: detect textures

Gram matrix G[1,3] cao nghĩa là vertical edges và corners thường xuất hiện
cùng nhau trong cùng 1 ảnh. Đây là 'cấu trúc' mà model học được."
```

---

## 10. Final Checklist

- [ ] Cập nhật speaker notes với high priority fixes
- [ ] Thêm terminology definitions
- [ ] Review lại flow với transitions
- [ ] Generate v6.3 với revised content

---

*Review completed - Ready for approval*
