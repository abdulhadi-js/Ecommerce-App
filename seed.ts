const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10);
  
  await prisma.user.upsert({
    where: { email: "admin@luxe.com" },
    update: {},
    create: {
      email: "admin@luxe.com",
      name: "Admin User",
      password: hashedPassword,
      role: "ADMIN",
    },
  });
  
  console.log("✅ Admin user created: admin@luxe.com / admin123");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });