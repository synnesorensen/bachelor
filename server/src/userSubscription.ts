import 'source-map-support/register'
import middy from 'middy';
import cors from '@middy/http-cors';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { deleteSubscriptionInDb, getSubscriptionFromDb, pauseSubscription, putSubscriptionInDb, unPauseSubscription } from './dbUtils'
import { getUserInfoFromEvent } from './auth/getUserFromJwt';

async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  if (event.httpMethod == "GET") {
    return getUserSubscription(event);
  }
  if (event.httpMethod == "PUT") {
    return putUserSubscription(event);
  }
  if (event.httpMethod == "POST") {
    return postUserSubscription(event);
  }
  if (event.httpMethod == "DELETE") {
    return deleteUserSubscription(event);
  }
  return {
    statusCode: 405,
    body: '{ "message" : "Method not allowed" }'
  };
}

export const mainHandler = middy(handler).use(cors());

async function getUserSubscription(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  let userId = getUserInfoFromEvent(event);
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
  let subscription = await getSubscriptionFromDb(vendorId, userId);

  if (!subscription) {
    return {
      statusCode: 404,
      body: '{ "message" : "No subscription for vendorId: ' + vendorId + '"}'
    };
  }
  return {
    statusCode: 200,
    body: JSON.stringify(subscription)
  };
}

async function putUserSubscription(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  let userId = getUserInfoFromEvent(event);
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
  let body = JSON.parse(event.body);

  if (body.userId != userId) {
    return {
      statusCode: 403,
      body: '{ "message" : "userId in body is not matching authenticated user" }'
    };
  }
  let subscription = await putSubscriptionInDb({
    vendorId,
    userId,
    paused: body.paused,
    schedule: body.schedule, 
    noOfMeals: body.noOfMeals,
    box: body.box
  });

  return {
    statusCode: 200,
    body: JSON.stringify(subscription)
  };
}

async function postUserSubscription(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  let userId = getUserInfoFromEvent(event);
  let body = JSON.parse(event.body);

  if (!event.queryStringParameters) {
    return {
      statusCode: 400,
      body: '{ "message" : "Missing parameter" }'
    };
  }
  let vendorId = event.queryStringParameters["vendorId"];

  if (!vendorId) {
    return {
      statusCode: 400,
      body: '{ "message" : "Missing parameter vendorId" }'
    };
  }

  let time = body.time;
  if (!time) {
    return {
      statusCode: 400,
      body: '{ "message" : "Missing attribute time" }'
    };
  }

  let action = body.action;
  if (!action) {
    return {
      statusCode: 400,
      body: '{ "message" : "Missing attribute action" }'
    };
  }
  if (action == "pause") {
    const sub = await pauseSubscription(userId, vendorId, time);
    return {
      statusCode: 200,
      body: JSON.stringify(sub)
    };
  } else if (action == "unpause") {
    const sub = await unPauseSubscription(userId, vendorId, time);
    return {
      statusCode: 200,
      body: JSON.stringify(sub)
    };
  } else {
    return {
      statusCode: 400,
      body: '{ "message" : "Action not supported" }'
    };
  }
}

async function deleteUserSubscription(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  let userId = getUserInfoFromEvent(event);
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
  deleteSubscriptionInDb(vendorId, userId);
  return {
    statusCode: 200,
    body: '{ "message" : "Deletion succeeded" }'
  };
}
