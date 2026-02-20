# Image Prompts for DINO Seminar v6.8

> **Generator**: Google ImageFX / Gemini
> **Style**: Clean, professional, academic presentation diagrams
> **Resolution**: 1920x1080 or 16:9 aspect ratio

---

## Slide 1: Attention Maps Demo

### Image 1.1: Fish with Multi-Head Attention Visualization
```
A photorealistic image of a tench fish (green-gold freshwater fish) on a neutral gray background. Overlaid with three semi-transparent colored heatmaps showing different attention regions:
- RED heatmap highlighting the fish's HEAD area
- GREEN heatmap highlighting the fish's BODY and FINS
- BLUE heatmap highlighting the BACKGROUND around the fish

Style: Scientific visualization, clean, high contrast, suitable for academic presentation. The three attention maps should be shown as separate panels or as an overlay with clear color coding. Include a small legend showing "Head 1: Head", "Head 2: Body", "Head 3: Background".
```

### Image 1.2: Attention Head Comparison (3-panel)
```
A triptych (3-panel image) showing the same fish photograph processed by three different attention heads:

Panel 1 (labeled "Head 1"): Fish image with bright red/orange heatmap concentrated on the fish's head and eye area
Panel 2 (labeled "Head 2"): Fish image with bright green heatmap concentrated on the body, dorsal fin, and tail
Panel 3 (labeled "Head 3"): Fish image with bright blue heatmap concentrated on the water/background, avoiding the fish

Style: Clean scientific visualization with white borders between panels, dark background, professional typography for labels. Each heatmap should use a gradient from transparent to solid color.
```

---

## Slide 2: Labeled vs Unlabeled Data

### Image 2.1: Data Labeling Cost Infographic
```
Split-screen infographic comparing two approaches:

LEFT SIDE (labeled "Supervised Learning"):
- Icon of humans manually labeling images at computers
- Stack of money icons ($500,000)
- Calendar showing "2 years"
- Small stack of images (representing 14M)
- Red "BOTTLENECK" stamp

RIGHT SIDE (labeled "Self-Supervised"):
- Icon of infinite/unlimited symbol
- "$0" in large text
- Globe icon representing internet
- Massive stack of images (representing billions)
- Green checkmark

CENTER: Large question mark bridging the two sides

Style: Flat design infographic, corporate presentation style, blue and orange color scheme, clean icons, professional.
```

---

## Slide 3: Teacher-Student Framework

### Image 3.1: Basic Teacher-Student Architecture
```
A clean architectural diagram showing:

TOP: Single photograph of a dog
MIDDLE: Two arrows pointing down to two augmented versions of the same dog (one cropped, one color-shifted)
BOTTOM LEFT: Box labeled "TEACHER" (blue) receiving the first augmented image
BOTTOM RIGHT: Box labeled "STUDENT" (orange) receiving the second augmented image
BOTTOM CENTER: Dotted line connecting Teacher output to Student output with text "Match?"

Style: Technical diagram, flat design, white background, clean lines, sans-serif font, color-coded boxes (Teacher=blue, Student=orange), arrows showing data flow.
```

---

## Slide 4: Network Architecture

### Image 4.1: DINO Network Architecture Diagram
```
Detailed neural network architecture diagram showing:

INPUT: Image patch grid (14x14 patches)
↓
BACKBONE (large blue box labeled "ViT Backbone (f)"):
- Patch embedding layer
- Multiple transformer blocks stacked
- Output: Feature vector
↓
PROJECTION HEAD (orange box labeled "Projection Head (h)"):
- "Linear 768 → 2048" layer
- "GELU activation"
- "Linear 2048 → 2048" layer
- "GELU activation"
- "Linear 2048 → 65536" layer (with "Weight Norm" annotation)
↓
OUTPUT: "K = 65,536 dimensions"

Side annotation: "g = h ∘ f"
Side note: "No Batch Normalization (BN-free)"

Style: Technical neural network diagram, clean boxes with rounded corners, arrows showing data flow, layer dimensions annotated, professional engineering diagram style.
```

