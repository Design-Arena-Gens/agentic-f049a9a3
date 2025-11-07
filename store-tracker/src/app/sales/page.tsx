"use client";

import { useStore } from "@/lib/store";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatCurrency } from "@/lib/format";

const schema = z.object({
  productId: z.string().min(1),
  quantity: z.coerce.number().int().min(1),
  unitPrice: z.coerce.number().min(0).optional(),
  unitCost: z.coerce.number().min(0).optional(),
  date: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function SalesPage() {
  const products = useStore((s) => s.products);
  const sales = useStore((s) => s.sales);
  const addSale = useStore((s) => s.addSale);
  const deleteSale = useStore((s) => s.deleteSale);

  const { register, handleSubmit, reset } = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: { productId: "", quantity: 1, unitPrice: undefined, unitCost: undefined, date: undefined },
  });

  function onSubmit(values: FormValues) {
    addSale(values);
    reset({ productId: "", quantity: 1, unitPrice: undefined, unitCost: undefined, date: new Date().toISOString().slice(0, 10) });
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold tracking-tight">Sales</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-4 grid gap-4 md:grid-cols-6">
        <select className="rounded-md border p-2 bg-transparent md:col-span-2" defaultValue="" {...register("productId")}>
          <option value="" disabled>
            Select product
          </option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.sku})
            </option>
          ))}
        </select>
        <input type="number" placeholder="Qty" className="rounded-md border p-2 bg-transparent" {...register("quantity")} />
        <input type="number" step="0.01" placeholder="Unit price (optional)" className="rounded-md border p-2 bg-transparent" {...register("unitPrice")} />
        <input type="number" step="0.01" placeholder="Unit cost (optional)" className="rounded-md border p-2 bg-transparent" {...register("unitCost")} />
        <input type="date" className="rounded-md border p-2 bg-transparent" {...register("date")} />
        <div className="md:col-span-6">
          <button type="submit" className="rounded-md bg-zinc-900 text-white px-4 py-2 text-sm">
            Record Sale
          </button>
        </div>
      </form>

      <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 dark:bg-zinc-900">
            <tr className="text-left">
              <th className="p-3">Date</th>
              <th className="p-3">Product</th>
              <th className="p-3">Qty</th>
              <th className="p-3">Unit Price</th>
              <th className="p-3">Revenue</th>
              <th className="p-3">Profit</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {sales.length === 0 ? (
              <tr>
                <td className="p-3 text-zinc-500" colSpan={7}>
                  No sales yet.
                </td>
              </tr>
            ) : (
              sales.map((s) => {
                const product = products.find((p) => p.id === s.productId);
                const revenue = s.quantity * s.unitPrice;
                const profit = s.quantity * (s.unitPrice - s.unitCost);
                return (
                  <tr key={s.id} className="border-t border-zinc-200 dark:border-zinc-800">
                    <td className="p-3">{new Date(s.date).toLocaleString()}</td>
                    <td className="p-3">{product ? `${product.name} (${product.sku})` : "Unknown"}</td>
                    <td className="p-3">{s.quantity}</td>
                    <td className="p-3">{formatCurrency(s.unitPrice)}</td>
                    <td className="p-3">{formatCurrency(revenue)}</td>
                    <td className="p-3">{formatCurrency(profit)}</td>
                    <td className="p-3 text-right">
                      <button className="text-red-600" onClick={() => deleteSale(s.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
