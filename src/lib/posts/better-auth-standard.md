---
title: "Better Auth: The New Standard for Authentication"
excerpt: "Better Auth bridges the gap between rolling your own auth and using an expensive full-service solution. It's becoming the Goldilocks standard."
date: "2026-05-04"
author: "Norbert Br3tt"
categories: ["Authentication", "Security", "Web Development"]
coverImage: "/images/better_auth_infographic.png"
coverWidth: 16
coverHeight: 9
updated: "2026-05-04"
---

# Better Auth: The New Standard for Authentication

Authentication in the JavaScript ecosystem has historically been a frustrating choice between two extremes: "easy but expensive" (like Clerk or Auth0) or "free but painful to set up" (like Passport.js or NextAuth).

Recently, a new library simply called **Better Auth** has emerged as the "Goldilocks" solution, offering the best of both worlds. Let's dig into why it's rapidly becoming the default for greenfield projects — and why existing projects are migrating to it.

## The Auth Landscape Problem

To understand why Better Auth matters, it helps to understand the graveyard of solutions that came before it.

**Passport.js** was the OG. It gave you strategies for every provider under the sun, but it was middleware soup — you still had to wire up sessions, serialize users, handle token refresh, manage database tables, and pray your cookie config was correct. It worked, but "worked" is doing heavy lifting in that sentence.

**NextAuth (now Auth.js)** was a huge leap forward. Declarative config, built-in providers, database adapters. But it was deeply coupled to Next.js for years, the v4-to-v5 migration was painful, the documentation was perpetually confusing, and edge runtime support felt bolted on. It also lacked first-class support for features like 2FA or organization management without significant custom work.

**Lucia** took a different philosophy — minimal, low-level, own-your-auth. Developers loved its simplicity. But Lucia was essentially deprecated in early 2025, with the maintainer recommending people treat auth as a learning exercise rather than use a library. That left a vacuum.

**Clerk and Auth0** sit on the managed side. They're polished, feature-rich, and genuinely fast to integrate. But they come with real trade-offs: your user data lives on their servers, pricing scales aggressively with monthly active users, and you're one pricing-page update away from a nasty surprise. Clerk's free tier is generous until it isn't.

Better Auth steps into exactly the gap all of these left behind: the developer experience of a managed service, the data ownership of a self-hosted solution, and the extensibility that none of the above truly nailed.

## Why Better Auth is Winning

### 1. Data Ownership

With managed services, your user data lives on someone else's server. Better Auth flips this back to the traditional model: you own the data. It lives in your database — Postgres, MySQL, SQLite, whatever you're already running. This completely removes the risk of vendor lock-in or sudden, aggressive pricing hikes that have plagued the industry recently.

This also means you can query your users table directly. No API calls to a third party to count users, no webhook gymnastics to keep a shadow copy of your user data in sync.

### 2. Framework Agnostic

While many modern auth solutions are heavily tied to React or Next.js, Better Auth is truly agnostic. It works beautifully out of the box with Next.js, Nuxt, SvelteKit, Astro, Solid, and standard Express/Node backends. The core is a plain HTTP handler — any framework that can route a request to a function can run Better Auth.

### 3. A Powerful Plugin System

Authentication is rarely just username and password. Better Auth features a robust, extensible plugin system. Need Two-Factor Authentication (2FA)? There's a plugin. Want to support Passkeys (WebAuthn)? Just enable it. Need complex Multi-Tenancy for B2B Teams and Organizations? It's supported via official plugins. We'll look at code examples for this below.

### 4. Automated Schema Management

One of the hardest parts of self-hosting auth is managing the database tables required for sessions, accounts, and verifications. Better Auth comes with a CLI that generates the necessary database schema for you, integrating seamlessly with popular ORMs like Drizzle or Prisma.

## Getting Started

Let's walk through a real setup. I'll use SvelteKit as the framework, but the server-side core looks nearly identical everywhere.

### Installation

```bash
npm install better-auth
```

That's it. One dependency. No peer dependency hell.

### Server-Side Auth Handler

Create your auth instance in a shared server file. This is the core of your entire auth setup:

```typescript
// src/lib/server/auth.ts
import { betterAuth } from "better-auth";

export const auth = betterAuth({
  database: {
    provider: "pg",
    url: process.env.DATABASE_URL!,
  },
  emailAndPassword: {
    enabled: true,
  },
});
```

Then expose it as an API route. In SvelteKit, that's a catch-all route:

```typescript
// src/routes/api/auth/[...all]/+server.ts
import { auth } from "$lib/server/auth";
import { svelteKitHandler } from "better-auth/svelte-kit";

export const { GET, POST } = svelteKitHandler(auth);
```

For **Next.js**, the equivalent looks like this:

```typescript
// app/api/auth/[...all]/route.ts
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);
```

### Client-Side Setup

Create a client instance that your UI components will use:

```typescript
// src/lib/auth-client.ts
import { createAuthClient } from "better-auth/svelte";

export const authClient = createAuthClient({
  baseURL: "http://localhost:5173",
});
```

Now you can call `authClient.signIn.email()`, `authClient.signUp.email()`, or `authClient.signOut()` from any component. The client handles cookies, CSRF, and token refresh automatically.

## The Plugin System in Practice

This is where Better Auth really separates itself. Plugins aren't afterthoughts — they're first-class citizens that extend both server and client.

### Enabling Two-Factor Authentication