---

## Slide 5: Loss Function Visualization

### Image 5.1: Cross-Entropy Loss Diagram
```
Visual explanation of cross-entropy loss between Teacher and Student:

TOP ROW: Two probability distribution bar charts side by side
- LEFT chart labeled "P_teacher" showing a sharp/peaked distribution (one tall bar, others short)
- RIGHT chart labeled "P_student" showing a softer distribution (less peaked)

MIDDLE: Arrow pointing down to loss equation:
"L = -Σ P_t[k] · log(P_s[k])"

BOTTOM: Visual showing temperature effect:
- τ = 0.04 → Very sharp distribution (almost one-hot)
- τ = 0.1 → Softer distribution (more spread out)
- τ = 1.0 → Flat distribution (uniform)

Style: Mathematical visualization, clean bar charts, gradient colors, annotations with formulas, academic presentation style.
```

---

## Slide 6: Collapse Problem

### Image 6.1: Mode Collapse Visualization
```
Two-panel diagram showing collapse problems:

LEFT PANEL - "Mode Collapse":
- 2D scatter plot with ALL points clustered at ONE location
- Multiple different colored dots (representing different images) all at same point
- Label: "All images → Same output"
- Red X mark indicating "BAD"

RIGHT PANEL - "Uniform Collapse":
- 2D scatter plot with points spread UNIFORMLY in a grid pattern
- All points equidistant from each other
- Label: "All images → Uniform distribution"
- Red X mark indicating "BAD"

CENTER (ideal):
- Small reference showing well-clustered but separated groups
- Green checkmark indicating "GOOD"

Style: Scientific scatter plots, clean axes, distinct colors for different image classes, professional data visualization.
```

### Image 6.2: Collapse Animation Concept
```
Three-stage diagram showing training collapse:

STAGE 1 "Iteration 0":
- Scatter plot with random, diverse point distribution
- Label: "Initial: Diverse features"

STAGE 2 "Iteration 1000":
- Points starting to cluster together
- Label: "Collapsing..."

STAGE 3 "Iteration 5000":
- All points at single location OR spread uniformly
- Label: "Collapsed: Useless features"

Arrow connecting stages showing progression.

Style: Clean scatter plots, gradient background showing progression, red warning colors for final stage.
```

---

## Slide 7: EMA Teacher Mechanism

### Image 7.1: EMA Update Visualization
```
Diagram showing Exponential Moving Average update:

TOP: Timeline showing training steps (t=0, t=1, t=2, ...)

MIDDLE: Two parallel tracks:
- BLUE track: "Teacher θ_T" - shows slow, smooth changes
- ORANGE track: "Student θ_S" - shows rapid, noisy changes

BOTTOM: Visual equation with icons:
"θ_T^new = 0.996 × θ_T^old + 0.004 × θ_S"

Side visualization:
- Pie chart showing 99.6% blue (old Teacher) and 0.4% orange (from Student)
- Label: "Teacher keeps 99.6% of previous weights"

Cosine schedule graph:
- X-axis: Training progress (0% to 100%)
- Y-axis: λ value (0.996 to 1.0)
- Curve showing λ increasing over training

Style: Technical diagram, smooth curves, color-coded tracks, clean mathematical notation.
```

---

## Slide 8: Centering Mechanism

### Image 8.1: Centering Effect Visualization
```
Before/After comparison showing centering:

LEFT "Without Centering":
- Distribution plot heavily biased to one dimension
- One dimension has very high values, others near zero
- Label: "One dimension dominates → Mode collapse"

RIGHT "With Centering":
- Distribution plot with balanced dimensions
- All dimensions have similar range
- Label: "Balanced → Diverse features"

CENTER: Mathematical operation:
"output ← output - mean(batch)"

Bottom diagram:
- Show batch of images → compute mean → subtract from each

Style: Bar charts for distributions, clean before/after layout, green/red color coding for good/bad.
```

---

## Slide 9: Temperature Sharpening

