"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Send,
  Sparkles,
  Bot,
  User,
  Trash2,
  Loader2,
} from "lucide-react";

/** 채팅 메시지 타입 */
interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

/**
 * 수학 AI 챗봇 페이지
 * - OpenAI API를 활용한 수학 질문 자동 답변 챗봇
 * - 서버 API Route(/api/chat)를 통해 안전하게 호출
 */
export default function MathChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 메시지 추가 시 자동 스크롤
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // 메시지 전송 처리
  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage: ChatMessage = { role: "user", content: trimmed };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      const data = await res.json();

      if (res.ok && data.reply) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.reply },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `⚠️ 오류: ${data.error || "답변을 가져오지 못했습니다."}`,
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ 네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Enter 키 전송
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // 대화 초기화
  const handleClear = () => {
    setMessages([]);
  };

  return (
    <div className="flex min-h-[calc(100vh-130px)] flex-col bg-gray-50/50 py-6 md:py-10">
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 md:px-8">
        
        {/* 상단 헤더 */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-blue-600"
            >
              <ArrowLeft className="h-4 w-4" />
              메인으로 돌아가기
            </Link>
            <h1 className="mt-1 text-xl font-extrabold tracking-tight text-slate-900 md:text-2xl">
              수학 AI 챗봇 🤖
            </h1>
            <p className="mt-0.5 text-xs text-slate-500">
              수학 관련 질문을 입력하면 AI 선생님이 풀이와 함께 답변해 드려요.
            </p>
          </div>
          <button
            type="button"
            onClick={handleClear}
            disabled={messages.length === 0}
            className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm hover:bg-gray-50 disabled:opacity-40"
          >
            <Trash2 className="h-3.5 w-3.5" />
            대화 초기화
          </button>
        </div>

        {/* 채팅 메시지 영역 */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto rounded-3xl border border-gray-200/80 bg-white/90 p-4 shadow-sm backdrop-blur-xl md:p-6"
        >
          {messages.length === 0 ? (
            /* 시작 안내 화면 */
            <div className="flex h-full flex-col items-center justify-center py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-50 shadow-sm">
                <Bot className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="mt-5 text-lg font-extrabold text-slate-900">
                안녕하세요! himath AI 수학 선생님입니다 👋
              </h2>
              <p className="mt-2 max-w-sm text-sm text-slate-500 leading-relaxed">
                수학과 관련된 어떤 질문이든 편하게 물어보세요.
                풀이 과정을 단계별로 친절하게 설명해 드릴게요!
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {[
                  "이차방정식 x²-5x+6=0 풀어줘",
                  "원의 넓이 공식 알려줘",
                  "에라토스테네스의 체가 뭐야?",
                ].map((example) => (
                  <button
                    key={example}
                    type="button"
                    onClick={() => {
                      setInput(example);
                    }}
                    className="rounded-2xl border border-blue-100 bg-blue-50/60 px-3.5 py-2 text-xs font-semibold text-blue-700 transition-all hover:bg-blue-100/60 active:scale-95"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* 메시지 목록 */
            <div className="flex flex-col gap-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-3 ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {/* AI 아바타 */}
                  {msg.role === "assistant" && (
                    <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm">
                      <Sparkles className="h-4 w-4" />
                    </div>
                  )}

                  {/* 메시지 버블 */}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white rounded-br-lg"
                        : "bg-gray-100 text-slate-800 border border-gray-200/60 rounded-bl-lg"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>

                  {/* 학생 아바타 */}
                  {msg.role === "user" && (
                    <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl bg-slate-200 text-slate-600">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </div>
              ))}

              {/* 로딩 인디케이터 */}
              {isLoading && (
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div className="flex items-center gap-2 rounded-2xl border border-gray-200/60 bg-gray-100 px-4 py-3 text-sm text-slate-500">
                    <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                    <span>AI 선생님이 답변을 작성 중입니다...</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 입력 영역 */}
        <div className="mt-4 flex gap-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="수학 질문을 입력하세요... (Shift+Enter로 줄바꿈)"
            rows={1}
            className="flex-1 resize-none rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-blue-600 focus:outline-none"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-5 py-3 text-white shadow-sm transition-all hover:bg-blue-500 active:scale-95 disabled:opacity-40"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
