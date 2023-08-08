import React, { useState } from "react";
import { getWalletData } from "./BC_ Interaction/ConnectWallet"

const Header = () => {

  let [connect, setConnect] = useState("Connect wallet");
  let [walletData, setwalletData] = useState("");
  let [connectStatus, setConnectStatus] = useState(false);

  return(
    <>
      <button onClick={() => {getWalletData(walletData, setwalletData, 
        connectStatus, setConnectStatus, 
        connect, setConnect)}}>
        {connect}
      </button>
      <span className="walletData">{walletData}</span>
    </>
  ) 
} 

export default Header