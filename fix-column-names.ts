import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  try {
    // First, let's check what tables exist
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `
    console.log("Tables in database:", tables)

    // Let's check what columns exist in the Message table
    const messageColumns = await prisma.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = 'Message'
    `
    console.log("Columns in Message table:", messageColumns)

    // Let's check what columns exist in the User table
    const userColumns = await prisma.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = 'User'
    `
    console.log("Columns in User table:", userColumns)

    // Let's check what columns exist in the Blog table
    const blogColumns = await prisma.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = 'Blog'
    `
    console.log("Columns in Blog table:", blogColumns)

    // Let's check what columns exist in the Book table
    const bookColumns = await prisma.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = 'Book'
    `
    console.log("Columns in Book table:", bookColumns)
  } catch (error) {
    console.error("Error inspecting database:", error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
