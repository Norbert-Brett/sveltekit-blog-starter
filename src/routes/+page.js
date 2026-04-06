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
    error(500, err);
  }
};
