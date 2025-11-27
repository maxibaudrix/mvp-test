// src/components/scanner/CameraScanner.tsx
"use client";
import React, { useEffect, useRef, useState } from "react";

type CameraScannerProps = {
  onDetected: (code: string) => void;
  formats?: string[]; // e.g. ["ean_13", "qr_code"]
  facingMode?: "environment" | "user";
  scanIntervalMs?: number;
};

export default function CameraScanner({
  onDetected,
  formats = ["ean_13", "ean_8", "qr_code"],
  facingMode = "environment",
  scanIntervalMs = 500,
}: CameraScannerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [supported, setSupported] = useState<boolean | null>(null);
  const barcodeDetectorRef = useRef<any>(null);
  const scanningRef = useRef(false);
  const lastDetectedRef = useRef<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode },
          audio: false,
        });
        if (!mounted) return;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch (err: any) {
        setError("No se pudo acceder a la cámara: " + err.message);
      }
    }

    // Try native BarcodeDetector
    async function initDetector() {
      // @ts-ignore
      if ("BarcodeDetector" in window) {
        try {
          // @ts-ignore
          const supportedFormats = await (window as any).BarcodeDetector.getSupportedFormats();
          // If formats we want are supported -> use native
          const formatsToUse = formats.filter((f) =>
            supportedFormats.includes(f)
          );
          // @ts-ignore
          barcodeDetectorRef.current = new (window as any).BarcodeDetector({
            formats: formatsToUse.length ? formatsToUse : supportedFormats,
          });
          setSupported(true);
        } catch (e) {
          console.warn("BarcodeDetector init failed", e);
          setSupported(false);
        }
      } else {
        setSupported(false);
      }
    }

    startCamera();
    initDetector();

    return () => {
      mounted = false;
      const tracks = (videoRef.current?.srcObject as MediaStream | null)?.getTracks?.() || [];
      tracks.forEach((t) => t.stop());
    };
  }, [facingMode, formats]);

  useEffect(() => {
    let rafId: number | null = null;
    let intervalId: number | null = null;

    async function scanFrameNative() {
      if (!videoRef.current || !barcodeDetectorRef.current) return;
      try {
        const detections = await barcodeDetectorRef.current.detect(videoRef.current);
        if (detections && detections.length) {
          const code = detections[0].rawValue || detections[0].raw_value || detections[0].rawData;
          if (code && lastDetectedRef.current !== code) {
            lastDetectedRef.current = code;
            onDetected(code);
          }
        }
      } catch (e) {
        console.warn("native detect error", e);
      }
    }

    async function scanUsingZXing() {
      // dynamic import to avoid forcing dependency
      try {
        const ZXing = await import("@zxing/library");
        const codeReader = new ZXing.BrowserMultiFormatReader();
        if (!videoRef.current) return;

        try {
          const result = await codeReader.decodeOnceFromVideoDevice(undefined, videoRef.current);
          if (result?.text) {
            if (lastDetectedRef.current !== result.text) {
              lastDetectedRef.current = result.text;
              onDetected(result.text);
            }
          }
        } catch (err) {
          // decodeOnceFromVideoDevice throws when no code found; ignore
        } finally {
          codeReader.reset();
        }
      } catch (err) {
        console.error("ZXing dynamic import failed", err);
      }
    }

    async function loop() {
      scanningRef.current = true;
      if ((window as any).BarcodeDetector && barcodeDetectorRef.current) {
        // poll at interval
        intervalId = window.setInterval(scanFrameNative, scanIntervalMs);
      } else {
        // fallback - try ZXing periodically
        intervalId = window.setInterval(scanUsingZXing, scanIntervalMs);
      }
    }

    loop();

    return () => {
      scanningRef.current = false;
      if (rafId) cancelAnimationFrame(rafId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [onDetected, scanIntervalMs]);

  return (
    <div className="w-full h-full relative">
      <video
        ref={videoRef}
        className="w-full h-full object-cover rounded-lg bg-black"
        playsInline
        muted
      />
      {error && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-black/60 text-white p-3 rounded">{error}</div>
        </div>
      )}
    </div>
  );
}
