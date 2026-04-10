import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";

/** @type {import('vite').UserConfig} */
export default {
  staged: {
    "*": "vp check --fix",
  },
  plugins: [tailwindcss(), sveltekit()],
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("gsap")) return "vendor-gsap";
            if (id.includes("three")) return "vendor-three";
            if (id.includes("shiki")) return "vendor-shiki";
            if (id.includes("lucide") || id.includes("svelte-meta-tags") || id.includes("bits-ui"))
              return "vendor-ui";
          }
        },
      },
    },
  },
  server: {
    fs: {
      allow: ["."],
    },
  },
};
