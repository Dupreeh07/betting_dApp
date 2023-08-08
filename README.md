Decentralized application for eSports betting. Requests are made with https://dota.haglund.dev/v1/matches , BettingApi contract and Chainlink goerli Oracles. Alchemy key is used to deploy contracts. Some functions are not available in frontend, so there is etherscan goerli verification for using this func. 

npx hardhat clean
npx hardhat compile
npx hardhat run scripts\deploy.js --network goerli
npx hardhat verify --network goerli BettingApi.address
npx hardhat verify --network goerli clientContract.address 'BettingApi.address'
npm start

Backend runs on blockchain with solidity. Implementation of the entire backend on the blockchain is not the best way, because some functions are expensive and contract stores string data. Probably it makes sense to implement a contract factory CREATE CREATE2. But it was created to demonstrate.