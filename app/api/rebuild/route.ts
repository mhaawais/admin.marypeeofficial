import { NextResponse } from "next/server";

export async function POST() {
  const res = await fetch("https://api.github.com/repos/mhaawais/admin.marypeeofficial/dispatches", {
    method: "POST",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`, // ✅ Use server env var
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      event_type: "rebuild-from-admin",
    }),
  });

  if (res.ok) {
    return NextResponse.json({ success: true });
  }

  const error = await res.json();
  return NextResponse.json({ error }, { status: 500 });
}
