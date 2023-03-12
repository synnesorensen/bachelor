import 'source-map-support/register'
import middy from 'middy';
import { cors } from 'middy/middlewares';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getVendorFromDb, putVendorInDb } from './dbUtils';
import { getUserInfoFromEvent } from './auth/getUserFromJwt';
import { logEvent } from './helpers';

async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  logEvent(event);
  if (event.httpMethod == "GET") {
    return getVendor();
  }
  if (event.httpMethod == "PUT") {
    return putvendor(event);
  }
}
export const mainHandler = middy(handler).use(cors());

async function getVendor(): Promise<APIGatewayProxyResult> {
  let vendor = await getVendorFromDb();

  if (!vendor) {
    return {
      statusCode: 404,
      body: '{ "message" : "No profile for this vendor" }'
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify(vendor)
  };
}


async function putvendor(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const loggedInUser = getUserInfoFromEvent(event);
  let vendorId = event.queryStringParameters["vendorId"];
  let body = JSON.parse(event.body);

  if (!event.queryStringParameters) {
    return {
      statusCode: 400,
      body: '{ "message" : "Missing parameter vendorId" }'
    };
  }

  if (vendorId != loggedInUser) {
    return {
      statusCode: 403,
      body: '{ "message" : "Forbidden operation" }'
    }
  }
  let vendor = await putVendorInDb(body, vendorId);

  return {
    statusCode: 200,
    body: JSON.stringify(vendor)
  };
}
