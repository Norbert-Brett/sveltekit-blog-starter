---
title: "The Model Context Protocol (MCP): Giving AI 'Hands'"
excerpt: "Think of MCP as an API for AI. It allows you to expose tools and resources directly to an LLM, giving it the ability to interact with your specific data."
date: "2026-06-05"
author: "Norbert Br3tt"
categories: ["AI", "Tooling"]
coverImage: "/images/mcp_infographic.png"
coverWidth: 16
coverHeight: 9
updated: "2026-06-05"
---

# The Model Context Protocol (MCP): Giving AI "Hands"

If you have been using AI for coding, you know the frustration: the AI is incredibly smart, but it's trapped in a box. It can't see your database, it can't check your server logs, and it certainly doesn't know about your company's specific internal documentation.

The Model Context Protocol (MCP) is the emerging standard solving this exact problem. In this post, we'll go deep — the architecture, the best servers available today, how to build your own from scratch, and the security pitfalls you need to avoid.

## What is MCP?

Think of MCP as an API specifically designed for AI. It allows you to expose **tools** (executable functions), **resources** (readable data), and **prompts** (reusable templates) to an LLM. Instead of manually copying and pasting logs into ChatGPT or Claude, you connect your AI client (like Cursor, Claude Desktop, or an agentic framework) to an MCP Server.

This gives the AI "hands" to manipulate your environment and "eyes" to read your specific context.

## The Architecture: Client → Server → Tool

MCP follows a clean client-server model. Here's how the pieces fit together:

```
┌─────────────────┐       JSON-RPC        ┌─────────────────┐
│   MCP Client    │ ◄──────────────────► │   MCP Server    │
│  (Claude, Cursor │    (stdio or SSE)    │  (your code)    │
│   VS Code, etc.) │                      │                 │
└─────────────────┘                      └────────┬────────┘
                                                  │
                                      ┌───────────┼───────────┐
                                      ▼           ▼           ▼
                                  ┌───────┐  ┌──────────┐ ┌────────┐
                                  │ Tools │  │ Resources│ │Prompts │
                                  └───────┘  └──────────┘ └────────┘
```

1. **The Client** is any AI-powered application — Claude Desktop, Cursor, Windsurf, or your own agent. It discovers what capabilities a server offers, then calls them when the LLM decides it needs to.
2. **The Server** is a lightweight process you run. It registers tools, resources, and prompts, then waits for requests over a transport layer (stdio for local processes, SSE for remote).
3. **The Primitives** (Tools, Resources, Prompts) are the capabilities the server exposes. The LLM sees their names and descriptions, then decides when to invoke them.

The key insight: the _model_ decides when to call a tool. You describe what the tool does, and the LLM figures out the right moment to use it based on the user's intent.

## S-Tier MCP Servers to Use Today

The ecosystem is growing rapidly. Here are some incredibly powerful MCP servers that change how you build software — with real examples of what interactions actually look like.

### Chrome DevTools

Allows the AI to open a headless browser, click buttons, inspect the console for errors, and verify CSS or layout fixes automatically. It's like having an automated QA tester built into your editor.

**Example interaction:**

> **You:** "My signup form button is invisible on mobile. Can you check what's happening?"
>
> **AI calls** `browser_navigate` → opens `localhost:3000/signup` with a mobile viewport
> **AI calls** `browser_console_errors` → finds `Uncaught TypeError` in `form.js`
> **AI calls** `browser_screenshot` → sees the button is rendered behind the footer
>
> **AI responds:** "Two issues — there's a JS error preventing the loading state, and your `.submit-btn` has `position: absolute` without a `z-index`, so it renders behind the footer on viewports under 640px. Here's the fix..."

### Sentry

Instead of hunting for bugs in a dashboard, you can ask your AI to find and fix errors directly.

**Example interaction:**

> **You:** "What are the latest unresolved errors in production?"
>
> **AI calls** `sentry_search_issues` with query `is:unresolved` and project `web-app`
>
> **AI responds:** "There are 3 unresolved issues. The most frequent is a `TypeError: Cannot read property 'email' of undefined` in `UserProfile.tsx` at line 42, occurring 847 times in the last 24h. The user object isn't being null-checked after the API call. Here's a fix..."

### Postgres / Databases

Give the AI read-access to your database schema. It can now write perfect SQL queries without you having to repeatedly paste the schema into the prompt.

**Example interaction:**

> **You:** "Which customers signed up in the last week but haven't made a purchase?"
>
> **AI calls** `query` → `SELECT * FROM customers WHERE created_at > NOW() - INTERVAL '7 days' AND id NOT IN (SELECT customer_id FROM orders)`
>
> **AI responds:** "Found 23 customers. Here's the breakdown by signup source..." (then formats a table)

### Stripe

Manage customers, create test products, and inspect invoices directly through natural language.

**Example interaction:**

> **You:** "Create a test product called 'Pro Plan' at $29/month with a 14-day trial."
>
> **AI calls** `stripe_create_product` with name `Pro Plan`
> **AI calls** `stripe_create_price` with `unit_amount: 2900`, `recurring.interval: month`, `trial_period_days: 14`
>
> **AI responds:** "Done. Product `prod_xxx` is live in test mode with a $29/month price and 14-day free trial. Here's the checkout link to test it..."

## MCP Resources vs Tools

This is a distinction that trips people up. MCP exposes three primitives, and two of them — **Resources** and **Tools** — sound similar but serve very different purposes.

**Tools** are _actions_. They do something — query a database, send an email, create a file. The model _invokes_ them, and they have side effects. Think of them like POST endpoints.

**Resources** are _data_. They provide context for the model to read — a file's contents, a database schema, a config file. They are read-only and identified by a URI. Think of them like GET endpoints.

