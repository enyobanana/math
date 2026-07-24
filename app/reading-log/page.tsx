"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  BookOpen,
  User,
  Calendar,
  BookMarked,
  Sparkles,
  Search,
  Plus,
  ArrowLeft,
  CheckCircle2,
  Trash2,
  Database,
  Copy,
  Check,
  AlertCircle,
  FileText,
} from "lucide-react";
import { supabase, isSupabaseConfigured, ReadingLog } from "@/lib/supabase";

// 예시 데모 독서기록 데이터 (기초 데이터)
const INITIAL_DEMO_LOGS: ReadingLog[] = [
  {
    id: "demo-1",
    student_id: "20101",
    student_name: "김민준",
    read_date: "2026-07-24",
    book_title: "세상의 모든 공식을 담은 수학 백과",
    author: "피타고라스 지음",
    new_learnings: "이차함수와 파라볼라 포물선의 기하학적 성질이 실생활 안테나나 자동차 헤드라이트에 쓰인다는 점이 새로웠습니다.",
    created_at: new Date().toISOString(),
  },
  {
    id: "demo-2",
    student_id: "20102",
    student_name: "이서연",
    read_date: "2026-07-23",
    book_title: "소수와 에라토스테네스의 체 이야기",
    author: "알프레드 지음",
    new_learnings: "소수를 찾을 때 왜 루트 N 이하의 소수 배수만 지우면 되는지 수학적 원리를 완벽히 이해할 수 있었습니다.",
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
];

/**
 * 학생 독서기록장 프로그램 페이지
 * - 학번, 이름, 기록날짜, 책이름, 저자, 새롭게 알게된 점 작성 및 Supabase DB 저장
 * - Supabase 미설정 시에도 로컬 상태로 즉시 체험 가능
 */
export default function ReadingLogPage() {
  // 독서기록 목록 상태
  const [logs, setLogs] = useState<ReadingLog[]>(INITIAL_DEMO_LOGS);
  // 로딩 상태
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // 검색어 상태
  const [searchQuery, setSearchQuery] = useState<string>("");
  // SQL 코드 복사 상태
  const [isCopied, setIsCopied] = useState<boolean>(false);
  // SQL 튜토리얼 아코디언 토글
  const [showSqlGuide, setShowSqlGuide] = useState<boolean>(false);

  // 폼 입력 필드 상태
  const [studentId, setStudentId] = useState<string>("");
  const [studentName, setStudentName] = useState<string>("");
  const [readDate, setReadDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [bookTitle, setBookTitle] = useState<string>("");
  const [author, setAuthor] = useState<string>("");
  const [newLearnings, setNewLearnings] = useState<string>("");

  // Supabase에서 데이터 불러오기
  const fetchLogs = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("reading_logs")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase 불러오기 에러:", error.message);
      } else if (data && data.length > 0) {
        setLogs(data);
      }
    } catch (err) {
      console.error("데이터 로드 중 오류 발생:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // 독서기록 제출 등록 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!studentId || !studentName || !bookTitle || !author || !newLearnings) {
      alert("모든 필수 입력 항목을 작성해 주세요!");
      return;
    }

    const newLog: ReadingLog = {
      student_id: studentId,
      student_name: studentName,
      read_date: readDate,
      book_title: bookTitle,
      author: author,
      new_learnings: newLearnings,
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("reading_logs")
        .insert([newLog])
        .select();

      setIsLoading(false);

      if (error) {
        alert(`Supabase 저장 실패: ${error.message}`);
        return;
      }

      if (data && data.length > 0) {
        setLogs((prev) => [data[0], ...prev]);
        alert("🎉 Supabase 데이터베이스에 독서기록이 성공적으로 저장되었습니다!");
      }
    } else {
      // 로컬 시뮬레이션 저장
      const localLog = { ...newLog, id: `local-${Date.now()}` };
      setLogs((prev) => [localLog, ...prev]);
      alert(
        "🎉 독서기록이 저장되었습니다!\n(현재 로컬 시뮬레이션 모드입니다. Vercel 환경변수에 Supabase URL과 Anon Key를 추가하면 DB에 영구 저장됩니다.)"
      );
    }

    // 폼 초기화 (학번/이름은 연속 작성을 위해 유지)
    setBookTitle("");
    setAuthor("");
    setNewLearnings("");
  };

  // 항목 삭제 처리
  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm("이 독서기록을 정말 삭제하시겠습니까?")) return;

    if (isSupabaseConfigured && supabase && !id.startsWith("demo-") && !id.startsWith("local-")) {
      const { error } = await supabase.from("reading_logs").delete().eq("id", id);
      if (error) {
        alert(`삭제 실패: ${error.message}`);
        return;
      }
    }

    setLogs((prev) => prev.filter((log) => log.id !== id));
  };

  // 검색어 필터링 목록
  const filteredLogs = useMemo(() => {
    if (!searchQuery.trim()) return logs;
    const query = searchQuery.toLowerCase();
    return logs.filter(
      (log) =>
        log.student_name.toLowerCase().includes(query) ||
        log.student_id.toLowerCase().includes(query) ||
        log.book_title.toLowerCase().includes(query) ||
        log.author.toLowerCase().includes(query) ||
        log.new_learnings.toLowerCase().includes(query)
    );
  }, [logs, searchQuery]);

  // SQL 쿼리문 (Supabase SQL Editor에 실행할 쿼리)
  const sqlQueryText = `-- 1. Supabase 독서기록장 (reading_logs) 테이블 생성
CREATE TABLE IF NOT EXISTS public.reading_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id VARCHAR(50) NOT NULL,     -- 학번 (예: 20101)
  student_name VARCHAR(50) NOT NULL,   -- 이름 (예: 홍길동)
  read_date DATE NOT NULL,             -- 기록 날짜 (YYYY-MM-DD)
  book_title VARCHAR(255) NOT NULL,    -- 책 제목
  author VARCHAR(255) NOT NULL,        -- 저자
  new_learnings TEXT NOT NULL,         -- 새롭게 알게된 점
  created_at TIMESTAMPTZ DEFAULT NOW() -- 등록 일시
);

-- 2. RLS (행 수준 보안) 설정 및 기존 정책 재설정
ALTER TABLE public.reading_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access" ON public.reading_logs;
DROP POLICY IF EXISTS "Allow public insert access" ON public.reading_logs;
DROP POLICY IF EXISTS "Allow public delete access" ON public.reading_logs;

CREATE POLICY "Allow public read access" ON public.reading_logs
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert access" ON public.reading_logs
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public delete access" ON public.reading_logs
  FOR DELETE USING (true);

-- 3. Supabase PostgREST API 스키마 캐시 즉시 새로고침
NOTIFY pgrst, 'reload schema';`;

  const copySqlToClipboard = () => {
    navigator.clipboard.writeText(sqlQueryText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 md:py-12">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        
        {/* 상단 네비게이션 & 헤더 */}
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
              학생 독서기록장 📚
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              읽은 책의 정보와 새롭게 알게 된 점을 작성하고 Supabase 데이터베이스에 안전하게 기록하세요.
            </p>
          </div>

          {/* Supabase 상태 표시 배지 */}
          <div className="flex items-center gap-3 rounded-2xl border border-gray-200/80 bg-white p-3 shadow-sm">
            <Database className="h-4 w-4 text-blue-600" />
            <div className="flex flex-col">
              <span className="text-[11px] font-semibold text-slate-400">DB 연동 상태</span>
              <span className="flex items-center gap-1.5 text-xs font-bold">
                {isSupabaseConfigured ? (
                  <span className="flex items-center gap-1 text-emerald-600">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    Supabase 데이터베이스 연결됨
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-amber-600">
                    <span className="h-2 w-2 rounded-full bg-amber-500" />
                    로컬 시뮬레이션 모드 (DB 연동 준비)
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Supabase SQL Editor 작성용 가이드 아코디언 */}
        <div className="mb-8 overflow-hidden rounded-3xl border border-blue-200/70 bg-white/90 shadow-sm backdrop-blur-xl">
          <button
            type="button"
            onClick={() => setShowSqlGuide(!showSqlGuide)}
            className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-blue-50/40"
          >
            <div className="flex items-center gap-2.5 text-sm font-bold text-blue-900">
              <Sparkles className="h-4 w-4 text-blue-600" />
              <span>선생님 전용: Supabase SQL Editor에 붙여넣을 데이터베이스 쿼리문 보기</span>
            </div>
            <span className="text-xs font-semibold text-blue-600 underline">
              {showSqlGuide ? "닫기" : "쿼리문 보기 및 복사"}
            </span>
          </button>

          {showSqlGuide && (
            <div className="border-t border-blue-100 bg-slate-900 p-6 text-slate-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-400">
                  Supabase 대시보드 &gt; SQL Editor에 복사하여 실행하세요.
                </span>
                <button
                  type="button"
                  onClick={copySqlToClipboard}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition-all hover:bg-blue-500 active:scale-95"
                >
                  {isCopied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-300" /> 복사됨!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" /> SQL 복사하기
                    </>
                  )}
                </button>
              </div>
              <pre className="overflow-x-auto rounded-2xl bg-slate-950 p-4 text-xs font-mono text-emerald-400 leading-relaxed">
                {sqlQueryText}
              </pre>
            </div>
          )}
        </div>

        {/* 메인 콘텐츠 2열 레이아웃 */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          
          {/* 독서기록 작성 폼 (좌측 5열) */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-gray-200/70 bg-white/90 p-6 shadow-sm backdrop-blur-xl md:p-8">
              <div className="flex items-center gap-2 text-base font-bold text-slate-900">
                <BookMarked className="h-5 w-5 text-blue-600" />
                <h2>새 독서기록 작성</h2>
              </div>

              <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
                
                {/* 学番 & 이름 (2열) */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700">
                      학번 <span className="text-red-500">*</span>
                    </label>
                    <div className="relative mt-1.5">
                      <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        placeholder="예: 20101"
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-gray-50/50 pl-9 pr-3 py-2.5 text-xs font-medium text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700">
                      이름 <span className="text-red-500">*</span>
                    </label>
                    <div className="relative mt-1.5">
                      <input
                        type="text"
                        required
                        placeholder="예: 홍길동"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-gray-50/50 px-3 py-2.5 text-xs font-medium text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 기록 날짜 */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    기록 날짜 <span className="text-red-500">*</span>
                  </label>
                  <div className="relative mt-1.5">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type="date"
                      required
                      value={readDate}
                      onChange={(e) => setReadDate(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-gray-50/50 pl-9 pr-3 py-2.5 text-xs font-medium text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* 책이름 */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    책 이름 <span className="text-red-500">*</span>
                  </label>
                  <div className="relative mt-1.5">
                    <BookOpen className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="예: 코스모스"
                      value={bookTitle}
                      onChange={(e) => setBookTitle(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-gray-50/50 pl-9 pr-3 py-2.5 text-xs font-medium text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* 저자 */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    저자 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="예: 칼 세이건"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="mt-1.5 w-full rounded-2xl border border-slate-200 bg-gray-50/50 px-3 py-2.5 text-xs font-medium text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none"
                  />
                </div>

                {/* 새롭게 알게된 점 */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    새롭게 알게된 점 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="책을 읽고 새롭게 깨달은 사실이나 인상 깊었던 느낀 점을 자유롭게 적어보세요."
                    value={newLearnings}
                    onChange={(e) => setNewLearnings(e.target.value)}
                    className="mt-1.5 w-full rounded-2xl border border-slate-200 bg-gray-50/50 p-3 text-xs font-medium leading-relaxed text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none"
                  />
                </div>

                {/* 제출 버튼 */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-3.5 text-xs font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-500 active:scale-95 disabled:opacity-50"
                >
                  <Plus className="h-4 w-4" />
                  <span>{isLoading ? "저장 중..." : "독서기록 저장하기"}</span>
                </button>

              </form>
            </div>
          </div>

          {/* 등록된 독서기록 목록 (우측 7열) */}
          <div className="flex flex-col gap-4 lg:col-span-7">
            
            {/* 검색 및 필터 헤더 */}
            <div className="flex items-center justify-between gap-4 rounded-3xl border border-gray-200/70 bg-white/90 p-4 px-6 shadow-sm backdrop-blur-xl">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="학생 이름, 학번, 책 제목으로 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-9 pr-3 py-2 text-xs text-slate-800 focus:border-blue-600 focus:bg-white focus:outline-none"
                />
              </div>
              <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
                총 {filteredLogs.length} 건
              </span>
            </div>

            {/* 카드 목록 */}
            <div className="flex flex-col gap-4">
              {filteredLogs.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-300 bg-white/60 py-16 text-center">
                  <FileText className="h-10 w-10 text-slate-300" />
                  <p className="mt-3 text-sm font-semibold text-slate-600">
                    등록된 독서기록이 없습니다.
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    왼쪽 양식을 통해 학생의 첫 독서기록을 작성해 보세요!
                  </p>
                </div>
              ) : (
                filteredLogs.map((log) => (
                  <div
                    key={log.id}
                    className="group relative rounded-3xl border border-gray-200/80 bg-white/90 p-6 shadow-sm backdrop-blur-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                  >
                    {/* 카드 상단 배지 (학번, 이름, 날짜) */}
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-extrabold text-blue-700">
                          {log.student_id}
                        </span>
                        <span className="text-sm font-bold text-slate-900">
                          {log.student_name} 학생
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-xs text-slate-400">
                          <Calendar className="h-3.5 w-3.5" />
                          {log.read_date}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDelete(log.id)}
                          className="opacity-0 transition-opacity group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500"
                          title="삭제"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* 책 정보 */}
                    <div className="mt-4">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-blue-600" />
                        <h3 className="text-base font-extrabold text-slate-900">
                          {log.book_title}
                        </h3>
                      </div>
                      <p className="mt-0.5 text-xs font-semibold text-slate-500 pl-6">
                        저자: {log.author}
                      </p>
                    </div>

                    {/* 새롭게 알게된 점 */}
                    <div className="mt-4 rounded-2xl bg-gray-50/80 p-4 border border-gray-100">
                      <span className="text-[11px] font-bold text-blue-600 block mb-1">
                        💡 새롭게 알게된 점
                      </span>
                      <p className="text-xs leading-relaxed text-slate-700 whitespace-pre-line">
                        {log.new_learnings}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
