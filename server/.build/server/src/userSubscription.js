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
    let userId = getUserFromJwt_1.getUserInfoFromEvent(event);
    if (!event.queryStringParameters) {
        return {
            statusCode: 400,
            body: '{ "message" : "Missing parameter vendorId" }'
        };
    }
    let vendorId = event.queryStringParameters["vendorId"];
    if (!vendorId) {
        return {
            statusCode: 400,
            body: '{ "message" : "Missing parameter vendorId" }'
        };
    }
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
async function putUserSubscription(event) {
    let userId = getUserFromJwt_1.getUserInfoFromEvent(event);
    if (!event.queryStringParameters) {
        return {
            statusCode: 400,
            body: '{ "message" : "Missing parameter vendorId" }'
        };
    }
    let vendorId = event.queryStringParameters["vendorId"];
    if (!vendorId) {
        return {
            statusCode: 400,
            body: '{ "message" : "Missing parameter vendorId" }'
        };
    }
    let body = JSON.parse(event.body);
    if (body.userId != userId) {
        return {
            statusCode: 403,
            body: '{ "message" : "userId in body is not matching authenticated user" }'
        };
    }
    let subscription = await dbUtils_1.putSubscriptionInDb({
        vendorId,
        userId,
        approved: body.approved,
        paused: body.paused,
        schedule: body.schedule,
        noOfMeals: body.noOfMeals,
        box: body.box
    }, false);
    return {
        statusCode: 200,
        body: JSON.stringify(subscription)
    };
}
async function deleteUserSubscription(event) {
    let userId = getUserFromJwt_1.getUserInfoFromEvent(event);
    if (!event.queryStringParameters) {
        return {
            statusCode: 400,
            body: '{ "message" : "Missing parameter vendorId" }'
        };
    }
    let vendorId = event.queryStringParameters["vendorId"];
    if (!vendorId) {
        return {
            statusCode: 400,
            body: '{ "message" : "Missing parameter vendorId" }'
        };
    }
    dbUtils_1.deleteSubscriptionInDb(vendorId, userId);
    return {
        statusCode: 200,
        body: '{ "message" : "Deletion succeeded" }'
    };
}
//# sourceMappingURL=userSubscription.js.map