import 'source-map-support/register'
import middy from 'middy';
import cors from '@middy/http-cors';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getUserInfoFromEvent } from './auth/getUserFromJwt';
import { getSubscriptionFromDb, getUsersDeliveries, getVendorFromDb } from './dbUtils';
import { getDeliveryDatesQuick, noOfDeliveriesInMonth } from './timeHandling';
import { scheduleToWeekTimes } from './addDeliveries';
import { MenuItems } from '../../common/interfaces';
import { dbenv } from './DbEnvironment';

async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  let vendorId = getUserInfoFromEvent(event);
  
  if (!event.queryStringParameters) {
    return {
      statusCode: 400,
      body: '{ "message" : "Missing parameter userId, start time or month" }'
    };
  }
  let userId = event.queryStringParameters["userId"];
  let yearMonth = event.queryStringParameters["yearMonth"];

  if (!userId) {
    return {
      statusCode: 400,
      body: '{ "message" : "Missing parameter userId" }'
    };
  }
  if (!yearMonth) {
    return {
      statusCode: 400,
      body: '{ "message" : "Missing parameter yearMonth" }'
    };
  }
  
  let vendor = await getVendorFromDb();
  if (!vendor) {
    return {
      statusCode: 500,
      body: '{ "message": "Could not find vendor in DB" }'
    }
  }
  let sub = await getSubscriptionFromDb(vendorId, userId);
  if (sub) {
    let schedule:MenuItems[] = sub.schedule.map((subId) => {
      return vendor.schedule.find(({id}) => id == subId);
    }); 
    let weekTimes = scheduleToWeekTimes(schedule);

    const date = new Date(yearMonth + "-01");
    const firstDay = new Date(Date.UTC(date.getFullYear(), date.getMonth(), 1));
    const lastDay = new Date(Date.UTC(date.getFullYear(), date.getMonth() + 1, 0));

    const alreadyPaidForPromise = getUsersDeliveries(userId, firstDay.toISOString(), lastDay.toISOString());
    const candidatesPromise = getDeliveryDatesQuick(firstDay, lastDay, weekTimes);

    const [alreadyPaidFor, candidates] = await Promise.all([alreadyPaidForPromise, candidatesPromise]);
    const result = candidates.length - alreadyPaidFor.length;
  
    return {
      statusCode: 200,
      body: JSON.stringify({
        no: result
      })
    };
  }

  return {
    statusCode: 404,
    body: '{ "message" : "No subscription for userId: ' + userId + '"}'
  }
}

export const mainHandler = middy(handler).use(cors());