// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract ContractEstate is ERC721URIStorage, Ownable {
    // using Counters for Counters.Counter;
    uint256 private _tokenCounter;

    mapping(uint256=>uint256) private counterToDeed;

    address contractAddress;

    address payable public _owner;
    mapping(uint256 => propertyNft) private propertyNftData;

    struct propertyNft {
        uint256 deedNumber;
        address  owner;
        string tokenUri;
        uint256 price;
    }

    constructor(address smartPropertyMarket)  ERC721("Title Transfer Token", "TTT") {
        _owner = payable(msg.sender);
        contractAddress = smartPropertyMarket;
    }

    /// @notice Mints a new property NFT token
    /// @param tokenURI is the ipfs URI for the NFT
    /// @param _price is the property Value. Its passed by the caller from the ipfs metadata
    /// @param _deed is the deed number to identify the Property (TokenID). Its passed by the caller. Its a from the ipfs metadata
    /// @return uint256 The deed  of the minted NFT
    function createPropertyNft( string memory tokenURI, uint256 _price, uint256 _deed)
        public 
        returns (uint256)
    {
        require(_price>0);
        require(_deed>0);

        _safeMint(msg.sender, _deed);
        _setTokenURI(_deed, tokenURI);
        setApprovalForAll(contractAddress, true);

        counterToDeed[_tokenCounter] = _deed;
        
        propertyNftData[_deed] = propertyNft(_deed, msg.sender, tokenURI, _price); //get price from ipfs
        _tokenCounter++;

        return _deed;
    }

    function checkIfPropertyExists(uint256 deed) public view returns(bool){
        return _exists(deed);
    }

    /// @notice Gets the tokenURI of the NFT owned by the caller
    /// @return nftProperty[] The array containing the tokenId, owner and tokenURI of the NFT owned by the caller    
    function getUserProperties() public view returns(propertyNft[] memory) {
        uint totalPropertyCount = _tokenCounter;
        uint itemCount = 0;
        uint currentIndex = 0;

        for (uint i = 0; i < totalPropertyCount; i++) {
            if (propertyNftData[counterToDeed[i]].owner == msg.sender) {
                itemCount += 1;
            }
        }

        propertyNft[] memory properties = new propertyNft[](itemCount);

        for (uint i = 0; i < totalPropertyCount; i++) {
            if (propertyNftData[counterToDeed[i]].owner == msg.sender) {
                properties[currentIndex] = propertyNftData[counterToDeed[i]];
                currentIndex += 1;
            }
        }

        return properties;
    }

     /// @notice returns all NFT available
    /// @return nftProperty[] The array containing the tokenId, owner and tokenURI of the NFT owned by the caller    
    function getAllProperties() public view returns(propertyNft[] memory) {
        uint totalPropertyCount = _tokenCounter;
        uint currentIndex = 0;

        propertyNft[] memory properties = new propertyNft[](totalPropertyCount);

        for (uint i = 0; i < totalPropertyCount; i++) {
 
                properties[currentIndex] = propertyNftData[counterToDeed[i]];
                currentIndex += 1;
    
        }

        return properties;
    }

}