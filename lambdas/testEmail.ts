import 'source-map-support/register';
import fs from 'fs';
import * as AWS from 'aws-sdk';
import { Handler, Context } from 'aws-lambda';
import handlebars from 'handlebars';

const ses = new AWS.SES();

const testHtml = `
  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "https://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
  <html xmlns="https://www.w3.org/1999/xhtml">
    <head>
      <!-- The character set should be utf-8 -->
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="viewport" content="width=device-width"/>
      <!-- Link to the email's CSS, which will be inlined into the email -->
      <link rel="stylesheet" href="assets/css/foundation-emails.css">
      <style>
        <!-- Your CSS to inline should be added here -->
      </style>
    </head>

    <body>
      <!-- Wrapper for the body of the email -->
      <table class="body" data-made-with-foundation>
        <tr>
          <!-- The class, align, and <center> tag center the container -->
          <td class="float-center" align="center" valign="top">
            <center>
              <header>
                OpenZeppelin Contract Monitor Test Email
              </header>
              <p>
                {{event}}
              </p>
            </center>
          </td>
        </tr>
      </table>
    </body>
  </html>
`

/* 
  @req.body { event, email }
*/
export const send: Handler = async (event, _context) => {
  
  const data = JSON.parse(event.body)
  
  // get template
  // const testHtml = fs.readFileSync('../data/emailTemplates/test.html'); // this doesn't work !!
  
  // compile
  const template = handlebars.compile(testHtml);
  
  const email = template({
    // ...vars
    event: data.event
  })
  
  const params = {
    Source: process.env.FROM_ADDRESS, // has to be verified address
    ReturnPath: 'it-blew-up@mailinator.com',
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