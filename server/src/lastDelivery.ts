import 'source-map-support/register'
import middy from 'middy';
import cors from '@middy/http-cors';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { findLatestDelivery } from './dbUtils';
import { getUserInfoFromEvent } from './auth/getUserFromJwt';

async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  let vendorId = getUserInfoFromEvent(event);
  if (!event.queryStringParameters) {
    return {
      statusCode: 400,
      body: '{ "message" : "Missing parameter userId" }'
    };
  }
  let userId = event.queryStringParameters["userId"];


  if (!userId) {
    return {
      statusCode: 400,
      body: '{ "message" : "Missing parameter start userId" }'
    };
  }

  let lastDelivery = await findLatestDelivery(vendorId, userId);

  return {
    statusCode: 200,
    body: JSON.stringify(lastDelivery.deliverytime)
  };
}

export const mainHandler = middy(handler).use(cors());