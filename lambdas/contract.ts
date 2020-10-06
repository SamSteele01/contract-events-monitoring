/* 
  CRUD for contracts table
*/

import * as AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies
import { Handler, Context } from 'aws-lambda';
import 'source-map-support/register';
import { uuid } from 'uuid'

const dynamoDb = new AWS.DynamoDB.DocumentClient();


export const create: Handler = async (event: any, _context: Context) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);
  
  if (typeof data.text !== 'string') {
    console.error('Validation Failed');
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Couldn\'t create the contract item.',
    };
  }

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      id: uuid.v1(),
      name: data.name,
      address: data.address,
      abi: data.abi,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  };

  // write the todo to the database
  dynamoDb.put(params, (error) => {
    // handle potential errors
    if (error) {
      console.error(error);
      return {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t create the contract item.',
      };
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(params.Item),
    };
    return response;
  });

}

// fetch all contracts from the database
export const list: Handler = async (event: any, _context: Context) => {
  
  const params = {
    TableName: process.env.DYNAMODB_CONTRACT_TABLE || 'Contract',
  };

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
      headers: { 'Content-Type': 'application/json' },
      body: result.Items,
    };
    return response;
  });

}

// fetch contract by id
export const get: Handler = async (event: any, _context: Context) => {
  
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id: event.pathParameters.id,
    },
  };

  dynamoDb.get(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      return {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t fetch the contract.',
      };
    }

    // create a response
    const response = {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: result.Item,
    };
    return response;
  });

}

export const update: Handler = async (event: any, _context: Context) => {
  
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);

  // validation
  if (typeof data.text !== 'string' || typeof data.checked !== 'boolean') {
    console.error('Validation Failed');
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Couldn\'t update the todo item.',
    };
  }

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id: event.pathParameters.id,
    },
    ExpressionAttributeNames: {
      '#todo_text': 'text',
    },
    ExpressionAttributeValues: {
      ':text': data.text,
      ':checked': data.checked,
      ':updatedAt': timestamp,
    },
    UpdateExpression: 'SET #todo_text = :text, checked = :checked, updatedAt = :updatedAt',
    ReturnValues: 'ALL_NEW',
  };

  // update the todo in the database
  dynamoDb.update(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      return {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t fetch the todo item.',
      };
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Attributes),
    };
    return response;
  });

}

export const delete: Handler = async (event: any, _context: Context) => {
  
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id: event.pathParameters.id,
    },
  };

  // delete the todo from the database
  dynamoDb.delete(params, (error) => {
    // handle potential errors
    if (error) {
      console.error(error);
      return {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t remove the contract.',
      };
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify({}),
    };
    return response;
  });

}