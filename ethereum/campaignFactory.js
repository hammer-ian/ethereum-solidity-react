import myWeb3 from './MyWeb3';
import campaignFactoryObject from "../ethereum/build/CrowdFundCampaignFactory.json";

//to ensure code executed by Next.js on the browser side can access process.env variables, need to prefix with NEXT_PUBLIC
console.log('INFO-CampaignFactory: creating new CampaignFactoryInstance')
const campaignFactoryInstance = new myWeb3.eth.Contract(
    campaignFactoryObject.abi,
    process.env.NEXT_PUBLIC_CAMPAIGN_FACTORY_CONTRACT
);
//console.log('INFO-CampaignFactory: Logging contract methods ', campaignFactoryInstance.methods);
export default campaignFactoryInstance;