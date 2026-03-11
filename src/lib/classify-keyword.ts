// Gemini API 기반 피드백 키워드 분류 (정규화 + 정규식 폴백)
import { extractKeyword } from '@/lib/extract-keyword';

type Keyword = { emoji: string; label: string };

const SYSTEM_PROMPT = `사내 ERP/LLM 서비스 피드백을 대분류 키워드로 분류하세요.

출력 형식: 이모지 키워드 (예: 🎯 UX 개선)
- 이모지 1개 + 공백 + 한글 2~4글자
- 다른 텍스트 절대 금지

필수 분류 규칙 (반드시 아래 키워드만 사용):
- 스크롤/시인성/레이아웃/화면/UI/UX 관련 → 🎯 UX 개선
- 급여/수당/경비/복지비/지출 → 💰 급여/경비
- 연차/반차/휴가/출장 현황 → 🏖️ 연차/휴가
- 파일/엑셀/PDF/XLSX/문서 형식 → 📂 파일 지원
- 검색/정렬/필터 → 🔍 검색 개선
- 오류/에러/버그/세션 → 🐛 버그 수정
- 근태/출퇴근 → 📅 근태 관리
- 일정/달력/캘린더 → 📅 일정 관리
- 대시보드/현황판 → 📊 대시보드
- 계정/비밀번호/로그인 → 🔑 계정 관리
- 위 분류에 해당하지 않으면 내용에 맞는 키워드를 자유 생성`;

// LLM이 세분화해서 반환할 경우 대분류로 정규화
const NORMALIZE_MAP: Record<string, Keyword> = {
  '스크롤 UX': { emoji: '🎯', label: 'UX 개선' },
  '답변 시인성': { emoji: '🎯', label: 'UX 개선' },
  '화면 개선': { emoji: '🎯', label: 'UX 개선' },
  레이아웃: { emoji: '🎯', label: 'UX 개선' },
  '급여 관리': { emoji: '💰', label: '급여/경비' },
  '급여/급여': { emoji: '💰', label: '급여/경비' },
  '검색/정렬': { emoji: '🔍', label: '검색 개선' },
  '직원 검색': { emoji: '🔍', label: '검색 개선' },
  'XLSX 지원': { emoji: '📂', label: '파일 지원' },
  '페이지 제한': { emoji: '📂', label: '파일 지원' },
  '문서 양식': { emoji: '📂', label: '파일 지원' },
  멀티모달: { emoji: '📂', label: '파일 지원' },
};

// 정규화 적용
function normalize(keyword: Keyword): Keyword {
  return NORMALIZE_MAP[keyword.label] ?? keyword;
}

// Gemini 응답 파싱 (이모지 + 라벨 분리)
function parseResponse(text: string): Keyword | null {
  const trimmed = text.trim();
  // 이모지(1~2문자) + 공백 + 라벨 패턴
  const match = trimmed.match(
    /^(\p{Emoji_Presentation}|\p{Emoji}\uFE0F?)\s+(.+)$/u,
  );
  if (match) {
    return { emoji: match[1], label: match[2].trim() };
  }
  return null;
}

// 단일 키로 Gemini API 호출 시도
async function tryGemini(
  apiKey: string,
  content: string,
): Promise<Keyword | null> {
  const { GoogleGenAI } = await import('@google/genai');
  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    config: {
      systemInstruction: SYSTEM_PROMPT,
      temperature: 0,
      maxOutputTokens: 20,
    },
    contents: content,
  });

  const text = response.text?.trim();
  if (!text) return null;
  return parseResponse(text);
}

// Gemini API로 키워드 분류 (KEY1 → KEY2 → 정규식 순서로 폴백)
export async function classifyKeyword(content: string): Promise<Keyword> {
  const keys = [process.env.GEMINI_API_KEY, process.env.GEMINI_API_KEY2].filter(
    Boolean,
  ) as string[];

  for (const key of keys) {
    try {
      const result = await tryGemini(key, content);
      if (result) return normalize(result);
    } catch {
      // 이 키 실패 → 다음 키 시도
      continue;
    }
  }

  // 모든 키 실패 시 정규식 폴백 (정규화 적용)
  return normalize(extractKeyword(content));
}
