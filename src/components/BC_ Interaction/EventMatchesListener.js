import  { contractAddress,  eventABI, provider, ifaceEvent} from "./ContractABI"
const ethers = require("ethers")

const prevEvents = async () => {
  if (typeof window.ethereum !== 'undefined') {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const contract = new ethers.Contract(contractAddress, eventABI, provider);
    const events = [];
    let blockNumber = 0;

    const filter = {
        address: contractAddress,
        fromBlock: blockNumber,
        toBlock: 'latest',
        topics: [ifaceEvent.getEventTopic('EventData')],
    };

    while (true) {
      const logs = await provider.getLogs(filter);
      
      logs.forEach(log => {
        const parsedLog = contract.interface.parseLog(log);
        events.push({teams: parsedLog.args, txHash: log.transactionHash});
      });
      if (logs.length === 1000) {
          blockNumber += 1000;
          filter.fromBlock = blockNumber + 1;
        } else {
          break;
        }
    }
        
    return events;
  }
}




export  {prevEvents}