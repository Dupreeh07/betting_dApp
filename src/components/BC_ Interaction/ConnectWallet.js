import  { provider } from "./ContractABI"
const ethers = require("ethers")

async function getWalletData(walletData, setwalletData, 
    connectStatus, setConnectStatus, 
    connect, setConnect
){  
    try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        // eslint-disable-next-line no-undef
        const chainId = await ethereum.request({ method: 'eth_chainId' });
        //const provider = new ethers.providers.Web3Provider(window.ethereum);
        // eslint-disable-next-line no-undef
        const accounts = await ethereum.request({ method: 'eth_accounts' });

       if (chainId == "0x5")
       { const balance = await provider.getBalance(accounts[0]);
        const balanceEth = ethers.utils.formatEther(balance);
        setwalletData(walletData = `
            \nNetwork: ${getNetworkName(chainId)}
            \nAddress: ${accounts.toString().slice(0, -37)}...${accounts.toString().slice(-4)}
            \nBalance: ${balanceEth.slice(0, -14)} eth`);
            
        setConnect(connect = "Connected")
        setConnectStatus(connectStatus = true);
        console.log(connectStatus)}
        else {
            setwalletData("Connect to Goerli")
            setConnect(connect = "Connected")
        }

    }catch (err) {
        setwalletData("Connection error " , err)
      console.error("getWalletData: ", err)
    }
}



function getNetworkName(chainId) {
    switch (chainId) {
    case '0x1':
    return 'Ethereum Mainnet';
    case '0x3':
    return 'Ropsten';
    case '0x4':
    return 'Rinkeby';
    case '0x5':
    return 'Goerli';
    case '0x2a':
    return 'Kovan';
    default:
    return 'Unknown';
    }
}

export  {getWalletData}