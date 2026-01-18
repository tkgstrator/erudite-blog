import type { APIContext, APIRoute } from 'astro'
import { SITE } from '@/consts'
import { CommonOgImage } from '@/lib/og-image'

export const GET: APIRoute = async (_context: APIContext) => {
  return CommonOgImage(SITE.title, SITE.description)
}
