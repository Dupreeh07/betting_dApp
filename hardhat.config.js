require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config()
require("@nomiclabs/hardhat-etherscan");

const API_URL = process.env.API_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

/** 
 * @type import('hardhat/config').HardhatUserConfig 
 * Goerli deployed
*/
module.exports = {
  solidity: "0.8.18",
  defaultNetwork: "goerli",
  networks: {
  hardhat: {},
  goerli: {
  url: API_URL,
  accounts: [`0x${PRIVATE_KEY}`],
    },
  },/* Etherscan verification */
  etherscan: { 
    apiKey: `${process.env.ETHERSCAN_KEY}`
  }

}
/**npx hardhat verify --network goerli BettingApiAddr
  npx hardhat verify --network goerli BettingClientAddr "BettingApiAddr" 
  that's constructor argument
**/