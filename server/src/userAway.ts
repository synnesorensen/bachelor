import 'source-map-support/register';
import middy from 'middy';
import { cors } from 'middy/middlewares';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getUserAbsence } from './dbUtils';
import { generateUsersAbsentDates } from './timeHandling';
import { logEvent } from './helpers';

async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  logEvent(event);
  if (event.httpMethod === "GET") {
    return getAway(event);
  }
  if (event.httpMethod === "POST") {
    return postAway(event);
  }

  return {
    statusCode: 405,
    body: '{ "message" : "Method not allowed" }'
  };
}

async function getAway(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  if (!event.queryStringParameters) {
    return {
      statusCode: 400,
      body: '{ "message" : "Missing parameter time" }'
    };
  }
  let start = event.queryStringParameters["start"];
  let end = event.queryStringParameters["end"];

  if (!start) {
    return {
      statusCode: 400,
      body: '{ "message" : "Missing parameter start time" }'
    };
  }
  if (!end) {
    return {
      statusCode: 400,
      body: '{ "message" : "Missing parameter end time" }'
    };
  }

  const absence = await getUserAbsence(start, end);

  return {
    statusCode: 200,
    body: JSON.stringify(absence)
  }
}

async function postAway(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {

  if (!event.queryStringParameters) {
    return {
      statusCode: 400,
      body: '{ "message" : "Missing parameter time" }'
    };
  }
  let start = event.queryStringParameters["start"];
  let end = event.queryStringParameters["end"];

  if (!start) {
    return {
      statusCode: 400,
      body: '{ "message" : "Missing parameter start time" }'
    };
  }
  if (!end) {
    return {
      statusCode: 400,
      body: '{ "message" : "Missing parameter end time" }'
    };
  }

  generateUsersAbsentDates(start, end); 

  return {
    statusCode: 200,
    body: '{ "message" : "Absence added" }'
  };

}

export const mainHandler = middy(handler).use(cors());
