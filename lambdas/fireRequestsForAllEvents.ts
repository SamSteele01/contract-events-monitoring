import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';

// called by CRON event
export const fireRequestsForAllEvents: APIGatewayProxyHandler = async (event, _context) => {
  
  // look up contracts: [ { address, ABI, events: [], lastBlockChecked } ]
  
  // contracts.map => events.map => fire getContractEvents
  // use setTimeout to keep from hitting Infura's request limit
  

}
