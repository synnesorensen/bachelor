import 'source-map-support/register'
import middy from 'middy';
import cors from '@middy/http-cors';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getDeliveryFromDb, deleteDeliveryInDb, putDeliveryInDb } from './dbUtils';

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
let vendorId = "lunsj@hjul.no";
// TODO: Get vendorId from JWT

function getDelivery(event: APIGatewayProxyEvent): APIGatewayProxyResult | PromiseLike<APIGatewayProxyResult> {
    if (!event.queryStringParameters) {
        return {
            statusCode: 400,
            body: '{ "message" : "Missing parameter userId" }'
        };
    }
    let userId = event.queryStringParameters["userId"];
    let time = event.queryStringParameters["time"];

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
    try {
        let delivery = getDeliveryFromDb(vendorId, userId, time);

        return {
            statusCode: 200,
            body: JSON.stringify(delivery)
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify(err)
        };
    }
}

function putDelivery(event: APIGatewayProxyEvent): APIGatewayProxyResult | PromiseLike<APIGatewayProxyResult> {
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

    let body = JSON.parse(event.body); 

    try {
        let delivery = putDeliveryInDb(vendorId, userId, body);

        return {
            statusCode: 200,
            body: JSON.stringify(delivery)
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify(err)
        };
    }
}

function deleteDelivery(event: APIGatewayProxyEvent): APIGatewayProxyResult | PromiseLike<APIGatewayProxyResult> {
    if (!event.queryStringParameters) {
        return {
            statusCode: 400,
            body: '{ "message" : "Missing parameter userId" }'
        };
    }
    let userId = event.queryStringParameters["userId"];
    let time = event.queryStringParameters["time"];

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
    try {
        deleteDeliveryInDb(vendorId, userId, time);

        return {
            statusCode: 200,
            body: '{ "message" : "Deletion succeeded" }'
        }
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify(err)
        }
    }
}
