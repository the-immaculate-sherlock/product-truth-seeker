
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useBlockchain } from '../../contexts/BlockchainContext';
import { Button } from '../../components/ui/button';
import { Database, Shield, Scan, QrCode } from 'lucide-react';

const Navbar = () => {
  const { isConnected, walletAddress, connectWallet, connecting } = useBlockchain();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="container flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Shield className="h-8 w-8 text-blockchain-primary" />
          <span className="text-xl font-bold">ProductTruth</span>
        </div>
        
        <nav className="hidden md:block">
          <ul className="flex space-x-8">
            <li>
              <Link to="/" className="text-gray-700 hover:text-blockchain-primary transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link to="/register" className="text-gray-700 hover:text-blockchain-primary transition-colors">
                <div className="flex items-center space-x-1">
                  <QrCode className="h-4 w-4" />
                  <span>Register Product</span>
                </div>
              </Link>
            </li>
            <li>
              <Link to="/verify" className="text-gray-700 hover:text-blockchain-primary transition-colors">
                <div className="flex items-center space-x-1">
                  <Scan className="h-4 w-4" />
                  <span>Verify Product</span>
                </div>
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className="flex items-center space-x-4">
          <Button 
            onClick={connectWallet} 
            disabled={isConnected || connecting}
            variant={isConnected ? "outline" : "default"}
            className={isConnected ? "bg-green-100 text-green-700 hover:bg-green-100" : ""}
          >
            <Database className="mr-2 h-4 w-4" />
            {connecting ? (
              "Connecting..."
            ) : isConnected && walletAddress ? (
              `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`
            ) : (
              "Connect Wallet"
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
