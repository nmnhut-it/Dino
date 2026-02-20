# DINO Seminar v6.8 - Master's Class Edition

> **Duration**: 30 minutes (~1.25 min/slide)
> **Audience**: Master's students with ML background (know ViT, loss functions, gradients)
> **Slides**: 24 (rigorous technical depth)
> **Framework**: Problem → Attempt → Failure → Solution (PAFS)
> **Philosophy**: Build DINO from scratch, encounter problems, solve them with mathematical rigor

---

## Narrative Arc

```
"We want a model that learns from unlabeled images.
 First idea: Teacher-Student distillation. But collapse happens.
 Solution: EMA + Centering + Sharpening (with full derivations) → DINOv1 works!

 But v1 only does classification well. Dense tasks need more.
 → iBOT (patch-level) + KoLeo (diversity) → DINOv2 = Foundation Model!

 Scale to 7B? Dense features degrade over training.
 → Gram Anchoring (preserve similarity structure) → DINOv3 = SOTA!"
```

---

## Act 1: Hook & Problem (2 slides, 2.5 min)

### Slide 1: Demo - "This shouldn't be possible"
**Time**: 1 min | **Purpose**: Create curiosity

**Visual**: Attention maps of the fish (tench) - 3 heads focus on different parts

**Content**:
- Head 1: Focus on **head** (red)
- Head 2: Focus on **body + fins** (green)
- Head 3: Focus on **background** (blue)

**The Mystery**:
> "The model automatically segments objects from background.
> But NO ONE taught it this!
> No labels for 'this is head', 'this is fin'.
> **How is this possible?**"

**Speaker Notes** (75 words):
Look at these attention maps. Different heads automatically focus on different parts: head, body, background. This is like the model has "learned" the concept of "object" and "background". But this is self-supervised - no one taught the model where the head is, where the fin is. The model learned this on its own. Today we'll discover: how do you train such a model?

---

### Slide 2: The Goal - Learning from Unlabeled Images
**Time**: 1.5 min | **Purpose**: Define the problem clearly

**Visual**:
```
Left: ImageNet pipeline (humans labeling → $500K → 2 years)
Right: Internet images (unlimited, free, no labels)
Center: Large ?
```

**Content**:

| | Supervised | Our Goal |
|---|-----------|----------|
| **Data** | 14M labeled images | Billions unlabeled |
| **Cost** | $500K + 2 years | $0 |
| **Scalability** | Bottleneck | Unlimited |

**The Question**:
> "Can we train a model **as good as** supervised, but **without labels**?"

**Why this matters**:
- Unlabeled data: Unlimited (internet)
- Labeled data: Expensive, slow, limited
- If solved → Scale infinitely

**Speaker Notes** (75 words):
ImageNet: 14 million images, $500K, 2 years to label. That's the biggest bottleneck of supervised learning. Meanwhile, images on the internet are unlimited and free - but have no labels. Question: can we train a model using unlabeled images, while still achieving supervised-level quality? This is the problem DINO solves.

---

## Act 2: Building DINOv1 (10 slides, 13 min)

### Slide 3: First Idea - Teacher-Student Framework
**Time**: 1 min | **Purpose**: Initial intuition

**Visual**:
```
Original image → 2 different views (augmentation)
                    ↓           ↓
                 Teacher     Student
                    ↓           ↓
                 Output      Output
                    └─── Match? ───┘
```

**The Intuition**:
> "A human looking at a fish from any angle knows it's a fish.
> → A model should give the **same output** for different views."

**Design Choices**:
1. **Why 2 networks?** No labels → need to create our own "answers"
2. **Teacher's role?** Create pseudo-labels (the answer)
3. **Student's role?** Learn to predict like Teacher
4. **Loss?** Cross-entropy (details next slide)

**But wait... There's a problem!**

**Speaker Notes** (75 words):
First idea: Use 2 networks - Teacher and Student. From 1 image, create 2 different views (crop, color jitter...). Teacher processes view 1, Student processes view 2. Goal: Student must predict like Teacher. Intuition: If 2 views come from the same image, they should have the same representation. Makes sense! But there's a serious problem...

---

### Slide 4: Network Architecture
**Time**: 1.5 min | **Purpose**: Understand the architecture precisely

**Visual**:
```
Image → ViT Backbone (f) → Features → Projection Head (h) → Output
                                              ↓
                                    3-layer MLP (2048 hidden)
                                              ↓
                                    K = 65,536 dimensions
                                    (weight normalized)
```

**Architecture Details**:
```
g = h ∘ f

where:
- f = ViT backbone (output used for downstream tasks)
- h = projection head (only used during training)
```

**Projection Head Design**:
| Layer | Dimension | Notes |
|-------|-----------|-------|
| Input | d (ViT output) | e.g., 768 for ViT-B |
| Hidden 1 | 2048 | + GELU |
| Hidden 2 | 2048 | + GELU |
| Output | K = 65,536 | Weight normalized |

**Key Design Decisions**:
- **No predictor** (unlike BYOL) → Student and Teacher have identical architecture
- **No batch normalization** in ViT → Entire system is BN-free
- **Why BN-free matters?** Removes implicit batch statistics dependency

**Speaker Notes** (100 words):
The network g consists of backbone f and projection head h. The backbone is ViT - this is what we use for downstream tasks. The projection head is a 3-layer MLP with hidden dimension 2048, outputting K=65536 dimensions. Unlike BYOL, there's no predictor - Student and Teacher have the exact same architecture. Importantly, when using ViT, the entire system is batch-normalization-free. This matters because BN introduces implicit dependencies on batch statistics, which can cause issues in self-supervised learning. The weight normalization on the output layer is from SwAV's design.

---

### Slide 5: Loss Function - Deep Dive
**Time**: 1.5 min | **Purpose**: Understand the math rigorously

**Visual**: Flow diagram showing softmax with temperature

**The Loss Function**:
```
L = -Σₖ P_t(x)[k] · log P_s(x')[k]
```

