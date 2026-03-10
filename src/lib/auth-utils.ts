// 한글 이름을 Supabase Auth용 내부 이메일로 변환 (서버 전용, Buffer API 사용)
export function toEmail(name: string): string {
  const encoded = Buffer.from(name, 'utf-8').toString('hex');
  return `u-${encoded}@feedback.internal`;
}
