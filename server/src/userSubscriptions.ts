import 'source-map-support/register'
import middy from 'middy';
import cors from '@middy/http-cors';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getSubscriptionsForUser } from './dbUtils';
import { getUserInfoFromEvent } from './auth/getUserFromJwt';

async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    let userId = getUserInfoFromEvent(event);

    let vendorSubscriptions = await getSubscriptionsForUser(userId);

    return {
        statusCode: 200,
        body: JSON.stringify(vendorSubscriptions)
    };
}

export const mainHandler = middy(handler).use(cors());