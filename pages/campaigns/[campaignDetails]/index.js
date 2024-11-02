import Layout from '../../../components/Layout';
import Contribute from '../../../components/Contribute';
import { getCampaignInstance } from '../../../ethereum/campaign';
import { Card, Grid, Button} from 'semantic-ui-react';
import myWeb3 from '../../../ethereum/MyWeb3';
import Link from 'next/link';

//props get passed from getServerSideProps, and rendered server side
function CampaignDetails ( props ) {

  function renderCampaignDetails() {

    const items  = [
      {
        header: props.managerAddress,
        meta: 'Address of Manager',
        description: 'The Campaign Manager who created this campaign and can withdraw money',
        style: {overflowWrap: 'break-word'}
      },
      {
        header: props.minimumContribtion,
        meta: 'Minimum Contribution (wei)',
        description: 'The minimum contribution to the campaign',
        style: {overflowWrap: 'break-word'}
      },
      {
        header: props.spendingRequestCount,
        meta: 'Pending Campaign Spending Requests',
        description: 'Pending spending requests which must be approved by campaign contributors',
        style: {overflowWrap: 'break-word'}
      },
      {
        header: props.contributorCount,
        meta: 'Contributors to the campaign',
        description: 'Number of people who have contributed to the campaign',
        style: {overflowWrap: 'break-word'}
      },
      {
        header: myWeb3.utils.fromWei(props.balance, 'ether'),
        meta: 'Campaign Balance (eth)',
        description: 'The minimum contribution to the campaign',
        style: {overflowWrap: 'break-word'}
      }
    ]
    return <Card.Group items={items}></Card.Group>
  }

    return(
      //check Layout.js in Components directory. Custom file to create a layout
      //any content between the Layout tags gets passed to Layout.js as props.children
      <Layout>
          <Link href="/campaigns">Back</Link>
          <h1>Campaign Details Page</h1>
          <h3>Campaign Id: {props.campaignID}</h3>
          <h3>Campaign Minimum Contribution: {props.minimumContribtion}</h3>
          <h3>Campaign Balance: {props.balance}</h3>
          <Grid>
            <Grid.Row>
              <Grid.Column width={10}>
                { renderCampaignDetails() }
              </Grid.Column>
              <Grid.Column width={5}>
                <Contribute address={props.campaignID}></Contribute>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Link href={`${props.campaignID}/requests`} >
                  <Button primary>View Spending Requests</Button>
                </Link>
              </Grid.Column>
            </Grid.Row>
          </Grid>
      </Layout>
  );
  
};

export async function getServerSideProps(context) {
  /*
    In ServerSide props context.params can be used to get dynamic routing context, 
    just as const router = useRouter(),  router.query can be used elsewhere
  */
  const campaignID = context.params.campaignDetails;
  const campaignInstance = await getCampaignInstance(campaignID);
  //returns results as an object
  const summary = await campaignInstance.methods.getCampaignDetails().call();
      
  //toString methods are required to convert BigInts returned from solidity into Strings
  //as javascript cannot serialize (convert to String) BigInts
  return {
      props: {
        campaignID: campaignID,
        minimumContribtion: summary[0].toString(),
        balance: summary[1].toString(),
        spendingRequestCount: summary[2].toString(),
        contributorCount: summary[3].toString(),
        managerAddress: summary[4]
      },
    };
};

export default CampaignDetails;