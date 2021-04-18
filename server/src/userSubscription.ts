import 'source-map-support/register'
import middy from 'middy';
import cors from '@middy/http-cors';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { deleteSubscriptionInDb, getSubscriptionFromDb, putSubscriptionInDb } from './dbUtils'
import { getUserInfoFromEvent } from './auth/getUserFromJwt';

async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    if (event.httpMethod == "GET") {
        return getUserSubscription(event);
    }
    if (event.httpMethod == "PUT") {
        return putUserSubscription(event);
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
    return {
        statusCode: 200,
        body: JSON.stringify(subscription)
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
        approved: body.approved,
        paused: body.paused,
        schedule: body.schedule, 
        noOfMeals: body.noOfMeals,
        box: body.box
    }, false);

    return {
        statusCode: 200,
        body: JSON.stringify(subscription)
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
