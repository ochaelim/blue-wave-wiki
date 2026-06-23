import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Blue Wave Dive — 수중촬영 위키",
  description: "다이빙 강사를 위한 수중 촬영 지식 베이스",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="bg-white text-gray-900">{children}</body>
    </html>
  );
}
