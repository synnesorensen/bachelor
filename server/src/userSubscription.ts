import middy from 'middy';
import cors from '@middy/http-cors';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { deleteUserSubscriptionInDb, getUserSubscriptionFromDb, putSubscriptionInDb } from './dbUtils'

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
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

let userId = "synne@birthdaygirl.yay";
// TODO: Fetch customerId from JWT

async function getUserSubscription(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
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
    try {
        let subscription = getUserSubscriptionFromDb(vendorId, userId);

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

    if (!body || body.vendorId != vendorId) {
        return {
            statusCode: 400,
            body: '{ "message" : "body is missing or vendorId is not matching query parameter" }'
        };
    }
    if (body.userId != userId) {
        return {
            statusCode: 403,
            body: '{ "message" : "userId in body is not matching authenticated user" }'
        };
    }
    try {
        let subscription = await putSubscriptionInDb(body);

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
    try {
        deleteUserSubscriptionInDb(vendorId, userId);
        
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
