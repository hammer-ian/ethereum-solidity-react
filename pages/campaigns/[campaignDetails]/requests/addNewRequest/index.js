import React, { useEffect, useState } from 'react';
import Layout from '../../../../../components/Layout';
import { Form, Message, Button, Input } from 'semantic-ui-react';
import Link from 'next/link';
import { getCampaignInstance } from '../../../../../ethereum/campaign';
import myWeb3 from '../../../../../ethereum/MyWeb3';
import { useRouter } from "next/router";

function AddNewCampaignRequest ( props ) {

    //initialize state
    const [spendingAmount, setSpendingAmount] = useState('');
    const [description, setDescription] = useState('');
    const [recipient, setRecipient] = useState('');
    const [errMessage, setErrMessage] = useState('');
    const [account, setAccount] = useState('');
    const [message, setMessage] = useState('Waiting for user to submit new Spending Request....');
    const [loading, setLoading] = useState(false);
    
    const router = useRouter();

    useEffect( () => {
        // Get the user's account
        async function getAccount() {
          console.log("Getting accounts..");
          try{
              const accounts = await myWeb3.eth.getAccounts();
              console.log("Logging accounts..");
              console.log(accounts);
              setAccount(accounts[0]);
              console.log("Account is set ", account);
          }
          catch (err){
              console.log(err);
              setErrMessage(err.message);
          }
        }
        getAccount();
      }, []);

    //Submit user's lottery entry 
    async function onSubmit(event) {
        const campaignInstance = await getCampaignInstance(props.campaignID);
        event.preventDefault();
        setLoading(true);
        setErrMessage('');
        setMessage('Submitting your spending request, waiting on transaction success..');

        const spendingAmountWEI = myWeb3.utils.toWei(spendingAmount, 'ether');

        try{
            await campaignInstance.methods.createSpendingRequest(description, spendingAmountWEI, recipient).send({
                from: account,
            });
            setMessage('Congratulations you have submitted a spending request');
            setLoading(false);   
            router.push('[campaignDetails]', `${props.campaignID}`  );

        }
        catch (err){
            console.log(err);
            setMessage('Whoops spending request creation failed, see error message below');
            setErrMessage(err.message);
            setLoading(false);
        }
    }
      
    return(
        //check Layout.js in Components directory. Custom file to create a layout
        //any content between the Layout tags gets passed to Layout.js as props.children
        <Layout>
            <Link href={{
                        pathname: '../requests',
                        query: { campaignDetails: `${props.campaignID}` }}}>Back</Link>
            <h3>Create New Campaign Spending Request {props.campaignID}</h3>
            <Form onSubmit={onSubmit}>
                <Form.Field>
                    <label>Description: </label>
                    <Input value={description} onChange={event => setDescription(event.target.value)}></Input>
                </Form.Field>
                <Form.Field>
                    <label>Spending Amount Value (Ether): </label>
                    <Input value={spendingAmount} onChange={event => setSpendingAmount(event.target.value)}></Input>
                </Form.Field>
                <Form.Field>
                    <label>Receipient </label>
                    <Input value={recipient} onChange={event => setRecipient(event.target.value)}></Input>
                </Form.Field>
                <h4> {message} </h4>
                <Button primary loading={loading}>Create Request</Button>
            </Form>
            <Message negative header="Oops" 
                    visible={errMessage.length > 0} hidden={errMessage.length === 0} content={errMessage}>
                </Message>
        </Layout>
    );
}

export async function getServerSideProps(context) {
    /*
      In ServerSide props context.params can be used to get dynamic routing context, 
      just as const router = useRouter(),  router.query can be used elsewhere
    */
    const campaignID = context.params.campaignDetails;
    console.log("INFO: CampaignListRequest: ", campaignID);
    const campaignInstance = await getCampaignInstance(campaignID);

    return {
        props: {
          campaignID: campaignID
        },
      };
  };

export default AddNewCampaignRequest;