### Image 9.1: Temperature Effect on Softmax
```
Four probability distribution bar charts showing temperature effect:

Chart 1 (τ = 1.0): Relatively flat distribution across 10 bars
Label: "τ = 1.0 (no sharpening)"

Chart 2 (τ = 0.5): Slightly peaked distribution
Label: "τ = 0.5"

Chart 3 (τ = 0.1): More peaked, one dominant bar
Label: "τ = 0.1 (Student)"

Chart 4 (τ = 0.04): Nearly one-hot, single very tall bar
Label: "τ = 0.04 (Teacher) - Very sharp"

Arrow showing progression from "Soft/Uncertain" to "Sharp/Confident"

Style: Clean bar charts, gradient color scheme (cool to warm as sharpness increases), professional typography.
```

---

## Slide 10: Ablation Study

### Image 10.1: Three Pillars Diagram
```
Architectural diagram showing three pillars supporting stable training:

TOP: Roof/platform labeled "STABLE TRAINING ✓"

THREE PILLARS:
- Pillar 1 (Blue): "EMA" with icon of slow-moving gauge
- Pillar 2 (Green): "Centering" with icon of balanced scale
- Pillar 3 (Orange): "Sharpening" with icon of peaked mountain

FOUNDATION: Ground showing "No Collapse"

Side panels showing what happens when each is removed:
- Remove EMA → Building tilts → "Fails to converge"
- Remove Centering → Building collapses left → "Mode collapse"
- Remove Sharpening → Building collapses right → "Uniform collapse"

Style: Architectural metaphor diagram, 3D isometric style, clean colors, professional infographic.
```

---

## Slide 11: Multi-Crop Strategy

### Image 11.1: Local-to-Global Crops Visualization
```
Diagram showing multi-crop strategy:

CENTER: Original full image of a bird

SURROUNDING the image:
TOP-LEFT: Large crop (224×224) covering >50% of bird - labeled "Global 1 → Teacher"
TOP-RIGHT: Large crop (224×224) covering >50% of bird - labeled "Global 2 → Teacher"

BOTTOM ROW: Six small crops (96×96) showing:
- Just the beak
- Just the eye
- Just wing feathers
- Just tail
- Just feet
- Part of background with wing edge
Each labeled "Local → Student"

INSIGHT CALLOUT: "See fin → Know it's a fish"

Size comparison: Show 224×224 box vs 96×96 box with labels

Style: Clean image crops with dashed borders, size annotations, arrow indicators, professional layout.
```

---

## Slide 14: Data Curation Pipeline

### Image 14.1: Data Funnel Diagram
```
Funnel diagram showing data curation pipeline:

TOP (widest): "1.2B raw images" - dark gray
↓ Filter icon: "Safety + NSFW filter"
LEVEL 2: "1.1B images" - lighter gray
↓ Filter icon: "Copy-detection dedup (k=64, sim>0.6)"
LEVEL 3: "744M images" - even lighter
↓ Filter icon: "Benchmark leak removal (sim>0.45)"
LEVEL 4: "Self-supervised retrieval (k-means 100k)"
BOTTOM (narrowest): "142M curated images" - green, highlighted

Side annotations:
- Faiss library icon
- "20 nodes × 8 V100 GPUs"
- "< 2 days processing"

Key insight callout: "142M curated > 1.2B uncurated"

Style: Funnel/pyramid infographic, gradient colors from gray to green, filter icons, professional data pipeline visualization.
```

---

## Slide 15: iBOT Masked Prediction

### Image 15.1: iBOT Mechanism Diagram
```
Side-by-side comparison showing iBOT vs MAE:

LEFT SIDE "iBOT (DINOv2)":
- Input: Image with some patches MASKED (shown as gray squares)
- Arrow to Student network
- Student must predict: "Semantic token from Teacher"
- Teacher sees: Full image (no masks)
- Output: Probability distribution over prototypes
- Label: "Predicts MEANING"

RIGHT SIDE "MAE":
- Input: Image with patches masked
- Arrow to Encoder-Decoder
- Must predict: "Raw pixel values"
- Output: Reconstructed image patches
- Label: "Predicts PIXELS"

BOTTOM: Comparison showing:
- iBOT features: "Works frozen ✓"
- MAE features: "Needs finetuning ✗"

Style: Technical diagram, split comparison, masked patches shown clearly, encoder/decoder blocks, professional ML architecture style.
```

