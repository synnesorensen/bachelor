"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainHandler = void 0;
require("source-map-support/register");
const middy_1 = __importDefault(require("middy"));
const http_cors_1 = __importDefault(require("@middy/http-cors"));
const dbUtils_1 = require("./dbUtils");
const getUserFromJwt_1 = require("./auth/getUserFromJwt");
async function handler(event) {
    if (event.httpMethod == "GET") {
        return getDelivery(event);
    }
    if (event.httpMethod == "PUT") {
        return putDelivery(event);
    }
    if (event.httpMethod == "DELETE") {
        return deleteDelivery(event);
    }
    return {
        statusCode: 405,
        body: '{ "message" : "Method not allowed" }'
    };
}
exports.mainHandler = middy_1.default(handler).use(http_cors_1.default());
async function getDelivery(event) {
    if (!event.queryStringParameters) {
        return {
            statusCode: 400,
            body: '{ "message" : "Missing parameter" }'
        };
    }
    let vendorId = event.queryStringParameters["vendorId"];
    let userId = event.queryStringParameters["userId"];
    let time = event.queryStringParameters["time"];
    if (!userId) {
        return {
            statusCode: 400,
            body: '{ "message" : "Missing parameter userId" }'
        };
    }
    if (!vendorId) {
        return {
            statusCode: 400,
            body: '{ "message" : "Missing parameter vendorId" }'
        };
    }
    if (!time) {
        return {
            statusCode: 400,
            body: '{ "message" : "Missing parameter timestamp" }'
        };
    }
    let delivery = await dbUtils_1.getDeliveryFromDb(vendorId, userId, time);
    return {
        statusCode: 200,
        body: JSON.stringify(delivery)
    };
}
async function putDelivery(event) {
    if (!event.queryStringParameters) {
        return {
            statusCode: 400,
            body: '{ "message" : "Missing parameter userId" }'
        };
    }
    let userId = event.queryStringParameters["userId"];
    let vendorId = event.queryStringParameters["vendorId"];
    if (!userId) {
        return {
            statusCode: 400,
            body: '{ "message" : "Missing parameter userId" }'
        };
    }
    if (!vendorId) {
        return {
            statusCode: 400,
            body: '{ "message" : "Missing parameter vendorId" }'
        };
    }
    let body = JSON.parse(event.body);
    let delivery = await dbUtils_1.putDeliveryInDb(vendorId, userId, body);
    return {
        statusCode: 200,
        body: JSON.stringify(delivery)
    };
}
async function deleteDelivery(event) {
    const loggedInUser = getUserFromJwt_1.getUserInfoFromEvent(event);
    if (!event.queryStringParameters) {
        return {
            statusCode: 400,
            body: '{ "message" : "Missing parameter userId" }'
        };
    }
    let vendorId = event.queryStringParameters["vendorId"];
    let userId = event.queryStringParameters["userId"];
    let time = event.queryStringParameters["time"];
    if (!vendorId) {
        return {
            statusCode: 400,
            body: '{ "message" : "Missing parameter vendorId" }'
        };
    }
    if (!userId) {
        return {
            statusCode: 400,
            body: '{ "message" : "Missing parameter userId" }'
        };
    }
    if (!time) {
        return {
            statusCode: 400,
            body: '{ "message" : "Missing parameter timestamp" }'
        };
    }
    if (vendorId != loggedInUser) {
        return {
            statusCode: 403,
            body: '{ "message" : "Forbidden, only vendors can delete a delivery." }'
        };
    }
    await dbUtils_1.deleteDeliveryInDb(vendorId, userId, time);
    return {
        statusCode: 200,
        body: '{ "message" : "Deletion succeeded" }'
    };
}
//# sourceMappingURL=delivery.js.map