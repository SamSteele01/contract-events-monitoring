/* 
  CRUD for contracts table
*/

import "source-map-support/register";
import * as AWS from "aws-sdk"; // eslint-disable-line import/no-extraneous-dependencies
import { Handler, Context, APIGatewayEvent } from "aws-lambda";
// import middy from "@middy/core";
// import { cors } from "@middy/http-cors";
// import { uuid } from "uuid";
import {
  validateAddress,
  validateEmail,
  validateNumber,
  validateString,
} from "../functions/validators";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const createResponse = (body: any) => ({
  statusCode: 200,
  headers: { "Access-Control-Allow-Origin": "*" },
  body: JSON.stringify(body),
});

const createErrorResponse = (statusCode: number, message: string) => ({
  statusCode: statusCode || 501,
  headers: {
    "Content-Type": "text/plain",
    "Access-Control-Allow-Origin": "*",
  },
  body: message || "Incorrect id",
});

/* 
  If an item that has the same primary key as the new item already exists in the specified table,
  the new item completely replaces the existing item. -> need to prevent overrides!
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
  // abi is JSON
  const events = [];

  try {
    const ABIjs = JSON.parse(data.abi.toString()); // needed?
    // get event names and inputs
    events = ABIjs.filter((obj) => obj.type === "event").map((event) => ({
      name: event.name,
      inputs: event.inputs,
      emails: [],
    }));
  } catch (error) {
    console.log("ERROR", error);
    return createErrorResponse(400, "ABI is not formatted properly.");
  }

  const timestamp = new Date().getTime();

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      // id: uuid.v1(),
      address: data.address,
      network: data.network,
      name: data.name,
      abi: data.abi,
      events: events,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  };

  try {
    const data = dynamoDb.put(params).promise();
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
    const contracts = dynamoDb.scan(params).promise();
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
    ExpressionAttributeValues: {
      ":index": data.eventIndex,
      ":email": data.email,
      // ":updatedAt": timestamp,
    },
    UpdateExpression: "ADD events[:index].emails :email",
    ReturnValues: "ALL_NEW",
  };

  try {
    const data = dynamoDb.update(params).promise();
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

  try {
    validateAddress(data.address);
    validateNumber("eventIndex", data.eventIndex);
    validateNumber("emailIndex", data.emailIndex);
  } catch (error) {
    return createErrorResponse(400, error.message);
  }

  const timestamp = new Date().getTime();

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      address: data.address,
    },
    ExpressionAttributeValues: {
      ":index": data.eventIndex,
      ":email": data.emailIndex,
      // ":updatedAt": timestamp,
    },
    UpdateExpression: "REMOVE events[:index].emails[:email]",
    ReturnValues: "ALL_NEW",
  };

  try {
    const data = dynamoDb.update(params).promise();
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
    const data = dynamoDb.delete(params).promise();
    console.log("delete DATA", data);
    return createResponse(data);
  } catch (error) {
    console.log("delete ERROR", error);
    return createErrorResponse(500, error.message);
  }
};

// export const create = middy(_create).use(cors());
// export const list = middy(_list).use(cors());
// export const get = middy(_get).use(cors());
// export const addEmail = middy(_addEmail).use(cors());
// export const removeEmail = middy(_removeEmail).use(cors());
// export const deleteContract = middy(_deleteContract).use(cors());
