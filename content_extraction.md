# DINO Presentation Content Extraction

## Current Structure (6 sections)
1. Vấn đề (Chi phí gán nhãn)
2. ViT (Vision Transformer) - **TO REMOVE**
3. DINOv1 (2021)
4. DINOv2 (2023)
5. DINOv3 (2025)
6. Tổng hợp

## Proposed New Structure (5 sections)
1. Vấn đề (Chi phí gán nhãn)
2. DINOv1 (2021) - **EXPAND: rationale & structure**
3. DINOv2 (2023) - **EXPAND: rationale & structure**
4. DINOv3 (2025) - **EXPAND: rationale & structure**
5. Tổng hợp

---

## SLIDE 1 — Title
**Content:**
- DINO
- self-DIstillation with NO labels
- v1 · 2021    v2 · 2023    v3 · 2025
- Nguyễn Minh Nhựt – 25C15019
- Nguyễn Phước Thiện – 25C15060
- Nguyễn Thiện Thuật – 25C15025
- Trương Thế Khải – 25C15042

**Notes:**
Chào mọi người. Hôm nay nhóm mình trình bày về DINO — viết tắt của "self-DIstillation with NO labels", tức là tự chưng cất tri thức mà không cần nhãn gì cả. Đây là dòng nghiên cứu của Meta AI, trước đây là Facebook AI Research.

Có 3 phiên bản: v1 năm 2021, v2 năm 2023, v3 năm 2025. Mỗi bản lớn hơn và mạnh hơn bản trước. Đọc là "đai-nô".

Mục tiêu: train model nhìn ảnh mà không cần ai gán nhãn, nhưng kết quả ngang hoặc vượt supervised learning. Nghe có vẻ "quá đẹp để là thật", nhưng cuối buổi mọi người sẽ thấy nó thật sự hoạt động.

---

## SLIDE 2 — Mục lục
**Content:** Nội dung
- 01 Chi phí gán nhãn
- 02 Vision Transformer **(REMOVE)**
- 03 DINOv1 (2021)
- 04 DINOv2 (2023)
- 05 DINOv3 (2025)
- 06 Tổng hợp

**Notes:**
6 phần. Phần 1 nói tại sao supervised learning tốn kém — cần người gán nhãn, tốn tiền, tốn thời gian.

Phần 2 giới thiệu nhanh Vision Transformer vì DINO dựa trên kiến trúc này. Mình nói vừa đủ để hiểu DINO.

Phần 3, 4, 5 là trọng tâm: 3 phiên bản DINO. Cuối cùng tổng hợp so sánh.

---

## SECTION 1: Chi phí gán nhãn

### SLIDE 3 — Chi phí gán nhãn
**Content:**
- 49,000 người gán nhãn
- 14M ảnh có nhãn
- $500K+ ước tính chi phí
- 167 quốc gia
- 3× kiểm tra mỗi ảnh
- 2 năm thời gian

Source: Deng et al. CVPR 2009 · Li & Deng 2017

**Notes:**
Trước khi vào DINO, mình muốn mọi người cảm nhận supervised learning tốn kém cỡ nào.

Đây là số liệu thật của ImageNet — dataset phổ biến nhất trong computer vision. Để gán nhãn 14 triệu ảnh, nhóm của giáo sư Fei-Fei Li ở Stanford phải thuê 49 nghìn người từ 167 nước qua Amazon Mechanical Turk. Mỗi ảnh kiểm tra 3 lần bởi 3 người khác nhau. Tổng chi phí hơn nửa triệu đô, mất 2 năm.

Và đó mới chỉ là 1 dataset cho 1000 class. Mỗi bài toán mới — y tế, vệ tinh, nông nghiệp — lại cần gán nhãn lại từ đầu. Gán nhãn y tế còn đắt hơn vì cần bác sĩ chuyên khoa. Câu hỏi tự nhiên: có cách nào học mà không cần nhãn không? Đó là self-supervised learning.

---

