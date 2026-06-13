---
title: "The New Era of CSS: If Statements, Shape Functions, and More"
excerpt: "CSS is evolving faster than ever. We are moving beyond simple styling into logic and advanced layout capabilities that previously required JavaScript or SVG."
date: "2026-05-11"
author: "Norbert Br3tt"
categories: ["CSS", "Web Development"]
coverImage: "/images/css_infographic.png"
coverWidth: 16
coverHeight: 9
updated: "2026-05-11"
---

# The New Era of CSS: If Statements, Shape Functions, and More

CSS is evolving faster than ever before. We are rapidly moving beyond simple styling and layout tweaks into the realm of complex logic and advanced rendering capabilities—features that previously required heavy JavaScript or complex inline SVGs. Based on recent explorations and the continuous push by browser vendors, here are the game-changing CSS features landing in browsers that you can start preparing for today.

## CSS `if()` Statements are Real

Perhaps the most shocking and highly anticipated update is the introduction of inline logic within CSS values. While we've had media queries for layout logic and `@supports` for feature detection, the proposed `if()` function allows for conditional values directly on properties.

This essentially acts as a style query. It allows you to check a custom property (CSS variable) and apply a value based on the result. Here's a theming system that shows the real power—building multiple button variants with a single ruleset:

```css
/* The new way: one ruleset, infinite variants */
.btn {
  --variant: default;

  background: if(
    style(--variant: primary) ? var(--blue-600): style(--variant: danger) ?
      var(--red-600): style(--variant: success) ? var(--green-600): var(--gray-200)
  );

  color: if(
    style(--variant: primary) ? #fff: style(--variant: danger) ? #fff: style(--variant: success) ?
      #fff: var(--gray-900)
  );

  border-color: if(
    style(--variant: primary) ? var(--blue-700): style(--variant: danger) ?
      var(--red-700): style(--variant: success) ? var(--green-700): var(--gray-400)
  );
}
```

To use it, you just flip the custom property on the element:

```html
<button class="btn" style="--variant: primary">Save</button>
<button class="btn" style="--variant: danger">Delete</button>
<button class="btn" style="--variant: success">Confirm</button>
```

Compare that to the old way, where each variant needed its own class and a full block of overrides:

```css
/* The old way: repetitive class-per-variant */
.btn {
  background: var(--gray-200);
  color: var(--gray-900);
}
.btn--primary {
  background: var(--blue-600);
  color: #fff;
  border-color: var(--blue-700);
}
.btn--danger {
  background: var(--red-600);
  color: #fff;
  border-color: var(--red-700);
}
.btn--success {
  background: var(--green-600);
  color: #fff;
  border-color: var(--green-700);
}
```

The `if()` approach drastically reduces the surface area of your CSS. Component states can now be managed entirely in one place without cascading overrides, and frameworks can pass variant data through custom properties instead of toggling class names in JavaScript.

## The `shape()` Function: Drawing with CSS

We are finally moving away from complex, hard-to-read polygon syntax for `clip-path`. The new `shape()` function allows you to use commands similar to the SVG Canvas API—`move`, `hline`, `vline`, `curve`—directly in CSS to draw shapes.

Here's a practical example: creating a speech bubble. First, let's see the old `polygon()` approach, which required you to manually calculate every coordinate:

```css
/* Old way: polygon() — hard to read, harder to maintain */
.speech-bubble {
  clip-path: polygon(0% 0%, 100% 0%, 100% 75%, 75% 75%, 50% 100%, 50% 75%, 0% 75%);
}
```

Good luck tweaking that tail angle without a visual editor. Now here's the same shape using `shape()`:

```css
/* New way: shape() — readable, intent-driven commands */
.speech-bubble {
  clip-path: shape(from 0% 0%) {
    hline to 100%;
    vline to 75%;
    hline to 75%;
    line to 50% 100%;   /* tip of the tail */
    line to 50% 75%;
    hline to 0%;
    close;
  };
}
```

Each command describes _intent_—"draw a horizontal line to here, then a vertical line down to there." You can read the code and visualize the shape without plotting points on graph paper. Adding curves, adjusting the tail, or animating between states becomes significantly easier. No more reaching for external tools just to generate a wavy border or a custom divider.

## Text Wrap: `balance` vs. `pretty`

Typography on the web has always been a struggle, specifically with "orphans" (single words dangling awkwardly on a new line). We now have two powerful values for the `text-wrap` property to solve this natively:

```css
/* For headlines — even line lengths */
.article-title {
  text-wrap: balance;
}

/* For body copy — prevents orphans on the last line */
.article-body p {
  text-wrap: pretty;
}
```

Here's the key difference between them:

- **`balance`**: Redistributes text so every line is roughly the same width. Ideal for headlines, pull quotes, and short blocks of text. The browser recalculates the optimal break points across _all_ lines, which makes it computationally expensive. Browsers typically cap this at around 6 lines—if your text is longer, `balance` silently falls back to normal wrapping.

- **`pretty`**: Only adjusts the _last few_ lines to prevent orphans. It won't reflow your entire paragraph; it just makes sure you don't end up with a single lonely word on the final line. This is significantly cheaper to compute and is safe to apply broadly across body text.

