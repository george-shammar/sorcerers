require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config()

/** @type import('hardhat/config').HardhatUserConfig */

const optimismGoerliUrl = 
  process.env.ALCHEMY_API_KEY ? 
    `https://opt-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}` :
    process.env.OPTIMISM_GOERLI_URL

module.exports = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    "optimism-goerli": {
       url: optimismGoerliUrl,
       accounts: { mnemonic: process.env.MNEMONIC }
    },
  }
};
