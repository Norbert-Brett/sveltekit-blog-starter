---
title: "What Go Got Right and Wrong: A Thoughtful Look Back"
excerpt: "A reflective and opinionated look at the Go programming language, combining insights from co-creator Rob Pike with real-world developer experience. This article explores Go’s strengths, trade-offs, and where it truly shines or falls short in modern software development."
date: "2025-12-14"
author: "Norbert Br3tt"
categories: ["Go"]
coverImage: "https://res.cloudinary.com/nbrett/image/upload/v1765711126/what-go_l5rrxc.png"
coverWidth: 16
coverHeight: 9
updated: "2025-12-14"
---

# What Go Got Right and Wrong: A Thoughtful Look Back

Storytime: I remember the first time I deployed a Go service to production. No runtime to install. No dependency hell. Just a single binary, copied to the server, done. I stood there for a moment thinking, _wait, that's it?_ That feeling — that particular kind of relief — is something I've chased in other languages ever since and rarely found.

Go has been around for well over a decade now, and I think enough time has passed to look at it honestly. Not as a hype piece, not as a hit job. Just a real look at what the language got right, what it got wrong, and when it actually makes sense to reach for it.

I've been thinking about this since Rob Pike — one of Go's co-creators — gave a retrospective talk covered by The New Stack. A lot of his reflections matched my own experience. Some surprised me. Let's dig in.

## Why Go Exists at All

Before we get into trade-offs, it's worth understanding the _why_. Go wasn't designed by academics chasing theoretical elegance. It was built by engineers at Google who were genuinely frustrated:

- C++ codebases that took forever to compile
- Build systems that were fragile and hard to reason about
- Concurrency that was powerful but deeply error-prone to write
- Formatting and style inconsistency across large teams

Go optimized for one thing above all else: **developer productivity in large-scale, real-world systems**. That single decision explains almost everything that follows — the good, the bad, and the "okay but I understand why."

## What Go Got Right

### The Code You Write in Go Reads Like the Code You Write in Go

That sounds circular, but hear me out. Go's syntax is intentionally small. There's usually one obvious way to do something, which means when you open a Go file written by someone else — even someone at a totally different company with different habits — it looks _familiar_.

```go
func greet(name string) string {
    return "Hello, " + name
}
```

That clarity scales. I've onboarded into Go codebases faster than almost any other language, and I don't think that's a coincidence.

### The Feedback Loop is Genuinely Fast

Go compiles fast. Embarrassingly fast for a statically typed language. This matters more than most people give it credit for — when your build is instantaneous, you run it constantly. Frequent builds, frequent tests, tight iteration. That rhythm shapes how you work in ways that are hard to fully appreciate until you've been spoiled by it.

### Concurrency That Mere Mortals Can Actually Write

Here's where Go made a real dent in the industry. Goroutines and channels brought concurrent programming to developers who weren't concurrency specialists.

```go
go func() {
    results <- doWork()
}()
```

You spin up a goroutine with the `go` keyword, communicate via channels, and you're off. The model isn't perfect (more on that in a second), but it dramatically lowered the barrier to writing concurrent network services. It's a major reason Go now dominates cloud infrastructure and backend tooling.

### Tooling That's Part of the Language, Not an Afterthought

`gofmt` formats your code. `go test` runs your tests. `go mod` manages your dependencies. These ship with Go itself — they're not a community debate, they're not optional. I personally find this to be one of the most underrated things about working in Go day-to-day. The number of conversations that just _don't happen_ because the tooling is already decided is a genuine quality-of-life win.

### One Binary to Rule Them All

```bash
go build
./myservice
```

That's your deployment. A single static binary, no runtime, no dependency graph to manage on the server. For containers, CLIs, and infrastructure tools, this is enormous. It's the thing I keep coming back to when someone asks me why people still choose Go.

---

## What Go Got Wrong (Or Accepted as Trade-Offs)

### Error Handling: Honest, But Exhausting

Go's error handling is explicit. Every function that can fail returns an error, and you're expected to handle it every time.

```go
file, err := os.Open("data.txt")
if err != nil {
    return err
}
```

In a small example, this is fine. In a large system, it becomes noise. The core logic gets buried under waves of `if err != nil`. This is the single most common complaint I hear from experienced Go developers, and it's completely valid. The language is honest about errors — which I respect — but the verbosity is real.

### The Type System Stays Conservative (Sometimes Too Conservative)

Go added generics, but it did so carefully, intentionally keeping things minimal. There are no sum types, no pattern matching, nothing like what you'd find in Rust or Haskell.

For many problems, this is fine. For complex business domains with lots of state transitions and rule-heavy logic, it can start to feel like you're fighting the language to express what you mean. The types exist; the expressiveness doesn't always.

### Goroutines Are Easy to Start and Easy to Leak

Here's the concurrency catch. Goroutines are cheap and simple to spin up. They're also easy to forget about.

```go
go doSomething()
// ...who owns this? when does it stop?
```

Go doesn't enforce structured concurrency. There's no compile-time guarantee you didn't leak a goroutine or introduce a race condition. The language gives you the tools; the responsibility is yours. Compared to some newer languages that have baked stronger concurrency guarantees in from the start, this is one area where Go genuinely shows its age.

### Garbage Collection Has a Cost

Go's GC has gotten significantly better over the years — the team has done impressive work here. But it still introduces nondeterminism. For the vast majority of backend services, you'll never notice. For low-latency systems or anything with real-time requirements, it can be a dealbreaker. Worth knowing before you start.

### Outside the Backend, Go Gets Quiet

Go excels at servers, APIs, CLIs, and infrastructure tooling. For GUIs, game development, or data science? It's just not the right fit — and the ecosystem reflects that. This isn't a criticism so much as a scoping note: Go knows what it is.

---

## My Overall Take

I largely agree with Pike's reflections. Go succeeded because it optimized for the real world. The rough edges aren't accidents — they're deliberate trade-offs in favor of simplicity and team productivity.

If I were designing a language today, I'd probably make different choices around type expressiveness and concurrency guarantees. But for building reliable, maintainable backend systems at scale? Go is still one of the best tools available.

It doesn't try to be everything. And honestly, that restraint is both its greatest strength and its most frequent criticism.

---

## When I Reach for Go

- Backend services and APIs where readability and team velocity matter
- Cloud-native infrastructure tooling (the ecosystem here is phenomenal)
- CLI tools and utilities — the single binary is a gift
- Systems where build speed and deployment simplicity are real constraints

## When I Look Elsewhere

- Complex business domains that benefit from rich type systems
- Anything GUI or frontend-heavy
- Real-time systems where GC pauses are unacceptable

---

## Go Pick a Project and Try It

If you haven't spent serious time with Go, the best thing I can suggest is to build something real with it. Not a tutorial. Something you actually want to exist — a CLI tool, a small API, a webhook handler.

You'll feel the things I described. The fast build loop will surprise you. The error handling will frustrate you around day three. The deployment story will delight you. And somewhere in there you'll understand why, fifteen years in, teams keep choosing it.

Understanding _why_ Go made the choices it did makes it much easier to decide when it belongs in your next project. Go find out. 🎉
