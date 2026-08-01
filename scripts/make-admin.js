const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  try {
    const result = await prisma.$executeRawUnsafe(`
      UPDATE auth.users
      SET raw_user_meta_data = jsonb_set(
        COALESCE(raw_user_meta_data, '{}'::jsonb),
        '{role}',
        '"admin"'
      )
      WHERE raw_user_meta_data->>'name' = 'ageng prayoga';
    `);
    
    console.log(`Successfully updated ${result} user(s) to admin.`);
  } catch(e) {
    console.error("Error updating user:", e.message);
  }
}

main().finally(() => prisma.$disconnect());
