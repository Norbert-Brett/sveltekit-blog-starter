// IMPORTANT: update all these property values in src/lib/config.js
import { siteTitle, siteDescription, siteURL, siteLink } from "$lib/config";
import fetchPosts from "$lib/assets/js/fetchPosts";

export const prerender = true;

export const GET = async () => {
  // Use optimized utility instead of duplicate glob-and-sort logic
  const { posts } = await fetchPosts({ limit: -1 });

  const body = render(posts);
  const headers = {
    "Cache-Control": `max-age=0, s-max-age=${600}`,
    "Content-Type": "application/xml",
  };
  return new Response(body, {
    status: 200,
    headers,
  });
};

//Be sure to review and replace any applicable content below!
const render = (posts) => `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>${siteTitle}</title>
<description>${siteDescription}</description>
<link>${siteLink}</link>
<atom:link href="https://${siteURL}/api/rss.xml" rel="self" type="application/rss+xml"/>
${posts
  .map(
    (post) => `<item>
<guid isPermaLink="true">https://${siteURL}/articles/${post.slug}</guid>
<title>${post.title}</title>
<link>https://${siteURL}/articles/${post.slug}</link>
<description>${post.excerpt}</description>
<pubDate>${new Date(post.date).toUTCString()}</pubDate>
</item>`,
  )
  .join("")}
</channel>
</rss>
`;
