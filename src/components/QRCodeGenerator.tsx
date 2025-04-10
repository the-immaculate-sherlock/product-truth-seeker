
import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '../components/ui/button';
import { Download } from 'lucide-react';

interface QRCodeGeneratorProps {
  productData: {
    hash: string;
    name: string;
    manufacturingDate: string;
    batchNumber: string;
  };
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ productData }) => {
  const [size, setSize] = useState(256);
  
  // Create QR code data as a JSON string
  const qrCodeData = JSON.stringify({
    hash: productData.hash,
    name: productData.name,
    batch: productData.batchNumber,
    date: productData.manufacturingDate
  });
  
  // Function to download QR code as PNG
  const downloadQRCode = () => {
    const canvas = document.getElementById('qr-code-canvas') as HTMLCanvasElement;
    if (!canvas) return;
    
    const svgElement = document.getElementById('qr-code-svg');
    if (!svgElement) return;
    
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas2D = canvas.getContext('2d');
    if (!canvas2D) return;
    
    const img = new Image();
    img.onload = () => {
      canvas.width = size;
      canvas.height = size;
      canvas2D.drawImage(img, 0, 0);
      
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `product-${productData.name}-${productData.batchNumber}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    
    img.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgData)))}`;
  };
  
  return (
    <div className="flex flex-col items-center">
      <div className="bg-white p-4 rounded-lg shadow-md">
        <QRCodeSVG
          id="qr-code-svg"
          value={qrCodeData}
          size={size}
          level="H"
          includeMargin={true}
          bgColor="#FFFFFF"
          fgColor="#000000"
        />
      </div>
      
      <canvas id="qr-code-canvas" style={{ display: 'none' }} />
      
      <div className="mt-4 flex items-center gap-4">
        <Button variant="outline" onClick={() => setSize(size + 50)}>
          Increase Size
        </Button>
        <Button variant="outline" onClick={() => setSize(Math.max(150, size - 50))}>
          Decrease Size
        </Button>
        <Button onClick={downloadQRCode} className="bg-blockchain-primary hover:bg-blockchain-secondary">
          <Download className="mr-2 h-4 w-4" />
          Download QR Code
        </Button>
      </div>
      
      <div className="mt-4 text-center text-sm text-gray-500">
        <p>Product Hash: {productData.hash.substring(0, 10)}...{productData.hash.substring(productData.hash.length - 6)}</p>
        <p>Scan this code to verify product authenticity</p>
      </div>
    </div>
  );
};

export default QRCodeGenerator;
