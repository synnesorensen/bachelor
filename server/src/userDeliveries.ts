import 'source-map-support/register'
import middy from 'middy';
import cors from '@middy/http-cors';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getUsersDeliveries } from './dbUtils'

async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    let userId = "synne@birthdaygirl.yay";
    // TODO: Get userId from JWT
    
    if (!event.queryStringParameters) {
        return {
            statusCode: 400,
            body: '{ "message" : "Missing parameter vendorId" }'
        };
    }
    let vendorId = event.queryStringParameters["vendorId"];
    let start = event.queryStringParameters["start"];
    let end = event.queryStringParameters["end"];

    if (!vendorId) {
        return {
            statusCode: 400,
            body: '{ "message" : "Missing parameter vendorId" }'
        };
    } 
    if (!start) {
        return {
            statusCode: 400,
            body: '{ "message" : "Missing parameter start time" }'
        };
    }
    if (!end) {
        return {
            statusCode: 400,
            body: '{ "message" : "Missing parameter end time" }'
        };
    }

    try {
        let deliveries = await getUsersDeliveries(vendorId, userId, start, end);
        return {
            statusCode: 200,
            body: JSON.stringify(deliveries)
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