### SLIDE 4 — Self-supervised learning
**Content:**
- Ảnh không nhãn → Self-Supervised Learning → Đặc trưng có ý nghĩa
- Model tự đặt bài tập cho chính nó

**Notes:**
Giải pháp: self-supervised learning — gọi tắt SSL.

Thay vì thuê người gán nhãn, để model tự tạo tín hiệu giám sát từ dữ liệu thô. Ví dụ: che một phần ảnh rồi bắt model đoán phần bị che. Hoặc xoay ảnh rồi bắt đoán góc xoay. Qua đó model buộc phải hiểu cấu trúc ảnh, học được đặc trưng hữu ích.

3 hướng chính: contrastive learning (SimCLR, MoCo) — so sánh cặp ảnh; masked image modeling (MAE) — che rồi đoán; distillation (BYOL, DINO) — teacher-student. DINO thuộc nhóm thứ ba, đặc biệt là không cần negative pairs.

Pretrain bằng SSL trên hàng triệu ảnh không nhãn, rồi fine-tune với rất ít nhãn cũng cho kết quả tốt. Tiếp theo mình giới thiệu backbone mà DINO dùng: Vision Transformer.

---

## SECTION 2: Vision Transformer — **TO REMOVE**

### SLIDE 5 — ViT pipeline
**Content:**
- Ảnh 224×224 → Patch 16×16 → Vector 768-d → Vị trí → Transformer
- 14×14 = 196 patches + 1 token CLS

Source: Dosovitskiy et al. ICLR 2021

**Notes:**
Vision Transformer (ViT) do Dosovitskiy và nhóm Google Brain đề xuất năm 2021.

Ý tưởng: cắt ảnh thành mảnh nhỏ, mỗi mảnh xử lý như 1 "từ" trong câu, rồi đưa vào Transformer giống xử lý ngôn ngữ. Ảnh 224×224 chia thành patch 16×16, được 14×14 = 196 patch. Mỗi patch qua linear layer thành vector 768 chiều — giống word embedding.

Thêm positional embedding để model biết patch nào ở đâu. Thêm 1 token đặc biệt gọi là CLS ở đầu chuỗi. CLS là gì, mình giải thích slide tiếp.

---

### SLIDE 6 — Token CLS
**Content:**
- [CLS] + 196 patches → Transformer → Output CLS = đặc trưng cả bức ảnh
- CLS không mang pixel, chỉ "lắng nghe" tất cả 196 patch qua attention rồi tổng hợp

**Notes:**
CLS viết tắt của Classification token. Đây là 1 vector học được (learnable), không gắn với pixel nào trong ảnh. Nó được đặt ở vị trí đầu tiên trong chuỗi input, cùng với 196 patch tokens.

Khi đi qua Transformer, CLS "lắng nghe" tất cả 196 patch qua cơ chế attention — mỗi layer, CLS cập nhật bản thân bằng cách tổng hợp thông tin từ tất cả các patch. Sau nhiều layer, output của CLS trở thành đặc trưng đại diện cho toàn bộ bức ảnh.

Tại sao cần CLS thay vì average pool tất cả patch? Vì CLS linh hoạt hơn — nó tự học cách tổng hợp thông tin, không bị ép lấy trung bình đều. Trong DINO, output CLS chính là thứ Teacher và Student so sánh với nhau.

Giờ mình nói nhanh cơ chế attention rồi so sánh ViT với CNN.

---

### SLIDE 7 — Self-attention
**Content:**
- Attention(Q, K, V) = softmax(QKᵀ / √dₖ) · V
- QKᵀ: Ai giống ai?
- ÷ √dₖ: Giữ ổn định
- softmax: Chọn trọng số
- 12 heads × 64 chiều = 768 tổng

Source: Vaswani et al. NeurIPS 2017

