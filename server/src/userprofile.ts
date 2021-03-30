import middy from 'middy';
import cors from '@middy/http-cors';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { deleteUserprofileInDb, getUserprofileFromDb, putUserprofileInDb } from './dbUtils';

const database = new DynamoDB({ region: 'eu-north-1' });
const documentClient = new DocumentClient({ region: 'eu-north-1' });
// TODO: Make variable for region.

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    if (event.httpMethod == "GET") {
        return getUserprofile();
    }
    if (event.httpMethod == "PUT") {
      return putUserprofile(event);
    }
    if (event.httpMethod == "DELETE") {
        return deleteUserprofile();
    }
}
export const mainHandler = middy(handler).use(cors());

let userId = "synne@birthdaygirl.yay";
// TODO: Fetch customerId from JWT

async function getUserprofile(): Promise<APIGatewayProxyResult> {
    try {
        let userprofile = getUserprofileFromDb(userId);

        return {
            statusCode: 200,
            body: JSON.stringify(userprofile)
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify(err)
        }
    }
}

async function putUserprofile(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    let body = JSON.parse(event.body);

    try {
        let userprofile = await putUserprofileInDb;

        return {
            statusCode: 200,
            body: JSON.stringify(userprofile)
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify(err)
        };
    }
}

async function deleteUserprofile(): Promise<APIGatewayProxyResult> {
    try {
        deleteUserprofileInDb(userId);
        return {
            statusCode: 200,
            body: '{ "message" : "Deletion succeeded" }'
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify(err)
        }
    }
}