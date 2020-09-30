import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';

// call web3 to get latest events for a contract
export const getContractEvents: APIGatewayProxyHandler = async (event, _context) => {
  
  // create instance of web3 contract
  
  // call myContract.events.MyEvent([options][, callback]) 
  // use lastBlock
  
  // if newEvents 
  // newEvents.map => fire 
}
