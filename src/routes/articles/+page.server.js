export const load = async ({ url, fetch }) => {
  const postRes = await fetch(`${url.origin}/api/posts.json?limit=-1`);
  const posts = await postRes.json();

  return { posts, total: posts.length };
};
