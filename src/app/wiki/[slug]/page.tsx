import { getAllSlugs, getPageBySlug } from "@/lib/wiki";
import { renderMarkdown } from "@/lib/markdown";
import WikiContent from "@/components/WikiContent";
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

  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-2">{page.title}</h1>
      <p className="text-sm text-gray-500 mb-8">
        TG-6 / TG-7 기준 · 읽는 시간 약 {Math.max(1, Math.ceil(page.content.length / 1500))}분
      </p>
      <WikiContent html={html} />
    </main>
  );
}
