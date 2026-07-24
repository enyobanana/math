import { createClient } from "@supabase/supabase-js";

/**
 * 독서기록장 데이터 모델 타입 정의
 */
export interface ReadingLog {
  id?: string;
  student_id: string;    // 학번 (예: 20101)
  student_name: string;  // 이름 (예: 홍길동)
  read_date: string;     // 독서 기록 날짜 (YYYY-MM-DD)
  book_title: string;    // 책 제목
  author: string;        // 저자
  new_learnings: string; // 새롭게 알게된 점 및 감상
  created_at?: string;   // 생성 일시
}

// Vercel / .env.local 환경 변수에서 Supabase 설정 가져오기
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

/**
 * Supabase 설정이 올바르게 되어있는지 여부
 */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

/**
 * Supabase 클라이언트 인스턴스
 * (환경변수가 없을 경우 빌드 에러를 방지하기 위해 조건부 생성)
 */
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
