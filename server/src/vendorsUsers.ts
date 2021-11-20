import 'source-map-support/register'
import middy from 'middy';
import cors from '@middy/http-cors';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getAllUsersFromDb, getSubscriptionsForVendor, getUserprofileFromDb } from './dbUtils';
import { getUserInfoFromEvent } from './auth/getUserFromJwt';

async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    let vendorId = getUserInfoFromEvent(event);
    let confirmedVendor = await getUserprofileFromDb(vendorId);

    if (!vendorId || !confirmedVendor.isVendor) {
        return {
            statusCode: 403,
            body: '{ "message" : "Forbidden, only vendors can perform this request." }'
        }
    }

    let allUsers = await getAllUsersFromDb();
    let subs = await getSubscriptionsForVendor(vendorId);

    const usersResult = [];
    allUsers.forEach((user) => {
        if (!subs.find(({ userId }) => user.email === userId)) {
            usersResult.push(user);
        }
    });
    return {
        statusCode: 200,
        body: JSON.stringify(usersResult)
    };
}

export const mainHandler = middy(handler).use(cors());