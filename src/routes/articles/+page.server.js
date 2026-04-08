import fetchPosts from "$lib/assets/js/fetchPosts";
import { error } from "@sveltejs/kit";

export const load = async () => {
  try {
    const { posts } = await fetchPosts({ limit: -1 });
    return { posts, total: posts.length };
  } catch (err) {
    console.error("Error fetching posts:", err);
    error(500, "Could not fetch posts");
  }
};
