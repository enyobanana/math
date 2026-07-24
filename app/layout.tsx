import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

// Apple 스타일의 모던한 Inter 폰트 설정
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "himath - 스마트 수학 교육 웹 서비스",
  description: "Vercel 배포 준비가 완료된 깔끔하고 세련된 himath 교육용 보일러플레이트",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${inter.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-gray-50 font-sans tracking-tight antialiased selection:bg-blue-100 selection:text-blue-900">
        {/* 상단 헤더 */}
        <Header />
        
        {/* 메인 페이지 콘텐츠 */}
        <main className="flex-1">{children}</main>
        
        {/* 하단 푸터 */}
        <Footer />
      </body>
    </html>
  );
}
