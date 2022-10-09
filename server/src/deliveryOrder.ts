import 'source-map-support/register'
import middy from 'middy';
import cors from '@middy/http-cors';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { updateDeliveryOrder } from './dbUtils';

async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  if (event.httpMethod == "PUT") {
    return putDeliveryOrder(event);
  }
}
export const mainHandler = middy(handler).use(cors());


async function putDeliveryOrder(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  let { userIds, date } = JSON.parse(event.body);

  if (!userIds || !date) {
    return {
      statusCode: 400,
      body: '{ "message" : "Missing parameters" }'
    };
  }

  await updateDeliveryOrder(userIds, date);

  return {
    statusCode: 200,
    body: '{ "message" : "Update succeeded" }'
  };

}
