import React from "react";
import Header from "./components/Header";
import SportEvents from "./components/SportEvents"; 
import BidderEvents from "./components/BidderEvents"; 
import './App.css'
import './components/SportEvents.css'

function App(){
  return (
    <div className="app-wrapper">
      <div className="header">
        <Header> </Header>
      </div>
      <div className="body">
        <SportEvents></SportEvents>
      </div>
      <div className="bidderEvents">
      <BidderEvents></BidderEvents>
      </div>
    </div>
  );
}


export default App;
