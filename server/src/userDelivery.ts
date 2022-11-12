import 'source-map-support/register';
import middy from 'middy';
import { cors } from 'middy/middlewares';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getDeliveryFromDb, deleteDeliveryInDb, newDeliveryInDb, getVendorFromDb, getUserprofileFromDb, changeNoOfMeals } from './dbUtils';
import { getUserInfoFromEvent } from './auth/getUserFromJwt';
import { logEvent } from './helpers';

async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  logEvent(event);
  if (event.httpMethod == "GET") {
    return getDelivery(event);
  }
  if (event.httpMethod == "POST") {
    return postDelivery(event);
  }  
  if (event.httpMethod == "PUT") {
    return putDelivery(event);
  }
  if (event.httpMethod == "DELETE") {
    return deleteDelivery(event);
  }
  return {
    statusCode: 405,
    body: '{ "message" : "Method not allowed" }'
  };
}
export const mainHandler = middy(handler).use(cors());

async function getDelivery(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  if (!event.queryStringParameters) {
    return {
      statusCode: 400,
      body: '{ "message" : "Missing parameter" }'
    };
  }
  let vendorId = event.queryStringParameters["vendorId"];
  let userId = event.queryStringParameters["userId"];
  let time = event.queryStringParameters["time"];

  if (!userId) {
    return {
      statusCode: 400,
      body: '{ "message" : "Missing parameter userId" }'
    };
  }  
  if (!vendorId) {
    return {
      statusCode: 400,
      body: '{ "message" : "Missing parameter vendorId" }'
    };
  }
  if (!time) {
    return {
      statusCode: 400,
      body: '{ "message" : "Missing parameter timestamp" }'
    };
  }

  let delivery = await getDeliveryFromDb(vendorId, userId, time);

  return {
    statusCode: 200,
    body: JSON.stringify(delivery)
  };
}

async function postDelivery(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  if (!event.queryStringParameters) {
    return {
      statusCode: 400,
      body: '{ "message" : "Missing parameters" }'
    };
  }
  let userId = event.queryStringParameters["userId"];
  let vendor = await getVendorFromDb();
  const vendorId = vendor.email;

  if (!userId) {
    return {
      statusCode: 400,
      body: '{ "message" : "Missing parameter userId" }'
    };
  }  

  if (!vendorId) {
    return {
      statusCode: 400,
      body: '{ "message" : "No such vendor exists" }'
    };
  } 

  let body = JSON.parse(event.body);
  const user = await getUserprofileFromDb(userId);
  if (user.approved === "approved") {
    let delivery = await newDeliveryInDb(vendorId, userId, body);
    return {
      statusCode: 200,
      body: JSON.stringify(delivery)
    };
  } else {
    return {
      statusCode: 403,
      body: '{ "message" : "Not allowed" }'
    };
  }
}

async function putDelivery(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  if (!event.queryStringParameters) {
    return {
      statusCode: 400,
      body: '{ "message" : "Missing parameters" }'
    };
  }
  let userId = event.queryStringParameters["userId"];
  let vendor = await getVendorFromDb();
  const vendorId = vendor.email;

  if (!userId) {
    return {
      statusCode: 400,
      body: '{ "message" : "Missing parameter userId" }'
    };
  }  

  if (!vendorId) {
    return {
      statusCode: 400,
      body: '{ "message" : "No such vendor exists" }'
    };
  } 
  let body = JSON.parse(event.body);
  const user = await getUserprofileFromDb(userId);
  if (user.approved === "approved") {
    let delivery = await changeNoOfMeals(body, userId, vendorId);
    return {
      statusCode: 200,
      body: JSON.stringify(delivery)
    };
  } else {
    return {
      statusCode: 403,
      body: '{ "message" : "Not allowed" }'
    };
  }

}

async function deleteDelivery(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const loggedInUser = getUserInfoFromEvent(event);
  if (!event.queryStringParameters) {
    return {
      statusCode: 400,
      body: '{ "message" : "Missing parameter userId" }'
    };
  }
  let vendorId = event.queryStringParameters["vendorId"];
  let userId = event.queryStringParameters["userId"];
  let time = event.queryStringParameters["time"];

  if (!vendorId) {
    return {
      statusCode: 400,
      body: '{ "message" : "Missing parameter vendorId" }'
    };
  } 
  if (!userId) {
    return {
      statusCode: 400,
      body: '{ "message" : "Missing parameter userId" }'
    };
  }
  if (!time) {
    return {
      statusCode: 400,
      body: '{ "message" : "Missing parameter timestamp" }'
    };
  }
  if (vendorId != loggedInUser) {
    return {
      statusCode: 403,
      body: '{ "message" : "Forbidden, only vendors can delete a delivery." }'
    }
  }
  await deleteDeliveryInDb(userId, time);

  return {
    statusCode: 200,
    body: '{ "message" : "Deletion succeeded" }'
  }
}
