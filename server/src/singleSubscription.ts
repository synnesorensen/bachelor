import 'source-map-support/register'
import middy from 'middy';
import cors from '@middy/http-cors';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getOnlySubscriptionForUser } from './dbUtils';
import { getUserInfoFromEvent } from './auth/getUserFromJwt';


async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    const userId = getUserInfoFromEvent(event);

    let sub = await getOnlySubscriptionForUser(userId);

    return {
        statusCode: 200,
        body: JSON.stringify(sub)
    };
}

export const mainHandler = middy(handler).use(cors());