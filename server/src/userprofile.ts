import 'source-map-support/register'
import middy from 'middy';
import cors from '@middy/http-cors';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { deleteUserprofileInDb, getUserprofileFromDb, putUserprofileInDb } from './dbUtils';
import { getUserInfoFromEvent } from './auth/getUserFromJwt';

async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    if (event.httpMethod == "GET") {
        return getUserprofile(event);
    }
    if (event.httpMethod == "PUT") {
        return putUserprofile(event);
    }
    if (event.httpMethod == "DELETE") {
        return deleteUserprofile(event);
    }
}
export const mainHandler = middy(handler).use(cors());

async function getUserprofile(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    let userId = getUserInfoFromEvent(event);
    let userprofile = await getUserprofileFromDb(userId);

    return {
        statusCode: 200,
        body: JSON.stringify(userprofile)
    };
}

async function putUserprofile(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    let userId = getUserInfoFromEvent(event);
    let body = JSON.parse(event.body);
    let userprofile = await putUserprofileInDb(body, userId);

    return {
        statusCode: 200,
        body: JSON.stringify(userprofile)
    };
}

async function deleteUserprofile(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    let userId = getUserInfoFromEvent(event);

    deleteUserprofileInDb(userId);
    return {
        statusCode: 200,
        body: '{ "message" : "Deletion succeeded" }'
    };

}