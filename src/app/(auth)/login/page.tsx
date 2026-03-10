import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { LoginForm } from '@/components/login-form';

export default function LoginPage() {
  return (
    <div className="w-full max-w-sm px-4">
      <Card>
        <CardHeader>
          <CardTitle>피드백</CardTitle>
          <CardDescription>
            이름과 비밀번호를 입력하여 로그인하세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}
