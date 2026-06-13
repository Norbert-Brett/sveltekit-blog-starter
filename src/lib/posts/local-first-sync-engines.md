---
title: "Local-First & Sync Engines: The Future of Data"
excerpt: "We are moving toward Local-First software, where the app reads and writes to a database inside the browser and syncs to the cloud in the background."
date: "2026-06-01"
author: "Norbert Br3tt"
categories: ["Architecture", "Databases", "Frontend"]
coverImage: "/images/local_first_infographic.png"
coverWidth: 16
coverHeight: 9
updated: "2026-06-01"
---

# Local-First & Sync Engines: The Future of Data

For the last decade, web architecture has followed a strict pattern: the client requests data, the server processes it, and the client waits (showing a loading spinner) until the data arrives. We've papered over the cracks with skeleton screens, optimistic updates, and prefetching — but the fundamental model is broken.

We are now moving toward a **"Local-First"** architecture. In this model, the application reads and writes to a database living entirely _inside_ the user's browser (like SQLite compiled to WASM, or IndexedDB) and relies on a **Sync Engine** to reconcile that data with the cloud in the background. The result is software that feels like a native desktop app — instant, reliable, and always available.

## The Problem with Traditional Architecture

Let's be honest about what we've been building for years. The standard request-response cycle looks like this:

1. User clicks a button.
2. App fires a `fetch()` to the server.
3. UI shows a loading spinner (or a skeleton, if we're fancy).
4. Server queries the database, serializes the response, sends it back.
5. Client receives data, updates state, re-renders.

This works — until it doesn't. The problems compound fast:

- **Loading spinners everywhere.** Every interaction that touches data requires a round-trip. Even on fast connections, the 100-300ms latency is perceptible. On mobile networks? Painful.
- **Race conditions and stale data.** User A edits a record. User B loads the same record a moment later but gets the old version cached in their browser. User B saves their edit, silently overwriting User A's changes. You've just lost data.
- **Optimistic UI is a nightmare to build manually.** Want to show the updated todo list _before_ the server confirms the write? Now you need rollback logic, error handling for failed mutations, temporary IDs that get swapped for real ones, and queue management. For every single mutation in your app.
- **Offline is an afterthought.** Most apps simply break when the network drops. "No internet connection" is the modern equivalent of a blue screen of death.

We've accepted these trade-offs for so long that we forgot they're trade-offs at all. Local-first flips the entire model on its head.

## The Power of Local-First

So why go through the trouble of rearchitecting everything? Because the benefits are transformative:

1. **Zero Latency.** Reads and writes hit a local database. There is no network request blocking the UI. The app feels _instant_ — not "fast," but genuinely instant. Clicking a button and seeing the result in the same frame is a different experience entirely.
2. **Offline Support.** The app works perfectly on an airplane, in a subway tunnel, or in a rural area with spotty coverage. When connectivity returns, the sync engine reconciles changes automatically.
3. **Real-Time Collaboration.** Because sync engines propagate changes between clients, you get multiplayer for free. Two users editing the same document see each other's changes appear in real-time — no WebSocket plumbing required.
4. **Data Sovereignty.** The user's data lives on their device first. They own it. This matters for privacy-conscious users, for regulatory compliance (GDPR), and for apps where the data is sensitive.
5. **Reduced Server Costs.** Your server no longer handles every single read. It only processes sync diffs. For read-heavy apps — which is most apps — this can dramatically reduce infrastructure costs.
6. **Resilience.** If your server goes down for an hour, your users don't even notice. They keep working. The sync catches up later. Your "five nines" uptime requirement just got a lot easier to hit.

This architecture provides the ultimate User Experience (UX), but it is notoriously complex to build from scratch. The hard part? **Conflict resolution** — what happens when two offline users edit the same document at the same time?

## How Sync Engines Actually Work

At the heart of every sync engine is an answer to one question: _when two clients make conflicting changes, who wins?_

There are two dominant approaches:

### CRDTs (Conflict-free Replicated Data Types)

CRDTs are data structures that are mathematically guaranteed to converge to the same state, no matter what order the operations arrive in. Think of them as "merge-friendly" data types.

For example, a **G-Counter** (grow-only counter) works by giving each client its own counter. To get the total, you sum all counters. Two clients can increment independently, and the merged result is always correct — no conflicts possible.

More complex CRDTs like **Yjs** or **Automerge** handle rich text, arrays, and nested objects. They track every operation with a unique timestamp and client ID, then use deterministic rules to merge concurrent edits.

The upside: no coordination needed. Clients can diverge freely and always converge. The downside: CRDTs can be memory-hungry (they store edit history) and some data structures are genuinely hard to model as CRDTs.

### Operational Transforms (OT)

OT — the approach Google Docs pioneered — takes a different path. Instead of making the data structure itself conflict-free, OT transforms operations against each other so they can be applied in any order. If Alice inserts "hello" at position 5 and Bob deletes the character at position 3, OT adjusts Alice's operation to account for Bob's deletion.

OT works well for text editing but gets extremely complex for arbitrary data structures. It also typically requires a central server to determine the canonical operation order.

### Why Conflict Resolution is the Hard Problem

Most toy demos skip this part. But in production, you face questions like: What if one user deletes a list item while another user edits it? What if two users move the same item to different positions? What if one user is offline for three days and comes back with hundreds of changes?

This is exactly why sync engines exist — to handle these edge cases so you don't have to.

## The Sync Engine Contenders

Thankfully, new tools are emerging to handle the heavy lifting. Here are the ones worth watching:

### Replicache

A mature, battle-tested sync engine built by Aaron Boodman (co-creator of Google Chrome extensions). Replicache uses a **client-side transactional cache** backed by your own server. You define "mutators" — functions that describe how to change your data — and Replicache handles optimistic updates, rollback, and sync.

```js
// Define a mutator
const rep = new Replicache({
  mutators: {
    async createTodo(tx, { id, title, completed }) {
      await tx.set(`todo/${id}`, { id, title, completed });
    },
    async toggleTodo(tx, { id }) {
      const todo = await tx.get(`todo/${id}`);
      await tx.set(`todo/${id}`, { ...todo, completed: !todo.completed });
    },
  },
});

// Use a subscription for reactive data
const todos = useSubscribe(rep, async (tx) => {
  const entries = await tx.scan({ prefix: "todo/" }).entries().toArray();
  return entries.map(([, v]) => v);
});
```

Replicache requires you to write your own backend "push" and "pull" endpoints, which gives you full control over authorization and business logic. It's the most flexible option but demands more backend work.

### ElectricSQL

ElectricSQL takes a radically different approach: it uses **Postgres logical replication** to sync your server database directly to a local SQLite database in the browser. You define "shapes" — essentially filtered subsets of your Postgres tables — and Electric streams those rows to the client.

The magic here is that you keep your existing Postgres schema, your existing backend, and your existing queries. Electric sits as a sync layer between Postgres and the client. Conflict resolution uses a last-write-wins strategy at the row level by default, with support for custom resolution logic.

This is the best option if you already have a Postgres backend and want to add local-first capabilities without rewriting everything.

### Zero

Created by the Replicache team as its spiritual successor, Zero aims to make local-first as simple as declaring a query. It provides a **reactive query language** that runs against a local cache, and the cache automatically stays in sync with the server.

```js
const todos = z.query.todo.where("completed", "=", false).orderBy("createdAt", "desc").limit(50);
```

That query runs locally, returns instantly, and automatically updates when the underlying data changes — whether from the local user or from another client syncing in the background. Zero handles partial replication (you don't need the entire database on the client), permissions, and conflict resolution. It's the most "it just works" option in this space.

### InstantDB

InstantDB is a database that feels like using `useState` in React. You change data, and it propagates to everyone else's screen instantly. It's built for speed of development — you can go from zero to a real-time collaborative app in minutes.

```js
import { init, tx, id } from "@instantdb/react";

const db = init({ appId: "my-app-id" });

function TodoApp() {
  // This query is live — it updates in real-time
  const { isLoading, data } = db.useQuery({ todos: {} });

  const addTodo = (title) => {
    db.transact(tx.todos[id()].update({ title, completed: false }));
  };

  // data.todos is always fresh — no refetching needed
}
```

InstantDB handles auth, permissions, and real-time sync out of the box. The trade-off is less control over your backend and data layer. It's ideal for prototyping, hackathons, and apps where speed of development matters more than infrastructure control.

## SQLite in the Browser

A key enabler of the local-first movement is **SQLite compiled to WebAssembly**. Several projects make this possible:

- **wa-sqlite** — A WebAssembly build of SQLite that uses the Origin Private File System (OPFS) for persistence. Data survives page reloads and browser restarts.
- **sql.js** — An older Emscripten-compiled SQLite that runs entirely in memory. Great for ephemeral use cases but doesn't persist by default.
- **cr-sqlite** — A SQLite extension that adds CRDT-based replication _at the database level_. Each table becomes merge-friendly, and you can sync SQLite databases between clients using simple row-level CRDTs.

Why does this matter? Because SQLite is the most deployed database engine in the world. It's battle-tested, it supports full SQL, and it's incredibly fast for local operations. Having it run in the browser means your client-side database isn't a toy — it's production-grade infrastructure.

The typical stack looks like this: **wa-sqlite** (or cr-sqlite) stores data locally in OPFS, your sync engine pushes and pulls diffs to the server, and your UI layer queries the local SQLite instance with zero latency.

## When NOT to Use Local-First

Local-first is powerful, but it's not a silver bullet. Here's when you should stick with traditional architecture:

- **Large datasets.** If your app deals with gigabytes of data (analytics dashboards, media libraries), you can't replicate it all to the client. Partial replication helps, but there's a limit to how much data belongs in a browser.
- **Strict consistency requirements.** Banking, inventory systems, booking platforms — anywhere you need a single source of truth and cannot tolerate even temporary inconsistency. If two users booking the last concert ticket both get a "success" because they're working offline, you have a real problem.
- **Audit trails and compliance.** Some industries require that every data change goes through a server for logging, validation, and compliance. Local-first's offline writes can conflict with these requirements.
- **Simple CRUD apps.** If your app is a basic admin panel used on a desktop with reliable internet, the complexity of a sync engine isn't worth the benefit. `fetch()` and React Query will serve you fine.
- **Short-lived sessions.** If users visit your app once, do one thing, and leave (e-commerce checkout, landing pages), there's no benefit to setting up a local database.

The rule of thumb: **local-first shines for apps where users spend significant time creating and editing data, especially collaboratively or across unreliable networks.**

## Getting Started: Your First Local-First App

If you're convinced and want to try it, here's the conceptual architecture:

1. **Choose your local storage.** OPFS-backed wa-sqlite for full SQL power, or IndexedDB if you prefer a key-value model.
2. **Pick a sync engine.** Zero or InstantDB for the fastest start. ElectricSQL if you have an existing Postgres backend. Replicache if you need maximum control.
3. **Define your data shapes.** Decide which data lives on the client. Not everything needs to sync — user settings and active documents, yes. Historical analytics, no.
4. **Build your UI against local data.** Your components read from the local database. Writes go to the local database first, then the sync engine pushes them to the server.
5. **Handle the edge cases.** What happens when sync fails? When there's a conflict? When the user clears their browser data? Your sync engine handles most of this, but you need to think about the UX for these moments.

The mental shift is the hardest part. Stop thinking "fetch data from server, render it." Start thinking "the data is already here, just read it."

## The Era of the Loading Spinner is Ending

The trajectory is clear. Browser capabilities (WASM, OPFS, Web Workers) are maturing. Sync engines are getting easier to use. The gap between "native app feel" and "web app feel" is closing — and local-first is what closes it.

We're not just optimizing load times. We're fundamentally rethinking where data lives, who owns it, and how applications interact with it. The apps that adopt this model will feel like they're from the future. The rest will feel like they're still waiting for a spinner to finish.

The database is moving to the client. The question isn't _if_ — it's _when_ you'll make the switch.
