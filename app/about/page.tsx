import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background-primary">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-4xl font-bold text-primary-500">من نحن</h1>
          
          <div className="space-y-4 text-text-secondary">
            <p>
              ICS - Information Cyber Security هي منصة تعليمية متخصصة في الأمن السيبراني
              مصممة لتدريب الفرق وتطوير مهاراتهم في مجال الأمن السيبراني.
            </p>
            
            <p>
              نقدم محتوى تعليمي شامل يغطي:
            </p>
            
            <ul className="list-disc list-inside space-y-2 mr-4">
              <li>أدوات الأمن السيبراني</li>
              <li>كالي لينكس والأوامر المتقدمة</li>
              <li>مفاهيم الأمن السيبراني العامة</li>
              <li>التحضير لمسابقات CTF</li>
            </ul>

            <p>
              المنصة مصممة بأعلى معايير الأمان مع نظام صلاحيات متقدم يضمن حماية
              البيانات والمحتوى.
            </p>
          </div>

          <div className="pt-8">
            <Button asChild>
              <Link href="/">العودة للصفحة الرئيسية</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

