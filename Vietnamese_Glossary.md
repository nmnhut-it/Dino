# Vietnamese Technical Glossary for DINO Seminar
## Bảng thuật ngữ kỹ thuật

> Có thể in ra làm handout cho người nghe

---

## Core Concepts (Khái niệm cốt lõi)

| English | Vietnamese | Định nghĩa đơn giản |
|---------|------------|---------------------|
| **Self-supervised learning** | Học tự giám sát | Model tự tạo "bài tập" từ data, không cần người gán nhãn |
| **Knowledge distillation** | Chưng cất tri thức | Teacher dạy Student bằng output mềm, không phải nhãn cứng |
| **Self-distillation** | Tự chưng cất | Teacher tạo từ chính Student (không train riêng) |
| **Foundation model** | Model nền tảng | Model pretrained dùng được cho nhiều tasks khác nhau |

---

## Vision Transformer (ViT)

| English | Vietnamese | Định nghĩa đơn giản |
|---------|------------|---------------------|
| **Patch** | Mảnh | Một phần nhỏ của ảnh (thường 16×16 pixels) |
| **Embedding** | Vector nhúng | Vector số đại diện cho patch hoặc ảnh |
| **Positional encoding** | Mã hóa vị trí | Thông tin cho model biết patch ở đâu trong ảnh |
| **CLS token** | Token phân loại | Vector đặc biệt đại diện cho toàn bộ ảnh |
| **Attention** | Cơ chế chú ý | Cách model quyết định nên "nhìn" vào đâu |
| **Attention head** | Đầu attention | Một "góc nhìn" độc lập, ViT-B có 12 heads |
| **Multi-head attention** | Attention đa đầu | Nhiều heads chạy song song, mỗi head học 1 khía cạnh |
| **Query (Q)** | Truy vấn | "Câu hỏi" của token hiện tại |
| **Key (K)** | Khóa | "Mã nhận dạng" của các tokens khác |
| **Value (V)** | Giá trị | Nội dung thực sự của các tokens |
| **Transformer** | Transformer | Kiến trúc dùng attention, từ NLP sang vision |
| **ViT** | Vision Transformer | Transformer áp dụng cho ảnh |

---

## DINO Components (Thành phần DINO)

| English | Vietnamese | Định nghĩa đơn giản |
|---------|------------|---------------------|
| **Teacher** | Thầy | Network nhìn global crop, cập nhật chậm qua EMA |
| **Student** | Học sinh | Network nhìn local crop, train bằng gradient |
| **EMA** | Trung bình động | Exponential Moving Average: cách cập nhật Teacher |
| **Projection head** | Đầu chiếu | MLP nhỏ sau ViT, chuyển đổi features |
| **Temperature (τ)** | Nhiệt độ | Kiểm soát độ sắc/mềm của softmax output |
| **Softmax** | Softmax | Chuyển số thô thành xác suất (tổng = 1) |
| **Cross-entropy** | Entropy chéo | Loss đo sự khác biệt giữa 2 phân bố |
| **Collapse** | Sụp đổ | Lỗi khi mọi ảnh cho ra cùng output |
| **Centering** | Căn giữa | Trừ running mean để chống mode collapse |
| **Sharpening** | Làm sắc | Dùng temperature thấp để chống uniform collapse |
| **Multi-crop** | Cắt nhiều góc | Tạo global + local crops từ 1 ảnh |
| **Global crop** | Crop toàn cục | Vùng lớn (>50% ảnh), Teacher nhận |
| **Local crop** | Crop cục bộ | Vùng nhỏ (<50% ảnh), Student nhận |

---

## DINOv2 Additions (Bổ sung v2)

| English | Vietnamese | Định nghĩa đơn giản |
|---------|------------|---------------------|
| **iBOT** | iBOT | Masked prediction ở mức semantic (không phải pixel) |
| **KoLeo** | KoLeo | Regularization đẩy embeddings trải đều trong không gian |
| **Register token** | Token đăng ký | Learnable tokens để "hút" extra attention |
| **Data curation** | Lọc dữ liệu | Chọn lọc data chất lượng từ raw data |
| **SSCD** | SSCD | Self-Supervised Copy Detection: loại ảnh trùng |
| **Faiss** | Faiss | Thư viện tìm nearest neighbor nhanh |

