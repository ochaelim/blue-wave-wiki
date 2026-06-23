export default function WikiContent({ html }: { html: string }) {
  return (
    <article
      className="prose prose-blue max-w-none
        prose-headings:scroll-mt-20
        prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
        prose-table:text-sm
        prose-img:rounded-lg prose-img:shadow-md"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
