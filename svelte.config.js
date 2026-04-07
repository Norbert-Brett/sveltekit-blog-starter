import adapter from "@sveltejs/adapter-static";
import { mdsvex } from "mdsvex";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";

let shikiPromise = null;

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Ensures both .svelte and .md files are treated as components (can be imported and used anywhere, or used as pages)
  extensions: [".svelte", ".md"],

  kit: {
    adapter: adapter(),
    alias: {
      $lib: "./src/lib",
      "@/*": "./src/lib/*",
    },
    prerender: {
      entries: ["*", "/api/posts/page/*"],
    },
  },

  preprocess: [
    mdsvex({
      // The default mdsvex extension is .svx; this overrides that.
      extensions: [".md"],

      // Adds Shiki syntax highlighting
      highlight: {
        highlighter: async (code, lang = "text") => {
          if (!shikiPromise) {
            shikiPromise = import("shiki").then(({ createHighlighter }) =>
              createHighlighter({
                themes: ["vitesse-dark"],
                langs: [
                  "javascript",
                  "typescript",
                  "svelte",
                  "css",
                  "html",
                  "bash",
                  "json",
                  "markdown",
                  "python",
                  "yaml",
                  "go",
                  "text",
                  "python",
                  "java",
                  "docker",
                ],
              }),
            );
          }

          const highlighter = await shikiPromise;

          // Fallback to text if language isn't loaded to prevent build crashes
          const loadedLangs = highlighter.getLoadedLanguages();
          const renderLang = loadedLangs.includes(lang) ? lang : "text";

          const html = highlighter.codeToHtml(code, {
            lang: renderLang,
            theme: "vitesse-dark",
          });
          return `{@html \`${html.replace(/`/g, "\\`").replace(/\${/g, "\\${")}\` }`;
        },
      },

      // Adds IDs to headings, and anchor links to those IDs. Note: must stay in this order to work.
      rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
    }),
  ],
};

export default config;
