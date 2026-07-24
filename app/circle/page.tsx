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
  CircleDot,
} from "lucide-react";

/**
 * 원의 방정식 시각화 및 탐구 실험실 페이지 Component
 * 표준형: (x - h)² + (y - k)² = r²
 * 일반형: x² + y² + Dx + Ey + F = 0
 */
export default function CirclePage() {
  // 원의 중심 h (x좌표), k (y좌표), 반지름 r
  const [h, setH] = useState<number>(0);
  const [k, setK] = useState<number>(0);
  const [r, setR] = useState<number>(4);

  // 그래프 줌 계수
  const [zoom, setZoom] = useState<number>(1);

  // 1. 계산된 수학적 데이터
  const rSquared = useMemo(() => r * r, [r]);

  // 일반형 계수 D, E, F: x² + y² + Dx + Ey + F = 0
  const D = useMemo(() => -2 * h, [h]);
  const E = useMemo(() => -2 * k, [k]);
  const F = useMemo(() => h * h + k * k - r * r, [h, k, r]);

  // 원의 넓이 & 둘레
  const area = useMemo(() => Math.PI * r * r, [r]);
  const circumference = useMemo(() => 2 * Math.PI * r, [r]);

  // 4대 극점 (상하좌우 끝점)
  const topPoint = useMemo(() => ({ x: h, y: k + r }), [h, k, r]);
  const bottomPoint = useMemo(() => ({ x: h, y: k - r }), [h, k, r]);
  const rightPoint = useMemo(() => ({ x: h + r, y: k }), [h, k, r]);
  const leftPoint = useMemo(() => ({ x: h - r, y: k }), [h, k, r]);

  // x절편 계산: (x - h)² = r² - k²
  const xIntercepts = useMemo(() => {
    const val = r * r - k * k;
    if (val < 0) return [];
    if (val === 0) return [h];
    const sqrtVal = Math.sqrt(val);
    return [h - sqrtVal, h + sqrtVal];
  }, [h, k, r]);

  // y절편 계산: (y - k)² = r² - h²
  const yIntercepts = useMemo(() => {
    const val = r * r - h * h;
    if (val < 0) return [];
    if (val === 0) return [k];
    const sqrtVal = Math.sqrt(val);
    return [k - sqrtVal, k + sqrtVal];
  }, [h, k, r]);

  // SVG 좌표계 설정
  const svgWidth = 600;
  const svgHeight = 500;
  const scale = 25 * zoom; // 1단위당 25px
  const originX = svgWidth / 2;
  const originY = svgHeight / 2;

  // 수학 좌표 (x, y) -> SVG Pixel 좌표 (px, py) 변환
  const toSvgX = (xVal: number) => originX + xVal * scale;
  const toSvgY = (yVal: number) => originY - yVal * scale;

  // 핸들러 & 리셋
  const handleReset = () => {
    setH(0);
    setK(0);
    setR(4);
    setZoom(1);
  };

  const applyPreset = (presetH: number, presetK: number, presetR: number) => {
    setH(presetH);
    setK(presetK);
    setR(presetR);
  };

  // 표준형 수식 문자열 생성
  const formatStandardEquation = () => {
    const hPart = h === 0 ? "x²" : h > 0 ? `(x - ${h})²` : `(x + ${Math.abs(h)})²`;
    const kPart = k === 0 ? "y²" : k > 0 ? `(y - ${k})²` : `(y + ${Math.abs(k)})²`;
    return `${hPart} + ${kPart} = ${rSquared}`;
  };

  // 일반형 수식 문자열 생성
  const formatGeneralEquation = () => {
    let eq = "x² + y²";
    if (D !== 0) eq += D > 0 ? ` + ${D}x` : ` - ${Math.abs(D)}x`;
    if (E !== 0) eq += E > 0 ? ` + ${E}y` : ` - ${Math.abs(E)}y`;
    if (F !== 0) eq += F > 0 ? ` + ${F}` : ` - ${Math.abs(F)}`;
    eq += " = 0";
    return eq;
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 md:py-12">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        {/* 헤더 & 타이틀 */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              메인으로 돌아가기
            </Link>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl">
              원의 방정식 시각화 실험실 🔴
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              원의 중심 $(h, k)$와 반지름 $r$을 조절하여 원의 방정식 $(x-h)^2 + (y-k)^2 = r^2$의 형태와 기하학적 성질을 탐구해 보세요.
            </p>
          </div>

          {/* 예시 프리셋 조작 버튼 */}
          <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-gray-200/80 bg-white p-3 shadow-sm">
            <span className="text-xs font-semibold text-slate-700">예시 프리셋:</span>
            <button
              type="button"
              onClick={() => applyPreset(0, 0, 1)}
              className="rounded-xl bg-gray-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              단위원 $(r=1)$
            </button>
            <button
              type="button"
              onClick={() => applyPreset(0, 0, 5)}
              className="rounded-xl bg-gray-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              원점 중심 $(r=5)$
            </button>
            <button
              type="button"
              onClick={() => applyPreset(3, -2, 4)}
              className="rounded-xl bg-gray-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              이동된 원 $(3, -2), r=4$
            </button>
          </div>
        </div>

        {/* 메인 2열 레이아웃 */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* 좌측 1열: 입력 컨트롤 및 계산 분석 카드 */}
          <div className="flex flex-col gap-6 lg:col-span-1">
            {/* 파라미터 조절 카드 */}
            <div className="rounded-3xl border border-gray-200/70 bg-white/80 p-6 shadow-sm backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-900">원의 파라미터 조절</h2>
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> 초기화
                </button>
              </div>

              {/* 중심 x좌표 h */}
              <div className="mt-5">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>중심 x좌표 (h)</span>
                  <span className="font-mono text-blue-600 font-bold">{h}</span>
                </div>
                <input
                  type="range"
                  min="-8"
                  max="8"
                  step="0.5"
                  value={h}
                  onChange={(e) => setH(parseFloat(e.target.value))}
                  className="mt-2 h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-blue-600"
                />
                <div className="mt-1 flex justify-between text-[10px] text-slate-400">
                  <span>-8 (좌측)</span>
                  <span>0</span>
                  <span>+8 (우측)</span>
                </div>
              </div>

              {/* 중심 y좌표 k */}
              <div className="mt-5">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>중심 y좌표 (k)</span>
                  <span className="font-mono text-blue-600 font-bold">{k}</span>
                </div>
                <input
                  type="range"
                  min="-8"
                  max="8"
                  step="0.5"
                  value={k}
                  onChange={(e) => setK(parseFloat(e.target.value))}
                  className="mt-2 h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-blue-600"
                />
                <div className="mt-1 flex justify-between text-[10px] text-slate-400">
                  <span>-8 (하단)</span>
                  <span>0</span>
                  <span>+8 (상단)</span>
                </div>
              </div>

              {/* 반지름 r */}
              <div className="mt-5">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>반지름 (r)</span>
                  <span className="font-mono text-blue-600 font-bold">{r}</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="10"
                  step="0.5"
                  value={r}
                  onChange={(e) => setR(parseFloat(e.target.value))}
                  className="mt-2 h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-blue-600"
                />
                <div className="mt-1 flex justify-between text-[10px] text-slate-400">
                  <span>0.5 (소형)</span>
                  <span>5</span>
                  <span>10 (대형)</span>
                </div>
              </div>
            </div>

            {/* 수식 및 분석 정보 카드 */}
            <div className="rounded-3xl border border-blue-100 bg-blue-50/60 p-6 shadow-sm backdrop-blur-xl">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-700">
                <CircleDot className="h-4 w-4 text-blue-600" />
                <span>원의 방정식 분석 카드</span>
              </div>

              {/* 수식 표현 */}
              <div className="mt-4 rounded-2xl bg-white p-4 border border-blue-100 shadow-xs">
                <div className="text-[11px] font-semibold text-slate-400">표준형 (Standard Form)</div>
                <div className="mt-1 text-base font-extrabold text-blue-900 font-mono overflow-x-auto">
                  {formatStandardEquation()}
                </div>
                <div className="mt-3 text-[11px] font-semibold text-slate-400">일반형 (General Form)</div>
                <div className="mt-1 text-sm font-bold text-slate-700 font-mono overflow-x-auto">
                  {formatGeneralEquation()}
                </div>
              </div>

              {/* 주요 기하학적 성질 */}
              <div className="mt-4 flex flex-col gap-2.5 text-xs text-slate-700">
                <div className="flex items-center justify-between rounded-xl bg-white/80 px-3 py-2 border border-blue-100/50">
                  <span className="font-semibold text-slate-500">중심 좌표:</span>
                  <span className="font-bold text-blue-700">({h}, {k})</span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-white/80 px-3 py-2 border border-blue-100/50">
                  <span className="font-semibold text-slate-500">반지름 (지름):</span>
                  <span className="font-bold text-slate-800">r = {r} (d = {2 * r})</span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-white/80 px-3 py-2 border border-blue-100/50">
                  <span className="font-semibold text-slate-500">원의 넓이 (πr²):</span>
                  <span className="font-bold text-slate-800">{area.toFixed(2)} (약 {rSquared}π)</span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-white/80 px-3 py-2 border border-blue-100/50">
                  <span className="font-semibold text-slate-500">원의 둘레 (2πr):</span>
                  <span className="font-bold text-slate-800">{circumference.toFixed(2)} (약 {2 * r}π)</span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-white/80 px-3 py-2 border border-blue-100/50">
                  <span className="font-semibold text-slate-500">x절편:</span>
                  <span className="font-bold text-slate-800">
                    {xIntercepts.length === 0
                      ? "없음 (x축과 안 만남)"
                      : xIntercepts.length === 1
                      ? `(${xIntercepts[0].toFixed(1)}, 0)`
                      : `(${xIntercepts[0].toFixed(1)}, 0), (${xIntercepts[1].toFixed(1)}, 0)`}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-white/80 px-3 py-2 border border-blue-100/50">
                  <span className="font-semibold text-slate-500">y절편:</span>
                  <span className="font-bold text-slate-800">
                    {yIntercepts.length === 0
                      ? "없음 (y축과 안 만남)"
                      : yIntercepts.length === 1
                      ? `(0, ${yIntercepts[0].toFixed(1)})`
                      : `(0, ${yIntercepts[0].toFixed(1)}), (0, ${yIntercepts[1].toFixed(1)})`}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 우측 2열: SVG 인터랙티브 원 시각화 Canvas */}
          <div className="flex flex-col gap-4 lg:col-span-2">
            {/* Canvas 상단 툴바 */}
            <div className="flex items-center justify-between rounded-2xl border border-gray-200/70 bg-white/80 px-6 py-3 shadow-sm backdrop-blur-xl">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <Sparkles className="h-4 w-4 text-blue-600" />
                <span>원의 방정식 캔버스 (SVG 인터랙티브)</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.min(z + 0.25, 2.5))}
                  className="rounded-xl border border-gray-200 bg-white p-2 text-slate-600 hover:bg-gray-50 transition-colors"
                  title="확대"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.max(z - 0.25, 0.5))}
                  className="rounded-xl border border-gray-200 bg-white p-2 text-slate-600 hover:bg-gray-50 transition-colors"
                  title="축소"
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setZoom(1)}
                  className="rounded-xl border border-gray-200 bg-white p-2 text-slate-600 hover:bg-gray-50 transition-colors"
                  title="줌 초기화"
                >
                  <Maximize2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* SVG 그래프 영역 */}
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
                        {sx >= 0 && sx <= svgWidth && (
                          <line x1={sx} y1={0} x2={sx} y2={svgHeight} />
                        )}
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
                        {sx >= 20 && sx <= svgWidth - 20 && (
                          <text x={sx} y={originY + 14}>{tick}</text>
                        )}
                        {sy >= 20 && sy <= svgHeight - 20 && (
                          <text x={originX - 12} y={sy + 3}>{tick}</text>
                        )}
                      </React.Fragment>
                    );
                  })}
                  <text x={originX - 10} y={originY + 14} fontWeight="bold">0</text>
                </g>

                {/* 3. 원의 그래픽 그리기 (Circle Fill & Outline) */}
                <circle
                  cx={toSvgX(h)}
                  cy={toSvgY(k)}
                  r={r * scale}
                  fill="rgba(37, 99, 235, 0.12)"
                  stroke="#2563eb"
                  strokeWidth="3"
                  className="transition-all duration-300"
                />

                {/* 4. 반지름 가이드 라인 (Radius line) */}
                <line
                  x1={toSvgX(h)}
                  y1={toSvgY(k)}
                  x2={toSvgX(h + r)}
                  y2={toSvgY(k)}
                  stroke="#0284c7"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
                {/* 반지름 텍스트 라벨 */}
                <rect
                  x={toSvgX(h + r / 2) - 18}
                  y={toSvgY(k) - 18}
                  width="36"
                  height="16"
                  rx="4"
                  fill="#0284c7"
                />
                <text
                  x={toSvgX(h + r / 2)}
                  y={toSvgY(k) - 6}
                  fill="#ffffff"
                  fontSize="10"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  r = {r}
                </text>

                {/* 5. 중심점 (h, k) 강조 */}
                <g>
                  {/* 중심점 파동 애니메이션 */}
                  <circle
                    cx={toSvgX(h)}
                    cy={toSvgY(k)}
                    r="8"
                    fill="#2563eb"
                    opacity="0.3"
                    className="animate-ping"
                  />
                  <circle
                    cx={toSvgX(h)}
                    cy={toSvgY(k)}
                    r="5"
                    fill="#2563eb"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                  {/* 중심 좌표 뱃지 */}
                  <rect
                    x={toSvgX(h) - 32}
                    y={toSvgY(k) + 10}
                    width="64"
                    height="20"
                    rx="5"
                    fill="#1e293b"
                    opacity="0.9"
                  />
                  <text
                    x={toSvgX(h)}
                    y={toSvgY(k) + 24}
                    fill="#ffffff"
                    fontSize="10"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    중심 ({h}, {k})
                  </text>
                </g>

                {/* 6. 상하좌우 극점 표시 */}
                {[
                  { pt: rightPoint, label: `(${h + r}, ${k})` },
                  { pt: leftPoint, label: `(${h - r}, ${k})` },
                  { pt: topPoint, label: `(${h}, ${k + r})` },
                  { pt: bottomPoint, label: `(${h}, ${k - r})` },
                ].map((item, idx) => (
                  <circle
                    key={`extreme-${idx}`}
                    cx={toSvgX(item.pt.x)}
                    cy={toSvgY(item.pt.y)}
                    r="3.5"
                    fill="#9333ea"
                    stroke="#ffffff"
                    strokeWidth="1"
                  />
                ))}

                {/* 7. x절편 (x-intercepts) 강조 (녹색 점) */}
                {xIntercepts.map((xVal, idx) => (
                  <circle
                    key={`x-int-${idx}`}
                    cx={toSvgX(xVal)}
                    cy={toSvgY(0)}
                    r="4.5"
                    fill="#10b981"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                ))}

                {/* 8. y절편 (y-intercepts) 강조 (주황색 점) */}
                {yIntercepts.map((yVal, idx) => (
                  <circle
                    key={`y-int-${idx}`}
                    cx={toSvgX(0)}
                    cy={toSvgY(yVal)}
                    r="4.5"
                    fill="#f59e0b"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                ))}
              </svg>
            </div>

            {/* 범례 */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200/70 bg-white px-6 py-3 text-xs shadow-sm">
              <div className="flex items-center gap-4 font-semibold">
                <span className="flex items-center gap-1.5 text-blue-600">
                  <span className="h-3 w-3 rounded-full bg-blue-600" /> 원의 테두리 및 영역
                </span>
                <span className="flex items-center gap-1.5 text-sky-600">
                  <span className="h-3 w-3 rounded-full bg-sky-600" /> 반지름 (r = {r})
                </span>
                <span className="flex items-center gap-1.5 text-purple-600">
                  <span className="h-3 w-3 rounded-full bg-purple-600" /> 상하좌우 극점
                </span>
                <span className="flex items-center gap-1.5 text-emerald-600">
                  <span className="h-3 w-3 rounded-full bg-emerald-500" /> x절편
                </span>
                <span className="flex items-center gap-1.5 text-amber-600">
                  <span className="h-3 w-3 rounded-full bg-amber-500" /> y절편
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
