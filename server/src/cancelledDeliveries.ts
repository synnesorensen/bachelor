import 'source-map-support/register'
import middy from 'middy';
import cors from '@middy/http-cors';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getUsersDeliveries } from './dbUtils'

async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    if (!event.queryStringParameters) {
    return {
      statusCode: 400,
      body: '{ "message" : "Missing parameters" }'
    };
  }

  let userId = event.queryStringParameters["userId"];
  let yearMonth = event.queryStringParameters["yearMonth"];

  const date = new Date(yearMonth + "-01");
  const firstDay = new Date(Date.UTC(date.getFullYear(), date.getMonth(), 1));
  let startTime = firstDay.toISOString();
  const lastDay = new Date(Date.UTC(date.getFullYear(), date.getMonth() + 1, 0));
  let end = lastDay.toISOString();

  let endTime = end.substring(0,10);
  endTime += "T23:59:59.000Z";

  if (!userId) {
    return {
      statusCode: 400,
      body: '{ "message" : "Missing parameter user id" }'
    };
  }
  
  let deliveries = await getUsersDeliveries(userId, startTime, endTime);
  let count = 0;
  deliveries.forEach(del => {
    if (del.cancelled) {
      count++;
    }
  })

  return {
    statusCode: 200,
    body: JSON.stringify(count)
  };
}

export const mainHandler = middy(handler).use(cors());