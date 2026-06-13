---
title: "Vibe Coding: The Future or a Security Nightmare?"
excerpt: "Vibe Coding is the trend of writing software entirely through natural language prompts. While it enables incredible speed, it introduces significant security risks."
date: "2026-06-12"
author: "Norbert Br3tt"
categories: ["Security", "AI", "Development"]
coverImage: "/images/vibe_coding_infographic.png"
coverWidth: 16
coverHeight: 9
updated: "2026-06-12"
---

# Vibe Coding: The Future or a Security Nightmare?

"Vibe Coding" is the latest trend taking the development world by storm. It's the practice of writing software entirely through natural language prompts, often without deeply reviewing or understanding the underlying code generated. While it enables incredible speed for prototyping, it introduces significant, sometimes catastrophic, risks.

Let's break down what vibe coding actually looks like in practice, where it goes wrong, and how to use it responsibly.

## What is Vibe Coding?

At its core, it is coding based on "vibes." You tell the AI what you want, it writes the files, runs the terminal commands, and you check the browser to see if it works. If it looks like it works, you ship it and move on.

It's fantastic for personal software, throwaway scripts, or learning new concepts quickly. You can build a functioning app in an afternoon without writing a single line of syntax yourself.

### A Vibe Coding Workflow in Practice

Here's what building a to-do app through vibe coding actually looks like, step by step:

1. **The prompt:** "Build me a to-do app with Next.js, Prisma, and Tailwind. Users should be able to sign up, create lists, and share them."
2. **The AI scaffolds:** It runs `npx create-next-app`, installs a dozen dependencies, sets up a Prisma schema, creates API routes, and generates a full set of React components.
3. **You glance at the browser:** The app loads. You can add a to-do item. The styling looks clean. It _feels_ done.
4. **You prompt again:** "Add authentication with NextAuth." The AI installs more packages, wires up session providers, and adds login/logout buttons.
5. **You ship it:** Maybe to Vercel with a single `git push`. The whole process took two hours.

The problem? At no point did anyone audit the Prisma schema for proper cascade deletes. Nobody checked if the sharing feature leaks data between users. Nobody reviewed the 47 transitive dependencies that got pulled in. The app works — but "works" and "is safe" are two very different things.

## The Dependency Problem

One of the most overlooked risks of vibe coding is what happens in your `node_modules` folder. When you ask an AI to "add image uploads" or "set up email notifications," it doesn't hand-pick dependencies the way a seasoned developer would. It reaches for whatever package appeared most often in its training data — which may be outdated, abandoned, or even compromised.

**This is not theoretical.** The JavaScript ecosystem has seen real supply-chain attacks: `event-stream` in 2018 had malicious code injected by a new maintainer. `ua-parser-js` was hijacked in 2021 to install cryptominers. `colors` and `faker` were intentionally sabotaged by their own author in 2022.

An AI agent will happily run `npm install` on packages it suggests without checking:

- When the package was last updated
- How many maintainers it has (single-maintainer packages are higher risk)
- Whether it has known vulnerabilities listed in `npm audit`
- Whether a lighter, more maintained alternative exists