**Notes:**
Self-attention là cơ chế cốt lõi của Transformer. Mỗi patch tạo 3 vector: Query, Key, Value. Q nhân K transpose đo 2 patch giống nhau bao nhiêu. Chia căn dₖ (=64) để không quá lớn, tránh softmax bão hoà. Softmax chuyển thành xác suất, tổng bằng 1. Nhân với Value lấy output.

ViT-B có 12 attention head, mỗi head 64 chiều, ghép lại 768. Mỗi head học nhìn 1 khía cạnh: texture, đường viền, màu, hình dáng.

Phát hiện quan trọng từ DINO: khi train self-supervised, các head tự học cách tách vật thể khỏi nền mà không ai dạy — mình sẽ quay lại điểm này khi nói kết quả.

So sánh ViT với CNN: CNN nhìn cục bộ, ViT nhìn toàn cục ngay. DINO cho thấy ViT phù hợp hơn cho SSL: 80.1% so với 75.3% của ResNet-50. Giờ vào phần chính: DINO.

---

## SECTION 3: DINOv1 (2021)

### SLIDE 8 — Knowledge distillation
**Content:**
- Teacher (lớn, mạnh) → dạy → Student (nhỏ, nhanh)
- DINO: self-distillation
- Cùng kiến trúc, khác tham số
- Teacher tạo từ Student qua EMA

**Notes:**
Trước khi vào DINO, cần hiểu knowledge distillation. Ý tưởng từ Hinton 2015: model lớn (Teacher) đã train xong, nén tri thức sang model nhỏ (Student). Student không học nhãn cứng mà học output mềm — phân bố xác suất — từ Teacher.

Ví dụ: thay vì "đây là mèo" (nhãn cứng [1,0,0]), Teacher nói "80% mèo, 15% chó, 5% hổ". Student học được rằng mèo giống chó hơn giống ô tô. Hinton gọi đây là "dark knowledge".

DINO đặc biệt: Teacher và Student cùng kiến trúc, cùng kích thước. Teacher không train sẵn mà tạo từ Student qua EMA. Gọi là self-distillation — tự chưng cất. Không có nhãn, tín hiệu giám sát lấy từ đâu? Từ Teacher. Teacher chính là "nguồn đáp án". Mình xem cụ thể.

---

### SLIDE 9 — DINO tổng quan
**Content:**
- Ảnh gốc → global crop → Teacher ViT
- Ảnh gốc → local crop → Student ViT
- EMA ↑ (Teacher cập nhật từ Student)
- L = −Σ Pₜ·log Pₛ (Cross-entropy loss)

Source: Caron et al. ICCV 2021

**Notes:**
Toàn bộ pipeline DINO trong 1 slide. Từ 1 ảnh, tạo crop lớn cho Teacher, crop nhỏ cho Student. Cả hai qua ViT, lấy output CLS, softmax thành phân bố. Loss là cross-entropy.

Student cập nhật gradient bình thường. Teacher không train gradient, chỉ cập nhật chậm từ Student qua EMA. Ý tưởng: Student nhìn 1 góc nhỏ nhưng phải output giống Teacher đang nhìn toàn bộ. Buộc Student hiểu toàn cục từ cục bộ.

Bây giờ mình đi vào từng thành phần: tại sao cần 2 network, EMA là gì, multi-crop, softmax, cross-entropy, chống collapse.

---

### SLIDE 10 — Tại sao self-distillation?
**Content:**
1. Không nhãn → cần Teacher làm đáp án
2. Teacher ổn định → Student có mục tiêu rõ
3. Teacher cải thiện dần qua EMA
- Warning: Cả hai train gradient → collapse

**Notes:**
Tại sao 2 network thay vì 1? Không có nhãn nên cần tín hiệu giám sát từ đâu đó — Teacher chính là nguồn đó. Teacher ổn định nên Student có mục tiêu rõ. Teacher cải thiện dần nhờ EMA.

Nếu cả hai cùng train gradient → đuổi theo nhau → mọi ảnh cho ra cùng 1 output = collapse. EMA giải quyết bằng cách cho Teacher đổi cực chậm. Giờ mình xem EMA cụ thể.

