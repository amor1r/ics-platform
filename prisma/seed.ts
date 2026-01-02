import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // إنشاء حساب المالك أولاً
  const ownerEmail = 'oomraraq0@gmail.com';
  const ownerPassword = 'AAaa4321';
  const ownerUsername = 'owner';

  const existingOwner = await prisma.user.findUnique({
    where: { email: ownerEmail },
  });

  if (!existingOwner) {
    const ownerPasswordHash = await bcrypt.hash(ownerPassword, 12);
    const owner = await prisma.user.create({
      data: {
        email: ownerEmail,
        username: ownerUsername,
        passwordHash: ownerPasswordHash,
        role: 'ADMIN',
        emailVerified: true,
        isBanned: false,
      },
    });
    console.log('✅ تم إنشاء حساب المالك:', owner.email);
  } else {
    // تحديث الدور إذا لم يكن ADMIN
    if (existingOwner.role !== 'ADMIN') {
      await prisma.user.update({
        where: { id: existingOwner.id },
        data: { role: 'ADMIN' },
      });
      console.log('✅ تم تحديث دور المالك إلى ADMIN');
    } else {
      console.log('ℹ️  حساب المالك موجود بالفعل');
    }
  }
  console.log('🌱 Starting seed...');

  // Create Admin User
  const adminEmail = 'admin@ics.com';
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const adminPasswordHash = await bcrypt.hash('Admin123!@#Password', 12);
    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        username: 'admin',
        passwordHash: adminPasswordHash,
        role: 'ADMIN',
        emailVerified: true,
      },
    });
    console.log('✅ Admin user created:', admin.email);
  } else {
    console.log('ℹ️  Admin user already exists');
  }

  // Create Member User
  const memberEmail = 'member@ics.com';
  const existingMember = await prisma.user.findUnique({
    where: { email: memberEmail },
  });

  if (!existingMember) {
    const memberPasswordHash = await bcrypt.hash('Member123!@#Password', 12);
    const member = await prisma.user.create({
      data: {
        email: memberEmail,
        username: 'member',
        passwordHash: memberPasswordHash,
        role: 'USER',
        emailVerified: true,
        birthdate: new Date('1990-01-01'),
      },
    });
    console.log('✅ Member user created:', member.email);
  } else {
    console.log('ℹ️  Member user already exists');
  }

  // Create Sample Project (if admin exists)
  const admin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (admin) {
    const existingProject = await prisma.project.findFirst({
      where: { title: 'مشروع تجريبي - مرحباً بك في ICS' },
    });

    if (!existingProject) {
      const project = await prisma.project.create({
        data: {
          title: 'مشروع تجريبي - مرحباً بك في ICS',
          slug: 'welcome-to-ics',
          description: 'هذا مشروع تجريبي لاختبار المنصة',
          content: `# مرحباً بك في منصة ICS

هذا مشروع تجريبي يوضح كيفية استخدام المنصة.

## الميزات

- ✅ نظام مشاريع تعليمية
- ✅ نظام تعليقات
- ✅ نظام إعجابات
- ✅ تصميم سيبراني احترافي

## كيفية الاستخدام

1. استكشف المشاريع المتاحة
2. اقرأ المحتوى التعليمي
3. أضف تعليقاتك
4. استمتع بالتعلم!

\`\`\`bash
# مثال على أمر
echo "Welcome to ICS Platform"
\`\`\`
`,
          category: 'GENERAL_CYBER',
          authorId: admin.id,
          status: 'PUBLISHED',
          allowComments: true,
          allowLikes: true,
        },
      });
      console.log('✅ Sample project created:', project.title);
    } else {
      console.log('ℹ️  Sample project already exists');
    }
  }

  console.log('🎉 Seed completed!');
  console.log('');
  console.log('👑 Owner: oomraraq0@gmail.com / AAaa4321');
  console.log('📧 Admin: admin@ics.com / Admin123!@#Password');
  console.log('📧 Member: member@ics.com / Member123!@#Password');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