---

## DINOv3 Additions (Bổ sung v3)

| English | Vietnamese | Định nghĩa đơn giản |
|---------|------------|---------------------|
| **Gram matrix** | Ma trận Gram | G = FFᵀ, đo tương quan giữa features |
| **Gram Anchoring** | Neo Gram | Giữ Gram matrix ổn định để train model lớn |
| **Text Alignment** | Căn chỉnh text | Kết nối vision và language embeddings |
| **Decoupled training** | Train tách rời | Train vision trước, thêm text sau |
| **Contrastive loss** | Loss tương phản | Kéo cặp giống gần, đẩy cặp khác xa |

---

## Evaluation Metrics (Chỉ số đánh giá)

| English | Vietnamese | Định nghĩa đơn giản |
|---------|------------|---------------------|
| **Linear probe** | Đầu tuyến tính | Chỉ train 1 layer linear trên frozen features |
| **Fine-tuning** | Tinh chỉnh | Train lại toàn bộ hoặc một phần model |
| **Frozen features** | Features đóng băng | Không cập nhật backbone, chỉ train classifier |
| **mIoU** | mIoU | Mean Intersection over Union (đo segmentation) |
| **Dense prediction** | Dự đoán dày | Dự đoán cho từng pixel (seg, depth, etc.) |

---

## Datasets (Bộ dữ liệu)

| English | Mô tả |
|---------|-------|
| **ImageNet** | 1.28M ảnh, 1000 classes (classification) |
| **ADE20k** | 150 classes (semantic segmentation) |
| **DAVIS** | Video object segmentation |
| **LVD-142M** | 142M ảnh curated từ internet (DINOv2) |
| **LVD-1.69B** | 1.69B ảnh curated (DINOv3) |

---

## Math Notation (Ký hiệu toán học)

| Ký hiệu | Ý nghĩa | Ví dụ |
|---------|---------|-------|
| θ_T | Parameters của Teacher | θ_T ← λ·θ_T + (1-λ)·θ_S |
| θ_S | Parameters của Student | |
| P_t | Output probability của Teacher | P_t = softmax(z_t / τ_t) |
| P_s | Output probability của Student | P_s = softmax(z_s / τ_s) |
| τ | Temperature | τ_t = 0.04, τ_s = 0.1 |
| λ | EMA coefficient | λ = 0.996 → 1.0 |
| K | Số prototypes | K = 65,536 |
| d | Embedding dimension | d = 768 (ViT-B) |
| G | Gram matrix | G = FFᵀ |
| L | Loss function | L = -Σ P_t · log(P_s) |

---

## Quick Formulas (Công thức nhanh)

### Attention
```
Attention(Q, K, V) = softmax(QK^T / √d) × V
```
*"Tìm K giống Q nhất, lấy V tương ứng"*

### EMA Update
```
θ_T ← λ·θ_T + (1-λ)·θ_S
```
*"Teacher giữ 99.6% cũ, lấy 0.4% từ Student"* (λ = 0.996)

### Cross-Entropy Loss
```
L = -Σ P_t · log(P_s)
```
*"Phạt nặng khi Teacher chắc nhưng Student sai"*

### KoLeo Loss
```
L_KoLeo = -1/n Σᵢ log(min_{j≠i} ||zᵢ - zⱼ||)
```
*"Đẩy nearest neighbors ra xa"*

### Gram Matrix
```
G = F × Fᵀ
```
*"Đo tương quan giữa các features"*

---

## Analogies (Phép so sánh)

| Concept | Analogy |
|---------|---------|
| **Attention** | Tra từ điển: Query = từ cần tra, Key = mục từ, Value = định nghĩa |
| **CLS token** | Học sinh tổng hợp: không thuộc nhóm nào, nhưng "nghe" tất cả |
| **EMA** | Thầy giáo kinh nghiệm: không đổi ý theo từng câu hỏi |
| **Multi-crop** | Nhìn cái vây cá → biết là con cá |
| **Knowledge distillation** | Chuyên gia dạy học viên bằng cách giải thích, không chỉ đáp án |
| **Register tokens** | "Bãi đỗ xe" cho attention thừa |
| **Gram Anchoring** | "Neo tàu" giữ features không trôi |

---

*Glossary version 1.0 — DINO Seminar 2025*
