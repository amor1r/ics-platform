'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Terminal } from '@/components/ui/terminal';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background-primary flex items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-2xl">
        <div>
          <h1 className="text-6xl font-bold text-secondary-500 mb-4">500</h1>
          <h2 className="text-3xl font-semibold text-text-primary mb-4">
            حدث خطأ غير متوقع
          </h2>
          <p className="text-text-secondary text-lg">
            نعتذر، حدث خطأ في السيرفر. يرجى المحاولة مرة أخرى
          </p>
        </div>

        <Terminal title="Error Log">
          <div className="space-y-2 text-text-secondary">
            <div>
              <span className="text-secondary-500">ERROR:</span>{' '}
              <span className="text-text-primary">{error.message || 'Unknown error'}</span>
            </div>
            {error.digest && (
              <div>
                <span className="text-primary-500">DIGEST:</span>{' '}
                <span className="text-text-primary">{error.digest}</span>
              </div>
            )}
            <div>
              <span className="text-accent-500">STATUS:</span>{' '}
              <span className="text-text-primary">500 Internal Server Error</span>
            </div>
          </div>
        </Terminal>

        <div className="flex gap-4 justify-center">
          <Button onClick={reset}>
            إعادة المحاولة
          </Button>
          <Button asChild variant="outline">
            <Link href="/">العودة للصفحة الرئيسية</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

