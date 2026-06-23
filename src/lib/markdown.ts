import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";

function convertWikiLinks(markdown: string, existingSlugs: string[]): string {
  return markdown.replace(
    /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g,
    (_match, target: string, display?: string) => {
      const slug = target.trim();
      const text = display?.trim() || slug.replace(/-/g, " ");
      const exists = existingSlugs.includes(slug);
      if (exists) {
        return `<a href="/wiki/${encodeURIComponent(slug)}" class="wiki-link">${text}</a>`;
      }
      return `<a href="/wiki/${encodeURIComponent(slug)}" class="wiki-link wiki-link-missing">${text}</a>`;
    }
  );
}

function styleSourceSection(html: string): string {
  return html.replace(
    /(<h2[^>]*id="출처"[^>]*>.*?<\/h2>)([\s\S]*?)(?=<h[12]|$)/gi,
    (_match, heading: string, body: string) => {
      return `<div class="source-section">${heading}${body}</div>`;
    }
  );
}

export async function renderMarkdown(
  content: string,
  existingSlugs: string[]
): Promise<string> {
  const withLinks = convertWikiLinks(content, existingSlugs);

  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSlug)
    .use(rehypeStringify)
    .process(withLinks);

  return styleSourceSection(String(result));
}
