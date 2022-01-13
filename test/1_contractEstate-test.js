const { assert } = require('chai');
var SmartPropertyMarket = artifacts.require("./SmartProperty.sol");
var ContractEstate = artifacts.require("./ContractEstate.sol");


contract('ContractEstate', function(accounts) {
// describe(' Contract', async () => {

	let tokenId

	// Tests contract addresses
	it('should check if Addresses are defined - all contracts must have defined address',  () => {
		SmartPropertyMarket.deployed().then( function(smartPropertyMarket) {
			ContractEstate.deployed(smartPropertyMarket.address).then(function(estatePropertyNft){

				assert.notEqual(smartPropertyMarket.address, 0x0)
				assert.notEqual(smartPropertyMarket.address, null)
				assert.notEqual(smartPropertyMarket.address, undefined)
		
				assert.notEqual(estatePropertyNft.address, 0x0)
				assert.notEqual(estatePropertyNft.address, null)
				assert.notEqual(estatePropertyNft.address, undefined)
			});
		});
	})

	// Tests name for the token of the contract
	it('Should have a name', async () => {
		await SmartPropertyMarket.deployed().then( async function(smartPropertyMarket) {
			await ContractEstate.deployed(smartPropertyMarket.address).then( async function(estatePropertyNft){
				const name = await estatePropertyNft.name();
				assert.equal(name, 'Title Transfer Token');
			});
		});
	});

	// Tests symbol for the token of ContractEstate contract
	it('Should have a symbol', async () => {
		await SmartPropertyMarket.deployed().then(async function(smartPropertyMarket) {
			await ContractEstate.deployed(smartPropertyMarket.address).then(async function(estatePropertyNft){
				const symbol = await estatePropertyNft.symbol()
				assert.equal(symbol, 'TTT');
			});
		});
	});

	// Tests for NFT minting function of ContractEstate contract passing tokenURI, price and _deed to the NFT
	it('Should be able to mint NFT when all arguments are passed', async () => {
		await SmartPropertyMarket.deployed().then( async function(smartPropertyMarket) {
			await ContractEstate.deployed(smartPropertyMarket.address).then( async function(estatePropertyNft){
				// Mints a NFT
				await estatePropertyNft.createPropertyNft('https://ipfs.io/societychain/ipfs/QmdV8XAutRJqrXRo99AYgNcX9iG7zvSHf7C27ZsBQh6xp6?filename=1oexpression-of-interest-for-mining-proposal.pdf', 30000000000, 122384).then(async function(response){
					tokenId = await response.logs[0].args['2']['words'][0];
					assert.equal(tokenId, 122384);
				});
				
				// checks if the nft was actually created and it exists
				await estatePropertyNft.checkIfPropertyExists(tokenId).then(function(response){
					assert.equal(response,  true, 'Minting failed. Minted Property not available');
				});
			});
		});
	});


	// Test for number of NFTs owned by an address
	it('Should be able to return number of NFTs owned by and address', async () => {
		await SmartPropertyMarket.deployed().then( async function(smartPropertyMarket) {
			await ContractEstate.deployed(smartPropertyMarket.address).then(async function(estatePropertyNft){
				// Mints an NFT twice
				await estatePropertyNft.createPropertyNft('https://ipfs.io/societychain/ipfs/QmdV8XAutRJqrXRo99AYgNcX9iG7zvSHf7C27ZsBQh6xp6?filename=1oexpression-of-interest-for-mining-oposal.pdf', 30000000000, 12384).then(function(){});
				await estatePropertyNft.createPropertyNft('https://ipfs.io/societychain/ipfs/QmdV8XAutRJqrXRo99AgNcX9iG7zvSHf7C27ZsBQh6xp6?filename=1oexpression-of-interest-for-mining-proosal.pdf', 4000000000, 1238874).then(function(){});
		
				// Returns the array of Properties owned by the address
				let propertiesOwned = await estatePropertyNft.getUserProperties();

				assert.equal(propertiesOwned.length, 3);
			});
		});
	});
})