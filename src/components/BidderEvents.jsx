import {compareEvents} from "./BC_ Interaction/EventBidderDataListener";
import { getDistribution } from "./BC_ Interaction/PayableSMFunctions";
import React, { useState } from "react";

const BidderEvents = () => {

  const [list, setList] = useState([]);
  const[isVisibleDefault, setVisibleDef] = useState(true);

  const setVisib = () => {
    setVisibleDef(false);
  };

  const getBidderMatches = async () => {
    setVisib();
    const events = await compareEvents();
    setList(events);
  };

  return (
    <>
    <button onClick={getBidderMatches}>Your matches</button>
    <ul>{isVisibleDefault && 
        <nav className="eventForm">
        <li className="teamName">
          Team1 vs Team2
        </li>
        <span>Your choice: </span>
            <br/>
              <span>Amount: </span>
            <br/>
              <span>Match id: </span>
            <br/>
              <span>Match Status: </span>
            <br/>
            <br/>
              <button>{"Get prize"}</button>
        </nav>}
          {list.map(lists => (
            <nav className="eventForm">
            <li key={lists.selectedId} >
            <nav className="teamName">
              {`${lists.team1} vs ${lists.team2}`}
            </nav>
              <span>Your choice: {lists.choosenTeam}</span>
            <br/>
              <span>Amount: {lists.amount *  Math.pow(10, -18) + " eth"}</span>
            <br/>
              <span>Match id: {lists.choosenId}</span>
            <br/>
              <span>Match Status: {lists.matchStatus == 0 ? "Not finished": lists.matchStatus == 1 ? 
              `${lists.team1 } won`: `${lists.team2 } won`}</span>
            <br/>
            <br/>
              <button onClick={() => getDistribution(lists.choosenId)}>{"Get prize"}</button>
          </li>
          </nav>
          ))}
    </ul>
    </>
  )
}

export default BidderEvents;