import type { IconMap, Site, SocialLink } from "@/types";

export const SITE: Site = {
  title: "platform",
  description: "plat のひとりごと",
  href: "https://blog.p1at.dev",
  author: "plat",
  locale: "ja-JP",
  featuredPostCount: 10,
  postsPerPage: 10,
  defaultLicense: {
    type: "by",
    version: "4.0",
  },
  linkcard: "https://linkcard.blog.p1at.dev",
  // linkcard: "http://localhost:5173",
};

export const NAV_LINKS: SocialLink[] = [
  {
    href: "/blog",
    label: "blog",
  },
  {
    href: "/tags",
    label: "tags",
  },
  {
    href: "/about",
    label: "about",
  },
  {
    href: "/search",
    label: "search",
  },
];

export const SOCIAL_LINKS: SocialLink[] = [
  {
    href: "https://github.com/p1atdev",
    label: "GitHub",
  },
  {
    href: "https://bsky.app/profile/p1at.dev",
    label: "Bluesky",
  },
  {
    href: "/rss.xml",
    label: "RSS",
  },
  {
    href: "/llms.txt",
    label: "LLM",
  },
];

export const ICON_MAP: IconMap = {
  Website: "lucide:globe",
  GitHub: "lucide:github",
  LinkedIn: "lucide:linkedin",
  Twitter: "lucide:twitter",
  Bluesky: "tabler:brand-bluesky",
  Email: "lucide:mail",
  RSS: "lucide:rss",
  LLM: "lucide:bot",
};
