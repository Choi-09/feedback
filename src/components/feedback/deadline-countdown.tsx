'use client';

import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

// 마감일: 2026년 3월 13일 금요일 14:00 KST
const DEADLINE = new Date('2026-03-13T14:00:00+09:00');

function getTimeLeft() {
  const diff = DEADLINE.getTime() - Date.now();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    expired: false,
  };
}

export function DeadlineCountdown() {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(getTimeLeft);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // SSR/hydration 불일치 방지: 마운트 전 정적 텍스트
  if (!mounted) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm">
        <Clock className="size-4 text-amber-600" />
        <span className="text-amber-800">마감: 3/13(금) 14:00</span>
      </div>
    );
  }

  if (timeLeft.expired) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-center text-sm font-medium text-destructive">
        피드백 제출이 마감되었습니다
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm">
      <Clock className="size-4 shrink-0 text-amber-600" />
      <span className="text-amber-800">
        마감까지{' '}
        <strong>
          {timeLeft.days}일 {timeLeft.hours}시간 {timeLeft.minutes}분{' '}
          {timeLeft.seconds}초
        </strong>{' '}
        남았습니다
        <span className="ml-1.5 text-amber-600">(마감기한: 3/13 금 14:00)</span>
      </span>
    </div>
  );
}
