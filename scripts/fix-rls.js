const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  try {
    // Allow any authenticated or anon user to upload to laporpak-bucket
    await prisma.$executeRawUnsafe(`
      CREATE POLICY "Allow public uploads" 
      ON storage.objects FOR INSERT 
      TO public 
      WITH CHECK ( bucket_id = 'laporpak-bucket' );
    `);
    console.log("Insert policy created successfully!");
  } catch(e) {
    console.error("Error creating policy:", e.message);
  }
}

main().finally(() => prisma.$disconnect());
