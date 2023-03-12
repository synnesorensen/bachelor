import 'source-map-support/register';
import middy from 'middy';
import { cors } from 'middy/middlewares';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { cancelDeliveries } from './dbUtils';
import { getUserInfoFromEvent } from './auth/getUserFromJwt';
import { logEvent } from './helpers';

async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  logEvent(event);
  let userId = getUserInfoFromEvent(event);
  let { deliveries, cancelledBy } = JSON.parse(event.body);

  await cancelDeliveries(userId, deliveries, cancelledBy);

  return {
    statusCode: 200,
    body: '{ "message" : "Cancellation succeeded" }'
  };
}

export const mainHandler = middy(handler).use(cors());