// 피드백 콘텐츠에서 키워드 자동 추출 (패턴 매칭)
type Keyword = { emoji: string; label: string };

const PATTERNS: { pattern: RegExp; emoji: string; label: string }[] = [
  // 1단계: [대괄호] 제목 우선 매칭
  { pattern: /^\[급여/, emoji: '💰', label: '급여 관리' },
  { pattern: /^\[근태/, emoji: '📅', label: '근태 관리' },

  // 2단계: ERP 도메인별 (구체적 → 일반 순)
  {
    pattern: /연차|반차|휴가|잔여\s*연차|취업규칙/,
    emoji: '🏖️',
    label: '연차/휴가',
  },
  {
    pattern: /급여|수당|복지비|경비|지출\s*결의/,
    emoji: '💰',
    label: '경비/급여',
  },
  {
    pattern: /출장.*차량|차량\s*(?:사용|예약|관리)/,
    emoji: '🚗',
    label: '차량 관리',
  },
  { pattern: /일정.*등록|일정.*관리|달력/, emoji: '📅', label: '일정 관리' },
  { pattern: /미팅룸|예약/, emoji: '🏢', label: '예약 관리' },
  { pattern: /업무일지|카드번호|계정과목/, emoji: '📋', label: '업무일지' },
  { pattern: /대시보드|대쉬보드/, emoji: '📊', label: '대시보드' },
  { pattern: /문서\s*양식|양식\s*조회/, emoji: '📄', label: '문서 양식' },
  { pattern: /모바일\s*화면|모바일/, emoji: '📱', label: '모바일' },
  {
    pattern: /즐겨\s*찾기|즐겨찾기/,
    emoji: '⭐',
    label: '즐겨찾기',
  },
  {
    pattern: /출장.*현황|휴가.*현황|부서.*별/,
    emoji: '👥',
    label: '부서별 현황',
  },
  { pattern: /직원\s*검색|부서.*전화/, emoji: '🔍', label: '직원 검색' },
  {
    pattern: /자재.*구매|품목.*찾기/,
    emoji: '📦',
    label: '자재 관리',
  },

  // 3단계: LLM 도메인별
  {
    pattern: /UX|첫\s*페이지|메뉴.*설명|사용.*방법/,
    emoji: '🎯',
    label: 'UX 개선',
  },
  {
    pattern: /스크롤|자동.*내려|답변.*볼\s*수\s*없/,
    emoji: '📜',
    label: '스크롤 UX',
  },
  {
    pattern: /시인성|Layout|레이아웃|정리.*보여/,
    emoji: '🖥️',
    label: '답변 시인성',
  },
  {
    pattern: /파일\s*(?:형식|확장자|지원|업로드)|JPEG|PNG|PDF|DOCX|JWP|TXT/i,
    emoji: '📂',
    label: '파일 지원',
  },
  { pattern: /XLSX|엑셀/i, emoji: '📗', label: 'XLSX 지원' },
  {
    pattern: /이미지.*파일.*혼합|혼합.*채팅/,
    emoji: '🖼️',
    label: '멀티모달',
  },
  {
    pattern: /파싱|Parse|분할/i,
    emoji: '⚙️',
    label: '파싱/변환',
  },
  {
    pattern: /페이지\s*수|최대.*페이지|페이지.*제한/,
    emoji: '📄',
    label: '페이지 제한',
  },
  {
    pattern: /암호화|로그\s*파일|해독|암호키/,
    emoji: '🔐',
    label: '보안/로그',
  },
  {
    pattern: /계정|패스워드|비밀번호/,
    emoji: '🔑',
    label: '계정 관리',
  },
  {
    pattern: /챗봇|지능형|트러블슈팅/,
    emoji: '🤖',
    label: '지능형 챗봇',
  },
  {
    pattern: /설계\s*문서|설계서|객체모형|코드\s*기반/,
    emoji: '📝',
    label: '설계문서',
  },
  {
    pattern: /지식\s*기반|지식.*검색/,
    emoji: '📚',
    label: '지식 검색',
  },
  { pattern: /IDE|코드\s*작업/, emoji: '💻', label: 'IDE 연동' },
  {
    pattern: /다른\s*ai|플랫폼.*나은|경쟁|비교/,
    emoji: '📊',
    label: '경쟁력',
  },

  // 4단계: 공통 (후순위)
  {
    pattern: /검색.*정렬|정렬.*검색|검색.*기능|검색.*유지/,
    emoji: '🔍',
    label: '검색/정렬',
  },
  { pattern: /세션|오류|에러|버그/, emoji: '🐛', label: '버그 수정' },
  {
    pattern: /권한|접근.*없/,
    emoji: '🛡️',
    label: '권한 관리',
  },
  { pattern: /개선|수정\s*필요/, emoji: '✨', label: '기능 개선' },
  { pattern: /추가|필요|지원/, emoji: '➕', label: '기능 추가' },
  { pattern: /불편|어렵/, emoji: '⚠️', label: '불편 사항' },
];

export function extractKeyword(content: string): Keyword {
  for (const { pattern, emoji, label } of PATTERNS) {
    if (pattern.test(content)) {
      return { emoji, label };
    }
  }
  return { emoji: '💬', label: '피드백' };
}
