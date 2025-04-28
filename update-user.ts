import { PrismaClient } from "@prisma/client"
import { hash } from "bcrypt"

const prisma = new PrismaClient()

async function main() {
  try {
    // Hash the new password
    const newPassword = "marypat123"
    const hashedPassword = await hash(newPassword, 10)

    // Update the user
    const updatedUser = await prisma.user.update({
      where: {
        email: "admin@example.com",
      },
      data: {
        password: hashedPassword,
        // Uncomment the line below if you want to change the email too
         email: "info@marypeeofficial.com"
      },
    })

    console.log("User updated successfully:", {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
    })
  } catch (error) {
    console.error("Error updating user:", error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
