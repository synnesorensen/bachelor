import 'source-map-support/register'
import middy from 'middy';
import cors from '@middy/http-cors';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getSubscriptionsForVendor } from './dbUtils';
import { getUserInfoFromEvent } from './auth/getUserFromJwt';

async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    let vendorId = getUserInfoFromEvent(event);

    try {
        let userSubscriptions = await getSubscriptionsForVendor(vendorId);

        return {
            statusCode: 200,
            body: JSON.stringify(userSubscriptions)
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify(err)
        }
    }; 
}

export const mainHandler = middy(handler).use(cors());