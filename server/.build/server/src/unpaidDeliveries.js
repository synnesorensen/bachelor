"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainHandler = void 0;
require("source-map-support/register");
const middy_1 = __importDefault(require("middy"));
const http_cors_1 = __importDefault(require("@middy/http-cors"));
const getUserFromJwt_1 = require("./auth/getUserFromJwt");
const dbUtils_1 = require("./dbUtils");
const timeHandling_1 = require("./timeHandling");
const addDeliveries_1 = require("./addDeliveries");
async function handler(event) {
    let vendorId = getUserFromJwt_1.getUserInfoFromEvent(event);
    if (!event.queryStringParameters) {
        return {
            statusCode: 400,
            body: '{ "message" : "Missing parameter userId, start time or month" }'
        };
    }
    let userId = event.queryStringParameters["userId"];
    let afterDate = event.queryStringParameters["afterDate"];
    let yearMonth = event.queryStringParameters["yearMonth"];
    if (!userId) {
        return {
            statusCode: 400,
            body: '{ "message" : "Missing parameter userId" }'
        };
    }
    if (!yearMonth) {
        return {
            statusCode: 400,
            body: '{ "message" : "Missing parameter yearMonth" }'
        };
    }
    if (!afterDate) {
        afterDate = yearMonth + "-01";
    }
    let vendor = await dbUtils_1.getVendorFromDb(vendorId);
    if (!vendor) {
        return {
            statusCode: 500,
            body: '{ "message": "Could not find vendor in DB" }'
        };
    }
    let sub = await dbUtils_1.getSubscriptionFromDb(vendorId, userId);
    let schedule = sub.schedule.map((subId) => {
        return vendor.schedule.find(({ id }) => id == subId);
    });
    let weekTimes = addDeliveries_1.scheduleToWeekTimes(schedule);
    let result = await timeHandling_1.noOfDeliveriesInMonth(new Date(afterDate), weekTimes);
    return {
        statusCode: 200,
        body: JSON.stringify({
            no: result
        })
    };
}
exports.mainHandler = middy_1.default(handler).use(http_cors_1.default());
//# sourceMappingURL=unpaidDeliveries.js.map