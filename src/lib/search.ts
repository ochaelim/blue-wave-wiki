import { getAllSlugs, getPageBySlug } from "./wiki";

export interface SearchEntry {
  slug: string;
  title: string;
  description: string;
  content: string;
}

export function buildSearchIndex(): SearchEntry[] {
  const slugs = getAllSlugs();
  return slugs.map((slug) => {
    const page = getPageBySlug(slug);
    const plainContent = page.content
      .replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_m, _t, d) => d || _t)
      .replace(/[#*>\-|`~]/g, "")
      .replace(/\n+/g, " ")
      .slice(0, 500);
    return {
      slug,
      title: page.title,
      description: page.description,
      content: plainContent,
    };
  });
}
