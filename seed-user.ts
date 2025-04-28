import { PrismaClient } from "@prisma/client"
import { hash } from "bcrypt"

const prisma = new PrismaClient()

async function main() {
  try {
    // Delete existing user if it exists
    await prisma.user.deleteMany({
      where: {
        email: "admin@example.com",
      },
    })

    // Create admin user
    const hashedPassword = await hash("marypat123", 10)
    const user = await prisma.user.create({
      data: {
        name: "Mary Pat Uzoma",
        email: "admin@example.com",
        password: hashedPassword,
        bio: "Author of 'Misplaced Trust' and 'From the Eyes of a Baby'. Woman of faith, educator, and real estate investor.",
        image: "",
      },
    })

    console.log("Admin user created:", user)
  } catch (error) {
    console.error("Error seeding user:", error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
