// 피드백 카테고리 타입 (LLM 서비스 / ERP 시스템)
export type FeedbackCategory = 'llm' | 'erp';

// Server Action 공통 반환 타입
// errors 필드는 React Hook Form의 setError와 연동 가능한 형태
export type ActionResult<T = void> = {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
};
