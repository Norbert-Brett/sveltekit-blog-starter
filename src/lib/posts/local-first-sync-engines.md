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

For the last decade, web architecture has followed a strict pattern: the client requests data, the server processes it, and the client waits, showing a loading spinner, until the data arrives. We have tried to hide this latency using skeleton screens, optimistic updates, and prefetching, but the fundamental model has clear limitations.

We are now moving toward a local-first architecture. In this model, the application reads and writes to a database living entirely inside the user's browser, such as SQLite compiled to WebAssembly or IndexedDB, and relies on a sync engine to reconcile that data with the cloud in the background. The result is web software that feels like a native desktop app: instant, reliable, and always available.

## The problem with traditional architecture

The standard request-response cycle that we have been building for years is straightforward:

1. The user clicks a button.
2. The app sends a network request to the server.
3. The UI shows a loading spinner or a skeleton state.
4. The server queries the database, processes the response, and sends it back.
5. The client receives the data, updates its state, and re-renders.

While this works in ideal conditions, the limitations show up quickly as complexity grows:

- **Frequent loading indicators**: Every interaction that reads or writes data requires a round-trip to the server. Even on fast connections, a latency of 100 to 300 milliseconds is noticeable. On mobile networks, it becomes sluggish.
- **Race conditions**: If two users edit the same record at similar times, they can easily overwrite each other's changes. The second user to save will silently overwrite the first user's edits, leading to data loss.
- **Complex optimistic UI implementation**: Updating a UI state before the server confirms a write requires managing rollback states, handling failed network mutations, generating temporary IDs, and managing queues for every operation.
- **Poor offline capability**: Most web applications simply fail when the network connection is lost. A lost connection screen is the web equivalent of a crash.

Local-first architecture addresses these issues by changing how we handle client data.

## The power of local-first

Rearchitecting an application around local storage offers several clear advantages:

1. **Zero latency**: Reads and writes target the local database directly. No network requests block the user interface, making the application feel instant.
2. **Offline support**: The application remains functional on flights, in transit, or in areas with poor cellular service. The sync engine reconciles changes once connection is restored.
3. **Real-time collaboration**: Sync engines propagate updates between clients, providing collaborative features without requiring custom WebSocket infrastructure.
4. **Data sovereignty**: User data is stored on the local device first. This is beneficial for privacy-focused applications and regulatory compliance.
5. **Lower server load**: The server only processes synchronization diffs rather than handling every read request, which reduces infrastructure costs.
6. **Resilience**: Server outages do not immediately disrupt active users, who can continue working while the sync engine queues updates.

While this approach improves user experience, it requires a robust solution for conflict resolution: what happens when two offline users edit the same document simultaneously?

## How sync engines actually work

The central role of a sync engine is to determine how to resolve conflicting changes from different clients.

There are two primary methods:

### CRDTs

Conflict-free Replicated Data Types (CRDTs) are data structures designed so that concurrent updates can always be merged deterministically, regardless of the order in which they are processed.

For instance, a grow-only counter works by tracking increments per client. The total is calculated by summing the values from all clients, preventing conflicts.

More advanced CRDT libraries, like Yjs or Automerge, manage rich text, arrays, and nested structures. They track operations with timestamps and client IDs, applying deterministic rules to merge concurrent changes.

The advantage is that clients do not need central coordination to resolve updates. The downside is that storing edit histories can increase memory usage, and some data schemas are difficult to model as CRDTs.

### Operational transforms

Operational Transformation (OT), the technology used in collaborative editors like Google Docs, takes a different approach. It transforms edit operations relative to each other so they can be applied out of order. If one user inserts text and another deletes a character at a preceding position, the system adjusts the insertion index to account for the deletion.

OT is effective for text editing but becomes complicated for general database records. It also generally requires a central server to coordinate the order of operations.

### Why conflict resolution is the hard problem

In a production environment, you must handle complex scenarios: a user deleting an item that another user is currently editing, moving items concurrently to different positions, or reconciling a client that has been offline for several days.

Sync engines are built specifically to manage these edge cases.

## The sync engine contenders

Several libraries are available to handle data synchronization:

### Replicache