---

### SLIDE 11 — EMA
**Content:**
- θ_T ← λ·θ_T + (1−λ)·θ_S
- λ = 0.996 → 1.0
- Teacher giữ 99.6% cũ, lấy 0.4% từ Student
- Cosine schedule: λ tăng dần → cuối training Teacher gần như không đổi

Source: Grill et al. NeurIPS 2020 (BYOL) · Caron et al. ICCV 2021

**Notes:**
EMA — Exponential Moving Average. Mỗi bước training, Teacher giữ 99.6% giá trị cũ, lấy 0.4% từ Student. Lambda tăng từ 0.996 lên 1.0 theo cosine schedule — cuối training Teacher gần như không đổi.

0.996 từ đâu? BYOL (Grill et al. NeurIPS 2020) thử nhiều giá trị, 0.996 tốt nhất. DINO kế thừa. Hình dung: thầy giáo kinh nghiệm — không đổi theo từng câu hỏi mà tích luỹ dần.

Tại sao không fix Teacher luôn? Vì ban đầu Teacher là random, fix thì Student bị giới hạn. EMA cho Teacher tốt dần nhưng đủ chậm để không collapse. Giờ xem multi-crop.

---

### SLIDE 12 — Multi-crop
**Content:**
- Ảnh gốc (2 global + 6 local)
- Global: 224×224, >50% ảnh → Teacher nhận
- Local: 96×96, <50% ảnh → Student nhận cả 2 loại
- Nhìn 1 góc nhỏ → phải hiểu toàn bộ ảnh

Source: Caron et al. ICCV 2021 · SwAV (Caron 2020)

**Notes:**
Multi-crop: từ 1 ảnh tạo 2 global crop (>50% ảnh, Teacher nhận) và 6 local crop (<50%, Student nhận). Ý tưởng: nhìn cái vây cá thôi cũng phải biết là con cá — local-to-global.

Tại sao không chỉ 2 global crop? Overlap quá lớn, model chỉ copy chứ không hiểu. Local crop buộc Student suy luận từ cục bộ ra toàn cục. Chi phí: local crop 96² chỉ 18% pixel so với global 224², nên 6 local ≈ 1 global thêm. 8 góc nhìn thay vì 2, compute chỉ +50%.

Kiểm chứng: bỏ local crop giảm 2-3% ImageNet. Trade-off rất tốt. Giờ mình cần hiểu Teacher và Student so sánh output bằng cách nào — trước hết là softmax.

---

### SLIDE 13 — Softmax
**Content:**
- P(xᵢ) = exp(zᵢ/τ) / Σⱼ exp(zⱼ/τ)
- Input: logits (số thô)
- Output: phân bố xác suất (tổng = 1)
- τ (temperature): kiểm soát độ sắc nét

**Notes:**
Output ViT qua projection head cho ra logits — số thô, có thể âm dương bất kỳ. Softmax chuyển thành phân bố xác suất: exp mỗi phần tử rồi chia tổng. Kết quả: mỗi giá trị ∈ [0,1], tổng = 1.

Temperature τ kiểm soát sắc nét: τ nhỏ → gần one-hot; τ lớn → đều hơn. DINO dùng τ=0.04 cho Teacher (sắc nét), τ=0.1 cho Student (mềm hơn). Con số từ Table 7, Caron et al. — hyperparameter tuning.

Tại sao cần softmax? Vì bước tiếp dùng cross-entropy, cần input là phân bố xác suất. Slide tiếp mình minh hoạ temperature.

---

### SLIDE 14 — Temperature
**Content:**
- Teacher · τ = 0.04 (bar chart: 92%, 3%, 2%, 2%, 1%)
- Student · τ = 0.1 (bar chart: 45%, 20%, 15%, 12%, 8%)
- τ = 0.04 / 0.1 — chọn qua thử nghiệm (Table 7)

Source: Caron et al. ICCV 2021, Table 7

