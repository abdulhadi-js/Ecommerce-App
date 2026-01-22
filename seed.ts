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

  // Inside the main() function of seed.ts

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