
## Design pattern decisions
The following design patterns were implemented in developing the ContractEstate.sol and SmartProperty.sol contracts


### Inter-Contract Execution
- The SmartProperty contract interacts with functions (`trasferFrom()`) from *ContractEstate* contract to transfer NFT (ERC721) from the seller to the buyer.

- ContractEstate contract interacts with OpenZepplin ERC721URIStorage for `_verify()`, `_safeMint()`, `_setTokenURI()` and `setApprovalForAll()` ERC-721 token functions.


### Inheritance and Interfaces
- The ContractEstate contract inherits OpenZepplin Counters library for tracking the tokenId of minted Property NFT.

- The ContractEstate contract inherits Ownable library to ensure only owner can call the state changing functions.

- The SmartProperty contract inherits OpenZepplin Counters library for tracking the propertyListingId of the property on the ContractEstate Market.