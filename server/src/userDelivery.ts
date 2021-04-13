import 'source-map-support/register'
import middy from 'middy';
import cors from '@middy/http-cors';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getDeliveryFromDb, putDeliveryInDb } from './dbUtils';
import { getUserInfoFromEvent } from './auth/getUserFromJwt';

async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    if (event.httpMethod == "GET") {
        return getDelivery(event);
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


async function getDelivery(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult | PromiseLike<APIGatewayProxyResult>> {
    let userId = getUserInfoFromEvent(event);
    if (!event.queryStringParameters) {
        return {
            statusCode: 400,
            body: '{ "message" : "Missing parameter vendorId" }'
        };
    }
    let vendorId = event.queryStringParameters["vendorId"];
    let time = event.queryStringParameters["time"];

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
    let userId = getUserInfoFromEvent(event);
    if (!event.queryStringParameters) {
        return {
            statusCode: 400,
            body: '{ "message" : "Missing parameter vendorId" }'
        };
    }
    let vendorId = event.queryStringParameters["vendorId"];
    let time = event.queryStringParameters["time"];

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

    let body = JSON.parse(event.body);
    let delivery = await putDeliveryInDb(vendorId, userId, body);

    return {
        statusCode: 200,
        body: JSON.stringify(delivery)
    };
}
