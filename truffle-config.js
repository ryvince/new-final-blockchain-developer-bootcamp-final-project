const HDWalletProvider = require('@truffle/hdwallet-provider');
const dotenv = require('dotenv');
dotenv.config();
const mnemonic = process.env.MNEMONIC;

// require("dotenv").config();
// const HDWalletProvider = require("@truffle/hdwallet-provider");
// const privateKeys = process.env.PRIVATE_KEYS || "";

module.exports = {
  networks: {
    ganache_gui: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*"
    },
    ganache_cli: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
      gas: 5000000
    },

    rinkeby: {
      provider: () => new HDWalletProvider(mnemonic, process.env.INFURA_URL),
      network_id: "4",
      gas: 5500000
    },

    // rinkeby: {
    //   provider: function () {
    //     return new HDWalletProvider(
    //       privateKeys.split(","),
    //       `https://rinkeby.infura.io/v3/${process.env.INFURA_ID}`
    //     );
    //   },
    //   gas: 5000000,
    //   gasPrice: 5000000000, // 5 gwei
    //   network_id: 4,
    //   skipDryRun: true,
    // },

  },
  contracts_directory: "./contracts/",
  contracts_build_directory: "./src/abis/",
  migrations_directory: "./migrations/",
  test_directory: "./test/",
  compilers: {
    solc: {
      version: "0.8.0",
      optimizer: {
        enabled: true,
        runs: 200
      },
    },
  }
};
