import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import Client from "ftp";

export async function POST(req: Request): Promise<Response> {
  const { secret } = await req.json();

  if (secret !== process.env.REBUILD_SECRET) {
    console.error("❌ Unauthorized rebuild attempt.");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const outDir = path.join(process.cwd(), "public", "export");
  const ftp = new Client();

  return new Promise((resolve) => {
    if (!fs.existsSync(outDir)) {
      console.error("❌ Export folder not found at:", outDir);
      return resolve(NextResponse.json({ error: "Static export folder not found" }, { status: 500 }));
    }

    ftp.on("ready", () => {
      ftp.rmdir("public_html", true, (err) => {
        if (err) {
          console.error("FTP rmdir failed:", err);
          return resolve(NextResponse.json({ error: "FTP rmdir failed: " + err.message }, { status: 500 }));
        }

        ftp.mkdir("public_html", true, (err) => {
          if (err) {
            console.error("FTP mkdir failed:", err);
            return resolve(NextResponse.json({ error: "FTP mkdir failed: " + err.message }, { status: 500 }));
          }

          uploadDirectory(ftp, outDir, "public_html");
        });
      });
    });

    ftp.on("end", () => {
      console.log("✅ FTP upload completed.");
      resolve(NextResponse.json({ success: true, message: "Site uploaded successfully" }));
    });

    ftp.on("error", (err) => {
      console.error("❌ FTP error:", err);
      resolve(NextResponse.json({ error: "FTP Error: " + err.message }, { status: 500 }));
    });

    try {
      ftp.connect({
        host: process.env.FTP_HOST!,
        user: process.env.FTP_USER!,
        password: process.env.FTP_PASSWORD!,
      });
    } catch (err: any) {
      console.error("❌ FTP connect() threw error:", err);
      return resolve(NextResponse.json({ error: "FTP connection failed" }, { status: 500 }));
    }

    function uploadDirectory(ftp: Client, localDir: string, remoteDir: string) {
      fs.readdir(localDir, (err, files) => {
        if (err) {
          console.error("❌ Read dir error:", err);
          return;
        }

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
                if (err) console.error("❌ Upload error:", err);
              });
            }
          });
        });
      });
    }
  });
}
