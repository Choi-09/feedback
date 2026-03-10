// 엑셀 다운로드 API Route (빈 골격 — Task 015에서 실제 구현 예정)
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    { message: '엑셀 다운로드 API (미구현)' },
    { status: 501 },
  );
}
