import 'source-map-support/register'
import middy from 'middy';
import cors from '@middy/http-cors';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getDeliveryFromDb, deleteDeliveryInDb, putDeliveryInDb } from './dbUtils';
import { getUserInfoFromEvent } from './auth/getUserFromJwt';

async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    if (event.httpMethod == "GET") {
        return getDelivery(event);
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

async function putDelivery(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    if (!event.queryStringParameters) {
        return {
            statusCode: 400,
            body: '{ "message" : "Missing parameter userId" }'
        };
    }
    let userId = event.queryStringParameters["userId"];
    let vendorId = event.queryStringParameters["vendorId"];

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

    let body = JSON.parse(event.body);
    let delivery = await putDeliveryInDb(vendorId, userId, body);

    return {
        statusCode: 200,
        body: JSON.stringify(delivery)
    };
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
