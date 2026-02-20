# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PowerPoint presentation generator for a Vietnamese university seminar about DINO (self-DIstillation with NO labels) - a self-supervised vision learning paper series (v1 2021, v2 2023, v3 2025). Uses Node.js with `pptxgenjs` library.

**Target audience**: Master's students with ML background (neural networks, loss, gradient descent, optimization)
**Duration**: 30 minutes (~24 slides)
**Language**: Vietnamese

## Commands

```bash
# Install dependencies
npm install

# Generate full presentation
node dino_v68.js

# Generate slide images (requires Gemini API key in .env)
node generate_image.js [slide_number]
```

Output: `DINO_Seminar_v68.pptx`

## Content Workflow

```
DINO_Foundation.md      →    slide_outline_v69.md    →    dino_v68.js
(Reference document)         (Slide outline)              (Presentation code)
        ↓                            ↓
Vietnamese_Glossary.md       image_prompts_v68.md
(Terms handout)              (Image generation prompts)
```

### Key Files

| File | Purpose |
|------|---------|
| `DINO_Foundation.md` | Comprehensive reference with full formulas from papers |
| `slide_outline_v69.md` | Current slide outline (24 slides, Vietnamese) |
| `dino_v68.js` | PowerPoint generator (Vietnamese) |
| `generate_image.js` | Gemini/Imagen API image generator |
| `image_prompts_v68.md` | Image prompts for key slides |
| `Vietnamese_Glossary.md` | 30+ technical terms, printable handout |

## Current Version: v68/v69 (Master's Class)

**Structure: 24 slides, 30 minutes**

| Section | Slides | Content |
|---------|--------|---------|
| 1. Hook & Problem | 2 | Attention demo, labeled data cost |
| 2. DINOv1 Core | 10 | Architecture, loss, EMA, centering, sharpening, multi-crop |
| 3. Evolution to v2 | 6 | Data curation, iBOT, KoLeo, three losses |
| 4. Evolution to v3 | 4 | Dense degradation, Gram anchoring, text alignment |
| 5. Synthesis | 2 | Timeline, takeaways |

**Math depth**: Full derivations from papers
- Loss: `L = -Σ_k P_t(x)[k] · log P_s(x')[k]` with P_s, P_t formulas
- EMA: `θ_t ← λθ_t + (1-λ)θ_s`, cosine schedule `λ(t) = 1 - (1-λ_base)×(1+cos(πt/T))/2`
- Centering: `c ← m·c + (1-m)·(1/B)Σg_θt(xi)`
- KoLeo: `L = -(1/n) Σᵢ log(min_{j≠i} ||xi - xj||)`
- Gram: `L_Gram = ||X_S·X_S^T - X_G·X_G^T||²_F`

## Architecture

Single-file structure (`dino_v68.js`):

1. **Design System Constants**
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

## Coding Conventions

- Use design system constants (`C.green`, `FONT`, `M`, `CW`) - never hardcode colors/dimensions
- Each slide wrapped in IIFE to isolate scope
- All text must use minimum 28pt font (`MIN_FONT`)
- Tables: green header with white text, alternating row backgrounds
- Highlights use `C.red` for emphasis
- Speaker notes via `slide.addNotes()` in Vietnamese
- Math formulas: use `fontFace: "Consolas"` for monospace

## Content Guidelines

### For Master's Class (Rigorous)

1. Show visual example first (create curiosity)
2. Present full mathematical derivation
3. Explain intuition behind each term
4. Connect to prior/next concepts
5. Include ablation results where relevant

### Technical Terms

All terms defined in `Vietnamese_Glossary.md`. Key terms:
- CLS token → Token phân loại
- Linear probe → Đầu tuyến tính
- Collapse → Sụp đổ (Mode collapse vs Uniform collapse)
- mIoU → (giữ nguyên, giải thích ý nghĩa)

## Future: Per-Slide Generation

For more control over individual slides, can generate slides one-by-one:

```javascript
// Generate single slide to separate file
function generateSlide(slideNum) {
  const pres = new pptxgen();
  // ... add single slide
  pres.writeFile({ fileName: `slide_${slideNum.toString().padStart(2, '0')}.pptx` });
}
```

This allows:
- Iterating on individual slides
- A/B testing different versions
- Easier review process

## Version History

| Version | Target | Slides | Duration | Changes |
|---------|--------|--------|----------|---------|
| v6.3 | Undergrad | 32 | 40 min | Balanced v1/v2/v3, examples-first |
| v68 | Master's | 24 | 30 min | Full math derivations, Vietnamese |
| v69 | Master's | 24 | 30 min | Refined outline, same structure |

## Environment Setup

```bash
# .env file (not committed)
gemini-key=YOUR_GEMINI_API_KEY
```
