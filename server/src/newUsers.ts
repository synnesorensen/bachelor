import 'source-map-support/register';
import middy from 'middy';
import { cors } from 'middy/middlewares';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getAllUsersFromDb, getUserprofileFromDb } from './dbUtils';
import { getUserInfoFromEvent } from './auth/getUserFromJwt';
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
  
  const users = await getAllUsersFromDb();
  const result = users.filter(user => user.approved === "new");

  return {
    statusCode: 200,
    body: JSON.stringify(result)
  };

}

export const mainHandler = middy(handler).use(cors());