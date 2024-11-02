import React, { useEffect, useState } from 'react';
import { Input, Form, Button, Message} from 'semantic-ui-react';
import { getCampaignInstance } from '../ethereum/campaign';
import myWeb3 from '../ethereum/MyWeb3';
import { useRouter } from "next/router";

export default ( props ) => {
    
    //Initialize state variables
    const [account, setAccount] = useState('');
    const [contributionValue, setcontributionValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('Waiting for user to contribute to Campaign....');
    const [errMessage, setErrMessage] = useState('');
    
    const router = useRouter();

    useEffect( () => {
        // Get the user's account
        async function getAccount() {
            console.log("INFO-Contribute Getting accounts..");
            try{
                const accounts = await myWeb3.eth.getAccounts();
                console.log("INFO-Contribute Logging accounts..");
                console.log(accounts);
                setAccount(accounts[0]);
                console.log("INFO-Contribute Account is set ", account);
            }
            catch (err){
                console.log(err);
                setErrMessage(err.message);
            }
        }
        getAccount();
        console.log("INFO-Contribute: Campaign ID is", props.address);
    }, []);

    //Submit user's lottery entry 
    async function onSubmit(event) {
        
        const campaignInstance = await getCampaignInstance(props.address);
        event.preventDefault();
        setLoading(true);
        setErrMessage('');
        setMessage('Submitting your Campaign contribution, waiting on transaction success..');
        try{
            await campaignInstance.methods.contribute().send({
                from: account,
                value: myWeb3.utils.toWei(contributionValue, 'ether')
            });
            setMessage('Congratulations you have contributed to the Campaign');
            setLoading(false);   
            router.reload();

        }
        catch (err){
            console.log(err);
            setMessage('Whoops campaign contribution failed, see error message below');
            setErrMessage(err.message);
            setLoading(false);
        }

    }        

    return (
        <Form onSubmit={onSubmit}>
            <Form.Field>
                <label>Amount to Contribute</label>
                <Input 
                    value={contributionValue} onChange={event => setcontributionValue(event.target.value)}
                    label="ether" 
                    labelPosition="right"></Input>
            </Form.Field>
            <Button primary loading={loading}>Contribute!</Button>
            <Message>{message}</Message>
            <Message negative header="Oops" 
                    visible={errMessage.length > 0} hidden={errMessage.length === 0} content={errMessage}>
            </Message>
        </Form>
    );
};