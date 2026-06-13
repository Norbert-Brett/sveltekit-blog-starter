import { postsPerPage } from "$lib/config";

// Cache for all posts to avoid repeated disk I/O and sorting overhead
let postsCache = null;

const getAllPosts = async () => {
  if (postsCache) return postsCache;

  postsCache = (async () => {
    const postsMetadata = import.meta.glob("/src/lib/posts/*.md");
    const postsRaw = import.meta.glob("/src/lib/posts/*.md", { query: "?raw", import: "default" });

    const posts = await Promise.all(
      Object.entries(postsMetadata).map(async ([path, resolver]) => {
        const { metadata } = await resolver();
        const slug = path.split("/").pop().slice(0, -3);

        let readingTime = 5; // Default fallback
        const rawResolver = postsRaw[path];
        if (rawResolver) {
          try {
            const rawContent = await rawResolver();
            // Remove frontmatter
            const body = rawContent.replace(/^---[\s\S]+?---/, "");
            // Strip HTML elements if present
            const cleanText = body.replace(/<[^>]*>/g, "");
            const words = cleanText.trim().split(/\s+/).filter(Boolean).length;
            // Assume 200 words per minute reading speed
            readingTime = Math.max(1, Math.ceil(words / 200));
          } catch (e) {
            console.error(`Failed to calculate reading time for ${path}:`, e);
          }
        }

        return {
          title: metadata.title,
          slug,
          excerpt: metadata.excerpt,
          coverImage: metadata.coverImage,
          coverWidth: metadata.coverWidth,
          coverHeight: metadata.coverHeight,
          date: metadata.date,
          categories: metadata.categories || [],
          readingTime,
        };
      }),
    );

    return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
  })();

  return postsCache;
};

/**
 * Fetches and filters posts with pagination support.
 * Optimized with module-level caching for performance.
 */
const fetchPosts = async ({ offset = 0, limit = postsPerPage, category = "" } = {}) => {
  const allPosts = await getAllPosts();

  let sortedPosts = allPosts;

  if (category) {
    sortedPosts = sortedPosts.filter((post) => post.categories.includes(category));
  }

  if (offset) {
    sortedPosts = sortedPosts.slice(offset);
  }

  if (limit && limit < sortedPosts.length && limit != -1) {
    sortedPosts = sortedPosts.slice(0, limit);
  }

  return {
    posts: sortedPosts,
  };
};

export default fetchPosts;
