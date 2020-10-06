import * as AWS from 'aws-sdk';
import { Handler, Context } from 'aws-lambda';
import 'source-map-support/register';

const ses = new AWS.SES();
const dynamoDb = new AWS.DynamoDB.DocumentClient();

// called by CRON event
export const getLatestEventsAndProcess: Handler = async (event, _context) => {
  
  // look up contracts: [ { address, ABI, events: [], lastBlockChecked } ]
  
  // contracts.map => 
  //  create instance of web3 contract
  //  events.map => 
  //    NOTE: use setTimeout to keep from hitting Infura's request limit
  //    call myContract.events.MyEvent([options][, callback]) 
  //    use lastBlock
  //    update lastBlockChecked
  //    return newEvents array
  
  // if newEvents 
  // newEvents.map => get email addresses
  //  send emails 

}
