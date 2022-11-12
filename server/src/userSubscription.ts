import 'source-map-support/register';
import middy from 'middy';
import { cors } from 'middy/middlewares';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { deleteSubscriptionInDb, findLatestDelivery, getSubscriptionFromDb, getVendorFromDb, pauseSubscription, putSubscriptionInDb, unPauseSubscription } from './dbUtils';
import { getUserInfoFromEvent } from './auth/getUserFromJwt';
import { MenuItems } from '../../common/interfaces';
import { SubscriptionDto } from '../../common/dto';
import { logEvent } from './helpers';

async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  logEvent(event);
  if (event.httpMethod == "GET") {
    return getUserSubscription(event);
  }
  if (event.httpMethod == "PUT") {
    return putUserSubscription(event);
  }
  if (event.httpMethod == "POST") {
    return postUserSubscription(event);
  }
  if (event.httpMethod == "DELETE") {
    return deleteUserSubscription(event);
  }
  return {
    statusCode: 405,
    body: '{ "message" : "Method not allowed" }'
  };
}

export const mainHandler = middy(handler).use(cors());

async function getUserSubscription(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  let userId = getUserInfoFromEvent(event);
  const vendor = await getVendorFromDb();

  if (!event.queryStringParameters) {
    return {
      statusCode: 400,
      body: '{ "message" : "Missing parameter vendorId" }'
    };
  }
  let vendorId = event.queryStringParameters["vendorId"];

  if (!vendorId) {
    return {
      statusCode: 400,
      body: '{ "message" : "Missing parameter vendorId" }'
    };
  }
  let subscription = await getSubscriptionFromDb(vendorId, userId);

  if (!subscription) {
    return {
      statusCode: 404,
      body: '{ "message" : "No subscription for vendorId: ' + vendorId + '"}'
    };
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

async function putUserSubscription(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  let userId = getUserInfoFromEvent(event);
  if (!event.queryStringParameters) {
    return {
      statusCode: 400,
      body: '{ "message" : "Missing parameter vendorId" }'
    };
  }
  let vendorId = event.queryStringParameters["vendorId"];

  if (!vendorId) {
    return {
      statusCode: 400,
      body: '{ "message" : "Missing parameter vendorId" }'
    };
  }
  let body = JSON.parse(event.body);

  if (body.userId != userId) {
    return {
      statusCode: 403,
      body: '{ "message" : "userId in body is not matching authenticated user" }'
    };
  }
  let subscription = await putSubscriptionInDb({
    vendorId,
    userId,
    paused: body.paused,
    schedule: body.schedule, 
    noOfMeals: body.noOfMeals,
    box: body.box
  });

  return {
    statusCode: 200,
    body: JSON.stringify(subscription)
  };
}

async function postUserSubscription(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  let userId = getUserInfoFromEvent(event);
  let body = JSON.parse(event.body);
  const vendor = await getVendorFromDb();

  if (!event.queryStringParameters) {
    return {
      statusCode: 400,
      body: '{ "message" : "Missing parameter" }'
    };
  }
  let vendorId = event.queryStringParameters["vendorId"];

  if (!vendorId) {
    return {
      statusCode: 400,
      body: '{ "message" : "Missing parameter vendorId" }'
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

async function deleteUserSubscription(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  let userId = getUserInfoFromEvent(event);
  if (!event.queryStringParameters) {
    return {
      statusCode: 400,
      body: '{ "message" : "Missing parameter vendorId" }'
    };
  }
  let vendorId = event.queryStringParameters["vendorId"];

  if (!vendorId) {
    return {
      statusCode: 400,
      body: '{ "message" : "Missing parameter vendorId" }'
    };
  }
  deleteSubscriptionInDb(vendorId, userId);
  return {
    statusCode: 200,
    body: '{ "message" : "Deletion succeeded" }'
  };
}
