---
title: "JavaScript Performance: TypeScript in Go and Faster Builds"
excerpt: "The JS tooling landscape is shifting from JavaScript-based tools to native binaries (Rust/Go) to achieve massive performance gains."
date: "2026-05-25"
author: "Norbert Br3tt"
categories: ["JavaScript", "Performance", "Tooling"]
coverImage: "/images/js_performance_infographic.png"
coverWidth: 16
coverHeight: 9
updated: "2026-05-25"
---

# JavaScript Performance: TypeScript in Go and Faster Builds

For years, the JavaScript ecosystem relied on tools written _in_ JavaScript to build JavaScript apps—Webpack, Babel, ESLint, Prettier. But the tooling landscape is undergoing a massive shift. We are abandoning Node.js for native binaries written in Rust and Go to achieve unprecedented performance gains. This isn't a niche experiment anymore. It's the new mainstream.

## The Performance Problem

Let's be honest about _why_ this shift is happening. JavaScript was never designed to be a systems-level language, and the cracks show when you push it hard:

- **Single-threaded execution.** Node.js runs on a single thread by default. Your 16-core machine? Mostly idle during a Webpack build. Worker threads exist, but bolting parallelism onto a fundamentally single-threaded runtime is clunky at best.
- **Interpreted overhead.** Even with V8's JIT compiler, JavaScript carries the weight of dynamic typing, prototype chains, and runtime type checks. A native binary compiled ahead of time simply starts faster and runs tighter.
- **Garbage collection pauses.** Large builds allocate millions of short-lived AST nodes. The GC has to pause execution to sweep them up. On a big monorepo, these pauses add up to seconds of dead time.
- **String-heavy parsing.** JavaScript tooling does an enormous amount of string manipulation—regex matching, source map generation, code transforms. Native languages handle raw byte buffers dramatically faster.

How bad is it in practice? A mid-sized Webpack 5 project (say, 2,000 modules) typically takes **30–90 seconds** for a production build. Enterprise monorepos with 10,000+ modules? You're looking at **3–8 minutes**. Cold starts in development can take 10–20 seconds before you see anything in the browser. Developers were spending _hours per week_ just waiting for tools to finish.

That's the gap native tooling is closing.

## The Native Tooling Revolution

The migration to native-speed tooling didn't happen overnight. Here are the major players and what each one tackles:

- **esbuild** (Go) — The one that started it all. A bundler and minifier written in Go by Evan Wallace. It's 10–100x faster than Webpack for most tasks and proved that native JS tooling wasn't just possible—it was transformative. Vite uses it for dev-time dependency pre-bundling.
- **SWC** (Rust) — A Rust-based compiler that replaces Babel for transpilation. Next.js adopted it as the default compiler, and it's roughly 20x faster than Babel. It handles JSX transforms, TypeScript stripping, and minification.
- **Biome** (Rust) — The successor to the Rome project. A unified formatter _and_ linter in a single Rust binary. Replaces both ESLint and Prettier with one tool that's 20–35x faster.
- **oxc** (Rust) — The Oxidation Compiler project. Building a full Rust-based toolchain from scratch: parser, linter (oxlint), resolver, transformer, and eventually a minifier. Designed for maximum correctness and speed.
- **Turbopack** (Rust) — Vercel's Rust-powered successor to Webpack, built by Tobias Koppers (the original Webpack creator). Designed for incremental computation, so rebuilds only reprocess what changed. Ships inside Next.js.
- **Rolldown** (Rust) — The Rust rewrite of Rollup, designed to unify Vite's build pipeline. More on this below.

The pattern is clear: every critical JS tool is being rewritten in a compiled language. The JavaScript-tools-for-JavaScript era is ending.

## TypeScript's Go Port

One of the most exciting developments is Microsoft's project to port the TypeScript compiler to Go. This isn't a prototype or experiment—it's an official effort led by Anders Hejlsberg himself, the original creator of TypeScript (and C#, and Turbo Pascal).

### The Benchmarks

The numbers are staggering. On the VS Code codebase—one of the largest TypeScript projects in the world:

- **Type-checking time: 77.8 seconds → 7.5 seconds** (10.4x faster)
- **Editor startup / project load: near-instant** compared to multi-second waits
- **Memory usage: significantly reduced** thanks to Go's more predictable allocation patterns

For smaller projects the improvement is just as dramatic in relative terms. A typical 500-file project that takes 4 seconds to type-check drops to under 400 milliseconds.

### What the Go Port Covers (and Doesn't)

