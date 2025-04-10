
import { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Button } from '../components/ui/button';
import { Camera, Upload, X } from 'lucide-react';
import { toast } from 'sonner';

interface QRCodeScannerProps {
  onScanSuccess: (data: string) => void;
}

const QRCodeScanner: React.FC<QRCodeScannerProps> = ({ onScanSuccess }) => {
  const [scanning, setScanning] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Initialize scanner
    scannerRef.current = new Html5Qrcode("qr-reader");

    // Cleanup on component unmount
    return () => {
      if (scannerRef.current && scanning) {
        scannerRef.current.stop().catch(err => console.error("Error stopping scanner:", err));
      }
    };
  }, []);

  const startScanner = async () => {
    try {
      if (!scannerRef.current) return;

      setScanning(true);
      setCameraError(null);

      await scannerRef.current.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          handleScanSuccess(decodedText);
        },
        (errorMessage) => {
          // QR code not found error is fine, we don't need to handle it
          if (errorMessage.includes("QR code not found")) return;
          console.error(`QR Code scanning error: ${errorMessage}`);
        }
      );
    } catch (err) {
      console.error("Error starting QR scanner:", err);
      setCameraError("Could not access camera. Please check permissions or try uploading a file instead.");
      setScanning(false);
    }
  };

  const stopScanner = async () => {
    if (!scannerRef.current) return;
    
    try {
      await scannerRef.current.stop();
      setScanning(false);
    } catch (err) {
      console.error("Error stopping QR scanner:", err);
    }
  };

  const handleScanSuccess = (decodedText: string) => {
    stopScanner();
    try {
      // Try to parse the QR code content as JSON
      const data = JSON.parse(decodedText);
      if (!data.hash) {
        toast.error("Invalid QR code: Missing product hash");
        return;
      }
      onScanSuccess(decodedText);
    } catch (err) {
      // If not JSON, try to use as a direct hash
      if (decodedText.startsWith("0x")) {
        onScanSuccess(decodedText);
      } else {
        toast.error("Invalid QR code format");
        console.error("Error parsing QR code data:", err);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !scannerRef.current) return;

    scannerRef.current
      .scanFile(file, /* showImage */ true)
      .then((decodedText) => {
        handleScanSuccess(decodedText);
      })
      .catch((err) => {
        toast.error("Could not read QR code from the image");
        console.error("Error scanning QR code from file:", err);
      });
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto">
      <div
        id="qr-reader"
        className="w-full aspect-square max-w-sm bg-gray-100 rounded-lg overflow-hidden"
      ></div>

      {cameraError && (
        <div className="mt-2 text-red-500 text-sm">{cameraError}</div>
      )}

      <div className="mt-4 flex gap-3">
        {!scanning ? (
          <Button onClick={startScanner} className="bg-blockchain-primary hover:bg-blockchain-secondary">
            <Camera className="mr-2 h-4 w-4" />
            Start Camera
          </Button>
        ) : (
          <Button onClick={stopScanner} variant="destructive">
            <X className="mr-2 h-4 w-4" />
            Stop Scanner
          </Button>
        )}

        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload QR Image
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      <p className="mt-4 text-sm text-gray-500 text-center">
        Point your camera at a product's QR code or upload an image of the QR code to verify its authenticity
      </p>
    </div>
  );
};

export default QRCodeScanner;
