# Palette's Journal - Norbert Br3tt Portfolio

## 2025-05-15 - Premium "Skip to Content" Pattern
**Learning:** In high-end, cinematic portfolio sites with custom cursors and WebGL backgrounds, standard accessibility features like "Skip to Content" can feel jarring if not styled to match the design system. Using site-specific design tokens (e.g., `bg-accent` for the "Premium Gold" look) and positioning it as a floating badge ensures it feels like a native part of the experience rather than an afterthought.
**Action:** When adding accessibility bypass links to premium themes, leverage the theme's accent colors and typography to ensure visual harmony during keyboard navigation.

## 2025-05-15 - Svelte 5 State-Driven A11y
**Learning:** Leveraging Svelte 5's global state (runes) like `appState.currentPage` allows for a highly reliable implementation of `aria-current="page"`. This ensures that even in complex single-page-application (SPA) transitions with cinematic overlays, screen readers stay perfectly synced with the visual state.
**Action:** Always check for centralized routing state in Svelte apps before implementing manual URL parsing for active link indicators.
