// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./ContractEstate.sol";

/// @title Title Transfer SmartProperty
/// @author Ryan Vincent
/// @dev This contract is used to list new properties on a Real Estate NFT Market
/// @dev _propertyListingId is an auto incremental id to identify the position on the market place
/// @dev  Counters library is being used to track property deeds for properties listed and number of properties Sold.
contract SmartProperty is Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _propertyListingId;
    Counters.Counter private _propertiesSold;

    ContractEstate public directestatePropertyNft;

    address payable buyer;
    mapping(uint256 => Property) private propertyData;

    constructor() {
        buyer = payable(msg.sender);
    }

    struct Property {
        uint256 propertyListingId;
        uint256 propertyValue;
        bool sold;
        uint256 deedNumber;
        address payable seller;
        address payable buyer;
    }

    event PropertyListed (
        uint256 indexed propertyListingId,
        uint256 indexed deedNumber,
        address seller,
        address buyer,
        uint256 propertyValue,
        bool sold
    );

    event Purchase(address seller, address buyer, uint256 price, uint256 deed, bool sold);

    /// @dev sells an existing property st price greater than zero
    /// @dev first the property is not already listed as for sale
    /// @param deedNumber Token ID of the Property
    /// @param listingId Current property listing id 
    /// @param propertyValue Price of the Property specified by the seller
    function relistProperty(
        uint256 listingId,
        uint256 deedNumber, 
        uint256 propertyValue,
        address ownerAddress) 
        public payable nonReentrant {
        
        require(propertyValue > 0, "Please enter a price greater than 0");
        require(propertyData[listingId].buyer != address(this), "The property is already listed for sale on the market");

        uint256 propertyListingId = _propertyListingId.current();

        propertyData[propertyListingId] = Property(
            propertyListingId,
            propertyValue,
            false,
            deedNumber,
            payable(msg.sender),
            payable(address(this))
        );

        ERC721(ownerAddress).setApprovalForAll(address(this), true);
        ERC721(ownerAddress).transferFrom(msg.sender, address(this), deedNumber);
        ERC721(ownerAddress).approve(msg.sender, deedNumber);
    
        _propertyListingId.increment();

        emit PropertyListed(
            propertyListingId,
            deedNumber,
            msg.sender,
            address(this),
            propertyValue,
            false
        );
    }

    /// @notice lists a seller's property on the real estate market
    /// @dev transfers the property from seller(buyer) to the Smart Property Contract
    /// @dev first checks if the property is not listed already by checking the deedNumber
    /// @param deedNumber Token ID of the Property
    /// @param propertyValue Price of the Property specified by the seller
    function listPropertyOnEstateMarket(
        uint256 deedNumber, 
        uint256 propertyValue,
        address ownerAddress) 
        public payable nonReentrant {
        
        require(propertyValue > 0, "Price must be greater than 0");

        uint256 propertyListingId = _propertyListingId.current();

        propertyData[propertyListingId] = Property(
            propertyListingId,
            propertyValue,
            false,
            deedNumber,
            payable(msg.sender),
            payable(address(this))
        );

        ERC721(ownerAddress).transferFrom(msg.sender, address(this), deedNumber);

        _propertyListingId.increment();

        emit PropertyListed(
            propertyListingId,
            deedNumber,
            msg.sender,
            address(this),
            propertyValue,
            false
        );
    }
    /// @dev Transfer the property value amount from the buyer to the seller of the property.
    /// @dev Transfers the deeds from the Smart Property contract to the buyer
    /** @notice Functions requires that the property is listed as for sale, that the buyer is not the seller of the property
                the price and deed number are specified. 
    */
    /// @param propertyListingId Listing ID of the property on the real estate market place
    function sellPropertytoBuyer(
        uint256 propertyListingId,
        address ownerAddress
        ) public payable nonReentrant {

        uint256 deedNumber = propertyData[propertyListingId].deedNumber;
        uint256 propertyValue = propertyData[propertyListingId].propertyValue;

        require(!propertyData[propertyListingId].sold, "Sorry this purchase failed; the property is no longer for sale.");
        require(msg.sender!=propertyData[propertyListingId].seller, 'You already own this property.');
        require(deedNumber>0, 'Property doesnt exist');
        require(msg.value == propertyValue, 'Value entered is below property sale price of ${propertyValue}. Please submit the list price in order to buy this property.');

        (bool success, ) = propertyData[propertyListingId].seller.call{value: msg.value}("");
        require(success, "Transfer failed");

        ERC721(ownerAddress).transferFrom(address(this), msg.sender, deedNumber);

        propertyData[propertyListingId].buyer = payable(msg.sender);
        propertyData[propertyListingId].sold = true;
        _propertiesSold.increment();

        emit Purchase(propertyData[propertyListingId].seller, msg.sender, msg.value, deedNumber,propertyData[propertyListingId].sold);
    }

    /// @notice Returns the details of the properties owned by the customer
    /// @return Property[] All the properties owned by the customer
    function getPropertiesOwnedByCustomer() public view returns(Property[] memory) {
        
        uint256 propertyCount = _propertyListingId.current();
        uint256 numberOfProperties = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < propertyCount; i++) {
            if (!propertyData[i].sold && propertyData[i].seller == msg.sender) { //OR WHEN THE SOLD IS STILL FALSE THEN 
                numberOfProperties += 1;
            }

            if (propertyData[i].sold && propertyData[i].buyer == msg.sender) { //OR WHEN THE SOLD IS STILL FALSE THEN 
                numberOfProperties += 1;
            }
        }

        Property[] memory customerProperties = new Property[](numberOfProperties);

        for (uint256 i = 0; i < propertyCount; i++) {
            if (!propertyData[i].sold && propertyData[i].seller == msg.sender){
                uint256 currentId = i;
                Property storage currentItem = propertyData[currentId];
                customerProperties[currentIndex] = currentItem;
                currentIndex += 1;
            }

            if (propertyData[i].sold && propertyData[i].buyer == msg.sender){
                uint256 currentId = i;
                Property storage currentItem = propertyData[currentId];
                customerProperties[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }

        return customerProperties;
    }

    /// @notice Finds all properties.
    /// @return Property[] All the marketplace properties
    function getAllProperties() public view returns(Property[] memory) {
        uint256 numberOfProperties = _propertyListingId.current();
        uint256 currentIndex = 0;

        Property[] memory availableProperties = new Property[](numberOfProperties);
        
        for(uint256 i = 0; i < numberOfProperties; i++) {
                uint256 currentId = i;
                Property storage currentItem = propertyData[currentId];
                availableProperties[currentIndex] = currentItem;
                currentIndex += 1;
        }

        return availableProperties;
    }


    /// @notice Finds all available properties. i.e properties still available for buying.
    /// @return Property[] All the unsold marketplace properties
    function getAvailableProperties() public view returns(Property[] memory) {
        uint256 numberOfProperties = _propertyListingId.current();
        uint256 numberOfAvailableProperties = _propertyListingId.current() - _propertiesSold.current();
        uint256 currentIndex = 0;

        Property[] memory availableProperties = new Property[](numberOfAvailableProperties);
        
        for(uint256 i = 0; i < numberOfProperties; i++) {
            if (propertyData[i].buyer == address(this)) {
                uint256 currentId = i;
                Property storage currentItem = propertyData[currentId];
                availableProperties[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }

        return availableProperties;
    }

    ///@notice check if the customer is the true owner of a property
    ///@param propertyListingId is the property ID on the market
    ///@param userAddress is the current owner of the property
    ///@return bool if the userAddress is the owner of the properties
    function verifyPropertyOwnership(uint256 propertyListingId, address userAddress) public view returns(bool){
        if (propertyData[propertyListingId].sold  && propertyData[propertyListingId].buyer == userAddress){
            return true;
        }else if (!propertyData[propertyListingId].sold  && propertyData[propertyListingId].seller == userAddress){
            return true;}
        else {
            return false;
        }
    }

    /// @notice Finds a property by listing ID
    /// @param propertyListingId ID of the property to be fetched
    /// @return Property Details
    function findPropertyById(uint256 propertyListingId) public view returns(Property memory) {
        return propertyData[propertyListingId];
    }

    /// @notice Finds a property by listing deed number
    /// @param deedNumber property deed
    /// @return Property Details
    function findPropertyByDeed(uint256 deedNumber) public view returns(Property memory) {
        uint256 positionIndex;
        uint256 propertyCount = _propertyListingId.current();
        for (uint256 i = 0; i < propertyCount; i++) {
            if (propertyData[i].deedNumber == deedNumber) {
                positionIndex = i;
            }
        }
        require(positionIndex>=0);
        return propertyData[positionIndex];
    }

    ///@dev receive() and fallback() functions added to allow the contract to receive ETH and data  
    receive() external payable {
    }

    fallback() external payable {
    }
}