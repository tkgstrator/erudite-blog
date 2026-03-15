import type { CollectionEntry } from 'astro:content'
import type { APIContext, APIRoute } from 'astro'
import { getAllPostsAndSubposts } from '@/lib/data-utils'
import { computeOgHash, getCachedOgImage, saveCachedOgImage } from '@/lib/og-cache'
import { BlogOgImage } from '@/lib/og-image'

export async function getStaticPaths() {
  const posts = await getAllPostsAndSubposts()
  return posts.map((post) => ({
    params: { id: post.id },
    props: post
  }))
}

export const GET: APIRoute<CollectionEntry<'blog'>> = async (context: APIContext<CollectionEntry<'blog'>>) => {
  const post = context.props
  const hash = computeOgHash(post)
  const cached = getCachedOgImage(post.id, hash)

  if (cached) {
    return new Response(cached.buffer as ArrayBuffer, {
      headers: { 'Content-Type': 'image/png' },
      status: 200
    })
  }

  const response = await BlogOgImage(post)
  const arrayBuffer = await response.arrayBuffer()
  const uint8 = new Uint8Array(arrayBuffer)
  saveCachedOgImage(post.id, hash, uint8)

  return new Response(arrayBuffer, {
    headers: { 'Content-Type': 'image/png' },
    status: 200
  })
}
