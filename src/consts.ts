import type { IconMap, Site, SocialLink } from "@/types";

export const SITE: Site = {
	title: "astro-erudite",
	description:
		"astro-erudite is a opinionated, unstyled blogging template—built with Astro, Tailwind, and shadcn/ui.",
	href: "https://astro-erudite.vercel.app",
	author: "plat",
	locale: "ja-JP",
	featuredPostCount: 10,
	postsPerPage: 10,
};

export const NAV_LINKS: SocialLink[] = [
	{
		href: "/blog",
		label: "blog",
	},
	{
		href: "/authors",
		label: "authors",
	},
	{
		href: "/about",
		label: "about",
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
];

export const ICON_MAP: IconMap = {
	Website: "lucide:globe",
	GitHub: "lucide:github",
	LinkedIn: "lucide:linkedin",
	Twitter: "lucide:twitter",
	Bluesky: "tabler:brand-bluesky",
	Email: "lucide:mail",
	RSS: "lucide:rss",
};