---

## Slide 16: KoLeo Loss Visualization

### Image 16.1: KoLeo Effect on Feature Space
```
Two 2D scatter plots showing feature space:

LEFT "Without KoLeo":
- Points clustered in tight groups
- Several clusters very close together
- Some areas of feature space empty
- Label: "Clustered → Poor retrieval"

RIGHT "With KoLeo":
- Points spread uniformly across the space
- Even spacing between all points
- Full coverage of feature space
- Label: "Uniform → Good retrieval"

CENTER: Arrow showing transformation with formula:
"L = -1/n Σ log(min distance to neighbor)"
"Maximize distance to nearest neighbor"

Visual of single point with arrows pushing away from neighbors.

Style: Clean scatter plots, distinct colors, professional data visualization, mathematical annotation.
```

---

## Slide 17: Three Losses Combined

### Image 17.1: Three-Loss Architecture Diagram
```
Comprehensive architecture diagram:

INPUT: Image at top

BACKBONE: Large "ViT Backbone" box in center

TWO BRANCHES from backbone:
LEFT BRANCH:
- "CLS Token" → "DINO Head" → "L_DINO (Global)"
- Blue color scheme

RIGHT BRANCH:
- "Patch Tokens" → "Mask" → "iBOT Head" → "L_iBOT (Local)"
- Orange color scheme

BOTTOM:
- "0.1 × L_KoLeo (Diversity)" connecting to CLS tokens
- Green color scheme

TOTAL: "L = L_DINO + L_iBOT + 0.1 × L_KoLeo"

Annotations for each loss:
- DINO: "Image-level semantics"
- iBOT: "Patch-level understanding"
- KoLeo: "Prevents clustering"

Style: Neural network architecture diagram, color-coded branches, clean flow arrows, professional ML diagram.
```

---

## Slide 19: Dense Feature Degradation

### Image 19.1: Training Dynamics Graph
```
Line graph showing training dynamics over iterations:

X-AXIS: "Training iterations" (0 to 1M)
Y-AXIS: "Performance"

TWO LINES:
- BLUE line "ImageNet (Classification)": Steadily increasing throughout
- RED line "ADE20k (Segmentation)": Increases until ~200k, then DECREASES

KEY ANNOTATIONS:
- Vertical dashed line at 200k: "Peak dense performance"
- Arrow pointing to declining red line: "Dense features DEGRADE"
- Gap at 1M showing divergence between lines

CALLOUT: "Global keeps improving, but local gets WORSE"

Style: Clean line graph, professional scientific visualization, clear legend, grid lines.
```

### Image 19.2: Patch Similarity Degradation
```
Two similarity heatmaps side by side:

LEFT "200k iterations":
- Heatmap showing similarity of one reference patch to all others
- Sharp, localized high-similarity region
- Clear spatial structure
- Label: "Crisp, localized"

RIGHT "1M iterations":
- Same visualization but degraded
- Similarity spread everywhere
- Noisy, no clear structure
- Label: "Noisy, smeared"

Reference patch highlighted with a box in both images.

Style: Scientific heatmaps, diverging colormap (blue-white-red), professional visualization.
```

---

## Slide 20: Gram Anchoring

### Image 20.1: Gram Matrix Concept
```
Visual explanation of Gram matrix:

LEFT: Grid of image patches (P patches)
Each patch has a feature vector (d dimensions)

CENTER: Matrix multiplication visualization:
"X (P×d) × X^T (d×P) = G (P×P)"

RIGHT: Gram matrix G visualization:
- P×P heatmap
- Each cell G[i,j] = cosine similarity between patch i and j
- Diagonal is all 1s (self-similarity)
- Symmetric matrix

BOTTOM: Interpretation
"G captures: Which patches are similar to which"

Style: Matrix visualization, clean mathematical diagram, heatmap for G, professional linear algebra visualization.
```

