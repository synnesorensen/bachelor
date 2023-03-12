import 'source-map-support/register';
import middy from 'middy';
import cors from '@middy/http-cors';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getUserInfoFromEvent } from './auth/getUserFromJwt';
import { getSubscriptionFromDb, getUsersDeliveries, getVendorFromDb } from './dbUtils';
import { getDeliveryDatesQuick } from './timeHandling';
import { scheduleToWeekTimes } from './addDeliveries';
import { MenuItems } from '../../common/interfaces';
import { logEvent } from './helpers';

async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  logEvent(event);
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
    let startTime = firstDay.toISOString();
    const lastDay = new Date(Date.UTC(date.getFullYear(), date.getMonth() + 1, 0));
    let end = lastDay.toISOString();
    let endTime = end.substring(0,10);
    endTime += "T23:59:59.000Z";

    const alreadyPaidForPromise = getUsersDeliveries(userId, startTime, endTime);
    const candidatesPromise = getDeliveryDatesQuick(firstDay, new Date(endTime), weekTimes);

    const [alreadyPaidFor, candidates] = await Promise.all([alreadyPaidForPromise, candidatesPromise]);
    const alreadyPaidForAndSub = alreadyPaidFor.filter(del => (del.deliveryType === "sub") && (del.cancelledBy !== "vendor"));
    const result = candidates.length - alreadyPaidForAndSub.length;
    
  
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