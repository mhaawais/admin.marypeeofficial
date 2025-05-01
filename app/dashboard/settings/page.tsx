"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/sidebar";
import { RefreshCw } from "lucide-react";

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState("");
  const [rebuilding, setRebuilding] = useState(false);
  const [rebuildStatus, setRebuildStatus] = useState("");

  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          if (data.apiKey) {
            setApiKey(data.apiKey);
          }
        }
      } catch (error) {
        console.error("Error fetching API key:", error);
      }
    };

    fetchApiKey();
  }, []);

  const triggerRebuild = async () => {
    if (!confirm("Are you sure you want to trigger a rebuild of the main website?")) return;

    setRebuilding(true);
    setRebuildStatus("Triggering rebuild...");

    try {
      const res = await fetch("/api/rebuild", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret: "rebuild-marypee-123" }), // ✅ uses correct secret
      });

      const data = await res.json();

      if (res.ok) {
        setRebuildStatus("✅ Site successfully rebuilt and uploaded.");
      } else {
        setRebuildStatus(`❌ Error: ${data.error || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Rebuild error:", err);
      setRebuildStatus("❌ Network or server error.");
    } finally {
      setTimeout(() => {
        setRebuilding(false);
        setTimeout(() => setRebuildStatus(""), 5000);
      }, 2000);
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      <Sidebar />
      <main className="w-full md:ml-64 p-4 md:p-8 min-h-screen bg-black text-white">
        <h1 className="text-3xl font-bold text-myred mb-6">API Settings</h1>
        <div className="max-w-2xl space-y-8">
          <div className="bg-[#111] border border-gray-700 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Website Rebuild</h2>
            <p className="text-gray-300 mb-4">
              Trigger a rebuild and FTP upload to Hostinger. This will export your static site and overwrite the current version.
            </p>
            <button
              onClick={triggerRebuild}
              disabled={rebuilding}
              className="flex items-center gap-2 px-4 py-2 bg-myred hover:bg-red-700 rounded text-white transition disabled:opacity-50"
            >
              {rebuilding ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                  Rebuilding...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  Rebuild Website
                </>
              )}
            </button>
            {rebuildStatus && (
              <div
                className={`mt-4 p-3 rounded ${
                  rebuildStatus.includes("✅")
                    ? "bg-green-900/30 border border-green-700"
                    : "bg-yellow-900/30 border border-yellow-700"
                }`}
              >
                {rebuildStatus}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
