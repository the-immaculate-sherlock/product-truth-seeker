
import { useState } from 'react';
import { useBlockchain } from '../contexts/BlockchainContext';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import QRCodeScanner from '../components/QRCodeScanner';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import AuthenticationBadge from '../components/AuthenticationBadge';
import { ScanLog } from '../services/blockchainService';
import { toast } from 'sonner';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  CardFooter
} from '../components/ui/card';
import { 
  Loader2, 
  AlertTriangle, 
  Package2, 
  Calendar, 
  MapPin, 
  FileText, 
  User 
} from 'lucide-react';
import { Separator } from '../components/ui/separator';

interface ScanResult {
  hash: string;
  name?: string;
  date?: string;
  batch?: string;
}

const VerifyProduct = () => {
  const { verifyProduct, logScan, getScanLogs } = useBlockchain();
  const [isVerifying, setIsVerifying] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<'verified' | 'unverified' | 'pending'>('pending');
  const [productDetails, setProductDetails] = useState<any>(null);
  const [scanLogs, setScanLogs] = useState<any[]>([]);
  const [showScanner, setShowScanner] = useState(true);
  const [userType, setUserType] = useState<'Consumer' | 'Distributor' | 'Retailer'>('Consumer');
  const [location, setLocation] = useState('');

  const handleScanComplete = async (data: string) => {
    try {
      let parsedData: ScanResult;
      
      try {
        parsedData = JSON.parse(data);
      } catch (e) {
        parsedData = { hash: data };
      }
      
      if (!parsedData.hash) {
        toast.error("Invalid QR code: Missing product hash");
        return;
      }
      
      setScanResult(parsedData);
      setShowScanner(false);
      
      await verifyProductOnChain(parsedData.hash);
      
    } catch (error) {
      console.error("Error processing scan result:", error);
      toast.error("Failed to process scan result");
    }
  };

  const verifyProductOnChain = async (hash: string) => {
    setIsVerifying(true);
    setVerificationStatus('pending');
    
    try {
      const result = await verifyProduct(hash);
      
      if (result.success && result.product) {
        setVerificationStatus('verified');
        setProductDetails(result.product);
        
        const logsResult = await getScanLogs(hash);
        if (logsResult.success && logsResult.logs) {
          setScanLogs(logsResult.logs);
        }
        
        try {
          navigator.geolocation.getCurrentPosition((position) => {
            setLocation(`${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
          });
        } catch (e) {
          setLocation('Location unavailable');
        }
        
      } else {
        setVerificationStatus('unverified');
        toast.error(result.error || "Product verification failed");
      }
    } catch (error) {
      console.error("Error verifying product:", error);
      setVerificationStatus('unverified');
      toast.error("An error occurred during verification");
    } finally {
      setIsVerifying(false);
    }
  };

  const logProductScan = async () => {
    if (!scanResult?.hash || !location) return;
    
    try {
      const result = await logScan(scanResult.hash, location, userType);
      
      if (result.success) {
        toast.success(`Scan logged as ${userType}`);
        
        const logsResult = await getScanLogs(scanResult.hash);
        if (logsResult.success && logsResult.logs) {
          setScanLogs(logsResult.logs);
        }
      } else {
        toast.error(result.error || "Failed to log scan");
      }
    } catch (error) {
      console.error("Error logging scan:", error);
      toast.error("An error occurred while logging the scan");
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };
  
  const resetVerification = () => {
    setScanResult(null);
    setVerificationStatus('pending');
    setProductDetails(null);
    setScanLogs([]);
    setShowScanner(true);
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-center">Verify Product Authenticity</h1>
            
            {showScanner ? (
              <Card>
                <CardHeader>
                  <CardTitle>Scan Product QR Code</CardTitle>
                  <CardDescription>
                    Use your camera to scan the product's QR code or upload a QR code image.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <QRCodeScanner onScanSuccess={handleScanComplete} />
                </CardContent>
              </Card>
            ) : (
              <>
                {isVerifying ? (
                  <div className="flex flex-col items-center py-12">
                    <Loader2 className="h-12 w-12 text-blockchain-primary animate-spin mb-4" />
                    <p className="text-lg">Verifying product authenticity...</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <Card>
                      <CardHeader className="relative pb-2">
                        <div className="absolute right-6 top-6">
                          <AuthenticationBadge status={verificationStatus} />
                        </div>
                        <CardTitle>Product Verification Result</CardTitle>
                        <CardDescription>
                          {verificationStatus === 'verified'
                            ? 'This product has been verified as authentic'
                            : 'This product could not be verified'}
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent>
                        {verificationStatus === 'unverified' ? (
                          <div className="p-6 text-center">
                            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                            <h3 className="text-xl font-medium text-red-700 mb-2">Product Not Verified</h3>
                            <p className="text-gray-600 mb-4">
                              This product could not be verified on the blockchain. It may be counterfeit or unregistered.
                            </p>
                          </div>
                        ) : (
                          productDetails && (
                            <div className="space-y-6">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-start space-x-3">
                                  <Package2 className="h-5 w-5 text-blockchain-primary mt-1" />
                                  <div>
                                    <p className="text-sm text-gray-500">Product Name</p>
                                    <p className="font-medium">{productDetails.name}</p>
                                  </div>
                                </div>
                                
                                <div className="flex items-start space-x-3">
                                  <Calendar className="h-5 w-5 text-blockchain-primary mt-1" />
                                  <div>
                                    <p className="text-sm text-gray-500">Manufacturing Date</p>
                                    <p className="font-medium">{productDetails.manufacturingDate}</p>
                                  </div>
                                </div>
                                
                                <div className="flex items-start space-x-3">
                                  <MapPin className="h-5 w-5 text-blockchain-primary mt-1" />
                                  <div>
                                    <p className="text-sm text-gray-500">Manufacturing Location</p>
                                    <p className="font-medium">{productDetails.location}</p>
                                  </div>
                                </div>
                                
                                <div className="flex items-start space-x-3">
                                  <FileText className="h-5 w-5 text-blockchain-primary mt-1" />
                                  <div>
                                    <p className="text-sm text-gray-500">Batch Number</p>
                                    <p className="font-medium">{productDetails.batchNumber}</p>
                                  </div>
                                </div>
                                
                                <div className="flex items-start space-x-3 col-span-2">
                                  <User className="h-5 w-5 text-blockchain-primary mt-1" />
                                  <div>
                                    <p className="text-sm text-gray-500">Manufacturer Wallet</p>
                                    <p className="font-medium break-all">{productDetails.manufacturer}</p>
                                  </div>
                                </div>
                              </div>
                              
                              {productDetails.additionalDetails && (
                                <div>
                                  <p className="text-sm text-gray-500 mb-1">Additional Details</p>
                                  <p className="text-gray-700">{productDetails.additionalDetails}</p>
                                </div>
                              )}
                            </div>
                          )
                        )}
                      </CardContent>
                      
                      {verificationStatus === 'verified' && (
                        <>
                          <Separator />
                          <CardHeader className="pt-6">
                            <CardTitle>Product Scan History</CardTitle>
                            <CardDescription>
                              Track this product's journey through the supply chain
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            {scanLogs.length > 0 ? (
                              <div className="space-y-4">
                                {scanLogs.map((log, index) => (
                                  <div key={index} className="p-3 bg-gray-50 rounded-lg border text-sm">
                                    <div className="flex justify-between items-start mb-1">
                                      <span className="font-medium">{log.userType}</span>
                                      <span className="text-gray-500">{formatDate(log.timestamp)}</span>
                                    </div>
                                    <p className="text-gray-600">Location: {log.location}</p>
                                    <p className="text-gray-400 text-xs mt-1">Scanner: {log.scanner}</p>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-gray-500 text-center py-4">No previous scans recorded</p>
                            )}
                          </CardContent>
                          
                          <Separator />
                          <CardHeader className="pt-6">
                            <CardTitle>Log Your Scan</CardTitle>
                            <CardDescription>
                              Record your scan on the blockchain to help track this product
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium mb-2">I am a:</label>
                                <div className="flex space-x-4">
                                  {(['Consumer', 'Retailer', 'Distributor'] as const).map((type) => (
                                    <Button
                                      key={type}
                                      type="button"
                                      variant={userType === type ? 'default' : 'outline'}
                                      onClick={() => setUserType(type)}
                                    >
                                      {type}
                                    </Button>
                                  ))}
                                </div>
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium mb-2">Current Location:</label>
                                <Input
                                  value={location}
                                  onChange={handleLocationChange}
                                  placeholder="Enter your current location"
                                  className="w-full"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                  Example: City, Country or GPS coordinates
                                </p>
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter className="flex justify-between">
                            <Button 
                              variant="outline" 
                              onClick={resetVerification}
                            >
                              Scan Another Product
                            </Button>
                            <Button 
                              onClick={logProductScan} 
                              className="bg-blockchain-primary hover:bg-blockchain-secondary"
                              disabled={!location}
                            >
                              Log Scan to Blockchain
                            </Button>
                          </CardFooter>
                        </>
                      )}
                      
                      {verificationStatus === 'unverified' && (
                        <CardFooter>
                          <Button 
                            variant="outline" 
                            onClick={resetVerification}
                            className="w-full"
                          >
                            Scan Another Product
                          </Button>
                        </CardFooter>
                      )}
                    </Card>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default VerifyProduct;
