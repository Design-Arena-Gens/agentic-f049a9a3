"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart2, Boxes, DollarSign, AlertTriangle, Settings } from "lucide-react";
import clsx from "clsx";

const items = [
  { href: "/", label: "Dashboard", icon: BarChart2 },
  { href: "/products", label: "Products", icon: Boxes },
  { href: "/sales", label: "Sales", icon: DollarSign },
  { href: "/alerts", label: "Alerts", icon: AlertTriangle },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function SidebarNav() {
  const pathname = usePathname();
  return (
    <aside className="h-screen w-60 shrink-0 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black p-4">
      <div className="mb-6 px-2">
        <h1 className="text-lg font-semibold tracking-tight">Store Tracker</h1>
        <p className="text-xs text-zinc-500">Inventory, sales, and alerts</p>
      </div>
      <nav className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black"
                  : "hover:bg-zinc-100 dark:hover:bg-zinc-900"
              )}
            >
              <Icon size={16} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
