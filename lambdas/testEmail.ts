import "source-map-support/register";
import * as AWS from "aws-sdk";
import { Handler, APIGatewayProxyResult } from "aws-lambda";
import handlebars from "handlebars";

const ses = new AWS.SES();

// TODO: use AWS emailTemplates - need upload script or serverless plugin
const testHtml = `
  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "https://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
  <html xmlns="https://www.w3.org/1999/xhtml">
    <head>
      <!-- The character set should be utf-8 -->
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="viewport" content="width=device-width"/>
      <!-- Link to the email"s CSS, which will be inlined into the email -->
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
                <h2>OpenZeppelin Contract Monitor Test Email</h2>
              </header>
              <p>
                {{message}}
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
export const send: Handler = (event, _context, callback) => {

  const eventBody = JSON.parse(event.body)
  console.log("input DATA", eventBody);

  // get template
  // const testHtml = fs.readFileSync("../data/emailTemplates/test.html"); // this doesn't work !!

  // compile
  const template = handlebars.compile(testHtml);

  const emailTemplate = template({
    // ...vars
    message: eventBody.message
  })

  const params = {
    Source: process.env.FROM_ADDRESS, // has to be verified address
    ReturnPath: "ssteele017@gmail.com",
    Destination: {
      ToAddresses: [
        eventBody.email
      ]
    },
    Message: {
      Subject: {
        Data: "OZ test email"
      },
      Body: {
        Text: {
          Data: "OpenZeppelin Contract Monitor Test Email"
        },
        Html: {
          Data: emailTemplate
        }
      }
    }
  }

  // send
  ses.sendEmail(params, (err, data) => {
    let response: APIGatewayProxyResult = {};

    if (err) {
      console.log("Error sending test email: ", err);
      response = {
        "statusCode": err.statusCode || 501,
        "headers": {
          "Content-Type": "text/plain",
          "Access-Control-Allow-Origin": "*",
        },
        "body": "Error sending test email."
      };
      callback(null, response);
      return;
    }

    // "Content-Type": "application/json",
    console.log("DATA", data);
    response = {
      "statusCode": 200,
      "headers": {
        "Access-Control-Allow-Origin": "*"
      },
      "body": `email successfully sent to ${eventBody.email}`
    };
    callback(null, response);
  })
}