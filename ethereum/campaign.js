import myWeb3 from './MyWeb3';
import campaignObject from "../ethereum/build/CrowdFundCampaign.json";

export async function getCampaignInstance(contractID) {
    
    console.log('INFO-Campaign: creating new Campaign Instance for', contractID);
    const campaignInstance = await new myWeb3.eth.Contract(
        campaignObject.abi,
        contractID
    );
    //console.log('INFO-Campaign: logging contract methods ', campaignInstance.methods);
    
    return campaignInstance;
  }