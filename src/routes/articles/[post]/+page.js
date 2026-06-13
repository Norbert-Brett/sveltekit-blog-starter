import { error } from "@sveltejs/kit";
import fetchPosts from "$lib/assets/js/fetchPosts";

export const load = async ({ params }) => {
  try {
    const post = await import(`../../../lib/posts/${params.post}.md`);
    const { posts } = await fetchPosts({ limit: -1 });

    const index = posts.findIndex((p) => p.slug === params.post);
    const prev = index > 0 ? posts[index - 1] : null;
    const next = index < posts.length - 1 ? posts[index + 1] : null;
    const current = index !== -1 ? posts[index] : null;

    return {
      PostContent: post.default,
      meta: {
        ...post.metadata,
        slug: params.post,
        readingTime: current?.readingTime || 5,
      },
      prev,
      next,
    };
  } catch (err) {
    console.error("Post page load error:", err);
    error(404, "Post not found");
  }
};
