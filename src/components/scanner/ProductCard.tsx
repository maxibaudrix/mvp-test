// src/components/scanner/ProductCard.tsx
import React from "react";
import ScoreIndicator from "./ScoreIndicator";

type Product = {
  code: string;
  product_name?: string;
  brands?: string;
  image_url?: string;
  nutriments?: any;
  nutriscore_grade?: string | null;
  nova_group?: number | null;
};

export default function ProductCard({
  product,
  score,
  onOpen,
}: {
  product: Product;
  score: number | null;
  onOpen?: () => void;
}) {
  return (
    <article className="border rounded-lg p-4 flex gap-4 items-start">
      <img
        src={product.image_url || "/placeholder-food.png"}
        alt={product.product_name || "Producto"}
        width={96}
        height={96}
        className="object-cover rounded"
      />
      <div className="flex-1">
        <h3 className="text-lg font-semibold">{product.product_name || "Sin nombre"}</h3>
        <p className="text-sm text-muted-foreground">{product.brands || "Marca desconocida"}</p>
        <div className="mt-2 flex items-center gap-3">
          <ScoreIndicator score={score} />
          <div className="text-sm">
            <div>Nutri-Score: {product.nutriscore_grade || "N/A"}</div>
            <div>NOVA: {product.nova_group ?? "N/A"}</div>
          </div>
        </div>
        <div className="mt-3">
          <button
            onClick={onOpen}
            className="px-3 py-1 rounded bg-sky-600 text-white text-sm hover:opacity-90"
          >
            Ver ficha
          </button>
        </div>
      </div>
    </article>
  );
}