```typescript
// Resource — provides data for context
server.resource("schema", "db://schema", async () => ({
  contents: [
    {
      uri: "db://schema",
      text: await getDbSchema(), // read-only
      mimeType: "text/plain",
    },
  ],
}));

// Tool — performs an action
server.tool("run_query", { sql: z.string() }, async ({ sql }) => {
  const rows = await db.query(sql); // has side effects
  return { content: [{ type: "text", text: JSON.stringify(rows) }] };
});
```

**Why does this matter?** Resources can be loaded proactively by the client to stuff into the LLM's context window _before_ the user even asks a question. Tools are only called when the model decides to act. A well-designed MCP server uses resources for "here's what you need to know" and tools for "here's what you can do."

## MCP Prompts: The Third Primitive

Prompts are the most overlooked primitive. They are reusable, parameterized templates that a server can expose to guide the LLM's behavior. Think of them as server-defined "slash commands."

```typescript
server.prompt("code_review", { pr_diff: z.string() }, ({ pr_diff }) => ({
  messages: [
    {
      role: "user",
      content: {
        type: "text",
        text: `Review this PR diff for bugs, security issues, and style problems. Be concise.\n\n${pr_diff}`,
      },
    },
  ],
}));
```

When a user selects this prompt in their client, the LLM receives a well-structured request instead of a vague "review my code." This is powerful for teams — you can standardize how your AI handles common tasks like code reviews, incident triage, or data analysis, and ship those patterns as part of your MCP server.

## Building Your Own MCP Server

Let's build a real, working MCP server — a weather lookup tool. This covers the full setup including transport configuration.

```typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "WeatherServer",
  version: "1.0.0",
});

// Define a tool the AI can call
server.tool(
  "get_weather",
  "Get the current weather for a city",
  { city: z.string().describe("City name, e.g. 'London'") },
  async ({ city }) => {
    const res = await fetch(`https://wttr.in/${encodeURIComponent(city)}?format=j1`);
    const data = await res.json();
    const current = data.current_condition[0];

    return {
      content: [
        {
          type: "text",
          text:
            `Weather in ${city}: ${current.temp_C}°C, ${current.weatherDesc[0].value}. ` +
            `Humidity: ${current.humidity}%, Wind: ${current.windspeedKmph} km/h`,
        },
      ],
    };
  },
);

// Connect via stdio transport (for local use with Claude Desktop / Cursor)
const transport = new StdioServerTransport();
await server.connect(transport);
```

### Stdio vs SSE Transport

- **Stdio** — The client spawns your server as a child process. Communication happens over `stdin`/`stdout`. This is the default for local tools and what Claude Desktop and Cursor use. Zero network config, zero auth headaches.
- **SSE (Server-Sent Events)** — The server runs as a standalone HTTP service. Clients connect over the network. Use this when you want to host a shared MCP server for a team, or deploy it remotely.

For most personal or local-dev use cases, stdio is the way to go. SSE is for when you're running MCP servers as infrastructure.

## Getting Started: Configuring Your Client

Most MCP clients use a JSON config file to know which servers to spin up. Here's how to wire up the weather server we just built.

**Claude Desktop** (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "weather": {
      "command": "node",
      "args": ["./mcp-servers/weather/index.js"]
    },
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "DATABASE_URL": "postgresql://user:pass@localhost:5432/mydb"
      }
    }
  }
}
```

**Cursor** (`.cursor/mcp.json` in your project root):

```json
{
  "mcpServers": {
    "weather": {
      "command": "node",
      "args": ["./mcp-servers/weather/index.js"]
    }
  }
}
```

After saving the config, restart the client. You should see your tools appear in the available tools list. The AI will start using them automatically when they're relevant to your prompts.

## Security Considerations

MCP is powerful — and that means it's dangerous if you're careless. A few things to think about before you wire up a server to your production database:

- **Principle of least privilege.** Give the AI read-only access unless you _genuinely_ need write operations. A `SELECT`-only Postgres user is your friend.
- **Validate and sanitize inputs.** The model generates the arguments to your tools. Treat them like untrusted user input — because they are. Use Zod schemas aggressively.
- **Never expose secrets through tool responses.** If your tool returns API keys, tokens, or credentials in its output, those go straight into the LLM's context (and potentially into logs). Redact sensitive data before returning it.
- **Be cautious with `eval` or shell execution tools.** Tools that let the AI run arbitrary code or shell commands are incredibly useful — and incredibly risky. Sandbox them, limit permissions, and never run them against production systems without guardrails.
- **Audit tool calls.** Log every tool invocation with its arguments and results. You want a trail when something goes wrong — and with agentic workflows, things _will_ eventually go wrong.

A good rule of thumb: if you wouldn't give a junior developer unrestricted access to it, don't give it to your MCP server either.

## Where MCP Is Heading

MCP is still early, but the trajectory is clear. We're moving from AI as a text generator to AI as an active participant in our development environments — and eventually, in production systems.

A few trends to watch:

- **Composable agent architectures** — Multiple MCP servers chained together, where an AI agent can use a Sentry server to find a bug, a GitHub server to create a branch, a code-editing tool to write the fix, and a CI server to deploy it. All in one conversation.
- **Marketplace and discovery** — Expect a registry of verified MCP servers, much like npm or the VS Code extension marketplace. Anthropic and the community are already building toward this.
- **Authentication standards** — OAuth-based flows for remote MCP servers are being standardized, enabling secure, multi-tenant server deployments.
- **Streaming and real-time** — Today, tools return a single response. Future iterations will likely support streaming results, enabling tools that watch logs, monitor metrics, or track deployments in real time.

The protocol is the foundation. By standardizing how tools talk to LLMs, we're building the plumbing for a future where AI doesn't just _suggest_ code — it ships it.
