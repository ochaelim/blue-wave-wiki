import fs from "fs";
import path from "path";

const contentDir = path.join(process.cwd(), "content");

const EXCLUDED_FILES = ["log.md"];

export function getAllSlugs(): string[] {
  const files = fs.readdirSync(contentDir);
  return files
    .filter((f) => f.endsWith(".md") && !EXCLUDED_FILES.includes(f) && f !== "index.md")
    .map((f) => f.replace(/\.md$/, ""));
}

export function getPageBySlug(slug: string): {
  slug: string;
  title: string;
  content: string;
  headings: { id: string; text: string; level: number }[];
  description: string;
} {
  const filePath = path.join(contentDir, `${slug}.md`);
  const raw = fs.readFileSync(filePath, "utf-8");

  const lines = raw.split("\n");
  const titleLine = lines.find((l) => l.startsWith("# "));
  const title = titleLine ? titleLine.replace(/^# /, "").trim() : slug;

  const descLine = lines.find((l) => l.startsWith("> ") && !l.startsWith("> 출처") && !l.startsWith("> 📎"));
  const description = descLine ? descLine.replace(/^> \*\*.*?\*\*:?\s*/, "").replace(/^> /, "").trim() : "";

  const contentWithoutTitle = lines
    .filter((l) => l !== titleLine)
    .join("\n")
    .trim();

  const headings = extractHeadings(raw);

  return { slug, title, content: contentWithoutTitle, headings, description };
}

export function extractHeadings(
  markdown: string
): { id: string; text: string; level: number }[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const headings: { id: string; text: string; level: number }[] = [];
  let match;
  while ((match = headingRegex.exec(markdown)) !== null) {
    const text = match[2].trim();
    const id = text
      .toLowerCase()
      .replace(/[^\w\s가-힣-]/g, "")
      .replace(/\s+/g, "-");
    headings.push({ id, text, level: match[1].length });
  }
  return headings;
}

export function getSidebarData(): {
  category: string;
  items: { slug: string; title: string; description: string }[];
}[] {
  const indexPath = path.join(contentDir, "index.md");
  const raw = fs.readFileSync(indexPath, "utf-8");
  const lines = raw.split("\n");

  const categories: {
    category: string;
    items: { slug: string; title: string; description: string }[];
  }[] = [];

  let currentCategory: string | null = null;

  for (const line of lines) {
    const catMatch = line.match(/^## (.+)/);
    if (catMatch) {
      currentCategory = catMatch[1].trim();
      categories.push({ category: currentCategory, items: [] });
      continue;
    }

    const itemMatch = line.match(/^- \[\[([^\]|]+)(?:\|[^\]]+)?\]\]\s*—?\s*(.*)/);
    if (itemMatch && currentCategory) {
      const slug = itemMatch[1].trim();
      const description = itemMatch[2]?.trim() || "";
      const displayTitle = slug.replace(/-/g, " ");
      const last = categories[categories.length - 1];
      last.items.push({ slug, title: displayTitle, description });
    }
  }

  return categories;
}

export function getCategoryForSlug(slug: string): string | null {
  const sidebar = getSidebarData();
  for (const cat of sidebar) {
    if (cat.items.some((item) => item.slug === slug)) {
      return cat.category;
    }
  }
  return null;
}
