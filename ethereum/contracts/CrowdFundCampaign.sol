// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9; //version of solidity to compile with

contract CrowdFundCampaignFactory{

    address[] public deployedCampaigns;

    function createCampaign(uint setMinimumContribution) public {

            address newCampaign = address(new CrowdFundCampaign(setMinimumContribution, msg.sender));
            deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns (address[] memory) {

        return deployedCampaigns;
    }
}

contract CrowdFundCampaign {

    //Definition of new "Request" data type only, needs to be instantiated at the appropriate time
    struct SpendingRequest {
        string description;
        uint value;
        address payable recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvingContributors;
    }
    //Storage variables
    address public manager;
    uint public mininumContribution;
    mapping(address => bool) public contributors;
    uint public contributorCount;
    //Array of type SpendingRequest
    SpendingRequest[] public spendingRequestsArr;

    //Function Modifiers
    modifier restricted( ){
        require(msg.sender == manager);
        _;
    }

    constructor (uint setMinimumContribution, address sender) {
        manager = sender;
        mininumContribution = setMinimumContribution;
    }

    function contribute() public payable {
        require(msg.value > mininumContribution);
        //make sure person has not already contributed
        require(!contributors[msg.sender]);
        //add sender address to mapping, and set value to true
        contributors[msg.sender] = true;
        contributorCount++;
    }

    function createSpendingRequest(string calldata descrip, uint val, address payable recipient) public restricted {
        SpendingRequest storage newRequest = spendingRequestsArr.push();
        newRequest.description = descrip;
        newRequest.value = val;
        newRequest.recipient = recipient;
        newRequest.complete = false;
                
        /*shorthand way of instantiating new SpendingRequest. Not advisable, easy to assign wrong values
            SpendingRequest memory newRequest = SpendingRequest(descrip, value, recipient, false)
        */
    }

    function approveRequest(uint requestToApproveIndex) public {

        SpendingRequest storage tempRequest = spendingRequestsArr[requestToApproveIndex];
        
        //make sure person approving request is contributor (check address exist in mapping)
        require(contributors[msg.sender]);
        //make sure person approving request has not already approved the request
        require(!tempRequest.approvingContributors[msg.sender]);

        //if to previous statements are false, mark contributor as having approved this request
        tempRequest.approvingContributors[msg.sender] = true;
        //increment approval count for this request
        tempRequest.approvalCount++;
    }

    function finalizeSpendingRequest(uint requestToFinalizeIndex) public restricted{

        SpendingRequest storage tempRequest = spendingRequestsArr[requestToFinalizeIndex];
        //make sure you only finalize spending requests that are not complete
        require(!tempRequest.complete);
        //make sure approval count is more than 50% of contributors
        require(tempRequest.approvalCount > (contributorCount / 2));

        //transfer money (value) to request recipient
        tempRequest.recipient.transfer(tempRequest.value);

        //make sure to mark spending request as complete when finished
        tempRequest.complete = true;
    }

    function getCampaignDetails() public view returns (uint, uint256, uint, uint, address) {

        return (
            mininumContribution,
            address(this).balance,
            spendingRequestsArr.length,
            contributorCount,
            manager
        );
    }

    function getRequestsCount() public view returns (uint) {
        
        return spendingRequestsArr.length;
    }
}