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

# What Go got right and wrong: a thoughtful look back

Storytime: I remember the first time I deployed a Go service to production. There was no runtime to install and no dependency hell. It was just a single binary, copied to the server, and that was it. I stood there for a moment thinking, _wait, is that really it?_ That feeling of relief is something I have chased in other languages ever since, but rarely found.

Go has been around for well over a decade now, and enough time has passed to look at it honestly, not as a hype piece or a hit job, but as a realistic look at what the language got right, what it got wrong, and when it actually makes sense to use it.

I have been thinking about this since Rob Pike, one of Go's co-creators, gave a retrospective talk. A lot of his reflections matched my own experience, though some surprised me. Let's look closer.

## Why Go exists at all

Before we look at the trade-offs, it is worth understanding why Go was built. It was not designed by academics chasing theoretical elegance. It was built by engineers at Google who were frustrated by:

- C++ codebases that took hours to compile
- Build systems that were fragile and hard to understand
- Concurrency that was powerful but deeply error-prone to write
- Formatting and style inconsistency across large teams

Go optimized for one thing above all else: developer productivity in large-scale, real-world systems. That single decision explains almost everything about the language, including the good, the bad, and the compromises.

## What Go got right

### The code you write in Go reads like the code you write in Go

That sounds circular, but Go's syntax is intentionally small. There is usually one obvious way to do something, which means when you open a Go file written by someone else, even someone with very different coding habits, it looks familiar.

```go
func greet(name string) string {
    return "Hello, " + name
}
```

That clarity scales. I have onboarded into Go codebases faster than almost any other language, and I don't think that is a coincidence.

### The feedback loop is genuinely fast

Go compiles fast, which is rare for a statically typed language. This matters because when your build is instantaneous, you run it constantly. Frequent builds, frequent tests, and tight iteration loops shape how you work in ways that are hard to fully appreciate until you have been spoiled by them.

### Concurrency that mere mortals can actually write

Here is where Go made a real dent in the industry. Goroutines and channels brought concurrent programming to developers who were not concurrency specialists.

```go
go func() {
    results <- doWork()
}()
```

You spin up a goroutine with the `go` keyword, communicate via channels, and you are running concurrent code. The model is not perfect, but it dramatically lowered the barrier to writing concurrent network services. It is a major reason Go now dominates cloud infrastructure and backend tooling.

### Tooling that is part of the language, not an afterthought

`gofmt` formats your code. `go test` runs your tests. `go mod` manages your dependencies. These ship with Go itself, meaning they are not a community debate and are not optional. I find this to be one of the most underrated things about working in Go day-to-day. The number of configuration conversations that just do not happen because the tooling is already decided is a major quality-of-life win.

### One binary to rule them all

```bash
go build
./myservice
```

That is your entire deployment. You get a single static binary, no runtime to manage, and no dependency graph to worry about on the server. For containers, CLIs, and infrastructure tools, this is a massive advantage.

---

## What Go got wrong (or accepted as trade-offs)

### Error handling: honest, but exhausting

Go's error handling is explicit. Every function that can fail returns an error, and you are expected to handle it every time.

```go
file, err := os.Open("data.txt")
if err != nil {
    return err
}
```

In a small example, this is fine. In a large system, it becomes noise. The core logic gets buried under waves of `if err != nil`. This is the single most common complaint I hear from Go developers, and it is completely valid. The language is honest about errors, which I respect, but the verbosity is real.

### The type system stays conservative (sometimes too conservative)

Go added generics, but it did so carefully, keeping things minimal. There are no sum types or pattern matching like you would find in Rust or Haskell.

For many problems, this is fine. But for complex business domains with lots of state transitions and rule-heavy logic, it can feel like you are fighting the language to express what you mean. The types exist, but the expressiveness is not always there.

### Goroutines are easy to start and easy to leak

Here is the concurrency catch. Goroutines are cheap and simple to spin up, but they are also easy to leak.

```go
go doSomething()
// who owns this? when does it stop?
```

Go does not enforce structured concurrency. There is no compile-time guarantee that you did not leak a goroutine or introduce a race condition. The language gives you the tools, but the responsibility is yours. Compared to newer languages with stronger concurrency guarantees built-in, Go shows its age here.

### Garbage collection has a cost

Go's garbage collection has gotten significantly better over the years, and the team has done impressive work. But it still introduces nondeterminism. For the vast majority of backend services, you will never notice. For low-latency systems or anything with real-time requirements, it can be a dealbreaker.

### Outside the backend, Go gets quiet

Go excels at servers, APIs, CLIs, and infrastructure tooling. But for GUIs, game development, or data science, it is just not the right fit, and the ecosystem reflects that. Go knows what it is.

---

## My overall take

I largely agree with Pike's reflections. Go succeeded because it optimized for the real world. The rough edges are not accidents; they are deliberate trade-offs in favor of simplicity and team productivity.

If I were designing a language today, I would probably make different choices around type expressiveness and concurrency guarantees. But for building reliable, maintainable backend systems at scale, Go remains one of the best tools available.

It does not try to be everything. That restraint is both its greatest strength and its most frequent criticism.

---

## When I reach for Go

- Backend services and APIs where readability and team velocity matter
- Cloud-native infrastructure tooling (the ecosystem here is phenomenal)
- CLI tools and utilities, where the single binary is a gift
- Systems where build speed and deployment simplicity are real constraints

## When I look elsewhere

- Complex business domains that benefit from rich type systems
- Anything GUI or frontend-heavy
- Real-time systems where garbage collection pauses are unacceptable

---

## Go pick a project and try it

If you haven't spent serious time with Go, the best thing I can suggest is to build something real with it. Do not just run a tutorial. Build something you actually want to exist, like a CLI tool, a small API, or a webhook handler.

You'll feel the things I described. The fast build loop will surprise you, the error handling will frustrate you around day three, and the deployment story will delight you. Somewhere in there, you will understand why teams keep choosing it.

Understanding why Go made the choices it did makes it much easier to decide when it belongs in your next project. Go find out.
