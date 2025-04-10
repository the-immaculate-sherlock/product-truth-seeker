
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { Button } from '../components/ui/button';
import { Shield, QrCode, Search } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="pt-32 pb-20 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-10 md:mb-0">
                <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                  Verify Product Authenticity with <span className="text-blockchain-primary">Blockchain</span>
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                  Combat counterfeits in the supply chain by leveraging transparent and immutable blockchain technology.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button 
                    onClick={() => navigate('/register')}
                    className="bg-blockchain-primary hover:bg-blockchain-secondary"
                    size="lg"
                  >
                    <QrCode className="mr-2 h-5 w-5" />
                    Register Products
                  </Button>
                  <Button 
                    onClick={() => navigate('/verify')}
                    variant="outline" 
                    size="lg"
                  >
                    <Search className="mr-2 h-5 w-5" />
                    Verify Products
                  </Button>
                </div>
              </div>
              <div className="md:w-1/2">
                <div className="relative">
                  <div className="absolute -top-6 -left-6 w-64 h-64 bg-blockchain-primary rounded-full opacity-10 animate-pulse-ring"></div>
                  <div className="bg-white p-8 rounded-xl shadow-lg relative z-10">
                    <Shield className="mx-auto h-20 w-20 text-blockchain-primary mb-6" />
                    <h3 className="text-xl font-semibold text-center mb-4">Blockchain Product Verification</h3>
                    <p className="text-gray-600 text-center">
                      Secure, transparent, and tamper-proof verification of products using Ethereum blockchain.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="w-12 h-12 bg-blockchain-primary bg-opacity-10 rounded-full flex items-center justify-center mb-4">
                  <span className="text-blockchain-primary font-bold">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Register Products</h3>
                <p className="text-gray-600">
                  Manufacturers register product details securely on the Ethereum blockchain, creating an immutable record.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="w-12 h-12 bg-blockchain-primary bg-opacity-10 rounded-full flex items-center justify-center mb-4">
                  <span className="text-blockchain-primary font-bold">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Generate QR Codes</h3>
                <p className="text-gray-600">
                  Unique QR codes are generated containing product information and blockchain-registered hash.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="w-12 h-12 bg-blockchain-primary bg-opacity-10 rounded-full flex items-center justify-center mb-4">
                  <span className="text-blockchain-primary font-bold">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Verify Authenticity</h3>
                <p className="text-gray-600">
                  Anyone can scan the product's QR code to instantly verify its authenticity against the blockchain record.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Benefits</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="flex">
                <div className="mr-4">
                  <div className="p-2 bg-blockchain-primary bg-opacity-10 rounded-full">
                    <Shield className="h-6 w-6 text-blockchain-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Tamper-Proof Records</h3>
                  <p className="text-gray-600">
                    All product data is stored on the blockchain, making it impossible to alter or forge records.
                  </p>
                </div>
              </div>
              <div className="flex">
                <div className="mr-4">
                  <div className="p-2 bg-blockchain-primary bg-opacity-10 rounded-full">
                    <Shield className="h-6 w-6 text-blockchain-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Supply Chain Transparency</h3>
                  <p className="text-gray-600">
                    Track products from manufacturer to consumer with complete visibility and accountability.
                  </p>
                </div>
              </div>
              <div className="flex">
                <div className="mr-4">
                  <div className="p-2 bg-blockchain-primary bg-opacity-10 rounded-full">
                    <Shield className="h-6 w-6 text-blockchain-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Consumer Trust</h3>
                  <p className="text-gray-600">
                    Build customer confidence by providing undeniable proof of product authenticity.
                  </p>
                </div>
              </div>
              <div className="flex">
                <div className="mr-4">
                  <div className="p-2 bg-blockchain-primary bg-opacity-10 rounded-full">
                    <Shield className="h-6 w-6 text-blockchain-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Anti-Counterfeiting</h3>
                  <p className="text-gray-600">
                    Effectively combat fake products by providing a simple verification method for all stakeholders.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-blockchain-primary text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Combat Counterfeits?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Start using blockchain technology today to secure your products and build consumer trust.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button onClick={() => navigate('/register')} variant="secondary" size="lg">
                Register Your Products
              </Button>
              <Button onClick={() => navigate('/verify')} variant="outline" size="lg" className="bg-transparent text-white border-white hover:bg-white hover:text-blockchain-primary">
                Verify Products
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