**Student Probability** (standard softmax):
```
P_s(x')[k] = exp(g_θs(x')[k] / τ_s) / Σ_{k'} exp(g_θs(x')[k'] / τ_s)

where τ_s = 0.1 (student temperature)
```

**Teacher Probability** (with centering):
```
P_t(x)[k] = exp((g_θt(x)[k] - c[k]) / τ_t) / Σ_{k'} exp((g_θt(x)[k'] - c[k']) / τ_t)

where τ_t = 0.04 (teacher temperature)
      c = centering vector (explained in Slide 8)
```

**Why Cross-Entropy?**
- Measures divergence between two distributions
- Minimizing → Student distribution approaches Teacher distribution
- Asymmetric: Teacher is the "target", Student is the "prediction"

**Speaker Notes** (100 words):
The loss is cross-entropy between Teacher and Student outputs. But notice the details: Student uses standard softmax with temperature τ_s = 0.1. Teacher uses softmax with centering (subtract c) and temperature τ_t = 0.04. Why different temperatures? We'll see in Slide 9. Why centering? Slide 8. The K=65536 output can be interpreted as a soft assignment to K prototypes - similar to clustering but differentiable. Cross-entropy ensures Student learns to produce the same "cluster assignment" as Teacher for the same image viewed differently.

---

### Slide 6: The Collapse Problem
**Time**: 1.5 min | **Purpose**: Understand why naive approach fails

**Visual**:
```
Mode Collapse:                    Uniform Collapse:
All images → same point           All images → uniform distribution
   ●●●●●                             ○ ○ ○ ○ ○
   ●●●●●                           ○ ○ ○ ○ ○ ○
(trivial solution)                (no information)
Loss = 0, but useless             Loss low, but useless
```

**Why Does This Happen?**

| Collapse Type | Cause | Result |
|--------------|-------|--------|
| **Mode Collapse** | Teacher and Student "conspire" to output one value | Loss = 0, but meaningless |
| **Uniform Collapse** | Output spreads uniformly, no discrimination | Loss low, but useless |

**The Dilemma**:
> "No labels → Nothing **prevents** Teacher from outputting constant.
> Teacher outputs constant → Student learns constant → Loss = 0.
> **What did the model learn? Nothing!**"

**Other Methods' Solutions**:
- **Contrastive (SimCLR, MoCo)**: Negative samples (but need large batch 4096+)
- **Clustering (SwAV)**: Sinkhorn-Knopp (but computationally heavy)
- **DINO's approach**: No negatives needed! → How?

**Speaker Notes** (100 words):
This is the biggest problem in self-supervised learning: collapse. Mode collapse: Teacher and Student "conspire" - both output the same vector for ALL images. Loss = 0, but the model learned nothing. Uniform collapse: Output spreads evenly like a uniform distribution - also meaningless.

Contrastive learning (SimCLR, MoCo) solves this with negative samples: "this image is DIFFERENT from that image". But needs very large batches (4096+).

DINO has a different approach: no negatives needed. How? Three tricks that work together.

---

### Slide 7: EMA Teacher - Full Mechanics
**Time**: 1.5 min | **Purpose**: Understand EMA rigorously

**Visual**:
```
Training step t:
┌─────────────────────────────────────────────┐
│  θ_t^(new) ← λ·θ_t^(old) + (1-λ)·θ_s       │
│                                             │
│  λ = 0.996 → 1.0 (cosine schedule)         │
└─────────────────────────────────────────────┘
```

**The EMA Update Rule**:
```
θ_T ← λ·θ_T + (1-λ)·θ_S

where:
- θ_T = Teacher parameters
- θ_S = Student parameters
- λ = momentum coefficient
```

**Cosine Schedule for λ**:
```
λ starts at 0.996, increases to 1.0 during training

Early training: λ = 0.996 → Teacher gets 0.4% from Student each step
Late training:  λ → 1.0   → Teacher nearly frozen
```

**Why Does EMA Work?**
| Insight | Explanation |
|---------|-------------|
| **Polyak-Ruppert averaging** | EMA is model ensembling with exponential decay |
| **Teacher > Student** | Teacher performs BETTER than Student throughout training |
| **Stable targets** | Slow-moving Teacher provides stable learning signal |
| **No "conspiracy"** | If Teacher and Student update at same rate → collapse together |

**Key Observation from Paper**:
> "The teacher has better performance than the student throughout training,
> and hence guides the training by providing target features of higher quality."

**Speaker Notes** (125 words):
EMA Teacher is critical. The update rule: Teacher keeps 99.6% of its old weights and takes 0.4% from Student. λ follows a cosine schedule from 0.996 to 1.0 - so Teacher updates slower and slower over time.

Why does this work? Three reasons. First, this is Polyak-Ruppert averaging with exponential decay - essentially model ensembling, which is known to improve performance. Second, the authors observed that Teacher performs better than Student throughout training - it provides higher quality targets. Third, if Teacher and Student updated at the same rate, they would "conspire" and collapse together. The slow Teacher acts like an experienced teacher - changes views slowly based on accumulated experience, while the Student learns quickly.

---

### Slide 8: Centering - Derivation
**Time**: 1.5 min | **Purpose**: Understand centering mathematically

**Visual**:
```
Without Centering:              With Centering:
Teacher can output constant     Constant output → mean = constant
→ Loss = 0 (collapse)          → subtract mean → output = 0
                                → Forces diverse outputs!
```

**The Centering Update**:
```
c ← m·c + (1-m) · (1/B) · Σᵢ g_θt(xᵢ)

where:
- c = center vector (K dimensions)
- m = rate parameter (m > 0, typically 0.9)
- B = batch size
- g_θt(xᵢ) = Teacher output for image i
```

**How Centering is Applied**:
```
g_t(x) ← g_t(x) - c

The center c is subtracted from Teacher output before softmax
```

**Why Centering Prevents Mode Collapse**:

| Scenario | Teacher Output | After Centering |
|----------|---------------|-----------------|
| Normal | Diverse outputs | Diverse (centered) |
| Mode Collapse | Constant v for all images | v - c = v - v = 0 |