### Image 20.2: Gram Anchoring Loss Diagram
```
Diagram showing Gram Anchoring mechanism:

TOP: Two parallel paths:
LEFT PATH:
- "Student (current)" → Features X_S → Gram matrix G_S

RIGHT PATH:
- "Gram Teacher (early checkpoint)" → Features X_G → Gram matrix G_G
- Note: "From iteration 100k-200k"

BOTTOM: Loss computation:
- Two Gram matrices side by side
- Difference highlighted
- "L_Gram = ||G_S - G_G||²"

KEY INSIGHT CALLOUT:
"Preserve STRUCTURE, not specific values"
"Features can rotate/scale, just keep relative similarities"

Style: Flow diagram, matrix visualizations, clean arrows, professional ML diagram.
```

---

## Slide 21: Text Alignment

### Image 21.1: CLIP vs DINOv3 Comparison
```
Split comparison diagram:

LEFT SIDE "CLIP":
- Image encoder and Text encoder training TOGETHER
- Bidirectional arrows between them
- Both encoders updating
- Output: CLS token only
- Label: "Joint training → Dense features degraded"

RIGHT SIDE "DINOv3":
- Phase 1: Image encoder training alone (SSL)
- Phase 2: Image encoder FROZEN, Text encoder training
- Output: CLS + Mean-pooled patches
- Label: "Decoupled → Dense features preserved"

BOTTOM: Results comparison
- CLIP ADE20k: 6.0 mIoU
- DINOv3 ADE20k: 24.7 mIoU (4× better!)

Style: Architecture comparison diagram, freeze icon for frozen encoder, clean flow arrows.
```

---

## Slide 23: Evolution Timeline

### Image 23.1: DINO Evolution Infographic
```
Horizontal timeline infographic:

2021 ─────────────── 2023 ─────────────── 2025
  │                    │                    │
  ▼                    ▼                    ▼
┌─────────┐        ┌─────────┐        ┌─────────┐
│ DINOv1  │        │ DINOv2  │        │ DINOv3  │
│  BLUE   │───────▶│ ORANGE  │───────▶│  GREEN  │
│ 80.1%   │        │ 86.5%   │        │ 88.4%   │
└─────────┘        └─────────┘        └─────────┘

Below each version, a card showing:

v1 Card:
- Problem: "Learn without labels"
- Solution: "EMA + Centering + Sharpening"
- Icon: Brain with question mark

v2 Card:
- Problem: "Dense tasks weak"
- Solution: "iBOT + KoLeo + Data curation"
- Icon: Segmentation mask

v3 Card:
- Problem: "Scale causes degradation"
- Solution: "Gram Anchoring + Text Alignment"
- Icon: Scaling graph

Style: Clean timeline infographic, version-colored cards, icons, professional corporate style.
```

---

## General Style Guidelines

### Color Palette
```
DINOv1: #1565C0 (Blue)
DINOv2: #FF6D00 (Orange)
DINOv3: #2E7D32 (Green)
Accent/Warning: #C62828 (Red)
Background: #FFFFFF (White)
Text: #212121 (Near Black)
Secondary Text: #616161 (Gray)
```

### Typography Suggestions
```
Titles: Bold, 32-36pt
Body text: Regular, 24-28pt (MIN 28pt for readability)
Code/Formulas: Monospace (Consolas), 20-24pt
Annotations: 14-18pt, italic or light weight
```

### Diagram Style
```
- Clean, flat design (no 3D effects unless specifically needed)
- Rounded corners on boxes (4-8px radius)
- 2-3px stroke width for arrows and lines
- White background preferred
- Use color sparingly for emphasis
- Include legends when using multiple colors
- Sans-serif fonts throughout
```

### Image Specifications
```
Resolution: 1920x1080 (16:9) or 2560x1440 for high-res
Format: PNG for diagrams (transparency), JPG for photos
DPI: 150-300 for print quality
```
