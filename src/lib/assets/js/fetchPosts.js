import { postsPerPage } from "$lib/config";

// Cache for all posts to avoid repeated disk I/O and sorting overhead
let postsCache = null;

const getAllPosts = async () => {
  if (postsCache) return postsCache;

  postsCache = (async () => {
    const posts = await Promise.all(
      Object.entries(import.meta.glob("/src/lib/posts/*.md")).map(async ([path, resolver]) => {
        const { metadata } = await resolver();
        const slug = path.split("/").pop().slice(0, -3);
        return {
          title: metadata.title,
          slug,
          excerpt: metadata.excerpt,
          coverImage: metadata.coverImage,
          coverWidth: metadata.coverWidth,
          coverHeight: metadata.coverHeight,
          date: metadata.date,
          categories: metadata.categories || [],
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
