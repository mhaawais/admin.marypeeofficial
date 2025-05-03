// app/dashboard/settings/page.tsx
"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [status, setStatus] = useState("");

  const handleRebuild = async () => {
    setStatus("Rebuilding...");
    const res = await fetch("/api/rebuild", {
      method: "POST",
    });

    if (res.ok) {
      setStatus("✅ Rebuild triggered successfully.");
    } else {
      const data = await res.json();
      setStatus(`❌ Failed: ${data?.error?.message || "Unknown error"}`);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Website Rebuild</h1>
      <p className="mb-4">Click the button below to rebuild the main site.</p>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={handleRebuild}
      >
        Rebuild Website
      </button>
      {status && <p className="mt-4">{status}</p>}
    </div>
  );
}
