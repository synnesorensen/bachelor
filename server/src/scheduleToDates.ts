import 'source-map-support/register'
import middy from 'middy';
import cors from '@middy/http-cors';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { generateDeliveriesForVendor } from './addDeliveries';
import { getVendorFromDb } from './dbUtils';

async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  if (!event.queryStringParameters) {
    return {
      statusCode: 400,
      body: '{ "message" : "Missing parameters" }'
    };
  }

  let startDateString = event.queryStringParameters["startDate"];
  let startDate = new Date(startDateString);
  let endDateString = event.queryStringParameters["endDate"];
  let endDate = new Date(endDateString);
  let vendor = await getVendorFromDb();
  let deliveries = await generateDeliveriesForVendor(startDate, endDate, vendor);

  return {
    statusCode: 200,
    body: JSON.stringify(deliveries)
  }

}
export const mainHandler = middy(handler).use(cors());