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
        return getCustomer(event);
    }

    // if (event.httpMethod == "PUT") {
    //   return putCustomer(event);
    // }

    if (event.httpMethod == "DELETE") {
        return deleteCustomer(event);
    }
}

export const mainHandler = middy(handler).use(cors());

let customerId = "synne@birthdaygirl.yay";
// TODO: Fetch customerId from JWT

async function getCustomer(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {

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

    let customer = await documentClient.query(params).promise();

    return {
        statusCode: 200,
        body: JSON.stringify(customer.Items)
    };
}

async function deleteCustomer(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {

    let params = {
        TableName: 'MainTable',
        Key: {
            'pk': { S: 'c#' + customerId },
            'sk': { S: 'c#' + customerId }
        }
    };

    database.deleteItem(params, function (err, data) {
        if (err) {
            console.log("Error", err);
        } else {
            console.log("Success", data);
        }
    });

    return {
        statusCode: 200,
        body: JSON.stringify(params.Key)
    };
}