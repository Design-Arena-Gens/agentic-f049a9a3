"use client";

import { useMemo } from "react";
import { useStore } from "@/lib/store";
import { formatCurrency } from "@/lib/format";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
  TimeScale,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler, TimeScale);

export default function Home() {
  const products = useStore((s) => s.products);
  const getTotals = useStore((s) => s.getTotals);
  const getDailySeries = useStore((s) => s.getDailySeries);
  const getLowStock = useStore((s) => s.getLowStock);

  const { revenue, profit } = getTotals();
  const low = getLowStock();
  const series = getDailySeries(30);

  const chartData = useMemo(() => {
    return {
      labels: series.map((d) => new Date(d.date).toLocaleDateString()),
      datasets: [
        {
          label: "Revenue",
          data: series.map((d) => d.revenue),
          borderColor: "#3b82f6",
          backgroundColor: "rgba(59,130,246,0.2)",
          fill: true,
          tension: 0.3,
        },
        {
          label: "Profit",
          data: series.map((d) => d.profit),
          borderColor: "#22c55e",
          backgroundColor: "rgba(34,197,94,0.2)",
          fill: true,
          tension: 0.3,
        },
      ],
    };
  }, [series]);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold tracking-tight">Dashboard</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <StatCard title="Products" value={products.length.toString()} />
        <StatCard title="Revenue" value={formatCurrency(revenue)} />
        <StatCard title="Profit" value={formatCurrency(profit)} />
        <StatCard title="Low stock" value={low.length.toString()} accent="warning" />
      </div>

      <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-4">
        <h3 className="mb-2 text-sm font-medium text-zinc-500">Last 30 days</h3>
        <Line
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: "bottom" as const } },
            scales: { y: { beginAtZero: true } },
          }}
          height={260}
        />
      </div>

      <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-4">
        <h3 className="mb-2 text-sm font-medium text-zinc-500">Low stock alerts</h3>
        {low.length === 0 ? (
          <p className="text-sm text-zinc-500">All good! No low-stock items.</p>
        ) : (
          <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {low.map((p) => (
              <li key={p.id} className="flex items-center justify-between py-2 text-sm">
                <span className="truncate">
                  {p.name} <span className="text-zinc-500">({p.sku})</span>
                </span>
                <span className="font-medium">
                  {p.stockQty} / {p.reorderThreshold}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, accent }: { title: string; value: string; accent?: "warning" | "default" }) {
  return (
    <div
      className={
        "rounded-lg border border-zinc-200 dark:border-zinc-800 p-4 bg-white dark:bg-black" +
        (accent === "warning" ? " ring-1 ring-amber-300/50" : "")
      }
    >
      <div className="text-xs font-medium text-zinc-500">{title}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
    </div>
  );
}
