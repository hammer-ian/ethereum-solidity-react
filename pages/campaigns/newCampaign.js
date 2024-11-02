import React, { useEffect, useState } from 'react';
import { useRouter } from "next/router";
import Layout from '../../components/Layout';
import { Input, Form, Button, Message } from 'semantic-ui-react';
import campaignFactoryInstance from '../../ethereum/campaignFactory';
import myWeb3 from '../../ethereum/MyWeb3';

function NewCampaign( props ) { 

    //initialize state
    const [account, setAccount] = useState('');
    const [minimumContribution, setminimumContribution] = useState('');
    const [message, setMessage] = useState('Waiting for user to submit new Campaign....');
    const [errMessage, setErrMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    
    // Get the user's account
    async function getAccount() {
        console.log("INFO: newCampaign - Getting accounts..");
        try{
            //Metamask should only return the account that is currently connected
            const accounts = await myWeb3.eth.getAccounts();
            console.log("INFO: newCampaign - Logging accounts..");
            //Array should only have 1 element, containing the currently connected account
            console.log("INFO: newCampaign - Metamask accounts array", accounts);
            //accounts[0], i.e. the first element is the currently connected account
            setAccount(accounts[0]);
            console.log("INFO: newCampaign - Account is set ", account);
        }
        catch (err){
            console.log(err);
            setErrMessage(err.message);
        }
    }
    
    useEffect( () => {
      
      getAccount();
    }, []);

    //Submit user's lottery entry 
    async function onSubmit(event) {
        event.preventDefault();
        getAccount();
        setErrMessage('');
        setMessage('Submitting your Campaign request, waiting on transaction success..');
        setLoading(true);
        //when calling an ethereum function from a browser don't need to explicitly specify gas, metamask does this
        try{
            await campaignFactoryInstance.methods.createCampaign(minimumContribution).send({
                from: account
            });
            setMessage('Congratulations you have created a new Campaign');
            setLoading(false);
            //route user back to homepage
            router.push('/campaigns');
        }
        catch (err){
            console.log(err);
            setMessage('Whoops campaign creation failed, see error message below');
            setErrMessage(err.message);
            setLoading(false);
        }
    }

    return(
        //check Layout.js in Components directory. Custom file to create a layout
        //any content between the Layout tags gets passed to Layout.js as props.children
        <Layout>
                <h3>Create a new campaign</h3>
                <Form onSubmit={onSubmit}>
                    <Form.Field>
                        <label>Please Set Mininimum Campaign Contribution</label>
                        <Input  label='wei' labelPosition='right' 
                            placeholder='please enter amount in WEI'
                            value={minimumContribution} onChange={event => setminimumContribution(event.target.value)}>
                        </Input>
                    </Form.Field>
                    <h4> {message} </h4>
                    <Button primary loading={loading}>Create!</Button>
                </Form>
                <Message negative header="Oops" 
                    visible={errMessage.length > 0} hidden={errMessage.length === 0} content={errMessage}>
                </Message>
        </Layout>
    );
}

export default NewCampaign;
