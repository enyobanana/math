"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Sparkles,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  FunctionSquare,
  HelpCircle,
} from "lucide-react";

/**
 * 이차함수 그래프 시각화 및 실험실 페이지
 * 표준형: y = a(x - p)^2 + q
 * 일반형: y = ax^2 + bx + c
 */
export default function QuadraticPage() {
  // 이차항 계수 a (기본값 1, 범위 -5 ~ 5)
  const [a, setA] = useState<number>(1);
  // 꼭짓점 x좌표 p (기본값 0, 범위 -10 ~ 10)
  const [p, setP] = useState<number>(0);
  // 꼭짓점 y좌표 q (기본값 0, 범위 -10 ~ 10)
  const [q, setQ] = useState<number>(0);

  // 그래프 줌 및 이동 계수
  const [zoom, setZoom] = useState<number>(1); // 1, 1.5, 2 등

  // 1. 수학적 계산 (일반형 계수 b, c 및 특징)
  const b = useMemo(() => -2 * a * p, [a, p]);
  const c = useMemo(() => a * p * p + q, [a, p, q]);

  // 판별식 D = b^2 - 4ac (또는 D = -4aq)
  const discriminant = useMemo(() => b * b - 4 * a * c, [b, a, c]);
  const discriminantFormatted = useMemo(() => {
    // 소수점 2자리 정리
    const rounded = Math.round(discriminant * 100) / 100;
    return Number.isInteger(rounded) ? `${rounded}` : `${rounded.toFixed(1)}`;
  }, [discriminant]);

  // y절편 (0, c)
  const yIntercept = c;

  // x절편 (근) 계산: a(x-p)^2 + q = 0 => (x-p)^2 = -q/a
  const roots = useMemo(() => {
    if (a === 0) return null; // 2차함수가 아님
    const val = -q / a;
    if (val < 0) return []; // 실근 없음
    if (val === 0) return [p]; // 중근 (꼭짓점이 x축과 만남)
    const sqrtVal = Math.sqrt(val);
    return [p - sqrtVal, p + sqrtVal]; // 서로 다른 두 실근
  }, [a, p, q]);

  // 그래프 표시용 SVG 좌표계 매핑 설정
  const svgWidth = 600;
  const svgHeight = 500;
  
  // 그리드 스케일 (기본 1단위당 25픽셀)
  const scale = 25 * zoom;
  const originX = svgWidth / 2;
  const originY = svgHeight / 2;

  // 수학 좌표 (x, y) -> SVG SVG Pixel 좌표 (px, py) 변환
  const toSvgX = (x: number) => originX + x * scale;
  const toSvgY = (y: number) => originY - y * scale;

  // 곡선 그리기용 샘플링 포인트 생성 (-15 ~ +15)
  const curvePathD = useMemo(() => {
    if (a === 0) return "";
    const points: string[] = [];
    const minX = -20;
    const maxX = 20;
    const step = 0.1;

    for (let x = minX; x <= maxX; x += step) {
      const y = a * Math.pow(x - p, 2) + q;
      const svgX = toSvgX(x);
      const svgY = toSvgY(y);
      points.push(`${x === minX ? "M" : "L"} ${svgX.toFixed(2)} ${svgY.toFixed(2)}`);
    }
    return points.join(" ");
  }, [a, p, q, zoom]);

  // 프리셋 설정 함수
  const applyPreset = (presetA: number, presetP: number, presetQ: number) => {
    setA(presetA);
    setP(presetP);
    setQ(presetQ);
  };

  const handleReset = () => {
    setA(1);
    setP(0);
    setQ(0);
    setZoom(1);
  };

  // 공식 문자열 포맷팅
  const formatStandardEquation = () => {
    if (a === 0) return "y = 0 (2차함수가 아닙니다)";
    const aStr = a === 1 ? "" : a === -1 ? "-" : `${a}`;
    const pStr = p === 0 ? "x" : p > 0 ? `(x - ${p})` : `(x + ${Math.abs(p)})`;
    const pExpr = p === 0 ? `${aStr}x²` : `${aStr}${pStr}²`;
    const qStr = q === 0 ? "" : q > 0 ? ` + ${q}` : ` - ${Math.abs(q)}`;
    return `y = ${pExpr}${qStr}`;
  };

  const formatGeneralEquation = () => {
    if (a === 0) return "";
    const aStr = a === 1 ? "x²" : a === -1 ? "-x²" : `${a}x²`;
    const bStr = b === 0 ? "" : b > 0 ? ` + ${b.toFixed(1)}x` : ` - ${Math.abs(b).toFixed(1)}x`;
    const cStr = c === 0 ? "" : c > 0 ? ` + ${c.toFixed(1)}` : ` - ${Math.abs(c).toFixed(1)}`;
    return `y = ${aStr}${bStr}${cStr}`;
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 md:py-12">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        
        {/* 헤더 & 타이틀 */}
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
              이차함수 그래프 실험실 📈
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              꼭짓점 $(p, q)$와 계수 $a$를 조절하여 이차함수 $y = a(x-p)^2 + q$의 그래프 변화를 실시간으로 탐구해보세요.
            </p>
          </div>

          {/* 프리셋 조작 버튼 */}
          <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-gray-200/80 bg-white p-3 shadow-sm">
            <span className="text-xs font-semibold text-slate-700">예시 그래프:</span>
            <button
              type="button"
              onClick={() => applyPreset(1, 0, 0)}
              className="rounded-xl bg-gray-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600"
            >
              기본형 $y=x²$
            </button>
            <button
              type="button"
              onClick={() => applyPreset(2, 3, 1)}
              className="rounded-xl bg-gray-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600"
            >
              $y=2(x-3)²+1$
            </button>
            <button
              type="button"
              onClick={() => applyPreset(-1, -2, 4)}
              className="rounded-xl bg-gray-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600"
            >
              위로 볼록 $y=-(x+2)²+4$
            </button>
          </div>
        </div>

        {/* 메인 2열 레이아웃 */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          
          {/* 입력 파라미터 및 수식 분석 카드 (좌측 1열) */}
          <div className="flex flex-col gap-6 lg:col-span-1">
            
            {/* 파라미터 슬라이더 입력 폼 */}
            <div className="rounded-3xl border border-gray-200/70 bg-white/80 p-6 shadow-sm backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-900">파라미터 조절</h2>
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-blue-600"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> 초기화
                </button>
              </div>

              {/* 1. 2차항 계수 a */}
              <div className="mt-5">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>2차항 계수 (a)</span>
                  <span className="font-mono text-blue-600">{a}</span>
                </div>
                <input
                  type="range"
                  min="-4"
                  max="4"
                  step="0.1"
                  value={a}
                  onChange={(e) => setA(parseFloat(parseFloat(e.target.value).toFixed(1)))}
                  className="mt-2 h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-blue-600"
                />
                <div className="mt-1 flex justify-between text-[10px] text-slate-400">
                  <span>-4 (위로 볼록)</span>
                  <span>0 (직선)</span>
                  <span>+4 (아래로 볼록)</span>
                </div>
              </div>

              {/* 2. 꼭짓점 x좌표 p */}
              <div className="mt-5">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>꼭짓점 x좌표 (p) [좌우 이동]</span>
                  <span className="font-mono text-blue-600">{p}</span>
                </div>
                <input
                  type="range"
                  min="-8"
                  max="8"
                  step="0.5"
                  value={p}
                  onChange={(e) => setP(parseFloat(e.target.value))}
                  className="mt-2 h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-blue-600"
                />
              </div>

              {/* 3. 꼭짓점 y좌표 q */}
              <div className="mt-5">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>꼭짓점 y좌표 (q) [상하 이동]</span>
                  <span className="font-mono text-blue-600">{q}</span>
                </div>
                <input
                  type="range"
                  min="-8"
                  max="8"
                  step="0.5"
                  value={q}
                  onChange={(e) => setQ(parseFloat(e.target.value))}
                  className="mt-2 h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-blue-600"
                />
              </div>
            </div>

            {/* 수식 및 분석 정보 카드 */}
            <div className="rounded-3xl border border-blue-100 bg-blue-50/60 p-6 shadow-sm backdrop-blur-xl">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-700">
                <FunctionSquare className="h-4 w-4 text-blue-600" />
                <span>이차함수 분석 카드</span>
              </div>

              {/* 수식 표현 */}
              <div className="mt-4 rounded-2xl bg-white p-4 border border-blue-100 shadow-xs">
                <div className="text-[11px] font-semibold text-slate-400">표준형 (Vertex Form)</div>
                <div className="mt-1 text-lg font-extrabold text-blue-900 font-mono">
                  {formatStandardEquation()}
                </div>
                {a !== 0 && (
                  <>
                    <div className="mt-3 text-[11px] font-semibold text-slate-400">일반형 (General Form)</div>
                    <div className="mt-1 text-sm font-bold text-slate-700 font-mono">
                      {formatGeneralEquation()}
                    </div>
                  </>
                )}
              </div>

              {/* 주요 기하학적 성질 */}
              <div className="mt-4 flex flex-col gap-2.5 text-xs text-slate-700">
                <div className="flex items-center justify-between rounded-xl bg-white/80 px-3 py-2 border border-blue-100/50">
                  <span className="font-semibold text-slate-500">꼭짓점 (Vertex):</span>
                  <span className="font-bold text-blue-700">({p}, {q})</span>
                </div>
                
                <div className="flex items-center justify-between rounded-xl bg-white/80 px-3 py-2 border border-blue-100/50">
                  <span className="font-semibold text-slate-500">축의 방정식 (Axis):</span>
                  <span className="font-bold text-slate-800">x = {p}</span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-white/80 px-3 py-2 border border-blue-100/50">
                  <span className="font-semibold text-slate-500">y절편 (y-Intercept):</span>
                  <span className="font-bold text-slate-800">(0, {yIntercept.toFixed(1)})</span>
                </div>

                <div className="flex flex-col gap-1 rounded-xl bg-white/80 px-3 py-2.5 border border-blue-100/50">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-500">x절편 (x-Intercepts):</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800">
                        {roots === null
                          ? "N/A"
                          : roots.length === 0
                          ? "실근 없음"
                          : roots.length === 1
                          ? `(${roots[0].toFixed(1)}, 0)`
                          : `(${roots[0].toFixed(1)}, 0), (${roots[1].toFixed(1)}, 0)`}
                      </span>
                      {a !== 0 && (
                        <span
                          className={`inline-flex items-center rounded-lg px-2 py-0.5 text-[11px] font-extrabold font-mono shadow-xs ${
                            discriminant > 0
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                              : discriminant === 0
                              ? "bg-amber-100 text-amber-800 border border-amber-200"
                              : "bg-rose-100 text-rose-800 border border-rose-200"
                          }`}
                        >
                          D = {discriminantFormatted} ({discriminant > 0 ? "D > 0" : discriminant === 0 ? "D = 0" : "D < 0"})
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-white/80 px-3 py-2 border border-blue-100/50">
                  <span className="font-semibold text-slate-500">그래프 모양:</span>
                  <span className="font-bold text-slate-800">
                    {a > 0 ? `아래로 볼록 (최솟값 ${q})` : a < 0 ? `위로 볼록 (최댓값 ${q})` : "직선"}
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* SVG 인터랙티브 그래프 화면 (우측 2열) */}
          <div className="flex flex-col gap-4 lg:col-span-2">
            
            {/* 줌 툴바 */}
            <div className="flex items-center justify-between rounded-2xl border border-gray-200/70 bg-white/80 px-6 py-3 shadow-sm backdrop-blur-xl">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <Sparkles className="h-4 w-4 text-blue-600" />
                <span>그래프 시각화 canvas (SVG)</span>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.min(z + 0.25, 2.5))}
                  className="rounded-xl border border-gray-200 bg-white p-2 text-slate-600 hover:bg-gray-50"
                  title="확대"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.max(z - 0.25, 0.5))}
                  className="rounded-xl border border-gray-200 bg-white p-2 text-slate-600 hover:bg-gray-50"
                  title="축소"
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setZoom(1)}
                  className="rounded-xl border border-gray-200 bg-white p-2 text-slate-600 hover:bg-gray-50"
                  title="줌 초기화"
                >
                  <Maximize2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* SVG 그래프 보드 */}
            <div className="relative overflow-hidden rounded-3xl border border-gray-200/80 bg-white shadow-sm">
              <svg
                width="100%"
                height="100%"
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className="w-full h-[480px] bg-slate-95/30"
              >
                {/* 1. 모눈종이 그리드 (Grid Lines) */}
                <g stroke="#f1f5f9" strokeWidth="1">
                  {Array.from({ length: 41 }, (_, i) => i - 20).map((tick) => {
                    const sx = toSvgX(tick);
                    const sy = toSvgY(tick);
                    return (
                      <React.Fragment key={`grid-${tick}`}>
                        {/* 수직 그리드 */}
                        {sx >= 0 && sx <= svgWidth && (
                          <line x1={sx} y1={0} x2={sx} y2={svgHeight} />
                        )}
                        {/* 수평 그리드 */}
                        {sy >= 0 && sy <= svgHeight && (
                          <line x1={0} y1={sy} x2={svgWidth} y2={sy} />
                        )}
                      </React.Fragment>
                    );
                  })}
                </g>

                {/* 2. 주 좌표축 (X축, Y축) */}
                <g stroke="#94a3b8" strokeWidth="2">
                  {/* X축 */}
                  <line x1={0} y1={originY} x2={svgWidth} y2={originY} />
                  {/* Y축 */}
                  <line x1={originX} y1={0} x2={originX} y2={svgHeight} />
                </g>

                {/* 좌표 축 눈금 숫자 (Ticks) */}
                <g fill="#64748b" fontSize="10" fontFamily="sans-serif" textAnchor="middle">
                  {Array.from({ length: 21 }, (_, i) => (i - 10) * 2).map((tick) => {
                    if (tick === 0) return null;
                    const sx = toSvgX(tick);
                    const sy = toSvgY(tick);
                    return (
                      <React.Fragment key={`tick-${tick}`}>
                        {/* X축 눈금 */}
                        {sx >= 20 && sx <= svgWidth - 20 && (
                          <text x={sx} y={originY + 14}>{tick}</text>
                        )}
                        {/* Y축 눈금 */}
                        {sy >= 20 && sy <= svgHeight - 20 && (
                          <text x={originX - 12} y={sy + 3}>{tick}</text>
                        )}
                      </React.Fragment>
                    );
                  })}
                  <text x={originX - 10} y={originY + 14} fontWeight="bold">0</text>
                </g>

                {/* 3. 대칭축 (Axis of Symmetry: x = p) */}
                {a !== 0 && (
                  <line
                    x1={toSvgX(p)}
                    y1={0}
                    x2={toSvgX(p)}
                    y2={svgHeight}
                    stroke="#a855f7"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                )}

                {/* 4. 이차함수 포물선 그래프 곡선 */}
                {a !== 0 && curvePathD && (
                  <path
                    d={curvePathD}
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {/* 5. 꼭짓점 (p, q) 포인트 강조 */}
                {a !== 0 && (
                  <g>
                    {/* 꼭짓점 글로우 파동 */}
                    <circle
                      cx={toSvgX(p)}
                      cy={toSvgY(q)}
                      r="9"
                      fill="#2563eb"
                      opacity="0.25"
                      className="animate-ping"
                    />
                    {/* 꼭짓점 점 */}
                    <circle
                      cx={toSvgX(p)}
                      cy={toSvgY(q)}
                      r="6"
                      fill="#2563eb"
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                    {/* 꼭짓점 좌표 뱃지 */}
                    <rect
                      x={toSvgX(p) - 35}
                      y={toSvgY(q) - (a >= 0 ? 32 : -12)}
                      width="70"
                      height="22"
                      rx="6"
                      fill="#1e293b"
                      opacity="0.9"
                    />
                    <text
                      x={toSvgX(p)}
                      y={toSvgY(q) - (a >= 0 ? 17 : -27)}
                      fill="#ffffff"
                      fontSize="10"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      꼭짓점 ({p}, {q})
                    </text>
                  </g>
                )}

                {/* 6. y절편 점 표시 */}
                {a !== 0 && (
                  <circle
                    cx={toSvgX(0)}
                    cy={toSvgY(c)}
                    r="4"
                    fill="#f59e0b"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                )}

                {/* 7. x절편 점 표시 (근이 존재할 때) */}
                {a !== 0 && roots && roots.length > 0 && roots.map((root, idx) => (
                  <circle
                    key={`root-${idx}`}
                    cx={toSvgX(root)}
                    cy={toSvgY(0)}
                    r="4"
                    fill="#10b981"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                ))}
              </svg>
            </div>

            {/* 범례 및 안내 */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200/70 bg-white px-6 py-3 text-xs shadow-sm">
              <div className="flex items-center gap-4 font-semibold">
                <span className="flex items-center gap-1.5 text-blue-600">
                  <span className="h-3 w-3 rounded-full bg-blue-600" /> 이차함수 곡선
                </span>
                <span className="flex items-center gap-1.5 text-purple-600">
                  <span className="h-3 w-3 rounded-full bg-purple-500" /> 대칭축 (x = {p})
                </span>
                <span className="flex items-center gap-1.5 text-amber-600">
                  <span className="h-3 w-3 rounded-full bg-amber-500" /> y절편 (0, {c.toFixed(1)})
                </span>
                <span className="flex items-center gap-1.5 text-emerald-600">
                  <span className="h-3 w-3 rounded-full bg-emerald-500" /> x절편
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
