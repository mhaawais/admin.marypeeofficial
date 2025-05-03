// app/dashboard/settings/page.tsx
"use client";

import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [status, setStatus] = useState("");

  useEffect(() => {
    setStatus("✅ Your website updates instantly. No rebuild needed.");
  }, []);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Website Settings</h1>
      <p className="text-lg mb-6">
        This website uses <strong>Server-Side Rendering (SSR)</strong>, so any
        content updates you make from this admin panel are reflected live on the
        public website instantly.
      </p>

      <div className="bg-green-100 border border-green-300 text-green-800 px-4 py-3 rounded-md">
        {status}
      </div>
    </div>
  );
}