**Mathematical Intuition**:
- If Teacher outputs constant v for all images
- Then mean over batch = v
- c converges to v (EMA of means)
- After centering: v - c ≈ 0
- **Forces Teacher to output DIFFERENTLY for different images**

**Side Effect**:
> Centering alone encourages **uniform collapse** (all dimensions equal)
> → Need sharpening to balance!

**Speaker Notes** (125 words):
Centering prevents mode collapse. The center c is an exponential moving average of Teacher outputs over batches. We subtract c from Teacher output before applying softmax.

Here's why it works: Suppose Teacher collapses and outputs constant vector v for ALL images. Then the batch mean equals v, so c converges to v. After centering: v - c = v - v = 0. The Teacher's effective output becomes zero!

This FORCES Teacher to output differently for different images - otherwise its output gets nullified. The key insight: centering only uses first-order batch statistics (the mean), making it lightweight and working well across different batch sizes.

But centering has a side effect: it encourages all dimensions to be equal (uniform collapse). We need sharpening to counter this.

---

### Slide 9: Sharpening - Temperature Analysis
**Time**: 1 min | **Purpose**: Understand temperature's role

**Visual**:
```
τ = 1.0 (no sharpening)     τ = 0.04 (sharp)
    ▁▂▃▄▅▅▄▃▂▁                 ▁▁▁▁█▁▁▁▁
  (soft, uncertain)          (peaked, confident)
```

**Temperature in Softmax**:
```
P[k] = exp(z[k] / τ) / Σ_{k'} exp(z[k'] / τ)

τ → 0: Distribution becomes one-hot (argmax)
τ → ∞: Distribution becomes uniform
```

**DINO's Temperature Choice**:
| Network | Temperature | Effect |
|---------|------------|--------|
| **Teacher** | τ_t = 0.04 | Sharp/confident output |
| **Student** | τ_s = 0.1 | Softer output (room to learn) |

**Why Asymmetric Temperatures?**

**Teacher (τ=0.04 - sharp)**:
- Outputs peaked distributions
- Prevents uniform collapse (would require all dimensions equal)
- Acts as confident "pseudo-label"

**Student (τ=0.1 - softer)**:
- Easier to learn (less extreme targets)
- Gradient flows better with softer targets

**Centering + Sharpening Balance**:
| Mechanism | Alone | Effect |
|-----------|-------|--------|
| Centering | Encourages uniform | Prevents mode collapse |
| Sharpening | Encourages peaked | Prevents uniform collapse |
| **Together** | Balanced | Stable training! |

**Speaker Notes** (100 words):
Temperature controls how "peaked" the softmax distribution is. Low temperature (0.04 for Teacher) means sharp, confident output - one dimension dominates. High temperature means soft, uncertain output.

Why different temperatures? Teacher uses τ=0.04 (very sharp) to prevent uniform collapse - if all dimensions were equal, low temperature would still create a peaked distribution. Student uses τ=0.1 (softer) because learning from extremely sharp targets is harder - gradients vanish for non-maximum dimensions.

The key insight: Centering encourages uniform, Sharpening encourages peaked. Together they balance each other, creating stable training without collapse.

---

### Slide 10: Ablation - What Happens Without Each Component
**Time**: 1 min | **Purpose**: Prove each component is necessary

**Visual**: Table showing ablation results

**Ablation Study Results**:

| Configuration | Result |
|--------------|--------|
| Full DINO (EMA + Centering + Sharpening) | ✓ Works (80.1% ImageNet) |
| Remove EMA (copy Student weights to Teacher) | ✗ Fails to converge |
| Remove Centering | ✗ Mode collapse |
| Remove Sharpening (τ_t = τ_s = 0.1) | ✗ Uniform collapse |
| Remove both Centering and Sharpening | ✗ Immediate collapse |

**What Each Component Prevents**:

```
EMA         → Prevents Teacher-Student "conspiracy"
Centering   → Prevents mode collapse (constant output)
Sharpening  → Prevents uniform collapse (flat distribution)
```

**Key Finding from Paper**:
> "Centering prevents one dimension to dominate but encourages collapse to
> the uniform distribution, while the sharpening has the opposite effect.
> Applying both operations balances their effects."

**The Three Pillars**:
```
       ┌─────────────────────────────────────┐
       │         STABLE TRAINING             │
       └─────────────────────────────────────┘
              ↑           ↑           ↑
           ┌──┴──┐    ┌───┴───┐   ┌───┴───┐
           │ EMA │    │Center │   │ Sharp │
           └─────┘    └───────┘   └───────┘
```

**Speaker Notes** (100 words):
The ablation study proves each component is essential. Remove EMA → fails to converge because Teacher and Student update together and collapse. Remove centering → mode collapse, everything maps to one point. Remove sharpening → uniform collapse, everything spreads evenly.

The paper states it clearly: "centering prevents one dimension to dominate but encourages collapse to the uniform distribution, while sharpening has the opposite effect." These aren't optional tricks - they're the core of why DINO works. Any serious implementation must include all three, with the exact parameters (λ=0.996, τ_t=0.04, τ_s=0.1).

---

### Slide 11: Local-to-Global Multi-Crop Strategy
**Time**: 1.5 min | **Purpose**: The key insight for semantic learning

**Visual**:
```
Original image
    │
    ├── Global crop 1 (224×224, >50% image) ─→ Teacher only
    ├── Global crop 2 (224×224, >50% image) ─→ Teacher only
    │
    ├── Local crop 1 (96×96, <50% image) ─→ Student only
    ├── Local crop 2 (96×96, <50% image) ─→ Student only
    ├── Local crop 3 (96×96, <50% image) ─→ Student only
    └── ... (6 local crops total)
```

**The Key Insight**:
> "Seeing **fish fin** (local) → must know it's a **fish** (global)"

**Loss Computation**:
```
For each (global_view, local_view) pair:
    L += CrossEntropy(Teacher(global_view), Student(local_view))

Total: 2 global × 8 local = 16 loss terms (approximately)
```

**Why This Forces Semantic Understanding**:

| What Student Sees | What Student Must Predict |
|-------------------|---------------------------|
| Only fish fin (96×96) | "This is a fish" (whole picture context) |
| Only car wheel | "This is a car" |
| Only eye | "This is a face" |

**Compute Analysis**:
```
Global: 2 × (224/14)² = 2 × 256 = 512 patches
Local:  6 × (96/14)²  = 6 × 49  = 294 patches
Total: 806 patches ≈ 2.4× cost of 2 global crops alone
```

**Emerging Property**:
- Model learns **semantic concepts** without labels
- Different attention heads specialize on different object parts
- This is why the fish attention maps look like segmentation!

**Speaker Notes** (100 words):
This is DINO's most important insight. Teacher sees global crops (>50% of image), Student sees local crops (<50%). Student must predict Teacher's output.

Example: Student only sees a fish fin, but must output the same as Teacher who sees the whole fish. This FORCES Student to understand: "this fin belongs to a fish". The model must learn semantic concepts - not just copy pixels.

The compute cost is about 2.4× compared to using only global crops, but the semantic understanding gained is worth it. This is why DINO learns to segment objects without segmentation labels.

---

### Slide 12: DINOv1 Results
**Time**: 1 min | **Purpose**: Establish the milestone

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
> "First time SSL **surpasses** Supervised on ImageNet!"

**Emerging Properties Observed**:
- Attention heads naturally segment objects
- Features transfer well to other tasks
- k-NN works almost as well as linear probe

**But... Limitations Remain**:

| Limitation | Details | Impact |
|------------|---------|--------|
| **Small data** | 1.28M images (ImageNet only) | Limited diversity |
| **Classification focus** | Evaluated mainly on k-NN, linear probe | Dense tasks? |
| **Single loss** | Only DINO loss (CLS token) | Patch-level learning? |

**Speaker Notes** (75 words):
DINOv1 achieved a historic milestone: 80.1% on ImageNet with zero labels - first time SSL beats supervised! The emerging properties are remarkable: attention heads naturally segment objects, features transfer well.

But limitations remain: trained only on ImageNet (1.28M images), evaluated mainly on classification, uses only one loss targeting the CLS token. What about dense tasks like segmentation? What if we want patch-level understanding? This sets up DINOv2.

---

## Act 3: Evolution to DINOv2 (6 slides, 8 min)

### Slide 13: v1 Limitations → v2 Questions
**Time**: 1 min | **Purpose**: Motivate v2 improvements

**Visual**: Three question marks with icons

**DINOv1's Limitations**:

| Aspect | v1 Status | Question for v2 |
|--------|-----------|-----------------|
| **Data** | 1.28M (ImageNet) | Does more data help? How to curate? |
| **Tasks** | Classification only | Can we do segmentation, depth? |
| **Loss** | CLS token only | Can we learn patch-level features? |
| **Scale** | ViT-B/S | Can we scale to 1B+ parameters? |

**The v2 Research Questions**:

1. **Data scaling**: More data = better? Or does quality matter more?
2. **Dense tasks**: What's missing for segmentation/depth to work?
3. **Foundation Model**: Can one backbone do EVERYTHING well?

**Foundation Model Definition**:
> "1 pretrained backbone → multiple tasks → frozen features + simple head"

**Speaker Notes** (75 words):
DINOv1 was groundbreaking but limited. Only trained on ImageNet - what if we had billions of images? Only evaluated on classification - what about segmentation, depth estimation? Only uses CLS token - what about understanding individual patches?

v2 asks: Can we create a true Foundation Model? One backbone that works for everything - classification, segmentation, depth, retrieval - without task-specific training. The answer requires innovations in data, losses, and scale.

---

### Slide 14: Data Curation Pipeline - LVD-142M
**Time**: 1.5 min | **Purpose**: Understand data quality vs quantity

**Visual**: Funnel diagram showing filtering pipeline

**The Curation Pipeline**:
```
1.2B raw images (web crawl)
    ↓ Safety filtering (NSFW, restricted domains)
    ↓ PCA hash deduplication
1.1B images
    ↓ Copy-detection deduplication
    │   • k=64 nearest neighbors per image
    │   • cosine similarity > 0.6 → same component
    │   • Keep one per component
744M images
    ↓ Benchmark leak removal (similarity > 0.45)
    ↓ Self-supervised retrieval
    │   • ViT-H/16 embeddings (no labels!)
    │   • k-means: 100,000 clusters
    │   • Sample by similarity to curated seeds
142M curated images (LVD-142M)
```

**Implementation Details**:
- Faiss library with GPU acceleration
- 20 nodes × 8 V100 GPUs
- Processing time: < 2 days

**The Key Ablation** (ViT-g/14):

| Dataset | Size | ImageNet | ADE20k | iNat2021 |
|---------|------|----------|--------|----------|
| Uncurated | 142M | 83.3% | 48.5 | 76.4% |
| **LVD-142M (curated)** | 142M | **85.8%** | **47.7** | **86.4%** |
| ImageNet-22k | 14M | 85.9% | 46.6 | 85.6% |

**Key Finding**:
> "**Quality > Quantity**: 142M curated beats 1.2B raw on ALL benchmarks"

**Speaker Notes** (125 words):
Data curation is critical for v2. Starting from 1.2B raw web images, they filter down to 142M through multiple stages. First: safety filtering and deduplication using PCA hashes. Then: copy-detection using learned embeddings with k=64 nearest neighbors - images with cosine similarity > 0.6 are grouped and deduplicated. Then: remove images too similar to evaluation benchmarks (prevents data leakage). Finally: self-supervised retrieval using a ViT-H model's embeddings to select images similar to curated seeds.

The ablation is crucial: 142M curated images beat 1.2B uncurated images on every benchmark. Even more striking: 142M curated nearly matches 14M ImageNet-22k on ImageNet, while crushing it on diverse domains like iNaturalist. Quality beats quantity.

---

### Slide 15: iBOT Loss - Masked Patch Prediction
**Time**: 1.5 min | **Purpose**: Understand patch-level learning

