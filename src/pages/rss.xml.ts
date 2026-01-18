import rss from '@astrojs/rss'
import type { APIContext } from 'astro'
import { SITE } from '@/consts'
import { getAllPosts } from '@/lib/data-utils'

export async function GET(context: APIContext) {
  try {
    const posts = await getAllPosts()

    return rss({
      description: SITE.description,
      items: posts.map((post) => ({
        description: post.data.description,
        link: `/blog/${post.id}/`,
        pubDate: post.data.date,
        title: post.data.title
      })),
      site: context.site ?? SITE.href,
      title: SITE.title
    })
  } catch (error) {
    console.error('Error generating RSS feed:', error)
    return new Response('Error generating RSS feed', { status: 500 })
  }
}
