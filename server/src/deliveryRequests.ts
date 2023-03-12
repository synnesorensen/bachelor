import 'source-map-support/register';
import middy from 'middy';
import { cors } from 'middy/middlewares';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getUserprofileFromDb, getDeliveryRequestsFromDb, getDeliveryRequestsByDate, handleDeliveryRequest, getDeliveryFromDb } from './dbUtils';
import { getUserInfoFromEvent } from './auth/getUserFromJwt';
import { DeliveryRequestDto } from '../../common/dto';
import { logEvent } from './helpers';

async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  logEvent(event);
  let vendorId = getUserInfoFromEvent(event);
  let vendor = await getUserprofileFromDb(vendorId);
  if (!vendor.isVendor) {
    return {
      statusCode: 403,
      body: JSON.stringify( {message: "User " + vendorId + " is not a vendor"})
    };
  }

  if (event.httpMethod === "GET") {
    return getDeliveryRequests(event);
  }
  if (event.httpMethod === "POST") {
    return postDeliveryRequest(event);
  }
  return {
    statusCode: 405,
    body: '{ "message" : "Method not allowed" }'
  };
}

async function getDeliveryRequests(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  let requests:DeliveryRequestDto[] = []; 

  if (event.queryStringParameters) {
    const startDate = event.queryStringParameters["start"];
    const endDate = event.queryStringParameters["end"];

    requests = await getDeliveryRequestsByDate(startDate, endDate);
    
    return {
      statusCode: 200,
      body: JSON.stringify(requests)
    };
  }

  requests = await getDeliveryRequestsFromDb();
  const newRequests = requests.filter(req => req.approved === "new");   // TODO: Legge til GSI med approved sånn at DB kan hente ut alle nye
  return {
    statusCode: 200,
    body: JSON.stringify(newRequests)
  };
}

async function postDeliveryRequest(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const body = JSON.parse(event.body);
  const vendorId = getUserInfoFromEvent(event);
  const {userId, deliverytime, action} = body;

  if (!userId) {
    return {
      statusCode: 400,
      body: '{ "message" : "Missing attribute userId" }'
    };
  }

  if (!deliverytime) {
    return {
      statusCode: 400,
      body: '{ "message" : "Missing attribute time" }'
    };
  }

  if (!action) {
    return {
      statusCode: 400,
      body: '{ "message" : "Missing attribute action" }'
    };
  }

  let delivery = await getDeliveryFromDb(vendorId, userId, deliverytime);
  if (!delivery) {
    return {
      statusCode: 400,
      body: '{ "message" : "No delivery found" }'
    };
  }

  if (action === "approve") {
    const del = await handleDeliveryRequest(true, userId, deliverytime);

    return {
      statusCode: 200,
      body: JSON.stringify(del)
    };
  } else if (action === "deny") {
    const del = await handleDeliveryRequest(false, userId, deliverytime);

    return {
      statusCode: 200,
      body: JSON.stringify(del)
    };
  } else {
    return {
      statusCode: 400,
      body: '{ "message" : "Action not supported" }'
    };
  }
}

export const mainHandler = middy(handler).use(cors());