**Visual**:
```
Student Input:              Teacher Input:
┌─────────────────┐        ┌─────────────────┐
│ █ █ ░ ░ █ █ █ │        │ ▓ ▓ ▓ ▓ ▓ ▓ ▓ │
│ █ ░ ░ █ █ ░ █ │        │ ▓ ▓ ▓ ▓ ▓ ▓ ▓ │
│ █ █ █ ░ ░ █ █ │        │ ▓ ▓ ▓ ▓ ▓ ▓ ▓ │
└─────────────────┘        └─────────────────┘
  (masked patches)           (full image)
         ↓                        ↓
    Student predicts         Teacher provides
    masked positions          target tokens
```

**iBOT Loss Formula**:
```
L_iBOT = -Σᵢ p_tᵢ · log(p_sᵢ)

where:
- i = indices of masked patches
- p_t = Teacher probability (Sinkhorn-Knopp centered)
- p_s = Student probability (softmax)
```

**iBOT vs MAE**:

| Aspect | MAE | iBOT |
|--------|-----|------|
| **Prediction target** | Raw pixel values | Semantic tokens from Teacher |
| **Loss** | MSE reconstruction | Cross-entropy |
| **What it learns** | Low-level texture/pixels | High-level semantics |
| **Feature quality** | Requires finetuning | Works frozen |

**Why Semantic > Pixel?**
- Pixels contain noise, texture details
- Semantic tokens capture "what" not "how it looks"
- Frozen iBOT features match finetuned MAE on segmentation

**Design at Scale** (important!):
> "At small scale: tied DINO and iBOT heads work better
> At large scale: **untied heads** work better"

**Speaker Notes** (125 words):
iBOT adds patch-level learning to DINO. Student receives masked patches, Teacher receives the full image. Student must predict the Teacher's output at masked positions.

Crucially, iBOT predicts semantic tokens, not pixels like MAE. MAE reconstructs raw pixel values - this learns texture and low-level patterns. iBOT predicts what the Teacher's representation says about that patch - this learns semantic meaning.

The result: frozen iBOT features work almost as well as finetuned MAE on segmentation. You don't need task-specific training.

An important finding at scale: sharing the projection head between DINO and iBOT works better at small scale, but separate heads work better at large scale. DINOv2 uses untied heads for all experiments.

---

### Slide 16: KoLeo Loss - Uniform Embeddings
**Time**: 1.5 min | **Purpose**: Understand diversity regularization

**Visual**:
```
Without KoLeo:                    With KoLeo:
   ●●●                              ●     ●
  ●●●●●                           ●   ●   ●
   ●●●                              ●     ●
(clustered embeddings)           (uniformly spread)
```

**KoLeo Loss Formula**:
```
L_KoLeo = -(1/n) Σᵢ log(d_{n,i})

where:
- n = batch size
- d_{n,i} = min_{j≠i} ||xᵢ - xⱼ||  (distance to nearest neighbor)
- Features are L2-normalized before computing
```

**Origin**: Kozachenko-Leonenko differential entropy estimator

**Mathematical Intuition**:
```
Maximizing L_KoLeo = Maximizing log(distance to nearest neighbor)
                   = Maximizing distance to nearest neighbor
                   = Pushing embeddings APART
                   = Uniform distribution on hypersphere
```

**Application Details**:
- Weight: 0.1 (so total loss = L_DINO + L_iBOT + 0.1 × L_KoLeo)
- Applied to: CLS tokens of first global crop only
- Computed: Within each GPU (no cross-GPU communication)

**Why KoLeo is Critical** (Ablation):

| Configuration | ImageNet | Oxford Retrieval |
|--------------|----------|------------------|
| Full model | 85.8% | 63.9% |
| Without KoLeo | 85.3% | **55.6%** (-8.3%) |

> KoLeo barely affects classification but is **critical for retrieval**!

**Speaker Notes** (125 words):
KoLeo prevents a subtle form of collapse: embeddings clustering too tightly. The formula maximizes the log of minimum distance to nearest neighbor - essentially pushing each embedding away from its closest neighbor.

The name comes from Kozachenko-Leonenko, a differential entropy estimator. Maximizing KoLeo encourages embeddings to spread uniformly across the feature space hypersphere.

The ablation is striking: removing KoLeo barely hurts ImageNet classification (85.8 → 85.3, just -0.5%), but destroys retrieval performance (63.9 → 55.6, -8.3%). Why? Classification only needs features to be linearly separable. Retrieval needs features to preserve fine-grained distances. Without KoLeo, features cluster together, ruining nearest-neighbor search.

Applied with weight 0.1 on CLS tokens only - a small regularization that enables retrieval applications.

---

### Slide 17: Three Losses Together
**Time**: 1.5 min | **Purpose**: See how losses complement each other

