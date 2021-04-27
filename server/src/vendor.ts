import 'source-map-support/register'
import middy from 'middy';
import cors from '@middy/http-cors';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { deleteUserprofileInDb, deleteVendorInDb, getVendorFromDb, putVendorInDb } from './dbUtils';
import { getUserInfoFromEvent } from './auth/getUserFromJwt';

async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    if (event.httpMethod == "GET") {
        return getVendor(event);
    }
    if (event.httpMethod == "PUT") {
        return putvendor(event);
    }
    if (event.httpMethod == "DELETE") {
        return deleteVendor(event);
    }
}
export const mainHandler = middy(handler).use(cors());

async function getVendor(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    let vendorId = event.queryStringParameters["vendorId"];
    let vendor = await getVendorFromDb(vendorId);

    if (!vendor) {
        return {
            statusCode: 404,
            body: '{ "message" : "No profile for this vendor" }'
        }
    }

    return {
        statusCode: 200,
        body: JSON.stringify(vendor)
    };
}


async function putvendor(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    const loggedInUser = getUserInfoFromEvent(event);
    let vendorId = event.queryStringParameters["vendorId"];
    let body = JSON.parse(event.body);

    if (vendorId != loggedInUser) {
        return {
            statusCode: 403,
            body: '{ "message" : "Forbidden operation" }'
        }
    }
    let vendor = await putVendorInDb(body, vendorId);

    return {
        statusCode: 200,
        body: JSON.stringify(vendor)
    };
}


async function deleteVendor(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    const loggedInUser = getUserInfoFromEvent(event);
    let vendorId = event.queryStringParameters["vendorId"];

    if (vendorId != loggedInUser) {
        return {
            statusCode: 403,
            body: '{ "message" : "Forbidden operation" }'
        }
    }
    await deleteVendorInDb(vendorId);
    
    return {
        statusCode: 200,
        body: '{ "message" : "Deletion succeeded" }'
    };
}
