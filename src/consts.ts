import type { IconMap, Site, SocialLink } from '@/types'

export const SITE: Site = {
  author: 'tkgstrator',
  description: 'えむいーと愉快な仲間たち',
  featuredPostCount: 5,
  href: 'https://blog.tkgstrator.work',
  locale: 'en-US',
  metadata: {
    keywords: ['tkgling', 'tkgstrator'],
    og: {
      description: 'えむいーと愉快な仲間たち',
      image: {
        alt: 'Under+Ground',
        height: 630,
        url: '/og_underground.png',
        width: 1200
      },
      site_name: 'Under+Ground',
      title: 'Under+Ground'
    },
    twitter: {
      card: 'summary_large_image',
      description: 'えむいーと愉快な仲間たち',
      image: {
        alt: 'Under+Ground',
        height: 630,
        url: '/og_underground.png',
        width: 1200
      },
      title: 'Under+Ground'
    }
  },
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
