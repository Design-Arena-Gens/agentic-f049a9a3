"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useStore } from "@/lib/store";
import { useState } from "react";
import type { Product } from "@/lib/types";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  sku: z.string().min(1, "SKU is required"),
  category: z.string().optional(),
  costPrice: z.coerce.number().min(0),
  salePrice: z.coerce.number().min(0),
  stockQty: z.coerce.number().int().min(0),
  reorderThreshold: z.coerce.number().int().min(0),
});

type FormValues = z.infer<typeof schema>;

export default function ProductsPage() {
  const products = useStore((s) => s.products);
  const addProduct = useStore((s) => s.addProduct);
  const updateProduct = useStore((s) => s.updateProduct);
  const deleteProduct = useStore((s) => s.deleteProduct);

  const [editing, setEditing] = useState<Product | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: { name: "", sku: "", category: "", costPrice: 0, salePrice: 0, stockQty: 0, reorderThreshold: 0 },
  });

  function onSubmit(values: FormValues) {
    if (editing) {
      updateProduct(editing.id, { ...values });
      setEditing(null);
    } else {
      addProduct(values);
    }
    reset({ name: "", sku: "", category: "", costPrice: 0, salePrice: 0, stockQty: 0, reorderThreshold: 0 });
  }

  function onEdit(p: Product) {
    setEditing(p);
    reset({
      name: p.name,
      sku: p.sku,
      category: p.category || "",
      costPrice: p.costPrice,
      salePrice: p.salePrice,
      stockQty: p.stockQty,
      reorderThreshold: p.reorderThreshold,
    });
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold tracking-tight">Products</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-4 grid gap-4 md:grid-cols-7">
        <input placeholder="Name" className="col-span-2 rounded-md border p-2 bg-transparent" {...register("name")} />
        <input placeholder="SKU" className="rounded-md border p-2 bg-transparent" {...register("sku")} />
        <input placeholder="Category" className="rounded-md border p-2 bg-transparent" {...register("category")} />
        <input placeholder="Cost" type="number" step="0.01" className="rounded-md border p-2 bg-transparent" {...register("costPrice")} />
        <input placeholder="Price" type="number" step="0.01" className="rounded-md border p-2 bg-transparent" {...register("salePrice")} />
        <input placeholder="Stock" type="number" className="rounded-md border p-2 bg-transparent" {...register("stockQty")} />
        <input placeholder="Reorder" type="number" className="rounded-md border p-2 bg-transparent" {...register("reorderThreshold")} />
        <div className="md:col-span-7 flex items-center gap-2">
          <button type="submit" className="rounded-md bg-zinc-900 text-white px-4 py-2 text-sm">
            {editing ? "Update" : "Add"}
          </button>
          {editing && (
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                reset();
              }}
              className="rounded-md border px-4 py-2 text-sm"
            >
              Cancel
            </button>
          )}
          <div className="text-sm text-red-600">
            {Object.values(errors)
              .map((e) => e.message)
              .filter(Boolean)
              .join(", ")}
          </div>
        </div>
      </form>

      <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 dark:bg-zinc-900">
            <tr className="text-left">
              <th className="p-3">Name</th>
              <th className="p-3">SKU</th>
              <th className="p-3">Category</th>
              <th className="p-3">Cost</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Reorder</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td className="p-3 text-zinc-500" colSpan={8}>
                  No products yet.
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.id} className="border-t border-zinc-200 dark:border-zinc-800">
                  <td className="p-3">{p.name}</td>
                  <td className="p-3">{p.sku}</td>
                  <td className="p-3">{p.category}</td>
                  <td className="p-3">{p.costPrice.toFixed(2)}</td>
                  <td className="p-3">{p.salePrice.toFixed(2)}</td>
                  <td className="p-3">{p.stockQty}</td>
                  <td className="p-3">{p.reorderThreshold}</td>
                  <td className="p-3 text-right">
                    <button className="mr-2 text-blue-600" onClick={() => onEdit(p)}>
                      Edit
                    </button>
                    <button className="text-red-600" onClick={() => deleteProduct(p.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
