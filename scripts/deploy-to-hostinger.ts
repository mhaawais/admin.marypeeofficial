import { exec } from "child_process"
import * as ftp from "basic-ftp"
import * as path from "path"
import * as dotenv from "dotenv"

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" })

// Configuration
const config = {
  ftp: {
    host: process.env.FTP_HOST || "", // e.g., ftp.marypeeofficial.com
    user: process.env.FTP_USER || "", // Your Hostinger FTP username
    password: process.env.FTP_PASSWORD || "", // Your Hostinger FTP password
    secure: true, // Use secure FTP (FTPS)
    port: 21,
  },
  localBuildDir: path.join(process.cwd(), "out"), // Next.js static export directory
  remoteDir: "/", // Remote directory on Hostinger (usually the public_html folder)
}

// Validate configuration
function validateConfig() {
  const requiredVars = ["FTP_HOST", "FTP_USER", "FTP_PASSWORD"]
  const missing = requiredVars.filter((varName) => !process.env[varName])

  if (missing.length > 0) {
    console.error(`❌ Missing required environment variables: ${missing.join(", ")}`)
    console.error("Please add them to your .env.local file")
    process.exit(1)
  }
}

// Execute a command and return a promise
function execCommand(command: string): Promise<string> {
  return new Promise((resolve, reject) => {
    console.log(`Running: ${command}`)
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`)
        return reject(error)
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`)
      }
      resolve(stdout)
    })
  })
}

// Build the Next.js site
async function buildSite() {
  console.log("🔨 Building site...")
  try {
    await execCommand("npm run build")
    console.log("✅ Build completed successfully")
    return true
  } catch (error) {
    console.error("❌ Build failed:", error)
    return false
  }
}

// Upload files to Hostinger via FTP
async function uploadToHostinger() {
  console.log("📤 Uploading to Hostinger...")
  const client = new ftp.Client()
  client.ftp.verbose = true

  try {
    await client.access({
      host: config.ftp.host,
      user: config.ftp.user,
      password: config.ftp.password,
      secure: config.ftp.secure,
      port: config.ftp.port,
    })

    console.log("✅ FTP connection established")

    // Navigate to the remote directory
    await client.ensureDir(config.remoteDir)
    console.log(`✅ Navigated to remote directory: ${config.remoteDir}`)

    // Upload the entire build directory
    await client.uploadFromDir(config.localBuildDir)
    console.log("✅ Upload completed successfully")

    return true
  } catch (error) {
    console.error("❌ Upload failed:", error)
    return false
  } finally {
    client.close()
  }
}

// Main deployment function
async function deploy() {
  console.log("🚀 Starting deployment process...")
  console.log("-----------------------------------")

  // Validate configuration
  validateConfig()

  // Build the site
  const buildSuccess = await buildSite()
  if (!buildSuccess) {
    console.error("❌ Deployment failed at build stage")
    process.exit(1)
  }

  // Upload to Hostinger
  const uploadSuccess = await uploadToHostinger()
  if (!uploadSuccess) {
    console.error("❌ Deployment failed at upload stage")
    process.exit(1)
  }

  console.log("-----------------------------------")
  console.log("✅ Deployment completed successfully!")
  console.log(`🌐 Your site should now be live at https://marypeeofficial.com`)
}

// Run the deployment
deploy().catch((error) => {
  console.error("❌ Deployment failed with an unexpected error:", error)
  process.exit(1)
})
