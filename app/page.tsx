import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Terminal } from '@/components/ui/terminal';
import { GlitchText } from '@/components/ui/glitch-text';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background-primary">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center space-y-8">
          <h1 className="text-6xl font-bold font-display">
            <GlitchText>ICS</GlitchText>
            <span className="text-text-primary"> - Information Cyber Security</span>
          </h1>
          
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            منصة تعليمية احترافية للأمن السيبراني وكالي لينكس
          </p>

          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/register">إنشاء حساب</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/login">تسجيل الدخول</Link>
            </Button>
          </div>
        </div>

        {/* Terminal Demo */}
        <div className="mt-20 max-w-3xl mx-auto">
          <Terminal title="ICS Terminal" prompt="root@ics:~#">
            <div className="space-y-2 text-text-secondary">
              <div>
                <span className="text-accent-500">Welcome to ICS Platform</span>
              </div>
              <div>
                <span className="text-primary-500">Type</span>{' '}
                <span className="text-text-primary">&apos;help&apos;</span>{' '}
                <span className="text-primary-500">to get started</span>
              </div>
            </div>
          </Terminal>
        </div>

        {/* Features */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 border border-background-tertiary rounded-lg bg-background-secondary hover:border-primary-500 transition-colors">
            <h3 className="text-xl font-semibold mb-2 text-primary-500">
              مشاريع تعليمية
            </h3>
            <p className="text-text-secondary">
              محتوى تعليمي شامل يغطي جميع جوانب الأمن السيبراني
            </p>
          </div>

          <div className="p-6 border border-background-tertiary rounded-lg bg-background-secondary hover:border-primary-500 transition-colors">
            <h3 className="text-xl font-semibold mb-2 text-accent-500">
              أدوات Kali Linux
            </h3>
            <p className="text-text-secondary">
              شرح مفصل لأدوات كالي لينكس وأوامرها
            </p>
          </div>

          <div className="p-6 border border-background-tertiary rounded-lg bg-background-secondary hover:border-primary-500 transition-colors">
            <h3 className="text-xl font-semibold mb-2 text-secondary-500">
              تحضير CTF
            </h3>
            <p className="text-text-secondary">
              استعد لمسابقات Capture The Flag المستقبلية
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
