const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10);
  
  // 1. Create Admin User
  await prisma.user.upsert({
    where: { email: "admin@luxe.com" },
    update: {},
    create: {
      email: "admin@luxe.com",
      name: "Admin User",
      password: hashedPassword,
      role: "ADMIN",
      phoneNumber: "03001234567", // Added required phone number
      emailVerified: new Date(),   // Automatically verify admin so they can log in
    },
  });
  
  console.log("✅ Admin user created: admin@luxe.com / admin123");

  // 2. Create Default Categories
  const categories = [
    { name: "Mens", slug: "mens" },
    { name: "Womens", slug: "womens" },
    { name: "Kids", slug: "kids" },
    { name: "Accessories", slug: "accessories" },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: {
        name: category.name,
        slug: category.slug,
      },
    });
  }

  console.log("✅ Categories seeded successfully.");
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