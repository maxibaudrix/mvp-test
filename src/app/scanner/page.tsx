// src/app/scanner/page.tsx
"use client"; 

import React from "react";
// Importa el componente orquestador que ya tiene TODA la lógica, estado y UI.
import ProductScanner from "@/components/scanner/ProductScanner"; 

export default function ScannerRoutePage() {
  // Toda la lógica de estado (scannedCode, product, loading) ahora reside
  // dentro de ProductScanner.tsx, simplificando la página.
  
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Muestra el componente ProductScanner, que incluye:
        1. La lógica de la cámara (CameraScanner)
        2. El placeholder de inicio (CameraPlaceholder)
        3. El manejo de la API y el estado (ProductScanner)
        4. La tarjeta de resultado (ProductCard)
      */}
      <ProductScanner />
    </main>
  );
}