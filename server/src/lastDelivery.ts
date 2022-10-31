import 'source-map-support/register';
import middy from 'middy';
import cors from '@middy/http-cors';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { findLatestDelivery } from './dbUtils';
import { getUserInfoFromEvent } from './auth/getUserFromJwt';
import { logEvent } from './helpers';

async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  logEvent(event);
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

  const lastDelivery = await findLatestDelivery(vendorId, userId);
  let result = "Ingen";
  
  if (lastDelivery?.deliverytime) {
    result = lastDelivery.deliverytime;
  }

  return {
    statusCode: 200,
    body: JSON.stringify(result)
  };
}

export const mainHandler = middy(handler).use(cors());