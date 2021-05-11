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
const addDeliveries_1 = require("./addDeliveries");
async function handler(event) {
    let vendorId = getUserFromJwt_1.getUserInfoFromEvent(event);
    let vendor = await dbUtils_1.getUserprofileFromDb(vendorId);
    if (!vendor.isVendor) {
        return {
            statusCode: 403,
            body: JSON.stringify({ message: "User " + vendorId + " is not a vendor" })
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
async function getVendorDeliveries(event) {
    let vendorId = getUserFromJwt_1.getUserInfoFromEvent(event);
    if (!event.queryStringParameters) {
        return {
            statusCode: 400,
            body: '{ "message" : "Missing parameter time" }'
        };
    }
    let start = event.queryStringParameters["start"];
    let end = event.queryStringParameters["end"];
    let summary = event.queryStringParameters["summary"];
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
    let deliveries = await dbUtils_1.getAllDeliveriesFromAllSubscribers(vendorId, start, end);
    if (summary && summary == "true") {
        return {
            statusCode: 200,
            body: JSON.stringify(generateSummary(deliveries))
        };
    }
    return {
        statusCode: 200,
        body: JSON.stringify(deliveries)
    };
}
function generateSummary(deliveries) {
    let hash = new Map();
    deliveries.forEach((del) => {
        let summary = hash.get(del.deliverytime);
        if (!summary) {
            summary = {
                menuId: del.menuId,
                date: del.deliverytime,
                count: 0
            };
            hash.set(del.deliverytime, summary);
        }
        summary.count++;
    });
    let array = [];
    for (let k of hash) {
        array.push(k[1]);
    }
    return array;
}
exports.mainHandler = middy_1.default(handler).use(http_cors_1.default());
async function postVendorDeliveries(event) {
    let vendorId = getUserFromJwt_1.getUserInfoFromEvent(event);
    if (!event.queryStringParameters) {
        return {
            statusCode: 400,
            body: '{ "message" : "Missing parameters date, no and userId" }'
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
    if (!date.endsWith("Z")) {
        return {
            statusCode: 400,
            body: '{ "message" : "Parameter time must be YYYY-MM-DDTHH:MM:SS.MMMZ" }'
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
    let deliveries = await addDeliveries_1.generateDeliveries(startDate, userId, vendorId, noOfDeliveries);
    await dbUtils_1.saveDeliveriesToDb(deliveries);
    return {
        statusCode: 200,
        body: JSON.stringify(deliveries)
    };
}
//# sourceMappingURL=vendorDeliveries.js.map