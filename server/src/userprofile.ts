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

let customerId = "synne@birthdaygirl.yay";
// TODO: Fetch customerId from JWT

async function getUserprofile(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {

    let params = {
        TableName: 'MainTable',
        KeyConditionExpression: "#pk = :customerId and #sk = :customerId",
        ExpressionAttributeNames: {
            "#pk": "pk",
            "#sk": "sk"
        },
        ExpressionAttributeValues: {
            ":customerId": "c#" + customerId
        }
    }
    try {
        let customer = await documentClient.query(params).promise();

        return {
            statusCode: 200,
            body: JSON.stringify(customer.Items)
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify(err)
        }
    }
}

async function putUserprofile(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    throw new Error('Function not implemented.');
}

async function deleteUserprofile(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {

    let params = {
        TableName: 'MainTable',
        Key: {
            'pk': { S: 'c#' + customerId },
            'sk': { S: 'c#' + customerId }
        }
    };

    try {
        database.deleteItem(params).promise;
        return {
            statusCode: 200,
            body: JSON.stringify(params.Key)
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify(err)
        }
    }
}