**Visual**:
```
┌─────────────────────────────────────────────────────────────┐
│                        Image                                 │
│                          ↓                                   │
│              ┌──────────────────────┐                       │
│              │      ViT Backbone     │                       │
│              └──────────────────────┘                       │
│                    ↓           ↓                            │
│               CLS token    Patch tokens                     │
│                    ↓           ↓                            │
│    ┌───────────────────┐  ┌───────────────────┐            │
│    │   DINO Head       │  │   iBOT Head       │            │
│    │   (untied)        │  │   (untied)        │            │
│    └───────────────────┘  └───────────────────┘            │
│           ↓                        ↓                        │
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

**What Each Loss Provides**:

| Loss | Target | What It Learns | Critical For |
|------|--------|----------------|--------------|
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
> "Each loss earns its place. Remove any → lose a capability."

**Speaker Notes** (100 words):
The three losses work together, each handling a different aspect. DINO learns global semantics from CLS token - good for classification. iBOT learns local understanding from patches - essential for dense tasks. KoLeo ensures diversity - critical for retrieval.

The ablation proves each is necessary: Remove KoLeo → retrieval drops 8%. Remove iBOT → segmentation drops 3 mIoU. These aren't small effects.

Note the untied heads: at DINOv2 scale, DINO and iBOT use separate projection heads. This was different from the original iBOT paper which shared heads - another example of how optimal design changes with scale.

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

**Foundation Model Achieved**:
```
1 backbone (frozen) + simple linear head → SOTA on multiple tasks
```

**Comparison with Weakly-Supervised**:

| Model | ImageNet | ADE20k | Uses Text? |
|-------|----------|--------|------------|
| OpenCLIP ViT-G | 86.2% | 46.0 | Yes (LAION-2B) |
| EVA-CLIP ViT-g | 86.4% | - | Yes |
| **DINOv2 ViT-g** | **86.5%** | **49.0** | **No** |

> DINOv2 beats text-supervised models **without any text**!

**Speaker Notes** (75 words):
DINOv2 achieves Foundation Model status. One frozen backbone, simple linear heads, state-of-the-art across classification, segmentation, retrieval, and depth. 86.5% ImageNet with frozen features - nearly matching supervised finetuning.

Most impressive: DINOv2 beats OpenCLIP and EVA-CLIP which use billions of image-text pairs. DINOv2 uses NO text supervision at all. Pure visual self-supervision with the right losses and data curation matches or exceeds text-supervised methods.

---

## Act 4: Evolution to DINOv3 (4 slides, 4.5 min)

### Slide 19: The 7B Challenge - Dense Feature Degradation
**Time**: 1 min | **Purpose**: Understand the scaling problem

**Visual**:
```
Training iterations →
          0      200k     400k     600k     800k     1M
          │        │        │        │        │        │
ImageNet  ├────────┼────────┼────────┼────────┼────────┤ ↗ keeps improving
          │        │        │        │        │        │
          │     peak│        │        │        │        │
ADE20k    ├────────●────────┼────────┼────────┼────────┤ ↘ degrades!
          │        ↘        ↘        ↘        ↘        │
```

**The Problem** (NOT traditional divergence!):
- Classification (ImageNet) keeps improving throughout training
- **Dense tasks (segmentation) peak at ~200k, then DEGRADE**
- For ViT-7B: segmentation falls **below early-training levels** by 1M iterations

**Root Cause Analysis**:
```
Cosine similarity between CLS token and patch tokens increases over training
→ Patches "collapse" toward global summary
→ Lose local spatial specificity
→ Dense tasks suffer
```

**Why This Happens**:
- DINO global loss is easier to optimize than iBOT local loss
- As training continues, global loss dominates
- Features become good for "what is this image" but bad for "where is what"

**Visualization**:
- At 200k: Patch similarity maps are crisp and spatially localized
- At 1M: Patch similarity maps are noisy, globally smeared

**Speaker Notes** (100 words):
Scaling to 7B reveals a new problem. It's NOT training divergence - loss doesn't explode. Instead, dense feature quality degrades. Classification keeps improving, but segmentation peaks around 200k iterations then declines.

The cause: CLS token and patch outputs become too similar over time. Patches "collapse" toward the global summary, losing their local distinctiveness. The DINO global loss dominates over iBOT local loss as training continues.

Visualization shows this clearly: at 200k iterations, similarity maps between patches are crisp and localized. By 1M iterations, they're noisy and smeared. The model forgets spatial structure.

---

### Slide 20: Gram Anchoring - Full Derivation
**Time**: 1.5 min | **Purpose**: Understand the mathematical solution

**Visual**:
```
Student patches:                    Gram Teacher patches (early checkpoint):
[p1, p2, p3, ..., pP]              [g1, g2, g3, ..., gP]
       ↓                                   ↓
    X_S (P×d)                           X_G (P×d)
       ↓                                   ↓
   X_S · X_S^T                        X_G · X_G^T
       ↓                                   ↓
    G_S (P×P)                          G_G (P×P)
       └──────────── ||G_S - G_G||²_F ────────────┘
```

**Gram Matrix Definition**:
```
Given P patches with d-dimensional L2-normalized features:
X = [x₁, x₂, ..., x_P]^T  (P × d matrix)

Gram matrix: G = X · X^T  (P × P matrix)

G[i,j] = xᵢ · xⱼ = cosine similarity between patch i and patch j
```

**Gram Anchoring Loss**:
```
L_Gram = ||X_S · X_S^T - X_G · X_G^T||²_F

where:
- X_S = Student patch features (L2-normalized)
- X_G = Gram Teacher patch features (from early checkpoint)
- ||·||_F = Frobenius norm
```

**Why This Works - The Key Insight**:
```
L_Gram constrains SIMILARITY STRUCTURE, not specific feature values

Student features can:
✓ Rotate
✓ Scale
✓ Shift

As long as:
"Which patches are similar to which" stays the same
```

**Gram Teacher Selection**:
- Use checkpoint from 100k-200k iterations (when dense features are good)
- Update every 10k iterations during refinement
- **NOT** from 1M iterations (already degraded)

**Refinement Loss**:
```
L_Ref = w_D · L_DINO + L_iBOT + w_DK · L_KoLeo + w_Gram · L_Gram

w_Gram = 2
```

**Speaker Notes** (125 words):
Gram Anchoring is elegant. The Gram matrix G = X·X^T encodes pairwise cosine similarities between all patches. G[i,j] tells you how similar patch i is to patch j.

The loss minimizes the Frobenius norm between Student's Gram matrix and Gram Teacher's Gram matrix. This preserves the similarity structure - which patches should be similar to which.

The key insight: this is a SOFT constraint. Features can rotate, scale, or shift in the embedding space - they just need to preserve relative similarities. This decouples feature learning from structural regularization.

The Gram Teacher comes from an early checkpoint (100k-200k iterations) when dense features were still good. Using a late checkpoint doesn't work - those features are already degraded.

Effect is almost immediate: improvements appear within 10k iterations.

---

### Slide 21: Text Alignment - Decoupled Training
**Time**: 1 min | **Purpose**: Understand the vision-language connection

**Visual**:
```
CLIP approach:                     DINOv3 approach:
┌────────────────────┐            Phase 1: SSL Training
│ Image ←→ Text      │            ┌────────────────────┐
│ (joint training)   │            │ Image-only (1M iter)│
│                    │            │ DINOv3 backbone     │
│ Vision learns      │            └────────────────────┘
│ from text signal   │                     ↓ FREEZE
└────────────────────┘            Phase 2: Text Alignment
                                  ┌────────────────────┐
                                  │ Frozen vision +    │
                                  │ Train text encoder │
                                  └────────────────────┘
