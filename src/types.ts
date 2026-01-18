import type { License } from './lib/data-utils'

export type Site = {
  title: string
  description: string
  href: string
  author: string
  locale: string
  featuredPostCount: number
  postsPerPage: number
  defaultLicense: License
  linkcard: string // linkcard iframe URL
  metadata: {
    keywords: string[]
    og: {
      image: {
        url: string
        alt: string
        width: number
        height: number
      }
      title: string
      description: string
      site_name: string
    }
    twitter: {
      card: 'summary_large_image'
      title: string
      description: string
      image: {
        url: string
        alt: string
        width: number
        height: number
      }
    }
  }
}

export type SocialLink = {
  href: string
  label: string
}

export type IconMap = {
  [key: string]: string
}
