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

For years, the JavaScript ecosystem relied on tools written in JavaScript to build JavaScript apps, including Webpack, Babel, ESLint, and Prettier. But the tooling landscape is undergoing a massive shift. We are moving away from Node.js toward native binaries written in Rust and Go to achieve substantial performance gains. This is no longer a niche experiment; it is the new mainstream.

## The performance problem

Let's look at why this shift is happening. JavaScript was not designed for writing systems-level tooling, and the limitations become clear under heavy workloads:

- **Single-threaded execution**: Node.js runs on a single thread by default. Your multicore processor sits mostly idle during a Webpack build. While worker threads exist, implementing parallelism in a single-threaded runtime is complex and inefficient.
- **Interpreted overhead**: Even with V8's JIT compiler, JavaScript bears the runtime cost of dynamic typing, prototype chains, and check operations. A native binary compiled ahead of time starts faster and uses fewer CPU cycles.
- **Garbage collection pauses**: Large builds allocate millions of short-lived AST nodes. The garbage collector must pause execution to clean them up, which adds up to seconds of idle time in a large monorepo.
- **String parsing**: JavaScript tools perform heavy string operations, such as regular expression matching, source map generation, and code transformations. Native compiled languages handle raw byte buffers much faster.

In practice, a medium-sized Webpack 5 project with around 2,000 modules takes 30 to 90 seconds for a production build. Larger monorepos with over 10,000 modules can take three to eight minutes. Cold starts during local development can keep you waiting 10 to 20 seconds before the page renders. Developers end up spending hours every week waiting for builds.

This is the delay that native tools are addressing.

## The native tooling revolution

The transition to native-speed tooling has been building over several years. Here are the main projects and the areas they target:

- **esbuild (Go)**: A bundler and minifier written in Go by Evan Wallace. It runs 10 to 100 times faster than Webpack for most tasks, proving that native JS tooling is viable and highly effective. Vite uses it for pre-bundling dependencies in development.
- **SWC (Rust)**: A Rust-based compiler that serves as a direct replacement for Babel. Next.js adopted it as its default compiler. It is roughly 20 times faster than Babel and handles JSX transformations, TypeScript compilation, and minification.
- **Biome (Rust)**: A unified formatter and linter written in Rust. It replaces both ESLint and Prettier, running 20 to 35 times faster than the tools it replaces.
- **oxc (Rust)**: The Oxidation Compiler project. It is building a complete Rust-based toolchain from scratch, including a parser, linter (oxlint), resolver, transformer, and minifier, focused on correctness and speed.
- **Turbopack (Rust)**: Vercel's Rust-powered successor to Webpack, created by Tobias Koppers. It uses incremental computation to only compile modified files and ships inside Next.js.
- **Rolldown (Rust)**: A Rust bundler designed to replace both esbuild and Rollup inside Vite to unify the build pipeline.

The trend is clear: key pieces of the JS development stack are being rewritten in compiled languages. The era of writing JS tooling in JS is coming to an end.

## TypeScript's Go port

One of the most notable developments is Microsoft's project to rewrite the TypeScript compiler in Go. This is an official effort led by Anders Hejlsberg, the creator of TypeScript.

### The benchmarks

The initial performance figures are significant. On the VS Code codebase, which is one of the largest TypeScript projects in existence:

- Type-checking time dropped from 77.8 seconds to 7.5 seconds, running over 10 times faster.
- Editor startup and project loading are near-instant, eliminating multi-second delays.
- Memory usage is reduced because Go offers more predictable allocation patterns.

On smaller projects, the improvements are also noticeable. A project with 500 files that takes four seconds to type-check can compile in under 400 milliseconds.

### What the Go port covers and what it doesn't

The Go port covers the primary compilation phases: scanning, parsing, binding, type-checking, and emitting files. These are the main operations that slow down the compiler.

The following features are still in development:

- **Language Server Protocol (LSP)**: The engine that powers VS Code's autocomplete and IntelliSense. This is the team's primary focus after the compiler itself.
- **Project references**: Support for incremental compilation and composite builds in monorepos.
- **Niche compiler options**: Niche configuration flags that are still being implemented.
- **Plugin API**: The custom transformer plugin system is not yet available in the Go version.

The Go-based compiler is expected to match the features of the JS version for most workflows by late 2026, with the language server following shortly after. Microsoft has indicated this will eventually become the primary TypeScript compiler.

### Why Go instead of Rust?

While Rust is commonly used for new JS tools, the TypeScript team selected Go due to specific technical tradeoffs:

- **Garbage collection**: A type checker generates millions of interconnected nodes with complex reference patterns. Managing this in Rust would require extensive use of reference counting (`Rc` or `Arc`) or custom memory arenas. Go's garbage collector handles these cyclical references naturally.
- **Struct memory layout**: Go provides control over struct layouts and value types, allowing for cache-friendly AST traversals.
- **Development velocity**: The TypeScript compiler is a large codebase with about a million lines of code. Go's syntax and semantics allowed for a more straightforward port than a full Rust rewrite.

This decision does not imply that Go is generally superior to Rust, but rather that it was the more practical option for porting this specific codebase.

