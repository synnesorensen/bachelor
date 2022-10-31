import 'source-map-support/register'
import middy from 'middy';
import cors from '@middy/http-cors';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { findLatestDelivery, getVendorFromDb, pauseSubscription, unPauseSubscription } from './dbUtils'
import { MenuItems } from '../../common/interfaces';
import { SubscriptionDto } from '../../common/dto';
import { logEvent } from './helpers';

async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  logEvent(event);
  if (event.httpMethod == "POST") {
    return postUserSubscription(event);
  }
}

export const mainHandler = middy(handler).use(cors());

async function postUserSubscription(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  let body = JSON.parse(event.body);
  const vendor = await getVendorFromDb();
  const {vendorId} = vendor;

  if (!event.queryStringParameters) {
    return {
      statusCode: 400,
      body: '{ "message" : "Missing parameter" }'
    };
  }

  let userId = event.queryStringParameters["userId"];

  if (!userId) {
    return {
      statusCode: 400,
      body: '{ "message" : "Missing attribute userID" }'
    };
  }

  let time = body.time;
  if (!time) {
    return {
      statusCode: 400,
      body: '{ "message" : "Missing attribute time" }'
    };
  }

  let action = body.action;
  if (!action) {
    return {
      statusCode: 400,
      body: '{ "message" : "Missing attribute action" }'
    };
  }

  let subscription = null;

  if (action === "pause") {
    subscription = await pauseSubscription(userId, vendorId, time);

  } else if (action === "unpause") {
    subscription = await unPauseSubscription(userId, vendorId, time);
  }

  let subSchedule: MenuItems[] = [];
  if (subscription) {
    subscription.schedule.forEach((item) => {
      subSchedule.push(vendor.schedule.find(({id}) => id === item));
    });
  }

  let sub: SubscriptionDto = {
    userId: userId,
    vendorId: vendor.vendorId,
    paused: subscription.paused,
    schedule: subSchedule,
    noOfMeals: subscription.noOfMeals,
    box: subscription.box,
    lastDeliveryDate: (await findLatestDelivery(subscription.vendorId.substr(2), userId))?.deliverytime
  };

  return {
    statusCode: 200,
    body: JSON.stringify(sub)
  };

}