**Notes:**
Minh hoạ: cùng 1 vector logits, temperature khác nhau → phân bố khác nhau hoàn toàn.

Teacher τ=0.04: 1 class chiếm 92%, gần one-hot. Teacher "chắc chắn". Student τ=0.1: class cao nhất chỉ 45%, còn lại vẫn đáng kể. Student "đang học, cần linh hoạt".

Tại sao Teacher τ nhỏ hơn? Teacher nhìn global crop (nhiều thông tin), cập nhật chậm (ổn định) → output đáng tin, có quyền chắc chắn. Student nhận local crop (ít thông tin) → cần τ lớn để gradient chảy đều.

Con số 0.04 và 0.1: tác giả thử nhiều cặp, cặp này tốt nhất. Không có công thức lý thuyết.

Giờ có 2 phân bố, cần đo khoảng cách → cross-entropy.

---

### SLIDE 15 — Cross-entropy loss
**Content:**
- L = −Σ Pₜ · log Pₛ
- Case 1: Pₜ≈1, Pₛ≈0 → −log(0) → ∞ → Phạt nặng
- Case 2: Pₜ≈1, Pₛ≈1 → −log(1) = 0 → Hoàn hảo
- Case 3: Pₜ≈0 → 0 × … ≈ 0 → Bỏ qua

**Notes:**
Cross-entropy: −Σ Pₜ·log Pₛ. Tại sao log? Vì −log(p) đo "sự bất ngờ". 3 trường hợp:

1) Teacher chắc (Pₜ≈1), Student sai (Pₛ≈0): −log(0)→∞, phạt cực nặng. Đây là tính chất quan trọng nhất.
2) Cả hai đồng ý: −log(1)=0, hoàn hảo.
3) Teacher không chắc (Pₜ≈0): nhân bất kỳ ≈ 0, Student không bị phạt.

Nghĩa là Student chỉ bị ép học chỗ Teacher tự tin nhất — hiệu quả.

Tại sao không MSE? MSE phạt đều mọi sai lệch. Cross-entropy phạt nặng nhất ở class Teacher chắc, bỏ qua class Teacher không biết. Student tập trung học chỗ quan trọng.

Gốc information theory: cross-entropy đo lượng thông tin cần mã hoá P bằng Q. Giờ mình nói chống collapse.

---

### SLIDE 16 — Chống collapse
**Content:**
- Centering: g(x) − c → Trừ trung bình, Không cho 1 chiều chiếm ưu thế
- Sharpening: τ = 0.04 → Temperature thấp, Buộc Teacher chọn rõ ràng
- Bỏ 1 trong 2 → collapse

Source: Caron et al. ICCV 2021, Section 3.1

**Notes:**
Collapse: mọi ảnh cho ra cùng 1 output. EMA giúp nhưng chưa đủ. DINO thêm 2 cơ chế:

Centering: trừ running mean c khỏi output Teacher. Không có → 1 chiều dominate → mọi output giống nhau → collapse.

Sharpening: τ=0.04 rất thấp. Không có → phân bố đều → Teacher nói "không biết" → Student cũng đều → collapse kiểu khác.

Kiểm chứng: bỏ centering → collapse sau 1 epoch. Bỏ sharpening → collapse chậm hơn nhưng vẫn xảy ra. Cần cả 2 cùng lúc. Đây là đóng góp kỹ thuật quan trọng nhất.

Giờ đã đủ thành phần. Xem kết quả.

---

### SLIDE 17 — Kết quả DINOv1
**Content:**
| Model | Linear |
|-------|--------|
| ViT-S/8 | 79.7% |
| ViT-B/8 | 80.1% ★ |
| ResNet-50 | 75.3% |

- 80.1% vượt supervised ResNet-50 (76.5%)
- Attention map tự segment vật thể — emerging property

Source: Caron et al. ICCV 2021, Table 2 & Figure 1

