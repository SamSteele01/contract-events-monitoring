/* 
  CRUD for contracts table
*/

import "source-map-support/register";
import * as AWS from "aws-sdk"; // eslint-disable-line import/no-extraneous-dependencies
import { Handler, Context, APIGatewayEvent } from "aws-lambda";
// import dynamodbLocal from 'serverless-dynamodb-client';
import Web3 from "web3";
import { createResponse, createErrorResponse } from '../functions/responses';
import {
  validateAddress,
  validateEmail,
  validateNumber,
  validateString,
} from "../functions/validators";

const dynamoDb = new AWS.DynamoDB.DocumentClient();
// const dynamoDb = dynamodbLocal.doc;  // return an instance of new AWS.DynamoDB.DocumentClient() aimed locally.
const web3 = new Web3('https://mainnet.infura.io/v3/e18137a5d4fe454fa1ec85f00d56b3b0')

/* 
  If an item that has the same primary key as the new item already exists in the specified table,
  the new item completely replaces the existing item. -> need to prevent overrides!
  Reusing a contract address will delete all of the emails added.
*/
export const create: Handler = async (event: APIGatewayEvent, _context: Context) => {
  const data = JSON.parse(event.body);
  console.log("DATA", data);

  // ------ validate input ------
  try {
    validateAddress(data.address);
    validateString("network", data.network);
    validateString("name", data.name);
  } catch (error) {
    return createErrorResponse(400, error.message);
  }
  // validate that abi is JSON
  let events = [];
  try {
    const ABIjs = JSON.parse(data.abi);
    // get event names and inputs
    events = ABIjs.filter((obj) => obj.type === "event").map((event) => ({
      name: event.name,
      inputs: event.inputs,
      emails: [],
    }));
  } catch (error) {
    console.log("ERROR", error);
    return createErrorResponse(400, error.message); // dev only

    // return createErrorResponse(400, "ABI is not formatted properly.");
  }

  const timestamp = new Date().getTime();
  // start checking for events after contract is entered
  const currentBlock = await web3.eth.getBlockNumber();

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      address: data.address,
      network: data.network,
      name: data.name,
      abi: data.abi,
      events: events,
      lastBlockChecked: currentBlock,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  };

  try {
    const data = await dynamoDb.put(params).promise();
    console.log("create DATA", data);
    return createResponse(data);
  } catch (error) {
    console.log("create ERROR", error);
    return createErrorResponse(500, error.message);
  }
};

/**
 * fetch all contracts from the database
 */
export const list: Handler = async (event: APIGatewayEvent, _context: Context) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    AttributesToGet: ["address", "name", "network"],
  };

  try {
    const contracts = await dynamoDb.scan(params).promise();
    console.log("list CONTRACTS", contracts);
    return createResponse(contracts);
  } catch (error) {
    console.log("list ERROR", error);
    return createErrorResponse(500, error.message);
  }
};

/**
 * @param address
 */
export const get: Handler = async (event: APIGatewayEvent, _context: Context) => {
  try {
    validateAddress(event.pathParameters.address);
  } catch (error) {
    return createErrorResponse(400, error.message);
  }

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      address: event.pathParameters.address,
    },
    AttributesToGet: ["address", "name", "network", "events", "createdAt", "updatedAt"],
  };

  try {
    const contract = await dynamoDb.get(params).promise();
    return createResponse(contract);
  } catch (error) {
    return createErrorResponse(404, error.message);
  }
};

/**
 * @body address, eventIndex, email
 */
export const addEmail: Handler = async (
  event: APIGatewayEvent,
  _context: Context
) => {
  const data = JSON.parse(event.body);
  console.log('addEmail DATA', data);

  try {
    validateAddress(data.address);
    validateEmail(data.email);
    validateNumber("eventIndex", data.eventIndex);
  } catch (error) {
    return createErrorResponse(400, error.message);
  }

  const timestamp = new Date().getTime();

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      address: data.address,
    },
    ExpressionAttributeNames: {
      "#uat": "updatedAt"
    },
    ExpressionAttributeValues: {
      ":email": [data.email],
      ":uat": timestamp,
    },
    UpdateExpression: `SET events[${data.eventIndex}].emails = list_append(events[${data.eventIndex}].emails , :email), #uat = :uat`,
    ReturnValues: "ALL_NEW",
  };

  try {
    const data = await dynamoDb.update(params).promise();
    console.log("addEmail DATA", data);
    return createResponse(data);
  } catch (error) {
    console.log("addEmail ERROR", error);
    return createErrorResponse(500, error.message);
  }
};

/**
 * @body address, eventIndex, emailIndex
 */
export const removeEmail: Handler = async (
  event: APIGatewayEvent,
  _context: Context
) => {
  const data = JSON.parse(event.body);
  console.log('removeEmail DATA', data);

  try {
    validateAddress(data.address);
    validateNumber("eventIndex", data.eventIndex);
    // validateNumber("emailIndex", data.emailIndex); // may have race condition
    validateEmail(data.email);
  } catch (error) {
    return createErrorResponse(400, error.message);
  }

  let params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      address: data.address,
    },
    AttributesToGet: ["events"]
  };

  let document = {};
  try {
    document = await dynamoDb.get(params).promise();
  } catch (error) {
    return createErrorResponse(404, error.message);
  }

  // find the index
  const indexToRemove = document.Item.events[data.eventIndex].emails.indexOf(data.email);
  if (indexToRemove === -1) {
    // element not found
    return createErrorResponse(404, "Email not present on that event.");
  }

  const timestamp = new Date().getTime();

  params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      address: data.address,
    },
    ExpressionAttributeNames: {
      "#uat": "updatedAt"
    },
    ExpressionAttributeValues: {
      ":emailToRemove": data.email,
      ":updatedAt": timestamp,
    },
    UpdateExpression: `
      REMOVE events[${data.eventIndex}].emails[${indexToRemove}]
      SET #uat = :updatedAt
    `,
    ConditionExpression: `events[${data.eventIndex}].emails[${indexToRemove}] = :emailToRemove`,
    ReturnValues: "ALL_NEW",
  };

  try {
    const data = await dynamoDb.update(params).promise();
    console.log("removeEmail DATA", data);
    return createResponse(data);
  } catch (error) {
    console.log("removeEmail ERROR", error);
    return createErrorResponse(500, error.message);
  }
};

/**
 * @param address
 */
export const deleteContract: Handler = async (
  event: APIGatewayEvent,
  _context: Context
) => {
  try {
    validateAddress(event.pathParameters.address);
  } catch (error) {
    return createErrorResponse(400, error.message);
  }

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      address: event.pathParameters.address,
    },
  };

  try {
    const data = await dynamoDb.delete(params).promise();
    console.log("delete DATA", data);
    return createResponse(data);
  } catch (error) {
    console.log("delete ERROR", error);
    return createErrorResponse(500, error.message);
  }
};
