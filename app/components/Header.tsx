"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BookOpen, Menu, X, Sparkles, Binary, LineChart, BookMarked } from "lucide-react";

/**
 * 상단 헤더 네비게이션 컴포넌트
 * - Glassmorphic (반투명 유리) 디자인 적용: backdrop-blur-md & bg-white/70
 * - 서비스 로고(himath) 및 네비게이션 공간 제공
 */
export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/60 bg-white/70 backdrop-blur-md transition-all">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-8">
        
        {/* 1. 서비스 로고 영역 (himath) */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm shadow-blue-500/20">
            <BookOpen className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-slate-900">
              himath
            </span>
            <span className="text-[10px] font-medium tracking-wider text-blue-600 uppercase">
              Edu Platform
            </span>
          </div>
        </Link>

        {/* 2. PC 네비게이션 바 */}
        <nav className="hidden items-center gap-7 md:flex">
          <Link
            href="/reading-log"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            <BookMarked className="h-4 w-4" />
            독서기록장
          </Link>
          <Link
            href="/quadratic"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-700 transition-colors hover:text-blue-600"
          >
            <LineChart className="h-4 w-4 text-blue-600" />
            이차함수 그래프
          </Link>
          <Link
            href="/sieve"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-700 transition-colors hover:text-blue-600"
          >
            <Binary className="h-4 w-4 text-blue-600" />
            에라토스테네스의 체
          </Link>
        </nav>

        {/* 3. 우측 액션 버튼 */}
        <div className="hidden md:flex md:items-center md:gap-3">
          <Link
            href="/reading-log"
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-slate-800 hover:shadow-md active:scale-95"
          >
            <Sparkles className="h-3.5 w-3.5 text-blue-400" />
            독서기록장 작성
          </Link>
        </div>

        {/* 4. 모바일 메뉴 토글 버튼 */}
        <div className="flex md:hidden">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="rounded-xl p-2 text-slate-600 hover:bg-gray-100 focus:outline-none"
            aria-label="메뉴 열기"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* 모바일 네비게이션 펼침 메뉴 */}
      {isMobileMenuOpen && (
        <div className="border-b border-gray-200/80 bg-white/95 px-6 py-4 backdrop-blur-lg md:hidden">
          <nav className="flex flex-col gap-4">
            <Link
              href="/reading-log"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-bold text-blue-600 hover:text-blue-700"
            >
              📚 독서기록장 (Supabase DB)
            </Link>
            <Link
              href="/quadratic"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-bold text-slate-700 hover:text-blue-600"
            >
              📈 이차함수 그래프
            </Link>
            <Link
              href="/sieve"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-bold text-slate-700 hover:text-blue-600"
            >
              🧪 에라토스테네스의 체
            </Link>
            <Link
              href="/reading-log"
              onClick={() => setIsMobileMenuOpen(false)}
              className="mt-2 w-full rounded-full bg-blue-600 py-3 text-center text-xs font-semibold text-white shadow-sm"
            >
              독서기록장 바로가기
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
