---
name: Norbert Br3tt Portfolio
description: A premium, bespoke portfolio and blog system for an AI specialist, using gold and obsidian.
colors:
  primary: "#d4b055"
  primary-light: "#b89230"
  neutral-bg: "#181715"
  neutral-bg-light: "#f6f3eb"
  neutral-fg: "#f4efe6"
  neutral-fg-light: "#181715"
  muted: "#242220"
  muted-light: "#eae3d5"
  border: "#35322f"
  border-light: "#ddd5c6"
typography:
  display:
    fontFamily: "Prata, serif"
    fontSize: "clamp(2.5rem, 6vw, 5rem)"
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Geist, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  mono:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  sm: "4px"
  md: "12px"
  lg: "24px"
  full: "9999px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "32px"
  xl: "64px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#181715"
    rounded: "{rounded.full}"
    padding: "12px 28px"
  button-primary-hover:
    backgroundColor: "#ffffff"
    textColor: "#181715"
  card:
    backgroundColor: "{colors.muted}"
    rounded: "{rounded.md}"
    padding: "24px"
---

# Design System: Norbert Br3tt Portfolio

## 1. Overview

**Creative North Star: "The Obsidian Goldsmith"**

This system represents a high-agency developer and AI specialist portfolio. The visual atmosphere is one of creative technicality, merging highly structured monospaced layout elements (terminal, statistics) with the elegance of classical editorial layouts. It is characterized by generous whitespace, dynamic custom page transitions, and subtle spring-driven micro-interactions.

The layout is asymmetric and spacious. We strictly reject generic bootstrap-style columns, AI-style purple-blue gradients, and standard templates.

**Key Characteristics:**

- High-contrast luxurious pairing of warm obsidian and antique gold.
- Fluid layout rhythm with a mixture of monospace metadata lines and large serif typography.
- Consistent rounded geometries (buttons are always full-pills, interactive cards are rounded to 12px).
- Zero-clutter navigation and structural components that fade into the background.

## 2. Colors

The color system relies on two dominant modes, maintaining visual consistency within each page while allowing the user to switch seamlessly.

### Primary

- **Brushed Gold** (`#d4b055`): The primary brand identifier. Used for accents, status lights, active pagination elements, and hover highlights in dark mode.
- **Polished Antique Gold** (`#b89230`): Used as the primary gold accent in light mode to guarantee sufficient contrast.

### Neutral

- **Warm Obsidian** (`#181715`): The primary canvas in dark mode and the primary ink color in light mode.
- **Ivory Silk** (`#f4efe6`): The primary ink color in dark mode.
- **Alabaster Cream** (`#f6f3eb`): The primary canvas in light mode.
- **Muted Charcoal** (`#242220`): Card and section background in dark mode.
- **Muted Silk** (`#eae3d5`): Card and section background in light mode.
- **Bronze Border** (`#35322f`): Hairlines and layout borders in dark mode.
- **Warm Stone Border** (`#ddd5c6`): Hairlines and layout borders in light mode.

### Named Rules

**The Color Contrast Lock.** Any text or icon elements overlaid directly on a gold background MUST be rendered in near-black Warm Obsidian (`#181715`) to ensure readability and WCAG AA compliance.

## 3. Typography

**Display Font:** Prata, serif  
**Body Font:** Geist, sans-serif  
**Label/Mono Font:** JetBrains Mono, monospace

### Hierarchy

- **Display** (Regular 400, `clamp(2.5rem, 6vw, 5rem)`, `1.05`): Used for hero headlines, major sections, and pull-quotes.
- **Headline** (Regular 400, `clamp(2rem, 4vw, 3.5rem)`, `1.1`): Section headings.
- **Title** (Medium 500, `1.25rem`, `1.4`): Cards, list items, and article titles.
- **Body** (Light/Regular 300/400, `1rem`, `1.6`): Long-form articles and general text blocks. Maximum width capped at `65ch` for optimal readability.
- **Label** (Regular 400, `0.75rem`, letter-spacing `0.1em`, uppercase): Eyebrows, stats labels, navigation links, and small buttons.

### Named Rules

- **The Emphasis Lock.** When emphasizing a word within a headline, use italicized or bold styles of the _same_ font family. Never inject a sans-serif word into a serif headline (or vice-versa).
- **The Descender Clearance Rule.** Any text utilizing italics with descenders (`y g j p q`) must have a minimum `leading-[1.1]` and bottom padding (`pb-1`) to prevent letters clipping.

## 4. Elevation

Depth is conveyed primarily via flat-layered structures, dynamic border shifts, and backdrop filters (glassmorphism), rather than drop shadows.

### Shadow Vocabulary

- **Whisper Shadow** (`0 8px 32px 0 var(--glass-shadow)`): Used on glass components for soft spatial separation.
- **Border Highlight**: In dark mode, borders use a semi-transparent white edge highlight; in light mode, they use a soft charcoal boundary.

### Named Rules

**The Flat-at-Rest Rule.** Interactive elements (cards, tabs) sit flat on the canvas at rest. Elevation or translation is strictly a dynamic response to user interactions (e.g. pointer hover).

## 5. Components

### Buttons

- **Shape:** Full pill (`rounded-full`, radius `9999px`).
- **Primary:** Warm Brushed Gold (`#d4b055`) background with Obsidian (`#181715`) text.
- **Interaction:** Scales down to `0.97` on `:active` with `transition: transform 160ms cubic-bezier(0.16, 1, 0.3, 1)`.
- **Secondary/Ghost:** Borderless with inline accent underlines or clean text links.

### Cards / Containers

- **Corner Style:** Medium rounded corners (`rounded-xl`, radius `12px`).
- **Background:** Dynamic Glassmorphism (`glass-panel`).
- **Borders:** Thin `1px` bronze/stone border.

### Inputs / Fields

- **Style:** Clean border-b divider with transparent backgrounds.
- **Focus:** Highlight transition of the border to primary gold.

### Navigation

- **Header Nav:** Horizontal layout in desktop, single line, height `72px` max. Collapses to an accessible drawer menu on mobile viewports.

## 6. Do's and Don'ts

### Do:

- **Do** respect the `:active` scale state (`scale(0.97)`) on all clickable elements to provide physical tactile feedback.
- **Do** wrap code elements, command logs, and timestamps strictly in `JetBrains Mono` and ensure a minimum padding.
- **Do** ensure that every text color passes a contrast check of `4.5:1` against its background before committing changes.

### Don't:

- **Don't** use standard template layouts or symmetric grids (like three identical card columns in a row).
- **Don't** use neon purple or blue gradients as text highlights or button backdrops.
- **Don't** animate a child `<img>` element on hover (e.g., hover scaling inside card containers is strictly banned).
- **Don't** use the `Inter` font for headings or visual display elements; use `Prata` and `Geist` instead.
- **Don't** use emojis in professional headings or navigation markers.
