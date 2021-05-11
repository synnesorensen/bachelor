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
exports.mainHandler = middy_1.default(handler).use(http_cors_1.default());
async function getUserSubscription(event) {
    let vendorId = getUserFromJwt_1.getUserInfoFromEvent(event);
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
    try {
        let subscription = await dbUtils_1.getSubscriptionFromDb(vendorId, userId);
        if (!subscription) {
            return {
                statusCode: 404,
                body: '{ "message" : "No subscription for vendorId: ' + vendorId + '"}'
            };
        }
        return {
            statusCode: 200,
            body: JSON.stringify(subscription)
        };
    }
    catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify(err)
        };
    }
}
async function putUserSubscription(event) {
    let vendorId = getUserFromJwt_1.getUserInfoFromEvent(event);
    let vendor = await dbUtils_1.getUserprofileFromDb(vendorId);
    if (!vendor.isVendor) {
        return {
            statusCode: 403,
            body: JSON.stringify({ message: "User " + vendorId + " is not a vendor" })
        };
    }
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
    let body = JSON.parse(event.body);
    try {
        let subscription = await dbUtils_1.putSubscriptionInDb({ ...body, vendorId }, true);
        return {
            statusCode: 200,
            body: JSON.stringify(subscription)
        };
    }
    catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify(err)
        };
    }
}
async function deleteUserSubscription(event) {
    let vendorId = getUserFromJwt_1.getUserInfoFromEvent(event);
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
    dbUtils_1.deleteSubscriptionInDb(vendorId, userId);
    return {
        statusCode: 200,
        body: '{ "message" : "Deletion succeeded" }'
    };
}
//# sourceMappingURL=vendorSubscription.js.map