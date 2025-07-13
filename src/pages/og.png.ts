import type { APIContext, APIRoute } from "astro";
import { CommonOgImage } from "@/lib/og-image";
import { SITE } from "@/consts";

export const GET: APIRoute = async (_context: APIContext) => {
  return CommonOgImage(SITE.title, SITE.description);
};
