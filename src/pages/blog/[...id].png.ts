import type { APIContext, APIRoute } from "astro";
import { getAllPostsAndSubposts } from "@/lib/data-utils";
import type { CollectionEntry } from "astro:content";
import { BlogOgImage } from "@/lib/og-image";

export async function getStaticPaths() {
  const posts = await getAllPostsAndSubposts();
  return posts.map((post) => ({
    params: { id: post.id },
    props: post,
  }));
}

export const GET: APIRoute<CollectionEntry<"blog">> = async (
  context: APIContext<CollectionEntry<"blog">>,
) => {
  const post = context.props;

  return BlogOgImage(post);
};
