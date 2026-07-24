"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus, Sparkles, Layers, Zap, CheckCircle2, ArrowRight, Binary } from "lucide-react";

/**
 * 메인 페이지 컴포넌트 (Hero Section 및 뼈대 카드)
 * - 애플(Apple) 감성의 넓은 여백과 부드러운 라운딩 적용
 * - 에라토스테네스의 체 실험실 진입 버튼 포함
 */
export default function HomePage() {
  // 가짜(Placeholder) 기능 버튼 클릭 시 동작을 시연하기 위한 로컬 상태
  const [clickCount, setClickCount] = useState<number>(0);

  const handlePlaceholderClick = () => {
    setClickCount((prev) => prev + 1);
  };

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
            href="/sieve"
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200/60 bg-blue-50/80 px-4 py-1.5 backdrop-blur-md transition-all hover:bg-blue-100/60 active:scale-95"
          >
            <Sparkles className="h-4 w-4 text-blue-600" />
            <span className="text-xs font-semibold tracking-wide text-blue-700">
              🧪 새로운 기능: 에라토스테네스의 체 실험실 추가됨
            </span>
          </Link>

          {/* 환영 헤드라인 */}
          <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl md:leading-[1.15]">
            환영합니다. <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 bg-clip-text text-transparent">
              수학 수업을 한 단계 높이는
            </span>{" "}
            himath
          </h1>

          {/* 설명 문구 */}
          <p className="mt-6 max-w-2xl text-base font-normal leading-relaxed text-slate-600 md:text-lg">
            Vercel 배포 준비가 완료된 깔끔하고 미니멀한 수학 교육 서비스입니다.
            에라토스테네스의 체 소수 구하기 시뮬레이터를 지금 바로 실험해 보세요!
          </p>

          {/* 메인 버튼 액션 구역 */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            
            {/* [메인 진입 버튼] 에라토스테네스의 체 실험실 */}
            <Link
              href="/sieve"
              className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-blue-600 px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-500 hover:shadow-blue-500/35 active:scale-95"
            >
              <Binary className="h-5 w-5 text-blue-200 transition-transform group-hover:scale-110" />
              <span>에라토스테네스의 체 실험하기</span>
              <ArrowRight className="h-4 w-4 text-blue-200 transition-transform group-hover:translate-x-1" />
            </Link>

            {/* [요구사항] 기능 추가를 위한 가짜(Placeholder) 버튼 */}
            <button
              type="button"
              onClick={handlePlaceholderClick}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white/80 px-6 py-3.5 text-sm font-medium text-slate-700 shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:text-slate-900 hover:shadow-md active:scale-95"
            >
              <Plus className="h-4 w-4 text-slate-500" />
              <span>추가 기능 (Placeholder)</span>
            </button>
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
          
          {/* 카드 1: 에라토스테네스의 체 실험 */}
          <Link
            href="/sieve"
            className="group rounded-3xl border border-blue-200/80 bg-white/90 p-8 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl"
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm shadow-blue-500/20 transition-transform group-hover:scale-110">
              <Binary className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">에라토스테네스의 체 🧪</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              소수를 찾는 과정을 숫자가 지워지는 애니메이션과 단계별 카드로 생생하게 시각화합니다.
            </p>
          </Link>

          {/* 카드 2: Vercel 배포 안정성 */}
          <div className="group rounded-3xl border border-gray-200/70 bg-white/80 p-8 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-gray-300 hover:shadow-xl">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Vercel 배포 100% 검증</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              엄격한 TypeScript 타입 지정으로 빌드 실패 없는 안정적인 서비스 배포를 보장합니다.
            </p>
          </div>

          {/* 카드 3: 애플 감성 UI */}
          <div className="group rounded-3xl border border-gray-200/70 bg-white/80 p-8 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-gray-300 hover:shadow-xl sm:col-span-2 lg:col-span-1">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 transition-colors group-hover:bg-sky-600 group-hover:text-white">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">모던 애플 디자인</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              넓은 여백, 라운딩 카드, 반응형 인터페이스로 스마트폰과 PC 어디서나 완벽하게 동작합니다.
            </p>
          </div>

        </section>

      </div>
    </div>
  );
}
