"use client";

import { useStore } from "@/lib/store";

export default function AlertsPage() {
  const low = useStore((s) => s.getLowStock());

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold tracking-tight">Stock Alerts</h2>
      <div className="rounded-lg border border-zinc-200 dark:border-zinc-800">
        {low.length === 0 ? (
          <p className="p-4 text-sm text-zinc-500">No low-stock items. Your inventory is healthy.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 dark:bg-zinc-900 text-left">
              <tr>
                <th className="p-3">Product</th>
                <th className="p-3">SKU</th>
                <th className="p-3">Stock</th>
                <th className="p-3">Reorder at</th>
              </tr>
            </thead>
            <tbody>
              {low.map((p) => (
                <tr key={p.id} className="border-t border-zinc-200 dark:border-zinc-800">
                  <td className="p-3">{p.name}</td>
                  <td className="p-3">{p.sku}</td>
                  <td className="p-3">{p.stockQty}</td>
                  <td className="p-3">{p.reorderThreshold}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
