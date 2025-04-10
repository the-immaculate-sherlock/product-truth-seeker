
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { blockchainService, Product, ScanLog } from '../services/blockchainService';

interface BlockchainContextType {
  isConnected: boolean;
  connecting: boolean;
  walletAddress: string | null;
  connectWallet: () => Promise<boolean>;
  registerProduct: (
    name: string,
    manufacturingDate: string,
    batchNumber: string,
    location: string,
    additionalDetails: string
  ) => Promise<{ success: boolean; hash?: string; error?: string }>;
  verifyProduct: (hash: string) => Promise<{ success: boolean; product?: Product; error?: string }>;
  logScan: (hash: string, location: string, userType: string) => Promise<{ success: boolean; error?: string }>;
  getScanLogs: (hash: string) => Promise<{ success: boolean; logs?: ScanLog[]; error?: string }>;
}

const BlockchainContext = createContext<BlockchainContextType | undefined>(undefined);

export const useBlockchain = () => {
  const context = useContext(BlockchainContext);
  if (!context) {
    throw new Error('useBlockchain must be used within a BlockchainProvider');
  }
  return context;
};

export const BlockchainProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const connectWallet = async () => {
    setConnecting(true);
    try {
      const connected = await blockchainService.connectWallet();
      setIsConnected(connected);
      
      if (connected) {
        const address = await blockchainService.getAccountAddress();
        setWalletAddress(address);
      }
      
      return connected;
    } catch (error) {
      console.error('Error connecting wallet:', error);
      return false;
    } finally {
      setConnecting(false);
    }
  };

  const registerProduct = async (
    name: string,
    manufacturingDate: string,
    batchNumber: string,
    location: string,
    additionalDetails: string
  ) => {
    return await blockchainService.registerProduct(
      name,
      manufacturingDate,
      batchNumber,
      location,
      additionalDetails
    );
  };

  const verifyProduct = async (hash: string) => {
    return await blockchainService.verifyProduct(hash);
  };

  const logScan = async (hash: string, location: string, userType: string) => {
    return await blockchainService.logScan(hash, location, userType);
  };

  const getScanLogs = async (hash: string) => {
    return await blockchainService.getScanLogs(hash);
  };

  return (
    <BlockchainContext.Provider
      value={{
        isConnected,
        connecting,
        walletAddress,
        connectWallet,
        registerProduct,
        verifyProduct,
        logScan,
        getScanLogs
      }}
    >
      {children}
    </BlockchainContext.Provider>
  );
};
