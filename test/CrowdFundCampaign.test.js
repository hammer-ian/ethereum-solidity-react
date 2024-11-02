const assert = require('assert');
const ganache = require('ganache');
const { Web3 } = require('web3');
const web3 = new Web3(ganache.provider());

const fs = require('fs');

//imports json files as json strings
const compiledCampaignFactory = require('../ethereum/build/CrowdFundCampaignFactory.json');
const compiledCampaign = require('../ethereum/build/CrowdFundCampaign.json');

let accounts;
let campaignFactory;
let campaignAddress;
let campaign;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    console.log('INFO: accounts address is' , accounts[0]);

    //JSON.parse() takes a JSON string and transforms it into a JavaScript object.
    //make sure abi and evm settings equal those in the compile.js file
    campaignFactory = await new web3.eth.Contract(compiledCampaignFactory.abi)
    .deploy({ data: compiledCampaignFactory.evm.bytecode.object})
    .send({ from: accounts[0], gas: '2000000' });

    await campaignFactory.methods.createCampaign('100').send({
        from: accounts[0],
        gas: '20000000'
    });

    const addresses = await campaignFactory.methods.getDeployedCampaigns().call();
    campaignAddress = addresses[0];
    console.log('INFO: campaign contract address is' , campaignAddress);

    campaign = await new web3.eth.Contract(
        compiledCampaign.abi,
        campaignAddress
    );
});

describe ('Campaigns', () => {
   it('deploys a factory and a campaign', () => {
        assert.ok(campaignFactory.options.address);
        assert.ok(campaign.options.address);
    });

    it('person creating new Campaign is set as the Campaign manager', async () => {
        const manager = await campaign.methods.manager().call();
        assert.equal(accounts[0], manager);
    });

    it('allows people to contribute money and marks them as approvers', async () => {
        await campaign.methods.contribute().send({
            value: '200',
            from: accounts[1]
        });   
        
        const isContributor = await campaign.methods.contributors(accounts[1]).call();
        assert(isContributor);
    });

    it('requires a minimum contribution', async () => {
        try{
            await campaign.methods.contribute().send({
                value: 5,
                from: accounts[1]
            });
            assert(false);
        }catch (err){
            assert(err);
        }
    });

    it('allows a manager to create a spending request', async () => {
        
        await campaign.methods.createSpendingRequest('SpendingRequestDesc', '100', accounts[1]).send({
            from: accounts[0],
            gas: '20000000'
        });
        
        console.log(campaign.methods);
        const spendingRequest = await campaign.methods.spendingRequestsArr(0).call();
        console.log("INFO...", spendingRequest.description);
        assert.equal('SpendingRequestDescription', spendingRequest.description);
    });
});