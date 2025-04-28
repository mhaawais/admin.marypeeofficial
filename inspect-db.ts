import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  try {
    // Try to query the database schema
    const result = await prisma.$queryRaw`
      SELECT table_name, column_name 
      FROM information_schema.columns 
      WHERE table_schema = 'public'
      ORDER BY table_name, ordinal_position;
    `

    console.log("Database schema:")
    console.log(JSON.stringify(result, null, 2))
  } catch (error) {
    console.error("Error inspecting database:", error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
