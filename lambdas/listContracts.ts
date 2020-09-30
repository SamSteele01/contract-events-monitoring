import { Handler, Context } from 'aws-lambda';
import 'source-map-support/register';
import * as AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

// part of CRUD for Contracts
export const listContracts: Handler = async (event: any, _context: Context) => {
  
  const params = {
    TableName: process.env.DYNAMODB_CONTRACT_TABLE || 'Contract',
  };

  // fetch all contracts from the database
  dynamoDb.scan(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      return {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t fetch the contracts.',
      };
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Items),
    };
    return response;
  });

}
