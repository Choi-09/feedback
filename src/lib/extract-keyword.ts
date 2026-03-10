// 피드백 콘텐츠에서 키워드 자동 추출 (패턴 매칭)
type Keyword = { emoji: string; label: string };

const PATTERNS: { pattern: RegExp; emoji: string; label: string }[] = [
  // 구체적 패턴 우선
  {
    pattern: /UX|온보딩|첫\s*페이지|메뉴.*설명|사용.*방법/,
    emoji: '🎯',
    label: 'UX/온보딩',
  },
  {
    pattern: /파일\s*(?:형식|확장자|지원|업로드)|JPEG|PNG|PDF|DOCX|JWP|TXT/i,
    emoji: '📂',
    label: '파일 지원',
  },
  { pattern: /XLSX|엑셀\s*파일/i, emoji: '📗', label: 'XLSX 지원' },
  {
    pattern: /파싱|Parse|분할|구조\s*변경|변환/i,
    emoji: '⚙️',
    label: '파싱/변환',
  },
  {
    pattern: /시인성|출력.*형태|정리.*형태|결과.*표시/,
    emoji: '🖥️',
    label: '파싱 UI',
  },
  { pattern: /검색|찾기|조회|필터/, emoji: '🔍', label: '검색/조회' },
  {
    pattern: /보안|암호화|로그\s*파일|해독|암호키/,
    emoji: '🔐',
    label: '보안/로그',
  },
  {
    pattern: /계정|패스워드|비밀번호|로그인/,
    emoji: '🔑',
    label: '계정 관리',
  },
  {
    pattern: /챗봇|지능형|트러블슈팅|매뉴얼/,
    emoji: '🤖',
    label: '지능형 챗봇',
  },
  {
    pattern: /설계\s*문서|명세서|설계서|데이터베이스\s*설계/,
    emoji: '📝',
    label: '설계문서 작성',
  },
  {
    pattern: /워크플로우|프로세스|절차|단계.*선행/,
    emoji: '🔄',
    label: '워크플로우',
  },
  { pattern: /경쟁|차별|비교|플랫폼/, emoji: '📊', label: '경쟁력' },
  {
    pattern: /투명|공개|알\s*수\s*없|데이터.*어떤/,
    emoji: '👁️',
    label: '투명성',
  },
  {
    pattern: /페이지\s*제한|최대.*페이지|문서.*제한/,
    emoji: '📄',
    label: '문서 제한',
  },
  { pattern: /권한|접근|관리자/, emoji: '🛡️', label: '권한 관리' },
  { pattern: /알림|통보|메일|노티/, emoji: '🔔', label: '알림' },
  { pattern: /연동|통합|API|인터페이스/, emoji: '🔗', label: '시스템 연동' },
  { pattern: /리포트|보고서|통계|현황/, emoji: '📈', label: '리포트' },
  // 일반 패턴 (후순위)
  {
    pattern: /개선|수\s*있도록|요청|요망/,
    emoji: '✨',
    label: '기능 개선',
  },
  { pattern: /추가|필요|지원/, emoji: '➕', label: '기능 추가' },
  { pattern: /불편|어렵|문제|오류/, emoji: '⚠️', label: '불편 사항' },
];

export function extractKeyword(content: string): Keyword {
  for (const { pattern, emoji, label } of PATTERNS) {
    if (pattern.test(content)) {
      return { emoji, label };
    }
  }
  return { emoji: '💬', label: '피드백' };
}