## Rolldown: Vite's supercharged future

Evan You and the Vite core team are building Rolldown, a Rust-based bundler designed to replace both esbuild and Rollup inside Vite.

### The problem Rolldown solves

Currently, Vite uses two different bundlers:

1. **esbuild** for pre-bundling dependencies in development because it is fast, though its plugin support is limited.
2. **Rollup** for production builds because it has a mature plugin system, despite being written in JS and running slowly.

Because of this split, code can occasionally run differently in development compared to production. They use different module resolution rules, chunk splitting algorithms, and tree-shaking logic. Rolldown aims to resolve this by providing a single bundler for both environments.

### Architecture: how Rolldown differs from Rollup

Rolldown is a complete rewrite that changes several core concepts:

- **Parallel parsing**: Rollup parses modules sequentially, whereas Rolldown parses files in parallel across multiple CPU threads.
- **Native module resolution**: It uses oxc's Rust-based resolver instead of Node's resolution logic, which speeds up lookups in deep dependency trees.
- **Rust plugin hooks**: Rolldown supports Rollup's JavaScript plugin interface for backward compatibility, but it also allows developers to write plugins in Rust for maximum speed.
- **Incremental builds**: The bundler is designed from the start to support incremental builds and caching.

### What Vite looks like with Rolldown

Vite 6 introduced Rolldown as an experimental option. In Vite 7, Rolldown is planned to become the default bundler for both development and production:

- The dev server will use Rolldown for dependency pre-bundling and module transformations, removing the esbuild dependency.
- Production builds will use Rolldown instead of Rollup, maintaining compatibility with the existing Vite plugin ecosystem.
- Both environments will share the same resolver, chunk splitter, and tree-shaking logic.

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

The linting and formatting layers are also moving to native binaries.

### oxlint

Oxlint is a Rust-based linter from the oxc project that runs 50 to 100 times faster than ESLint. It checks files without requiring a configuration file:

```bash
npx oxlint@latest
```

It ships with defaults covering typical code correctness and stylistic issues. You can customize the rules using an `oxlintrc.json` file:

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

Currently, the most practical approach is to run oxlint alongside ESLint. Use oxlint for fast feedback during local development, and keep ESLint for rules that require custom plugins or specific framework integrations.

### Biome

Biome is a single binary that replaces both ESLint and Prettier:

```bash
# Initialize Biome in your project
npx @biomejs/biome init

# Format and lint in one command
npx @biomejs/biome check --write .
```

You can configure it with a `biome.json` file:

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

Biome processes formatting and linting in a single pass. In a project with 5,000 files, it typically finishes in under 500 milliseconds, compared to over 30 seconds for ESLint and Prettier combined.

## What this means for your workflow today

Not every tool is ready to replace your existing setup. Here is a guide on what you can adopt now:

- **Stable to adopt today**: Swap Babel for SWC in your build pipeline. Next.js already does this, and the migration is clean in other frameworks. You can also run Biome or oxlint alongside your existing configuration. esbuild is a reliable choice for standalone bundling tasks.
- **Suitable for new projects**: If you are starting a new project, consider using Vite 7 with Rolldown enabled. For existing projects, you can wait for the stable release. The TypeScript Go compiler can be used in CI to speed up type-checking tasks.
- **Keep monitoring**: Turbopack is currently integrated with Next.js, so there is no immediate reason to adopt it for other frameworks yet.

## The tradeoffs of native tooling

Moving your build infrastructure from JavaScript to Rust and Go has some notable consequences:

- **Higher contribution barrier**: Web developers can easily inspect and contribute to a Webpack plugin written in JavaScript. Writing or modifying a Rolldown plugin requires knowledge of Rust, which limits the number of potential contributors.
- **Rebuilding the plugin ecosystem**: While Babel has thousands of plugins, SWC has fewer. Rolldown maintains Rollup compatibility, but native Rust plugins will take time to grow.
- **Debugging complexity**: Debugging a JS-based bundler yields standard JS stack traces. When a compiled Rust tool encounters an error or crashes, resolving the issue is more difficult for web developers.
- **Platform-specific binaries**: Native tools must compile and distribute binaries for different operating systems and CPU architectures. This adds complexity to CI runs and can lead to installations failing on less common configurations.
- **Community dependencies**: When a tool is written in a language that most of its users do not speak, the project depends heavily on its core maintainers. If those maintainers step away, forking or maintaining the project is more difficult.

These are tradeoffs to weigh before replacing a working build setup.

## The bottom line

The JavaScript build pipeline is going through its most significant change in years. TypeScript's Go port will speed up type-checking, Rolldown will consolidate Vite's build steps into a fast Rust binary, and Biome is making formatting and linting near-instant.

The tools that build your JavaScript are no longer being written in JavaScript, and that helps developers focus on writing applications instead of waiting for compilation steps to finish.

For most developers, these changes will be seamless. Your build commands will simply run faster, and code diagnostics in your editor will update quicker, while your daily coding workflow remains the same.

You can start adopting SWC, Biome, and esbuild today for immediate improvements. As Rolldown and the Go-based TypeScript compiler mature, the transition will be complete.
