import type { IconMap, Site, SocialLink } from '@/types'

export const SITE: Site = {
  author: 'tkgstrator',
  description:
    'Exploring the depths of technology with an underground perspective—built with Astro, TailwindCSS, and Shadcn.',
  featuredPostCount: 5,
  href: 'https://blog.tkgstrator.work',
  locale: 'en-US',
  postsPerPage: 10,
  title: 'Under+Ground'
}

export const NAV_LINKS: SocialLink[] = [
  {
    href: '/blog',
    label: 'blog'
  },
  {
    href: '/authors',
    label: 'authors'
  },
  {
    href: '/about',
    label: 'about'
  }
]

export const SOCIAL_LINKS: SocialLink[] = [
  {
    href: 'https://github.com/tkgstrator',
    label: 'GitHub'
  },
  {
    href: 'https://twitter.com/tkgling',
    label: 'Twitter'
  },
  {
    href: 'mailto:tkgstrator@qleap.jp',
    label: 'Email'
  }
  // {
  //   href: '/rss.xml',
  //   label: 'RSS'
  // }
]

export const ICON_MAP: IconMap = {
  Email: 'lucide:mail',
  GitHub: 'lucide:github',
  LinkedIn: 'lucide:linkedin',
  RSS: 'lucide:rss',
  Twitter: 'lucide:twitter',
  Website: 'lucide:globe'
}
