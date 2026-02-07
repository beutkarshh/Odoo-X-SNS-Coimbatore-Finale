const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    console.log('\n========== USERS IN DATABASE ==========\n');
    
    if (users.length === 0) {
      console.log('❌ No users found in database!\n');
    } else {
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.name}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   ID: ${user.id}`);
        console.log(`   Created: ${user.createdAt.toISOString()}`);
        console.log('');
      });
      console.log(`✅ Total users: ${users.length}\n`);
    }

    console.log('========================================\n');
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();
