---
title: "Understanding Go Slices: A Powerful Data Structure"
excerpt: "Discover how Go slices work and why they're one of the most versatile data structures in the language. Learn to create, manipulate, and optimize slices with practical examples and best practices."
date: "2026-01-07"
author: "Norbert Br3tt"
categories: ["Go"]
coverImage: "https://res.cloudinary.com/nbrett/image/upload/v1767816431/go_slices_hero_aydrbw.svg"
coverWidth: 16
coverHeight: 9
updated: "2026-01-07"
---

# Go slices: the thing that makes arrays actually useful

Here's something that bit me early in my Go journey: I kept reaching for arrays, because that's what I knew. Fixed size, simple, predictable. Then I'd inevitably need to add one more element and have to rethink the whole thing.

Slices are Go's answer to that problem, and once they click, you'll use them everywhere. Let me show how they actually work under the hood.

## The core idea

An array in Go has a fixed size baked into its type. `[5]int` and `[10]int` are different types. That works when you know exactly what you need, but in practice, you rarely do.

A slice is a dynamic window into an array. It holds three things under the hood: a pointer to the underlying array, a length, and a capacity. This design makes slices lightweight, flexible, and easy to share.

```go
// Array: fixed, size is part of the type
var fixed [5]int

// Slice: dynamic, grows as needed
var dynamic []int
dynamic = append(dynamic, 1, 2, 3)
```

## Creating slices

**Literal syntax**: Use this when you have the values upfront:

```go
fruits := []string{"apple", "banana", "orange"}
```

**`make`**: Use this when you know the size but not the values yet:

```go
// make([]Type, length, capacity)
s := make([]int, 3, 5)
fmt.Println(len(s), cap(s)) // 3, 5
```

Length is how many elements you have. Capacity is how many the underlying array can hold before Go needs to allocate a new one. Pre-allocating capacity matters for performance, as we will discuss in a moment.

**Slicing**: Carve a window into an existing slice or array:

```go
numbers := []int{10, 20, 30, 40, 50}

fmt.Println(numbers[1:4]) // [20 30 40]
fmt.Println(numbers[:3])  // [10 20 30]
fmt.Println(numbers[2:])  // [30 40 50]
```

## The part that trips people up: shared memory

When you slice a slice, both point at the same underlying array. If you modify one, you modify both.

```go
original := []int{1, 2, 3, 4, 5}
subset := original[1:4]

subset[0] = 999
fmt.Println(original) // [1 999 3 4 5] (original is modified!)
```

This is by design, but it catches most developers at least once. When you need a truly independent copy, use `copy`:

```go
duplicate := make([]int, len(original))
copy(duplicate, original)

duplicate[0] = 42
fmt.Println(original)  // unchanged
fmt.Println(duplicate) // [42 2 3 4 5]
```

## `append`: the workhorse

`append` adds elements to a slice and returns the result. You must assign it back to your variable, which is another common point of confusion for newcomers.

```go
// ❌ This does not update the slice
slice := []int{1, 2, 3}
append(slice, 4)

// ✅ This works
slice = append(slice, 4)
```

You can append multiple elements, or unpack another slice with the `...` operator:

```go
a := []int{1, 2, 3}
b := []int{4, 5, 6}

a = append(a, b...)       // [1 2 3 4 5 6]
a = append(a, 7, 8, 9)    // [1 2 3 4 5 6 7 8 9]
```

When capacity runs out, Go allocates a new, larger array and copies everything over. Although this happens automatically, you can optimize the process:

```go
// Without pre-allocation: triggers multiple reallocations
var slow []int
for i := 0; i < 10000; i++ {
    slow = append(slow, i)
}

// With pre-allocation: one allocation, much faster
fast := make([]int, 0, 10000)
for i := 0; i < 10000; i++ {
    fast = append(fast, i)
}
```

I reach for the pre-allocated version any time I am building a large slice in a loop. The performance difference is noticeable.

## Patterns you'll actually use

**Filtering:**

```go
numbers := []int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10}

var evens []int
for _, n := range numbers {
    if n%2 == 0 {
        evens = append(evens, n)
    }
}
// [2 4 6 8 10]
```

**Removing an element by index:**

```go
fruits := []string{"apple", "banana", "cherry", "date"}
i := 2 // remove "cherry"

fruits = append(fruits[:i], fruits[i+1:]...)
// [apple banana date]
```

Warning: this modifies the underlying array. If you have other slices sharing it, they will see the change. Use `copy` if that is an issue.

## Quick reference

```go
// Create
s := []int{1, 2, 3}           // literal
s := make([]int, 5)           // length 5
s := make([]int, 0, 10)       // empty, capacity 10

// Read
s[0]                           // get element
len(s)                         // length
cap(s)                         // capacity

// Write
s[0] = 99                      // set element
s = append(s, 4)              // add element
s = append(s, other...)       // append slice

// Slice
s[1:3]                         // elements 1, 2
s[:3]                          // 0 through 2
s[2:]                          // 2 to end

// Copy
dest := make([]int, len(src))
copy(dest, src)
```

## Go slice something

Slices show up in virtually every Go program, from HTTP headers and query results to command-line args and API responses. Think of a slice as a lightweight view into an array with length and capacity. With this mental model, the behavior of `append`, memory sharing, and `copy` becomes intuitive.

Build something that processes a list of data. Filter it, transform it, and append to it. That is where slices become second nature.