```

**Comparison**:

| Aspect | CLIP | DINOv3 Text Alignment |
|--------|------|----------------------|
| Vision encoder | Trained jointly with text | **FROZEN** |
| What's trained | Both encoders | Text encoder + 2 transformer layers |
| Visual features | CLS token only | **CLS + mean-pooled patches** |
| Dense capability | Poor | **Excellent** |
| Data needed | 400M+ image-text pairs | Reuses SSL backbone |

**Why Include Patches?**
- Standard CLIP: Only CLS token aligned to text → global-only
- DINOv3: CLS + mean-pooled patches → both global AND local aligned
- Result: **Open-vocabulary segmentation works!**

**Results** (ViT-L):

| Task | CLIP | EVA-02-CLIP | DINOv3 |
|------|------|-------------|--------|
| ADE20k seg | 6.0 mIoU | 10.9 mIoU | **24.7 mIoU** |

**Speaker Notes** (100 words):
DINOv3 can be aligned to text while preserving dense capabilities. Unlike CLIP which trains vision and text jointly (degrading spatial features), DINOv3 uses decoupled training.

Phase 1: Train the SSL backbone normally (1M iterations, no text). Phase 2: Freeze the vision backbone, add 2 transformer layers, train a text encoder from scratch.

The key enhancement: use both CLS token AND mean-pooled patches for alignment. This aligns both global and local features to text, enabling open-vocabulary segmentation.

Result: 24.7 mIoU on ADE20k vs CLIP's 6.0 - a 4× improvement in dense vision-language tasks.

---

### Slide 22: DINOv3 Results
**Time**: 1 min | **Purpose**: Establish SOTA status

**Visual**: Comprehensive benchmark table

**Architecture**: ViT-7B (6.7B parameters)
- Axial RoPE (resolution generalization)
- SwiGLU FFN
- 256k prototypes (DINO), 96k (iBOT)

**Key Results** (frozen backbone):

| Benchmark | DINOv2-g | DINOv3-7B | Improvement |
|-----------|----------|-----------|-------------|
| **ImageNet** | 87.3% | **88.4%** | +1.1% |
| **ObjectNet** | 66.0% | **79.0%** | +13% |
| **ADE20k** | 49.5 mIoU | **55.9 mIoU** | +6.4 |
| **COCO det** | ~60 mAP | **66.1 mAP** | +6 |
| **DAVIS** | 76.6 J&F | **83.3 J&F** | +6.7 |

**Historic Achievements**:
- First SSL model at **weakly-supervised parity** on ImageNet
- **SOTA on COCO detection** with frozen backbone (only 100M trainable decoder params)
- **SOTA on ADE20k** with frozen backbone (matches finetuned models)

**Training Scale**:
- 256 H100 GPUs
- 61,440 GPU hours
- ~18 tons CO2 equivalent
- Dataset: LVD-1689M (1.7B curated images)

**Speaker Notes** (75 words):
DINOv3 achieves SOTA everywhere with frozen backbone. 88.4% ImageNet - first SSL at weakly-supervised parity. 66.1 mAP on COCO detection - matching finetuned models with just a 100M parameter decoder. 55.9 mIoU on ADE20k - 6 points above DINOv2.

The dense task improvements are especially notable: +13% on ObjectNet, +6.4 mIoU on segmentation, +6.7 on video tracking. Gram Anchoring solved the dense feature degradation problem.

---

## Act 5: Synthesis (2 slides, 2 min)

### Slide 23: Evolution Timeline
**Time**: 1 min | **Purpose**: Visual summary of the journey

**Visual**: Horizontal timeline

```
2021                           2023                           2025
 │                              │                              │
DINOv1                        DINOv2                        DINOv3
80.1% ImageNet                86.5% ImageNet                88.4% ImageNet
 │                              │                              │
 │ ┌─────────────────────┐      │ ┌─────────────────────┐      │ ┌─────────────────────┐
 │ │ PROBLEM:            │      │ │ PROBLEM:            │      │ │ PROBLEM:            │
 │ │ Learn without labels│      │ │ Dense tasks weak    │      │ │ Dense features      │
 │ │                     │      │ │                     │      │ │ degrade at scale    │
 │ ├─────────────────────┤      │ ├─────────────────────┤      │ ├─────────────────────┤
 │ │ SOLUTION:           │      │ │ SOLUTION:           │      │ │ SOLUTION:           │
 │ │ • EMA Teacher       │      │ │ • iBOT (patches)    │      │ │ • Gram Anchoring    │
 │ │ • Centering         │      │ │ • KoLeo (diversity) │      │ │ • Text Alignment    │
 │ │ • Sharpening        │      │ │ • Data curation     │      │ │ • 7B scale          │
 │ │ • Local→Global      │      │ │ • 3 losses          │      │ │ • Axial RoPE        │
 │ └─────────────────────┘      │ └─────────────────────┘      │ └─────────────────────┘
 │                              │                              │
 └──────────────────────────────┴──────────────────────────────┘
              Each version solves the previous version's limitations
