---
title: "Recursion in JavaScript: The Art of Functions Calling Themselves"
excerpt: "On this blog post, we'll dive into the world of recursion in JavaScript. We'll explore what recursion is, when to use it, and some common gotchas."
date: "2023-08-16"
author: "Norbert Br3tt"
categories: ["JavaScript"]
coverImage: "https://res.cloudinary.com/nbrett/image/upload/v1751052373/portfolio/Gemini_Generated_Image_2_et7ydc.png"
coverWidth: 16
coverHeight: 9
updated: "2023-08-16"
---

# Recursion Finally Clicked for Me — Here's How

Storytime: I spent an embarrassing amount of time "understanding" recursion without actually understanding it. I could parrot the definition, nod along to the factorial example, and then completely freeze when I hit a real problem that needed it.

What finally made it click wasn't a cleverer explanation. It was realizing recursion is just a function that trusts its future self to handle a smaller version of the same problem.

Let me show you what I mean.

## The Two Things Every Recursive Function Needs

Before anything else: every recursive function needs exactly two things, and if either is missing, you're in trouble.

**1. A base case** — the condition that makes it stop. No base case means infinite recursion, stack overflow, crash.

**2. Progress toward that base case** — each recursive call must work with a smaller/simpler version of the problem. If the argument never changes, you loop forever.

Here's the classic example, factorial, but let's actually trace what's happening:

```javascript
function factorial(n) {
  if (n === 0) return 1; // base case
  return n * factorial(n - 1); // recursive case — n shrinks each time
}
```

When you call `factorial(4)`, JavaScript isn't evaluating this all at once. It's stacking up calls, waiting for the base case to resolve, then unwinding:

```
factorial(4)
  4 * factorial(3)
       3 * factorial(2)
            2 * factorial(1)
                 1 * factorial(0)
                      → 1         // base case hit
                 → 1
            → 2
       → 6
  → 24
```

Each call _waits_ for the call below it to finish. That's the call stack at work. Understanding this unwinding behavior is the key to reading and debugging recursive code.

## Where Recursion Actually Shines

Here's the honest answer to "when should I use recursion?": when your data is shaped like a tree.

Nested objects, file systems, DOM trees, component hierarchies — these all have an unknown depth you can't know ahead of time. A loop can't navigate them cleanly. Recursion can.

**Flattening a deeply nested array:**

```javascript
function flatten(arr) {
  const result = [];
  for (let item of arr) {
    if (Array.isArray(item)) {
      result.push(...flatten(item)); // recurse on nested arrays
    } else {
      result.push(item);
    }
  }
  return result;
}

const nested = [1, [2, [3, [4, 5]], 6], 7];
console.log(flatten(nested)); // [1, 2, 3, 4, 5, 6, 7]
```

Notice: we don't know how deep the nesting goes. A `for` loop can't handle that. Recursion handles it naturally.

**Deep cloning an object:**

```javascript
function deepClone(obj) {
  if (obj === null || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map((item) => deepClone(item));

  const clone = {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      clone[key] = deepClone(obj[key]); // recurse into each value
    }
  }
  return clone;
}
```

Same idea — we can't know the depth of the object ahead of time. Let each call handle one level, trust the recursion to handle the rest.

**Traversing a tree** (this comes up constantly — binary trees, React component trees, file systems):

```javascript
class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

function sumTree(node) {
  if (node === null) return 0; // base case
  return node.value + sumTree(node.left) + sumTree(node.right);
}
```

Three lines of logic. No manual stack management. This is where recursion earns its keep.

## The Pitfall That Gets Everyone: Fibonacci Without Memoization

Here's where recursion goes wrong. The naive Fibonacci implementation looks elegant:

```javascript
function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}
```

But call `fib(40)` and watch your browser think. The problem: it's recalculating the same values over and over. `fib(38)` gets computed twice, `fib(37)` four times, `fib(10)` hundreds of times.

Fix it with memoization — cache results you've already computed:

```javascript
function fib(n, memo = new Map()) {
  if (n <= 1) return n;
  if (memo.has(n)) return memo.get(n); // already solved this one

  const result = fib(n - 1, memo) + fib(n - 2, memo);
  memo.set(n, result);
  return result;
}
```

`fib(40)` is now instant. Same logic, same structure — just remembering what we've already done.

A reusable memoize wrapper if you want it:

```javascript
const memoize = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};
```

## Watch Out for Stack Overflow

JavaScript's call stack has a limit — roughly 10,000-50,000 frames depending on the engine. Deep recursion can blow past it.

```javascript
factorial(100000); // RangeError: Maximum call stack size exceeded
```

For problems with potentially deep recursion, the iterative version is usually safer:

```javascript
// Recursive — can overflow for large n
function factorial(n) {
  if (n === 0) return 1;
  return n * factorial(n - 1);
}

// Iterative — no stack risk
function factorial(n) {
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}
```

The recursive version is easier to read. The iterative version won't crash. For most real-world inputs, the recursive one is fine — just know the tradeoff.

## When to Reach for Recursion vs. a Loop

I personally use this as my decision rule: if the data structure has a natural tree shape (nested, branching, unknown depth), reach for recursion. If it's a flat list or you're doing simple aggregation, a loop is clearer.

```javascript
// Use a loop — this is just summing a flat array
const sum = arr.reduce((total, n) => total + n, 0);

// Use recursion — depth is unknown, structure is nested
function findInTree(node, target) {
  if (!node) return null;
  if (node.value === target) return node;
  return findInTree(node.left, target) || findInTree(node.right, target);
}
```

Recursion isn't better than loops. It's the right tool for tree-shaped problems — and a confusing one for flat problems where iteration is obvious.

## Go Find a Recursive Problem

The best way to get comfortable with recursion is to write it. Grab a nested data structure — a JSON config file, a DOM subtree, a folder of files — and try to traverse or transform it recursively.

Start by identifying the base case first. Always. Then ask: what's the simplest thing I can hand off to a recursive call? Once you can answer those two questions naturally, recursion stops feeling like a trick and starts feeling like a tool.

You've got this. Go break your call stack at least once. It's a rite of passage. 🎉

---

**Further reading:**

- [JavaScript.info: Recursion and the Call Stack](https://javascript.info/recursion) — the best visual explanation I've found
- [Eloquent JavaScript, Chapter 3](https://eloquentjavascript.net/03_functions.html) — excellent foundational context
- [LeetCode recursion tag](https://leetcode.com/tag/recursion/) — for practice problems once the concept clicks
