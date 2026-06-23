"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Fuse from "fuse.js";

interface SearchEntry {
  slug: string;
  title: string;
  description: string;
  content: string;
}

export default function SearchDialog({ index }: { index: SearchEntry[] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const fuse = new Fuse(index, {
    keys: [
      { name: "title", weight: 3 },
      { name: "description", weight: 2 },
      { name: "content", weight: 1 },
    ],
    threshold: 0.4,
    includeMatches: true,
  });

  const results = query.length > 0 ? fuse.search(query).slice(0, 8) : [];

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    },
    []
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  function navigate(slug: string) {
    setOpen(false);
    router.push(`/wiki/${encodeURIComponent(slug)}`);
  }

  function handleResultKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && results[selectedIndex]) {
      navigate(results[selectedIndex].item.slug);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
      <div className="fixed inset-0 bg-black/30" onClick={() => setOpen(false)} />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden border border-gray-200">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
            onKeyDown={handleResultKeyDown}
            placeholder="검색..."
            className="flex-1 outline-none text-sm"
          />
          <kbd className="text-xs text-gray-400 border border-gray-200 rounded px-1.5 py-0.5">ESC</kbd>
        </div>

        {results.length > 0 && (
          <ul className="max-h-80 overflow-y-auto py-2">
            {results.map((r, i) => (
              <li key={r.item.slug}>
                <button
                  onClick={() => navigate(r.item.slug)}
                  className={`w-full text-left px-4 py-2.5 text-sm ${
                    i === selectedIndex ? "bg-blue-50" : "hover:bg-gray-50"
                  }`}
                >
                  <div className="font-medium text-gray-900">{r.item.title}</div>
                  {r.item.description && (
                    <div className="text-gray-500 text-xs mt-0.5 truncate">
                      {r.item.description}
                    </div>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}

        {query.length > 0 && results.length === 0 && (
          <div className="px-4 py-8 text-center text-sm text-gray-500">
            &ldquo;{query}&rdquo; 검색 결과가 없습니다
          </div>
        )}
      </div>
    </div>
  );
}
