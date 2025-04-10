
import { ethers } from 'ethers';
import { toast } from 'sonner';

// This would be replaced with the actual ABI after compilation
// For now, we'll use a simplified ABI based on our contract
const CONTRACT_ABI = [
  "function registerProduct(string _name, string _manufacturingDate, string _batchNumber, string _location, string _additionalDetails, bytes32 _productHash) public",
  "function getProduct(bytes32 _productHash) public view returns (string name, string manufacturingDate, string batchNumber, string location, string additionalDetails, address manufacturer, uint256 timestamp, bool isRegistered)",
  "function verifyProduct(bytes32 _productHash) public view returns (bool)",
  "function logScan(bytes32 _productHash, string _location, string _userType) public",
  "function getScanLogsCount(bytes32 _productHash) public view returns (uint256)",
  "function getScanLog(bytes32 _productHash, uint256 _index) public view returns (address scanner, string location, string userType, uint256 timestamp)"
];

// This would be the deployed contract address
// For development, we'll use a placeholder
const CONTRACT_ADDRESS = "0x123456789AbCDEf123456789AbCDEf123456789A"; // Replace with actual deployed address

export interface Product {
  name: string;
  manufacturingDate: string;
  batchNumber: string;
  location: string;
  additionalDetails: string;
  manufacturer: string;
  timestamp: number;
  isRegistered: boolean;
}

export interface ScanLog {
  scanner: string;
  location: string;
  userType: string;
  timestamp: number;
}

class BlockchainService {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.Signer | null = null;
  private contract: ethers.Contract | null = null;
  private isConnected = false;

  async connectWallet(): Promise<boolean> {
    if (typeof window === 'undefined' || !window.ethereum) {
      toast.error('MetaMask is not installed. Please install MetaMask to use this application.');
      return false;
    }

    try {
      this.provider = new ethers.BrowserProvider(window.ethereum);
      await this.provider.send('eth_requestAccounts', []);
      this.signer = await this.provider.getSigner();
      this.contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, this.signer);
      this.isConnected = true;
      
      const address = await this.signer.getAddress();
      toast.success(`Connected wallet: ${address.substring(0, 6)}...${address.substring(address.length - 4)}`);
      return true;
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
      toast.error('Failed to connect to MetaMask. Please try again.');
      return false;
    }
  }

  async registerProduct(
    name: string,
    manufacturingDate: string,
    batchNumber: string,
    location: string,
    additionalDetails: string
  ): Promise<{ success: boolean; hash?: string; error?: string }> {
    if (!this.isConnected || !this.contract) {
      await this.connectWallet();
      if (!this.isConnected) {
        return { success: false, error: 'Wallet not connected' };
      }
    }

    try {
      // Create a unique hash for the product based on its data
      const productData = ethers.concat([
        ethers.toUtf8Bytes(name),
        ethers.toUtf8Bytes(manufacturingDate), 
        ethers.toUtf8Bytes(batchNumber),
        ethers.toUtf8Bytes(location),
        ethers.toUtf8Bytes(additionalDetails)
      ]);
      
      const productHash = ethers.keccak256(productData);
      
      const tx = await this.contract.registerProduct(
        name,
        manufacturingDate,
        batchNumber,
        location,
        additionalDetails,
        productHash
      );
      
      await tx.wait();
      return { success: true, hash: productHash };
    } catch (error) {
      console.error('Error registering product:', error);
      return { success: false, error: 'Failed to register product on blockchain' };
    }
  }

  async verifyProduct(productHash: string): Promise<{ success: boolean; product?: Product; error?: string }> {
    if (!this.isConnected || !this.contract) {
      await this.connectWallet();
      if (!this.isConnected) {
        return { success: false, error: 'Wallet not connected' };
      }
    }

    try {
      const isRegistered = await this.contract.verifyProduct(productHash);
      
      if (!isRegistered) {
        return { success: false, error: 'Product not found or not registered' };
      }
      
      const product = await this.contract.getProduct(productHash);
      
      return {
        success: true,
        product: {
          name: product[0],
          manufacturingDate: product[1],
          batchNumber: product[2],
          location: product[3],
          additionalDetails: product[4],
          manufacturer: product[5],
          timestamp: Number(product[6]),
          isRegistered: product[7]
        }
      };
    } catch (error) {
      console.error('Error verifying product:', error);
      return { success: false, error: 'Failed to verify product on blockchain' };
    }
  }

  async logScan(productHash: string, location: string, userType: string): Promise<{ success: boolean; error?: string }> {
    if (!this.isConnected || !this.contract) {
      await this.connectWallet();
      if (!this.isConnected) {
        return { success: false, error: 'Wallet not connected' };
      }
    }

    try {
      const tx = await this.contract.logScan(productHash, location, userType);
      await tx.wait();
      return { success: true };
    } catch (error) {
      console.error('Error logging scan:', error);
      return { success: false, error: 'Failed to log scan on blockchain' };
    }
  }

  async getScanLogs(productHash: string): Promise<{ success: boolean; logs?: ScanLog[]; error?: string }> {
    if (!this.isConnected || !this.contract) {
      await this.connectWallet();
      if (!this.isConnected) {
        return { success: false, error: 'Wallet not connected' };
      }
    }

    try {
      const scanLogsCount = await this.contract.getScanLogsCount(productHash);
      const logsCount = Number(scanLogsCount);
      const logs: ScanLog[] = [];
      
      for (let i = 0; i < logsCount; i++) {
        const log = await this.contract.getScanLog(productHash, i);
        logs.push({
          scanner: log[0],
          location: log[1],
          userType: log[2],
          timestamp: Number(log[3])
        });
      }
      
      return { success: true, logs };
    } catch (error) {
      console.error('Error getting scan logs:', error);
      return { success: false, error: 'Failed to retrieve scan logs' };
    }
  }

  async getAccountAddress(): Promise<string | null> {
    if (!this.signer) {
      return null;
    }
    
    try {
      return await this.signer.getAddress();
    } catch (error) {
      console.error('Error getting account address:', error);
      return null;
    }
  }

  isWalletConnected(): boolean {
    return this.isConnected;
  }
}

export const blockchainService = new BlockchainService();
