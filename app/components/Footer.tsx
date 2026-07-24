import React from "react";
import { Heart } from "lucide-react";

/**
 * 하단 푸터 컴포넌트
 * - 카피라이트 및 하단 정렬 정보 표시
 */
export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-200/60 bg-white/50 py-8 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-center md:flex-row md:px-8 md:text-left">
        {/* 서비스 이름 및 카피라이트 */}
        <div className="flex flex-col gap-1">
          <p className="text-xs font-semibold text-slate-800">himath Edu Platform</p>
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} himath. All rights reserved.
          </p>
        </div>

        {/* 선생님 응원 문구 */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <span>Created with</span>
          <Heart className="h-3.5 w-3.5 fill-red-500 text-red-500" />
          <span>for Teachers & Students</span>
        </div>
      </div>
    </footer>
  );
}
