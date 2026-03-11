import type { FeedbackCategory } from '@/lib/types/common';

// DB feedbacks 테이블 전체 매핑 (서버 내부 전용 — 클라이언트에 반환 금지)
export type Feedback = {
  id: string;
  category: FeedbackCategory;
  content: string;
  author_id: string;
  created_at: string;
  updated_at: string;
};

// 일반 사용자 목록 응답 (익명성 보장: author_id 제거, is_mine 플래그 사용)
export type FeedbackListItem = {
  id: string;
  category: FeedbackCategory;
  content: string;
  created_at: string;
  updated_at: string;
  is_mine: boolean;
  keyword_emoji: string | null;
  keyword_label: string | null;
};

// 관리자 목록 응답 (작성자 이름 포함)
export type AdminFeedbackListItem = FeedbackListItem & {
  author_name: string;
};

// 단건 조회용 (수정 페이지, 본인 작성건만)
export type FeedbackDetail = {
  id: string;
  category: FeedbackCategory;
  content: string;
  created_at: string;
  updated_at: string;
};