Replicache is a client-side transactional cache backed by a custom server. You define mutator functions that describe how to modify your data, and Replicache manages optimistic updates, rollbacks, and synchronization.

```js
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

const todos = useSubscribe(rep, async (tx) => {
  const entries = await tx.scan({ prefix: "todo/" }).entries().toArray();
  return entries.map(([, v]) => v);
});
```

Replicache requires you to implement your own backend synchronization endpoints, which gives you complete control over authorization and validation logic.

### ElectricSQL

ElectricSQL uses Postgres logical replication to synchronize database tables directly to a local SQLite database in the client. You define shapes, which are subsets of your Postgres tables, and Electric streams the relevant rows to the browser.

This allows you to keep your existing Postgres schema and backend queries, while Electric manages the client sync layer. Conflict resolution defaults to a last-write-wins strategy at the row level.

This option is suitable if you want to add local-first features to an existing Postgres-based application.

### Zero

Zero is a query-based sync engine that provides a reactive query language running against a local client cache. The cache automatically synchronizes updates with the server.

```js
const todos = z.query.todo.where("completed", "=", false).orderBy("createdAt", "desc").limit(50);
```

The query executes locally and updates automatically as data changes, either from local writes or background sync operations. Zero handles partial replication, permissions, and conflict resolution.

### InstantDB

InstantDB is a client-side database designed to simplify real-time data sync, acting similarly to local state management.

```js
import { init, tx, id } from "@instantdb/react";

const db = init({ appId: "my-app-id" });

function TodoApp() {
  const { isLoading, data } = db.useQuery({ todos: {} });

  const addTodo = (title) => {
    db.transact(tx.todos[id()].update({ title, completed: false }));
  };
}
```

InstantDB manages authentication, authorization, and data synchronization. It is well-suited for prototyping and collaborative applications where speed of development is a priority.

## SQLite in the browser

The use of SQLite compiled to WebAssembly has made local-first architectures practical for web applications. Key projects include:

- **wa-sqlite**: A WebAssembly build of SQLite that uses the Origin Private File System (OPFS) for persistent storage. Data is preserved across page refreshes and browser restarts.
- **sql.js**: An in-memory SQLite build, suitable for temporary storage.
- **cr-sqlite**: A SQLite extension that adds CRDT-based replication at the database level, allowing SQLite databases to sync directly.

This means the browser runs a full, production-grade SQL engine. The typical stack combines wa-sqlite for local persistence, a sync engine to manage updates with the server, and a UI layer that queries the local SQLite instance.

## When not to use local-first

Local-first is not suitable for every project:

- **Large datasets**: If your application manages gigabytes of data, you cannot copy the entire database to the client. While partial replication helps, browser storage limits must be considered.
- **Strict transactional consistency**: Systems like banking or booking platforms require immediate consistency to prevent duplicate reservations.
- **Strict audit requirements**: Industries that require every change to be immediately validated and logged by a server may find offline client writes impractical.
- **Simple CRUD applications**: Basic administrative panels with reliable network access may not benefit from the added complexity of a sync engine.
- **Short-lived sessions**: Applications like e-commerce checkouts or landing pages do not need a persistent local client database.

Local-first is most effective for applications where users create and edit data over extended periods, particularly when working collaboratively or on unreliable networks.

## Getting started: your first local-first app

To build a local-first application, follow these steps:

1. **Select local storage**: Use wa-sqlite with OPFS for SQL capabilities, or IndexedDB for key-value storage.
2. **Choose a sync engine**: Select a synchronization library that matches your backend architecture and control requirements.
3. **Define data scope**: Determine which tables and records need to be copied to the client.
4. **Bind UI to local data**: Read and write directly to the local database, and let the sync engine manage server updates in the background.
5. **Manage conflict states**: Ensure your application handles synchronization failures and data merge conflicts appropriately.

The shift requires moving from a model of fetching remote data to querying a local database that is kept in sync.

## The era of the loading spinner is ending

As browser capabilities like WebAssembly, OPFS, and Web Workers mature, sync engines are becoming more practical to implement. Local-first architecture helps bridge the performance gap between web and native applications.

Instead of optimizing network load times, this model changes where data is managed and how the client interacts with it, removing standard loading delays from the user experience.
