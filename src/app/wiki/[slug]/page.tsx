import { getAllSlugs, getPageBySlug, getCategoryForSlug } from "@/lib/wiki";
import { renderMarkdown } from "@/lib/markdown";
import WikiContent from "@/components/WikiContent";
import Breadcrumb from "@/components/Breadcrumb";
import TableOfContents from "@/components/TableOfContents";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getPageBySlug(decodeURIComponent(slug));
  return {
    title: `${page.title} — Blue Wave Dive`,
    description: page.description,
  };
}

export default async function WikiPage({ params }: PageProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const page = getPageBySlug(decodedSlug);
  const allSlugs = getAllSlugs();
  const html = await renderMarkdown(page.content, allSlugs);
  const category = getCategoryForSlug(decodedSlug);

  return (
    <div className="flex">
      <main className="flex-1 min-w-0 max-w-4xl px-6 py-8">
        <Breadcrumb category={category} pageTitle={page.title} />

        <div className="mb-2">
          {category && (
            <span className="inline-block text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded mb-3">
              {category}
            </span>
          )}
          <h1 className="text-3xl font-bold">{page.title}</h1>
          <p className="text-sm text-gray-500 mt-1">
            TG-6 / TG-7 기준 · 읽는 시간 약{" "}
            {Math.max(1, Math.ceil(page.content.length / 1500))}분
          </p>
        </div>

        <div className="mt-8">
          <WikiContent html={html} />
        </div>
      </main>

      <TableOfContents headings={page.headings} />
    </div>
  );
}
