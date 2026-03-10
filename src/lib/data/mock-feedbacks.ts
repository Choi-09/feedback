import type { FeedbackListItem } from '@/lib/types/feedback';

// 더미 피드백 데이터 (Task 012에서 실제 데이터로 교체 예정)
export const mockFeedbacks: FeedbackListItem[] = [
  {
    id: '1',
    category: 'llm',
    content:
      'Claude 모델 응답 속도가 이전보다 많이 개선되었습니다. 특히 코드 생성 시 정확도가 높아진 것 같아요.',
    created_at: '2026-03-10T09:00:00Z',
    updated_at: '2026-03-10T09:00:00Z',
    is_mine: true,
  },
  {
    id: '2',
    category: 'llm',
    content:
      '프롬프트 템플릿 기능이 있으면 좋겠습니다. 자주 사용하는 질문 형식을 저장하고 재사용할 수 있으면 업무 효율이 올라갈 것 같습니다.',
    created_at: '2026-03-09T14:30:00Z',
    updated_at: '2026-03-09T14:30:00Z',
    is_mine: false,
  },
  {
    id: '3',
    category: 'llm',
    content: '한국어 문서 요약 시 가끔 핵심 내용이 누락되는 경우가 있습니다.',
    created_at: '2026-03-08T11:15:00Z',
    updated_at: '2026-03-08T11:15:00Z',
    is_mine: false,
  },
  {
    id: '4',
    category: 'llm',
    content:
      '대화 히스토리 검색 기능이 추가되면 좋겠습니다. 이전에 했던 대화를 다시 찾기 어렵습니다.',
    created_at: '2026-03-07T16:45:00Z',
    updated_at: '2026-03-07T16:45:00Z',
    is_mine: false,
  },
  {
    id: '5',
    category: 'llm',
    content:
      '파일 업로드 후 분석 기능이 정말 유용합니다. PDF 분석 정확도가 특히 좋습니다.',
    created_at: '2026-03-06T10:00:00Z',
    updated_at: '2026-03-06T10:00:00Z',
    is_mine: true,
  },
  {
    id: '6',
    category: 'erp',
    content:
      '거래처 검색 시 자동완성 기능이 느립니다. 글자를 입력할 때마다 1~2초 정도 딜레이가 있습니다.',
    created_at: '2026-03-10T08:00:00Z',
    updated_at: '2026-03-10T08:00:00Z',
    is_mine: false,
  },
  {
    id: '7',
    category: 'erp',
    content:
      '월별 매출 리포트에 차트 시각화가 추가되면 좋겠습니다. 현재는 숫자만 나열되어 있어서 추이를 파악하기 어렵습니다.',
    created_at: '2026-03-09T15:20:00Z',
    updated_at: '2026-03-09T15:20:00Z',
    is_mine: true,
  },
  {
    id: '8',
    category: 'erp',
    content: '재고 관리 화면에서 엑셀 내보내기 기능이 필요합니다.',
    created_at: '2026-03-08T13:00:00Z',
    updated_at: '2026-03-08T13:00:00Z',
    is_mine: false,
  },
  {
    id: '9',
    category: 'erp',
    content:
      '발주서 작성 시 이전 발주 내역을 복사하는 기능이 있으면 편리할 것 같습니다.',
    created_at: '2026-03-07T09:30:00Z',
    updated_at: '2026-03-07T09:30:00Z',
    is_mine: false,
  },
  {
    id: '10',
    category: 'erp',
    content:
      '모바일에서 ERP 접속 시 화면이 깨지는 문제가 있습니다. 반응형 대응이 필요합니다.',
    created_at: '2026-03-06T17:00:00Z',
    updated_at: '2026-03-06T17:00:00Z',
    is_mine: false,
  },
];
