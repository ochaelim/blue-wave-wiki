import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import SearchDialog from "@/components/SearchDialog";
import { getSidebarData } from "@/lib/wiki";
import { buildSearchIndex } from "@/lib/search";

export const metadata: Metadata = {
  title: "Blue Wave Dive — 수중촬영 위키",
  description: "다이빙 강사를 위한 수중 촬영 지식 베이스",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sidebarData = getSidebarData();
  const searchIndex = buildSearchIndex();

  return (
    <html lang="ko">
      <body className="bg-white text-gray-900">
        <div className="flex min-h-screen">
          <Sidebar data={sidebarData} />
          <div className="flex-1 min-w-0">{children}</div>
        </div>
        <SearchDialog index={searchIndex} />
      </body>
    </html>
  );
}
