// src/app/scanner/page.tsx
'use client';
import React, { useState } from "react";
import dynamic from "next/dynamic";
import ProductCard from "@/components/scanner/ProductCard";

const CameraScanner = dynamic(() => import("@/components/scanner/CameraScanner"), { ssr: false });

export default function ScannerPage() {
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const [product, setProduct] = useState<any | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleDetected(code: string) {
    if (scannedCode === code) return; // avoid duplicates
    setScannedCode(code);
    setLoading(true);
    try {
      const resp = await fetch("/api/scanner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ barcode: code, prefs: { maxNova: 3 } }),
      });
      const json = await resp.json();
      if (resp.ok) {
        setProduct(json.product);
        setScore(json.score);
      } else {
        setProduct(null);
        setScore(null);
        console.warn(json);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Smart Product Scanner</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-lg overflow-hidden border">
          <CameraScanner 
            onDetected={handleDetected} 
            onStop={() => console.log('Scanner stopped')} 
          />
        </div>

        <div>
          <div className="mb-4">
            <strong>Último código:</strong> {scannedCode ?? "—"}
          </div>
          {loading && <div>Buscando producto…</div>}
          {product ? (
            <ProductCard product={product} onOpen={() => setProduct(null)} score={score} />
          ) : (
            <div className="text-sm text-muted-foreground">Escanea un código de barras para ver la ficha del producto.</div>
          )}
        </div>
      </div>
    </main>
  );
}
