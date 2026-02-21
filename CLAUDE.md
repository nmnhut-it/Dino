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

# Generate full presentation (modular - RECOMMENDED)
cd slides && node generate.js

# Generate single slide (for iteration)
cd slides && node generate.js 5

# Generate range of slides
cd slides && node generate.js 1 10

# Generate each slide as separate file
cd slides && node generate.js --single

# Generate images (requires Gemini API key in .env)
node generate_image.js [slide_number]
```

Output:
- Full presentation: `DINO_Seminar_v69.pptx`
- Single slides: `output/slide_XX.pptx`

## Content Workflow

```
DINO_Foundation.md      →    slides/*.js           →    DINO_Seminar_v69.pptx
(Reference document)         (Modular slide code)       (Final presentation)
        ↓                            ↓
Vietnamese_Glossary.md       slide_outline_v69.md
(Terms handout)              (Content reference)
```

### Key Files

| File/Folder | Purpose |
|-------------|---------|
| `DINO_Foundation.md` | Comprehensive reference with full formulas from papers |
| `slides/` | **Modular slide code** (24 files, 1 per slide) |
| `slides/config.js` | Shared design system, colors, helper functions |
| `slides/generate.js` | Main generator (all/single/range options) |
| `slide_outline_v69.md` | Content outline with speaker notes |
| `generate_image.js` | Gemini/Imagen API image generator |

## Modular Slide Architecture (v69)

```
slides/
├── config.js         # Design system, colors, helpers
├── generate.js       # Main generator script
├── slide_01.js       # Slide 1: Attention Maps Demo
├── slide_02.js       # Slide 2: The Goal
├── ...
└── slide_24.js       # Slide 24: Takeaways
```

### Editing a Single Slide

```javascript
// slides/slide_05.js - Loss Function

const { C, FONT, M, CW, addTitle, addProgress, addFormula } = require('./config');

function create(pres) {
  const s = pres.addSlide();
  s.background = { color: C.bg };

  addTitle(s, "Hàm Loss - Đo Sự Khác Biệt", C.v1);
  addFormula(s, "L = -Σₖ Pₜ(x)[k] · log Pₛ(x')[k]", M, 1.6, CW, 0.8, C.v1);
  // ... more content

  addProgress(s, 2);
  s.addNotes(`Vietnamese speaker notes here...`);

  return s;
}

module.exports = { create };
```

### Design System (config.js)

```javascript
// Colors
C.green    // Primary
C.accent   // Red highlights
C.v1       // Blue (DINOv1)
C.v2       // Purple (DINOv2)
C.v3       // Teal (DINOv3)

// Helpers
addTitle(slide, text, color)      // Title bar
addProgress(slide, sectionNum)    // Progress indicator
addFormula(slide, text, ...)      // Formula box
addTable(slide, headers, rows, x, y, w)
addBullets(slide, items, x, y, w, h)
addPlaceholder(slide, x, y, w, h, label)
```

## Presentation Structure (24 slides, 30 min)

| Section | Slides | Content |
|---------|--------|---------|
| 1. Hook & Problem | 1-2 | Attention demo, labeled data cost |
| 2. DINOv1 Core | 3-12 | Architecture, loss, EMA, centering, sharpening, multi-crop |
| 3. Evolution to v2 | 13-18 | Data curation, iBOT, KoLeo, three losses |
| 4. Evolution to v3 | 19-22 | Dense degradation, Gram anchoring, text alignment |
| 5. Synthesis | 23-24 | Timeline, takeaways |

## Key Formulas (from papers)

| Concept | Formula |
|---------|---------|
| Loss | `L = -Σ_k P_t(x)[k] · log P_s(x')[k]` |
| EMA | `θ_t ← λθ_t + (1-λ)θ_s`, cosine schedule |
| Centering | `c ← m·c + (1-m)·(1/B)Σg_θt(xi)` |
| KoLeo | `L = -(1/n) Σᵢ log(min_{j≠i} ||xi - xj||)` |
| Gram | `L_Gram = ||X_S·X_S^T - X_G·X_G^T||²_F` |

## Coding Conventions

- Use design system constants (`C.green`, `FONT`, `M`) - never hardcode
- Each slide exports `{ create }` function
- Speaker notes in Vietnamese via `slide.addNotes()`
- Math formulas use `FONT_MONO` (Consolas)
- Tables: green header, alternating row backgrounds

## Version History

| Version | Architecture | Slides | Notes |
|---------|--------------|--------|-------|
| v6.3 | Single file | 32 | Undergrad, examples-first |
| v68 | Single file | 24 | Master's, Vietnamese |
| v69 | **Modular** | 24 | Each slide = separate file |

## Environment Setup

```bash
# .env file (not committed)
gemini-key=YOUR_GEMINI_API_KEY
```
