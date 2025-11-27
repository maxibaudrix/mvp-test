// C:\Users\maxib\web-app\MVP\sporvit-mvp\src\components\scanner\ProductScanner.tsx
import React, { useState } from 'react';
import { Scan, Zap, Loader2, X } from 'lucide-react';
import CameraScanner from './CameraScanner'; // Se eliminó la extensión .tsx para la resolución automática
import ProductCard from './ProductCard'; // Se eliminó la extensión .tsx para la resolución automática
// Asumo que CameraPlaceholder y ScoreIndicator existen y están bien, 
// o los integro si no tienen contenido complejo. Por ahora, asumimos que CameraPlaceholder está bien.

// Definición de tipos simplificada para el ejemplo
interface ProductData {
    name: string;
    code: string;
    nutriscoreGrade: 'A' | 'B' | 'C' | 'D' | 'E';
    novaGroup: 1 | 2 | 3 | 4;
    calories: number; // por 100g
    protein: number; // por 100g
    carbs: number; // por 100g
    fat: number; // por 100g
    servingSize: number; // gramos
    brand: string;
}

// Mock data para simular el resultado de un escaneo/búsqueda
const MOCK_PRODUCT: ProductData = {
  name: "Yogur Natural Desnatado",
  code: "8410000100201",
  nutriscoreGrade: 'A',
  novaGroup: 1,
  calories: 50,
  protein: 5.5,
  carbs: 4.5,
  fat: 0.1,
  servingSize: 125,
  brand: "Marca Feliz",
};

// Placeholder para componentes UI
const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg ${className}`}>
      {children}
    </div>
);
const Input: React.FC<{ type: string; placeholder: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; disabled?: boolean; className?: string;
}> = ({ type, placeholder, value, onChange, disabled = false, className = '' }) => (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors dark:bg-gray-700 dark:text-white dark:border-gray-600 ${className}`}
    />
);
const Button: React.FC<{ children: React.ReactNode; onClick: () => void; disabled?: boolean; className?: string; }> = ({ children, onClick, disabled = false, className = '' }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`flex items-center justify-center px-4 py-2 font-semibold transition-colors duration-200 rounded-lg shadow-md ${
      disabled ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'
    } ${className}`}
  >
    {children}
  </button>
);

// Placeholder para CameraPlaceholder.tsx si no lo vamos a modificar
const CameraPlaceholder: React.FC<{ onActivate: () => void }> = ({ onActivate }) => (
    <div className="flex flex-col items-center justify-center p-8 bg-gray-100 dark:bg-gray-700 rounded-xl min-h-[300px] border border-dashed border-gray-300 dark:border-gray-600 shadow-inner">
      <Zap className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-4" />
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
        Activar Escáner de Producto
      </h3>
      <p className="text-sm text-center text-gray-500 dark:text-gray-400 mb-4 max-w-xs">
        Pulsa para iniciar tu cámara y escanear el código.
      </p>
      <Button onClick={onActivate} className="bg-green-600 hover:bg-green-700">
        <Scan className="w-4 h-4 mr-2" />
        Empezar a Escanear
      </Button>
    </div>
);

const ProductScanner: React.FC = () => {
    const [barcode, setBarcode] = useState('');
    const [productData, setProductData] = useState<ProductData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isCameraActive, setIsCameraActive] = useState(false);

    // Función para simular la búsqueda del producto (simula API /api/scanner)
    const searchProduct = async (code: string) => {
        if (!code) {
            setError("Introduce un código de barras para buscar.");
            setProductData(null);
            return;
        }
        
        setLoading(true);
        setError(null);
        setProductData(null);

        // Simular llamada a API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (code === MOCK_PRODUCT.code) { // Simula un código válido
            setProductData(MOCK_PRODUCT);
        } else {
            setError(`Producto con código ${code} no encontrado o no compatible.`);
        }

        setLoading(false);
        setIsCameraActive(false); // Detener cámara tras búsqueda
    };
    
    // Handler cuando CameraScanner detecta un código
    const handleScanDetected = (detectedCode: string) => {
        setBarcode(detectedCode);
        searchProduct(detectedCode);
    };
    
    // Handler para detener el escaneo
    const handleStopScan = () => {
        setIsCameraActive(false);
    }

    // Handler para la búsqueda manual
    const handleManualSearch = () => {
        if (isCameraActive) {
            setIsCameraActive(false); 
        }
        searchProduct(barcode);
    };

    const handleStartCamera = () => {
        setProductData(null);
        setError(null);
        setIsCameraActive(true);
    }

    return (
        <div className="p-4 sm:p-8 max-w-lg mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen font-sans">
            <h1 className="text-3xl font-extrabold text-center mb-8 text-gray-900 dark:text-white">
                Analizador de Productos Sporvit
            </h1>

            <Card className="mb-6 p-0">
                {/* Visualización del Escáner/Placeholder */}
                {isCameraActive ? (
                    <CameraScanner onDetected={handleScanDetected} onStop={handleStopScan} />
                ) : (
                    <CameraPlaceholder onActivate={handleStartCamera} />
                )}
            </Card>

            {/* Búsqueda Manual */}
            <div className="flex w-full space-x-2 mb-6">
                <Input
                    type="text"
                    placeholder="Código de Barras (ej. 8410000100201)"
                    value={barcode}
                    onChange={(e) => {
                        setBarcode(e.target.value);
                        setError(null);
                    }}
                    disabled={loading}
                />
                <Button onClick={handleManualSearch} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Scan className="h-4 w-4" />}
                    <span className="ml-2 hidden sm:inline">Buscar</span>
                </Button>
            </div>

            {/* Loader / Error */}
            {(loading || error) && (
                <div className="p-4 text-center rounded-lg mb-6">
                    {loading && (
                        <p className="text-blue-500 flex items-center justify-center font-medium">
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Buscando información...
                        </p>
                    )}
                    {error && (
                        <p className="text-red-500 font-medium flex items-center justify-center">
                            <X className="mr-2 h-5 w-5" /> {error}
                        </p>
                    )}
                </div>
            )}

            {/* Resultados del Producto */}
            {productData && (
                <ProductCard product={productData} onClose={() => setProductData(null)} />
            )}
            
            {/* Mensaje de Bienvenida/Ayuda */}
            {!productData && !loading && !error && !isCameraActive && (
                <div className="p-4 bg-yellow-50 dark:bg-yellow-950 border border-yellow-300 dark:border-yellow-700 rounded-xl">
                    <h3 className="font-bold text-yellow-800 dark:text-yellow-200 flex items-center mb-1">
                      <Zap className="w-5 h-5 mr-2" /> Información Importante
                    </h3>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        Escanea o introduce el código de barras de un alimento para ver su Nutri-Score, NOVA Group y evaluar si se ajusta a tu dieta.
                    </p>
                </div>
            )}
        </div>
    );
}

export default ProductScanner;