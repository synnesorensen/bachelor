import 'source-map-support/register'
import middy from 'middy';
import cors from '@middy/http-cors';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getSubscriptionsForVendor } from './dbUtils';
import { getUserInfoFromEvent } from './auth/getUserFromJwt';

async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    let vendorId = getUserInfoFromEvent(event);

    let userSubscriptions = await getSubscriptionsForVendor(vendorId);

    return {
        statusCode: 200,
        body: JSON.stringify(userSubscriptions)
    };

}

export const mainHandler = middy(handler).use(cors());