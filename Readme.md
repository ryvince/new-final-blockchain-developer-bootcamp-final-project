 blockchain-developer-bootcamp-final-project

# update version 3.0 rebuild local sync


## ETHEREUM ADDRESS FOR CERTIFICATE 

```
0xFCA6530dC2810c35C92bB8E26109f327Ce0a2531
```

## INTRODUCTION AND CONCEPT

```
This project aims to explore the use of NFTs in real estate, as well as personal property (cars, boats, RVs, etc.). This Dapp will allows 
the purchase of real world/physical property, given an NFT that represents the property. The NFT will be the deed to the land or property that belongs to the buyer and can be proved. 

🚀 The project can be further extended, to include other title-related assets like cars, boats, etc. Additionally, it would be nice to add the option to 'bid' or offer a price below ask, so that the buyer can potentially negotiate a deal through the app.

```
## PUBLIC URL - FRONTEND

-Needs updated links:
- [https://boring-bose-c1ae6a.netlify.app/](https://boring-bose-c1ae6a.netlify.app/)
- Alternative Site - [https://contract-estate.herokuapp.com/](https://contract-estate.herokuapp.com/)
```
NB: If is fails to load the first time and displays a heroku erro, refresh the page.
```

## SCREENCAST

-insert Youtube link

## GETTING STARTED LOCALY

### 1. Local Solidity Spin
```
After cloning directory; change dir to folder used
cd ../blockchain-developer-bootcamp-final-project

Open a second terminal and then start local ganache network: 
'ganache-cli -p 7545'

Back in the oringinal terminal (within the proj directory)
'yarn install'

'npm install'

Not required, but if npm critical errors / issues running npm, the following command can force update depricated versions that may exist:
' npm audit fix --force'

To run the truffle tests:
'truffle test' - should compile and run both Contract's test.js files - will run on netork 'test' by default
'truffle test --network ganache_gui' 

To compile contracts (or recompile the contract files, including imported contracts):
'truffle compile' 

Reset truffle:
'truffle migrate --reset'
```
### 2. React Local Spin


```
npm start

note: if file presents react-scripts package dependency, use the provided .env.example file to create a new .env file
In the example provided will be included this setting as well as example of the API keys, other requirements (without private keys)
SKIP_PREFLIGHT_CHECK=true

opens in browser link: https://localhost:3000

If you haven't installed or encounter issues, make sure react is installed with:
npm i react-scripts

Before migrating new contract via Infura; update .env file with Infura UR and Mnemonic

Also
npm install @truffle/hdwallet-provider

Then run truffle migrate --network rinkeby

Note on npm start: if receiving error notifications related to npm start, i.e. compiler versions, you may need to create a local ..env file and include the suggested statement SKIP_PREFLIGHT_CHECK=true  
Refer to .envExample for details on the .env requirements

```
## FILE STRUCTURE

```
blockchain-developer-bootcamp-final-project
├── .gitignore
├── truffle-config.js
├── package.json
├── README.md
└──  contracts
	├── ContractEstate.sol
	├── Migrations.sol
	└── SmartProperty.sol
└── migrations
	├── 1_initial_migration.js
	└── 2_deploy_contracts.js
├── public
└── src
	├── abis
	├── Components
	├── Pages
	└── utils
		├── ipfs.js
		└── mint.js
	├── App.js
	├── index.js
	├── ReportWebVitals.js
	└── ...
└── test
	├── 1_contractEstate-test.js
	└── 2_smartProperty-test.js

As included in truffle.config: 
contracts_directory: "./contracts/",
  contracts_build_directory: "./src/abis/",
  migrations_directory: "./migrations/",
  test_directory: "./test/",
  compilers: {

```

## PROCESS FLOW / CUSTOMER JOURNEY

```
0. During first time visit, the dapp checks for metamask presence and contract deployment on 
selected network. It notifies if the contract is not deployed on the selected network. 
(NETWORKS - Rinkeby, local )

if connected, the app displays the wallet address the user has connected.
```

### ENLISTING A PROPERTY FOR SALE
```
- 1. Select the 'Sell Property' menu option

- 2. Upload property image and enter fill all fields dislayed

- 3. Submit the request. 

NOTES: On submit, the dapp uploads data to ipfs via (ips.infura.io) and returns the CID and 
tokenURI. The NFT is then minted immediately to the seller's address. After it is minted it is 
then enlisted to the market place and appears as sold

- 4. Approve transaction on metamask to mint

- 5. Approve transaction on metamask to list property on the market.

- 6. Navigate to the property Marketplace to view the newly listed property
```

### BUYING A PROPERTY
```
- 1. The landing page diplays the list of properties available for purchase on the market place

- 2. Buy option requests for permision to pay x ETH to the property owner

- 3. On successful payment, property is transfered to the buyer and delisted from the market place. 
```

## DEPENDENCIES AND COMMANDS - INSTRUCTIONS - Potentially remove or delete this section seems duplicative

```
npm install  (installing all dependencies)

truffle test --network ganache_gui (running on port 7545)
truffle test --network ganache_cli (running on port 8545)

truffle compile

truffle migrate --reset 

npm start (running react frontend locally)
```

## ISSUES
- [Github Issues Page](https://github.com/ryvince/blockchain-developer-bootcamp-final-project/issues)

## CONTACT
- [Email Ryan Vincent](mailto:ryvince.dev@gmail.com)
