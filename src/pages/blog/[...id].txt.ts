import type { APIContext, APIRoute } from "astro";
import {
  getAllPostsAndSubposts,
  licenseSchema,
  licenseToName,
  type License,
} from "@/lib/data-utils";
import { SITE } from "@/consts";

export async function getStaticPaths() {
  const posts = await getAllPostsAndSubposts();
  return posts.map((post) => ({
    params: { id: post.id },
    props: post,
  }));
}

const postToMarkdown = (license: License, body: string) => {
  const licenseName = licenseToName(license);
  const text = `License: ${licenseName}

${body}`;
  return text;
};

export const GET: APIRoute = async (context: APIContext) => {
  const post = context.props;

  const { body } = post;

  const license = licenseSchema
    .default(SITE.defaultLicense)
    .parse(post.data.license);

  const txt = postToMarkdown(license, body);

  return new Response(txt, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
};
