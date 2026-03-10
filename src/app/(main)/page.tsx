// 루트 경로(/) → /feedbacks 리다이렉트
import { redirect } from 'next/navigation';

export default function MainPage() {
  redirect('/feedbacks');
}
