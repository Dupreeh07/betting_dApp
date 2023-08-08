import React, { useState } from "react";
import { prevEvents } from "./BC_ Interaction/EventMatchesListener";
import { createBid } from "./BC_ Interaction/PayableSMFunctions";
import FormList from "./FormList";
import CreateBidComponents from "./CreateBidComponents";


const SportEvents = () => {

  const [list, setList] = useState([]);
  const [ethValue, setEthValue] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");
  const[isVisibleDefault, setVisibleDef] = useState(true);


  const getCurrMatches = async () => {
    prevEvents().then(events => {
      setList(events);
      setVisibleDef(false);
      return(events);  
  })
  .catch(error => {
      console.error(error);
  }); 
  };

  const handleChangeCheckbox = (event) => {
    setSelectedTeam(event.target.value);
  };


  const handleBid = (indexId) => {
    createBid(indexId, ethValue, selectedTeam);
    console.log(indexId, ethValue, selectedTeam);
  }

  return(
    <>
      <button onClick={getCurrMatches}>Upcomning matches</button>    
        <ul>{isVisibleDefault && 
        <nav className="eventForm">
        <li className="teamName">
          Team1 vs Team2
        </li>
        <FormList team1="Team 1" team2=" Team 2"></FormList>
        <CreateBidComponents></CreateBidComponents>
        </nav>}
          {list.map(lists => (
            <nav className="eventForm">
            <nav className="teamName">
            <li key={lists.txHash} value={(lists.teams[2]).toNumber()} >
              {`${lists.teams[0]} vs ${lists.teams[1]}`}
            </li>
            </nav>
            <br/>
              <FormList 
                team1={lists.teams[0]}
                team2={`${lists.teams[1]}`}
                selectedTeam={selectedTeam}
                handleChangeCheckbox={handleChangeCheckbox}>
              </FormList>
              <br/>
              <CreateBidComponents
                setEthValue={setEthValue}
                handleClick={handleBid}
                eventId={lists.teams[2]}>
              </CreateBidComponents>
            </nav>  
          ))}
        </ul>
    </> 
  ) 
} 

export default SportEvents