const hre = require("hardhat");

async function main() {

  const BettingApi = await hre.ethers.getContractFactory("BettingApi");
  const bettingApi = await BettingApi.deploy();
  await bettingApi.deployed();


  const BettingClient = await hre.ethers.getContractFactory("BettingClient");
  const bettingClient = await BettingClient.deploy(bettingApi.address);
  await bettingClient.deployed();

  console.log(`BettingApiAddr: ${bettingApi.address}, BettingClient: ${bettingClient.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
//BettingClient: 0x90626A6de77407B38D2adb96fBd82A4016726fb1
//BettingApiAddr: 0xbD6c31C975f632b7C8e6DDbd8B2d3164a14BBC29 