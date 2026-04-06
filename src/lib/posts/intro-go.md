---
title: "Getting Started with Go: Why You Should Learn Golang"
excerpt: "Go, the modern language, is gaining popularity for its simplicity, performance, and scalability. Learn the basics, why it's a good fit for backend and cloud development, and get started today."
date: "2023-02-20"
author: "Norbert Br3tt"
categories: ["Go"]
coverImage: "https://res.cloudinary.com/nbrett/image/upload/v1751052378/portfolio/Gemini_Generated_Image_4_fyfnly.png"
coverWidth: 16
coverHeight: 9
updated: "2023-02-20"
---

# Go Made Me Rethink What a Programming Language Needs to Be

Storytime: I was three hours into debugging a deployment issue — wrong Node version on the server, missing native dependencies, the usual nightmare — when a colleague sent me the equivalent Go service. One binary. No runtime. No setup. It just ran.

I was annoyed at how simple it was.

That's Go in a nutshell. It doesn't try to be clever. It tries to be _useful_, and it succeeds in ways that sneak up on you. Let me show you what I mean.

## Why Go Exists

Go was born at Google in 2007 out of genuine frustration: C++ codebases taking forever to compile, brittle build systems, concurrency that was powerful but brutal to write correctly. Robert Griesemer, Rob Pike, and Ken Thompson decided the answer wasn't a smarter language — it was a _simpler_ one.

That philosophy shapes everything. Go has a deliberately small syntax, one way to format code, and a strong opinion that explicitness beats magic. You'll either love that immediately or come around to it after shipping your first production service.

## The Things That Will Surprise You

### It Compiles Instantly

Not fast. _Instantly_. Large codebases that take minutes in C++ compile in seconds with Go. This sounds like a minor convenience until you actually experience it — and then you realize how much your workflow changes when the feedback loop is that tight.

### Deployment is a Single Binary

```bash
go build
./myservice
```

That's it. No runtime to install, no dependency graph to untangle on the server. For containers, CLIs, and infrastructure tools, this is genuinely transformative. It's why Kubernetes, Docker, Terraform, and Prometheus are all written in Go.

### Concurrency That Mere Mortals Can Write

Go's goroutines are lightweight threads managed by the runtime. You can spin up thousands of them without breaking a sweat.

```go
go func() {
    results <- doWork()
}()
```

The `go` keyword is the whole API. Start a goroutine, communicate via channels, done. This is why Go dominates backend and cloud-native infrastructure — concurrent network services that would've been brutal to write in other languages become approachable.

Here's a real pattern: fetching multiple URLs in parallel and collecting results.

```go
func fetchURL(url string, ch chan<- string) {
    resp, err := http.Get(url)
    if err != nil {
        ch <- fmt.Sprintf("error: %s", err)
        return
    }
    defer resp.Body.Close()
    ch <- fmt.Sprintf("%s → %d", url, resp.StatusCode)
}

func main() {
    urls := []string{"https://golang.org", "https://github.com"}
    ch := make(chan string)

    for _, url := range urls {
        go fetchURL(url, ch)
    }
    for range urls {
        fmt.Println(<-ch)
    }
}
```

Notice how readable that is. Each goroutine runs independently; the channel collects results as they come in. No thread pools, no locks, no ceremony.

### The Tooling is Settled (In a Good Way)

`gofmt` formats your code. `go test` runs your tests. `go mod` manages dependencies. These aren't community debates — they ship with Go itself. I personally find this one of the most underrated things about working in Go day-to-day. The number of conversations that just _don't happen_ because the tooling is already decided is a real quality-of-life win.

## The Things That Will Frustrate You

### Error Handling is Verbose

Go handles errors explicitly. Every function that can fail returns one, and you handle it every time.

```go
file, err := os.Open("config.json")
if err != nil {
    return fmt.Errorf("failed to open config: %w", err)
}
defer file.Close()
```

This is honest and predictable. It's also repetitive. In large codebases, `if err != nil` becomes wallpaper. You get used to it, but fair warning: it will feel noisy at first.

### The Type System Stays Conservative

Go added generics in 1.18, but they're intentionally minimal. No sum types, no pattern matching. For straightforward services, this is fine. For complex domain modeling, you'll occasionally wish for more expressiveness.

```go
// Generics exist, but they're careful
func Map[T, U any](slice []T, fn func(T) U) []U {
    result := make([]U, len(slice))
    for i, v := range slice {
        result[i] = fn(v)
    }
    return result
}
```

### Goroutines Are Easy to Leak

Spinning up goroutines is trivial — and so is accidentally forgetting about them. Go doesn't enforce structured concurrency. There are no compile-time guarantees you didn't introduce a race condition. The tooling helps (`go test -race` is excellent), but the responsibility is yours.

## Let's Build Something Real

Before you do anything, install Go:

```bash
# macOS
brew install go

# Linux
sudo apt install golang-go

# Verify
go version
```

Then scaffold a project:

```bash
mkdir myproject && cd myproject
go mod init github.com/yourname/myproject
```

Here's a working HTTP server — no framework needed:

```go
package main

import (
    "encoding/json"
    "log"
    "net/http"
)

func healthHandler(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(map[string]string{
        "status": "ok",
    })
}

func main() {
    http.HandleFunc("/health", healthHandler)
    log.Println("Listening on :8080")
    log.Fatal(http.ListenAndServe(":8080", nil))
}
```

Run it with `go run main.go`. That's a production-ready HTTP server in 20 lines, zero dependencies, instant compile. This is where Go starts to click.

## When Go is the Right Tool

Go is genuinely excellent for backend APIs and services, cloud-native infrastructure (the ecosystem here is outstanding), CLI tools where single-binary deployment matters, and systems where you need concurrency without a PhD.

It's less compelling for GUIs, data science, or domains with complex type-heavy business logic where richer type systems pay dividends.

## Go Try It

The best way to understand Go is to build something small and real — a CLI tool, a webhook handler, a tiny API. You'll feel the fast build loop, get frustrated by error handling around day two, and then feel the deployment story and forgive everything.

Start with [A Tour of Go](https://tour.golang.org/) — it's one of the best interactive language intros out there. Then build something. Then check out [Effective Go](https://golang.org/doc/effective_go) once you want to level up.

Go's simplicity is its superpower. The constraints lead to better decisions than you'd make with unlimited freedom. Trust that — at least for a while — and see where it takes you. 🎉