**The fix:** After any AI-assisted session, run `npm audit` and review your `package.json` manually. Tools like [Socket.dev](https://socket.dev) can flag risky dependencies before they become a problem.

## The Security Gap: Why Vibes Aren't Enough

The danger lies in the lack of scrutiny. AI models are trained to fulfill user requests in the most direct way possible, which doesn't always align with secure architectural patterns. Let's walk through three real-world scenarios that show up constantly in vibe-coded applications.

### Scenario 1: Client-Side Auth Checks

In a recent experiment during a hack week, developers found a recurring pattern: AI agents frequently implement security checks client-side rather than server-side.

**The prompt:** "Protect the admin route so only logged-in users can see it."

**The AI's solution:** It created a check in the frontend JavaScript code. If the authentication cookie wasn't present, the React router simply redirected the user to the login page.

**Why it's broken:** A malicious user can simply disable JavaScript, or use `curl` to call the API directly, bypassing the client entirely. They could then access the admin dashboard and make API calls because the backend server wasn't actually validating the session. Real security must happen on the server. You cannot trust the client.

### Scenario 2: SQL Injection via Raw Queries

Ask an AI to "get the user's profile by their username" and there's a good chance it'll write something like this:

```js
// ❌ BAD — vulnerable to SQL injection
app.get("/user/:username", async (req, res) => {
  const query = `SELECT * FROM users WHERE username = '${req.params.username}'`;
  const result = await db.query(query);
  res.json(result.rows[0]);
});
```

An attacker can pass `' OR '1'='1` as the username and dump your entire users table. This is one of the oldest vulnerabilities in web development, and AI still generates it routinely because string interpolation is the "most direct" solution.

The fix is parameterized queries:

```js
// ✅ GOOD — parameterized query prevents injection
app.get("/user/:username", async (req, res) => {
  const query = "SELECT * FROM users WHERE username = $1";
  const result = await db.query(query, [req.params.username]);
  res.json(result.rows[0]);
});
```

The difference is one line of code, but it's the difference between a secure app and a front-page data breach.

### Scenario 3: Hardcoded API Keys in Frontend Code

This one is painfully common. You ask the AI to "connect to the Stripe API" or "add a weather widget," and it drops your secret key right into a client-side file:

```js
// ❌ BAD — API key exposed to every visitor
const stripe = new Stripe("sk_live_abc123realkey456");

export async function createPayment(amount) {
  return await stripe.paymentIntents.create({ amount, currency: "usd" });
}
```

Anyone who opens browser DevTools can see that key, and now they can make charges on your Stripe account. The key gets committed to Git, pushed to GitHub, and scraped by bots within minutes.

The correct approach keeps secrets on the server:

```js
// ✅ GOOD — secret stays server-side via environment variable
// This code runs ONLY on the server (e.g., an API route)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  const { amount } = await request.json();
  const intent = await stripe.paymentIntents.create({ amount, currency: "usd" });
  return Response.json({ clientSecret: intent.client_secret });
}
```

The client only ever receives the `client_secret` — a temporary, scoped token that can't be used to access your account.

## The Hidden Cost of Technical Debt

Even if you dodge every security bullet, vibe-coded applications carry a subtler cost: **nobody understands the code.**

When an AI generates 2,000 lines across 30 files in a single session, you end up with a codebase that has no clear architectural intent. Variable names are inconsistent. Some files use one pattern, others use a completely different one. There are utility functions that duplicate built-in methods. There are entire files that are imported but never actually used.

This creates three painful realities:

- **Debugging is a nightmare.** When something breaks (and it will), you can't reason about the code because you didn't write it and the AI made choices you don't understand. You end up asking the AI to fix the bug, and it introduces two more.
- **Onboarding is impossible.** If you need another developer to contribute, they'll stare at the codebase and have no mental model for how it fits together. There's no README explaining the architecture, no clear module boundaries, no consistent conventions.
- **Refactoring becomes a rewrite.** The cost of changing a vibe-coded app often exceeds the cost of building it from scratch with intention. Technical debt compounds fast when the original "author" was a language model optimizing for your immediate request, not long-term maintainability.

This doesn't mean AI-generated code is inherently bad. It means **unreviewed** AI-generated code is a liability.

## A Practical Checklist for Safe Vibe Coding

You don't have to choose between speed and safety. Here's a checklist you can use after every AI-assisted coding session:

1. **Run `npm audit` (or equivalent)** after any new dependencies are installed. Fix critical and high-severity issues before merging.
2. **Check for hardcoded secrets.** Search your codebase for API keys, tokens, and passwords. Use tools like `gitleaks` or `trufflehog` to automate this.
3. **Verify auth checks are server-side.** Any route that requires authentication should validate the session on the server before returning data — never rely on client-side redirects alone.
4. **Review all database queries.** Look for string interpolation in SQL. Ensure every query uses parameterized inputs or an ORM that handles escaping.
5. **Audit your `package.json`.** Do you actually need every dependency the AI installed? Remove unused packages. Fewer dependencies mean a smaller attack surface.
6. **Add rate limiting to public endpoints.** AI rarely adds rate limiting on its own, but without it, your sign-up or login endpoints are wide open to brute-force attacks.
7. **Set up environment variables properly.** Use `.env` files (and add them to `.gitignore`). Never commit secrets. Use your hosting platform's secret management for production.
8. **Test the unhappy paths.** AI-generated code almost always handles the success case. What happens when the user submits an empty form? Sends a 10MB payload? Passes a malicious string? Test those cases.
9. **Read the code you're shipping.** You don't have to understand every line, but you should understand every _file's purpose_ and how data flows between the client and server.
10. **Use a linter and type checker.** Tools like ESLint and TypeScript catch entire categories of bugs automatically. If the AI didn't set them up, add them yourself.

## When Vibe Coding Actually Shines

It would be unfair to paint vibe coding as purely dangerous. Used in the right contexts, it's genuinely transformative:

- **Personal tools and scripts.** Building a script to rename 500 files, a local dashboard for your finances, or a CLI that automates your workflow? Vibe code away. The only user is you, and the risk surface is tiny.
- **Prototypes and proof-of-concepts.** When you need to validate an idea with stakeholders before committing engineering resources, a vibe-coded prototype is perfect. Just don't ship the prototype to production.
- **Learning and exploration.** Vibe coding is one of the best ways to learn a new framework or language. You get a working example instantly, then you can study it, break it, and rebuild it with understanding.
- **Hackathons and jam projects.** Time-constrained events where polish and security aren't the point? This is vibe coding's natural habitat.
- **Internal admin panels.** Low-risk tools behind a VPN, used by 3 people on your team? The threat model is completely different from a public-facing app, and speed matters more than hardening.

The common thread: **low stakes, limited users, and no sensitive data.**

## The Verdict

Vibe coding is not going away, and it shouldn't. It represents a genuine shift in how software gets built — lowering the barrier to entry, democratizing development, and compressing timelines that used to take weeks into hours.

But there's a critical distinction that the hype tends to blur: **building software** and **shipping software** are not the same thing. Vibe coding excels at the first. For the second, you need review, understanding, and intentional architecture.

The developers who will thrive in this new landscape aren't the ones who reject AI tools, nor the ones who accept their output blindly. They're the ones who use AI to move fast and then slow down at the boundaries — where the client meets the server, where user input meets the database, and where secrets meet version control.

AI is a powerful assistant. But you are still the engineer responsible for what ships. Vibe responsibly.
