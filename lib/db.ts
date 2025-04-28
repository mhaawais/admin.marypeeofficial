import { PrismaClient } from "@prisma/client"
import { logError } from "./error-logger"

// Use a single instance of Prisma Client in development
const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  })

// Prevent multiple instances of Prisma Client in development
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

// Helper function to check database connection
export async function checkDatabaseConnection() {
  try {
    await prisma.$queryRaw`SELECT 1`
    return { connected: true }
  } catch (error) {
    logError(error, { context: "Database connection check" })
    return { connected: false, error: error instanceof Error ? error.message : "Unknown database error" }
  }
}

export default prisma