**Notes:**
80.1% ImageNet linear probe với ViT-B/8 — vượt supervised ResNet-50 (76.5%) mà không cần nhãn. Milestone: lần đầu self-supervised vượt supervised.

Phát hiện nổi bật: attention map CLS token ở layer cuối tự segment vật thể khỏi nền. Head khác focus đầu, thân, nền con chó. Chỉ xảy ra với ViT + DINO, không xảy ra supervised hay CNN. Gọi là emerging property.

Tại sao? Supervised chỉ cần biết "đây là chó". DINO so sánh crop lớn/nhỏ, buộc hiểu vùng nào quan trọng → tự segment. Có thể dùng làm pseudo-segmentation.

Tóm tắt v1: self-distillation, EMA, multi-crop, centering+sharpening, 80.1%. Hạn chế: chỉ 1.28M ảnh, chỉ classification, ViT-B 86M params. v2 giải quyết cả 3.

---

### SLIDE 18 — Tóm tắt v1 (cream)
**Content:**
1. Self-distillation: Student bắt chước Teacher
2. EMA: Teacher cập nhật chậm, tránh collapse
3. Multi-crop: cục bộ → toàn cục
4. Centering + Sharpening: chống collapse
5. 80.1% ImageNet — vượt supervised

**Notes:**
5 điểm chính DINOv1. Hạn chế: data 1.28M, chỉ classification, model 86M. DINOv2 giải quyết cả 3: data ×110, model ×13, test nhiều task. Chuyển sang v2.

---

## SECTION 4: DINOv2 (2023)

### SLIDE 19 — LVD-142M
**Content:**
- Crawl 1.2B → Lọc NSFW → Loại trùng SSCD → Chọn Faiss → 142M curated
- Gấp 110× ImageNet — không dùng nhãn
- Chất lượng > số lượng: 142M curated thắng 1.2B raw

Source: Oquab et al. TMLR 2024, Section 3

**Notes:**
LVD pipeline: crawl 1.2 tỷ ảnh → lọc NSFW/chất lượng → loại trùng bằng SSCD → chọn qua Faiss nearest neighbor (embed ảnh, so với ImageNet embedding, không dùng nhãn) → 142M sạch.

Tại sao không dùng luôn 1.2B? Ảnh internet nhiễu: trùng lặp, NSFW, logo, phân bố lệch. Train trên raw 1.2B thua curated 142M khoảng 2-3%. Chất lượng > số lượng.

Giờ xem v2 cải tiến gì về loss.

---

### SLIDE 20 — Ba loss của v2
**Content:**
- DINO loss: CLS token → toàn cục
- iBOT loss: Masked patches → cục bộ
- KoLeo: Trải đều embedding

- Bỏ iBOT → ADE20k −4.2 mIoU
- Bỏ KoLeo → ImageNet −0.5%
- Cả 3 đều cần thiết

Source: Oquab et al. TMLR 2024 · Zhou et al. ICLR 2022

**Notes:**
v2 kết hợp 3 loss. DINO loss giống v1: CLS token, hiểu toàn cục. iBOT (Zhou et al. ICLR 2022): che patch rồi đoán token từ Teacher — khác MAE (đoán pixel), iBOT đoán ở mức semantic. Giúp hiểu cục bộ, cần cho segmentation. KoLeo: đẩy embedding trải đều, tránh collapse.

Kiểm chứng: bỏ iBOT giảm 4.2 mIoU ADE20k — rất nhiều. Bỏ KoLeo giảm 0.5% ImageNet. Cả 3 cần thiết, không thừa.

Thêm: Sinkhorn-Knopp cân bằng cluster, untied head, fine-tune 518px, FlashAttention. Xem kết quả.

---

### SLIDE 21 — Kết quả DINOv2
**Content:**
- 86.5% ImageNet
- 49.0 ADE20k mIoU
- 1.1B params

| Phương pháp | ImageNet |
|-------------|----------|
| DINOv2 | 86.5% |
| iBOT | 82.3% |
| MAE | 73.5% |
| OpenCLIP | 83.5% |

