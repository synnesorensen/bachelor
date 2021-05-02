import 'source-map-support/register'
import middy from 'middy';
import cors from '@middy/http-cors';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getAllDeliveriesFromAllSubscribers, saveDeliveriesToDb } from './dbUtils'
import { getUserInfoFromEvent } from './auth/getUserFromJwt'
import { generateDeliveries } from './addDeliveries';

async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    if (event.httpMethod == "GET") {
        return getVendorDeliveries(event);
    }
    if (event.httpMethod == "POST") {
        return postVendorDeliveries(event);
    }
    return {
        statusCode: 405,
        body: '{ "message" : "Method not allowed" }'
    };
}

async function getVendorDeliveries(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    let vendorId = getUserInfoFromEvent(event);

    if (!event.queryStringParameters) {
        return {
            statusCode: 400,
            body: '{ "message" : "Missing parameter time" }'
        };
    }
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

    let deliveries = await getAllDeliveriesFromAllSubscribers(vendorId, start, end); 
    return {
        statusCode: 200,
        body: JSON.stringify(deliveries)
    };
}

export const mainHandler = middy(handler).use(cors());

async function postVendorDeliveries(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    let vendorId = getUserInfoFromEvent(event);

    if (!event.queryStringParameters) {
        return {
            statusCode: 400,
            body: '{ "message" : "Missing parameter time" }'
        };
    }
    let date = event.queryStringParameters["startDate"];
    let no = event.queryStringParameters["no"];
    let userId = event.queryStringParameters["userId"];
    console.log(event.queryStringParameters)

    if (!vendorId) {
        return {
            statusCode: 400,
            body: '{ "message" : "Missing parameter vendorId" }'
        };
    }
    if (!date) {
        return {
            statusCode: 400,
            body: '{ "message" : "Missing parameter startDate" }'
        };
    }
    if (!userId) {
        return {
            statusCode: 400,
            body: '{ "message" : "Missing parameter userId" }'
        };
    }
    if (!no) {
        return {
            statusCode: 400,
            body: '{ "message" : "Missing parameter number of deliveries" }'
        };
    }
    let startDate = new Date(date);
    let noOfDeliveries = parseInt(no);

    let deliveries = await generateDeliveries(startDate, userId, vendorId, noOfDeliveries);
    console.log("Deliveries som vi tar inn i DB ", deliveries)
    await saveDeliveriesToDb(deliveries);

    return {
        statusCode: 200,
        body: JSON.stringify(deliveries)
    };
}
