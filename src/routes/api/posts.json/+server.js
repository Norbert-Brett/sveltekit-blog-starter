import { postsPerPage } from "$lib/config";
import fetchPosts from "$lib/assets/js/fetchPosts";
import { json } from "@sveltejs/kit";

export const prerender = true;

export const GET = async ({ url }) => {
  const limit = Number(url.searchParams.get("limit") || postsPerPage);
  const offset = Number(url.searchParams.get("offset") || 0);

  const options = {
    limit,
    offset,
  };

  const { posts } = await fetchPosts(options);
  return json(posts);
};
