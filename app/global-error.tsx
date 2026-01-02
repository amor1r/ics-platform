'use client';

export default function GlobalError({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <div className="min-h-screen bg-background-primary flex items-center justify-center p-4">
          <div className="text-center space-y-8 max-w-2xl">
            <h1 className="text-6xl font-bold text-secondary-500 mb-4">خطأ عام</h1>
            <p className="text-text-secondary text-lg">
              حدث خطأ غير متوقع في التطبيق
            </p>
            <button
              onClick={reset}
              className="px-6 py-3 bg-primary-500 text-background-primary rounded-md hover:bg-primary-600"
            >
              إعادة المحاولة
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}

