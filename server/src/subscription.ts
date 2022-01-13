import 'source-map-support/register'
import middy from 'middy';
import cors from '@middy/http-cors';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { findLatestDelivery, getSubscriptionFromDb, getVendorFromDb } from './dbUtils';
import { getUserInfoFromEvent } from './auth/getUserFromJwt';
import { MenuItems } from '../../common/interfaces';
import { SubscriptionDto } from '../../common/dto';


async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const userId = getUserInfoFromEvent(event);
  const vendor = await getVendorFromDb();
  const subscriptionFromDb = await getSubscriptionFromDb(vendor.vendorId, userId);
  if (!subscriptionFromDb) {
    return {
      statusCode: 404,
      body: '{ msg: "User does not have a subscription"}'
    };
  }
  let subSchedule: MenuItems[] = [];
  if (subscriptionFromDb) {
    subscriptionFromDb.schedule.forEach((item) => {
      subSchedule.push(vendor.schedule.find(({id}) => id === item));
    });
  }

  let sub: SubscriptionDto = {
    userId: userId,
    vendorId: vendor.vendorId.substr(2),
    paused: subscriptionFromDb.paused,
    schedule: subSchedule,
    noOfMeals: subscriptionFromDb.noOfMeals,
    box: subscriptionFromDb.box,
    lastDeliveryDate: (await findLatestDelivery(subscriptionFromDb.vendorId.substr(2), userId))?.deliverytime
  };

  return {
    statusCode: 200,
    body: JSON.stringify(sub)
  };
}

export const mainHandler = middy(handler).use(cors());
