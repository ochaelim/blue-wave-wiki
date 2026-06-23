"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface SidebarItem {
  slug: string;
  title: string;
  description: string;
}

interface SidebarCategory {
  category: string;
  items: SidebarItem[];
}

const CATEGORY_ICONS: Record<string, string> = {
  "카메라 장비": "📷",
  "카메라 세팅": "⚙️",
  "조명": "💡",
  "촬영 기법": "🎯",
  "후보정": "🎨",
  "운용 팁": "🔧",
};

export default function Sidebar({ data }: { data: SidebarCategory[] }) {
  const pathname = usePathname();
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
    () => {
      const map: Record<string, boolean> = {};
      data.forEach((cat) => {
        map[cat.category] = true;
      });
      return map;
    }
  );
  const [mobileOpen, setMobileOpen] = useState(false);

  function toggleCategory(cat: string) {
    setOpenCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
  }

  const sidebarContent = (
    <nav className="p-4">
      <Link
        href="/"
        className="flex items-center gap-2 mb-6 px-2"
        onClick={() => setMobileOpen(false)}
      >
        <span className="text-2xl">🌊</span>
        <div>
          <div className="font-bold text-blue-700 text-sm">Blue Wave Dive</div>
          <div className="text-xs text-gray-500">수중촬영 위키</div>
        </div>
      </Link>

      <button
        onClick={() => {
          setMobileOpen(false);
          document.dispatchEvent(
            new KeyboardEvent("keydown", { key: "k", ctrlKey: true })
          );
        }}
        className="flex items-center gap-2 w-full mx-2 mb-4 px-3 py-2 text-sm text-gray-500 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span>검색...</span>
        <kbd className="ml-auto text-xs text-gray-400 border border-gray-200 rounded px-1 py-0.5">⌘K</kbd>
      </button>

      {data.map((cat) => (
        <div key={cat.category} className="mb-2">
          <button
            onClick={() => toggleCategory(cat.category)}
            className="flex items-center gap-2 w-full px-2 py-1.5 text-sm font-semibold text-gray-600 hover:text-gray-900 rounded"
          >
            <span>{CATEGORY_ICONS[cat.category] || "📁"}</span>
            <span>{cat.category}</span>
            <span className="ml-auto text-xs text-gray-400">
              {openCategories[cat.category] ? "▾" : "▸"}
            </span>
          </button>

          {openCategories[cat.category] && (
            <ul className="ml-4 mt-1 space-y-0.5">
              {cat.items.map((item) => {
                const href = `/wiki/${encodeURIComponent(item.slug)}`;
                const isActive = decodeURIComponent(pathname) === `/wiki/${item.slug}`;
                return (
                  <li key={item.slug}>
                    <Link
                      href={href}
                      onClick={() => setMobileOpen(false)}
                      className={`block px-3 py-1.5 text-sm rounded transition-colors ${
                        isActive
                          ? "bg-blue-50 text-blue-700 font-medium"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {item.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      ))}
    </nav>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md border border-gray-200"
        aria-label="메뉴 열기"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {mobileOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/30 z-30"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 overflow-y-auto z-40
          transition-transform duration-200
          lg:translate-x-0 lg:static lg:z-auto
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
