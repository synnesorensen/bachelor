import 'source-map-support/register'
import middy from 'middy';
import cors from '@middy/http-cors';
import { APIGatewayProxyResult } from 'aws-lambda'
import { getSubscriptionsForUser } from './dbUtils';

async function handler(): Promise<APIGatewayProxyResult> {
    let userId = "synne@birthdaygirl.yay";
    // TODO: Get userId from JWT
    
    try {
        let vendorSubscriptions = await getSubscriptionsForUser(userId);

        return {
            statusCode: 200,
            body: JSON.stringify(vendorSubscriptions)
        };
    } catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            body: JSON.stringify(err)
        }
    };
}

export const mainHandler = middy(handler).use(cors());