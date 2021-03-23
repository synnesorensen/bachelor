import middy from 'middy';
import cors from '@middy/http-cors';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';


const database = new DynamoDB({ region: 'eu-north-1' });

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {

  if (event.httpMethod == "GET") {
    return getCustomerSubscription(event);
  }

  if (event.httpMethod == "PUT") {
    return putCustomerSubscription(event);
  }

  if (event.httpMethod == "DELETE") {
    return deleteCustomerSubscription(event);
  }

  return {
    statusCode: 405,
    body: '{ "message" : "Method not allowed" }'
  };

}

export const mainHandler = middy(handler).use(cors());

async function getCustomerSubscription(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  throw new Error('Function not implemented.');
}


async function putCustomerSubscription(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {

  if (!event.queryStringParameters) {
    return {
      statusCode: 400,
      body: '{ "message" : "Missing parameter vendorId" }'
    }; 
  }

  let vendorId = event.queryStringParameters["vendorId"];

  if (!vendorId) {
    return {
      statusCode: 400,
      body: '{ "message" : "Missing parameter vendorId" }'
    }; 
  } 

  let customerId = "synne@birthdaygirl.yay";
  // TODO: Fetch customerId from JWT

  let body = JSON.parse(event.body);

  if (!body || body.vendorId != vendorId) {
    return {
      statusCode: 400,
      body: '{ "message" : "body is missing or vendorId is not matching query parameter" }'
    };
  }

  if (body.customerId != customerId) {
    return {
      statusCode: 403,
      body: '{ "message" : "customerId in body is not matching authenticated user" }'
    };
  }

  let UpdateExpression = "set EntityType = :EntityType, approved = if_not_exists(approved, :approved)";
  let ExpressionAttributeValues:any = {
    ":EntityType" : {S: 'Subscription'},
    ":approved" : {BOOL: false}
  };

  if (body.paused != undefined) {
    UpdateExpression = UpdateExpression + ", paused = :paused",
    ExpressionAttributeValues[":paused"] = {BOOL: body.paused}
  }

  if (body.schedule != undefined) {
    UpdateExpression += ", schedule = :schedule",
    ExpressionAttributeValues[":schedule"] = {SS: body.schedule}
  }

  let params = {
    TableName: 'MainTable',
    Key: {
      "pk" : {S: "v#" + vendorId},
      "sk" : {S: "c#" + customerId}
    },
    UpdateExpression,
    ExpressionAttributeValues,
    "ReturnValues": "ALL_NEW"
  };

  console.log(params);

  try {
    let dbItem = await database.updateItem(params).promise();

    console.log(dbItem);

    let subscription = {
      vendorId,
      customerId,
      approved: dbItem.Attributes.approved?.BOOL || false,
      paused: dbItem.Attributes.paused.BOOL,
      schedule: dbItem.Attributes.schedule.SS
    }

    return {
      statusCode: 200,
      body: JSON.stringify(subscription)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify(err)
    };
  } 
}


async function deleteCustomerSubscription(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  throw new Error('Function not implemented.');
}