Source: Oquab et al. TMLR 2024, Table 4

**Notes:**
86.5% ImageNet linear probe, ViT-g 1.1B params. 49.0 mIoU ADE20k frozen features. Vượt tất cả: iBOT 82.3%, MAE 73.5%, OpenCLIP 83.5% (cần 400M text-image pairs).

DINOv2 là general-purpose: 1 backbone dùng cho classification, segmentation, depth, video. So v1: +6.4% ImageNet, lần đầu test dense prediction. Còn scale thêm? v3 trả lời.

---

### SLIDE 22 — Tóm tắt v2 (cream)
**Content:**
1. LVD-142M: 1.2B → 142M sạch
2. DINO + iBOT + KoLeo
3. ViT-g: 1.1B params
4. 86.5% ImageNet, 49.0 ADE20k

**Notes:**
So v1: data ×110, model ×13, thêm 2 loss. Kết quả +6.4% ImageNet. DINOv2 thành foundation model phổ biến nhất cho vision. Scale thêm? Chuyển v3.

---

## SECTION 5: DINOv3 (2025)

### SLIDE 23 — DINOv3 scale
**Content:**
- 7B params (40 blocks, dim 4096)
- 1.69B ảnh curated (Gấp 12× DINOv2)
- + Gram Anchoring + Text Alignment

Source: Siméoni et al. arXiv Aug 2025

**Notes:**
v3 scale mạnh. Model: ViT-7B — 7 tỷ params, 40 blocks, dim 4096, dùng RoPE + SwiGLU. Data: LVD-1.69B, gấp 12× v2.

2 kỹ thuật mới: Gram Anchoring — dùng Gram matrix (tích chéo features) làm "mỏ neo" giữ ổn định khi train model rất lớn, không có thì loss bùng nổ. Text Alignment — thêm text encoder, align vision/text embedding, mở rộng multimodal mà không ảnh hưởng vision features gốc.

Xem kết quả.

---

### SLIDE 24 — Kết quả DINOv3
**Content:**
| Benchmark | v3 | v2 | Δ |
|-----------|-----|-----|-----|
| ImageNet | 88.4% | 86.5% | +1.9 |
| ADE20k | 55.9 | 49.0 | +6.9 |
| DAVIS | 83.3 | 76.6 | +6.7 |

- Dense tasks được lợi nhiều nhất từ scaling

Source: Siméoni et al. arXiv Aug 2025

**Notes:**
ImageNet +1.9%, ADE20k +6.9 mIoU (rất lớn), DAVIS video +6.7. Dense tasks được lợi nhất từ scaling — classification ở mức cao khó tăng thêm, segmentation cần hiểu chi tiết nên scale giúp nhiều.

Tóm v3: ViT-7B, LVD-1.69B, Gram Anchoring, Text Alignment, 88.4% ImageNet, 55.9 ADE20k.

---

## SECTION 6: Tổng hợp

### SLIDE 25 — Ba phiên bản
**Content:**
| | v1 | v2 | v3 |
|------|------|------|------|
| Data | 1.28M | 142M | 1.69B |
| Model | 86M | 1.1B | 7B |
| ImageNet | 80.1% | 86.5% | 88.4% |
| ADE20k | — | 49.0 | 55.9 |

- Data ×1300 · Model ×81 · +8.3%

**Notes:**
4 năm: data ×1300, model ×81, ImageNet +8.3%. Mỗi phiên bản giải quyết hạn chế trước đó. Xu hướng chưa bão hoà.

---

### SLIDE 26 — So sánh phương pháp
**Content:**
| Phương pháp | ImageNet | Nhãn? |
|-------------|----------|-------|
| DINOv3 | 88.4% | 0 |
| Supervised | 85.7% | 1.28M |
| OpenCLIP | 83.5% | 400M text |
| MAE | 73.5% | 0 |

- Không nhãn, vượt cả có nhãn

