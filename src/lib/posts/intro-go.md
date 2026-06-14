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

# Go made me rethink what a programming language needs to be

Storytime: I was three hours into debugging a deployment issue (wrong Node version on the server, missing native dependencies, the usual nightmare) when a colleague sent me the equivalent Go service. It was a single binary, with no runtime and no setup, and it just ran.

I was annoyed at how simple it was.

That is Go in a nutshell. It does not try to be clever, but it tries to be useful, and it succeeds in ways that sneak up on you. Let me show you what I mean.

## Why Go exists

Go was born at Google in 2007 out of genuine frustration: C++ codebases taking forever to compile, brittle build systems, and concurrency that was powerful but brutal to write correctly. Robert Griesemer, Rob Pike, and Ken Thompson decided the answer was not a smarter language, but a simpler one.

That philosophy shapes everything. Go has a deliberately small syntax, one way to format code, and a strong opinion that explicitness beats magic. You'll either love that immediately or come around to it after shipping your first production service.

## The things that will surprise you

### It compiles instantly

It compiles in seconds, not minutes. Large codebases that take ages in C++ compile in moments with Go. This sounds like a minor convenience until you experience it, and then you realize how much your workflow changes when the feedback loop is that tight.

### Deployment is a single binary

```bash
go build
./myservice
```

That is it. There is no runtime to install and no dependency graph to untangle on the server. For containers, CLIs, and infrastructure tools, this is genuinely transformative. It explains why Kubernetes, Docker, Terraform, and Prometheus are all written in Go.

### Concurrency that mere mortals can write

Go's goroutines are lightweight threads managed by the runtime. You can spin up thousands of them without breaking a sweat.

```go
go func() {
    results <- doWork()
}()
```

The `go` keyword is the entire API. Start a goroutine, communicate via channels, and you are done. This is why Go dominates backend and cloud-native infrastructure: concurrent network services that would have been brutal to write in other languages become approachable.

Here's a real pattern: fetching multiple URLs in parallel and collecting results.

```go
func fetchURL(url string, ch chan<- string) {
    resp, err := http.Get(url)
    if err != nil {
        ch <- fmt.Sprintf("error: %s", err)
        return
    }
    defer resp.Body.Close()
    ch <- fmt.Sprintf("%s -> %d", url, resp.StatusCode)
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

Notice how readable that is. Each goroutine runs independently, and the channel collects results as they come in. There are no thread pools, no locks, and no ceremony.

### The tooling is settled (in a good way)

`gofmt` formats your code. `go test` runs your tests. `go mod` manages dependencies. These are not community debates, as they ship with Go itself. I find this to be one of the most underrated aspects of working in Go day-to-day. The number of configuration conversations that do not happen because the tooling is already decided is a real quality-of-life win.

## The things that will frustrate you

### Error handling is verbose

Go handles errors explicitly. Every function that can fail returns one, and you handle it every time.

```go
file, err := os.Open("config.json")
if err != nil {
    return fmt.Errorf("failed to open config: %w", err)
}
defer file.Close()
```

This is honest and predictable, but it is also repetitive. In large codebases, `if err != nil` becomes wallpaper. You get used to it, but it will feel noisy at first.

### The type system stays conservative

Go added generics in 1.18, but they are intentionally minimal. There are no sum types and no pattern matching. For straightforward services, this is fine. For complex domain modeling, you will occasionally wish for more expressiveness.

```go
// Generics exist, but they are minimal
func Map[T, U any](slice []T, fn func(T) U) []U {
    result := make([]U, len(slice))
    for i, v := range slice {
        result[i] = fn(v)
    }
    return result
}
```

### Goroutines are easy to leak

Spinning up goroutines is trivial, and so is accidentally forgetting about them. Go does not enforce structured concurrency. There are no compile-time guarantees that you did not introduce a race condition. The tooling helps (`go test -race` is excellent), but the responsibility remains yours.

## Let's build something real

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

Here's a working HTTP server, with no framework needed:

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

Run it with `go run main.go`. That is a production-ready HTTP server in 20 lines, with zero dependencies and instant compilation. This is where Go starts to click.

## When Go is the right tool

Go is excellent for backend APIs and services, cloud-native infrastructure, CLI tools where single-binary deployment matters, and systems where you need concurrency without over-complicating your codebase.

It is less compelling for GUIs, data science, or domains with complex, type-heavy business logic where richer type systems pay dividends.

## Go try it

The best way to understand Go is to build something small and real: a CLI tool, a webhook handler, or a tiny API. You'll feel the fast build loop, get frustrated by error handling around day two, and then feel the relief of the deployment story and forgive everything.

Start with the official interactive tour of Go. Then build something, and check out Effective Go once you want to level up.

Go's simplicity is its superpower. The constraints lead to better decisions than you'd make with unlimited freedom. Trust that, at least for a while, and see where it takes you.
