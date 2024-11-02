import React, { useEffect, useState } from 'react';
import { Button, Table} from 'semantic-ui-react';
import myWeb3 from '../ethereum/MyWeb3';
import { getCampaignInstance } from '../ethereum/campaign';
import { useRouter } from "next/router";

function RequestRow( props ) {

    console.log("INFO-RequestRow", props);
    const {Row, Cell} = Table;
    const readyToFinalize = props.request.approvalCount > props.contributorCount / 2;
    const router = useRouter();

    //initialize state
    const [result, setResult] = useState('');
    const [account, setAccount] = useState('');
    const [errMessage, setErrMessage] = useState('');

    async function onApprove(){
        try{        
            const campaign = await getCampaignInstance(props.campaignID);
            const accountArr = await myWeb3.eth.getAccounts();
            const account = accountArr[0];
            await campaign.methods.approveRequest(props.id).send({
                from: account
            });
            router.reload();
        }
        catch (err){
            console.log(err);
            setErrMessage(err);
        }
    };

    async function onFinalize(){
        try{        
            const campaign = await getCampaignInstance(props.campaignID);
            const accountArr = await myWeb3.eth.getAccounts();
            const account = accountArr[0];
            await campaign.methods.finalizeSpendingRequest(props.id).send({
                from: account
            });
            router.reload();
        }
        catch (err){
            console.log(err);
            setErrMessage(err);
        }
    }

    return ( 
        <Row disabled={props.request.complete} positive={readyToFinalize && !props.request.complete}>
            <Cell> { props.id }</Cell>
            <Cell> { props.request.description }</Cell>
            <Cell> { myWeb3.utils.fromWei(props.request.value, 'ether')  }</Cell>
            <Cell> { props.request.recipient }</Cell>
            <Cell> { props.request.approvalCount } / {props.contributorCount}</Cell>
            <Cell> { props.request.complete ? null : (
                    <Button color="green" basic onClick={onApprove}>Approve</Button>
                    )} </Cell>
            <Cell>  { props.request.complete ? null : (
                    <Button color="red" basic onClick={onFinalize}>Finalize</Button>
                    )}</Cell>
            <Cell> { props.request.complete ? 'Approved' : 'Not Approved' } </Cell>
        </Row>
    );
    
}
export default RequestRow;