```

**The Pattern**:

| Version | Problem Solved | Key Innovation | Result |
|---------|----------------|----------------|--------|
| v1 (2021) | SSL without labels | Self-distillation + collapse prevention | SSL > Supervised |
| v2 (2023) | Dense tasks weak | iBOT + KoLeo + data curation | Foundation Model |
| v3 (2025) | Dense degrades at scale | Gram Anchoring | SOTA everywhere |

**Research Process**:
> Identify problem → Solve → Find new problem → Repeat

**Speaker Notes** (75 words):
The timeline shows the evolution clearly. Each version solves the previous version's limitation. v1: how to do SSL without collapse? v2: how to get dense task performance? v3: how to scale to 7B without degradation?

This pattern - identify problem, solve, find new problem - is the essence of research progress. Understanding this journey helps you understand not just what DINO does, but why each design choice exists.

---

### Slide 24: Key Takeaways + References
**Time**: 1 min | **Purpose**: Memorable insights and resources

**5 Lessons from DINO**:

| # | Takeaway | Evidence |
|---|----------|----------|
| 1 | **SSL can beat Supervised** | 88.4% vs 85.7% (supervised ViT-H) |
| 2 | **Collapse prevention is CRITICAL** | EMA + Centering + Sharpening (all required) |
| 3 | **Quality > Quantity in data** | 142M curated > 1.2B raw |
| 4 | **Dense tasks need patch-level learning** | iBOT: -2.9 mIoU without it |
| 5 | **Scale needs stability tricks** | Gram Anchoring prevents dense degradation |

**Key Formulas Reference**:
```
EMA:        θ_T ← λθ_T + (1-λ)θ_S,  λ: 0.996 → 1
Centering:  c ← mc + (1-m)(1/B)Σg_θt(xᵢ)
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
Five key lessons from DINO: SSL can exceed supervised learning. Collapse prevention is non-negotiable - every component matters. Data quality trumps quantity. Dense tasks require explicit patch-level objectives. Scale requires stability mechanisms.

The formulas are your reference for implementation. The papers provide complete details. The code is open-source.

Thank you for listening. Questions?

---

## Summary

| Act | Slides | Time | Purpose |
|-----|--------|------|---------|
| Hook & Problem | 1-2 | 2.5 min | Create curiosity + define problem |
| Building DINOv1 | 3-12 | 13 min | Architecture → Collapse → Solutions |
| Evolution to v2 | 13-18 | 8 min | Data + iBOT + KoLeo |
| Evolution to v3 | 19-22 | 4.5 min | Gram Anchoring + Text Alignment |
| Synthesis | 23-24 | 2 min | Timeline + Takeaways |
| **Total** | **24** | **30 min** | |

---

## Design Notes

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

### Speaker Notes
- ~75-125 words per slide
- Include "why" for every formula
- Reference specific ablation numbers
- Connect to big picture

### Color Scheme
- v1: Blue (#1565C0)
- v2: Orange (#FF6D00)
- v3: Green (#2E7D32)
- Problems: Red (#C62828)
- Solutions: Green check

---

## Design Specifications (for PowerPoint generation)

### Layout
```
Layout: LAYOUT_WIDE (13.33" × 7.5")
Margins: 0.5" - 0.7" all sides
Content width: ~12" usable
```

### Typography
| Element | Font | Size | Weight | Color |
|---------|------|------|--------|-------|
| Slide title | Roboto / Arial | 32-36pt | Bold | #008000 (green) or version color |
| Body text | Roboto / Arial | 28pt (MIN) | Regular | #1A1A1A |
| Bullet points | Roboto / Arial | 28pt | Regular | #1A1A1A |
| Code/Formulas | Consolas | 24-28pt | Regular | #1A1A1A |
| Table header | Roboto / Arial | 28pt | Bold | #FFFFFF on #008000 |
| Table body | Roboto / Arial | 28pt | Regular | #1A1A1A |
| Source/Footer | Roboto / Arial | 10-12pt | Italic | #888888 |
| Annotations | Roboto / Arial | 18-20pt | Italic | #555555 |

### Color Palette (Hex codes)
```javascript
const C = {
  // Version colors
  v1: "#1565C0",      // Blue - DINOv1
  v2: "#FF6D00",      // Orange - DINOv2
  v3: "#2E7D32",      // Green - DINOv3

  // Semantic colors
  accent: "#C62828",  // Red - emphasis, problems
  success: "#008000", // Green - solutions, titles

  // Neutrals
  black: "#1A1A1A",
  gray: "#555555",
  medGray: "#888888",
  lightGray: "#E0E0E0",
  white: "#FFFFFF",

  // Backgrounds
  bg: "#FFFFFF",
  cream: "#FFF8F0",     // Section dividers
  tableAlt: "#F5F5F5",  // Alternating table rows
  placeholder: "#F5F5F5",
};
```

### Table Styling
```
Header row:
- Background: #008000 (green)
- Text: #FFFFFF (white), bold
- Padding: 8-10px

Body rows:
- Alternating: #FFFFFF / #F5F5F5
- Text: #1A1A1A
- Highlighted cells: #FF0000 (red) text, bold

Border: None or 1px #E0E0E0
```

### Formula Boxes
```
Background: #F5F5F5 or #FFF8F0
Border: 2px dashed #1565C0 (or version color)
Padding: 16px
Font: Consolas 24-28pt
```

### Progress Bar
```
Position: Bottom of slide, 0.15" from edge
Height: 0.08" - 0.12"
Sections: 5 segments (Vấn đề, DINOv1, DINOv2, DINOv3, Tổng hợp)
Active: Version color or #FF0000
Inactive: #E0E0E0
```

### Image Placeholders
```
Border: 2px dashed version color
Background: #F5F5F5
Label: Centered, 12pt gray italic
Aspect ratio: Preserve original or 16:9
```

### Slide Number
```
Position: Bottom right
Font: 12pt gray
Format: "X/24"
```

### Section Divider Slides
```
Background: #FFF8F0 (cream)
Section number: 72pt bold red (#FF0000)
Section title: 44pt bold italic green (#008000)
```

### Visual Hierarchy
1. Title (top, large, bold, colored)
2. Main visual/diagram (center, 60% of slide)
3. Key text/formula (supporting content)
4. Source citation (bottom left, small, gray)
5. Progress bar (bottom center)
6. Slide number (bottom right)

### Accessibility
- Minimum font size: 28pt for body text
- Sufficient color contrast (WCAG AA)
- Don't rely solely on color for information
- Alt text for all images

### Image Guidelines
```
Resolution: 1920×1080 minimum
Format: PNG (diagrams), JPG (photos)
Placement: Center-aligned or left-aligned
Max width: 80% of slide width for full-width images
Aspect ratio: Preserve, crop if needed
```
