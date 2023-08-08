const ethers = require("ethers")

const contractAddress = "0x90626A6de77407B38D2adb96fBd82A4016726fb1"; //clientContract
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();


const bidderDataABI = ["event BidderData (string, uint, uint, address);"];
const arrNewMatchesABI = [{
  "inputs": [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ],
  "name": "newMatches",
  "outputs": [
    {
      "internalType": "string",
      "name": "team1",
      "type": "string"
    },
    {
      "internalType": "string",
      "name": "team2",
      "type": "string"
    },
    {
      "internalType": "string",
      "name": "hash",
      "type": "string"
    },
    {
      "internalType": "uint256",
      "name": "betAmountT1",
      "type": "uint256"
    },
    {
      "internalType": "uint256",
      "name": "betAmountT2",
      "type": "uint256"
    },
    {
      "internalType": "uint8",
      "name": "matchStatus",
      "type": "uint8"
    }
  ],
  "stateMutability": "view",
  "type": "function"
},
];
const eventABI = ["event EventData (string, string, uint);"];
const ifaceEvent = new ethers.utils.Interface(eventABI);
const ifaceBidderData = new ethers.utils.Interface(bidderDataABI);

const CreateBidABI = [{

    "inputs": [
        {
            "internalType": "string",
            "name": "_team",
            "type": "string"
        },
        {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
        }
    ],
    "name": "createBid",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
},
];
const distributionABI = [{
  "inputs": [
    {
      "internalType": "uint256",
      "name": "_id",
      "type": "uint256"
    }
  ],
  "name": "distribution",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
},
];

export { contractAddress, provider, signer,  bidderDataABI, arrNewMatchesABI, 
  eventABI, ifaceEvent, ifaceBidderData, CreateBidABI, distributionABI }

/**
 * 
 *   Level UP       Player1 0.1  Player2 0.5
 *   vs Luna Galaxy Player3 0.1            Luna won
 * 
 *   Nigma Galaxy   0.485 0.1 Player2 0.3  Nigma won
 *   vs One Move    Player3 0.1                                               
 *
 *   Virtus.pro     0.485 0.1
 *   vs Alliance 
 * 
 *      winAmountT1 = bet + ((bet * betAmountT2)/ betAmountT1); 
 *       
 *      winAmountT2 = bet + ((bet * betAmountT1)/ betAmountT2);
 *       
 * 
 *      1. 0.485 0.7 
 * 
 *      2. Player3  0.125 Player2 0.375 
 */