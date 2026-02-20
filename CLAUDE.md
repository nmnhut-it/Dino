# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PowerPoint presentation generator for a Vietnamese university seminar about DINO (self-DIstillation with NO labels) - a self-supervised vision learning paper series (v1 2021, v2 2023, v3 2025). Uses Node.js with `pptxgenjs` library.

**Target audience**: CS students với ML cơ bản (biết neural network, loss, gradient descent)

## Commands

```bash
# Install dependency
npm install pptxgenjs

# Generate presentation (latest version)
node dino_v63.js
```

Output: `DINO_Seminar_v6.3.pptx`

## Content Workflow

```
DINO_Foundation.md      →    content_extraction.md    →    dino_v63.js
(Reference document)         (Slide outline)               (Presentation code)
        ↓
Vietnamese_Glossary.md
(Terms handout)
```

### Key Files

| File | Purpose |
|------|---------|
| `DINO_Foundation.md` | Comprehensive reference (~5000 từ), examples-first approach |
| `Vietnamese_Glossary.md` | 30+ technical terms, printable handout |
| `content_extraction.md` | Slide content outline with notes |
| `dino_v63.js` | Presentation generator (balanced v1/v2/v3) |

## Architecture

Single-file structure (`dino_v63.js`):

1. **Design System Constants** (lines 1-30)
   - `C`: Color palette (green/red/cream/gray theme)
   - `FONT`, `FONT_TITLE`: Roboto
   - `W`, `H`, `M`, `CW`: Layout dimensions for LAYOUT_WIDE (13.33 x 7.5)
   - `MIN_FONT`: 28pt minimum
   - `SECTIONS`: Array of section names for progress bar

2. **Helper Functions**
   - `addTitle(slide, text)`: Green italic bold title bar
   - `addSource(slide, text)`: Gray footer for citations
   - `addProgress(slide, activeSection)`: 5-section progress bar (active = red)
   - `addSectionDivider(sectionNum, sectionTitle)`: Cream background section divider
   - `makeTableHeader(texts)`, `makeTableRow(texts, rowIdx, highlights)`: Styled tables

3. **Slides**: Each slide in its own IIFE `(() => { ... })()`

## Five Presentation Sections (v6.3)

| Section | Slides | Content |
|---------|--------|---------|
| 1. Vấn đề | 2 | Chi phí gán nhãn, SSL intro |
| 2. DINOv1 | 9 | Core insight, architecture, EMA, multi-crop, collapse |
| 3. DINOv2 | 9 | LVD-142M, 3 losses, iBOT, KoLeo, Register tokens |
| 4. DINOv3 | 8 | Gram Anchoring, Text Alignment, Scaling analysis |
| 5. Tổng hợp | 4 | Comparison, evolution, applications |

**Balance**: v1, v2, v3 có độ sâu tương đương (8-9 slides mỗi section)

## Coding Conventions

- Use design system constants (`C.green`, `FONT`, `M`, `CW`) - never hardcode colors/dimensions
- Each slide wrapped in IIFE to isolate scope
- All text must use minimum 28pt font (`MIN_FONT`)
- Tables: green header with white text, alternating row backgrounds
- Highlights use `C.red` for emphasis
- Speaker notes via `slide.addNotes()` in Vietnamese
- Math formulas: use `fontFace: "Consolas"` for monospace

## Content Guidelines

### Examples First, Theory Second

For each major concept:
1. Show visual example/demo
2. Create curiosity ("How does this work?")
3. Explain mechanism with analogy
4. Show math (simplified, if needed)
5. Connect to big picture

### Math Simplification

| Complex | Simplified |
|---------|------------|
| `Attention(Q,K,V) = softmax(QK^T/√d)V` | "weight = similarity(question, answer)" |
| `θ_T ← λθ_T + (1-λ)θ_S` | "Teacher = 99.6% cũ + 0.4% mới" |
| `G = FF^T` | "Ma trận đo feature nào tương quan" |

### Technical Terms

All terms must be defined in `Vietnamese_Glossary.md` before use. Common terms:
- CLS token → Token phân loại
- Linear probe → Đầu tuyến tính
- Collapse → Sụp đổ
- mIoU → (giữ nguyên, giải thích "đo chất lượng segmentation")

## Slide Templates

### Content Slide
```javascript
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addTitle(s, "Slide Title");
  addProgress(s, SECTION_NUMBER);

  // Content here

  addSource(s, "Citation");
  s.addNotes(`Vietnamese speaker notes here`);
})();
```

### Summary Slide (cream background)
```javascript
(() => {
  const s = pres.addSlide();
  s.background = { color: C.cream };
  s.addText("Section — tóm tắt", { /* title style */ });
  // Bullet points
})();
```

## Version History

| Version | Changes |
|---------|---------|
| v6.1 | Initial 6-section structure |
| v6.2 | Removed ViT section, 5 sections |
| v6.3 | Balanced v1/v2/v3 depth, added KoLeo/Register/Gram slides |
