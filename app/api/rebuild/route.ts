import { NextResponse } from "next/server";
import { exec } from "child_process";
import path from "path";
import fs from "fs";
import Client from "ftp";

// ✅ Proper return type for Next.js POST handler
export async function POST(req: Request): Promise<Response> {
  const { secret } = await req.json();

  if (secret !== process.env.REBUILD_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const outDir = path.join(process.cwd(), "out");

  // ✅ Typed Promise<Response> for correct compatibility
  return new Promise<Response>((resolve) => {
    exec("npm run export", async (error, stdout, stderr) => {
      if (error) {
        return resolve(
          NextResponse.json({ error: stderr.toString() }, { status: 500 })
        );
      }

      const ftp = new Client();

      // ✅ Upload all files in /out to Hostinger via FTP
      ftp.on("ready", () => {
        ftp.rmdir("public_html", true, () => {
          ftp.mkdir("public_html", true, () => {
            uploadDirectory(ftp, outDir, "public_html");
          });
        });
      });

      ftp.connect({
        host: process.env.FTP_HOST!,
        user: process.env.FTP_USER!,
        password: process.env.FTP_PASSWORD!,
      });

      function uploadDirectory(ftp: Client, localDir: string, remoteDir: string) {
        fs.readdir(localDir, (err, files) => {
          if (err) return;
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
                  if (err) console.error(err);
                });
              }
            });
          });
        });
      }

      ftp.on("end", () => {
        resolve(NextResponse.json({ success: true }));
      });
    });
  });
}





// import { NextResponse } from "next/server";
// import { exec } from "child_process";
// import path from "path";
// import fs from "fs";
// import Client from "ftp";

// export async function POST(req: Request) {
//   const { secret } = await req.json();

//   if (secret !== process.env.REBUILD_SECRET) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   const outDir = path.join(process.cwd(), "out");

//   return new Promise((resolve) => {
//     exec("npm run export", async (error, stdout, stderr) => {
//       if (error) {
//         return resolve(
//           NextResponse.json({ error: stderr }, { status: 500 })
//         );
//       }

//       const ftp = new Client();
//       ftp.on("ready", () => {
//         ftp.rmdir("public_html", true, () => {
//           ftp.mkdir("public_html", true, () => {
//             uploadDirectory(ftp, outDir, "public_html");
//           });
//         });
//       });

//       ftp.connect({
//         host: process.env.FTP_HOST!,
//         user: process.env.FTP_USER!,
//         password: process.env.FTP_PASSWORD!,
//       });

//       function uploadDirectory(ftp: Client, localDir: string, remoteDir: string) {
//         fs.readdir(localDir, (err, files) => {
//           if (err) return;
//           files.forEach((file) => {
//             const localPath = path.join(localDir, file);
//             const remotePath = `${remoteDir}/${file}`;
//             fs.stat(localPath, (err, stats) => {
//               if (stats?.isDirectory()) {
//                 ftp.mkdir(remotePath, true, () => {
//                   uploadDirectory(ftp, localPath, remotePath);
//                 });
//               } else {
//                 ftp.put(localPath, remotePath, (err) => {
//                   if (err) console.error(err);
//                 });
//               }
//             });
//           });
//         });
//       }

//       ftp.on("end", () => {
//         resolve(NextResponse.json({ success: true }));
//       });
//     });
//   });
// }
