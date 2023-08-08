import  { contractAddress,  CreateBidABI, distributionABI, signer} from "./ContractABI"
const ethers = require("ethers")


const createBid = async (indexId, ethValue, selectedTeam) => {
    if (selectedTeam !== "" && ethValue !== "0"){
      const clientContract = new ethers.Contract(contractAddress, CreateBidABI, signer);
      const options = {value: ethers.utils.parseEther(ethValue), gasLimit: 1000000}; //fix it
      const bid = await signer.sendTransaction({
        to: clientContract.address,
        value: options.value, // мб поменять на ethValue
        data: clientContract.interface.encodeFunctionData("createBid", [selectedTeam, indexId]),
        gasLimit: options.gasLimit
      });
      await bid.wait();
      
    } else {
      console.log("choose team")
      console.log(ethValue)
    }
}

const getDistribution = async (_choosenId) => {
  const clientContract = new ethers.Contract(contractAddress, distributionABI, signer);
  const distribution = await signer.sendTransaction({
    to: clientContract.address, 
    data: clientContract.interface.encodeFunctionData("distribution", [_choosenId]),
    gasLimit: 1000000
  });
  await distribution.wait();
}


export {createBid, getDistribution}