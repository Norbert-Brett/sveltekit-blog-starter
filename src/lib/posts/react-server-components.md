---
title: "React Server Components (RSC): The State of the Union"
excerpt: "React Server Components represent the biggest architectural shift in React's history. Here's where the ecosystem stands today."
date: "2026-06-09"
author: "Norbert Br3tt"
categories: ["React", "JavaScript", "Frontend"]
coverImage: "/images/react_server_components_infographic.png"
coverWidth: 16
coverHeight: 9
updated: "2026-06-09"
---

# React Server Components (RSC): The State of the Union

React Server Components represent a major shift in how we build React applications. By moving component execution from the browser back to the server, React aims to send only the calculated UI HTML to the client, reducing bundle sizes and improving performance.

However, adopting this new architecture has been a slow process. Here is how the server component ecosystem stands today.

## The problem React Server Components solve

To understand why this architecture was introduced, it helps to look at traditional client-side data fetching. A typical pattern looks like this:

```jsx
// Client-side fetching with useEffect
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        return fetch(`/api/users/${userId}/posts`);
      })
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <Spinner />;
  return <div>{/* render user and posts */}</div>;
}
```

This code creates a request waterfall. The browser must download the JavaScript bundle, parse it, render the parent component, and only then trigger the first API request. When that request finishes, the component re-renders and triggers the second request. Each step runs sequentially, forcing the user to wait for multiple round-trips to the server.

With server components, the component executes directly on the server, close to your database. This removes the client-side network waterfall and lets you serve fully formed HTML on the first request.

## The current framework landscape

Different frameworks implement server components in different ways:

- **Next.js**: The most mature implementation. The Next.js App Router sets components as Server Components by default. It is stable and used in production, though its complex caching layers and configuration rules can be difficult to manage for smaller apps.
- **Waku**: A minimal, Vite-based framework designed around server components. It offers a simpler environment for using server components without the complexity of Next.js, though its ecosystem is smaller.
- **TanStack Start**: A framework that brings server functions and type safety to the TanStack router ecosystem, offering an alternative for developers who prefer TanStack Router.
- **Remix and React Router**: Remix uses loaders and actions, which are server functions that run before a route renders. As of version 7, it has merged with React Router and is planning future support for server components, though loaders remain its primary data-fetching pattern.

## Key concepts demystified

### Server components: fetching data without an API

The main advantage of server components is that they can access server-side resources directly, without requiring dedicated API endpoints:

```jsx
// app/dashboard/page.tsx
import { db } from "@/lib/db";

export default async function DashboardPage() {
  const projects = await db.project.findMany({
    where: { archived: false },
    orderBy: { updatedAt: "desc" },
    take: 10,
  });

  return (
    <main>
      <h1>Your Projects</h1>
      <ul>
        {projects.map((project) => (
          <li key={project.id}>
            <h2>{project.name}</h2>
            <p>Last updated: {project.updatedAt.toLocaleDateString()}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
```

This component is asynchronous, waits for the database query to complete, and sends the rendered HTML to the browser. The database queries and backend libraries are kept on the server and are not included in the client-side JavaScript bundle.

### Server actions: mutating data from a form

Server actions allow you to define server-side functions and execute them directly from client-side forms.

```tsx
// app/projects/new/page.tsx
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { CreateProjectForm } from "./create-project-form";

async function createProject(formData: FormData) {
  "use server";

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  await db.project.create({
    data: { name, description },
  });

  redirect("/dashboard");
}

export default function NewProjectPage() {
  return <CreateProjectForm action={createProject} />;
}
```

```tsx
// app/projects/new/create-project-form.tsx
"use client";

import { useActionState } from "react";

export function CreateProjectForm({ action }) {
  const [state, formAction, isPending] = useActionState(action, null);

  return (
    <form action={formAction}>
      <input name="name" placeholder="Project name" required />
      <textarea name="description" placeholder="Description" />
      <button type="submit" disabled={isPending}>
        {isPending ? "Creating..." : "Create Project"}
      </button>
    </form>
  );
}
```

