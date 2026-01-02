import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Terminal } from '@/components/ui/terminal';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background-primary flex items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-2xl">
        <div>
          <h1 className="text-6xl font-bold text-primary-500 mb-4">404</h1>
          <h2 className="text-3xl font-semibold text-text-primary mb-4">
            الصفحة غير موجودة
          </h2>
          <p className="text-text-secondary text-lg">
            الصفحة التي تبحث عنها غير موجودة أو تم نقلها
          </p>
        </div>

        <Terminal title="Error Log">
          <div className="space-y-2 text-text-secondary">
            <div>
              <span className="text-secondary-500">ERROR:</span>{' '}
              <span className="text-text-primary">Page not found</span>
            </div>
            <div>
              <span className="text-primary-500">PATH:</span>{' '}
              <span className="text-text-primary">Unknown route</span>
            </div>
            <div>
              <span className="text-accent-500">STATUS:</span>{' '}
              <span className="text-text-primary">404 Not Found</span>
            </div>
          </div>
        </Terminal>

        <div className="flex gap-4 justify-center">
          <Button asChild>
            <Link href="/">العودة للصفحة الرئيسية</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/member/dashboard">لوحة التحكم</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

