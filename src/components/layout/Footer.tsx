
import { Shield, Github, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-10">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <Shield className="h-6 w-6 text-blockchain-primary mr-2" />
            <span className="text-lg font-semibold">ProductTruth</span>
          </div>
          
          <div className="flex flex-col items-center md:items-start mb-4 md:mb-0">
            <h4 className="text-md font-medium mb-2">Blockchain Product Verification</h4>
            <p className="text-sm text-gray-500">
              Combating counterfeit products with blockchain technology
            </p>
          </div>
          
          <div className="flex space-x-4">
            <a href="#" className="text-gray-500 hover:text-blockchain-primary">
              <Github className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-500 hover:text-blockchain-primary">
              <Twitter className="h-5 w-5" />
            </a>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} ProductTruth. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
