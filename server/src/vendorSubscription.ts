import 'source-map-support/register'
import middy from 'middy';
import cors from '@middy/http-cors';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { deleteSubscriptionInDb, getSubscriptionFromDb, putSubscriptionInDb } from './dbUtils'

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

let vendorId = "lunsj@hjul.no";
// TODO: Fetch customerId from JWT

async function getUserSubscription(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
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

    try {
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
    } catch (err) {
        return {
            statusCode: 500, 
            body: JSON.stringify(err)
        };  
    }
}

async function putUserSubscription(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
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
        let subscription = await putSubscriptionInDb({...body, vendorId}, true);

        return {
            statusCode: 200,
            body: JSON.stringify(subscription)
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify(err)
        };
    }
}

async function deleteUserSubscription(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
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
    try {
        deleteSubscriptionInDb(vendorId, userId);
        return {
            statusCode: 200,
            body: '{ "message" : "Deletion succeeded" }'
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify(err)
        };
    }
}