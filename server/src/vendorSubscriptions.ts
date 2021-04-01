import 'source-map-support/register'
import middy from 'middy';
import cors from '@middy/http-cors';
import { APIGatewayProxyResult } from 'aws-lambda'
import { getVendorSubscriptionsFromDb } from './dbUtils';

async function handler(): Promise<APIGatewayProxyResult> {
    let vendorId = "lunsj@hjul.no";
    // TODO: Get vendorId from JWT

    try {
        let userSubscriptions = await getVendorSubscriptionsFromDb(vendorId);

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