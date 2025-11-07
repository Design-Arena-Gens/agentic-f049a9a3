"use client";

import { useRef } from "react";
import { useStore } from "@/lib/store";

export default function SettingsPage() {
  const products = useStore((s) => s.products);
  const sales = useStore((s) => s.sales);
  const importData = useStore((s) => s.importData);
  const clearAll = useStore((s) => s.clearAll);
  const inputRef = useRef<HTMLInputElement | null>(null);

  function onExport() {
    const blob = new Blob([JSON.stringify({ products, sales }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `store-tracker-export-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function onImportFile(file: File) {
    file.text().then((text) => {
      try {
        const data = JSON.parse(text);
        importData({ products: data.products ?? [], sales: data.sales ?? [] });
        alert("Import successful");
      } catch (e) {
        alert("Invalid file");
      }
    });
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold tracking-tight">Settings</h2>

      <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-4 space-y-3">
        <div className="flex items-center gap-2">
          <button className="rounded-md bg-zinc-900 text-white px-4 py-2 text-sm" onClick={onExport}>
            Export data (JSON)
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onImportFile(file);
              if (inputRef.current) inputRef.current.value = "";
            }}
          />
          <button
            className="rounded-md border px-4 py-2 text-sm"
            onClick={() => inputRef.current?.click()}
          >
            Import data (JSON)
          </button>
        </div>
        <div>
          <button
            className="rounded-md border border-red-300 text-red-600 px-4 py-2 text-sm"
            onClick={() => {
              if (confirm("Clear all products and sales?")) {
                clearAll();
              }
            }}
          >
            Clear all data
          </button>
        </div>
      </div>
    </div>
  );
}
