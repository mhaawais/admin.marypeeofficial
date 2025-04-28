import { PrismaClient } from "@prisma/client"
import { hash } from "bcrypt"

const prisma = new PrismaClient()

async function main() {
  try {
    // Create admin user if it doesn't exist
    const adminEmail = "info@marypeeofficial.com" // Changed to the requested email

    // Check if user exists without using createdAt field
    const existingUser = await prisma.user.findUnique({
      where: { email: adminEmail },
      select: { id: true },
    })

    if (!existingUser) {
      const hashedPassword = await hash("marypat123", 10) // Changed to the requested password
      await prisma.user.create({
        data: {
          name: "Mary Pat Uzoma",
          email: adminEmail,
          password: hashedPassword,
          bio: "Author of 'Misplaced Trust' and 'From the Eyes of a Baby'. Woman of faith, educator, and real estate investor.",
          image: "",
        },
      })
      console.log("Admin user created")
    } else {
      console.log("Admin user already exists")
    }

    // Create sample books if none exist
    const booksCount = await prisma.book.count()
    if (booksCount === 0) {
      await prisma.book.createMany({
        data: [
          {
            title: "Misplaced Trust and the Power of Forgiveness",
            description: "A story of heartbreak, betrayal, and forgiveness that shook the heavens.",
            image: "",
          },
          {
            title: "From The Eyes Of A Baby",
            description: "Seeing the world through newborn eyes: A book that changes everything.",
            image: "",
          },
        ],
      })
      console.log("Sample books created")
    }

    // Create sample blogs if none exist
    const blogsCount = await prisma.blog.count()
    if (blogsCount === 0) {
      await prisma.blog.createMany({
        data: [
          {
            title: "Misplaced Trust and the Power of Forgiveness",
            summary: "One measure of Kindness, One Stranger, One Decision That Swap Everything",
            content:
              "In helping a person in need, how many risks or sacrifices would you undertake? Mary-Pat Uzoma didn't hesitate...",
            image: "",
          },
          {
            title: "From the Eyes of a Baby",
            summary: "Seeing the World Through Newborn Eyes: A Book That Changes Everything",
            content:
              "Have you ever asked yourself about the feelings of someone who encounters the world for the first time?",
            image: "",
          },
        ],
      })
      console.log("Sample blogs created")
    }

    console.log("Database seeded successfully")
  } catch (error) {
    console.error("Error seeding database:", error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
