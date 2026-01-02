import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createMember() {
  try {
    console.log('👤 Creating member user...');

    // Check if member already exists
    const existingMember = await prisma.user.findUnique({
      where: { email: 'member@ics.com' },
    });

    if (existingMember) {
      console.log('✅ Member user already exists!');
      console.log('📧 Email: member@ics.com');
      console.log('🔑 Password: Member123!@#Password');
      return;
    }

    // Hash password
    const passwordHash = await bcrypt.hash('Member123!@#Password', 12);

    // Create member user
    const member = await prisma.user.create({
      data: {
        email: 'member@ics.com',
        username: 'member',
        passwordHash,
        role: 'USER',
        emailVerified: true,
        birthdate: new Date('1990-01-01'),
      },
    });

    console.log('✅ Member user created successfully!');
    console.log('📧 Email: member@ics.com');
    console.log('👤 Username: member');
    console.log('🔑 Password: Member123!@#Password');
    console.log('🆔 User ID:', member.id);
  } catch (error) {
    console.error('❌ Error creating member:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

createMember();

