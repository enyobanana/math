"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus, Sparkles, CheckCircle2, ArrowRight, Binary, LineChart, BookMarked, Bot, CircleDot } from "lucide-react";

/**
 * 메인 페이지 컴포넌트 (Hero Section 및 뼈대 카드)
 * - 애플(Apple) 감성의 넓은 여백과 부드러운 라운딩 적용
 * - AI 수학 챗봇 (OpenAI 연동), 원의 방정식, 학생 독서기록장, 에라토스테네스의 체, 이차함수 그래프 진입 버튼 포함
 */
export default function HomePage() {
  const [clickCount, setClickCount] = useState<number>(0);

  return (
    <div className="relative overflow-hidden py-12 md:py-24">
      {/* 배경 장식용 은은한 블루 앤 피치 그라데이션 글로우 */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-blue-100/60 via-indigo-50/40 to-sky-100/50 blur-3xl" />

      <div className="mx-auto max-w-5xl px-6 md:px-8">
        
        {/* =========================================================================
            1. Hero Section (영웅 섹션)
            ========================================================================= */}
        <section className="flex flex-col items-center text-center">
          
          {/* 배지 (Subtle Pill Badge) */}
          <Link
            href="/math-chat"
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200/60 bg-blue-50/80 px-4 py-1.5 backdrop-blur-md transition-all hover:bg-blue-100/60 active:scale-95"
          >
            <Sparkles className="h-4 w-4 text-blue-600" />
            <span className="text-xs font-semibold tracking-wide text-blue-700">
              🤖 OpenAI 연동: 학생용 AI 수학 챗봇 오픈!
            </span>
          </Link>

          {/* 환영 헤드라인 */}
          <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl md:leading-[1.15]">
            환영합니다. <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 bg-clip-text text-transparent">
              수학과 AI 학습을 담은
            </span>{" "}
            himath
          </h1>

          {/* 설명 문구 */}
          <p className="mt-6 max-w-2xl text-base font-normal leading-relaxed text-slate-600 md:text-lg">
            AI 수학 선생님과의 1:1 대화, 원의 방정식 시각화, 학생 독서기록장, 에라토스테네스의 체, 이차함수 그래프 시뮬레이션을 한 곳에서 체험해 보세요!
          </p>

          {/* 메인 버튼 액션 구역 */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            
            {/* [메인 진입 버튼 1] AI 수학 챗봇 (OpenAI) */}
            <Link
              href="/math-chat"
              className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-blue-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-500 hover:shadow-blue-500/35 active:scale-95"
            >
              <Bot className="h-5 w-5 text-blue-200 transition-transform group-hover:scale-110" />
              <span>AI 수학 챗봇 물어보기</span>
              <ArrowRight className="h-4 w-4 text-blue-200 transition-transform group-hover:translate-x-1" />
            </Link>

            {/* [메인 진입 버튼 2] 원의 방정식 */}
            <Link
              href="/circle"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-6 py-3.5 text-sm font-semibold text-blue-700 shadow-sm backdrop-blur-sm transition-all hover:bg-blue-100 hover:shadow-md active:scale-95"
            >
              <CircleDot className="h-4 w-4 text-blue-600" />
              <span>원의 방정식</span>
            </Link>

            {/* [메인 진입 버튼 3] 학생 독서기록장 */}
            <Link
              href="/reading-log"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white/90 px-6 py-3.5 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:text-blue-600 hover:shadow-md active:scale-95"
            >
              <BookMarked className="h-4 w-4 text-blue-600" />
              <span>학생 독서기록장</span>
            </Link>

            {/* [메인 진입 버튼 4] 이차함수 그래프 */}
            <Link
              href="/quadratic"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white/60 px-5 py-3.5 text-sm font-semibold text-slate-600 shadow-xs backdrop-blur-sm transition-all hover:bg-white hover:text-blue-600"
            >
              <LineChart className="h-4 w-4 text-blue-600" />
              <span>이차함수 그래프</span>
            </Link>
          </div>

          {/* Placeholder 버튼 클릭 테스트 결과 안내 */}
          {clickCount > 0 && (
            <div className="mt-6 animate-fade-in rounded-2xl border border-blue-100 bg-blue-50/50 px-5 py-3 text-xs font-medium text-blue-800 shadow-sm">
              ✨ placeholder 버튼을 <span className="font-bold text-blue-600">{clickCount}회</span> 클릭하셨습니다! 이 자리에 새로운 기능을 계속 추가할 수 있습니다.
            </div>
          )}
        </section>


        {/* =========================================================================
            2. 특징 및 확장성 안내 카드
            ========================================================================= */}
        <section className="mt-20 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          
          {/* 카드 1: 원의 방정식 시각화 */}
          <Link
            href="/circle"
            className="group rounded-3xl border border-blue-200/80 bg-white/90 p-8 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl"
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm shadow-blue-500/20 transition-transform group-hover:scale-110">
              <CircleDot className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">원의 방정식 🔴</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              중심 좌표 $(h, k)$와 반지름 $r$에 따른 원의 방정식 $(x-h)^2 + (y-k)^2 = r^2$과 둘레/넓이/절편을 좌표평면에 실시간 시각화합니다.
            </p>
          </Link>

          {/* 카드 2: AI 수학 챗봇 */}
          <Link
            href="/math-chat"
            className="group rounded-3xl border border-gray-200/70 bg-white/80 p-8 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-gray-300 hover:shadow-xl"
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
              <Bot className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">AI 수학 챗봇 🤖</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              환경변수 `openai_api_key` 기반의 AI 수학 선생님이 학생들의 수학 질문에 풀이 과정을 단계별로 친절하게 설명합니다.
            </p>
          </Link>

          {/* 카드 3: 이차함수 그래프 실험실 */}
          <Link
            href="/quadratic"
            className="group rounded-3xl border border-gray-200/70 bg-white/80 p-8 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-gray-300 hover:shadow-xl"
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 transition-colors group-hover:bg-sky-600 group-hover:text-white">
              <LineChart className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">이차함수 그래프 📈</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              꼭짓점 $(p, q)$, 판별식 $D$, 축의 방정식과 $x, y$절편을 실시간 시각화합니다.
            </p>
          </Link>

          {/* 카드 4: 독서기록장 (Supabase) */}
          <Link
            href="/reading-log"
            className="group rounded-3xl border border-gray-200/70 bg-white/80 p-8 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-gray-300 hover:shadow-xl"
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 transition-colors group-hover:bg-slate-700 group-hover:text-white">
              <BookMarked className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">학생 독서기록장 📚</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              학번, 이름, 날짜, 책이름, 저자, 새롭게 알게된 점을 기록하고 Supabase DB에 영구 저장합니다.
            </p>
          </Link>

          {/* 카드 5: 에라토스테네스의 체 실험 */}
          <Link
            href="/sieve"
            className="group rounded-3xl border border-gray-200/70 bg-white/80 p-8 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-gray-300 hover:shadow-xl"
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
              <Binary className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">에라토스테네스의 체 🧪</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              소수를 찾는 과정을 숫자가 지워지는 애니메이션과 단계별 카드로 시각화합니다.
            </p>
          </Link>

        </section>

      </div>
    </div>
  );
}

