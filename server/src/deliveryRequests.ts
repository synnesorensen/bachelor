import 'source-map-support/register'
import middy from 'middy';
import cors from '@middy/http-cors';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getUserprofileFromDb, getDeliveryRequests } from './dbUtils'
import { getUserInfoFromEvent } from './auth/getUserFromJwt'

async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  let vendorId = getUserInfoFromEvent(event);
  let vendor = await getUserprofileFromDb(vendorId);
  if (!vendor.isVendor) {
    return {
      statusCode: 403,
      body: JSON.stringify( {message: "User " + vendorId + " is not a vendor"})
    };
  }

  if (event.httpMethod == "GET") {
    return getAllDeliveryRequests();
  }
  return {
    statusCode: 405,
    body: '{ "message" : "Method not allowed" }'
  };
}

async function getAllDeliveryRequests(): Promise<APIGatewayProxyResult> {
  const requests = await getDeliveryRequests();

  return {
    statusCode: 200,
    body: JSON.stringify(requests)
  };
}

export const mainHandler = middy(handler).use(cors());