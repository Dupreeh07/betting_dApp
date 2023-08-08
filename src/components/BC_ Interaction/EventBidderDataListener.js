import { prevEvents } from "./EventMatchesListener";
import  { contractAddress,  bidderDataABI, arrNewMatchesABI, provider, ifaceBidderData} from "./ContractABI"
const ethers = require("ethers")

const prevBidderEvents = async () => {
  if (typeof window.ethereum !== 'undefined') {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const contract = new ethers.Contract(contractAddress, bidderDataABI, provider);
    const events = [];
    let blockNumber = 0;

  const filter = {
    address: contractAddress,
    fromBlock: blockNumber,
    toBlock: 'latest',
    topics: [ifaceBidderData.getEventTopic('BidderData')],
  };

  while (true) {
    const logs = await provider.getLogs(filter);
    
    logs.forEach(log => {
      const parsedLog = contract.interface.parseLog(log);
      events.push({
        choosenTeam: parsedLog.args[0], 
        choosenId: parsedLog.args[1].toNumber(),
        amount: parsedLog.args[2].toString(),
        sender: parsedLog.args[3]
      });
    });
    if (logs.length === 1000) {
      blockNumber += 1000;
      filter.fromBlock = blockNumber + 1;
    } else {
      break;
    }
  }
        
  return events;
  }else {
  console.log("connect wallet or (set api)")
}
  
}

const handlerBidderData = async () => {
  return prevBidderEvents().then(events => {
    return(events);  
  })
  .catch(error => {
      console.error("error: ", error);
  });
}

const handlerEvents = async () => {
  return prevEvents().then(events => {
    return(events);  
  })
  .catch(error => {
    console.error("error: ", error);
  });
}

const compareEvents = async () => {
  try{
    const bidderEventArr = await handlerBidderData();
    const eventArr = await handlerEvents();
    //eslint-disable-next-line no-undef
    const accounts = await ethereum.request({ method: 'eth_accounts' });
    let bidderEvents = [];
    let bidderElement;

    for (let i = 0; i < bidderEventArr.length; i++){
      for(let j = 0; j < eventArr.length; j++ ){

        if(bidderEventArr[i].sender.toLowerCase() === accounts[0].toLowerCase() &&
        bidderEventArr[i].choosenId === eventArr[j].teams[2].toNumber()){
          bidderElement = {
            choosenTeam: bidderEventArr[i].choosenTeam,
            choosenId: bidderEventArr[i].choosenId,
            amount: bidderEventArr[i].amount,
            address: bidderEventArr[i].sender,
            team1: eventArr[j].teams[0],
            team2: eventArr[j].teams[1],
            matchStatus: await getStruct(bidderEventArr[i].choosenId),
          };
          bidderEvents.push(bidderElement); 
        }
      }
    }
    return bidderEvents;
  } catch(err){
    console.log(err)
  }
}

async function getStruct(_choosenId) {
  const clientContract = new ethers.Contract(contractAddress, arrNewMatchesABI, provider);
  const newMatches = await clientContract.newMatches(_choosenId);
  const decodedStruct = newMatches.matchStatus;
  return decodedStruct;
}


export { compareEvents }