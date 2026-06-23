import Link from "next/link";
import { getSidebarData } from "@/lib/wiki";

export default function Home() {
  const categories = getSidebarData();

  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-2">수중촬영 위키</h1>
      <p className="text-gray-600 mb-8">
        다이빙 강사를 위한 수중 촬영 지식 베이스. TG-6 / TG-7 기준.
      </p>

      <div className="grid gap-8 md:grid-cols-2">
        {categories.map((cat) => (
          <section key={cat.category}>
            <h2 className="text-lg font-bold text-gray-900 mb-3">
              {cat.category}
            </h2>
            <ul className="space-y-1">
              {cat.items.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/wiki/${encodeURIComponent(item.slug)}`}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    {item.title}
                  </Link>
                  {item.description && (
                    <span className="text-gray-500 text-xs ml-2">
                      — {item.description}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
