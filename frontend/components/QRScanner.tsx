"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { AlertCircle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"

let Html5QrcodeScannerCtor: any = null
if (typeof window !== "undefined") {
  try {
    const lib = require("html5-qrcode")
    Html5QrcodeScannerCtor = lib.Html5QrcodeScanner
  } catch (e) {
    console.warn("html5-qrcode library not available")
  }
}

interface QRScannerProps {
  onResult: (text: string) => void
  onClose: () => void
  isOpen?: boolean
}

const QRScanner: React.FC<QRScannerProps> = ({ onResult, onClose, isOpen = true }) => {
  const containerId = useRef(`qr-reader-${Math.random().toString(36).slice(2)}`)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen || !Html5QrcodeScannerCtor) return

    const scanner = new Html5QrcodeScannerCtor(containerId.current, { fps: 12, qrbox: 250 }, false)

    scanner.render(
      (decodedText: string) => {
        onResult(decodedText)
        scanner.clear()
        onClose()
      },
      () => {},
    )

    return () => {
      try {
        scanner.clear()
      } catch (e) {
        console.error("Error clearing scanner:", e)
      }
    }
  }, [isOpen, onResult, onClose])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md border-border/50 bg-surface">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-text">Scan QR Code</DialogTitle>
        </DialogHeader>

        {error && (
          <div className="flex items-center gap-3 rounded-lg bg-error/10 border border-error/30 p-3">
            <AlertCircle className="w-5 h-5 text-error shrink-0" />
            <p className="text-sm text-error">{error}</p>
          </div>
        )}

        {!Html5QrcodeScannerCtor && (
          <div className="flex items-center gap-3 rounded-lg bg-warning/10 border border-warning/30 p-3">
            <AlertCircle className="w-5 h-5 text-warning shrink-0" />
            <p className="text-sm text-warning">QR code scanner library not available</p>
          </div>
        )}

        <div id={containerId.current} className="rounded-lg overflow-hidden bg-surface-light" />

        <p className="text-sm text-text-secondary text-center">Point your camera at the QR code to scan credentials</p>
      </DialogContent>
    </Dialog>
  )
}

export default QRScanner
