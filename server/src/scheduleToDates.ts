import 'source-map-support/register'
import middy from 'middy';
import cors from '@middy/http-cors';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { scheduleToWeekTimes, generateDeliveriesForVendor } from './addDeliveries';
import { noOfDeliveriesInMonth } from './timeHandling'
import { getVendorFromDb } from './dbUtils';
import { dbenv } from './DbEnvironment';

async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  if (!event.queryStringParameters) {
    return {
      statusCode: 400,
      body: '{ "message" : "Missing parameters" }'
    };
  }

  let startDateString = event.queryStringParameters["startDate"];
  let startDate = new Date(startDateString);
  let vendor = await getVendorFromDb();
  let weekTimes = scheduleToWeekTimes(vendor.schedule);
  let noOfDeliveries = await noOfDeliveriesInMonth(startDate, weekTimes, dbenv);
  let deliveries = await generateDeliveriesForVendor(startDate, vendor, noOfDeliveries, dbenv);

  return {
    statusCode: 200,
    body: JSON.stringify(deliveries)
  }

}
export const mainHandler = middy(handler).use(cors());