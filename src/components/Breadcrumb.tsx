import Link from "next/link";

interface BreadcrumbProps {
  category: string | null;
  pageTitle: string;
}

export default function Breadcrumb({ category, pageTitle }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-6">
      <Link href="/" className="hover:text-blue-600">
        홈
      </Link>
      {category && (
        <>
          <span>›</span>
          <span>{category}</span>
        </>
      )}
      <span>›</span>
      <span className="text-gray-900 font-medium truncate">{pageTitle}</span>
    </nav>
  );
}
