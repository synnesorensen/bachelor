import 'source-map-support/register'
import middy from 'middy';
import cors from '@middy/http-cors';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getAllUsersFromDb, getUserprofileFromDb } from './dbUtils';
import { getUserInfoFromEvent } from './auth/getUserFromJwt';

async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
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