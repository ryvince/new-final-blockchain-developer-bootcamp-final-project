## Avoiding Common Attacks

The following measures were considered to avoid common attacks:

- **Using Specific Compiler Pragma:** Solidity 0.8.0 was used in SmartProperty and ContractEstate contracts. - [SWC-103](https://swcregistry.io/docs/SWC-103) 

- **Proper Use of Require, Assert and Revert:** Using ```require``` before adding new properties or buying properties in SmartProperty contract.
  
- Used nonReentrant from [ReentrancyGuard](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/security/ReentrancyGuard.sol) on **sellPropertytoBuyer** and **listPropertyOnEstateMarket** functions to safeguard against reentrancy attack. - [SWC-107](https://swcregistry.io/docs/SWC-107) 

- **Proper setting of visibility for functions**: Functions are specified as being external, public, internal or private to reduce the attack surface of a contract system. - [SWC-100](https://swcregistry.io/docs/SWC-100)
  
- Included fallback() and receive() functions in **SmartProperty** contract. 