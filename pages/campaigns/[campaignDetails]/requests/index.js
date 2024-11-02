import Layout from '../../../../components/Layout';
import RequestRow from '../../../../components/RequestRow';
import { Button, Table } from 'semantic-ui-react';
import Link from 'next/link';
import { getCampaignInstance } from '../../../../ethereum/campaign';

function CampaignRequestList ( props ) {

    function renderRequestTable() {
        
        const {Header, Row, HeaderCell, Body} = Table;
        
        function renderTableRows(){
            return props.requests.map((request, index) => {
                return <RequestRow 
                            request={request} 
                            key={index} 
                            id={index} 
                            campaignID={props.campaignID}
                            contributorCount={props.contributorCount}>
                        </RequestRow>;
            });
                        
        };

        return (
            <Table>
                <Header>
                    <Row>
                        <HeaderCell>Id</HeaderCell>
                        <HeaderCell>Description</HeaderCell>
                        <HeaderCell>Amount (in Ether)</HeaderCell>
                        <HeaderCell>Recipient</HeaderCell>
                        <HeaderCell>Approval Count</HeaderCell>
                        <HeaderCell>Approve</HeaderCell>
                        <HeaderCell>Finalize</HeaderCell>
                        <HeaderCell>Status</HeaderCell>
                    </Row>
                </Header>
                <Body>
                    { renderTableRows() }
                </Body>
            </Table>
        );
    };

    return(
        
        //check Layout.js in Components directory. Custom file to create a layout
        //any content between the Layout tags gets passed to Layout.js as props.children
        <Layout>
            <Link href={{
                  pathname: '../[campaignDetails]',
                  query: { campaignDetails: `${props.campaignID}` }}}>Back</Link>
            <h3>CampaignRequestList {props.campaignID}</h3>
            <Link href={{
                        pathname: 'requests/addNewRequest',
                        query: { campaignDetails: `${props.campaignID}` }}}>
                <Button primary floated="right" style={{marginBottom: 10}}>Add New Request</Button>
            </Link>
            { renderRequestTable() }
            <div>Found {props.requestCount} requests.</div>
        </Layout>
    );
}

export async function getServerSideProps(context) {
    /*
      In ServerSide props context.params can be used to get dynamic routing context, 
      just as const router = useRouter(),  router.query can be used elsewhere
    */
    const campaignID = context.params.campaignDetails;
    const campaignInstance = await getCampaignInstance(campaignID);
    const contributorCount = await campaignInstance.methods.contributorCount().call();

    const requestCount = await campaignInstance.methods.getRequestsCount().call();
    
    const requests = await Promise.all(
        Array(parseInt(requestCount))
            .fill()
            .map((element, index) => {
                return campaignInstance.methods.spendingRequestsArr(index).call()
        })
    );

    for (let i=0; i<requests.length; i++){
        requests[i] = toObject(requests[i]);
    }

    function toObject(requests) {
        return JSON.parse(JSON.stringify(requests, (key, value) =>
            typeof value === 'bigint'
                ? value.toString() //if key value is BigInt convert String
                : value // return everything else unchanged
        ));
    }
    return {
        props: {
          campaignID: campaignID,
          contributorCount: contributorCount.toString(),
          requestCount: requestCount.toString(),
          requests: requests
        },
      };
  };

export default CampaignRequestList;