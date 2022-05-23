import 'source-map-support/register';
import middy from 'middy';
import cors from '@middy/http-cors';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getUserprofileFromDb, getVendorAbsence } from './dbUtils';
import { getUserInfoFromEvent } from './auth/getUserFromJwt';
import { generateVendorsAbsentDates } from './timeHandling';

async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const vendorId = getUserInfoFromEvent(event);
  const vendor = await getUserprofileFromDb(vendorId);

  if (!vendor.isVendor) {
    return {
      statusCode: 403,
      body: JSON.stringify( {message: "User " + vendorId + " is not a vendor"})
    };
  }
  if (event.httpMethod === "GET") {
    return getAbsence(event);
  }
  if (event.httpMethod === "POST") {
    return postAbsence(event);
  }
  return {
    statusCode: 405,
    body: '{ "message" : "Method not allowed" }'
  };
}

async function getAbsence(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
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

  const absence = await getVendorAbsence(start, end);

  return {
    statusCode: 200,
    body: JSON.stringify(absence)
  }

}

async function postAbsence(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
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

  generateVendorsAbsentDates(start, end);

  return {
    statusCode: 200,
    body: '{ "message" : "Absence added" }'
  };

}

export const mainHandler = middy(handler).use(cors());