The `"use server"` directive instructs the bundler to expose an API endpoint for the function. The client form submits data to this endpoint using a POST request, which works even if JavaScript has not loaded in the client.

### "use client" vs "use server": the boundary

These directives act as boundaries between server-side and client-side code:

```
┌──────────────────────────────────────────────┐
│              SERVER TERRITORY                │
│                                              │
│  async/await             Database access     │
│  fs and env variables    No bundle footprint │
│  No client hooks         No event handlers   │
│                                              │
│  ── "use client" ── (the border) ──────────  │
│                                              │
│              CLIENT TERRITORY                │
│                                              │
│  useState and useEffect  Event handlers      │
│  Browser APIs            Interactivity       │
│  No direct DB access     No server-only libs │
│                                              │
└──────────────────────────────────────────────┘
```

The `"use client"` directive does not mean a component runs only in the browser; client components are still server-side rendered to output initial HTML. The directive indicates that the component requires hydration in the browser to enable interactivity, marking the start of the interactive component tree.

You should place the directive at the leaf nodes of your tree to isolate interactive parts, rather than applying it to whole page files:

```tsx
// settings-page.tsx (Server Component)
import { db } from "@/lib/db";
import { ThemeToggle } from "./theme-toggle"; // client component

export default async function SettingsPage() {
  const settings = await db.settings.findFirst();
  return (
    <div>
      <h1>Settings</h1>
      <p>Current plan: {settings.plan}</p>
      <ThemeToggle current={settings.theme} />
    </div>
  );
}
```

## Streaming and suspense

Server components support HTML streaming, allowing the server to send the page layout first while heavy content loads.

You can wrap slow components in a `<Suspense>` boundary to load them asynchronously:

```tsx
import { Suspense } from "react";
import { SlowAnalyticsChart } from "./analytics-chart";

export default function DashboardPage() {
  return (
    <main>
      <h1>Dashboard</h1>
      <QuickStats />
      <Suspense fallback={<ChartSkeleton />}>
        <SlowAnalyticsChart />
      </Suspense>
    </main>
  );
}
```

The browser receives the dashboard skeleton immediately, and the analytics chart, which might query a slow backend API, is streamed to the page once its data is ready, without requiring client-side data fetching scripts.

## Common mistakes and gotchas

- **Using client hooks in server components**: Server components cannot use client hooks like `useState`, `useEffect`, or `useRef`. Move interactive states to dedicated client components.
- **Passing non-serializable props**: Props passed across the server-to-client boundary must be serializable. You can pass objects, arrays, and strings, but you cannot pass functions, class instances, or Date objects directly.
- **Importing components incorrectly**: Server components can import and render client components. However, client components cannot import server components directly. To render a server component inside a client component, pass it as a `children` prop.
- **Over-using client components**: Marking large components as client components increases the JavaScript bundle size. Isolate interactive features like buttons to keep the parent pages on the server.
- **Expecting server actions to be real-time**: Server actions are standard HTTP requests. To update the view after a database mutation, you must explicitly trigger a path revalidation or a redirect.

## Should you adopt RSCs today?

- **Adopt** if you are building a new React application and want to optimize loading performance. The Next.js App Router patterns are established, and the architecture helps reduce bundle sizes.
- **Wait** if you have a large SPA. Porting a client-rendered application to server components requires rewriting data-fetching logic and component relationships.
- **Skip** if you are building a local-first application, a browser extension, or an app that runs entirely in the client without a backend.

## Looking forward

While the transition to server components introduces a new mental model for React developers, frameworks are gradually simplifying the configuration rules.

Other web frameworks, including Vue and Solid, are exploring similar server-first patterns, suggesting that rendering components on the server is becoming a standard web development pattern.
