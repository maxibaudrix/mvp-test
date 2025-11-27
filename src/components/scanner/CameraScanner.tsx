// C:\Users\maxib\web-app\MVP\sporvit-mvp\src\components\scanner\CameraScanner.tsx
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Scan, X, Loader2 } from 'lucide-react';
// Asumo que tienes un componente Button, si no, usa un botón simple de HTML.

interface CameraScannerProps {
  onDetected: (code: string) => void;
  onStop: () => void;
}

// Placeholder para un componente Button simple con Tailwind (Ajusta si usas un componente UI real)
const Button: React.FC<{ children: React.ReactNode; onClick: () => void; className?: string }> = ({ children, onClick, className = '' }) => (
    <button
        onClick={onClick}
        className={`flex items-center justify-center px-3 py-1 font-semibold transition-colors duration-200 rounded-lg shadow-md bg-red-600 hover:bg-red-700 text-white ${className}`}
    >
        {children}
    </button>
);

const CameraScanner: React.FC<CameraScannerProps> = ({ onDetected, onStop }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastDetectedRef = useRef<string | null>(null);
  const codeReaderRef = useRef<any>(null); // Almacenar el lector para resetearlo
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Lógica de escaneo continuo
  const startScan = useCallback(async () => {
    if (!videoRef.current) return;

    try {
      setIsLoading(true);
      setError(null);
      
      // Importación dinámica de ZXing
      const ZXing = await import("@zxing/library");
      
      // Inicializar el lector si no existe
      if (!codeReaderRef.current) {
        // Usamos BrowserMultiFormatReader para soportar varios formatos (Barcode, QR, etc.)
        codeReaderRef.current = new ZXing.BrowserMultiFormatReader();
      }
      
      const codeReader = codeReaderRef.current;

      // Obtener la primera cámara disponible
      const videoInputDevices = await codeReader.listVideoInputDevices();
      const firstDeviceId = videoInputDevices[0]?.deviceId;

      if (!firstDeviceId) {
        setError("No se encontraron dispositivos de cámara.");
        setIsLoading(false);
        return;
      }
      
      setIsLoading(false);

      // Iniciar el escaneo y decodificación.
      // Se usa .decodeFromVideoDevice para un escaneo continuo
      codeReader.decodeFromVideoDevice(firstDeviceId, videoRef.current, (result: any, scanError: any) => {
        if (scanError) {
          // Ignorar errores comunes (ej. código no encontrado)
          if (scanError.name !== "NotFoundException") {
             // console.error("ZXing Error:", scanError); 
          }
          return;
        }

        if (result) {
          // *** CORRECCIÓN DEL ERROR DE TIPADO (CÓDIGO 2341) ***
          // Accedemos a 'text' usando el método público 'getText()'
          const decodedText = (result as any)?.getText ? (result as any).getText() : (result as any).text;

          if (decodedText && lastDetectedRef.current !== decodedText) {
            lastDetectedRef.current = decodedText;
            onDetected(decodedText);
            
            // Detener el escaneo después de una detección exitosa para evitar re-detecciones
            stopScan();
          }
        }
      });
      
    } catch (err: any) {
      console.error("Error al inicializar el scanner:", err);
      setError("No se pudo iniciar el escáner. Asegúrate de dar permisos de cámara.");
      setIsLoading(false);
    }
  }, [onDetected]);
  
  // Función para detener y limpiar el escáner
  const stopScan = useCallback(() => {
    if (codeReaderRef.current) {
        codeReaderRef.current.reset();
    }
    onStop();
  }, [onStop]);

  useEffect(() => {
    startScan();
    
    // Cleanup: Detener y resetear el lector al desmontar el componente
    return () => {
        if (codeReaderRef.current) {
            codeReaderRef.current.reset();
            codeReaderRef.current = null;
        }
    };
  }, [startScan]);


  return (
    <div className="relative rounded-xl overflow-hidden bg-black min-h-[300px] shadow-2xl">
      {/* Video Stream - importante que el elemento VIDEO esté presente */}
      <video ref={videoRef} className="w-full h-full object-cover transform scale-x-[-1]" playsInline muted />
      
      {/* Overlay de Carga */}
      {isLoading && !error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-white">
            <Loader2 className="w-8 h-8 animate-spin mb-3" />
            <p>Iniciando cámara y lector...</p>
        </div>
      )}

      {/* Overlay con zona de escaneo y error */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        {/* Marcador de Escaneo */}
        {!isLoading && !error && (
            <div className="w-3/4 h-32 border-2 border-dashed border-green-500 rounded-lg backdrop-blur-sm bg-black/10 flex items-center justify-center transition-all duration-300 ease-in-out">
              <Scan className="w-8 h-8 text-green-500 animate-pulse" />
            </div>
        )}
        
        {/* Mensaje de Error */}
        {error && (
            <div className="p-3 mt-4 bg-red-800/90 text-white text-center font-medium rounded-lg pointer-events-auto max-w-xs">
              {error}
            </div>
        )}
      </div>

      {/* Botón de Parar */}
      <div className="absolute top-4 right-4 pointer-events-auto">
        <Button onClick={stopScan} className="bg-red-500 hover:bg-red-600 p-3 rounded-full shadow-lg">
          <X className="w-5 h-5" />
        </Button>
      </div>

    </div>
  );
};

export default CameraScanner;