**Notes:**
DINOv3 88.4% không nhãn, vượt supervised 85.7% (1.28M nhãn), OpenCLIP 83.5% (400M text pairs), MAE 73.5%. Self-supervised đã thắng.

---

### SLIDE 27 — Ứng dụng và hạn chế
**Content:**
**Ứng dụng:**
- Y tế: X-quang, CT scan
- Viễn thám: ảnh vệ tinh
- Nông nghiệp: bệnh cây trồng
- Robot: ước lượng độ sâu

**Hạn chế:**
- 61,000 GPU-hours
- ~18 tấn CO₂
- Chưa hiểu temporal

**Notes:**
Ứng dụng: y tế (ít nhãn, DINO pretrained giúp), viễn thám, nông nghiệp, robotics. Tất cả dùng 1 model pretrained, fine-tune nhẹ.

Hạn chế: 61K GPU-hours (~$120K+ compute), 18 tấn CO₂ (≈ 9 chuyến HN-NYC), chỉ lab lớn train được. Xử lý frame-by-frame, chưa hiểu temporal/chuyển động — hướng nghiên cứu mở.

---

### SLIDE 28 — Tổng kết (cream)
**Content:**
- Từ 0 nhãn đến 88.4% trong 4 năm
1. Self-distillation + EMA = tín hiệu không nhãn
2. Data sạch quan trọng hơn data nhiều
3. Scale chưa bão hoà

**Notes:**
3 bài học: (1) self-distillation+EMA tạo tín hiệu từ chính model; (2) chất lượng data > số lượng; (3) scaling law vẫn đúng, chưa bão hoà. Self-supervised đã vượt supervised. Tương lai vision có thể không cần gán nhãn nữa.

---

### SLIDE 29 — Tài liệu tham khảo
**Content:**
- [1] Caron et al. ICCV 2021 — DINOv1
- [2] Oquab et al. TMLR 2024 — DINOv2
- [3] Siméoni et al. arXiv 2025 — DINOv3
- [4] Dosovitskiy et al. ICLR 2021 — ViT
- [5] Vaswani et al. NeurIPS 2017 — Attention
- [6] Deng et al. CVPR 2009 — ImageNet
- [7] Zhou et al. ICLR 2022 — iBOT
- [8] He et al. CVPR 2022 — MAE

---

### SLIDE 30 — Cảm ơn (cream)
**Content:**
- Cảm ơn
- Hỏi đáp

**Notes:**
Cảm ơn mọi người đã lắng nghe. Mở phần hỏi đáp.

---

# RECOMMENDED CHANGES

## Slides to REMOVE (ViT Section):
- Slide 5: ViT pipeline
- Slide 6: Token CLS
- Slide 7: Self-attention
- Section 2 divider

## Slides to ADD/EXPAND for DINO rationale:

### For DINOv1 - Add slides on:
1. **Core Intuition**: WHY self-distillation works without labels
   - Teacher as "stable anchor" vs Student as "learner"
   - Asymmetric views force semantic understanding

2. **Architecture Deep-dive**:
   - Projection head structure (MLP, 3-layer, 256→2048→K)
   - Why K=65536 prototypes?

3. **Emerging Properties explanation**:
   - Why attention heads segment objects
   - Visual examples of attention maps

### For DINOv2 - Add slides on:
1. **Data Curation Philosophy**:
   - Why curated > raw data
   - Self-supervised retrieval pipeline details

2. **iBOT Integration rationale**:
   - Complementary to DINO (global vs local)
   - How masked prediction helps dense tasks

3. **Scaling Decisions**:
   - Why ViT-g architecture
   - Register tokens

### For DINOv3 - Add slides on:
1. **Gram Anchoring explanation**:
   - What is Gram matrix
   - Why it stabilizes large model training

2. **Text Alignment strategy**:
   - How to add text without hurting vision
   - Decoupled vs joint training

3. **Scaling Analysis**:
   - Compute efficiency
   - When does scaling saturate?
