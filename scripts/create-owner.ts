import { PrismaClient, UserRole } from '@prisma/client';
import { hashPassword } from '../lib/auth';

const prisma = new PrismaClient();

async function createOwner() {
  try {
    const email = 'oomraraq0@gmail.com';
    const password = 'AAaa4321';
    const username = 'owner';

    // التحقق من وجود المستخدم
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log('⚠️  حساب المالك موجود بالفعل!');
      console.log(`   Email: ${existingUser.email}`);
      console.log(`   Username: ${existingUser.username}`);
      console.log(`   Role: ${existingUser.role}`);
      
      // تحديث الدور إذا لم يكن ADMIN
      if (existingUser.role !== UserRole.ADMIN) {
        await prisma.user.update({
          where: { id: existingUser.id },
          data: { role: UserRole.ADMIN },
        });
        console.log('✅ تم تحديث الدور إلى ADMIN');
      }
      
      return;
    }

    // التحقق من وجود username
    const existingUsername = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUsername) {
      console.log('⚠️  اسم المستخدم "owner" موجود بالفعل!');
      console.log('   سيتم استخدام اسم مستخدم مختلف...');
    }

    // إنشاء حساب المالك
    const passwordHash = await hashPassword(password);
    
    const owner = await prisma.user.create({
      data: {
        email,
        username: existingUsername ? `owner_${Date.now()}` : username,
        passwordHash,
        role: UserRole.ADMIN,
        emailVerified: true,
        isBanned: false,
      },
    });

    console.log('✅ تم إنشاء حساب المالك بنجاح!');
    console.log('');
    console.log('📧 معلومات الحساب:');
    console.log(`   Email: ${owner.email}`);
    console.log(`   Username: ${owner.username}`);
    console.log(`   Role: ${owner.role}`);
    console.log(`   ID: ${owner.id}`);
    console.log('');
    console.log('🔐 بيانات تسجيل الدخول:');
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log('');
    console.log('🚀 يمكنك الآن تسجيل الدخول من:');
    console.log('   http://localhost:3000/login/admin');
  } catch (error) {
    console.error('❌ خطأ في إنشاء حساب المالك:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

createOwner();

