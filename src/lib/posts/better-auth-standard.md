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

Recently, a new library simply called Better Auth has emerged. It offers the data ownership of a self-hosted library with the developer experience of a managed service, and it's quickly becoming the default choice for new projects.

## The auth landscape problem

To understand why Better Auth is catching on, you have to look at the other options developers have been dealing with.

**Passport.js** is the oldest of the bunch. It has strategies for almost every login provider, but setting it up means wiring together middleware, handling session serialization, managing database tables, and debugging cookie configurations. It works, but it takes a lot of boilerplate to get there.

**NextAuth (now Auth.js)** was a massive step forward because of its declarative configuration and built-in database adapters. However, it was tightly coupled to Next.js for a long time. The migration from version 4 to 5 was notoriously painful, the documentation is often confusing, and support for edge runtimes feels like an afterthought. It also makes you write custom logic if you want basic features like multi-factor authentication or organization management.

**Lucia** took a different path by focusing on a minimal, low-level API that let you own your auth flow. Developers loved it, but the creator deprecated it in early 2025, suggesting that developers should either write their own auth or find another library. That left a major gap in the ecosystem.

**Clerk and Auth0** are managed services. They are polished and fast to set up, but you pay a price. Your user database lives on their servers, billing scales quickly based on monthly active users, and you are always at risk of sudden price increases. Clerk's free tier is great until your user base grows past their limit.

Better Auth fills the gap these tools left behind. It gives you the convenience of a managed provider, but you keep your database in-house.

## Why Better Auth is winning

### 1. Data ownership

With managed auth services, your users live in someone else's database. Better Auth uses your existing database, whether you are running PostgreSQL, MySQL, or SQLite. You own the records, meaning there is no vendor lock-in.

This also means you can query your users table directly. You do not need to make API calls to a third party just to count your users, and you do not need to set up complex webhook syncs to keep a local database copy up to date.

### 2. Framework agnostic

Many modern libraries are built specifically for Next.js or React. Better Auth works with Next.js, Nuxt, SvelteKit, Astro, Solid, and standard Express servers. The core library is a plain HTTP handler, so any framework that can route requests can run it.

### 3. A powerful plugin system

Authentication is rarely just about passwords. Better Auth includes official plugins for two-factor authentication, passkeys (WebAuthn), and organization/team management.

### 4. Automated schema management

Setting up session, account, and verification tables in your database is usually tedious. Better Auth includes a CLI that reads your configuration and generates the database schema automatically for ORMs like Drizzle and Prisma.

## Getting started

Here is how to set it up in a project. We will use SvelteKit for the examples, but the server-side code is similar for other frameworks.

### Installation

```bash
npm install better-auth
```

### Server-side auth handler

Create your auth instance in a server-side file:

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

Expose this handler through a catch-all API route:

```typescript
// src/routes/api/auth/[...all]/+server.ts
import { auth } from "$lib/server/auth";
import { svelteKitHandler } from "better-auth/svelte-kit";

export const { GET, POST } = svelteKitHandler(auth);
```

For Next.js, the route looks like this:

```typescript
// app/api/auth/[...all]/route.ts
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);
```

### Client-side setup

Create the client instance your UI components will use:

```typescript
// src/lib/auth-client.ts
import { createAuthClient } from "better-auth/svelte";

export const authClient = createAuthClient({
  baseURL: "http://localhost:5173",
});
```

Now you can import `authClient` and call functions like `authClient.signIn.email()` or `authClient.signOut()`. The client handles cookies, CSRF tokens, and session refreshes automatically.

## The plugin system in practice

Plugins in Better Auth extend both the server-side configuration and the client-side client.

### Enabling two-factor authentication

On the server, add the plugin to your configuration:

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
          await sendEmail(user.email, `Your code: ${otp}`);
        },
      },
    }),
  ],
});
```

On the client, register the corresponding client plugin to get type-safe methods:

```typescript
import { createAuthClient } from "better-auth/svelte";
import { twoFactorClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [twoFactorClient()],
});

// Now available: authClient.twoFactor.enable(), .verify(), .disable()
```

### Social OAuth (Google and GitHub)

Adding social logins is a configuration change:

```typescript
export const auth = betterAuth({
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

Better Auth manages the OAuth flow, token exchanges, and account linking behind the scenes.

## The CLI and schema generation

The Better Auth CLI checks your configuration and updates your database schema:

```bash
# Generate and apply migrations automatically
npx @better-auth/cli migrate

# Output the schema to review first
npx @better-auth/cli generate
```

If you use Drizzle, the tool outputs a schema file. If you use Prisma, it outputs a Prisma schema block. The CLI only creates tables for the features and plugins you have enabled, so adding two-factor authentication is handled without manual SQL.

## Session management: JWTs vs database sessions

Better Auth defaults to database-backed sessions. Every session is stored as a database row with an expiration date, and the client sends a token inside an `httpOnly` cookie to validate it.

This approach gives you several built-in benefits:

- You can revoke sessions immediately by deleting the database row.
- You can build a list of active devices for users.
- You can limit the number of active sessions per user.

If you need stateless sessions for edge functions or high-scale read patterns, you can enable JWT mode using the official JWT plugin. However, database sessions are generally the safer default. Stateless JWTs are convenient, but revoking them usually requires building a blocklist, which defeats the purpose of being stateless.

## Migrating from an existing provider

If you are migrating from Clerk, Auth0, or NextAuth, you can do it in stages:

1. Run Better Auth in parallel with your current auth provider.
2. Move your user records. Because Better Auth stores records in standard tables, you can write a script to import user accounts. Password hashes from bcrypt or argon2 can typically be copied directly.
3. Switch your forms to point to the Better Auth endpoints.
4. Remove the old provider once all active sessions have rotated.

Because your data is stored in standard SQL tables, you are never locked into the library.

## Comparison table

| Feature                   | Better Auth                | Clerk                   | NextAuth / Auth.js | Lucia (archived) |
| ------------------------- | -------------------------- | ----------------------- | ------------------ | ---------------- |
| **Cost**                  | Free / OSS                 | Free tier, then per-MAU | Free / OSS         | Free / OSS       |
| **Data Ownership**        | Full (your DB)             | Vendor-hosted           | Full (your DB)     | Full (your DB)   |
| **Framework Support**     | Any JS framework           | React-first             | Next.js-first      | Any (manual)     |
| **2FA / MFA**             | Plugin (official)          | Built-in                | DIY                | DIY              |
| **Social OAuth**          | Config-driven              | Built-in                | Provider adapters  | DIY              |
| **Organizations / Teams** | Plugin (official)          | Built-in (paid)         | Not supported      | Not supported    |
| **Passkeys / WebAuthn**   | Plugin (official)          | Built-in                | Community adapter  | DIY              |
| **Session Management**    | DB sessions + optional JWT | Managed                 | DB or JWT          | DB sessions      |
| **Schema Generation**     | CLI-driven                 | N/A (managed)           | Adapter-dependent  | Manual           |
| **Setup Complexity**      | Low                        | Very low                | Medium             | Medium-high      |
| **Vendor Lock-in Risk**   | None                       | High                    | Low                | None             |

## The verdict

Better Auth balances the simplicity of managed providers with the data control of a self-hosted solution. It handles the session management and security logic while keeping user data in your database.

The main difference between Better Auth and older self-hosted libraries is the plugin system. Instead of writing custom logic for features like two-factor authentication or team management, you enable them in your configuration.

For a new project, Better Auth is a solid choice. If your current auth setup is working well, there is no need to switch, but the migration path is straightforward when you are ready to make a change.
