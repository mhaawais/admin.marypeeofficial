import { NextResponse } from "next/server";
import { exec } from "child_process";
import path from "path";
import fs from "fs";
import Client from "ftp";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(req: Request): Promise<Response> {
  try {
    const { secret } = await req.json();

    if (secret !== process.env.REBUILD_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const outDir = path.join(process.cwd(), "out");

    // Step 1: Export static site
    await execAsync("npm run export");

    // Step 2: Connect via FTP
    const ftp = new Client();

    return new Promise((resolve) => {
      ftp.on("ready", () => {
        ftp.rmdir("public_html", true, () => {
          ftp.mkdir("public_html", true, () => {
            uploadDirectory(ftp, outDir, "public_html");
          });
        });
      });

      ftp.on("end", () => {
        resolve(NextResponse.json({ success: true, message: "Site rebuilt and uploaded via FTP." }));
      });

      ftp.on("error", (err) => {
        resolve(NextResponse.json({ error: "FTP Error: " + err.message }, { status: 500 }));
      });

      ftp.connect({
        host: process.env.FTP_HOST!,
        user: process.env.FTP_USER!,
        password: process.env.FTP_PASSWORD!,
      });

      function uploadDirectory(ftp: Client, localDir: string, remoteDir: string) {
        fs.readdir(localDir, (err, files) => {
          if (err) return console.error("Read dir error:", err);
          files.forEach((file) => {
            const localPath = path.join(localDir, file);
            const remotePath = `${remoteDir}/${file}`;
            fs.stat(localPath, (err, stats) => {
              if (stats?.isDirectory()) {
                ftp.mkdir(remotePath, true, () => {
                  uploadDirectory(ftp, localPath, remotePath);
                });
              } else {
                ftp.put(localPath, remotePath, (err) => {
                  if (err) console.error("Upload error:", err);
                });
              }
            });
          });
        });
      }
    });
  } catch (error) {
    console.error("Rebuild route error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown server error" },
      { status: 500 }
    );
  }
}

