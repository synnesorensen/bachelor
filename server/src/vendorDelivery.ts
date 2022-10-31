import 'source-map-support/register';
import middy from 'middy';
import cors from '@middy/http-cors';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getUserprofileFromDb, getDeliveryFromDb, updateDeliveries } from './dbUtils';
import { getUserInfoFromEvent } from './auth/getUserFromJwt';
import { Delivery } from '../../common/interfaces';
import { logEvent } from './helpers';

async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  logEvent(event);
  const vendorId = getUserInfoFromEvent(event);
  const vendor = await getUserprofileFromDb(vendorId);
  if (!vendor.isVendor) {
    return {
      statusCode: 403,
      body: JSON.stringify( {message: "User " + vendorId + " is not a vendor"})
    };
  }
  
  if (event.httpMethod == "PUT") {
    return putDelivery(event);
  }
  return {
    statusCode: 405,
    body: '{ "message" : "Method not allowed" }'
  };
}
export const mainHandler = middy(handler).use(cors());

async function putDelivery(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const vendorId = getUserInfoFromEvent(event);

  if (!event.queryStringParameters) {
    return {
      statusCode: 400,
      body: '{ "message" : "Missing parameter" }'
    };
  }
  
  const userId = event.queryStringParameters["userId"];
  const time = event.queryStringParameters["time"];
  const payed = event.queryStringParameters["status"];

  if (!userId) {
    return {
      statusCode: 400,
      body: '{ "message" : "Missing parameter userId" }'
    };
  }

  if (!time) {
    return {
      statusCode: 400,
      body: '{ "message" : "Missing attribute time" }'
    };
  }

  if (!payed) {
    return {
      statusCode: 400,
      body: '{ "message" : "Missing attribute status" }'
    };
  }

  let delivery = await getDeliveryFromDb(vendorId, userId, time);
  const dels: Delivery[] = []

  if (payed === "unpaid") {
    delivery.paid = "paid";
  } else if (payed === "paid") {
    delivery.paid = "unpaid";
  } else {
    return {
      statusCode: 400,
      body: '{ "message" : "Unknown payment status" }'
    }
  }
  dels.push(delivery);
  await updateDeliveries(dels);

  return {
    statusCode: 200,
    body: '{ "message" : "Update succeeded" }'
  }

}