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
    let userId = getUserFromJwt_1.getUserInfoFromEvent(event);
    if (!event.queryStringParameters) {
        return {
            statusCode: 400,
            body: '{ "message" : "Missing parameter start time and end time" }'
        };
    }
    let start = event.queryStringParameters["start"];
    let end = event.queryStringParameters["end"];
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
    let deliveries = await dbUtils_1.getUsersDeliveries(userId, start, end);
    return {
        statusCode: 200,
        body: JSON.stringify(deliveries)
    };
}
exports.mainHandler = middy_1.default(handler).use(http_cors_1.default());
//# sourceMappingURL=userDeliveries.js.map