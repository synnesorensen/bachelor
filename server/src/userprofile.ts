import 'source-map-support/register';
import middy from 'middy';
import { cors } from 'middy/middlewares';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { deleteUserprofileInDb, getUserprofileFromDb, putUserprofileInDb, updateApproval } from './dbUtils';
import { getUserInfoFromEvent } from './auth/getUserFromJwt';
import { logEvent } from './helpers';

async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  logEvent(event);
  if (event.httpMethod == "GET") {
    return getUserprofile(event);
  }
  if (event.httpMethod == "PUT") {
    return putUserprofile(event);
  }
  if (event.httpMethod == "PATCH") {
    return updateUserprofile(event);
  }
  if (event.httpMethod == "DELETE") {
    return deleteUserprofile(event);
  }
}
export const mainHandler = middy(handler).use(cors());

async function getUserprofile(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  let userId = getUserInfoFromEvent(event);
  let userprofile = await getUserprofileFromDb(userId);

  if (!userprofile) {
    return {
      statusCode: 404,
      body: '{ "message" : "No profile for this user" }'
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify(userprofile)
  };
}

async function putUserprofile(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  let body = JSON.parse(event.body);
  let userprofile = await putUserprofileInDb(body, body.email, false);

  return {
    statusCode: 200,
    body: JSON.stringify(userprofile)
  };
}

async function updateUserprofile(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  let vendorId = getUserInfoFromEvent(event);
  let vendor = await getUserprofileFromDb(vendorId);
  
  if (!vendor.isVendor) {
    return {
      statusCode: 403,
      body: JSON.stringify({ message: "User " + vendorId + " is not a vendor" })
    };
  }
  if (!event.queryStringParameters) {
    return {
      statusCode: 400,
      body: '{ "message" : "Missing parameter userId" }'
    };
  }
  let userId = event.queryStringParameters["userId"];

  if (!userId) {
    return {
      statusCode: 400,
      body: '{ "message" : "Missing parameter userId" }'
    };
  }

  const { approved, note } = JSON.parse(event.body);
  
  try {
    await updateApproval(userId, approved, note);

    return {
      statusCode: 200,
      body: '{ "message" : "Approval updated" }'
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify(err)
    };
  }
}

async function deleteUserprofile(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const userId = getUserInfoFromEvent(event);

  deleteUserprofileInDb(userId);
  return {
    statusCode: 200,
    body: '{ "message" : "Deletion succeeded" }'
  };

}