import Web3 from "web3";

let myWeb3;
 
if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
    console.log('INFO: MyWeb3 - We are in the browser and metamask is running')
    window.ethereum.request({ method: "eth_requestAccounts" });
    myWeb3 = new Web3(window.ethereum);
} else {
    console.log('We are on the server *OR* the user is not running metamask')
    const network = process.env.ETHEREUM_NETWORK;
    const provider = new Web3.providers.HttpProvider(
        `https://${network}.infura.io/v3/${process.env.INFURA_API_KEY}`
    );
    myWeb3 = new Web3(provider);

    
}

export default myWeb3;

