
import { ethers } from 'ethers';
import { toast } from 'sonner';

// This would be replaced with the actual ABI after compilation
// For now, we'll use a simplified ABI based on our contract
const CONTRACT_ABI = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "productHash",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "manufacturer",
        "type": "address"
      }
    ],
    "name": "ProductRegistered",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "productHash",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "scanner",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "userType",
        "type": "string"
      }
    ],
    "name": "ProductScanned",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "_productHash",
        "type": "bytes32"
      }
    ],
    "name": "getProduct",
    "outputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "manufacturingDate",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "batchNumber",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "location",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "additionalDetails",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "manufacturer",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "isRegistered",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "_productHash",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "_index",
        "type": "uint256"
      }
    ],
    "name": "getScanLog",
    "outputs": [
      {
        "internalType": "address",
        "name": "scanner",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "location",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "userType",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "_productHash",
        "type": "bytes32"
      }
    ],
    "name": "getScanLogsCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "_productHash",
        "type": "bytes32"
      },
      {
        "internalType": "string",
        "name": "_location",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_userType",
        "type": "string"
      }
    ],
    "name": "logScan",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "name": "products",
    "outputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "manufacturingDate",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "batchNumber",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "location",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "additionalDetails",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "manufacturer",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "isRegistered",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_manufacturingDate",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_batchNumber",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_location",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_additionalDetails",
        "type": "string"
      },
      {
        "internalType": "bytes32",
        "name": "_productHash",
        "type": "bytes32"
      }
    ],
    "name": "registerProduct",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "scanLogs",
    "outputs": [
      {
        "internalType": "address",
        "name": "scanner",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "location",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "userType",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "_productHash",
        "type": "bytes32"
      }
    ],
    "name": "verifyProduct",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// Local Hardhat node contract address
// This should be updated with the actual deployed contract address from Hardhat
const CONTRACT_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; // Default Hardhat first deployment address

// Hardhat network configuration
const HARDHAT_NETWORK = {
  chainId: 31337, // Hardhat default chain ID
  name: 'Hardhat Local',
  rpcUrl: 'http://127.0.0.1:8545',
};

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
      
      // Request network switch to Hardhat local
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${HARDHAT_NETWORK.chainId.toString(16)}` }],
        });
      } catch (switchError: any) {
        // If the network doesn't exist in MetaMask, add it
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: `0x${HARDHAT_NETWORK.chainId.toString(16)}`,
                  chainName: HARDHAT_NETWORK.name,
                  rpcUrls: [HARDHAT_NETWORK.rpcUrl],
                  nativeCurrency: {
                    name: 'Ethereum',
                    symbol: 'ETH',
                    decimals: 18,
                  },
                },
              ],
            });
          } catch (addError) {
            console.error('Error adding Hardhat network to MetaMask:', addError);
            toast.error('Failed to add Hardhat network to MetaMask. Please add it manually.');
            return false;
          }
        } else {
          console.error('Error switching to Hardhat network:', switchError);
          toast.error('Failed to switch to Hardhat network. Make sure your local node is running.');
          return false;
        }
      }
      
      await this.provider.send('eth_requestAccounts', []);
      this.signer = await this.provider.getSigner();
      this.contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, this.signer);
      this.isConnected = true;
      
      const address = await this.signer.getAddress();
      toast.success(`Connected wallet: ${address.substring(0, 6)}...${address.substring(address.length - 4)}`);
      
      // Log network information for debugging
      const network = await this.provider.getNetwork();
      console.log("Connected to network:", network.name, "Chain ID:", network.chainId);
      
      return true;
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
      toast.error('Failed to connect to MetaMask. Please make sure your Hardhat local node is running at http://127.0.0.1:8545.');
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
      const connected = await this.connectWallet();
      if (!connected) {
        return { success: false, error: 'Wallet not connected' };
      }
    }

    try {
      console.log("Registering product:", { name, manufacturingDate, batchNumber, location });
      
      // Create a unique hash for the product based on its data
      const productData = ethers.concat([
        ethers.toUtf8Bytes(name),
        ethers.toUtf8Bytes(manufacturingDate), 
        ethers.toUtf8Bytes(batchNumber),
        ethers.toUtf8Bytes(location),
        ethers.toUtf8Bytes(additionalDetails || '')
      ]);
      
      const productHash = ethers.keccak256(productData);
      console.log("Generated product hash:", productHash);
      
      // Check if the contract instance exists
      if (!this.contract) {
        console.error("Contract instance is null");
        return { success: false, error: 'Contract not initialized' };
      }
      
      console.log("Calling contract.registerProduct with hash:", productHash);
      
      // Add gas limit to avoid transaction underpricing issues
      const tx = await this.contract.registerProduct(
        name,
        manufacturingDate,
        batchNumber,
        location,
        additionalDetails || '',
        productHash,
        { gasLimit: 500000 } // Explicitly set a gas limit
      );
      
      console.log("Transaction initiated:", tx.hash);
      
      // Wait for the transaction to be mined
      const receipt = await tx.wait();
      console.log("Transaction receipt:", receipt);
      
      return { success: true, hash: productHash };
    } catch (error: any) {
      console.error('Error registering product:', error);
      let errorMessage = 'Failed to register product on blockchain';
      
      // Extract more specific error message if available
      if (error.message) {
        errorMessage += `: ${error.message}`;
      }
      
      // Check for MetaMask rejection
      if (error.code === 4001) {
        errorMessage = 'Transaction was rejected by user';
      }
      
      return { success: false, error: errorMessage };
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
