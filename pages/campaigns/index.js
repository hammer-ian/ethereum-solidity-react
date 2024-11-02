import React, { useEffect, useState } from 'react';
import campaignFactoryInstance from '../../ethereum/campaignFactory';
import 'semantic-ui-css/semantic.min.css';
import { Card, Button } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import Link from 'next/link';

function CampaignList( props ) {
    
    //Initialize state variables
   
    useEffect(() => {

        // Connect to metamask and get the user's account
        async function initializePage() {
          
          
        }
        initializePage();
        
      }, []);

    function renderCampaigns() {
        const items = props.campaignsArr.map(campaignContract => {
            return {
                header: campaignContract,
                description: <Link href="campaigns/[campaignDetails]" as={`campaigns/${campaignContract}`}>View Campaign</Link>,
                fluid: true
            };
        });
        return <Card.Group items={items}></Card.Group>;
    };

    return(
        //check Layout.js in Components directory. Custom file to create a layout
        //any content between the Layout tags gets passed to Layout.js as props.children
        <Layout>
            <h3>Open Campaign List</h3>
            <Link href='/campaigns/newCampaign'><Button floated='right' content='Create Campaign' icon='add' primary></Button></Link>
            { renderCampaigns() }
        </Layout>
    );
}

/* getServerSideProps has replaced getIntitialProps as the preferred way to fetch server side data 
   code is executed server side BEFORE HTML is rendered to get the data you need in advance (optimizing page load)
   so in the example below the next.js server executes the getDeployedCampaigns() call to Ethereum
   A "props" object is returned to App function with results of getInitialProps values
   */
export async function getServerSideProps() {
    console.log("INFO: getting deployed Campaigns from Factory instance");
    const campaignsArr = await campaignFactoryInstance.methods.getDeployedCampaigns().call();
    console.log("INFO: campaignsArr length is", campaignsArr.length);

    return {
        props: {
            campaignsArr,
        },
      };
}

export default CampaignList;