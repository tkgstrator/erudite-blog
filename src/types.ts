import type { License } from "./lib/data-utils";

export type Site = {
  title: string;
  description: string;
  href: string;
  author: string;
  locale: string;
  featuredPostCount: number;
  postsPerPage: number;
  defaultLicense: License;
};

export type SocialLink = {
  href: string;
  label: string;
};

export type IconMap = {
  [key: string]: string;
};
