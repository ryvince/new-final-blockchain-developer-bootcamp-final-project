var SmartPropertyMarket = artifacts.require("./SmartProperty.sol");
var ContractEstate = artifacts.require("./ContractEstate.sol");

module.exports = function(deployer) {
  deployer.deploy(SmartPropertyMarket, {gas: 6721975}).then(function() {
    return deployer.deploy(ContractEstate, SmartPropertyMarket.address, {gas: 6721975});
  });
};

///  getContractFactory and console log

// async function main() {
// 	const SmartPropertyMarket = await hre.ethers.getContractFactory('SmartPropertyMarket')
// 	const smartPropertyMarket = await SmartPropertyMarket.deploy()
// 	await smartPropertyMarket.deployed()
// 	console.log('SmartProperty contract deployed to:', smartPropertyMarket.address)

// 	const ContractEstate = await hre.ethers.getContractFactory('ContractEstate')
// 	const estatePropertyNft = await ContractEstate.deploy(smartPropertyMarket.address)
// 	await estatePropertyNft.deployed()
// 	console.log('ContractEstate contract deployed to:', estatePropertyNft.address)
// }

// const runMain = async () => {
// 	try {
// 		await main()
// 		process.exit(0)
// 	} catch (error) {
// 		console.error(error)
// 		process.exit(1)
// 	}
// }

// runMain()