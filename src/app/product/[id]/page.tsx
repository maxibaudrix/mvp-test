// src/app/product/[id]/page.tsx
import React from "react";
import ProductCard from "@/components/scanner/ProductCard";

type Props = {
  params: { id: string };
};

async function fetchProduct(barcode: string) {
  const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
  if (!res.ok) throw new Error("fetch failed");
  const json = await res.json();
  if (json.status === 0) throw new Error("product_not_found");
  return json.product;
}

export default async function ProductPage({ params }: Props) {
  const { id } = params;
  let product = null;
  let score: number | null = null;
  try {
    product = await fetchProduct(id);
    // call local scoring API to keep logic on server (or import recommenderEngine if available server-side)
    const scoreResp = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/scanner`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ barcode: id, prefs: { maxNova: 3 } }),
    });
    if (scoreResp.ok) {
      const json = await scoreResp.json();
      score = json.score;
    }
  } catch (err) {
    console.error(err);
  }

  if (!product) {
    return (
      <main className="p-6">
        <h1 className="text-xl font-bold">Producto no encontrado</h1>
        <p>Lo sentimos, no se encontró el producto con ese código.</p>
      </main>
    );
  }

  return (
    <main className="p-6">
      <div className="max-w-3xl">
        <h1 className="text-2xl font-bold mb-2">{product.product_name || "Producto"}</h1>
        <p className="text-sm text-muted-foreground mb-4">{product.brands}</p>

        <ProductCard product={product} score={score} onOpen={() => {}} />

        <section className="mt-6">
          <h2 className="text-lg font-semibold">Información nutricional</h2>
          <pre className="mt-2 bg-gray-50 p-3 rounded text-sm overflow-auto">
            {JSON.stringify(product.nutriments ?? {}, null, 2)}
          </pre>
        </section>

        <section className="mt-6">
          <h2 className="text-lg font-semibold">Ingredientes</h2>
          <p className="mt-2 text-sm">{product.ingredients_text || "No disponible"}</p>
        </section>
      </div>
    </main>
  );
}
