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
        return getUserprofile(event);
    }
    if (event.httpMethod == "PUT") {
        return putUserprofile(event);
    }
    if (event.httpMethod == "DELETE") {
        return deleteUserprofile(event);
    }
}
exports.mainHandler = middy_1.default(handler).use(http_cors_1.default());
async function getUserprofile(event) {
    let userId = getUserFromJwt_1.getUserInfoFromEvent(event);
    let userprofile = await dbUtils_1.getUserprofileFromDb(userId);
    if (!userprofile) {
        return {
            statusCode: 404,
            body: '{ "message" : "No profile for this user" }'
        };
    }
    return {
        statusCode: 200,
        body: JSON.stringify(userprofile)
    };
}
async function putUserprofile(event) {
    let userId = getUserFromJwt_1.getUserInfoFromEvent(event);
    let body = JSON.parse(event.body);
    let userprofile = await dbUtils_1.putUserprofileInDb(body, userId);
    return {
        statusCode: 200,
        body: JSON.stringify(userprofile)
    };
}
async function deleteUserprofile(event) {
    let userId = getUserFromJwt_1.getUserInfoFromEvent(event);
    dbUtils_1.deleteUserprofileInDb(userId);
    return {
        statusCode: 200,
        body: '{ "message" : "Deletion succeeded" }'
    };
}
//# sourceMappingURL=userprofile.js.map