The port covers the core pipeline: **scanning, parsing, binding, type-checking, and emit**. That's the expensive stuff—the parts that make `tsc --noEmit` slow.

What's _not_ ported yet:

- **Language Server Protocol (LSP)** — The full VS Code IntelliSense experience. This is actively in development and is the highest priority after the core compiler.
- **Project references and composite builds** — Incremental build orchestration for monorepos.
- **All compiler options** — Some niche flags are still being validated.
- **Plugin API** — The transformer plugin system is not yet available in the Go version.

The Go-based `tsc` is expected to reach feature parity for most workflows by late 2026, with the LSP following shortly after. Microsoft has signaled this will eventually become _the_ TypeScript compiler, not a sidecar.

### Why Go Instead of Rust?

While Rust dominates the JS tooling space, the TypeScript team chose Go for specific, well-reasoned tradeoffs:

- **Garbage collection fits the workload.** A type checker creates millions of interconnected AST nodes with complex, non-linear reference patterns. Rust's ownership model would require extensive use of `Rc<RefCell<T>>` or arena allocators, adding friction to a direct port. Go's GC handles this naturally.
- **Struct memory layout.** Go gives fine-grained control over struct layouts and value types, which is critical for cache-friendly AST traversal.
- **Porting velocity.** The existing TypeScript codebase is massive (~1M lines). Go's simpler syntax and semantics made a faithful port faster to execute than a Rust rewrite would have been.

This isn't a statement that Go is "better" than Rust. It's that Go was the better fit _for porting this specific codebase_.

## Rolldown: Vite's Supercharged Future

Evan You (creator of Vue and Vite) and his team are building **Rolldown**, a Rust-based bundler designed to replace both esbuild _and_ Rollup inside Vite—unifying the entire pipeline.

### The Problem Rolldown Solves

Currently, Vite uses a two-tool architecture:

1. **esbuild** for dev-time dependency pre-bundling (fast, but limited plugin support)
2. **Rollup** for production builds (flexible plugins, but written in JS and slow)

This split means code can occasionally behave differently between dev and prod. Different tree-shaking algorithms, different module resolution, different chunk splitting. Rolldown eliminates this by being one tool for both.

### Architecture: How Rolldown Differs from Rollup

Rolldown isn't just "Rollup but faster." It rethinks several internals:

- **Parallel parsing.** Rollup parses modules sequentially. Rolldown parses all discovered modules in parallel across threads.
- **Native module resolution.** Uses oxc's Rust-based resolver instead of Node's `require.resolve`, which is significantly faster for deep `node_modules` trees.
- **Rust plugin hooks with JS compatibility.** Rolldown supports Rollup's plugin interface for backward compatibility, but also exposes native Rust hooks for plugins that need maximum speed.
- **Incremental architecture.** Designed from the ground up for incremental rebuilds, not bolted on after the fact.

### What Vite Looks Like With Rolldown

Vite 6 introduced Rolldown as an experimental backend via the `Environment API`. In Vite 7 (expected late 2026), Rolldown becomes the default bundler for both dev and production:

- **Dev server:** Rolldown handles dependency pre-bundling _and_ on-demand module transformation—no more esbuild dependency.
- **Production builds:** Rolldown replaces Rollup entirely, with full plugin compatibility for the existing Vite plugin ecosystem.
- **Single behavior model:** What you see in dev is exactly what you get in prod. One resolver, one transformer, one tree-shaker.

### Comparison: esbuild vs Rollup vs Rolldown

| Feature                | esbuild      | Rollup        | Rolldown             |
| ---------------------- | ------------ | ------------- | -------------------- |
| **Language**           | Go           | JavaScript    | Rust                 |
| **Speed**              | Very fast    | Slow          | Very fast            |
| **Plugin ecosystem**   | Limited      | Extensive     | Rollup-compatible    |
| **Tree-shaking**       | Basic        | Excellent     | Excellent            |
| **Code splitting**     | Basic        | Advanced      | Advanced             |
| **Dev + Prod unified** | No           | No            | Yes                  |
| **CSS handling**       | Basic        | Via plugins   | Built-in (planned)   |
| **Designed for Vite**  | No (adapted) | Yes (current) | Yes (future default) |

## Replacing ESLint and Prettier: oxlint and Biome

The linting and formatting layer is also getting the native treatment. Two tools are leading the charge:

### oxlint

Part of the oxc project, **oxlint** is a Rust-based linter that's 50–100x faster than ESLint. It supports hundreds of rules out of the box with zero configuration needed:

