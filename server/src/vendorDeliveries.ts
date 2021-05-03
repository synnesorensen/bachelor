import 'source-map-support/register'
import middy from 'middy';
import cors from '@middy/http-cors';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getAllDeliveriesFromAllSubscribers, getUserprofileFromDb, saveDeliveriesToDb } from './dbUtils'
import { getUserInfoFromEvent } from './auth/getUserFromJwt'
import { generateDeliveries } from './addDeliveries';

async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    let vendorId = getUserInfoFromEvent(event);
    let vendor = await getUserprofileFromDb(vendorId);
    if (!vendor.isVendor) {
        return {
            statusCode: 403,
            body: JSON.stringify( {message: "User " + vendorId + " is not a vendor"})
        };
    }
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

    if (isNaN(noOfDeliveries)) {
        return {
            statusCode: 400,
            body: '{ "message" : "Invalid format for number of deliveries" }'
        };
    }

    try {
        let deliveries = await generateDeliveries(startDate, userId, vendorId, noOfDeliveries);
        await saveDeliveriesToDb(deliveries);

        return {
            statusCode: 200,
            body: JSON.stringify(deliveries)
        };
    } catch (e) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: e.toString()})
        }
    }
}
