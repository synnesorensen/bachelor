import 'source-map-support/register'
import middy from 'middy';
import cors from '@middy/http-cors';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { pauseSubscription } from './dbUtils'
import { getUserInfoFromEvent } from './auth/getUserFromJwt'

async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    let userId = getUserInfoFromEvent(event);

    if (!event.queryStringParameters) {
        return {
            statusCode: 400,
            body: '{ "message" : "Missing parameter" }'
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
            body: '{ "message" : "Missing parameter time" }'
        };
    }

    await pauseSubscription(userId, vendorId, time);

    return {
        statusCode: 200,
        body: JSON.stringify(pauseSubscription)
    };
}

export const mainHandler = middy(handler).use(cors());