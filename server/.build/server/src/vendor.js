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
        return getVendor(event);
    }
    if (event.httpMethod == "PUT") {
        return putvendor(event);
    }
    if (event.httpMethod == "DELETE") {
        return deleteVendor(event);
    }
}
exports.mainHandler = middy_1.default(handler).use(http_cors_1.default());
async function getVendor(event) {
    let vendorId = event.queryStringParameters["vendorId"];
    let vendor = await dbUtils_1.getVendorFromDb(vendorId);
    if (!vendor) {
        return {
            statusCode: 404,
            body: '{ "message" : "No profile for this vendor" }'
        };
    }
    return {
        statusCode: 200,
        body: JSON.stringify(vendor)
    };
}
async function putvendor(event) {
    const loggedInUser = getUserFromJwt_1.getUserInfoFromEvent(event);
    let vendorId = event.queryStringParameters["vendorId"];
    let body = JSON.parse(event.body);
    if (!event.queryStringParameters) {
        return {
            statusCode: 400,
            body: '{ "message" : "Missing parameter vendorId" }'
        };
    }
    if (vendorId != loggedInUser) {
        return {
            statusCode: 403,
            body: '{ "message" : "Forbidden operation" }'
        };
    }
    let vendor = await dbUtils_1.putVendorInDb(body, vendorId);
    return {
        statusCode: 200,
        body: JSON.stringify(vendor)
    };
}
async function deleteVendor(event) {
    const loggedInUser = getUserFromJwt_1.getUserInfoFromEvent(event);
    let vendorId = event.queryStringParameters["vendorId"];
    if (vendorId != loggedInUser) {
        return {
            statusCode: 403,
            body: '{ "message" : "Forbidden operation" }'
        };
    }
    await dbUtils_1.deleteVendorInDb(vendorId);
    return {
        statusCode: 200,
        body: '{ "message" : "Deletion succeeded" }'
    };
}
//# sourceMappingURL=vendor.js.map