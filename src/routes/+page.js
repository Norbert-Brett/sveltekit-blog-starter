import { error } from "@sveltejs/kit";
import fetchPosts from "$lib/assets/js/fetchPosts";

export const load = async () => {
  try {
    const { posts } = await fetchPosts({ limit: 4 });
    const ReadMeFile = await import("../../README.md");
    const ReadMe = ReadMeFile.default;

    return {
      posts,
      ReadMe,
    };
  } catch (err) {
    console.error("Home page load error:", err);
    error(500, "Internal Server Error");
  }
};
