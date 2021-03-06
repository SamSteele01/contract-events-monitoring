import 'source-map-support/register';
import * as AWS from 'aws-sdk';
import { Handler, Context } from 'aws-lambda';
// import dynamodbLocal from 'serverless-dynamodb-client';
import Web3 from "web3";
import handlebars from "handlebars";
import { createErrorResponse } from '../functions/responses';
import { Event } from '../data/interfaces'


const ses = new AWS.SES();
const dynamoDb = new AWS.DynamoDB.DocumentClient();
// const dynamoDb = dynamodbLocal.doc;
const web3 = new Web3('https://mainnet.infura.io/v3/e18137a5d4fe454fa1ec85f00d56b3b0')

const emailTemplate = `
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
                <h2>OpenZeppelin Contract Monitoring</h2>
              </header>
              <p>
                The contract {{contract}} has emitted event {{event}}. Please go to Etherscan
                to see the details.
              </p>
            </center>
          </td>
        </tr>
        {{#each eventHashes as |eventHash|}}
          <tr>
            <a href="https://etherscan.io/tx/{{eventHash}}" target="_blank">{{eventHash}}</a> 
          </tr>
        {{/each}}
        
      </table>
    </body>
  </html>
`

async function updateLastBlockChecked(blockNumber: number, contractAddress: string, errorTries: number) {
  const params = {
    TableName: process.env.CONTRACT_TABLE,
    Key: {
      address: contractAddress,
    },
    ExpressionAttributeValues: {
      ":blockNumber": blockNumber,
    },
    UpdateExpression: 'SET lastBlockChecked = :blockNumber'
  };

  try {
    await dynamoDb.update(params).promise();
    return `UPDATELASTBLOCKCHECKED SUCCESS ${contractAddress} ${blockNumber}`;
  } catch (error) {
    // call recursively until it succedes or tries too many times.
    if (errorTries > 100) {
      /* If there are DB connection issues we may have bigger problems. Writing to a different table
        may not work. Perhaps a different persistance service such as Redis?
        For now, return a string to be logged. */
      return `UPDATELASTBLOCKCHECKED ERROR: ${error} \n Contract address ${contractAddress} was not updated with lastBlockChecked = ${blockNumber}`;
    } else {
      errorTries += 1;
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(updateLastBlockChecked(blockNumber, contractAddress, errorTries));
        }, 50);
      });
    }
  }
}

// called by CRON event
export const getLatestEventsAndProcess: Handler = async (_event, _context: Context) => {
  console.log('_EVENT', _event);

  const params = {
    TableName: process.env.CONTRACT_TABLE,
  };

  let contractDbItems = [];
  try {
    contractDbItems = (await dynamoDb.scan(params).promise()).Items;
  } catch (error) {
    console.log("list ERROR", error);
    return createErrorResponse(500, error.message);
  }

  // filter only ones that have events that have email addresses
  const contractsWithSubscribedEvents = contractDbItems.filter(contract => {
    let emails = contract.events.reduce((acc: string[], event: Event) => {
      return acc.concat(event.emails);
    }, [])
    return emails.length > 0;
  });

  let requestErrors = [];

  contractsWithSubscribedEvents.forEach(contract => {
    // create instance of web3 contract
    let myContract = new web3.eth.Contract(JSON.parse(contract.abi), contract.address);

    // request events
    contract.events.filter(event => event.emails.length > 0).forEach(async event => {
      let contractEvents = [];
      try {
        contractEvents = await myContract.getPastEvents(event.name, {
          fromBlock: contract.lastBlockChecked,
          toBlock: 'latest'
        });
      } catch (error) {
        requestErrors.push({
          contract, event, error
        })
      }
      if (contractEvents.length > 0) {
        const eventHashes: string[] = contractEvents.map(contractEvent => contractEvent.transactionHash);
        const uniqueTxHashes: string[] = [...new Set(eventHashes)];
        // prepare template - ideally we could map over events using a partial for each
        // for now, just send an email that has links to etherscan
        const template = handlebars.compile(emailTemplate);

        const htmlEmail = template({
          contract: contract.name,
          event: event.name,
          eventHashes: uniqueTxHashes
        })

        const linksForText = uniqueTxHashes.reduce((_acc: string, eventHash) => {
          return _acc += `https://etherscan.io/tx/${eventHash} \n `
        }, '');

        const params = {
          Source: process.env.FROM_ADDRESS, // has to be verified address
          ReturnPath: "ssteele017@gmail.com",
          Destination: {
            ToAddresses: event.emails
          },
          Message: {
            Subject: {
              Data: "OpenZeppelin Contract Monitoring"
            },
            Body: {
              Text: {
                Data: `The contract ${contract.name} has emitted event ${event.name}. Please go to Etherscan
                to see the details.\n ${linksForText}`
              },
              Html: {
                Data: htmlEmail
              }
            }
          }
        }

        // send emails
        try {
          const emailResponse = await ses.sendEmail(params).promise();
          console.log('Email sent!', emailResponse);
        } catch (error) {
          console.log("Error sending email: ", error);
          // add to an emailErrors array ??
        }
      }
    });
  });

  // update db
  let updateBlockNumberPromises = [];
  web3.eth.getBlockNumber().then(number => {
    contractDbItems.forEach(contract => {
      updateBlockNumberPromises.push(updateLastBlockChecked(number, contract.address, 0));
    });
  });
  Promise.all(updateBlockNumberPromises).then((logs: string[]) => {
    logs.forEach(log => console.log(log));
  })

  // try again with requestErrors 
  // try again with emailErrors
}
