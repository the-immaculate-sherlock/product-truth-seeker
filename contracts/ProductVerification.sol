
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ProductVerification {
    struct Product {
        string name;
        string manufacturingDate;
        string batchNumber;
        string location;
        string additionalDetails;
        address manufacturer;
        uint256 timestamp;
        bool isRegistered;
    }
    
    // Mapping from product hash to product details
    mapping(bytes32 => Product) public products;
    
    // Mapping from product hash to scan logs
    mapping(bytes32 => ScanLog[]) public scanLogs;
    
    // Struct to store scan log information
    struct ScanLog {
        address scanner;
        string location;
        string userType; // "Distributor", "Retailer", "Consumer"
        uint256 timestamp;
    }
    
    // Events
    event ProductRegistered(bytes32 productHash, string name, address manufacturer);
    event ProductScanned(bytes32 productHash, address scanner, string userType);
    
    // Register a new product
    function registerProduct(
        string memory _name,
        string memory _manufacturingDate,
        string memory _batchNumber,
        string memory _location,
        string memory _additionalDetails,
        bytes32 _productHash
    ) public {
        // Ensure product hasn't already been registered
        require(!products[_productHash].isRegistered, "Product already registered");
        
        // Create and store the new product
        products[_productHash] = Product({
            name: _name,
            manufacturingDate: _manufacturingDate,
            batchNumber: _batchNumber,
            location: _location,
            additionalDetails: _additionalDetails,
            manufacturer: msg.sender,
            timestamp: block.timestamp,
            isRegistered: true
        });
        
        // Emit event
        emit ProductRegistered(_productHash, _name, msg.sender);
    }
    
    // Get product details
    function getProduct(bytes32 _productHash) public view returns (
        string memory name,
        string memory manufacturingDate,
        string memory batchNumber,
        string memory location,
        string memory additionalDetails,
        address manufacturer,
        uint256 timestamp,
        bool isRegistered
    ) {
        Product memory p = products[_productHash];
        return (
            p.name,
            p.manufacturingDate,
            p.batchNumber,
            p.location,
            p.additionalDetails,
            p.manufacturer,
            p.timestamp,
            p.isRegistered
        );
    }
    
    // Verify if a product exists
    function verifyProduct(bytes32 _productHash) public view returns (bool) {
        return products[_productHash].isRegistered;
    }
    
    // Log a scan by distributor, retailer, or consumer
    function logScan(
        bytes32 _productHash, 
        string memory _location, 
        string memory _userType
    ) public {
        // Ensure product exists
        require(products[_productHash].isRegistered, "Product not registered");
        
        // Create and store the new scan log
        scanLogs[_productHash].push(ScanLog({
            scanner: msg.sender,
            location: _location,
            userType: _userType,
            timestamp: block.timestamp
        }));
        
        // Emit event
        emit ProductScanned(_productHash, msg.sender, _userType);
    }
    
    // Get number of scans for a product
    function getScanLogsCount(bytes32 _productHash) public view returns (uint256) {
        return scanLogs[_productHash].length;
    }
    
    // Get a specific scan log for a product
    function getScanLog(bytes32 _productHash, uint256 _index) public view returns (
        address scanner,
        string memory location,
        string memory userType,
        uint256 timestamp
    ) {
        require(_index < scanLogs[_productHash].length, "Scan log index out of bounds");
        ScanLog memory log = scanLogs[_productHash][_index];
        return (
            log.scanner,
            log.location,
            log.userType,
            log.timestamp
        );
    }
}