**Performance tip:** Don't blanket-apply `text-wrap: balance` to all text on the page. Use it surgically on headings and short UI text. For paragraphs, `pretty` gives you the visual cleanup you want without the layout cost.

## Scrollbar Styling is Finally Standardized

The `-webkit` vendor prefix mess is coming to an end. For years, styling scrollbars meant writing two completely different sets of rules. Here's what the old approach looked like alongside the new standard:

```css
/* OLD: -webkit pseudo-elements (Chrome/Safari only) */
.container::-webkit-scrollbar {
  width: 8px;
}
.container::-webkit-scrollbar-track {
  background: #f1f1f1;
}
.container::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}
.container::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* NEW: standardized properties (all modern browsers) */
.container {
  scrollbar-width: thin; /* auto | thin | none */
  scrollbar-color: #888 transparent; /* thumb-color  track-color */
}
```

Two lines replace an entire block of pseudo-element selectors. The `scrollbar-width` property accepts `auto`, `thin`, or `none`. The `scrollbar-color` property takes two values: the thumb color first, then the track color. It's less granular than the old `-webkit` approach (you can't style the hover state separately, for example), but it covers the vast majority of use cases and works everywhere.

**Gotcha:** If you need to support older browsers, keep both declarations. Browsers that understand the standard properties will ignore the `-webkit` versions, and older browsers will fall back to them gracefully.

## Content Visibility: Free Performance

The `content-visibility` property is a massive performance booster. It allows the browser to skip _all_ rendering work—layout, paint, and style—for elements that are off-screen. It's like implementing virtual scrolling, but natively built into the browser's engine with zero JavaScript.

```css
.article-section {
  content-visibility: auto;
  contain-intrinsic-size: auto 500px;
}
```

The `contain-intrinsic-size` line is critical. When the browser skips rendering an off-screen element, it doesn't know how tall that element is. Without a size hint, the scrollbar would jump erratically as elements pop into view. `contain-intrinsic-size: auto 500px` tells the browser: "Assume this element is roughly 500px tall until you render it. Once you do render it, remember the real height for next time." The `auto` keyword enables that caching behavior.

For pages with long lists, documentation, or feeds, this property alone can cut initial render time by 50% or more on heavy pages. The best part? It's progressive—browsers that don't support it simply render everything normally.

## `@starting-style`: Entry Animations Without JavaScript

Animating an element's appearance when it enters the DOM (or goes from `display: none` to visible) has always required JavaScript or class-toggling hacks. The `@starting-style` rule finally solves this natively:

```css
.dialog {
  opacity: 1;
  transform: translateY(0);
  transition:
    opacity 0.3s,
    transform 0.3s;
}

@starting-style {
  .dialog {
    opacity: 0;
    transform: translateY(20px);
  }
}
```

When `.dialog` first appears on the page, it begins with the values defined inside `@starting-style` and transitions smoothly to its normal state. No need for `requestAnimationFrame` tricks, no need to add a `.is-visible` class after a microtask delay. This pairs beautifully with the `<dialog>` element and popovers, giving you smooth entry animations that previously required animation libraries.

**Tip:** Combine `@starting-style` with `transition-behavior: allow-discrete` to also animate properties that are normally not animatable, like `display` itself—so you can transition from `display: none` to `display: block` with a fade.

## Anchor Positioning: Tooltips and Popovers Without JS

CSS anchor positioning lets you tether one element to another purely in CSS. No more `getBoundingClientRect()` calls, no more ResizeObserver hacks, no more fighting with `position: absolute` and manual offset calculations.

```css
.trigger {
  anchor-name: --my-trigger;
}

.tooltip {
  position: fixed;
  position-anchor: --my-trigger;
  top: anchor(bottom);
  left: anchor(center);
  translate: -50% 8px;
}
```

The tooltip will follow `.trigger` wherever it appears on the page—even if the layout shifts, the container scrolls, or the viewport resizes. The browser handles all the math. You can also use `position-try-fallbacks` to define fallback positions (e.g., flip to the top if there's no room below), which replaces the overflow-detection logic that libraries like Floating UI handle today.

This is a massive win for component libraries. Dropdown menus, date pickers, comboboxes, and contextual toolbars can all be positioned declaratively in CSS instead of relying on JavaScript positioning engines.

## Browser Support and Progressive Enhancement

Most of these features are at different stages of browser adoption. Here's a practical strategy for using them today:

- **Ship now:** `text-wrap: pretty`, `scrollbar-color`, `content-visibility`, `@starting-style`. These degrade gracefully—if a browser doesn't support them, the user just gets the default behavior.
- **Ship with `@supports`:** Anchor positioning and `shape()`. Wrap them in a feature query and provide a reasonable fallback layout.
- **Experiment:** `if()` is still in active development. Prototype with it in side projects to get familiar with the mental model, but don't ship it to production yet.

The general rule: if a feature enhances the experience but the fallback is perfectly acceptable, ship it. CSS is uniquely forgiving—unknown properties are simply ignored, which makes progressive enhancement the default behavior of the language itself.

The future of CSS is logical, performant, and incredibly powerful. The gap between "what CSS can do" and "what we need JavaScript for" is shrinking with every browser release. Start exploring these features today to stay ahead of the curve.
