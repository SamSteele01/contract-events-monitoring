import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';

// called by CRON event
export const sendEmails: APIGatewayProxyHandler = async (event, _context) => {
  
  // look up email addresses
  
  // emails.map => send emails
}
