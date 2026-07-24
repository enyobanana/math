import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

/**
 * 수학 AI 챗봇 API Route Handler
 * POST /api/chat
 * - 환경변수 openai_api_key 또는 OPENAI_API_KEY를 사용하여 OpenAI API 호출
 * - 서버 사이드에서만 API 키에 접근 (클라이언트 노출 방지)
 */

// 수학 전문 시스템 프롬프트 (선생님 역할 부여)
const SYSTEM_PROMPT = `너는 "himath"라는 수학 교육 웹사이트의 친절한 AI 수학 선생님이야.
학생들이 수학 질문을 하면 친절하고 이해하기 쉽게 답변해 줘.

규칙:
1. 초등학생~고등학생 수준의 수학 질문에 답변해 줘.
2. 풀이 과정을 단계별로 알기 쉽게 설명해 줘.
3. 중요한 수학 개념이나 공식은 강조해서 알려줘.
4. 학생을 격려하고 칭찬하는 따뜻한 말투를 사용해.
5. 수학과 관련 없는 질문이 들어오면 정중하게 수학 관련 질문을 부탁해.
6. 답변은 한국어로 해 줘.`;

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.openai_api_key || process.env.OPENAI_API_KEY;

    // API 키 설정 여부 확인
    if (!apiKey) {
      return NextResponse.json(
        { error: "환경변수에 openai_api_key 또는 OPENAI_API_KEY가 설정되지 않았습니다." },
        { status: 500 }
      );
    }

    const openai = new OpenAI({ apiKey });

    const body = await request.json();
    const { messages } = body as {
      messages: { role: "user" | "assistant"; content: string }[];
    };

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: "메시지가 비어있습니다." },
        { status: 400 }
      );
    }

    // OpenAI Chat Completion API 호출
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages,
      ],
      max_tokens: 1500,
      temperature: 0.7,
    });

    const reply = completion.choices[0]?.message?.content || "답변을 생성하지 못했습니다.";

    return NextResponse.json({ reply });
  } catch (error: unknown) {
    console.error("OpenAI API 에러:", error);
    const message =
      error instanceof Error ? error.message : "알 수 없는 에러가 발생했습니다.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