```typescript
// src/lib/server/auth.ts
import { betterAuth } from "better-auth";
import { twoFactor } from "better-auth/plugins";

export const auth = betterAuth({
  database: {
    provider: "pg",
    url: process.env.DATABASE_URL!,
  },
  plugins: [
    twoFactor({
      otpOptions: {
        async sendOTP({ user, otp }) {
          // Send via your email/SMS service
          await sendEmail(user.email, `Your code: ${otp}`);
        },
      },
    }),
  ],
});
```

On the client side, you import the matching plugin to get type-safe methods:

```typescript
import { createAuthClient } from "better-auth/svelte";
import { twoFactorClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [twoFactorClient()],
});

// Now available: authClient.twoFactor.enable(), .verify(), .disable()
```

### Social OAuth (Google & GitHub)

Adding social providers is a config change, not an architecture change:

```typescript
export const auth = betterAuth({
  // ...database config
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
});
```

That's it. No separate strategy files, no callback route wiring. Better Auth handles the OAuth dance, token exchange, and account linking internally.

## The CLI and Schema Generation

Better Auth ships a CLI that introspects your auth config and generates the exact database schema you need — including tables for any plugins you've enabled.

```bash
# Generate and apply migrations automatically
npx @better-auth/cli migrate

# Or just output the schema to review first
npx @better-auth/cli generate
```

If you're using **Drizzle**, it outputs a Drizzle schema file. If you're using **Prisma**, it outputs the Prisma schema block. The CLI reads your `auth.ts` config, sees which plugins you've enabled, and generates only the tables those plugins require. Add the 2FA plugin? Re-run `generate` and you get the `twoFactor` table added. No manual SQL.

## Session Management: JWTs vs Database Sessions

Better Auth defaults to **database-backed sessions**, which is the more secure option for most apps. Every session is stored as a row in your database with an expiration timestamp. When a request comes in, the session token (stored in an `httpOnly` cookie) is validated against the database.

This means you can:

- **Revoke sessions instantly** — delete the row and the user is logged out, no waiting for a token to expire
- **See all active sessions** — show users a "your devices" screen trivially
- **Enforce session limits** — only allow N concurrent sessions per user

If you need stateless JWTs (for edge functions or high-read scenarios), Better Auth supports a JWT mode via the `jwt` plugin. But the default is database sessions, which is the right call for 90% of apps. Stateless JWTs are convenient until you need to revoke one — then you end up building a blocklist, which is basically a session store with extra steps.

## Migrating from an Existing Provider

If you're on Clerk, Auth0, or NextAuth, migration isn't a cliff — it's a slope.

1. **Set up Better Auth alongside your current solution.** Run both in parallel during the transition.
2. **Migrate your user data.** Since Better Auth uses standard database tables, you can write a simple script to insert users from your current provider's export. Password hashes from bcrypt/argon2 can typically be transferred directly.
3. **Swap the auth routes.** Point your login/signup forms to the new Better Auth endpoints.
4. **Remove the old provider.** Once all sessions have rotated, tear down the legacy integration.

The key advantage here is that Better Auth doesn't have a proprietary user format. It's just rows in your database. If you ever want to leave Better Auth in the future, your data is already yours.

## Comparison Table

| Feature                   | Better Auth                | Clerk                   | NextAuth / Auth.js     | Lucia (archived) |
| ------------------------- | -------------------------- | ----------------------- | ---------------------- | ---------------- |
| **Cost**                  | Free / OSS                 | Free tier, then per-MAU | Free / OSS             | Free / OSS       |
| **Data Ownership**        | Full (your DB)             | Vendor-hosted           | Full (your DB)         | Full (your DB)   |
| **Framework Support**     | Any JS framework           | React-first, growing    | Next.js-first, growing | Any (manual)     |
| **2FA / MFA**             | Plugin (official)          | Built-in                | DIY                    | DIY              |
| **Social OAuth**          | Config-driven              | Built-in                | Provider adapters      | DIY              |
| **Organizations / Teams** | Plugin (official)          | Built-in (paid)         | Not supported          | Not supported    |
| **Passkeys / WebAuthn**   | Plugin (official)          | Built-in                | Community adapter      | DIY              |
| **Session Management**    | DB sessions + optional JWT | Managed                 | DB or JWT              | DB sessions      |
| **Schema Generation**     | CLI-driven                 | N/A (managed)           | Adapter-dependent      | Manual           |
| **Setup Complexity**      | Low                        | Very low                | Medium                 | Medium-high      |
| **Vendor Lock-in Risk**   | None                       | High                    | Low                    | None             |

## The Verdict

Better Auth bridges the gap between rolling your own auth (which is risky and difficult) and using a full service (which is expensive and locked-in). It provides the pre-built UI hooks and the complex backend security logic, letting you focus on building your actual application rather than reinventing login flows.

What makes it genuinely different from previous "self-hosted auth" libraries is the **plugin system and the CLI**. Previous solutions gave you the building blocks and wished you luck. Better Auth gives you a curated, tested, type-safe system where enabling 2FA is a one-line config change, not a weekend project.

If you're starting a new project today, Better Auth is the default recommendation. If you're on an existing solution that's working fine, there's no emergency — but the migration path is clean whenever you're ready. The JavaScript auth landscape has been a revolving door of half-solutions for a decade. Better Auth is the first one that feels like it might actually stick.
