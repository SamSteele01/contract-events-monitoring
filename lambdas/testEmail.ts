import fs from 'fs';
import * as AWS from 'aws-sdk';
import { Handler, Context } from 'aws-lambda';
import 'source-map-support/register';
import handlebars from 'handlebars';

const ses = new AWS.SES();

/* 
  @req.body { event, email }
*/
export const send: Handler = async (event, _context) => {
  
  const data = JSON.parse(event.body)
  
  // get template
  const testHtml = fs.readFileSync('../data/emailTemplates/test.html');
  
  // compile
  const template = handlebars.compile(testHtml);
  
  const email = template({
    // ...vars
    event: data.event
  })
  
  const params = {
    Source: process.env.FROM_ADDRESS,
    Destination: {
      ToAddresses: [
        data.email
      ]
    },
    Message: {
      Subject: {
        Data: 'OZ test email'
      },
      Body: {
        Text: {
          Data: 'OpenZeppelin Contract Monitor Test Email'
        },
        Html: {
          Data: email
        }
      }
    }
    
  }
  
  // send
  ses.sendEmail(params, (err, data) => {
    if (err) {
      console.log('Error sending test email: ', err);
      return {
        statusCode: err.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Error sending test email.',
      };
    }
    
    const response = {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: data,
    };
    return response;
  })
}