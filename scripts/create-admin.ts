import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    console.log('🔐 Creating admin user...');

    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@ics.com' },
    });

    if (existingAdmin) {
      console.log('✅ Admin user already exists!');
      console.log('📧 Email: admin@ics.com');
      console.log('🔑 Password: Admin123!@#Password');
      return;
    }

    // Hash password
    const passwordHash = await bcrypt.hash('Admin123!@#Password', 12);

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        email: 'admin@ics.com',
        username: 'admin',
        passwordHash,
        role: 'ADMIN',
        emailVerified: true,
      },
    });

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@ics.com');
    console.log('👤 Username: admin');
    console.log('🔑 Password: Admin123!@#Password');
    console.log('🆔 User ID:', admin.id);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();

