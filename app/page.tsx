"use client";

import React, { useState } from "react";
import { Plus, Sparkles, Layers, Zap, CheckCircle2, ArrowRight } from "lucide-react";

/**
 * 메인 페이지 컴포넌트 (Hero Section 및 뼈대 카드)
 * - 애플(Apple) 감성의 넓은 여백과 부드러운 라운딩 적용
 * - 코딩 초보자 선생님들도 쉽게 수정/추가할 수 있도록 주석이 포함되어 있습니다.
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
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200/60 bg-blue-50/80 px-4 py-1.5 backdrop-blur-md transition-all hover:bg-blue-100/60">
            <Sparkles className="h-4 w-4 text-blue-600" />
            <span className="text-xs font-semibold tracking-wide text-blue-700">
              himath 교육용 플랫폼 뼈대 준비 완료
            </span>
          </div>

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
            Vercel 배포 준비가 완료된 가장 깔끔하고 미니멀한 웹 서비스 보일러플레이트입니다.
            선생님들과 개발자들이 자유롭게 나만의 수학 교육 기능을 추가해 보세요.
          </p>

          {/* 메인 버튼 액션 구역 */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            
            {/* [요구사항] 기능 추가를 위한 가짜(Placeholder) 버튼 1개 */}
            <button
              type="button"
              onClick={handlePlaceholderClick}
              className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-blue-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-500 hover:shadow-blue-500/35 active:scale-95"
            >
              <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
              <span>새로운 기능 추가 (Placeholder)</span>
            </button>

            {/* 참고용 가이드 링크 버튼 */}
            <a
              href="https://vercel.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white/80 px-6 py-3.5 text-sm font-medium text-slate-700 shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:text-slate-900 hover:shadow-md"
            >
              <span>Vercel 배포 안내</span>
              <ArrowRight className="h-4 w-4 text-slate-400" />
            </a>
          </div>

          {/* Placeholder 버튼 클릭 테스트 결과 안내 (선생님들을 위한 안내 메시지) */}
          {clickCount > 0 && (
            <div className="mt-6 animate-fade-in rounded-2xl border border-blue-100 bg-blue-50/50 px-5 py-3 text-xs font-medium text-blue-800 shadow-sm">
              ✨ placeholder 버튼을 <span className="font-bold text-blue-600">{clickCount}회</span> 클릭하셨습니다! 이 자리에 새로운 이벤트나 모달 창을 연결할 수 있습니다.
            </div>
          )}
        </section>


        {/* =========================================================================
            2. 특징 및 확장성 안내 카드 (Apple 스타일 미니멀 카드 3종)
            ========================================================================= */}
        <section className="mt-20 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          
          {/* 카드 1: Vercel 안정성 */}
          <div className="group rounded-3xl border border-gray-200/70 bg-white/80 p-8 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-gray-300 hover:shadow-xl">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Vercel 배포 원클릭</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              엄격한 TypeScript 설정 및 사용하지 않는 코드 제거로 빌드 실패 없이 Vercel에 즉시 연결할 수 있습니다.
            </p>
          </div>

          {/* 카드 2: 애플 감성 디자인 */}
          <div className="group rounded-3xl border border-gray-200/70 bg-white/80 p-8 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-gray-300 hover:shadow-xl">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">모던 애플 감성 UI</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              넓은 여백, 둥근 모서리(`rounded-3xl`), 세련된 유리 효과(Glassmorphism)가 극단적으로 적용되어 있습니다.
            </p>
          </div>

          {/* 카드 3: 초보자도 쉬운 코드 구조 */}
          <div className="group rounded-3xl border border-gray-200/70 bg-white/80 p-8 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-gray-300 hover:shadow-xl sm:col-span-2 lg:col-span-1">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 transition-colors group-hover:bg-sky-600 group-hover:text-white">
              <Layers className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">자유로운 기능 확장</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              선생님들이 필요에 따라 수학 퀴즈, 타이머, 문제 은행 기능 등을 손쉽게 추가할 수 있도록 친절한 주석이 달려 있습니다.
            </p>
          </div>

        </section>

      </div>
    </div>
  );
}
