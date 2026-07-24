"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  ArrowLeft,
  Sparkles,
  Info,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";

// 시뮬레이션 단계 타입 정의
type StepType =
  | { type: "INIT"; message: string }
  | { type: "MARK_ONE"; message: string }
  | { type: "SELECT_PRIME"; p: number; message: string }
  | { type: "ELIMINATE_MULTIPLE"; p: number; multiple: number; message: string }
  | { type: "SQRT_REACHED"; limit: number; message: string }
  | { type: "COMPLETE"; message: string };

// 개별 숫자의 시각적 상태 정의
type NumberStatus =
  | "unmarked"          // 아직 확인하지 않은 수
  | "current-prime"     // 현재 탐색 중인 소수 (강조)
  | "current-multiple"  // 현재 지우고 있는 배수 (강조)
  | "prime"             // 확정된 소수
  | "composite"         // 지워진 합성수
  | "one";              // 1 (소수도 합성수도 아님)

/**
 * 에라토스테네스의 체 시뮬레이터 페이지
 * - Apple 스타일의 깔끔한 디자인과 반응형 그리드
 * - 단계별 진행, 자동 재생, 속도 조절, 수학적 원리 설명 포함
 */
export default function SievePage() {
  // 최댓값 N (기본값 100, 범위 20 ~ 120)
  const [maxNum, setMaxNum] = useState<number>(100);
  // 현재 재생 중인 단계 인덱스
  const [stepIndex, setStepIndex] = useState<number>(0);
  // 자동 재생 여부
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  // 재생 속도 (ms 단위: 100ms ~ 1000ms)
  const [speedMs, setSpeedMs] = useState<number>(400);

  // sqrt(N) 계산
  const sqrtLimit = useMemo(() => Math.floor(Math.sqrt(maxNum)), [maxNum]);

  // N에 따른 전체 시뮬레이션 단계(Steps) 시퀀스 생성 (Pre-computation)
  const steps = useMemo<StepType[]>(() => {
    const generatedSteps: StepType[] = [];
    
    generatedSteps.push({
      type: "INIT",
      message: `1부터 ${maxNum}까지의 숫자가 준비되었습니다. 1은 소수가 아니므로 먼저 제외합니다.`,
    });

    generatedSteps.push({
      type: "MARK_ONE",
      message: "1은 약수가 1개뿐이므로 소수도 합성수도 아닙니다. 지웁니다.",
    });

    const isComposite = new Array(maxNum + 1).fill(false);
    isComposite[1] = true;

    const limit = Math.floor(Math.sqrt(maxNum));

    for (let p = 2; p <= maxNum; p++) {
      if (!isComposite[p]) {
        // 소수 발견
        generatedSteps.push({
          type: "SELECT_PRIME",
          p,
          message: `소수 ${p}을(를) 찾았습니다! ${p}의 배수들을 찾아 지웁니다.`,
        });

        // p가 sqrt(N) 이하인 경우에만 배수를 지움
        if (p <= limit) {
          for (let m = p * p; m <= maxNum; m += p) {
            if (!isComposite[m]) {
              isComposite[m] = true;
              generatedSteps.push({
                type: "ELIMINATE_MULTIPLE",
                p,
                multiple: m,
                message: `${p}의 배수인 ${m}을(를) 지웁니다. (${p} × ${m / p})`,
              });
            }
          }
        }
      }

      // sqrt(N)을 넘는 소수에 도달했을 때 1회 설명 메시지
      if (p === limit) {
        generatedSteps.push({
          type: "SQRT_REACHED",
          limit,
          message: `√${maxNum} = ${limit.toFixed(1)}... 이므로, ${limit} 이하의 소수 배수는 모두 확인했습니다! 남은 수들은 모두 소수입니다.`,
        });
      }
    }

    generatedSteps.push({
      type: "COMPLETE",
      message: `🎉 탐색 완료! 1부터 ${maxNum}까지의 소수를 모두 찾았습니다.`,
    });

    return generatedSteps;
  }, [maxNum]);

  // 현재 stepIndex에 따른 그리드 상태 및 소수 목록 계산
  const { gridState, foundPrimes, eliminatedCount, currentStepInfo } = useMemo(() => {
    // 1부터 maxNum까지 기본 상태
    const grid: { num: number; status: NumberStatus; eliminatedBy: number | null }[] = Array.from(
      { length: maxNum },
      (_, i) => ({
        num: i + 1,
        status: "unmarked",
        eliminatedBy: null,
      })
    );

    const primes: number[] = [];
    let currentP: number | null = null;
    let currentM: number | null = null;

    // 0부터 stepIndex까지 단계적 적용
    for (let i = 0; i <= stepIndex && i < steps.length; i++) {
      const step = steps[i];
      if (step.type === "MARK_ONE") {
        grid[0].status = "one";
      } else if (step.type === "SELECT_PRIME") {
        currentP = step.p;
        currentM = null;
        if (!primes.includes(step.p)) {
          primes.push(step.p);
        }
        grid[step.p - 1].status = "prime";
      } else if (step.type === "ELIMINATE_MULTIPLE") {
        currentP = step.p;
        currentM = step.multiple;
        grid[step.multiple - 1].status = "composite";
        grid[step.multiple - 1].eliminatedBy = step.p;
      }
    }

    // 현재 단계에서 실시간 강조 (Highlight)
    const currentStep = steps[Math.min(stepIndex, steps.length - 1)];
    if (currentStep) {
      if (currentStep.type === "SELECT_PRIME") {
        grid[currentStep.p - 1].status = "current-prime";
      } else if (currentStep.type === "ELIMINATE_MULTIPLE") {
        grid[currentStep.multiple - 1].status = "current-multiple";
      }
    }

    const eliminated = grid.filter(
      (g) => g.status === "composite" || g.status === "one"
    ).length;

    return {
      gridState: grid,
      foundPrimes: primes,
      eliminatedCount: eliminated,
      currentStepInfo: currentStep,
    };
  }, [maxNum, stepIndex, steps]);

  // 다음 단계로 이동
  const handleNextStep = useCallback(() => {
    setStepIndex((prev) => {
      if (prev < steps.length - 1) {
        return prev + 1;
      } else {
        setIsPlaying(false);
        return prev;
      }
    });
  }, [steps.length]);

  // 초기화
  const handleReset = useCallback(() => {
    setIsPlaying(false);
    setStepIndex(0);
  }, []);

  // 자동 재생 타이머
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setStepIndex((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speedMs);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, speedMs, steps.length]);

  // N 변경 시 리셋
  const handleMaxNumChange = (newMax: number) => {
    setIsPlaying(false);
    setMaxNum(newMax);
    setStepIndex(0);
  };

  const isFinished = stepIndex >= steps.length - 1;

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 md:py-12">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        
        {/* 상단 네비게이션 & 타이틀 영역 */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-blue-600"
            >
              <ArrowLeft className="h-4 w-4" />
              메인으로 돌아가기
            </Link>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl">
              에라토스테네스의 체 실험실 🧪
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              고대 그리스 수학자 에라토스테네스가 발견한 소수(Prime Number) 탐색 알고리즘을 시각적으로 실험해보세요.
            </p>
          </div>

          {/* 설정 컨트롤 (최댓값 N 변경) */}
          <div className="flex items-center gap-3 rounded-2xl border border-gray-200/80 bg-white p-3 shadow-sm">
            <span className="text-xs font-semibold text-slate-700">검색 범위 (N):</span>
            <div className="flex gap-1.5">
              {[50, 100, 120].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleMaxNumChange(val)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                    maxNum === val
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-gray-100 text-slate-600 hover:bg-gray-200"
                  }`}
                >
                  1 ~ {val}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 메인 컨트롤러 및 진행 상황 대시보드 */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          
          {/* 컨트롤 및 안내 패널 (왼쪽 1열) */}
          <div className="flex flex-col gap-6 lg:col-span-1">
            
            {/* 컨트롤 바 */}
            <div className="rounded-3xl border border-gray-200/70 bg-white/80 p-6 shadow-sm backdrop-blur-xl">
              <h2 className="text-sm font-bold text-slate-900">시뮬레이션 조작</h2>
              
              {/* 버튼 그룹 */}
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  disabled={isFinished}
                  className={`inline-flex flex-1 items-center justify-center gap-2 rounded-2xl py-3 text-xs font-bold text-white transition-all shadow-sm ${
                    isPlaying
                      ? "bg-amber-500 hover:bg-amber-600"
                      : isFinished
                      ? "cursor-not-allowed bg-slate-300"
                      : "bg-blue-600 hover:bg-blue-700 shadow-blue-500/20"
                  }`}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="h-4 w-4" /> 일시정지
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" /> {isFinished ? "완료됨" : "자동 실행"}
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleNextStep}
                  disabled={isPlaying || isFinished}
                  className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs font-semibold text-slate-700 shadow-sm hover:bg-gray-50 disabled:opacity-50"
                  title="다음 단계"
                >
                  <SkipForward className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs font-semibold text-slate-700 shadow-sm hover:bg-gray-50"
                  title="초기화"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>

              {/* 속도 조절 스라이더 */}
              <div className="mt-5 border-t border-gray-100 pt-4">
                <div className="flex justify-between text-xs font-semibold text-slate-600">
                  <span>실행 속도</span>
                  <span>{(1000 / speedMs).toFixed(1)}단계 / 초</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="1000"
                  step="50"
                  value={1100 - speedMs}
                  onChange={(e) => setSpeedMs(1100 - Number(e.target.value))}
                  className="mt-2 h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-blue-600"
                />
                <div className="mt-1 flex justify-between text-[10px] font-medium text-slate-400">
                  <span>느리게 (1초)</span>
                  <span>빠르게 (0.1초)</span>
                </div>
              </div>
            </div>

            {/* 현재 실행 설명 알림창 */}
            <div className="rounded-3xl border border-blue-100 bg-blue-50/70 p-6 shadow-sm backdrop-blur-xl">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-700">
                <Sparkles className="h-4 w-4 text-blue-600" />
                <span>실시간 진행 상태</span>
              </div>
              <p className="mt-3 text-sm font-medium leading-relaxed text-slate-800">
                {currentStepInfo?.message || "시뮬레이션을 시작하세요."}
              </p>
              
              <div className="mt-4 flex items-center justify-between border-t border-blue-200/50 pt-3 text-xs font-semibold text-blue-900">
                <span>진행도:</span>
                <span>
                  {stepIndex + 1} / {steps.length} 단계 ({Math.round(((stepIndex + 1) / steps.length) * 100)}%)
                </span>
              </div>
            </div>

            {/* 실시간 통계 정보 카드 */}
            <div className="rounded-3xl border border-gray-200/70 bg-white/80 p-6 shadow-sm backdrop-blur-xl">
              <h2 className="text-sm font-bold text-slate-900">탐색 현황 통계</h2>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-emerald-50 p-4 border border-emerald-100">
                  <div className="text-[11px] font-medium text-emerald-700">발견한 소수</div>
                  <div className="mt-1 text-2xl font-extrabold text-emerald-900">
                    {foundPrimes.length} <span className="text-xs font-normal">개</span>
                  </div>
                </div>
                <div className="rounded-2xl bg-gray-100 p-4 border border-gray-200">
                  <div className="text-[11px] font-medium text-slate-600">지워진 수 (합성수+1)</div>
                  <div className="mt-1 text-2xl font-extrabold text-slate-800">
                    {eliminatedCount} <span className="text-xs font-normal">개</span>
                  </div>
                </div>
              </div>

              {/* 발견한 소수 리스트 */}
              <div className="mt-4 border-t border-gray-100 pt-4">
                <div className="text-xs font-semibold text-slate-700">
                  발견된 소수 목록 ({foundPrimes.length}):
                </div>
                <div className="mt-2 flex max-h-32 flex-wrap gap-1.5 overflow-y-auto rounded-2xl border border-gray-100 bg-gray-50/80 p-3">
                  {foundPrimes.length === 0 ? (
                    <span className="text-xs text-slate-400">소수를 탐색하는 중입니다...</span>
                  ) : (
                    foundPrimes.map((p) => (
                      <span
                        key={p}
                        className="inline-flex items-center rounded-lg bg-emerald-600 px-2 py-0.5 text-xs font-bold text-white shadow-xs"
                      >
                        {p}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* 수학적 원리 팁 (선생님 가이드용) */}
            <div className="rounded-3xl border border-amber-200/60 bg-amber-50/60 p-6 shadow-sm backdrop-blur-xl">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-800">
                <Info className="h-4 w-4 text-amber-600" />
                <span>수학 원리 꿀팁!</span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-amber-950">
                1부터 {maxNum}까지 탐색할 때, <strong>√{maxNum} ≈ {sqrtLimit}</strong> 이하의 소수 배수만 지우면 충분합니다!
                {sqrtLimit}보다 큰 소수의 배수는 이미 이전 소수들의 배수 검사에서 모두 지워졌기 때문입니다.
              </p>
            </div>

          </div>

          {/* 격자 시각화 그리드 (우측 2열) */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            
            {/* 색상 범례 (Legend) */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200/70 bg-white/80 px-6 py-4 shadow-sm backdrop-blur-xl">
              <span className="text-xs font-bold text-slate-800">범례 (Legend):</span>
              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
                <div className="flex items-center gap-1.5">
                  <span className="h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-emerald-300" />
                  <span className="text-slate-700">소수 (Prime)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-3.5 w-3.5 rounded-full bg-blue-600 ring-4 ring-blue-300 animate-pulse" />
                  <span className="text-slate-700">현재 탐색 소수</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-3.5 w-3.5 rounded-full bg-rose-500 ring-4 ring-rose-300 animate-ping" />
                  <span className="text-slate-700">지우는 배수</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-3.5 w-3.5 rounded-full bg-gray-200 opacity-60" />
                  <span className="text-slate-500">지워진 합성수</span>
                </div>
              </div>
            </div>

            {/* 그리드 컨테이너 */}
            <div className="rounded-3xl border border-gray-200/70 bg-white/90 p-6 shadow-sm backdrop-blur-xl md:p-8">
              <div className="grid grid-cols-5 gap-2 sm:grid-cols-10 md:gap-2.5">
                {gridState.map(({ num, status, eliminatedBy }) => {
                  
                  // 상태별 스타일링 매핑 (Apple 미니멀 감성)
                  let cellStyle = "bg-white text-slate-800 border-gray-200 hover:border-gray-300 shadow-xs";
                  
                  if (status === "one") {
                    cellStyle = "bg-gray-100 text-gray-400 border-gray-200 line-through opacity-50";
                  } else if (status === "prime") {
                    cellStyle = "bg-emerald-500 text-white font-extrabold border-emerald-600 shadow-md shadow-emerald-500/20 scale-105";
                  } else if (status === "current-prime") {
                    cellStyle = "bg-blue-600 text-white font-extrabold border-blue-700 ring-4 ring-blue-300/80 shadow-lg scale-110 z-10 animate-bounce";
                  } else if (status === "current-multiple") {
                    cellStyle = "bg-rose-500 text-white font-extrabold border-rose-600 ring-4 ring-rose-300/80 shadow-lg scale-110 z-10";
                  } else if (status === "composite") {
                    cellStyle = "bg-gray-100/90 text-gray-400 border-gray-200/60 line-through opacity-60";
                  }

                  return (
                    <div
                      key={num}
                      className={`relative flex h-12 w-full flex-col items-center justify-center rounded-2xl border text-sm font-bold transition-all duration-200 ${cellStyle}`}
                    >
                      <span>{num}</span>
                      {status === "composite" && eliminatedBy && (
                        <span className="text-[9px] font-normal no-underline opacity-75">
                          ×{eliminatedBy}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
