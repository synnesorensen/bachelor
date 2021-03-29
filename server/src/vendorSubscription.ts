import middy from 'middy';
import cors from '@middy/http-cors';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';


const database = new DynamoDB({ region: 'eu-north-1' });
const documentClient = new DocumentClient({ region: 'eu-north-1' });
// TODO: Make variable for region.

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {

    if (event.httpMethod == "GET") {
        return getUserSubscription(event);
    }

    if (event.httpMethod == "PUT") {
        return putUserSubscription(event);
    }

    if (event.httpMethod == "DELETE") {
        return deleteUserSubscription(event);
    }

    return {
        statusCode: 405,
        body: '{ "message" : "Method not allowed" }'
    };

}

export const mainHandler = middy(handler).use(cors());

let vendorId = "lunsj@hjul.no";
// TODO: Fetch customerId from JWT

async function getUserSubscription(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    
    if (!event.queryStringParameters) {
        return {
            statusCode: 400,
            body: '{ "message" : "Missing parameter userId" }'
        };
    }

    let userId = event.queryStringParameters["userId"];

    if (!userId) {
        return {
            statusCode: 400,
            body: '{ "message" : "Missing parameter userId" }'
        };
    }

    let params = {
        TableName: "MainTable",
        KeyConditionExpression: "#pk = :vendor and #sk = :userId",
        ExpressionAttributeValues: {
            ":vendor": "v#" + vendorId,
            ":userId": "u#" + userId
        }
    }

    try {
        let dbResult = await documentClient.query(params).promise();

        if (dbResult.Count < 1) {
            return {
                statusCode: 404,
                body: '{ "message": "No subscription for vendorId: ' + vendorId + '"}'
            };
        } 
        
        let subscription = {
            vendorId,
            userId,
            approved: dbResult.Items[0].approved,
            paused: dbResult.Items[0].paused,
            schedule: dbResult.Items[0].schedule, 
        }

        return {
            statusCode: 200,
            body: JSON.stringify(subscription)
        };

    } catch (err) {
        return {
            statusCode: 500, 
            body: JSON.stringify(err)
        };  
    }
}

function putUserSubscription(event: APIGatewayProxyEvent): APIGatewayProxyResult | PromiseLike<APIGatewayProxyResult> {
    throw new Error('Function not implemented.');
}

function deleteUserSubscription(event: APIGatewayProxyEvent): APIGatewayProxyResult | PromiseLike<APIGatewayProxyResult> {
    throw new Error('Function not implemented.');
}