```bash
# Install and run — no config file required
npx oxlint@latest
```

oxlint comes with sensible defaults covering correctness, suspicious patterns, and pedantic style rules. You can customize via an `oxlintrc.json`:

```json
{
  "rules": {
    "no-unused-vars": "warn",
    "no-console": "off",
    "eqeqeq": "error"
  },
  "ignorePatterns": ["dist", "node_modules"]
}
```

The practical move right now: **run oxlint alongside ESLint**. Use oxlint for the fast feedback loop during development, keep ESLint for the rules oxlint doesn't cover yet (custom plugins, framework-specific rules).

### Biome

**Biome** takes a different philosophy—it's a single binary that replaces _both_ ESLint and Prettier:

```bash
# Initialize Biome in your project
npx @biomejs/biome init

# Format and lint in one command
npx @biomejs/biome check --write .
```

A minimal `biome.json` gives you full control:

```json
{
  "formatter": {
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100
  },
  "linter": {
    "rules": {
      "recommended": true,
      "correctness": {
        "noUnusedVariables": "warn"
      }
    }
  }
}
```

Biome formats and lints your entire codebase in a single pass. On a 5,000-file project, that's typically **under 500 milliseconds** versus 30+ seconds for ESLint + Prettier combined.

## What This Means for Your Workflow Today

Not every tool is production-ready for every use case. Here's a practical guide on what to adopt now:

**Adopt today with confidence:**

- **SWC** — If you're on Next.js, you're already using it. If not, swap Babel for SWC in your build pipeline. The migration is straightforward.
- **Biome or oxlint** — Run alongside (or instead of) ESLint/Prettier. The speed improvement alone justifies it, and both tools are stable.
- **esbuild** — Battle-tested. If you're not using Vite, esbuild is a solid standalone bundler for many projects.

**Adopt for new projects:**

- **Vite with Rolldown** — If starting a new project in late 2026, use Vite 7 with Rolldown as the default. For existing Vite projects, the migration will be seamless.
- **TypeScript Go compiler** — Watch this space. Once the LSP is ready, expect VS Code to ship it as the default. Until then, the native `tsc` is already usable for CI type-checking.

**Wait and watch:**

- **Turbopack** — Currently tightly coupled to Next.js. If you're not in the Next.js ecosystem, there's no reason to adopt it directly yet.

## The Tradeoffs of Native Tooling

It's not all upside. Moving critical infrastructure from JavaScript to Rust and Go introduces real costs:

- **Contribution barrier.** Your average frontend developer can read and contribute to a Webpack plugin written in JavaScript. Contributing to Rolldown requires knowing Rust. The contributor pool shrinks dramatically.
- **Plugin ecosystems reset.** Babel has thousands of plugins. SWC has… far fewer. Rolldown supports Rollup plugins for compatibility, but native Rust plugins are a different world. The ecosystem needs time to rebuild.
- **Debugging complexity.** When your JS-based bundler breaks, you read a JavaScript stack trace. When a Rust tool segfaults or produces unexpected output, debugging is harder for most web developers.
- **Platform-specific binaries.** Native tools need to ship prebuilt binaries for every platform (macOS ARM, macOS Intel, Linux x64, Linux ARM, Windows). This creates CI complexity and occasional "binary not found" issues on exotic setups.
- **Lock-in risk.** When a tool is written in a language most of its users can't read, the community depends more heavily on the core team. If that team loses funding or interest, forking is much harder than with a JavaScript project.

These are manageable tradeoffs, and the performance gains are worth it for most teams. But they're worth understanding before you rip out your entire toolchain.

## The Bottom Line

The JavaScript tooling landscape is undergoing its most significant transformation since the Webpack era. TypeScript's Go port will make type-checking feel instant. Rolldown will unify Vite's build pipeline into a single, blazing-fast Rust binary. Biome and oxlint are making linting and formatting effectively free in terms of developer wait time.

The direction is irreversible: **the tools that build your JavaScript will no longer be written in JavaScript.** And that's a good thing. Developers shouldn't spend their time waiting for tools. They should spend it building products.

The best part? Most of these transitions will be invisible. You'll run `vite build` and it'll just be 50x faster. You'll open VS Code and type-checking will just be instant. The tools change underneath; your workflow stays the same—just faster.

Start experimenting with these tools now. The ones that are ready today (SWC, Biome, esbuild) deliver immediate, measurable improvements. The ones landing later this year (Rolldown, TypeScript Go) will complete the picture. The era of waiting for JavaScript tooling is over.
