// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";


contract BettingApi is ChainlinkClient, ConfirmedOwner {
    using Chainlink for Chainlink.Request;

    string public team1;
    string public team2; 
    string public hash;
    uint internal counter; 

    uint256 private fee;
    bytes32 private jobId;

    bool public reqCompleted;


    event RequestFirstId(bytes32 indexed requestId, string team1); 

    /**
     * Goerli Testnet details:
     * Link Token: 0x326C977E6efc84E512bB9C30f76E30c160eD06FB
     * Oracle: 0xCC79157eb46F5624204f47AB42b3906cAA40eaB7
     * jobId: 7d80a6386ef543a3abb52817f6707e3b response must be string
     */
    constructor() ConfirmedOwner(msg.sender) {
        setChainlinkToken(0x326C977E6efc84E512bB9C30f76E30c160eD06FB);
        setChainlinkOracle(0xCC79157eb46F5624204f47AB42b3906cAA40eaB7);
        jobId = "7d80a6386ef543a3abb52817f6707e3b"; 
        fee = (1 * LINK_DIVISIBILITY) / 10; // 0,1 * 10**18 (Varies by network and job)
    }

    
    function requestFirstId(string memory _req) public returns (bytes32 requestId) {
        Chainlink.Request memory req = buildChainlinkRequest(
            jobId,
            address(this),
            this.fulfill.selector
        );
        req.add(                                   
            "get",                               
            "https://dota.haglund.dev/v1/matches" //"0,teams,0,name" request example
        );                                       
        req.add("path", _req);    
        return sendChainlinkRequest(req, fee);
    }

    function fulfill(
        bytes32 _requestId,
        string memory _response 
    ) public recordChainlinkFulfillment(_requestId) {
        emit RequestFirstId(_requestId, _response);
        if (counter == 0){
            team1 = _response; 
            counter++;
        } else if (counter == 1){
            team2 = _response;
            counter++;
        } else{
            hash = _response;
            counter = 0;
            reqCompleted = true;
        }
    }

    function withdrawLink() public onlyOwner {
        LinkTokenInterface link = LinkTokenInterface(chainlinkTokenAddress());
        require(
            link.transfer(msg.sender, link.balanceOf(address(this))),
            "Unable to transfer"
        );
    }
}


contract BettingClient is BettingApi{
    BettingApi bettingApi;

    struct NewMatch {
        string team1;
        string team2;
        string hash;
        uint betAmountT1;
        uint betAmountT2;
        /* matchStatus 0 not completed, 1 team1 won, 2 team2 won */
        uint8 matchStatus; 
    }
    NewMatch[] public newMatches; //3 slot?

    /** 
      * array[betAmount, selectedTeam(1 or 2)]   
    */
    mapping(uint => mapping(address => uint[2])) public PlayersBets;
    constructor(address bettingApiAddr){
        NewMatch memory newMatch = NewMatch(
            "",
            "",
            "",
            5,                  
            5,                  
            5                   
        );
        newMatches.push(newMatch);
        bettingApi =  BettingApi(bettingApiAddr);
    }

    event EventData (string, string, uint);
    event BidderData (string, uint, uint, address);

    function createEvent() external onlyOwner{
        require(bettingApi.reqCompleted() == true, "req not ready");

        bytes memory prevHash = abi.encodePacked(newMatches[(newMatches.length - 1)].hash);
        bytes memory currHash = abi.encodePacked(bettingApi.hash());

        require(keccak256(prevHash) != keccak256(currHash), "already exist");

        NewMatch memory newMatch = NewMatch(
        /**public bettingApi variables **/
            bettingApi.team1(), 
            bettingApi.team2(),
            bettingApi.hash(),
            0,
            0,
            0
        );

        newMatches.push(newMatch);
        emit EventData (bettingApi.team1(), bettingApi.team2(), (newMatches.length - 1));
    }

    function createBid(string memory _team, uint id) external payable{
        require (msg.value >= 0, "amount = 0");
        /*      a player can only place a bet once      */
        require (PlayersBets[id][msg.sender][0] == 0, "already placed"); 
        require(newMatches[id].matchStatus == 0, "already closed"); 

        bytes memory team1Name = abi.encodePacked(newMatches[id].team1);
        bytes memory team2Name = abi.encodePacked(newMatches[id].team2);
        bytes memory teamBytes = abi.encodePacked(_team);

        require(
            keccak256(team1Name) == keccak256(teamBytes) ||
            keccak256(team2Name) == keccak256(teamBytes), "incorrect teams"
        );

        if (keccak256(team1Name) == keccak256(abi.encodePacked(teamBytes))){
            newMatches[id].betAmountT1 += msg.value; 
            PlayersBets[id][msg.sender] = [msg.value, 1]; 
        } else {
        keccak256(team2Name) == keccak256(abi.encodePacked(teamBytes));
        newMatches[id].betAmountT2 += msg.value;
        PlayersBets[id][msg.sender] = [msg.value, 2];
        }
        emit BidderData (_team, id, msg.value, msg.sender);
    }

    function slctWinner(uint _id, uint8 _matchStatus) external onlyOwner {
        require (_matchStatus == 1 || _matchStatus == 2);
        newMatches[_id].matchStatus = _matchStatus;
    }

    function distribution(uint _id) external {
        require(newMatches[_id].matchStatus != 0, "not closed yet");
        uint bet = PlayersBets[_id][msg.sender][0];                                                          
        uint betAmountT1 = newMatches[_id].betAmountT1;               
        uint betAmountT2 = newMatches[_id].betAmountT2;
        uint winAmountT1;
        uint winAmountT2;
        
        if (newMatches[_id].matchStatus == 1){
            require(PlayersBets[_id][msg.sender][1] == 1, "you lost");

            winAmountT1 = bet + ((bet * betAmountT2)/ betAmountT1); 
            PlayersBets[_id][msg.sender][0] == 0;               
            (bool sent,) = msg.sender.call{value: (winAmountT1 * 97 /100)}("");//3% fee
            require(sent, "Failed to send Ether");

        }else if(newMatches[_id].matchStatus == 2){
            require(PlayersBets[_id][msg.sender][1] == 2, "you lost");

            winAmountT2 = bet + ((bet * betAmountT1)/ betAmountT2);
            PlayersBets[_id][msg.sender][0] == 0;

            (bool sent,) = msg.sender.call{value: (winAmountT2 * 97 /100)}("");//3% fee
            require(sent, "Failed to send Ether");
        }
    }
}        
            