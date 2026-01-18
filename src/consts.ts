import type { IconMap, Site, SocialLink } from '@/types'

export const SITE: Site = {
  author: 'tkgstrator',
  defaultLicense: {
    type: 'by',
    version: '4.0'
  },
  description: 'えむいーと愉快な仲間たちの平凡な技術ブログ、ニンテンドースイッチハッキングから生成AIまで幅広く扱います',
  featuredPostCount: 10,
  href: 'https://blog.tkgstrator.work',
  linkcard: 'https://linkcard.blog.p1at.dev',
  locale: 'en-US',
  metadata: {
    keywords: ['tkgling', 'tkgstrator'],
    og: {
      description:
        'えむいーと愉快な仲間たちの平凡な技術ブログ、ニンテンドースイッチハッキングから生成AIまで幅広く扱います',
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
      description:
        'えむいーと愉快な仲間たちの平凡な技術ブログ、ニンテンドースイッチハッキングから生成AIまで幅広く扱います',
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
  // linkcard: "http://localhost:5173",
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
    href: '/tags',
    label: 'tags'
  },
  {
    href: '/about',
    label: 'about'
  },
  {
    href: '/search',
    label: 'search'
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
  },
  {
    href: '/rss.xml',
    label: 'RSS'
  },
  {
    href: '/llms.txt',
    label: 'LLM'
  }
]

export const ICON_MAP: IconMap = {
  Bluesky: 'tabler:brand-bluesky',
  Email: 'lucide:mail',
  GitHub: 'lucide:github',
  LinkedIn: 'lucide:linkedin',
  LLM: 'lucide:bot',
  RSS: 'lucide:rss',
  Twitter: 'lucide:twitter',
  Website: 'lucide:globe'
}
